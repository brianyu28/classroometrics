from django.contrib import admin

from core.models import Room, Element, User, UserToken

# Register your models here.
admin.site.register(User)
admin.site.register(UserToken)
admin.site.register(Room)
admin.site.register(Element)
