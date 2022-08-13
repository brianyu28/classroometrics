from typing import List
from core.models import Room, User
from core.services.element_service import ElementService

class RoomException(Exception):
    pass

class RoomService:

    @staticmethod
    def create_room(owner: User, identifier: str, title: str = "", populate_default: bool = True) -> Room:
        """
        Create a new room for a user.

        Arguments:
            owner: User -- User to own the room
            identifier: str -- Unique identifier for the room

        Optional Arguments:
            title: str -- Title for the room, default ""
            populate_default: bool -- Whether to populate room with default elements

        Returns:
            Room: Newly created room

        Raises:
            RoomException: If identifier is blank
            django.db.utils.IntegrityError: If identifier is already in use
        """
        if identifier == "":
            raise RoomException("Identifier must not be blank.")

        room = Room(
            owner=owner,
            identifier=identifier,
            title=title
        )
        room.save()

        if populate_default:
            ElementService.reset_elements_to_default(room)
        return room

    @staticmethod
    def get_rooms_for_user(user: User) -> List[Room]:
        """
        Return a list of all rooms for a user.

        Arguments:
            user: User -- The user to get rooms for

        Returns:
            List[Room] -- List of all rooms owned by the user
        """
        return user.rooms.all()

    @staticmethod
    def get_room_by_identifier(identifier: str) -> Room | None:
        """
        Return a room based on its identifier.

        Arguments:
            identifier: str -- Room identifier

        Returns:
            Room | None -- Room if it exists, or None
        """
        return Room.objects.filter(identifier=identifier).first()

    @staticmethod
    def get_room_by_id(id: int) -> Room | None:
        """
        Return a room based on its id.

        Arguments:
            id: int -- Room ID

        Returns:
            Room | None -- Room if it exists, or None
        """
        return Room.objects.get(pk=id)

    @staticmethod
    def serialize_room(room: Room, visible_only: bool = False) -> dict:
        """
        Serialize a room.

        Arguments:
            room: Room -- The room to serialize

        Optional arguments:
            visible_only: bool -- Whether only the visible elements should be returned, default False
        """
        return room.serialize(visible_only=visible_only)
