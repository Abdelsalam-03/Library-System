from django.urls import path

from .views import (
    CustomerLog,
    BookLog,
)

urlpatterns = [
    # Admin 
    path('admin/customer/log', CustomerLog.as_view()),
    path('admin/book/log', BookLog.as_view()),
    # User
    # path('dashboard/', UserDashboard.as_view()),
]