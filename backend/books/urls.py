from django.urls import path

from .views import (
    GenreAdminListCreateAPIView,
    GenreAdminDetailAPIView,
    BookAdminListCreateAPIView,
    BookAdminDetailAPIView,
    UserGenreListAPIView,
    UserBookListAPIView,
    UserBookDetailAPIView
)

urlpatterns = [
    # Admin
    
    # GENRES
    path('admin/genres/', GenreAdminListCreateAPIView.as_view()),
    path( 'admin/genres/<int:pk>/', GenreAdminDetailAPIView.as_view()),
    # BOOKS
    path('admin/books/', BookAdminListCreateAPIView.as_view()),
    path('admin/books/<int:pk>/', BookAdminDetailAPIView.as_view()),
    
    # User
    
    # GENRES
    path('genres/', UserGenreListAPIView.as_view()),
    # BOOKS
    path('books/', UserBookListAPIView.as_view()),
    path('books/<int:pk>/', UserBookDetailAPIView.as_view()),
]