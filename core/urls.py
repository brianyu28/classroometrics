"""
URL configuration for core app.
"""

from django.urls import path, re_path

from . import views

urlpatterns = [
    # Home
    path("view/<str:identifier>/", views.viewer, name="viewer"),
    path("activity/<str:identifier>/", views.activity, name="activity"),
    re_path("^(?P<path>([^/]+/)*)$", views.index, name="index"),
]
