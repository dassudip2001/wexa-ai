
from django.contrib import admin
from django.urls import path, include
from rest_framework.views import APIView

from alerts.views import GetALlJobView

urlpatterns = [
    path('jobs/', GetALlJobView.as_view()),

]
