import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import serializers
from .models import ActivityLog
from .permissions import IsAdminRole

BORROWING_API_BASE = getattr(settings, "BORROWING_API_BASE", "http://localhost:8000")


def _get_auth_headers(request):
    auth = request.headers.get("Authorization", "")
    return {"Authorization": auth, "Content-Type": "application/json"}


def log_activity(user, action, description=""):
    """Call this from anywhere to log a user action."""
    ActivityLog.objects.create(user=user, action=action, description=description)


class ActivityLogSerializer(serializers.ModelSerializer):
    action_display = serializers.CharField(source="get_action_display", read_only=True)

    class Meta:
        model = ActivityLog
        fields = ["id", "action", "action_display", "description", "timestamp"]




class MyBorrowingHistoryView(APIView):
    """
    GET /api/history/my/
    Returns the current user's borrowing history from Member 3's service.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            resp = requests.get(
                f"{BORROWING_API_BASE}/api/borrowings/my-borrowings/",
                headers=_get_auth_headers(request),
                timeout=10,
            )
            data = resp.json()

            if resp.status_code == 200:
                return Response({
                    "success": True,
                    "status_code": 200,
                    "data": data,
                    "errors": None,
                })
            else:
                return Response({
                    "success": False,
                    "status_code": resp.status_code,
                    "data": None,
                    "errors": data,
                }, status=resp.status_code)

        except requests.exceptions.ConnectionError:
            return Response({
                "success": False,
                "status_code": 503,
                "data": None,
                "errors": "Borrowing service is unreachable.",
            }, status=503)
        except requests.exceptions.Timeout:
            return Response({
                "success": False,
                "status_code": 504,
                "data": None,
                "errors": "Borrowing service timed out.",
            }, status=504)


class UserBorrowingHistoryView(APIView):
    """
    GET /api/history/user/<user_id>/
    Admin only — returns a specific user's borrowing history.
    Query params: ?status=pending|approved|rejected|returned|overdue
    """
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request, user_id):
        params = {}
        borrow_status = request.query_params.get("status")
        if borrow_status:
            params["status"] = borrow_status

        try:
            resp = requests.get(
                f"{BORROWING_API_BASE}/api/borrowings/admin/borrow-requests/",
                headers=_get_auth_headers(request),
                params=params,
                timeout=10,
            )
            data = resp.json()

            if resp.status_code == 200:
                if isinstance(data, list):
                    filtered = [r for r in data if r.get("user") == user_id]
                else:
                    filtered = data

                return Response({
                    "success": True,
                    "status_code": 200,
                    "data": filtered,
                    "errors": None,
                })
            else:
                return Response({
                    "success": False,
                    "status_code": resp.status_code,
                    "data": None,
                    "errors": data,
                }, status=resp.status_code)

        except requests.exceptions.ConnectionError:
            return Response({
                "success": False,
                "status_code": 503,
                "data": None,
                "errors": "Borrowing service is unreachable.",
            }, status=503)
        except requests.exceptions.Timeout:
            return Response({
                "success": False,
                "status_code": 504,
                "data": None,
                "errors": "Borrowing service timed out.",
            }, status=504)


class MyActivityLogView(APIView):
    """
    GET /api/history/activity/
    Returns the current user's activity log (last 50 actions).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logs = ActivityLog.objects.filter(user=request.user)[:50]
        serializer = ActivityLogSerializer(logs, many=True)
        return Response({
            "success": True,
            "status_code": 200,
            "data": serializer.data,
            "errors": None,
        })


class UserActivityLogView(APIView):
    """
    GET /api/history/activity/<user_id>/
    Admin only — returns a specific user's activity log.
    """
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request, user_id):
        logs = ActivityLog.objects.filter(user_id=user_id)[:50]
        serializer = ActivityLogSerializer(logs, many=True)
        return Response({
            "success": True,
            "status_code": 200,
            "data": serializer.data,
            "errors": None,
        })