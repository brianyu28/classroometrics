from django.test import TestCase

from core.services.websocket_service import WebsocketService


class WebsocketServiceTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        pass

    def test_get_student_group_name_for_room_id(self):
        # Arrange
        test_room_id = 28

        # Act
        result = WebsocketService.get_student_group_name_for_room_id(test_room_id)

        # Assert
        self.assertEqual(result, "room_28_student")

    def test_get_teacher_group_name_for_room_id(self):
        # Arrange
        test_room_id = 28

        # Act
        result = WebsocketService.get_teacher_group_name_for_room_id(test_room_id)

        # Assert
        self.assertEqual(result, "room_28_teacher")
