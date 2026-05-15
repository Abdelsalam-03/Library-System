from django.urls import path
from .views import (
    MyBorrowingHistoryView,
    UserBorrowingHistoryView,
    MyActivityLogView,
    UserActivityLogView,
    BookLogView,
    CustomerLogView,
)

urlpatterns = [
    path("borrow/my/", MyBorrowingHistoryView.as_view(), name="my_history"),
    path("activity/", MyActivityLogView.as_view(), name="my_activity"),
    path("activity/<int:user_id>/", UserActivityLogView.as_view(), name="user_activity"),
    path("admin/activity/book/<int:book_id>", BookLogView.as_view(), name="book_history"),
    path('admin/activity/user/<int:user_id>', CustomerLogView.as_view(), name="user_history")
]