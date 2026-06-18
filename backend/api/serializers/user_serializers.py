from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from .friend_serializer import FriendRequestSerializer
from ..models import FriendRequest

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    is_friend = serializers.SerializerMethodField(read_only=True)
    authenticated_user = serializers.SerializerMethodField(read_only=True)
    friend_invitation_exists = serializers.SerializerMethodField(read_only=True)
    friend_invitation_from_requested_user_exists = serializers.SerializerMethodField(read_only=True)
    number_of_friends = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'nick_name', 'bio', 
              'is_friend', 'authenticated_user', 'friend_invitation_exists',
                  'friend_invitation_from_requested_user_exists', 'number_of_friends']
    
    def get_number_of_friends(self, obj):
        return obj.friends.count()

    def get_is_friend(self, obj):
        auth_user = self.context.get('authenticated_user')
        if auth_user in obj.friends.all():
            return True
        else: return False

    def get_authenticated_user(self, obj):
        '''
        Returns true if requested user is the authenticated user
        '''
        auth_user = self.context.get('authenticated_user')
        if auth_user == obj:
            return True
        else: return False
    
    def get_friend_invitation_exists(self, obj):
        '''
        Returns true if friend invitation from authenticated user to requested exists in database
        '''
        auth_user = self.context.get('authenticated_user')
        try:
            friend_request = FriendRequest.objects.get(request_from=auth_user, request_to=obj)
            if friend_request: return True
            else: return False
        except ObjectDoesNotExist:
            return False
        
    def get_friend_invitation_from_requested_user_exists(self, obj):
        '''
        Returns true if friend invitation from requested user to authenticated user exists in database
        '''
        auth_user = self.context.get('authenticated_user')
        try:
            friend_request = FriendRequest.objects.get(request_from=obj, request_to=auth_user)
            if friend_request: return True
            else: return False
        except ObjectDoesNotExist:
            return False

class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'nick_name']

class UserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField(read_only=True)
    isAuthenticated = serializers.SerializerMethodField(read_only=True)
    friends = SimpleUserSerializer(many=True, read_only=True)
    friends_invitation = serializers.SerializerMethodField(read_only=True)
    number_of_friends = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'number_of_friends', 'nick_name', 'bio', 'is_admin', 'token', 'isAuthenticated', 'friends', 'friends_invitation']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)
    
    def get_isAuthenticated(self, obj):
        return True
    
    def get_friends_invitation(self, obj):
        auth_user = obj
        friend_requests = FriendRequest.objects.filter(request_to=auth_user)
        serializer = FriendRequestSerializer(friend_requests, many=True)
        return serializer.data

    
    def get_number_of_friends(self, obj):
        return obj.friends.count()