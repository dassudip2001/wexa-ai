from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class  User(AbstractUser):
    pass
    # organization=models.ForeignKey("organizations.Organization", on_delete=models.CASCADE)
    # ROLE_CHOICES = (
    #     ("OWNER", "Owner"),
    #     ("ADMIN", "Admin"),
    #     ("ANALYST", "Analyst"),
    #     ("VIEWER", "Viewer"),
    # )
    #
    # role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    # email = models.EmailField(unique=True)
    # organization = models.ForeignKey(
    #     "organizations.Organization",
    #     on_delete=models.CASCADE,
    #     null=True,
    #     related_name="members"
    # )

    # USERNAME_FIELD = "email"
    # REQUIRED_FIELDS = []


