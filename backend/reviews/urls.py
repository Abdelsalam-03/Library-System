# reviews/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("", views.CreateReviewView.as_view()),                     
    path("book/<int:book_id>/", views.BookReviewsView.as_view()), 
    path("<int:review_id>/", views.ReviewDetailView.as_view()),
]