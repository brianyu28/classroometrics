"""
Root URL configuration.
"""

from django.contrib import admin
from django.http.request import HttpRequest
from django.shortcuts import redirect
from django.urls import include, path

from . import views


def redirect_to_viewer(request: HttpRequest, identifier: str):
    return redirect("viewer", identifier=identifier)


urlpatterns = [
    path("", lambda request: redirect("/app/")),
    path("logout", views.logout),
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    path("app/", include("core.urls")),
    path("<str:identifier>", redirect_to_viewer),
]
