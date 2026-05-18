from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from accounts.views import RegisterView, LogoutView, UserProfileView, ChangePasswordView, ChangeNameView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='login'), # POST /login
    path('refresh/', TokenRefreshView.as_view(), name='refresh'), # POST /refresh
    path('register/', RegisterView.as_view(), name='register'), # POST /register
    path('logout/', LogoutView.as_view(), name='logout'), # POST /logout
    path('me/', UserProfileView.as_view(), name='me'),  # GET, PATCH /me
    path('change-password/', ChangePasswordView.as_view(), name='change_password'), # POST /change-password
    path('change-name/', ChangeNameView.as_view(), name='change_name'), # POST /change-name
]