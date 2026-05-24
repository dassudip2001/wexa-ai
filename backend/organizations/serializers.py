from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.serializers import MembershipSerializer
from organizations.models import APIKey

User=get_user_model()
class ApiListSerializer(serializers.ModelSerializer):
    class Meta:
        model = APIKey
        fields = '__all__'


