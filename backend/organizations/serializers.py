from rest_framework import serializers

from organizations.models import APIKey


class ApiListSerializer(serializers.ModelSerializer):
    class Meta:
        model=APIKey
        fields='__all__'
