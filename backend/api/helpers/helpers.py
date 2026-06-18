from rest_framework.authentication import get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
import os
import jwt

def decode_token(request):
    '''
    Decode JWT token from request object
    '''
    authorization_header = get_authorization_header(request)
    if not authorization_header:
        raise AuthenticationFailed('Authentication header missing')
    
    try:
        token = authorization_header.decode('utf-8').split(' ')[1] # grab the token from `Bearer token` string
        payload = jwt.decode(token, 'django-insecure-)73e7fuhkwd*r!j6!+scjvm)x!at6gi=ll@ryq45l@icsj$jbr', algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Tokeh has expired')
    except IndexError:
        raise AuthenticationFailed('Token not found in header')
    except Exception as e:
        raise AuthenticationFailed(str(e))