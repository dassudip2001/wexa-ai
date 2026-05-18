from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


# Create your views here.
class LogoutView(APIView):
    def post(self, request):
        refresh_token= request.data['refresh']
        token=RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message":"Logged out",})
