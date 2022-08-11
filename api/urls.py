from django.urls import path

from .controllers import authentication_controller as auth

urlpatterns = [

    # Authentication
    path("auth/login", auth.login, name="login"),
]
