from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


# Create your views here.

class HeldthView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return Response({"message": "I am alive!"},status=status.HTTP_200_OK)

