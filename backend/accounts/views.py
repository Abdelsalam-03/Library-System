from accounts.models import CustomUser
from django.core.exceptions import ValidationError
from accounts.serializers import ChangePasswordSerializer
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework import generics
from .serializers import RegisterSerializer, UserSerializer, ChangeNameSerializer

from rest_framework.permissions import AllowAny, IsAuthenticated



class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
   permission_classes = (IsAuthenticated,)
   serializer_class = UserSerializer

   def get_object(self):
       return self.request.user
    

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        except TokenError:
            raise ValidationError("Token is invalid or expired")


class ChangePasswordView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})

        serializer.is_valid(raise_exception=True)

        user = request.user

        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)

class ChangeNameView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):

        serializer = ChangeNameSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            
            user = request.user
            user.username = serializer.validated_data["username"]
            user.save()
            return Response({"message": "Name changed successfully"}, status=status.HTTP_200_OK)

        return Response({"message": "Name not changed"}, status=status.HTTP_400_OK)

        
        