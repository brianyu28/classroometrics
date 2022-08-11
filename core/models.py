from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
        }


class UserToken(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="tokens")
    token = models.CharField(max_length=200)
    expiration = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Token for {self.user}"

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user.id,
            "token": self.token,
            "expiration": self.expiration
        }
