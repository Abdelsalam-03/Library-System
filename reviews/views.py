from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Review
from history.models import ActivityLog
from history.views import log_activity


def format_review(review):
    return {
        "id": review.id,
        "user": {
            "id": review.user.id,
            "username": review.user.username,
        },
        "book_id": review.book_id,
        "rating": review.rating,
        "comment": review.comment,
        "created_at": review.created_at.isoformat(),
        "updated_at": review.updated_at.isoformat(),
    }


class CreateReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        book_id = request.data.get("book_id")
        rating = request.data.get("rating")
        comment = request.data.get("comment", "")

        errors = {}
        if book_id is None:
            errors["book_id"] = "This field is required."
        if rating is None:
            errors["rating"] = "This field is required."
        elif not isinstance(rating, int) or not (1 <= rating <= 5):
            errors["rating"] = "Rating must be an integer between 1 and 5."

        if errors:
            return Response({
                "success": False,
                "status_code": 400,
                "data": None,
                "errors": errors,
            }, status=status.HTTP_400_BAD_REQUEST)

        if Review.objects.filter(user=request.user, book_id=book_id).exists():
            return Response({
                "success": False,
                "status_code": 400,
                "data": None,
                "errors": {"detail": "You have already reviewed this book."},
            }, status=status.HTTP_400_BAD_REQUEST)

        review = Review.objects.create(
            user=request.user,
            book_id=book_id,
            rating=rating,
            comment=comment,
        )

        log_activity(
            request.user,
            ActivityLog.Action.REVIEW_CREATED,
            f"Reviewed Book #{book_id} with {rating} stars.",
        )

        return Response({
            "success": True,
            "status_code": 201,
            "data": format_review(review),
            "errors": None,
        }, status=status.HTTP_201_CREATED)


class BookReviewsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, book_id):
        reviews = Review.objects.filter(book_id=book_id).order_by("-created_at")
        return Response({
            "success": True,
            "status_code": 200,
            "data": [format_review(r) for r in reviews],
            "errors": None,
        }, status=status.HTTP_200_OK)


class ReviewDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, review_id):
        review = get_object_or_404(Review, pk=review_id)

        if review.user != request.user:
            return Response({
                "success": False,
                "status_code": 403,
                "data": None,
                "errors": {"detail": "You do not have permission to edit this review."},
            }, status=status.HTTP_403_FORBIDDEN)

        rating = request.data.get("rating")
        if rating is not None:
            if not isinstance(rating, int) or not (1 <= rating <= 5):
                return Response({
                    "success": False,
                    "status_code": 400,
                    "data": None,
                    "errors": {"rating": "Rating must be an integer between 1 and 5."},
                }, status=status.HTTP_400_BAD_REQUEST)
            review.rating = rating

        if "comment" in request.data:
            review.comment = request.data["comment"]

        review.save()

        log_activity(
            request.user,
            ActivityLog.Action.REVIEW_UPDATED,
            f"Updated review on Book #{review.book_id}.",
        )

        return Response({
            "success": True,
            "status_code": 200,
            "data": format_review(review),
            "errors": None,
        }, status=status.HTTP_200_OK)

    def delete(self, request, review_id):
        review = get_object_or_404(Review, pk=review_id)

        if review.user != request.user and not request.user.is_staff:
            return Response({
                "success": False,
                "status_code": 403,
                "data": None,
                "errors": {"detail": "You do not have permission to delete this review."},
            }, status=status.HTTP_403_FORBIDDEN)

        book_id = review.book_id
        review.delete()

        log_activity(
            request.user,
            ActivityLog.Action.REVIEW_DELETED,
            f"Deleted review on Book #{book_id}.",
        )

        return Response({
            "success": True,
            "status_code": 200,
            "data": {"detail": "Review deleted successfully."},
            "errors": None,
        }, status=status.HTTP_200_OK)