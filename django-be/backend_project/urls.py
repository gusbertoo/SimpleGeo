from django.urls import path

from . import views

urlpatterns = [
    path("get-datasets", views.getDatasets, name="getDatasets"),
    path("get-dataset/<int:id>", views.getDataset, name="getDataset"),
    path("get-geodata/<int:id>", views.getGeodata, name="getGeodata"),
    path("get-geodatas", views.getGeodatas, name="getGeodatas"),
    path("add-dataset", views.addDataset, name="addDataset"),
    path("get-file", views.getFile, name="getFile"),
    path("login", views.login, name="login"),
]