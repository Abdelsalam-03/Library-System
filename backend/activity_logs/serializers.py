from rest_framework import serializers

from  accounts.models import CustomUser
from  books.models import Book

class CustomerLogSerializer(serializers.Serializer):

    user_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        source='user'
    )
    
class BookLogSerializer(serializers.Serializer):

    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(),
        source='book'
    )
    