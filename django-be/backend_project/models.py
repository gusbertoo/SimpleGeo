# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models

class Admins(models.Model):
    username = models.CharField(primary_key=True, max_length=30)
    email = models.CharField(unique=True, max_length=255)
    password = models.CharField(max_length=255)
    
    def __str__(self):
        return self.username + ' ' + self.email + ' ' + self.password

    class Meta:
        managed = False
        db_table = 'admins'

class Datasets(models.Model):
    set_id = models.AutoField(primary_key=True)
    username = models.ForeignKey(Admins, models.DO_NOTHING, db_column='username')
    geodata = models.ForeignKey('Geodata', models.DO_NOTHING, blank=True, null=True)
    dataset = models.JSONField()
    title = models.CharField(max_length=30)
    description = models.CharField(max_length=255, blank=True, null=True)
    upload = models.DateTimeField(auto_now_add=True)
    update = models.DateTimeField(auto_now_add=True)
    public = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'datasets'
        
class Geodata(models.Model):
    geodata_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    geodata = models.JSONField()

    class Meta:
        managed = False
        db_table = 'geodata'


class SpatialRefSys(models.Model):
    srid = models.IntegerField(primary_key=True)
    auth_name = models.CharField(max_length=256, blank=True, null=True)
    auth_srid = models.IntegerField(blank=True, null=True)
    srtext = models.CharField(max_length=2048, blank=True, null=True)
    proj4text = models.CharField(max_length=2048, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'spatial_ref_sys'
