from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

@shared_task
def send_accept_email(email, username, organization_name):
    subject = f"Welcome to {organization_name} 🎉"

    context = {
        "username": username,
        "organization_name": organization_name,
    }

    html_content = render_to_string(
        "emails/accept_invite_email.html",
        context
    )

    email_message = EmailMultiAlternatives(
        subject=subject,
        body=html_content,
        from_email=f"Wexa AI <{settings.EMAIL_HOST_USER}>",
        to=[email],
    )

    email_message.attach_alternative(html_content, "text/html")
    email_message.send(fail_silently=False)