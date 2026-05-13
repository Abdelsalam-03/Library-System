from django.conf import settings
from django.db import models


class ActivityLog(models.Model):
    class Action(models.TextChoices):
        LOGIN = "login", "Login"
        LOGOUT = "logout", "Logout"
        BORROW_REQUEST = "borrow_request", "Borrow Request"
        BORROW_APPROVED = "borrow_approved", "Borrow Approved"
        BORROW_REJECTED = "borrow_rejected", "Borrow Rejected"
        BOOK_RETURNED = "book_returned", "Book Returned"
        REVIEW_CREATED = "review_created", "Review Created"
        REVIEW_UPDATED = "review_updated", "Review Updated"
        REVIEW_DELETED = "review_deleted", "Review Deleted"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="activity_logs",
    )
    action = models.CharField(max_length=50, choices=Action.choices)
    description = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.user} - {self.action} - {self.timestamp}"