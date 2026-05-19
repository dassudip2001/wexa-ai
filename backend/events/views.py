from django.shortcuts import render
from rest_framework.views import APIView

from organizations.models import Membership
from .serializers import EventSerializer, EventAllSerializer
from rest_framework.response import  Response
from rest_framework.permissions import IsAuthenticated
from .models import Event


# Create your views here.
class EventIngestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):


        membership = Membership.objects.filter(
            user=request.user
        ).first()

        if not membership:
            return Response({"error": "No organization found"}, status=400)

        org=membership.organization

        # Batch
        event_data=request.data.get("events")
        created_events=[]
        if event_data:
            serializer=EventSerializer(
                data=event_data, many=True
            )
            serializer.is_valid(raise_exception=True)
            events=[
                Event(organization=org, **event)
                for event in serializer.validated_data
            ]
            Event.objects.bulk_create(events)
            return Response({
                "message": "Batch events stored",
                "count": len(events)
            })
        # Single
        serializer = EventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        Event.objects.create(
            organization=org,
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

        return Response(EventAllSerializer(events, many=True).data)
