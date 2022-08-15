from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

class WebsocketService:

    @staticmethod
    def get_student_group_name_for_room_id(id: int) -> str:
        """
        Get name of group for student listeners in a room.

        Arguments:
            id: int -- Room ID
        """
        return f"room_{id}_student"

    @staticmethod
    def get_teacher_group_name_for_room_id(id: int) -> str:
        """
        Get name of group for teacher listeners in a room.

        Arguments:
            id: int -- Room ID
        """
        return f"room_{id}_teacher"

    @staticmethod
    def broadcast_updated_room_to_students(room_id: int, serialized_room: dict):
        """
        Broadcast to students that a room has been updated.

        Arguments:
            room_id: int -- Room ID
            serialized_room: dict -- Serialized room to broadcast
        """
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            WebsocketService.get_student_group_name_for_room_id(room_id),
            {
                "type": "event_room_update",
                "room": serialized_room
            }
        )

    @staticmethod
    def broadcast_updated_room_to_teachers(room_id: int, serialized_room: dict):
        """
        Broadcast to teachers that a room has been updated.

        Arguments:
            room_id: int -- Room ID
            serialized_room: dict -- Serialized room to broadcast
        """
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            WebsocketService.get_teacher_group_name_for_room_id(room_id),
            {
                "type": "event_room_update",
                "room": serialized_room
            }
        )

    @staticmethod
    def broadcast_element_activity(room_id: int, element_id: int):
        """
        Broadcast element activity to teacher accounts.

        Arguments:
            room_id: int -- Room ID
            element_id: int -- Element ID of element activity
        """
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            WebsocketService.get_teacher_group_name_for_room_id(room_id),
            {
                "type": "event_element_activity",
                "element_id": element_id,
            }
        )
