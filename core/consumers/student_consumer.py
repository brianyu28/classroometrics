import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from core.services.websocket_service import WebsocketService

class StudentConsumer(WebsocketConsumer):

    def connect(self):
        room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_id = room_id
        self.group_name = WebsocketService.get_student_group_name_for_room_id(room_id)
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

    def receive(self, text_data):
        data = json.loads(text_data)
        if data.get("type") == "event_element_activity":
            element_id = data.get("element", {}).get("id", None)
            if element_id is None:
                return
            WebsocketService.broadcast_element_activity(self.room_id, element_id)

    def event_room_update(self, event):
        room = event["room"]
        self.send(text_data=json.dumps({
            "type": "event_room_update",
            "room": room,
        }))
