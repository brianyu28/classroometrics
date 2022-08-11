from django.urls import re_path

from .views import home

urlpatterns = [
    # Home
    re_path("^(?P<path>([^/]+/)*)$", home.index, name="index"),
]
