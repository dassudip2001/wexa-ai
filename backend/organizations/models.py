import uuid
from django.db import models
from datetime import timedelta
from django.utils import timezone
import secrets

class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Membership(models.Model):
    ROLE_CHOICES = (
        ("OWNER", "Owner"),
        ("ADMIN", "Admin"),
        ("ANALYST", "Analyst"),
        ("VIEWER", "Viewer"),
    )

    user = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="memberships"
    )

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="memberships"
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "organization")


class Invitation(models.Model):
    def invite_expiry():
        return timezone.now() + timedelta(days=7)

    email = models.EmailField()
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    role = models.CharField(max_length=20)
    token = models.UUIDField(default=uuid.uuid4)
    accepted = models.BooleanField(default=False)
    create_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(
        default=invite_expiry()
    )

    def is_valid(self):
        return not self.accepted and timezone.now() < self.expires_at


class APIKey(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="api_keys"
    )

    name = models.CharField(max_length=100)

    key = models.CharField(max_length=64, unique=True, editable=False)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = secrets.token_hex(32)
        super().save(*args, **kwargs)