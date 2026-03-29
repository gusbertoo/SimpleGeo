from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

class Dataset(models.Model):
    set_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dataset = models.JSONField()
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=255, blank=True, null=True)
    upload = models.DateTimeField(auto_now_add=True)
    update = models.DateTimeField(auto_now=True)
    public = models.BooleanField(default=False)
    views = models.IntegerField(default=0)
    saves = models.IntegerField(default=0)
        
class PresetGeo(models.Model):
    geo_id = models.AutoField(primary_key=True)
    user = user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    geodata = models.JSONField()
    usage = models.IntegerField(default=0)