"""
App configuration for API.
"""

from django.apps import AppConfig


class ApiConfig(AppConfig):
    """
    Configuration for API app.
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "api"
