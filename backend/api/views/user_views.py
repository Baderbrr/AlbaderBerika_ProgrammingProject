from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from django.db.utils import IntegrityError
from ..serializers.user_serializers import UserSerializerWithToken, UserSerializer, SimpleUserSerializer
from ..helpers.helpers import decode_token

User = get_user_model()

@api_view(["POST"])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create_user(
            email=data.get('email'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            nick_name=data.get('nick_name'),
            bio=data.get('bio'),
            password=data.get('password')
        )

        user.save()
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except IntegrityError:
        message = {
            'detail': 'User with this email already exists'
        }
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    try:
        user = request.user
    except ObjectDoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(user, many=False, context={'authenticated_user':user})
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getUserProfileBasedOnUrl(request, pk):
    try:
        user_profile = User.objects.get(id=pk)
    except ObjectDoesNotExist:
        return Response({"message": "No user with given credentials"}, status=status.HTTP_404_NOT_FOUND)
    token_info = decode_token(request)
    authenticated_user_id = token_info.get('user_id')
    authenticated_user = User.objects.get(id=authenticated_user_id)
    serializer = UserSerializer(user_profile, many=False, context={'authenticated_user':authenticated_user})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def editProfileData(request):
    token_info = decode_token(request)
    authenticated_user_id = token_info.get('user_id')
    try:
        authenticated_user = User.objects.get(id=authenticated_user_id)
    except ObjectDoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    data = request.data
    for field, value in data.items():
        if value != "":
            setattr(authenticated_user, field, value)
    
    authenticated_user.save()
    

    return Response(status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def deleteFriend(request, pk):
    # decoding who is requesting from the token (logged in user)
    token_info = decode_token(request)
    authenticated_user_id = token_info.get('user_id')
    authenticated_user = User.objects.get(id=authenticated_user_id) # looking for the logged in user in the database
    friend_to_delete = User.objects.get(id=pk) # looking for a friend to delete based on url we are accessing this view

    authenticated_user.Friends.remove(friend_to_delete) # removing this friend from the friend list
    authenticated_user.save()
    
    friend_to_delete.Friends.remove(authenticated_user) # removing me from friend list
    friend_to_delete.save()

    return Response(status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getAllFriends(request):
    # decoding who is requesting from the token (logged in user)
    token_info = decode_token(request)
    authenticated_user_id = token_info.get('user_id')
    authenticated_user = User.objects.get(id=authenticated_user_id) # looking for the logged in user in the database
    friends = authenticated_user.Friends.all()
    serializer = SimpleUserSerializer(friends, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

