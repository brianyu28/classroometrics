from django.shortcuts import HttpResponse, render

from core.services.room_service import RoomService

def index(request, path):
    return render(request, "core/index.html")

def viewer(request, identifier):
    room = RoomService.get_room_by_identifier(identifier)
    if room is None:
        return HttpResponse("Classroom not found.")
    return render(request, "core/viewer.html", {"identifier": identifier})
