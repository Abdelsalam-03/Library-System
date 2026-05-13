from django.urls import path
from . import views

urlpatterns = [
    
    path('books', views.books_list),
    path('books/<int:pk>', views.book_detail),

    
    path('genres', views.genres_list),

      path('books/statistics', views.book_statistics),

]