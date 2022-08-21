"""
Root URL configuration.
"""

from django.contrib import admin
from django.shortcuts import redirect
from django.urls import include, path

from . import views

urlpatterns = [
    path('', lambda request: redirect('/app/')),
    path('logout', views.logout),
    path('admin/', admin.site.urls),
    path('api/', include("api.urls")),
    path('app/', include("core.urls")),
]
