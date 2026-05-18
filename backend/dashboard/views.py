from django.shortcuts import render

from books.models import Book
from borrowing.models import BorrowRecord
from rest_framework.response import Response
from rest_framework import status
from django.db.models import F
from accounts.models import CustomUser
from accounts.permissions import IsAdminRole
from .serializers import BookAdminDashboardSerializer, BorrowRecordSerializer
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta
from rest_framework.permissions import IsAuthenticated


class AdminDashboard(APIView):
    permission_classes = [IsAdminRole]
    def get(self, request):
        total_books = Book.objects.count()
        available_books = Book.objects.filter(available__gt=0).count()
        borrowed_books = Book.objects.filter(copies__gt=F('available')).count() 
        total_customers = CustomUser.objects.filter(role="USER").count()
        
        recent_books = Book.objects.order_by('-id')[:5]
        recent_books_data = BookAdminDashboardSerializer(recent_books, many=True).data
        
        recent_borrow_requests = BorrowRecord.objects.order_by('-id')[:5]
        recent_borrow_requests_data = BorrowRecordSerializer(recent_borrow_requests, many=True).data
        
        return Response(
            status=status.HTTP_200_OK,   
            data={
                'total_books': total_books,
                'available_books': available_books,
                'borrowed_books': borrowed_books,
                'total_customers': total_customers,
                'recent_books': recent_books_data,
                'recent_borrow_requests': recent_borrow_requests_data,
            }
        )
        
class UserDashboard(APIView):
    def get(self, request):
        
        now = timezone.now()
        in_3_days = now + timedelta(days=3)
        
        base_qs = BorrowRecord.objects.filter(user=request.user)
        
        currently_borrowing = base_qs.filter(
            status=BorrowRecord.Status.APPROVED
        ).count()

        due_soon = base_qs.filter(
            status=BorrowRecord.Status.APPROVED,
            due_date__range=(now, in_3_days)
        ).count()

        over_due = base_qs.filter(
            status=BorrowRecord.Status.OVERDUE
        ).count()

        total_borrowed = base_qs.exclude(
            status=BorrowRecord.Status.REJECTED
        ).count()
        
        recent_borrow_requests = BorrowRecord.objects.filter(
            user=request.user,
        ).order_by('-id')[:5]
        recent_borrow_requests_data = BorrowRecordSerializer(recent_borrow_requests, many=True).data
        
        return Response(
            status=status.HTTP_200_OK,   
            data={
                'currently_borrowing': currently_borrowing,
                'due_soon': due_soon,
                'over_due': over_due,
                'total_borrowed': total_borrowed,
                'recent_borrowed': recent_borrow_requests_data,
            }
        )
