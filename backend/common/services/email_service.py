from django.core.mail import send_mail
from django.conf import settings


def send_welcome_email(user):
    subject = "Welcome to Our App"
    message = f"""
        Hi {user.first_name},

        Welcome to our platform.
        """
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user.email],
        fail_silently=False, )
