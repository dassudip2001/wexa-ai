from .models import Membership

def get_user_organization(user):
    membership=Membership.objects.filter(user=user).first()
    return  membership.organization if membership else None