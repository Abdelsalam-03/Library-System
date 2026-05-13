from django.urls import path

from .views import (
    AdminBorrowRequestDetailView,
    AdminBorrowRequestsView,
    BorrowBookView,
    MyBorrowingsView,
    RenewBorrowingView,
    ReturnBookView,
    UpdateOverdueBorrowingsView,
)


urlpatterns = [
    path("borrow/", BorrowBookView.as_view(), name="borrow-book"),
    path("return/", ReturnBookView.as_view(), name="return-book"),
    path("renew/", RenewBorrowingView.as_view(), name="renew-borrowing"),
    path("my-borrowings/", MyBorrowingsView.as_view(), name="my-borrowings"),
    path(
        "admin/borrow-requests",
        AdminBorrowRequestsView.as_view(),
        name="admin-borrow-requests-no-slash",
    ),
    path(
        "admin/borrow-requests/",
        AdminBorrowRequestsView.as_view(),
        name="admin-borrow-requests",
    ),
    path(
        "admin/borrow-requests/<int:pk>",
        AdminBorrowRequestDetailView.as_view(),
        name="admin-borrow-request-detail-no-slash",
    ),
    path(
        "admin/borrow-requests/<int:pk>/",
        AdminBorrowRequestDetailView.as_view(),
        name="admin-borrow-request-detail",
    ),
    path(
        "admin/borrowings/update-overdue/",
        UpdateOverdueBorrowingsView.as_view(),
        name="update-overdue-borrowings",
    ),
]
