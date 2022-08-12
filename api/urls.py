from django.urls import path

from .controllers import authentication_controller as auth

urlpatterns = [

    # Authentication
    path("auth/login", auth.login, name="login"),
    path("auth/logout", auth.logout, name="logout"),
    path("auth/me", auth.me, name="me"),
]
