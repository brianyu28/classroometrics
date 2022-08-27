from django.test import TestCase
from unittest.mock import Mock, ANY

from core.models import Element, Room, User
from core.services.room_service import RoomService
from core.services.websocket_service import WebsocketService


class RoomServiceTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Arrange: User
        cls.test_username = "test_username"
        cls.test_email = "test_email@example.com"
        cls.test_password = "test_password"
        cls.test_user = User.objects.create_user(
            cls.test_username, cls.test_email, cls.test_password
        )

    def test_create_room(self):
        # Arrange
        room_identifier = "test_room"
        room_title = "Test Room"

        # Act
        room = RoomService.create_room(self.test_user, room_identifier, room_title)

        # Assert
        self.assertIsInstance(room, Room)
        self.assertEqual(room.identifier, room_identifier)
        self.assertEqual(room.title, room_title)
        self.assertNotEqual(room.elements.count(), 0)

    def test_create_room_no_default_population(self):
        # Arrange
        room_identifier = "test_room"
        room_title = "Test Room"

        # Act
        room = RoomService.create_room(
            self.test_user, room_identifier, room_title, populate_default=False
        )

        # Assert
        self.assertIsInstance(room, Room)
        self.assertEqual(room.identifier, room_identifier)
        self.assertEqual(room.title, room_title)
        self.assertEqual(room.elements.count(), 0)

    def test_get_rooms_for_user_when_none(self):
        # Act
        rooms = RoomService.get_rooms_for_user(self.test_user)

        # Assert
        self.assertEqual(len(rooms), 0)

    def test_get_rooms_for_user(self):
        # Arrange
        room_identifier = "test_room"
        room_title = "Test Room"
        room = RoomService.create_room(
            self.test_user, room_identifier, room_title, populate_default=False
        )

        # Act
        rooms = RoomService.get_rooms_for_user(self.test_user)

        # Assert
        self.assertEqual(len(rooms), 1)
        self.assertEqual(rooms[0].identifier, room_identifier)

    def test_get_room_by_identifier_no_match(self):
        # Arrange
        room_identifier = "test_room"
        room_title = "Test Room"
        RoomService.create_room(
            self.test_user, room_identifier, room_title, populate_default=False
        )

        # Act
        room = RoomService.get_room_by_identifier(f"{room_identifier}_invalid")

        # Assert
        self.assertIsNone(room)

    def test_get_room_by_identifier_match(self):
        # Arrange
        room_identifier = "test_room"
        room_title = "Test Room"
        RoomService.create_room(
            self.test_user, room_identifier, room_title, populate_default=False
        )

        # Act
        room = RoomService.get_room_by_identifier(room_identifier)

        # Assert
        self.assertIsInstance(room, Room)
        self.assertEqual(room.identifier, room_identifier)
        self.assertEqual(room.title, room_title)

    def test_get_room_for_user_by_identifier_match(self):
        # Arrange
        room_identifier = "test_room"
        room_title = "Test Room"
        RoomService.create_room(
            self.test_user, room_identifier, room_title, populate_default=False
        )

        # Act
        room = RoomService.get_room_for_user_by_identifier(
            room_identifier, self.test_user
        )

        # Assert
        self.assertIsInstance(room, Room)
        self.assertEqual(room.identifier, room_identifier)
        self.assertEqual(room.title, room_title)

    def test_get_room_for_user_by_identifier_no_match(self):
        # Arrange: Room
        room_identifier = "test_room"
        room_title = "Test Room"
        RoomService.create_room(
            self.test_user, room_identifier, room_title, populate_default=False
        )

        # Arrange: Other User
        other_user = User.objects.create_user(
            "other_username", "other_email@example.com", "other_password"
        )

        # Act
        room = RoomService.get_room_for_user_by_identifier(room_identifier, other_user)

        # Assert
        self.assertIsNone(room)

    def test_get_room_by_id_match(self):
        # Arrange
        room_identifier = "test_room"
        room_title = "Test Room"
        test_room = RoomService.create_room(
            self.test_user, room_identifier, room_title, populate_default=False
        )

        # Act
        room = RoomService.get_room_by_id(test_room.id)

        # Assert
        self.assertIsInstance(room, Room)
        self.assertEqual(room.identifier, room_identifier)
        self.assertEqual(room.title, room_title)

    def test_get_room_by_id_no_match(self):
        # Arrange
        room_identifier = "test_room"
        room_title = "Test Room"
        test_room = RoomService.create_room(
            self.test_user, room_identifier, room_title, populate_default=False
        )

        # Act
        room = RoomService.get_room_by_identifier(test_room.id + 1)

        # Assert
        self.assertIsNone(room)

    def test_get_room_for_user_by_id_match(self):
        # Arrange
        room_identifier = "test_room"
        room_title = "Test Room"
        test_room = RoomService.create_room(
            self.test_user, room_identifier, room_title, populate_default=False
        )

        # Act
        room = RoomService.get_room_for_user_by_id(test_room.id, self.test_user)

        # Assert
        self.assertIsInstance(room, Room)
        self.assertEqual(room.identifier, room_identifier)
        self.assertEqual(room.title, room_title)

    def test_get_room_for_user_by_id_no_match(self):
        # Arrange: Room
        room_identifier = "test_room"
        room_title = "Test Room"
        test_room = RoomService.create_room(
            self.test_user, room_identifier, room_title, populate_default=False
        )

        # Arrange: Other User
        other_user = User.objects.create_user(
            "other_username", "other_email@example.com", "other_password"
        )

        # Act
        room = RoomService.get_room_for_user_by_id(test_room.id + 1, other_user)

        # Assert
        self.assertIsNone(room)

    def test_serialize_room(self):
        # Arrange: Room
        room_identifier = "test_room"
        room_title = "Test Room"
        test_room = RoomService.create_room(
            self.test_user, room_identifier, room_title, populate_default=False
        )

        Element(
            room=test_room, icon="completion.yes", section=0, order=0, is_visible=True
        ).save()
        Element(
            room=test_room, icon="completion.no", section=0, order=1, is_visible=False
        ).save()

        # Act
        result = RoomService.serialize_room(test_room)

        # Assert
        self.assertEqual(result["identifier"], room_identifier)
        self.assertEqual(result["title"], room_title)
        self.assertEqual(len(result["groups"][0]), 2)

    def test_serialize_room_visible_only(self):
        # Arrange: Room
        room_identifier = "test_room"
        room_title = "Test Room"
        test_room = RoomService.create_room(
            self.test_user, room_identifier, room_title, populate_default=False
        )

        Element(
            room=test_room, icon="completion.yes", section=0, order=0, is_visible=True
        ).save()
        Element(
            room=test_room, icon="completion.no", section=0, order=1, is_visible=False
        ).save()

        # Act
        result = RoomService.serialize_room(test_room, visible_only=True)

        # Assert
        self.assertEqual(result["identifier"], room_identifier)
        self.assertEqual(result["title"], room_title)
        self.assertEqual(len(result["groups"][0]), 1)

    def test_broadcast_update(self):
        # Arrange: Room
        room_identifier = "test_room"
        room_title = "Test Room"
        test_room = RoomService.create_room(
            self.test_user, room_identifier, room_title, populate_default=False
        )

        # Arrange: WebsocketService mock
        WebsocketService.broadcast_updated_room_to_students = Mock()
        WebsocketService.broadcast_updated_room_to_teachers = Mock()

        # Act
        RoomService.broadcast_update(test_room)

        # Assert
        WebsocketService.broadcast_updated_room_to_students.assert_called_with(
            test_room.id, ANY
        )
        WebsocketService.broadcast_updated_room_to_teachers.assert_called_with(
            test_room.id, ANY
        )

    def test_update_room_title(self):
        # Arrange: Room
        room_identifier = "test_room"
        room_title = "Test Room"
        test_room = RoomService.create_room(
            self.test_user, room_identifier, room_title, populate_default=False
        )

        # Arrange: Elements
        elt1 = Element(
            room=test_room, icon="completion.yes", section=0, order=0, is_visible=True
        )
        elt1.save()
        elt2 = Element(
            room=test_room, icon="completion.no", section=0, order=1, is_visible=False
        )
        elt2.save()

        # Arrange: Update
        updated_title = "Updated Test Room"
        updated_room = {
            "title": updated_title,
        }

        # Arrange: WebsocketService mock
        WebsocketService.broadcast_updated_room_to_students = Mock()
        WebsocketService.broadcast_updated_room_to_teachers = Mock()

        # Act
        RoomService.update_room(test_room, updated_room, broadcast=False)

        # Assert
        self.assertEqual(test_room.title, updated_title)
        self.assertEqual(test_room.identifier, room_identifier)
        WebsocketService.broadcast_updated_room_to_students.assert_not_called()
        WebsocketService.broadcast_updated_room_to_teachers.assert_not_called()

    def test_update_room_group_order(self):
        # Arrange: Room
        room_identifier = "test_room"
        room_title = "Test Room"
        test_room = RoomService.create_room(
            self.test_user, room_identifier, room_title, populate_default=False
        )

        # Arrange: Elements
        elt1 = Element(
            room=test_room, icon="completion.yes", section=0, order=0, is_visible=True
        )
        elt1.save()
        elt2 = Element(
            room=test_room, icon="completion.no", section=0, order=1, is_visible=False
        )
        elt2.save()

        # Arrange: Update
        updated_title = "Updated Test Room"
        updated_room = {
            "title": updated_title,
            "groups": [[{"id": elt2.id}, {"id": elt1.id}]],
        }

        # Arrange: WebsocketService mock
        WebsocketService.broadcast_updated_room_to_students = Mock()
        WebsocketService.broadcast_updated_room_to_teachers = Mock()

        # Act
        RoomService.update_room(test_room, updated_room, broadcast=True)

        # Assert
        self.assertEqual(test_room.title, updated_title)
        self.assertEqual(test_room.identifier, room_identifier)
        self.assertEqual(test_room.serialize()["groups"][0][0]["id"], elt2.id)
        self.assertEqual(test_room.serialize()["groups"][0][1]["id"], elt1.id)
        WebsocketService.broadcast_updated_room_to_students.assert_called_with(
            test_room.id, ANY
        )
        WebsocketService.broadcast_updated_room_to_teachers.assert_called_with(
            test_room.id, ANY
        )

    def test_update_room_new_group(self):
        # Arrange: Room
        room_identifier = "test_room"
        room_title = "Test Room"
        test_room = RoomService.create_room(
            self.test_user, room_identifier, room_title, populate_default=False
        )

        # Arrange: Elements
        elt1 = Element(
            room=test_room, icon="completion.yes", section=0, order=0, is_visible=True
        )
        elt1.save()
        elt2 = Element(
            room=test_room, icon="completion.no", section=0, order=1, is_visible=False
        )
        elt2.save()

        # Arrange: Update
        updated_title = "Updated Test Room"
        updated_room = {
            "title": updated_title,
            "groups": [
                [{"id": elt2.id}],
                [{"id": elt1.id}],
            ],
        }

        # Act
        RoomService.update_room(test_room, updated_room, broadcast=True)

        # Assert
        self.assertEqual(test_room.title, updated_title)
        self.assertEqual(test_room.identifier, room_identifier)
        self.assertEqual(test_room.serialize()["groups"][0][0]["id"], elt2.id)
        self.assertEqual(test_room.serialize()["groups"][1][0]["id"], elt1.id)

    def test_update_room_new_element(self):
        # Arrange: Room
        room_identifier = "test_room"
        room_title = "Test Room"
        test_room = RoomService.create_room(
            self.test_user, room_identifier, room_title, populate_default=False
        )

        # Arrange: Elements
        elt1 = Element(
            room=test_room, icon="completion.yes", section=0, order=0, is_visible=True
        )
        elt1.save()
        elt2 = Element(
            room=test_room, icon="completion.no", section=0, order=1, is_visible=False
        )
        elt2.save()

        # Arrange: Update
        updated_title = "Updated Test Room"
        updated_room = {
            "title": updated_title,
            "groups": [
                [{"id": elt2.id}],
                [{"id": elt1.id}, {"icon": "test_icon"}],
            ],
        }

        # Act
        RoomService.update_room(test_room, updated_room, broadcast=True)

        # Assert
        self.assertEqual(test_room.title, updated_title)
        self.assertEqual(test_room.identifier, room_identifier)
        self.assertEqual(test_room.serialize()["groups"][0][0]["id"], elt2.id)
        self.assertEqual(test_room.serialize()["groups"][1][0]["id"], elt1.id)
        self.assertEqual(len(test_room.serialize()["groups"][1]), 2)
