from django.urls import path
from rest_framework.views import APIView

from .views import EventIngestView, EventListView, EventIngestAPIView

urlpatterns = [
    path("ingest/", EventIngestView.as_view()),
    path("",EventListView.as_view()),
    path("ingest-api/",EventIngestAPIView.as_view())
]