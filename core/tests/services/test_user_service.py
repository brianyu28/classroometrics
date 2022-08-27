from django.test import TestCase
from core.models import User

from core.services.user_service import UserService


class UserServiceTestCase(TestCase):
    def test_create_user_not_staff(self):
        # Arrange
        test_username = "test_username"
        test_password = "test_password"
        test_is_staff = False

        # Act
        user = UserService.create_user(test_username, test_password, test_is_staff)

        # Assert
        self.assertIsInstance(user, User)
        self.assertEqual(user.username, test_username)
        self.assertEqual(user.is_staff, test_is_staff)

    def test_create_user_staff(self):
        # Arrange
        test_username = "test_username"
        test_password = "test_password"
        test_is_staff = True

        # Act
        user = UserService.create_user(test_username, test_password, test_is_staff)

        # Assert
        self.assertIsInstance(user, User)
        self.assertEqual(user.username, test_username)
        self.assertEqual(user.is_staff, test_is_staff)
