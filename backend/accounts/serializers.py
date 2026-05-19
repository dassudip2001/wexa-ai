from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser
from rest_framework import serializers

from organizations.models import Organization, Membership

User = get_user_model()


class MembershipSerializer(serializers.ModelSerializer):
    organization_id = serializers.UUIDField(
        source="organization.id"
    )
    organization_name = serializers.CharField(
        source="organization.name"
    )

    class Meta:
        model = Membership
        fields = [
            "organization_id",
            "organization_name",
            "role",
        ]


class SignUpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    organization_name = serializers.CharField()
    username = serializers.CharField()

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        username = validated_data['username']
        organization_name = validated_data['organization_name']

        # create user
        user = User.objects.create_user(email=email,
                                        username=username,
                                        password=make_password(
                                            password))

        # create organization
        if organization_name:
            org = Organization.objects.create(
                name=organization_name,
                slug=organization_name.lower().replace(" ", "-")
            )

        # owner member
        Membership.objects.create(
            user=user,
            organization=org,
            role="OWNER"
        )

        return user
