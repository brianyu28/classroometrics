"""
Admin site configuration for core app.
"""

from django.contrib import admin

from core.models import Room, Element, User, UserToken

admin.site.register(User)
admin.site.register(UserToken)
admin.site.register(Room)
admin.site.register(Element)
