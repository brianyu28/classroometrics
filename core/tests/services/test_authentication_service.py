from django.test import TestCase

from core.models import User
from core.services.authentication_service import AuthenticationService


class AuthenticationServiceTestCase(TestCase):
    def setUp(self):
        pass

    def test_authenticate_user_success(self):
        # Arrange
        username = "test_username"
        email = "test_email@example.com"
        password = "test_password"
        User.objects.create_user(username, email, password)

        # Act
        user = AuthenticationService.authenticate_user(username, password)

        # Assert
        self.assertIsNotNone(user)
        self.assertEqual(user.username, username)

    def test_authenticate_user_fail(self):
        # Arrange
        username = "test_username"
        email = "test_email@example.com"
        password = "test_password"
        User.objects.create_user(username, email, password)

        # Act
        user = AuthenticationService.authenticate_user(
            username, f"{password}_incorrect"
        )

        # Assert
        self.assertIsNone(user)
