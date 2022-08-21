"""
Websocket consumer for student room view.
"""

import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from core.services.websocket_service import WebsocketService


class StudentConsumer(WebsocketConsumer):
    """
    Websocket consumer for student room view.
    """

    def __init__(self, *args, **kwargs):
        """
        Initialize student websocket consumer.
        """
        super().__init__(self, *args, **kwargs)
        self.room_id = None
        self.group_name = None

    def connect(self):
        """
        Establish student websocket connection.
        """
        room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_id = room_id
        self.group_name = WebsocketService.get_student_group_name_for_room_id(room_id)
        async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)
        self.accept()

    def disconnect(self, code):
        """
        Disconnect student websocket connection.
        """
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name, self.channel_name
        )

    def receive(self, text_data=None, bytes_data=None):
        """
        Receive event from student.
        """
        data = json.loads(text_data)
        if data.get("type") == "event_element_activity":
            element_id = data.get("element", {}).get("id", None)
            if element_id is None:
                return
            WebsocketService.broadcast_element_activity(self.room_id, element_id)
        elif data.get("type") == "event_question":
            question = data.get("question")
            if question is None:
                return
            WebsocketService.broadcast_question(self.room_id, question)

    def event_room_update(self, event: dict):
        """
        Broadcast to student listeners that room has updated.
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
