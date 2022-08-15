import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from ..services.room_service import RoomService

from core.services.websocket_service import WebsocketService

class TeacherConsumer(WebsocketConsumer):

    def connect(self):
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
        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )

    def event_room_update(self, event):
        room = event["room"]
        self.send(text_data=json.dumps({
            "type": "event_room_update",
            "room": room,
        }))

    def event_element_activity(self, event):
        element_id = event["element_id"]
        self.send(text_data=json.dumps({
            "type": "event_element_activity",
            "element_id": element_id,
        }))
