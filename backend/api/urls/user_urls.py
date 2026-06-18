from django.urls import path
from ..views.user_views import registerUser, getUserProfileBasedOnUrl, editProfileData, deleteFriend, getAllFriends
from ..views.auth_views import MyTokenObtainPairView

urlpatterns = [
    path("register/", registerUser),
    path('login/', MyTokenObtainPairView.as_view()),
    path('profile/<str:pk>/', getUserProfileBasedOnUrl),
    path('edit/', editProfileData),
    path('delete/<str:pk>/', deleteFriend),
    path('get/allFriends/', getAllFriends)
]
