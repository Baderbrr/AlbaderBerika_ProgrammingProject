from django.db import DatabaseError
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..helpers.helpers import decode_token
from ..models import UserAccount, FriendRequest
from ..serializers.user_serializers import SimpleUserSerializer
from ..serializers.friend_serializer import FriendRequestSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def friend_request_create(request, pk):
    '''
    Create a friend request from authenticated user to user of id = pk
    '''
    token_info = decode_token(request)
    authenticated_user_id = token_info.get('user_id')
    try: 
        authenticated_user = UserAccount.objects.get(id=authenticated_user_id)
        friend_to_invite = UserAccount.objects.get(id=pk)
    except ObjectDoesNotExist:
        return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except DatabaseError:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    try:
        FriendRequest.objects.get(request_from=authenticated_user, request_to=friend_to_invite)
        return Response({"message": "Friend request already exists"}, status=status.HTTP_400_BAD_REQUEST)
    except ObjectDoesNotExist:
        FriendRequest.objects.create(request_from=authenticated_user, request_to=friend_to_invite)
        return Response(status=status.HTTP_201_CREATED)
    except DatabaseError:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def friend_request_accept(request, pk):
    token_info = decode_token(request)
    authenticated_user_id = token_info.get('user_id')
    try: 
        authenticated_user = UserAccount.objects.get(id=authenticated_user_id)
        friend_to_accept = UserAccount.objects.get(id=pk)
    except ObjectDoesNotExist:
        return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        friend_request = FriendRequest.objects.get((Q(request_from=authenticated_user) & Q(request_to=friend_to_accept)) |
                                                    (Q(request_from=friend_to_accept) & Q(request_to=authenticated_user)))
        authenticated_user.friends.add(friend_to_accept)
        authenticated_user.save()

        friend_to_accept.friends.add(authenticated_user)
        friend_to_accept.save()

        friend_request.delete()
    except ObjectDoesNotExist:
        return Response({"message": "Friend request does not exist"}, status=status.HTTP_404_NOT_FOUND)
    except DatabaseError:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    serializer = SimpleUserSerializer(friend_to_accept, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def friend_request_decline(request, pk):
    token_info = decode_token(request)
    authenticated_user_id = token_info.get('user_id')
    try: 
        authenticated_user = UserAccount.objects.get(id=authenticated_user_id)
        friend_to_accept = UserAccount.objects.get(id=pk)
    except ObjectDoesNotExist:
        return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        friend_request = FriendRequest.objects.get(request_from=authenticated_user, request_to=friend_to_accept)
        friend_request.delete()
    except ObjectDoesNotExist:
        return Response({"message": "Friend request does not exist"}, status=status.HTTP_404_NOT_FOUND)
    except DatabaseError:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_friend_requests(request):
    token_info = decode_token(request)
    authenticated_user_id = token_info.get('user_id')
    try: 
        authenticated_user = UserAccount.objects.get(id=authenticated_user_id)
    except ObjectDoesNotExist:
        return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        friend_requests = FriendRequest.objects.filter(request_to=authenticated_user)
        print("asd", authenticated_user.friends)


    except DatabaseError:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    serializer = FriendRequestSerializer(friend_requests, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
