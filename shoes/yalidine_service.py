"""
Yalidine Algeria Delivery API Service
Wraps Yalidine API calls: authentication, shipment creation, tracking, cancellation.
"""

import os
import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

YALIDINE_BASE_URL = getattr(settings, 'YALIDINE_BASE_URL', 'https://api.yalidine.app/v1/')
YALIDINE_API_ID = getattr(settings, 'YALIDINE_API_ID', '') or ''
YALIDINE_API_TOKEN = getattr(settings, 'YALIDINE_API_TOKEN', '') or ''

def _auth_headers():
    return {
        'X-API-ID': YALIDINE_API_ID,
        'X-API-TOKEN': YALIDINE_API_TOKEN,
        'Content-Type': 'application/json'
    }

_YALIDINE_CENTERS_CACHE = None

def get_stopdesk_id(wilaya_name, commune_name):
    global _YALIDINE_CENTERS_CACHE
    if _YALIDINE_CENTERS_CACHE is None:
        url = "https://api.yalidine.app/v1/centers/?page_size=500"
        try:
            r = requests.get(url, headers=_auth_headers(), timeout=10)
            if r.status_code == 200:
                _YALIDINE_CENTERS_CACHE = r.json().get('data', [])
            else:
                _YALIDINE_CENTERS_CACHE = []
        except Exception as e:
            logger.error(f"Erreur fetch Yalidine centers: {e}")
            _YALIDINE_CENTERS_CACHE = []
            
    if not _YALIDINE_CENTERS_CACHE:
        return None
        
    w_lower = wilaya_name.lower().strip()
    c_lower = commune_name.lower().strip()
    
    wilaya_centers = [c for c in _YALIDINE_CENTERS_CACHE if c.get('wilaya_name', '').lower().strip() == w_lower]
    if not wilaya_centers:
        return None
        
    # Essayer de trouver la commune exacte
    for c in wilaya_centers:
        if c.get('commune_name', '').lower().strip() == c_lower:
            return c.get('center_id')
            
    # Fallback au premier centre de la wilaya
    return wilaya_centers[0].get('center_id')

def create_shipment(order):
    """
    Crée un colis dans Yalidine.
    Retourne { 'success': True, 'tracking': '...', 'label': '...' } ou { 'error': 'message' }
    """
    if not YALIDINE_API_ID or not YALIDINE_API_TOKEN:
        return {'error': 'Les identifiants API Yalidine ne sont pas configurés.'}
        
    url = f"{YALIDINE_BASE_URL.rstrip('/')}/parcels/"
    
    # Prépare les données du colis
    customer_name = order.guest_name or (order.customer.name if order.customer else '') or 'Client Piové'
    parts = customer_name.split(' ', 1)
    firstname = parts[0] if parts else 'Client'
    familyname = parts[1] if len(parts) > 1 else 'Piové'
    
    try:
        from .yalidine_mapping import COMMUNE_MAPPING
    except ImportError:
        COMMUNE_MAPPING = {}
        
    def strip_accents_and_lower(s):
        import unicodedata
        s = str(s).strip().lower()
        return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
        
    raw_wilaya = getattr(order, 'wilaya', 'Alger') or 'Alger'
    raw_commune = getattr(order, 'city', '') or raw_wilaya
    
    w_clean = strip_accents_and_lower(raw_wilaya)
    c_clean = strip_accents_and_lower(raw_commune)
    
    # Try exact match Wilaya + Commune, then fallback to just Commune
    mapped_data = COMMUNE_MAPPING.get(f"{w_clean}-{c_clean}") or COMMUNE_MAPPING.get(c_clean)
    
    if mapped_data and isinstance(mapped_data, dict):
        wilaya = mapped_data['wilaya']
        commune = mapped_data['commune']
    else:
        wilaya = raw_wilaya
        commune = raw_commune
    address = order.shipping_address or commune or 'Alger'
    
    phone = getattr(order, 'guest_phone', '')
    if order.customer and getattr(order.customer, 'profile', None) and not phone:
        phone = order.customer.profile.phone
    phone = phone or '0000000000'
    
    # Description des produits
    items = []
    for line in order.items.all():
        items.append(f"{line.quantity}x {line.product_name}")
    product_list = ", ".join(items)[:200]
    
    # Montant à recouvrer
    if order.payment_method == 'cib':
        # Le client a payé les produits, il ne reste que la livraison à payer
        price = int(float(order.delivery_cost))
        freeshipping = True # Pour ne pas que Yalidine ajoute ses propres frais par dessus
    else:
        # Paiement à la livraison: on envoie le prix des produits, Yalidine ajoutera ses frais automatiquement
        price = int(float(order.total - order.delivery_cost))
        if price < 0:
            price = 0
        freeshipping = False
    
    # Livraison à domicile ou stopdesk
    is_stopdesk = (order.delivery_type == 'desk')
    stopdesk_id = None
    
    if is_stopdesk:
        stopdesk_id = get_stopdesk_id(wilaya, commune)
        if not stopdesk_id:
            return {'error': f"Aucun point de retrait Stopdesk trouvé pour la wilaya '{wilaya}'. Impossible de créer l'expédition en mode Stopdesk."}
        
    payload_item = {
        "order_id": str(order.id),
        "firstname": firstname,
        "familyname": familyname,
        "contact_phone": phone,
        "address": address,
        "to_commune_name": commune,
        "to_wilaya_name": wilaya,
        "product_list": product_list,
        "price": price,
        "freeshipping": freeshipping,
        "is_stopdesk": is_stopdesk,
        "has_exchange": 0,
        "product_to_collect": None
    }
    
    if is_stopdesk and stopdesk_id:
        payload_item["stopdesk_id"] = stopdesk_id
        
    payload = [payload_item]
    
    try:
        res = requests.post(url, headers=_auth_headers(), json=payload, timeout=15)
        res_data = res.json()
        
        if res.status_code in [200, 201]:
            # Yalidine returns a dictionary keyed by order_id
            order_id_str = str(order.id)
            if order_id_str in res_data:
                item_res = res_data[order_id_str]
                if item_res.get('success'):
                    return {
                        'success': True,
                        'tracking': item_res.get('tracking'),
                        'label': item_res.get('label')
                    }
                else:
                    return {'error': item_res.get('message', 'Erreur inconnue Yalidine')}
            elif "tracking" in res_data:
                # Fallback
                return {
                    'success': True,
                    'tracking': res_data.get('tracking'),
                    'label': res_data.get('label')
                }
            else:
                # Look for the first key if order_id didn't match somehow
                if res_data and isinstance(res_data, dict):
                    first_key = list(res_data.keys())[0]
                    item_res = res_data[first_key]
                    if isinstance(item_res, dict) and 'success' in item_res:
                        if item_res.get('success'):
                            return {
                                'success': True,
                                'tracking': item_res.get('tracking'),
                                'label': item_res.get('label')
                            }
                        else:
                            return {'error': item_res.get('message', 'Erreur inconnue Yalidine')}
                            
                return {'error': f"Format de réponse inattendu: {res_data}"}
                
        # En cas d'erreur
        error_msg = res_data.get('error', 'Erreur de création de colis')
        return {'error': str(error_msg)}
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Yalidine create_shipment error: {e}")
        return {'error': f"Erreur de communication avec Yalidine: {str(e)}"}

def track_shipment(tracking_code):
    """
    Récupère l'historique de suivi d'un colis.
    Retourne { 'success': True, 'tracking': [...] } ou { 'error': 'message' }
    """
    url = f"{YALIDINE_BASE_URL.rstrip('/')}/histories/?tracking={tracking_code}"
    
    try:
        res = requests.get(url, headers=_auth_headers(), timeout=10)
        if res.status_code == 200:
            res_data = res.json()
            # Supposons que data contient l'historique
            data = res_data.get('data', [])
            return {'success': True, 'tracking': data}
        else:
            return {'error': f"Erreur {res.status_code} lors du suivi"}
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Yalidine track_shipment error: {e}")
        return {'error': f"Erreur de communication avec Yalidine: {str(e)}"}

def cancel_shipment(tracking_code):
    """
    Annule un colis s'il n'a pas encore été expédié.
    """
    url = f"{YALIDINE_BASE_URL.rstrip('/')}/parcels/{tracking_code}/"
    
    try:
        res = requests.delete(url, headers=_auth_headers(), timeout=10)
        res_data = res.json()
        if res.status_code in [200, 204] or res_data.get('success'):
            return {'success': True}
        else:
            return {'error': res_data.get('error', res_data.get('message', 'Erreur lors de l\'annulation'))}
    except requests.exceptions.RequestException as e:
        logger.error(f"Yalidine cancel_shipment error: {e}")
        return {'error': f"Erreur de communication avec Yalidine: {str(e)}"}
