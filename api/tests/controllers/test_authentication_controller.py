import json

from django.test import Client, TestCase

from core.models import User


class AuthenticationControllerTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Arrange: User
        cls.test_username = "test_username"
        cls.test_email = "test_email@example.com"
        cls.test_password = "test_password"
        cls.test_user = User.objects.create_user(
            cls.test_username, cls.test_email, cls.test_password
        )

    def test_login_success(self):
        # Arrange
        client = Client()

        # Act
        response = client.post(
            "/api/auth/login",
            data={"username": self.test_username, "password": self.test_password},
            content_type="application/json",
        )
        data = json.loads(response.content)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["authenticated"], True)
        self.assertEqual(data["user"]["id"], self.test_user.id)

    def test_login_fail(self):
        # Arrange
        client = Client()

        # Act
        response = client.post(
            "/api/auth/login",
            data={
                "username": self.test_username,
                "password": f"{self.test_password}_invalid",
            },
            content_type="application/json",
        )
        data = json.loads(response.content)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["authenticated"], False)

    def test_current_user_guest(self):
        # Arrange
        client = Client()

        # Act
        response = client.get("/api/auth/me")
        data = json.loads(response.content)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["authenticated"], False)

    def test_current_user_not_signed_in_without_session_creation(self):
        # Arrange
        client = Client()
        response = client.post(
            "/api/auth/login",
            data={"username": self.test_username, "password": self.test_password},
            content_type="application/json",
        )

        # Act
        response = client.get("/api/auth/me")
        data = json.loads(response.content)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["authenticated"], False)

    def test_current_user_signed_in_after_session_creation(self):
        # Arrange
        client = Client()
        response = client.post(
            "/api/auth/login",
            data={
                "username": self.test_username,
                "password": self.test_password,
                "create_session": True,
            },
            content_type="application/json",
        )

        # Act
        response = client.get("/api/auth/me")
        data = json.loads(response.content)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["authenticated"], True)
        self.assertEqual(data["user"]["id"], self.test_user.id)

    def test_logout(self):
        # Arrange
        client = Client()
        response = client.post(
            "/api/auth/login",
            data={
                "username": self.test_username,
                "password": self.test_password,
                "create_session": True,
            },
            content_type="application/json",
        )

        # Act
        response = client.post("/api/auth/logout")
        response = client.get("/api/auth/me")
        data = json.loads(response.content)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["authenticated"], False)
