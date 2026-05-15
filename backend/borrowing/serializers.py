from rest_framework import serializers

from .models import BorrowRecord

from books.models import Book

class BorrowRecordSerializer(serializers.ModelSerializer):
    # User info
    username = serializers.SerializerMethodField()

    # Book info
    book_title = serializers.CharField(
        source="book.title",
        read_only=True
    )

    available_copies = serializers.IntegerField(
        source="book.available",
        read_only=True
    )

    # Computed fields
    is_overdue = serializers.BooleanField(read_only=True)

    class Meta:
        model = BorrowRecord

        fields = [
            # Primary info
            "id",
            "status",

            # User
            "user",
            "username",

            # Book
            "book",
            "book_title",
            "available_copies",

            # Dates
            "requested_at",
            "approved_at",
            "rejected_at",
            "borrowed_at",
            "returned_at",
            "due_date",

            # Other
            "renewal_count",
            "rejection_reason",
            "is_overdue",
        ]

        read_only_fields = fields

    def get_username(self, obj):
        first_name = obj.user.first_name or ""
        last_name = obj.user.last_name or ""

        full_name = f"{first_name} {last_name}".strip()

        # fallback if both are empty
        return full_name or obj.user.username

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
