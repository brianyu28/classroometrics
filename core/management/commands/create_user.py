from django.core.management.base import BaseCommand, CommandError

from core.models import User
from core.services.user_service import UserService

class Command(BaseCommand):
    help = "Create a new user account."

    def add_arguments(self, parser):
        parser.add_argument("--username", type=str, help="Username", required=True)
        parser.add_argument("--password", type=str, help="Password", required=True)
        parser.add_argument("--is_superuser", action="store_true", help="Indicate that user should be superuser")
        parser.add_argument("--is_staff", action="store_true", help="Indicate that user should be staff")

    def handle(self, *args, **options):
        user = UserService.create_user(
            username=options["username"],
            password=options["password"],
            is_staff=options["is_staff"],
            is_superuser=options["is_superuser"]
        )
        if user is None:
            raise CommandError("Failed to create user.")
        print(f"Created user {user.username} (id: {user.id})")
