from django.urls import path
from ..views.search_views import searchUsers

urlpatterns = [
    path('users/q=<str:search_users>', searchUsers),
]
