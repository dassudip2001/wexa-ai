from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings


@shared_task
def send_welcome_email(email,):
    subject = "Welcome to Our App"
    message = f"""
        Hi ,

        Welcome to our platform.
        """
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
        fail_silently=False, )
