"""
Management command to create a new user account.
"""

import getpass

from django.core.management.base import BaseCommand, CommandError

from core.services.user_service import UserService


class Command(BaseCommand):
    """
    Management command.
    """

    help = "Create a new user account."

    def add_arguments(self, parser):
        parser.add_argument("--username", type=str, help="Username", required=True)
        parser.add_argument(
            "--is_superuser",
            action="store_true",
            help="Indicate that user should be superuser",
        )
        parser.add_argument(
            "--is_staff", action="store_true", help="Indicate that user should be staff"
        )

    def handle(self, *args, **options):
        password = getpass.getpass()
        user = UserService.create_user(
            username=options["username"],
            password=password,
            is_staff=options["is_staff"],
            is_superuser=options["is_superuser"],
        )
        if user is None:
            raise CommandError("Failed to create user.")
        print(f"Created user {user.username} (id: {user.id})")
