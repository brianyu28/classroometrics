"""
Websocket consumer for teacher room view.
"""

import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from core.services.room_service import RoomService
from core.services.websocket_service import WebsocketService


class TeacherConsumer(WebsocketConsumer):
    """
    Websocket consumer for teacher room view.
    """

    def __init__(self, *args, **kwargs):
        """
        Initialize teacher websocket consumer.
        """
        super().__init__(self, *args, **kwargs)
        self.room_id = None
        self.user = None
        self.group_name = None

    def connect(self):
        """
        Establish teacher websocket connection.
        """
        # Verify that room exists
        room_id = self.scope["url_route"]["kwargs"]["room_id"]
        room = RoomService.get_room_by_id(room_id)
        if room is None:
            return

        # Only the owner of the room can join the teacher group
        self.user = self.scope["user"]
        if self.user.id != room.id:
            return

        self.group_name = WebsocketService.get_teacher_group_name_for_room_id(room_id)
        async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)
        self.accept()

    def disconnect(self, code):
        """
        Disconnect teacher websocket connection.
        """
        if self.group_name is not None:
            async_to_sync(self.channel_layer.group_discard)(
                self.group_name, self.channel_name
            )

    def event_room_update(self, event: dict):
        """
        Broadcast to teacher that room has updated.
        """
        room = event["room"]
        self.send(
            text_data=json.dumps(
                {
                    "type": "event_room_update",
                    "room": room,
                }
            )
        )

    def event_element_activity(self, event: dict):
        """
        Broadcast to teacher that element interaction took place.
        """
        element_id = event["element_id"]
        self.send(
            text_data=json.dumps(
                {
                    "type": "event_element_activity",
                    "element_id": element_id,
                }
            )
        )

    def event_question(self, event: dict):
        """
        Broadcast to teacher that new question asked.
        """
        question = event["question"]
        self.send(
            text_data=json.dumps(
                {
                    "type": "event_question",
                    "question": question,
                }
            )
        )
