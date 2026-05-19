from django.db.models.aggregates import Count
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from events.models import Event
from organizations.models import Membership
from datetime import timedelta


# Create your views here.
class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        membership = Membership.objects.filter(
            user=request.user
        ).first()

        if not membership:
            return Response({"error": "No organization"}, status=400)

        org = membership.organization

        # Total Events
        total_events = Event.objects.filter(
            organization=org
        ).count()

        # Today Events
        today = timezone.now().date()

        today_events = Event.objects.filter(
            organization=org,
            created_at__date=today
        ).count()

        # Last 7 Days Trend
        last_week = timezone.now() - timedelta(days=7)

        events_last_7_days = (
            Event.objects.filter(
                organization=org,
                created_at__gte=last_week
            )
            .extra({"day": "date(created_at)"})
            .values("day")
            .annotate(count=Count("id"))
            .order_by("day")
        )

        # Top Event Types
        top_events = (
            Event.objects.filter(organization=org)
            .values("event_name")
            .annotate(total=Count("id"))
            .order_by("-total")[:5]
        )

        # Recent Events
        recent_events = Event.objects.filter(
            organization=org
        ).order_by("-created_at")[:5].values(
            "event_name",
            "created_at"
        )

        return Response({
            "kpi": {
                "total_events": total_events,
                "today_events": today_events,
            },
            "charts": {
                "events_last_7_days": list(events_last_7_days),
                "top_events": list(top_events),
            },
            "recent_activity": list(recent_events)
        })
