from django.urls import path
from .views import EventIngestView,EventListView

urlpatterns = [
    path("ingest/", EventIngestView.as_view()),
    path("",EventListView.as_view())
]