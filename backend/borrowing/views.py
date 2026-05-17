from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import BorrowRecord
from .permissions import IsAdminRole
from .serializers import (
    BorrowCreateSerializer,
    BorrowRecordIdSerializer,
    BorrowRecordSerializer,
    BorrowRequestActionSerializer,
)
from .services import (
    approve_borrow_request,
    create_borrow_request,
    reject_borrow_request,
    renew_borrowing,
    return_book,
)


class BorrowBookView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BorrowCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.validated_data['book'].available < 1:
            return Response(
                'Book is not available for now',
                status=status.HTTP_404_NOT_FOUND
            )
        borrow_record = create_borrow_request(
            user=request.user,
            book_id=serializer.validated_data['book'].id,
        )
        
        return Response(
            BorrowRecordSerializer(borrow_record).data,
            status=status.HTTP_201_CREATED,
        )


class ReturnBookView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BorrowRecordIdSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        borrow_record = return_book(
            user=request.user,
            borrow_record=serializer.validated_data["borrow_record"],
        )
        return Response(BorrowRecordSerializer(borrow_record).data)


class RenewBorrowingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BorrowRecordIdSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        borrow_record = renew_borrowing(
            user=request.user,
            borrow_record=serializer.validated_data["borrow_record"],
        )
        return Response(BorrowRecordSerializer(borrow_record).data)


class MyBorrowingsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BorrowRecordSerializer

    def get_queryset(self):
        return BorrowRecord.objects.filter(user=self.request.user)


class AdminBorrowRequestsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsAdminRole]
    serializer_class = BorrowRecordSerializer

    def get_queryset(self):
        queryset = BorrowRecord.objects.select_related("user")
        borrow_status = self.request.query_params.get("status")
        if borrow_status:
            queryset = queryset.filter(status=borrow_status)
        return queryset


class AdminBorrowRequestDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def patch(self, request, pk):
        borrow_record = generics.get_object_or_404(BorrowRecord, pk=pk)
        serializer = BorrowRequestActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if serializer.validated_data["action"] == "approve":
            borrow_record = approve_borrow_request(borrow_record)
        else:
            borrow_record = reject_borrow_request(
                borrow_record,
                reason=serializer.validated_data.get("rejection_reason", ""),
            )

        return Response(BorrowRecordSerializer(borrow_record).data)


class UpdateOverdueBorrowingsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request):
        updated_count = BorrowRecord.objects.filter(
            status=BorrowRecord.Status.APPROVED,
            due_date__lt=timezone.now(),
        ).update(status=BorrowRecord.Status.OVERDUE)
        return Response({"updated_count": updated_count})
