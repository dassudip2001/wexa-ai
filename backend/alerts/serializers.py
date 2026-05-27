from rest_framework import serializers

from alerts.models import JobPosting,Company





class CompanySerializers(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields ="__all__"


class JobSerializers(serializers.ModelSerializer):
    company = CompanySerializers()
    class Meta:
        model = JobPosting
        fields ="__all__"