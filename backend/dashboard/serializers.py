from rest_framework import serializers
from books.models import Book
from borrowing.models import BorrowRecord

class BookAdminDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'available']
        
class BorrowRecordSerializer(serializers.ModelSerializer):

    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.SerializerMethodField()
    
    book_id = serializers.IntegerField(source='book.id', read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)

    class Meta:
        model = BorrowRecord
        fields = [
            'id',
            'user_id',
            'username',
            'book_id',
            'book_title',
            'requested_at',
            'status',
        ]
    def get_username(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    
class BorrowRecordSerializer(serializers.ModelSerializer):

    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.SerializerMethodField()
    
    book_id = serializers.IntegerField(source='book.id', read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_author = serializers.CharField(source='book.author', read_only=True)

    class Meta:
        model = BorrowRecord
        fields = [
            'id',
            'user_id',
            'username',
            'book_id',
            'book_title',
            'book_author',
            'requested_at',
            'due_date',
            'status',
        ]
    def get_username(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"