from rest_framework import serializers

from .models import BorrowRecord

from books.models import Book

class BorrowRecordSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)

    class Meta:
        model = BorrowRecord
        fields = [
            "id",
            "user",
            "username",
            "status",
            "requested_at",
            "approved_at",
            "rejected_at",
            "borrowed_at",
            "returned_at",
            "due_date",
            "renewal_count",
            "rejection_reason",
            "is_overdue",
            "book",
        ]
        read_only_fields = [
            "id",
            "user",
            "username",
            "status",
            "requested_at",
            "approved_at",
            "rejected_at",
            "borrowed_at",
            "returned_at",
            "due_date",
            "renewal_count",
            "rejection_reason",
            "is_overdue",
        ]

class BorrowCreateSerializer(serializers.Serializer):
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(),
        source='book'
    )
    
    class Meta:
        model = BorrowRecord
        fields = ['book_id']


class BorrowRecordIdSerializer(serializers.Serializer):
    borrow_id = serializers.PrimaryKeyRelatedField(
        queryset=BorrowRecord.objects.all(),
        source="borrow_record",
    )


class BorrowRequestActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=["approve", "reject"])
    rejection_reason = serializers.CharField(required=False, allow_blank=True)
