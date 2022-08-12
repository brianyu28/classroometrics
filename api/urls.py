from django.urls import path

from .controllers import authentication_controller as auth
from .controllers import dashboard_controller as dashboard

urlpatterns = [

    # Authentication
    path("auth/login", auth.login, name="login"),
    path("auth/logout", auth.logout, name="logout"),
    path("auth/me", auth.me, name="me"),

    # Dashboard
    path("dashboards", dashboard.dashboards, name="dashboards"),
]
