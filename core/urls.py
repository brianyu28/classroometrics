from django.urls import path, re_path

from .views import home

urlpatterns = [
    # Home
    path("view/<str:identifier>/", home.viewer, name="viewer"),
    re_path("^(?P<path>([^/]+/)*)$", home.index, name="index"),
]
