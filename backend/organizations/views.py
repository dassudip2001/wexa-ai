from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from organizations.models import Invitation, Membership
from organizations.permissions import IsAdminOrOwner
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
