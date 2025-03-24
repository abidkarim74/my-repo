from .views import HomeFeedView, PostDetailView, CommentListView, CatagoryListView
from django.urls import path


urlpatterns = [
    path("posts/", HomeFeedView.as_view()),
    path("pins/<str:pk>/", PostDetailView.as_view()),
    path("pins/<str:postID>/comments/", CommentListView.as_view()),
    path("categories/", CatagoryListView.as_view())
]