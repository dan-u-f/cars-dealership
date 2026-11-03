from django.contrib import admin
from .models import Dealer, Review


@admin.register(Dealer)
class DealerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "city",
        "state")
    search_fields = (
        "full_name",
        "city",
        "state")
    list_filter = ("state",)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "dealer",
        "user",
        "purchase",
        "created_at")
    list_filter = ("purchase", "created_at")