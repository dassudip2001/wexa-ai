from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.shortcuts import render
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.serializers import SignUpSerializer, MembershipSerializer, UserProfileSerializer
from common.services.email_service import send_welcome_email
from organizations.models import Membership

User = get_user_model()


# Create your views here.
class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({"error": "Refresh token required"}, status=400)
        try:
            RefreshToken(refresh_token).blacklist()
        except Exception:
            return Response({"error": "Invalid token"}, status=400)
        return Response({"message": "Logged out"})


# register user
# create user
# register organization
# create organization membership
class SignUpView(APIView):
    authentication_classes = []
    permission_classes = []
    def post(self,request):
        serializer=SignUpSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.save()
            refresh=RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            })
        send_welcome_email.delay(
            user.email
        )
        return Response(serializer.errors,status=400)


# class GetUserView(APIView):
#     permission_classes = [IsAuthenticated]
#
#     def get(self, request):
#         user = request.user
#
#         memberships = Membership.objects.filter(
#             user=user
#         ).select_related("organization")
#
#         org_data = MembershipSerializer(
#             memberships,
#             many=True
#         ).data
#
#         return Response({
#             "id": user.id,
#             "email": user.email,
#             "first_name": user.first_name,
#             "last_name": user.last_name,
#             "organizations": org_data
#         })


class GetUserView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user
