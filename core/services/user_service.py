"""
Service responsible for managing users.
"""

from django.db.utils import IntegrityError

from core.models import User

class UserService:

    @staticmethod
    def create_user(
        username: str,
        password: str,
        is_staff: bool = False,
        is_superuser: bool = False
    ) -> User | None:
        """
        Create a new user.

        Arguments:
            username: str -- User's new username
            password: str -- User's new password
            is_staff: bool -- Whether user should be a staff role
            is_superuser: bool - Whether user should be a superuser

        Returns:
            User | None -- Newly created user, or None if could not be created

        Notes:
            - is_superuser implies is_staff
            - User might not be created if username is duplicate
        """
        try:
            user = User.objects.create_user(
                username,
                password=password
            )
        except IntegrityError:
            return None
        user.is_staff = is_staff or is_superuser
        user.is_superuser = is_superuser
        user.save()
        return user
