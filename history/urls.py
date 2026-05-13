from django.urls import path
from .views import (
    MyBorrowingHistoryView,
    UserBorrowingHistoryView,
    MyActivityLogView,
    UserActivityLogView,
)

urlpatterns = [
    path("my/", MyBorrowingHistoryView.as_view(), name="my_history"),
    path("user/<int:user_id>/", UserBorrowingHistoryView.as_view(), name="user_history"),
    path("activity/", MyActivityLogView.as_view(), name="my_activity"),
    path("activity/<int:user_id>/", UserActivityLogView.as_view(), name="user_activity"),
]