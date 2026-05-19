from django.urls import path, include
from rest_framework.views import APIView

from organizations.views import InviteUserView, AcceptInviteView

urlpatterns = [
    path("invite", InviteUserView.as_view()),
    path("accept/<str:token>", AcceptInviteView.as_view())
]
