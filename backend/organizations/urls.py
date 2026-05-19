from django.urls import path, include
from rest_framework.views import APIView

from organizations.views import InviteUserView, AcceptInviteView,InviteByEmail

urlpatterns = [
    path("invite/", InviteUserView.as_view()),
    path("invite-link/",InviteByEmail.as_view()),
    path("accept/<str:token>", AcceptInviteView.as_view())
]
