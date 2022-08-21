"""
Service responsible for authenticating users based on Django's user system.
"""

from django.contrib.auth import authenticate, login, logout
from django.http.request import HttpRequest

from core.models import User
from core.services.user_token_service import UserTokenService


class AuthenticationException(Exception):
    pass


class AuthenticationService:

    HEADER_NAME = "Authorization"

    @staticmethod
    def authenticate_user(username: str, password: str) -> User | None:
        """
        Attempt to authenticate a user.

        Arguments:
            username: str -- Username
            password: str -- Password

        Returns:
            User | None -- User object if authentication is successful, or None
        """
        return authenticate(username=username, password=password)

    @staticmethod
    def request_has_authorization_header(request: HttpRequest) -> bool:
        """
        Check if request has an Authorization header.

        Arguments:
            request: HttpRequest -- The HTTP request

        Returns:
            boolean: Whether request has an authorization header
        """
        return AuthenticationService.HEADER_NAME in request.headers

    @staticmethod
    def authenticate_user_from_request_headers(request: HttpRequest) -> User:
        """
        Authenticate user based on Authorization request header.

        Arguments:
            request: HttpRequest -- The HTTP request

        Returns:
            User -- User object if authentication is successful, or None

        Raises:
            AuthenticationException -- If there's an error in authentication
        """
        auth_header = request.headers.get(AuthenticationService.HEADER_NAME)
        if auth_header is None:
            raise AuthenticationException("Missing Authorization header.")
        parts = auth_header.strip().split(" ")
        if len(parts) != 2 or parts[0] != "token":
            raise AuthenticationException(f"Invalid format for {AuthenticationService.HEADER_NAME} header.")
        token = parts[1]
        user = UserTokenService.get_user_from_token(token)
        if user is None:
            raise AuthenticationException("Invalid credentials.")
        return user

    @staticmethod
    def attach_authenticated_user_to_session(request: HttpRequest, user: User):
        """
        Take an authenticated user and attach them to the current session.

        Arguments:
            request: HttpRequest -- The HTTP request
            user: User -- The user to login in
        """
        login(request, user)

    @staticmethod
    def remove_user_from_session(request: HttpRequest):
        """
        Sign out user from current session.

        Arguments:
            request: HttpRequest -- The HTTP request
        """
        logout(request)

    @staticmethod
    def get_user_for_current_session(request: HttpRequest) -> User | None:
        """
        From the current HTTP request, get the user for the current session.

        Arguments:
            request: HttpRequest -- The HTTP request

        Returns:
            User | None: User object if one is authenticated, or None if none for session
        """
        if request.user.is_authenticated:
            return request.user
        return None

    @staticmethod
    def get_user_auth_data(user: User) -> dict:
        """
        Get user authentication data, including token, to send to client.

        Arguments:
            user: User -- User to generate data for.

        Returns:
            dict: User authentication data
        """
        return {
            "authenticated": True,
            "user": user.serialize(),
        }

    @staticmethod
    def get_guest_auth_data() -> dict:
        """
        Get authentication data for a guest user, to send to client.

        Returns:
            dict: User authentication data
        """
        return {
            "authenticated": False,
        }
