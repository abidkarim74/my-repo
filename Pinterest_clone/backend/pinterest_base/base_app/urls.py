from django.urls import path
from .views import (
    CustomUserDetailView,
    CustomTokenObtainPairView,
    CustonRefreshTokenView,
    is_authenticated,
    logout,
    FollowingDetailCreateView
)




urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustonRefreshTokenView.as_view(), name='token_refresh'),
    path("user-profile/<str:pk>/", CustomUserDetailView.as_view()),
    path("authenticated/", is_authenticated),
    path("is_following/<str:username>/", FollowingDetailCreateView.as_view()),
    path("logout/", logout),
]