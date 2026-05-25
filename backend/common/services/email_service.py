from celery import shared_task
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string


@shared_task
def send_welcome_email(email,username):
    subject = "Welcome to Wexa AI 🚀"
    context = {
        "username": username,
    }
    # message = f"""
    #     Hi ,
    #
    #     Welcome to our platform.
    #     """
    # send_mail(
    #     subject=subject,
    #     message=message,
    #     from_email=settings.EMAIL_HOST_USER,
    #     recipient_list=[email],
    #     fail_silently=False, )
    # HTML version
    html_content = render_to_string(
        "emails/welcome_email.html",
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
