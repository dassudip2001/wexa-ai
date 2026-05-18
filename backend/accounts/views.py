from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


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


class GetUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name

        })
