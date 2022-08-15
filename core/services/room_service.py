from typing import List
from core.models import Element, Room, User
from core.services.element_service import ElementService
from core.services.websocket_service import WebsocketService

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
    def get_room_for_user_by_identifier(identifier: str, user: User) -> Room | None:
        """
        Return a room based on identifier, belonging to a particular user.

        Arguments:
            identifier: str -- Room identifier
            user: User -- User making the request

        Returns:
            Room | None -- Room if it exists and authorized, otherwise None
        """
        room = RoomService.get_room_by_identifier(identifier)
        if room is None or room.owner != user:
            return None
        return room

    @staticmethod
    def get_room_by_id(id: int) -> Room | None:
        """
        Return a room based on its id.

        Arguments:
            id: int -- Room ID

        Returns:
            Room | None -- Room if it exists, or None
        """
        try:
            return Room.objects.get(pk=id)
        except Room.DoesNotExist:
            return None

    @staticmethod
    def get_room_for_user_by_id(id: int, user: User) -> Room | None:
        """
        Return a room based on identifier, belonging to a particular user.

        Arguments:
            id: int -- Room ID
            user: User -- User making the request

        Returns:
            Room | None -- Room if it exists and authorized, otherwise None
        """
        room = RoomService.get_room_by_id(id)
        if room is None or room.owner != user:
            return None
        return room

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

    @staticmethod
    def broadcast_update(room: Room):
        """
        Broadcast update to room to student listeners.

        Arguments:
            room: Room -- Room update to broadcast
        """
        WebsocketService.broadcast_updated_room_to_students(
            room.id,
            RoomService.serialize_room(room, visible_only=True)
        )
        WebsocketService.broadcast_updated_room_to_teachers(
            room.id,
            RoomService.serialize_room(room, visible_only=False)
        )

    @staticmethod
    def update_room(room: Room, updated_room: dict, broadcast: bool = True):
        """
        Update a room based on a request body.

        Arguments:
            room: Room - The room to update
            updated_room: dict - Updated room, in serialized form

        Optional arguments:
            broadcast: bool -- Whether to broadcast to websocket listeners, default True
        """
        if "title" in updated_room:
            room.title = updated_room["title"]
            room.save()

        if "groups" in updated_room:
            # Get the possible elements to update
            elements = ElementService.get_elements_for_room(room)
            element_map = dict()
            for element in elements:
                element_map[element.id] = element

            # Update all existing elements
            for section_number, section in enumerate(updated_room["groups"]):
                for order_number, updated_element in enumerate(section):

                    # Updated element must include section and order number
                    updates = updated_element.copy()
                    updates["section"] = section_number
                    updates["order"] = order_number

                    # If there is no ID, then create a new element
                    if "id" not in updated_element:
                        ElementService.create_element_from_dict(room, updates)
                        continue

                    # Make sure the element is one of the elements in the room
                    element = element_map.get(updated_element["id"])
                    if element is None:
                        continue

                    # Update the element and mark it as updated
                    ElementService.update_element(element, updates)
                    del element_map[element.id]

            # Remove elements that weren't included in update
            for element_id in element_map:
                element = element_map[element_id]
                ElementService.delete_element(element)

        if broadcast:
            RoomService.broadcast_update(room)
