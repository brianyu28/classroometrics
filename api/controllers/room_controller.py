"""
API controller for room requests.
"""

from sqlite3 import IntegrityError

from django.http import JsonResponse
from django.http.request import HttpRequest
from django.views.decorators.http import require_http_methods

from api.util import api_error, parse_json, require_authentication, require_fields
from core.models import User
from core.services.room_service import RoomException, RoomService


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
        user_rooms = RoomService.get_rooms_for_user(user)
        return JsonResponse([room.serialize() for room in user_rooms], safe=False)

    if request.method == "POST":
        identifier = body["identifier"]
        title = body["title"]
        populate_default = body.get("populate_default", True)

        try:
            room = RoomService.create_room(user, identifier, title, populate_default)
        except IntegrityError:
            return api_error("Room identifier already in use")
        except RoomException:
            return api_error("Room identifier cannot be blank")
        return JsonResponse(room.serialize())

    return api_error("Invalid request method")


@require_http_methods(["PUT"])
@parse_json()
@require_authentication
def room_update(
    user: User, request: HttpRequest, body: dict, room_id: int
) -> JsonResponse:
    """
    Update room.

    Request parameters:
        room: dict -- Updated room details
    """
    room = RoomService.get_room_for_user_by_id(room_id, user)
    if room is None:
        return api_error("No such room")

    # Update room
    if request.method == "PUT":
        RoomService.update_room(room, body.get("room", {}))
        return JsonResponse(RoomService.serialize_room(room, visible_only=False))

    return api_error("Invalid request method")


# pylint: disable=unused-argument
def room_viewer(request: HttpRequest, room_id: int) -> JsonResponse:
    """
    Get the current visible state of the room for a student.
    """
    room = RoomService.get_room_by_id(room_id)
    if room is None:
        return api_error("No such room")
    return JsonResponse(RoomService.serialize_room(room, visible_only=True))


@require_http_methods(["GET"])
@require_authentication
# pylint: disable=unused-argument
def room_by_identifier(
    user: User, request: HttpRequest, room_identifier: str
) -> JsonResponse:
    """
    Get the room for a teacher by its identifier.
    """
    room = RoomService.get_room_for_user_by_identifier(room_identifier, user)
    if room is None:
        return api_error("No such room")
    return JsonResponse(RoomService.serialize_room(room, visible_only=False))
