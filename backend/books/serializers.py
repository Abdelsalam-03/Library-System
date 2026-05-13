from rest_framework import serializers
from .models import Book, Genre


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "name"]


class BookSerializer(serializers.ModelSerializer):
    genre_name = serializers.CharField(source="genre.name", read_only=True)

    class Meta:
        model = Book
        fields = ["id", "title", "author", "available", "genre", "genre_name"]