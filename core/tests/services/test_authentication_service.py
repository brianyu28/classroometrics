from django.http.request import HttpRequest
from django.test import TestCase

from core.models import User, UserToken
from core.services.authentication_service import AuthenticationService


class AuthenticationServiceTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Arrange: User
        cls.test_username = "test_username"
        cls.test_email = "test_email@example.com"
        cls.test_password = "test_password"
        cls.test_user = User.objects.create_user(
            cls.test_username, cls.test_email, cls.test_password
        )

        # Arrange: User token
        cls.test_token = "test_token123"
        user_token = UserToken(user=cls.test_user, token=cls.test_token)
        user_token.save()

    def test_authenticate_user_success(self):
        # Act
        user = AuthenticationService.authenticate_user(
            self.test_username, self.test_password
        )

        # Assert
        self.assertIsNotNone(user)
        self.assertEqual(user.username, self.test_username)

    def test_authenticate_user_fail(self):
        # Act
        user = AuthenticationService.authenticate_user(
            self.test_username, f"{self.test_password}_incorrect"
        )

        # Assert
        self.assertIsNone(user)

    def test_identifies_request_with_authentication_header(self):
        # Arrange
        request = HttpRequest()
        request.META = {"HTTP_AUTHORIZATION": "token test123"}

        # Act
        result = AuthenticationService.request_has_authorization_header(request)

        # Assert
        self.assertTrue(result)

    def test_identifies_request_without_authentication_header(self):
        # Arrange
        request = HttpRequest()
        request.META = {}

        # Act
        result = AuthenticationService.request_has_authorization_header(request)

        # Assert
        self.assertFalse(result)

    def test_authenticate_user_from_request_headers(self):
        # Arrange: Request headers
        request = HttpRequest()
        request.META = {"HTTP_AUTHORIZATION": f"token {self.test_token}"}

        # Act
        user = AuthenticationService.authenticate_user_from_request_headers(request)

        # Assert
        self.assertIsNotNone(user)
        self.assertEqual(user.username, self.test_username)

    def test_get_user_auth(self):
        # Act
        data = AuthenticationService.get_user_auth_data(self.test_user)

        # Assert
        self.assertTrue(data["authenticated"])
        self.assertEqual(data["user"]["username"], self.test_username)

    def test_get_guest_user_auth(self):
        # Act
        data = AuthenticationService.get_guest_auth_data()

        # Assert
        self.assertFalse(data["authenticated"])
