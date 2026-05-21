from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from organizations.models import Invitation, Membership, APIKey
from organizations.permissions import IsAdminOrOwner
from organizations.serializers import ApiListSerializer
from organizations.utils import get_user_organization


# Create your views here.
class InviteUserView(APIView):
    permission_classes = [IsAdminOrOwner]

    def post(self, request):
        org = get_user_organization(request.user)

        invite = Invitation.objects.create(
            email=request.data["email"],
            role="VIEWER",
            organization=org
        )

        return Response({"invite_token": invite.token})


# Get invite by emailId
class InviteByEmail(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        org = get_user_organization(request.user)
        invite = Invitation.objects.filter(
            email=request.user.email,
            accepted=False
        ).first()
        print(".................",invite)
        if not invite:
            return Response({"message": "No invite available"}, status=200)

        return Response({
            "token": str(invite.token),
            "role": invite.role,
            "organization": invite.organization.name
        })



# accept invite
class AcceptInviteView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, token):
        invite = Invitation.objects.get(token=token)
        print(".............",invite)

        Membership.objects.create(
            user=request.user,
            organization=invite.organization,
            role=invite.role
        )

        invite.accepted = True
        invite.save()

        return Response({"message": "Joined organization"})


#GET-API
class ApiListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        org = get_user_organization(request.user)
        data=APIKey.objects.filter(organization=org
        ).select_related('organization')
        serializer = ApiListSerializer(data, many=True)
        return Response(serializer.data)


# CREATE -API
class ApiCreateView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        org=get_user_organization(request.user)
        api=APIKey.objects.create(
            name=request.data['name'],
            organization=org
        )
        return Response({

            "name":api.name,
            "key":str(api.key),
            "organization":api.organization.name
        })

# DELETE - API
class ApiDeleteView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self,request,pk):
        data=get_object_or_404(APIKey,pk=pk)
        data.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
