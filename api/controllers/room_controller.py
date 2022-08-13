from sqlite3 import IntegrityError
from django.http import JsonResponse
from django.http.request import HttpRequest
from django.views.decorators.http import require_http_methods

from core.models import User
from core.services.room_service import RoomException, RoomService

from api.util import api_error, parse_json, require_authentication, require_fields

@require_http_methods(["GET", "POST"])
@parse_json()
@require_fields(["identifier", "title"])
@require_authentication
def rooms(user: User, request: HttpRequest, body: dict) -> JsonResponse:
    """
    GET
    Get all rooms for user.

    POST
    Create a new room.

    Request parameters:
        identifier: str -- Room identifier
        title: str -- Room title

    Optional request parameters:
        populate_default: bool -- Whether to populate room with default elements, default True
    """
    if request.method == "GET":
        rooms = RoomService.get_rooms_for_user(user)
        return JsonResponse([
            room.serialize()
            for room in rooms
        ], safe=False)

    elif request.method == "POST":
        identifier = body["identifier"]
        title = body["title"]
        populate_default = body.get("populate_default", True)

        try:
            room = RoomService.create_room(user, identifier, title, populate_default)
        except IntegrityError:
            return api_error("Room identifier already in use.")
        except RoomException:
            return api_error("Room identifier cannot be blank.")
        return JsonResponse(room.serialize())


def room_viewer(request: HttpRequest, identifier: str) -> JsonResponse:
    """
    Get the current visible state of the room for a student.
    """
    room = RoomService.get_room_by_identifier(identifier)
    if room is None:
        return api_error("No such room")
    return JsonResponse(RoomService.serialize_room(room, visible_only=True))

