from rest_framework.urls import path
from ..views.requests_views import friend_request_accept, friend_request_create, friend_request_decline, get_friend_requests

urlpatterns = [
    path('friend/invite/<str:pk>/', friend_request_create),
    path('friend/accept/<str:pk>/', friend_request_accept),
    path('friend/decline/<str:pk>/', friend_request_decline),
    path('friend/all-requests/', get_friend_requests)
]
