"""
Views for core app.
"""

from django.http import HttpResponse
from django.http.request import HttpRequest
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie

from core.services.room_service import RoomService


# pylint: disable=unused-argument
def index(request: HttpRequest, path: str) -> HttpResponse:
    """
    Access management app for teachers.
    """
    return render(request, "core/index.html")


@ensure_csrf_cookie
def viewer(request: HttpRequest, identifier: str) -> HttpResponse:
    """
    Access student view for room.
    """
    room = RoomService.get_room_by_identifier(identifier)
    return render(request, "core/viewer.html", {
        "title": (room.title or "Classroometrics") if room else "Classroometrics",
        "room_id": room.id if room else None,
    })
