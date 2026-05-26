from django.conf import settings
from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from common.services.invite_email import send_invite_email
from common.services.accept_email import send_accept_email
from organizations.models import Invitation, Membership, APIKey
from organizations.permissions import IsAdminOrOwner
from organizations.serializers import ApiListSerializer
from organizations.utils import get_user_organization


# Create your views here.
class InviteUserView(APIView):
    permission_classes = [IsAdminOrOwner]

    def post(self, request):
        org = get_user_organization(request.user)
        # check if already send
        if Invitation.objects.filter(email=request.data["email"], organization=org).exists():
            return Response({"message": "Invite already sent"}, status=status.HTTP_400_BAD_REQUEST)
        if Membership.objects.filter(organization=org, user__email=request.data["email"]).exists():
            return Response({"message": "User already member of this organization"},
                            status=status.HTTP_400_BAD_REQUEST)
        if not org:
            return Response({"message": "Organization not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            invite = Invitation.objects.create(
                email=request.data["email"],
                role="VIEWER",
                organization=org
            )

            invite_link = f"{settings.FRONTEND_URL}/accept-invite/{invite.token}"
            send_invite_email.delay(
                email=invite.email,
                inviter_name=request.user.username,
                organization_name=org.name,
                invite_link=invite_link
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
        print(".................", invite)
        if not invite:
            return Response({"message": "No invite available"}, status=status.HTTP_200_OK)

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
        print(".............", invite)

        Membership.objects.create(
            user=request.user,
            organization=invite.organization,
            role=invite.role
        )

        invite.accepted = True
        invite.save()
        send_accept_email.delay(
            email=request.user.email,
            username=request.user.username,
            organization_name=invite.organization.name
        )

        return Response({"message": "Joined organization"})


# GET-API
class ApiListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        org = get_user_organization(request.user)
        data = APIKey.objects.filter(organization=org
                                     ).select_related('organization')
        serializer = ApiListSerializer(data, many=True)
        return Response(serializer.data)


# CREATE -API
class ApiCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        org = get_user_organization(request.user)
        api = APIKey.objects.create(
            name=request.data['name'],
            organization=org
        )
        return Response({

            "name": api.name,
            "key": str(api.key),
            "organization": api.organization.name
        })


# DELETE - API
class ApiDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        data = get_object_or_404(APIKey, pk=pk)
        data.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
