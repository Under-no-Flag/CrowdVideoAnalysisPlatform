
import django
import os
import sys


sys.path.append("../")
from django.test import Client

if __name__=="__main__":
    
    os.environ['DJANGO_SETTINGS_MODULE'] = 'DjangoServer.settings'
    django.setup()


    c = Client()
    response = c.get("/get_videos/")
    print(response.json())