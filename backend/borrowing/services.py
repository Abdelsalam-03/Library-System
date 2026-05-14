from django.db import transaction
from rest_framework.exceptions import ValidationError

from .models import BorrowRecord


DEFAULT_BORROW_DAYS = 14
DEFAULT_RENEW_DAYS = 7
MAX_RENEWALS = 2


def create_borrow_request(user, book_id):
    active_exists = BorrowRecord.objects.filter(
        user=user,
        book_id=book_id,
        status__in=[BorrowRecord.Status.PENDING, BorrowRecord.Status.APPROVED],
    ).exists()

    if active_exists:
        raise ValidationError("You already have an active borrow request for this book.")

    return BorrowRecord.objects.create(user=user, book_id=book_id)


@transaction.atomic
def approve_borrow_request(borrow_record):
    if borrow_record.status != BorrowRecord.Status.PENDING:
        raise ValidationError("Only pending requests can be approved.")
    if borrow_record.book.available < 1:
        raise ValidationError("Book is not available.")

    borrow_record.approve(days=DEFAULT_BORROW_DAYS)
    borrow_record.save()
    return borrow_record


@transaction.atomic
def reject_borrow_request(borrow_record, reason=""):
    if borrow_record.status != BorrowRecord.Status.PENDING:
        raise ValidationError("Only pending requests can be rejected.")

    borrow_record.reject(reason=reason)
    borrow_record.save()
    return borrow_record


@transaction.atomic
def return_book(user, borrow_record):
    if borrow_record.user_id != user.id:
        raise ValidationError("You can only return your own borrowed books.")

    if borrow_record.status != BorrowRecord.Status.APPROVED:
        raise ValidationError("Only approved borrowings can be returned.")

    borrow_record.mark_returned()
    borrow_record.save()
    return borrow_record


@transaction.atomic
def renew_borrowing(user, borrow_record):
    if borrow_record.user_id != user.id:
        raise ValidationError("You can only renew your own borrowed books.")

    if borrow_record.status != BorrowRecord.Status.APPROVED:
        raise ValidationError("Only approved borrowings can be renewed.")

    if borrow_record.is_overdue:
        raise ValidationError("Overdue borrowings cannot be renewed.")

    if borrow_record.renewal_count >= MAX_RENEWALS:
        raise ValidationError("Maximum renewals reached.")

    borrow_record.renew(days=DEFAULT_RENEW_DAYS)
    borrow_record.save()
    return borrow_record
