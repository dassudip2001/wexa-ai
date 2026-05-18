from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from events.models import Event
from organizations.models import  Organization, Membership


# Create your views here.
class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        membership=Membership.objects.filter(
            user=request.user,
        ).first()

        org=membership.organization

        total_events =Event.objects.filter(
            organization=org
        ).count()

        return Response({
            "total_events": total_events
        })
