from rest_framework import serializers
from ..models import FriendRequest

class FriendRequestSerializer(serializers.ModelSerializer):
    request_from = serializers.SerializerMethodField()
    
    class Meta:
        model = FriendRequest
        fields = ['id', 'request_from']

    def get_request_from(self, obj):
        from ..serializers.user_serializers import SimpleUserSerializer
        serializer = SimpleUserSerializer(obj.request_from)
        return serializer.data
