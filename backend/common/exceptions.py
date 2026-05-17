from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        response = Response({
            "detail": "Internal server error, please try again later",
            "error": str(exc)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response
    