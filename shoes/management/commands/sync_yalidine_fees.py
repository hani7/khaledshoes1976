import time
import requests
from django.core.management.base import BaseCommand
from django.conf import settings
from shoes.models import DeliveryCompany, DeliveryRate

class Command(BaseCommand):
    help = 'Synchronise les tarifs de livraison (DeliveryRate) depuis l\'API Yalidine'

    def add_arguments(self, parser):
        parser.add_argument(
            '--from-wilaya',
            type=int,
            default=16,
            help='ID de la Wilaya d\'expédition (16 = Alger par défaut)'
        )

    def handle(self, *args, **options):
        from_wilaya = options['from_wilaya']
        
        # Check credentials
        api_id = getattr(settings, 'YALIDINE_API_ID', None)
        api_token = getattr(settings, 'YALIDINE_API_TOKEN', None)
        
        if not api_id or not api_token:
            self.stderr.write(self.style.ERROR('YALIDINE_API_ID et YALIDINE_API_TOKEN non configurés.'))
            return
            
        headers = {
            'X-API-ID': api_id,
            'X-API-TOKEN': api_token
        }
        
        # Récupérer ou créer la compagnie Yalidine
        company, created = DeliveryCompany.objects.get_or_create(
            name='Yalidine',
            defaults={'is_active': True}
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Création de la compagnie de livraison Yalidine dans la base.'))
        
        base_url = getattr(settings, 'YALIDINE_BASE_URL', 'https://api.yalidine.app/v1/').rstrip('/')
        
        # Étape 1 : Récupérer toutes les wilayas
        self.stdout.write(f'Récupération des wilayas depuis {base_url}/wilayas/ ...')
        wilayas_data = []
        try:
            res = requests.get(f"{base_url}/wilayas/?page_size=100", headers=headers, timeout=10)
            res.raise_for_status()
            wilayas_data = res.json().get('data', [])
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Erreur lors de la récupération des wilayas: {e}'))
            return
            
        if not wilayas_data:
            self.stderr.write(self.style.WARNING('Aucune wilaya retournée.'))
            return
            
        self.stdout.write(self.style.SUCCESS(f'{len(wilayas_data)} Wilayas trouvées. Synchronisation des tarifs...'))
        
        count_updated = 0
        count_created = 0
        
        # Étape 2 : Pour chaque wilaya, récupérer le tarif depuis from_wilaya
        for w in wilayas_data:
            to_wilaya_id = w['id']
            wilaya_name = w['name']
            
            fee_url = f"{base_url}/fees/?from_wilaya_id={from_wilaya}&to_wilaya_id={to_wilaya_id}"
            
            try:
                # Rate limit: 5 req/s max, we do 0.25 to be safe (~4 req/s)
                time.sleep(0.25)
                
                res_fee = requests.get(fee_url, headers=headers, timeout=10)
                if res_fee.status_code == 200:
                    fee_data = res_fee.json()
                    per_commune = fee_data.get('per_commune', {})
                    if per_commune:
                        # Chercher la commune chef-lieu (nom = nom wilaya) ou prendre la première
                        chef_lieu_fee = None
                        for c_id, c_data in per_commune.items():
                            if c_data.get('commune_name', '').lower() == wilaya_name.lower():
                                chef_lieu_fee = c_data
                                break
                        if not chef_lieu_fee:
                            chef_lieu_fee = list(per_commune.values())[0]

                        price_home = chef_lieu_fee.get('express_home') or 0
                        price_desk = chef_lieu_fee.get('express_desk') or 0
                        
                        rate, rate_created = DeliveryRate.objects.update_or_create(
                            company=company,
                            wilaya_name=wilaya_name,
                            defaults={
                                'price_home': price_home,
                                'price_desk': price_desk
                            }
                        )
                        if rate_created:
                            count_created += 1
                        else:
                            count_updated += 1
                            
                        self.stdout.write(f'[{wilaya_name}] Domicile: {price_home} DA | Stopdesk: {price_desk} DA')
                else:
                    self.stderr.write(self.style.WARNING(f'Erreur {res_fee.status_code} pour la wilaya {wilaya_name}'))
            except Exception as e:
                self.stderr.write(self.style.ERROR(f'Erreur pour {wilaya_name}: {e}'))
                
        self.stdout.write(self.style.SUCCESS(
            f'Synchronisation terminée. {count_created} tarifs créés, {count_updated} tarifs mis à jour.'
        ))
