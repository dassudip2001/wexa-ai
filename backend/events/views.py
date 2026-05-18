from django.shortcuts import render
from rest_framework.views import APIView

from organizations.models import Membership
from  .serializers import EventSerializer
from rest_framework.response import  Response
from rest_framework.permissions import IsAuthenticated
from .models import Event


# Create your views here.
class EventIngestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        membership = Membership.objects.filter(
            user=request.user
        ).first()

        if not membership:
            return Response({"error": "No organization found"}, status=400)

        Event.objects.create(
            organization=membership.organization,
            **serializer.validated_data
        )

        return Response({"message": "Event stored"})

class EventListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        membership = Membership.objects.filter(
            user=request.user
        ).first()

        if not membership:
            return Response({"error": "No organization found"}, status=400)

        events = Event.objects.filter(
            organization=membership.organization
        ).order_by("-created_at")

        return Response(EventSerializer(events, many=True).data)
