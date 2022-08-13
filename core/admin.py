from django.contrib import admin

from core.models import Dashboard, Element, User, UserToken

# Register your models here.
admin.site.register(User)
admin.site.register(UserToken)
admin.site.register(Dashboard)
admin.site.register(Element)
