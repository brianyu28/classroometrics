"""
URL configuration for /api
"""

from django.urls import path

from .controllers import authentication_controller as auth
from .controllers import room_controller as room

urlpatterns = [

    # Authentication
    path("auth/login", auth.login, name="login"),
    path("auth/logout", auth.logout, name="logout"),
    path("auth/me", auth.current_user, name="me"),

    # Rooms
    path("rooms", room.rooms, name="rooms"),
    path("rooms/<int:room_id>", room.room_update, name="room_update"),
    path("teacher/rooms/<str:room_identifier>", room.room_by_identifier, name="room_by_identifier"),
    path("student/rooms/<int:room_id>", room.room_viewer, name="room_viewer"),
]
