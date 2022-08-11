"""
Service responsible for authenticating users based on Django's user system.
"""

from django.contrib.auth import authenticate

from core.models import User

class AuthenticationService:

    @staticmethod
    def authenticate_user(username: str, password: str) -> User | None:
        """
        Attempt to authenticate a user

        Arguments:
            username: str -- Username
            password: str -- Password

        Returns:
            User | None -- User object if authentication is successful, or None
        """
        return authenticate(username=username, password=password)
