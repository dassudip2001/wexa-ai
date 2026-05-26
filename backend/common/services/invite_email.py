from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings


@shared_task
def send_invite_email(email, inviter_name, organization_name, invite_link):
    subject = f"You are invited to join {organization_name}"
    context = {
        "inviter_name": inviter_name,
        "organization_name": organization_name,
        "invite_link": invite_link
    }

    html_content = render_to_string(
        "emails/invite_email.html",
        context
    )
    email_message = EmailMultiAlternatives(
        subject=subject,
        body=html_content,
        from_email=f"Wexa AI <{settings.EMAIL_HOST_USER}>",
        to=[email],
    )
    email_message.attach_alternative(
        html_content, "text/html"
    )
    email_message.send(fail_silently=False)
