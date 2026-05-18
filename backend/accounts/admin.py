from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User

# Register your models here.
from organizations.models import  Membership


class MembershipInline(admin.TabularInline):
    model = Membership
    extra = 1


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    inlines = [MembershipInline]

    list_display = ("username", "email", "is_staff", "is_active")
    search_fields = ("username", "email")


