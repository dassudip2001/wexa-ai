from django.contrib import admin
from .models import Event
# Register your models here.
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        "event_name",
        "organization",
        "created_at",
    )

    list_filter = (
        "organization",
        "created_at",
    )

    search_fields = (
        "event_name",
        "organization__name",
    )

    readonly_fields = ("created_at",)

    ordering = ("-created_at",)