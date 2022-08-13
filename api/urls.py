from django.urls import path

from .controllers import authentication_controller as auth
from .controllers import room_controller as room

urlpatterns = [

    # Authentication
    path("auth/login", auth.login, name="login"),
    path("auth/logout", auth.logout, name="logout"),
    path("auth/me", auth.me, name="me"),

    # Rooms
    path("rooms", room.rooms, name="rooms"),
    path("rooms/view/<int:room_id>", room.room_viewer, name="room_viewer"),
]
