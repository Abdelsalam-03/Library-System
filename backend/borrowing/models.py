from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone


class BorrowRecord(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        RETURNED = "returned", "Returned"
        OVERDUE = "overdue", "Overdue"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="borrow_records",
    )
    book_id = models.PositiveIntegerField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    requested_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)
    borrowed_at = models.DateTimeField(null=True, blank=True)
    returned_at = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    renewal_count = models.PositiveIntegerField(default=0)
    rejection_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} - Book #{self.book_id} - {self.status}"

    @property
    def is_overdue(self):
        return (
            self.status == self.Status.APPROVED
            and self.due_date is not None
            and timezone.now() > self.due_date
        )

    def approve(self, days=14):
        now = timezone.now()
        self.status = self.Status.APPROVED
        self.approved_at = now
        self.borrowed_at = now
        self.due_date = now + timedelta(days=days)
        self.rejection_reason = ""

    def reject(self, reason=""):
        self.status = self.Status.REJECTED
        self.rejected_at = timezone.now()
        self.rejection_reason = reason

    def mark_returned(self):
        self.status = self.Status.RETURNED
        self.returned_at = timezone.now()

    def renew(self, days=7):
        self.due_date = self.due_date + timedelta(days=days)
        self.renewal_count += 1
