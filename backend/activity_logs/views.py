from django.shortcuts import render

from books.models import Book
from borrowing.models import BorrowRecord
from borrowing.serializers import BorrowRecordSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db.models import F
from accounts.models import CustomUser
from accounts.permissions import IsAdminRole
from .serializers import CustomerLogSerializer, BookLogSerializer
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta

class CustomerLog(APIView):

    permission_classes = [IsAdminRole]

    def get(self, request):

        serializer = CustomerLogSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']

        borrow_requests = BorrowRecord.objects.filter(user=user)

        borrow_serializer = BorrowRecordSerializer(
            borrow_requests,
            many=True
        )

        return Response(
            status=status.HTTP_200_OK,
            data={
                'borrow_requests': borrow_serializer.data,
            }
        )
        
        
class BookLog(APIView):

    permission_classes = [IsAdminRole]

    def get(self, request):

        serializer = BookLogSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        book = serializer.validated_data['book']

        borrow_requests = BorrowRecord.objects.filter(book=book)

        borrow_serializer = BorrowRecordSerializer(
            borrow_requests,
            many=True
        )

        return Response(
            status=status.HTTP_200_OK,
            data={
                'borrow_requests': borrow_serializer.data,
            }
        )
