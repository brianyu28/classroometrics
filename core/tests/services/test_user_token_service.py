from django.test import TestCase

from core.models import User, UserToken
from core.services.user_token_service import UserTokenService


class UserTokenServiceTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Arrange: User
        cls.test_username = "test_username"
        cls.test_email = "test_email@example.com"
        cls.test_password = "test_password"
        cls.test_user = User.objects.create_user(
            cls.test_username, cls.test_email, cls.test_password
        )

    def test_create_token(self):
        # Arrange
        token_string = "test_token"

        # Act
        token = UserTokenService.create_token(self.test_user, token_string)

        # Assert
        self.assertIsInstance(token, UserToken)
        self.assertEqual(token.token, token_string)

    def test_token_exists(self):
        # Arrange
        token_string = "test_token"
        token = UserTokenService.create_token(self.test_user, token_string)

        # Act
        result = UserTokenService.does_token_exist(token_string)

        # Assert
        self.assertTrue(result)

    def test_token_does_not_exist(self):
        # Arrange
        token_string = "test_token"

        # Act
        result = UserTokenService.does_token_exist(token_string)

        # Assert
        self.assertFalse(result)

    def test_get_tokens_for_user_none(self):
        # Act
        result = UserTokenService.get_tokens_for_user(self.test_user)

        # Assert
        self.assertEqual(len(result), 0)

    def test_get_tokens_for_user(self):
        # Arrange
        token_string = "test_token"
        token = UserTokenService.create_token(self.test_user, token_string)

        # Act
        result = UserTokenService.get_tokens_for_user(self.test_user)

        # Assert
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0].token, token_string)

    def test_create_token_for_user(self):
        # Act
        result = UserTokenService.get_tokens_for_user(self.test_user)

        # Assert
        self.assertEqual(len(result), 0)

        # Act
        UserTokenService.create_token_for_user(self.test_user)
        result = UserTokenService.get_tokens_for_user(self.test_user)

        # Assert
        self.assertEqual(len(result), 1)

    def test_get_or_create_user_token_when_token_exists(self):
        # Arrange
        token_string = "test_token"
        UserTokenService.create_token(self.test_user, token_string)

        # Act
        result = UserTokenService.get_or_create_user_token(self.test_user)

        # Assert
        self.assertEqual(result.token, token_string)
        self.assertEqual(result.user, self.test_user)

    def test_get_or_create_user_token_when_token_does_not_exist(self):
        # Act
        result = UserTokenService.get_or_create_user_token(self.test_user)

        # Assert
        self.assertIsInstance(result, UserToken)
        self.assertEqual(result.user, self.test_user)

    def test_get_user_from_token(self):
        # Arrange
        token_string = "test_token"
        UserTokenService.create_token(self.test_user, token_string)

        # Act
        result = UserTokenService.get_user_from_token(token_string)

        # Assert
        self.assertIsNotNone(result)
        self.assertEqual(result.id, self.test_user.id)
