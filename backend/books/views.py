from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Genre, Book
from .serializers import GenreSerializer, BookUserSerializer, BookAdminSerializer
from django.http import JsonResponse
from accounts.permissions import IsAdminRole
from django.db.models import F
from rest_framework.decorators import api_view

# def get_books(request):
#     data = [
#         {"id": 1, "title": "Atomic Habits"},
#         {"id": 2, "title": "Clean Code"}
#     ]
#     return JsonResponse(data, safe=False)

@api_view(['GET'])
def getBooksStats(request):
    total_books = Book.objects.count()
    available_books = Book.objects.filter(available__gt=0).count()
    borrowed_books = Book.objects.filter(copies__gt=F('available')).count() 
    total_genres = Genre.objects.count()
    return Response(
        status=status.HTTP_200_OK,   
        data={
            'total_books': total_books,
            'available_books': available_books,
            'borrowed_books': borrowed_books,
            'total_genres': total_genres
        }
    )

class GenreAdminListCreateAPIView(APIView):
    permission_classes = [IsAdminRole]
    def get(self, request):

        genres = Genre.objects.all()

        serializer = GenreSerializer(genres, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        
        serializer = GenreSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class GenreAdminDetailAPIView(APIView):
    permission_classes = [IsAdminRole]
    def get_object(self, pk):

        try:
            return Genre.objects.get(pk=pk)

        except Genre.DoesNotExist:
            return None

    def get(self, request, pk):

        genre = self.get_object(pk)

        if not genre:
            return Response(
                'Genre not found',
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = GenreSerializer(genre)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):

        genre = self.get_object(pk)

        if not genre:
            return Response(
                'Genre not found',
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = GenreSerializer(
            genre,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):

        genre = self.get_object(pk)

        if not genre:
            return Response(
                'Genre not found',
                status=status.HTTP_404_NOT_FOUND
            )

        genre.delete()

        return Response(
            'Genre deleted successfully',
            status=status.HTTP_204_NO_CONTENT
        )   
        
class BookAdminListCreateAPIView(APIView):
    permission_classes = [IsAdminRole]
    def get(self, request):

        genre_query = request.query_params.get('genre')
        available_query = request.query_params.get('available')
        query = request.query_params.get('query')

        books = Book.objects.all()

        if query:
            books = books.filter(title__icontains=query) | books.filter(author__icontains=query)

        if genre_query:
            books = books.filter(genre=genre_query)

        if available_query is not None:
            available = int(available_query)
            
            if available:
                books = books.filter(available__gt=0)
            else:
                books = books.filter(available__lte=0)

        serializer = BookAdminSerializer(
            books,
            many=True
        )

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):

        serializer = BookAdminSerializer(
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class BookAdminDetailAPIView(APIView):
    permission_classes = [IsAdminRole]

    def get_object(self, pk):

        try:
            return Book.objects.select_related(
                'genre'
            ).get(pk=pk)

        except Book.DoesNotExist:
            return None

    def get(self, request, pk):

        book = self.get_object(pk)

        if not book:
            return Response(
                'Book not found',
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BookAdminSerializer(book)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):

        book = self.get_object(pk)

        if not book:
            return Response(
                'Book not found',
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BookAdminSerializer(
            book,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def patch(self, request, pk):

        book = self.get_object(pk)

        if not book:
            return Response(
                'Book not found',
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BookAdminSerializer(
            book,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):

        book = self.get_object(pk)

        if not book:
            return Response(
                'Book not found',
                status=status.HTTP_404_NOT_FOUND
            )

        book.delete()

        return Response(
            'Book deleted successfully',
            status=status.HTTP_204_NO_CONTENT
        )
 
 
class UserGenreListAPIView(APIView):

    def get(self, request):
        
        genres = Genre.objects.all()

        serializer = GenreSerializer(
            genres,
            many=True
        )

        return Response(serializer.data, status=status.HTTP_200_OK)

class UserBookListAPIView(APIView):

    def get(self, request):

        books = Book.objects.all()

        serializer = BookUserSerializer(
            books,
            many=True
        )

        return Response(serializer.data)
    
class UserBookDetailAPIView(APIView):

    def get_object(self, pk):
        try:
            return Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            return None

    def get(self, request, pk):

        book = self.get_object(pk)

        if not book:
            return Response(
                "Book not found",
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BookUserSerializer(book)

        return Response(serializer.data, status=status.HTTP_200_OK)
