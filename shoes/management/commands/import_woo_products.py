import csv
import os
import requests
from urllib.parse import urlparse
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.utils.text import slugify
from shoes.models import Product, ProductVariant, Category, ProductImage, Brand

class Command(BaseCommand):
    help = "Import WooCommerce products from CSV"

    def add_arguments(self, parser):
        parser.add_argument('csv_path', type=str, help='Chemin vers le fichier CSV WooCommerce')

    def download_image(self, url, folder='products/images'):
        if not url: return None
        try:
            url = url.strip()
            filename = os.path.basename(urlparse(url).path)
            if not filename: filename = 'image.jpg'
            
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
            response = requests.get(url, timeout=10, headers=headers)
            if response.status_code == 200:
                return filename, ContentFile(response.content)
            else:
                self.stdout.write(self.style.WARNING(f"Erreur HTTP {response.status_code} : {url}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Erreur téléchargement {url} : {e}"))
        return None

    def handle(self, *args, **options):
        csv_path = options['csv_path']
        if not os.path.exists(csv_path): return
        
        products_dict = {}
        
        with open(csv_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            rows = list(reader)
            
            for row in rows:
                row_type = row.get('Type', '').lower()
                woo_id = row.get('ID', '').strip()
                if not woo_id:
                    for k in row.keys():
                        if k and 'ID' in k: woo_id = row[k].strip(); break
                            
                if row_type in ['simple', 'variable']:
                    name = row.get('Nom', '').strip()
                    if not name: continue
                        
                    price_str = row.get('Tarif régulier', '0')
                    if not price_str: price_str = '0'
                    try: price = Decimal(price_str.replace(',', '.'))
                    except: price = Decimal('0')
                        
                    desc = row.get('Description', '').replace('\\n', '\n')
                    short_desc = row.get('Description courte', '').replace('\\n', '\n')[:300]
                    
                    stock_str = row.get('Stock', '')
                    stock = int(stock_str) if stock_str.isdigit() else (100 if row.get('En stock ?') == '1' else 0)
                        
                    product_categories = []
                    cat_str = row.get('Catégories', '')
                    if cat_str:
                        for cat_item in cat_str.split(','):
                            final_cat_name = cat_item.split('>')[-1].strip()
                            if final_cat_name:
                                cat_obj, _ = Category.objects.get_or_create(name=final_cat_name, defaults={'slug': slugify(final_cat_name)})
                                product_categories.append(cat_obj)
                                
                    base_slug = slugify(name)[:180]
                    unique_slug = f"{base_slug}-{woo_id}" if woo_id else base_slug
                    
                    product, _ = Product.objects.update_or_create(
                        slug=unique_slug,
                        defaults={'name': name, 'description': desc, 'short_description': short_desc, 'price': price, 'stock': stock}
                    )
                    
                    if product_categories: product.categories.set(product_categories)
                    brand_name = row.get('Marques', '').strip()
                    if brand_name:
                        brand_slug = slugify(brand_name)
                        brand_obj, _ = Brand.objects.get_or_create(name=brand_name, defaults={'slug': brand_slug})
                        product.brand = brand_obj
                        product.save(update_fields=['brand'])

                    products_dict[woo_id] = product
                    
                    images_str = row.get('Images', '')
                    if images_str and not product.thumbnail:
                        image_urls = [u.strip() for u in images_str.split(',')]
                        if image_urls:
                            dl = self.download_image(image_urls[0], 'products/thumbnails')
                            if dl:
                                product.thumbnail.save(dl[0], dl[1], save=True)
                            for idx, sec_url in enumerate(image_urls[1:]):
                                dl_sec = self.download_image(sec_url, 'products/images')
                                if dl_sec:
                                    p_img = ProductImage(product=product, order=idx+1)
                                    p_img.image.save(dl_sec[0], dl_sec[1], save=True)
                                    
            for row in rows:
                if row.get('Type', '').lower() == 'variation':
                    parent_id = row.get('Parent', '').replace('id:', '').strip()
                    parent_product = products_dict.get(parent_id)
                    if not parent_product: continue
                    
                    attr_val1 = attr_val2 = ""
                    for k, v in row.items():
                        if k:
                            if "Valeur(s) de l" in k and "1" in k: attr_val1 = v.strip()
                            elif "Valeur(s) de l" in k and "2" in k: attr_val2 = v.strip()
                            
                    variant_parts = [a for a in [attr_val1, attr_val2] if a]
                    variant_name = " - ".join(variant_parts) if variant_parts else row.get('Nom', '').split(' - ')[-1].strip()
                        
                    v_price_str = row.get('Tarif régulier', '')
                    v_price = None
                    if v_price_str:
                        try: v_price = Decimal(v_price_str.replace(',', '.'))
                        except: pass
                    
                    if v_price and parent_product.price == 0:
                        parent_product.price = v_price
                        parent_product.save(update_fields=['price'])
                        
                    stock_str = row.get('Stock', '')
                    stock = int(stock_str) if stock_str.isdigit() else (100 if row.get('En stock ?') == '1' else 0)
                        
                    variant, _ = ProductVariant.objects.update_or_create(
                        product=parent_product,
                        name=variant_name,
                        defaults={'price': v_price if v_price != parent_product.price else None, 'stock': stock}
                    )
                    
                    v_images_str = row.get('Images', '')
                    if v_images_str and not variant.image:
                        dl = self.download_image(v_images_str.split(',')[0].strip(), 'products/variants')
                        if dl: variant.image.save(dl[0], dl[1], save=True)

        self.stdout.write(self.style.SUCCESS("Terminé !"))
