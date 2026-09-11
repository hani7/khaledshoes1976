import os
import sys

# Ajout du dossier au chemin système pour trouver le module 'khaled'
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Définir le module de paramètres Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'khaled.settings')

# Démarrer l'application WSGI
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
