from django.urls import path

from . import views

urlpatterns = [
    path("get-datasets", views.getDatasets, name="getDatasets"),
    path("get-dataset/<int:id>", views.getDataset, name="getDataset"),
    path("get-geodata/<int:id>", views.getGeodata, name="getGeodata"),
    path("get-geodatas", views.getGeodatas, name="getGeodatas"),
    path("upload-geo", views.addDataset, name="addDataset"),
    path("get-file", views.getFile, name="getFile"),
    path("current-user", views.current_user, name="currentUser"),
    path("login", views.login_, name="login"),
    path("logout", views.logout_, name="logout"),
    path("register", views.register, name="register"),
    path("upload-preset", views.addPreset, name="addPreset"),
    path("check-dataset-auth", views.checkDatasetAuth, name="checkDatasetAuth"),
    path("delete-account", views.delete_, name="delete"),
    path("delete-dataset", views.deleteDataset, name="deleteDataset"),
    path("user-sets", views.getUserSets, name="getUserSets"),
    path("update-views", views.updateViews, name="updateViews"),
    path("update-saves", views.updateSaves, name="updateSaves"),
    path("delete-preset", views.deletePreset, name="deletePreset"),
    path("update-geo", views.updateDataset, name="updateDataset"),
]