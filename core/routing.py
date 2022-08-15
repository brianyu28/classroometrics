from django.urls import re_path

from .consumers.example_consumer import ExampleConsumer
from .consumers.student_consumer import StudentConsumer

websocket_urlpatterns = [
    re_path(r'ws/example/$', ExampleConsumer.as_asgi()),
    re_path(r'ws/student/(?P<room_id>\d+)$', StudentConsumer.as_asgi()),
]
