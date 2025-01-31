"""
Views for core app.
"""

from django.http import HttpResponse
from django.http.request import HttpRequest
from django.shortcuts import render
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import ensure_csrf_cookie

from core.services.room_service import RoomService


# pylint: disable=unused-argument
def index(request: HttpRequest, path: str) -> HttpResponse:
    """
    Access management app for teachers.
    """
    return render(request, "core/index.html")


@ensure_csrf_cookie
@xframe_options_exempt
def viewer(request: HttpRequest, identifier: str) -> HttpResponse:
    """
    Access student view for room.
    """
    room = RoomService.get_room_by_identifier(identifier)
    return render(
        request,
        "core/viewer.html",
        {
            "title": (room.title or "Classroometrics") if room else "Classroometrics",
            "room_id": room.id if room else None,
        },
    )


@xframe_options_exempt
def activity(request: HttpRequest, identifier: str) -> HttpResponse:
    """
    Access an activity view for room.
    Useful for embedding the activity in an iframe in another page.
    """
    room = RoomService.get_room_by_identifier(identifier)
    return render(
        request,
        "core/activity.html",
        {
            "title": (room.title or "Classroometrics") if room else "Classroometrics",
            "room_identifier": room.identifier if room else None,
        },
    )
