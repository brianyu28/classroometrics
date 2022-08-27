import json
from django.test import Client, TestCase

from core.models import Element, Room, User


class RoomControllerTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Arrange: User
        cls.test_username = "test_username"
        cls.test_email = "test_email@example.com"
        cls.test_password = "test_password"
        cls.test_user = User.objects.create_user(
            cls.test_username, cls.test_email, cls.test_password
        )

        # Arrange: User2
        cls.test_username2 = "test_username2"
        cls.test_email2 = "test_email2@example.com"
        cls.test_password2 = "test_password2"
        cls.test_user2 = User.objects.create_user(
            cls.test_username2, cls.test_email2, cls.test_password2
        )

        # Arrange: Room
        cls.test_room_identifier = "test_room"
        cls.test_room_title = "Test Room"
        cls.test_room = Room(
            identifier=cls.test_room_identifier,
            owner=cls.test_user,
            title=cls.test_room_title,
            questions_enabled=True,
        )
        cls.test_room.save()

        # Arrange: Elements
        Element(room=cls.test_room, icon="icon1", name="element1", section=0, order=0, is_visible=True).save()
        Element(room=cls.test_room, icon="icon2", name="element2", section=0, order=0, is_visible=True).save()
        Element(room=cls.test_room, icon="icon3", name="element3", section=0, order=0, is_visible=False).save()

        # Arrange: Room 2
        cls.test_room2_identifier = "test_room2"
        cls.test_room2_title = "Test Room 2"
        cls.test_room2 = Room(
            identifier=cls.test_room2_identifier,
            owner=cls.test_user,
            title=cls.test_room2_title,
            questions_enabled=False,
        )
        cls.test_room2.save()

    def test_get_rooms_returns_own_rooms(self):
        # Arrange
        client = Client()
        client.post(
            "/api/auth/login",
            data={
                "username": self.test_username,
                "password": self.test_password,
                "create_session": True,
            },
            content_type="application/json",
        )

        # Act
        response = client.get("/api/rooms")
        data = json.loads(response.content)

        # Assert
        self.assertEqual(len(data), 2)
        self.assertEqual(
            set(room["identifier"] for room in data),
            {self.test_room_identifier, self.test_room2_identifier},
        )

    def test_get_rooms_returns_no_rooms(self):
        # Arrange
        client = Client()
        client.post(
            "/api/auth/login",
            data={
                "username": self.test_username2,
                "password": self.test_password2,
                "create_session": True,
            },
            content_type="application/json",
        )

        # Act
        response = client.get("/api/rooms")
        data = json.loads(response.content)

        # Assert
        self.assertEqual(len(data), 0)

    def test_create_new_room(self):
        # Arrange
        client = Client()
        client.post(
            "/api/auth/login",
            data={
                "username": self.test_username,
                "password": self.test_password,
                "create_session": True,
            },
            content_type="application/json",
        )

        # Arrange
        identifier = "test_identifier3"
        title = "Test Room 3"

        # Act
        response = client.post(
            "/api/rooms",
            data={
                "identifier": identifier,
                "title": title,
            },
            content_type="application/json",
        )

        # Assert
        self.assertEqual(response.status_code, 201)

        # Act
        response = client.get("/api/rooms")
        data = json.loads(response.content)

        # Assert
        self.assertEqual(len(data), 3)
        self.assertEqual(
            set(room["identifier"] for room in data),
            {self.test_room_identifier, self.test_room2_identifier, identifier},
        )

    def test_update_room(self):
        # Arrange
        client = Client()
        client.post(
            "/api/auth/login",
            data={
                "username": self.test_username,
                "password": self.test_password,
                "create_session": True,
            },
            content_type="application/json",
        )
        title = "New Title"

        # Act
        response = client.put(
            "/api/rooms/1",
            data={"room": {"title": title}},
            content_type="application/json",
        )
        data = json.loads(response.content)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["identifier"], self.test_room_identifier)
        self.assertEqual(data["title"], title)

    def test_room_viewer(self):
        # Arrange
        client = Client()

        # Act
        response = client.get("/api/student/rooms/1")
        data = json.loads(response.content)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data["groups"][0]), 2)

    def test_room_by_identifier(self):
        # Arrange
        client = Client()
        client.post(
            "/api/auth/login",
            data={
                "username": self.test_username,
                "password": self.test_password,
                "create_session": True,
            },
            content_type="application/json",
        )

        # Act
        response = client.get(f"/api/teacher/rooms/{self.test_room_identifier}")
        data = json.loads(response.content)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data["groups"][0]), 3)
