from django.shortcuts import HttpResponse, redirect, render

from core.services.room_service import RoomService

def index(request, path):
    return render(request, "core/index.html")

def viewer(request, identifier):
    room = RoomService.get_room_by_identifier(identifier)
    return render(request, "core/viewer.html", {
        "title": (room.title or "Classroometrics") if room else "Classroometrics",
        "room_id": room.id if room else None,
    })
