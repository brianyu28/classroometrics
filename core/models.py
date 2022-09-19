"""
Core models for application.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Represents a user account.
    """

    def serialize(self) -> dict:
        """
        Serialize user.
        """
        return {
            "id": self.id,
            "username": self.username,
        }


class UserToken(models.Model):
    """
    Represents an API token a user can use to make requests.
    """

    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="tokens")
    token = models.CharField(max_length=200)
    expiration = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"Token for {self.user}"

    def serialize(self) -> dict:
        """
        Serialize token.
        """
        return {
            "id": self.id,
            "user_id": self.user.id,
            "token": self.token,
            "expiration": self.expiration,
        }


class Room(models.Model):
    """
    Represents a room where teachers and students can interact.
    """

    identifier = models.CharField(max_length=200, unique=True)
    owner = models.ForeignKey("User", on_delete=models.CASCADE, related_name="rooms")
    title = models.CharField(max_length=200, blank=True)
    questions_enabled = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.title} ({self.owner.username})"

    def serialize(self, visible_only=False) -> dict:
        """
        Serialize room and its elements.
        """
        elements = self.elements.order_by("section", "order")
        if visible_only:
            elements = elements.filter(is_visible=True)
        groups = []
        for element in elements.all():
            while element.section >= len(groups):
                groups.append([])
            groups[-1].append(element.serialize())
        return {
            "id": self.id,
            "identifier": self.identifier,
            "owner_id": self.owner.id,
            "title": self.title,
            "questions_enabled": self.questions_enabled,
            "groups": groups,
        }


class Element(models.Model):
    """
    Represents an interaction element in a room.
    """

    room = models.ForeignKey("Room", on_delete=models.CASCADE, related_name="elements")
    icon = models.CharField(max_length=200)
    name = models.CharField(max_length=200, blank=True)
    section = models.IntegerField()
    order = models.IntegerField()
    is_visible = models.BooleanField(default=True)
    link = models.CharField(max_length=2048, blank=True)

    def __str__(self) -> str:
        return f"{self.name} - {self.icon} ({self.room.id})"

    def serialize(self) -> dict:
        """
        Serialize room element.
        """
        return {
            "id": self.id,
            "room_id": self.room.id,
            "icon": self.icon,
            "name": self.name,
            "section": self.section,
            "order": self.order,
            "is_visible": self.is_visible,
            "link": self.link,
        }
