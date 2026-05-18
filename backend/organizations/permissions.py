from rest_framework.permissions import BasePermission

from .models import Membership
class IsOrgMember(BasePermission):
    def has_permission(self, request, view):
        return Membership.objects.filter(user=request.user).exists()



class IsAdminOrOwner(BasePermission):

    def has_permission(self, request, view):
        membership = Membership.objects.filter(
            user=request.user
        ).first()

        return membership.role in ["OWNER", "ADMIN"]