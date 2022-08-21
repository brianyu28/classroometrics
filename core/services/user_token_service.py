"""
Service for managing user tokens.
"""

import secrets

from datetime import date
from typing import List

from core.models import User, UserToken

USER_TOKEN_LENGTH = 40


class UserTokenService:
    """
    Service for managing user tokens.
    """

    @staticmethod
    def create_token(
        user: User, token_string: str, expiration: date | None = None
    ) -> UserToken:
        """
        Create a new token.

        Arguments:
            user: User -- The user to create a token for
            token_string: str -- The token string

        Optional arguments:
            expiration: date | None -- When the token expires (default None)

        Returns:
            UserToken -- The user token
        """
        token = UserToken(
            user=user,
            token=token_string,
            expiration=expiration,
        )
        token.save()
        return token

    @staticmethod
    def does_token_exist(token_string: str) -> bool:
        """
        Check if a token exists in the database already.

        Arguments:
            token_string: str -- Token string to check

        Returns:
            bool -- Whether the token exists
        """
        return UserToken.objects.filter(token=token_string).count() > 0

    @staticmethod
    def get_tokens_for_user(user: User) -> List[UserToken]:
        """
        Get all tokens for a user.

        Arguments:
            user: User -- The user to get tokens for

        Returns:
            [UserToken] -- List of tokens
        """
        return user.tokens.all()

    @staticmethod
    def create_token_for_user(user: User) -> UserToken:
        """
        Create a new user token for a user.

        Arguments:
            user: User -- The user to create a new token for

        Returns:
            UserToken -- The user token
        """
        # Generate a token string that isn't in use
        while True:
            token_string = secrets.token_urlsafe(USER_TOKEN_LENGTH)
            if not UserTokenService.does_token_exist(token_string):
                break

        # Create new token
        return UserTokenService.create_token(user, token_string, None)

    @staticmethod
    def get_or_create_user_token(user: User) -> UserToken:
        """
        Get a token for a user, or create one if it doesn't exist.

        Arguments:
            user: User -- The user to return a token for

        Returns:
            UserToken -- The user token
        """
        if user.tokens.count() == 0:
            return UserTokenService.create_token_for_user(user)
        return user.tokens.first()

    @staticmethod
    def get_user_from_token(token_string: str) -> User | None:
        """
        Get a user from a token.

        Arguments:
            token_string: str -- The token string to check

        Returns:
            User | None -- User object matching the token, or None if no match
        """
        token = UserToken.objects.filter(token=token_string).first()
        if token is None:
            return None
        return token.user
