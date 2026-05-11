from django.contrib import admin

from .models import BorrowRecord


@admin.register(BorrowRecord)
class BorrowRecordAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "book_id",
        "status",
        "requested_at",
        "due_date",
        "renewal_count",
    ]
    list_filter = ["status", "requested_at", "due_date"]
    search_fields = ["user__username", "user__email", "book_id"]
    readonly_fields = [
        "requested_at",
        "approved_at",
        "rejected_at",
        "borrowed_at",
        "returned_at",
        "created_at",
        "updated_at",
    ]
