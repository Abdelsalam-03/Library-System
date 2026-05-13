from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Book, Genre
from .serializers import BookSerializer, GenreSerializer


# =========================
# BOOK APIs
# =========================

@api_view(['GET', 'POST'])
def books_list(request):
    if request.method == 'GET':
        books = Book.objects.all()

        # 🔍 filtering
        search = request.GET.get('search')
        if search:
            books = books.filter(title__icontains=search)

        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def book_detail(request, pk):
    try:
        book = Book.objects.get(id=pk)
    except Book.DoesNotExist:
        return Response({"error": "Book not found"}, status=404)

    if request.method == 'GET':
        serializer = BookSerializer(book)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        book.delete()
        return Response({"message": "Deleted successfully"}, status=204)


# =========================
# GENRE APIs
# =========================

@api_view(['GET', 'POST'])
def genres_list(request):
    if request.method == 'GET':
        genres = Genre.objects.all()
        serializer = GenreSerializer(genres, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = GenreSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
from django.db.models import Count
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Book, Genre

@api_view(['GET'])
def book_statistics(request):
    total_books = Book.objects.count()
    available_books = Book.objects.filter(available=True).count()
    unavailable_books = Book.objects.filter(available=False).count()

    genres_stats = Genre.objects.annotate(
        book_count=Count('book')
    ).values('name', 'book_count')

    return Response({
        "total_books": total_books,
        "available_books": available_books,
        "unavailable_books": unavailable_books,
        "books_per_genre": list(genres_stats)
    })