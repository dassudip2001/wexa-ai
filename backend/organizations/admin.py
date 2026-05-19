from django.contrib import admin

from organizations.models import Organization, Membership, Invitation, APIKey


# Register your models here.
@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug", "created_at")
    search_fields = ("name", "slug")
    readonly_fields = ("created_at",)


@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ("user", "organization", "role", "joined_at")
    list_filter = ("role", "organization")
    search_fields = ("user__username", "organization__name")


@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    list_display = ("email", "organization", "role", "token", "accepted")
    list_filter = ("role", "organization", "accepted")
    search_fields = ("email",)

@admin.register(APIKey)
class ApiKeyAdmin(admin.ModelAdmin):
    list_display = ("id", "organization", "name", "key", "is_active", "created_at")
    list_filter = ("is_active", "organization")
    search_fields = ("name", "key")