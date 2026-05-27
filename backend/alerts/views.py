from django.db.models import Model
from django.shortcuts import render
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from alerts.models import JobPosting
from alerts.serializers import JobSerializers


# Create your views here.

class GetALlJobView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        # select * from employee where age > 10
        getJobs=JobPosting.objects.select_related('company').all()
        jobSerializer = JobSerializers(getJobs, many=True)
        return Response(jobSerializer.data)




