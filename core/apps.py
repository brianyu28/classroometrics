"""
App configuration for core app.
"""

from django.apps import AppConfig


class CoreConfig(AppConfig):
    """
    Configuration for core app.
    """
    default_auto_field = "django.db.models.BigAutoField"
    name = "core"
