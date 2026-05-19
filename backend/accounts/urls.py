from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)
from django.urls import path
from .views import GetUserView, LogoutView, SignUpView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('get-user', GetUserView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('signup/', SignUpView.as_view())
]
