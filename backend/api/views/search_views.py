from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from ..models import UserAccount

from ..serializers.user_serializers import SimpleUserSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def searchUsers(request, search_users):
    try:
        # filter user accounts if the user contains in frist_name or last_name variable input from user interface
        # then it is sending data to serializer which serialize objects to JSON format
        people = UserAccount.objects.filter(Q(first_name__icontains=search_users) | Q(last_name__icontains=search_users))
        serializer = SimpleUserSerializer(people, many=True) # Here are objects being serialized
        if not people: # if there is no objects in database we return empty array with status code 200(OK) ( so nothiing is wrong with the server it just don't have any objects with given credentials)
            return Response([], status=status.HTTP_200_OK)
        return Response(serializer.data, status=status.HTTP_200_OK) # if everything works it sends serialized data back to render in React application
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) # if the error occurs it is send here with the 500 status code (server error)