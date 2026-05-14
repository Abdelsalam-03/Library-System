from django.urls import path

from .views import (
    AdminDashboard,
    UserDashboard,
)

urlpatterns = [
    # Admin 
    path('admin/dashboard/', AdminDashboard.as_view()),
    # User
    path('dashboard/', UserDashboard.as_view()),
]