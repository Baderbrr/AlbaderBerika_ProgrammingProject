from django.db import models
from django.conf import settings
from django.db import models
import uuid
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser, PermissionsMixin
)

class MyUserManager(BaseUserManager):
    '''
    User Manager for Custom User Model - UserAccount
    '''
    def create_user(self, email, first_name, last_name, password, nick_name=None, bio=None):
        '''
        Creates and save a User with the given email, firdst_name, second_name, nick_name, date_of_birth, bio, password
        '''
        if not email:
            raise ValueError('Users must have an email address')

        if nick_name is None or nick_name == '':
            default_nick_name = f'@{first_name.capitalize()}{last_name.capitalize()}' # set default nickname if none was given
            nick_name = default_nick_name
        else:
            nick_name = '@' + nick_name

        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name.capitalize(),
            last_name=last_name.capitalize(),
            nick_name=nick_name,
            bio=bio,
        )
        user.is_active = True
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, first_name, last_name, password, bio=None, nick_name=None):
        '''
        Creates and save a superuser with the given email, first_name, second_name, nick_name, date_of_birth, bio, password
        '''
            
        user = self.create_user(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            nick_name=nick_name,
            bio=bio,
            password=password
        )

        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user
    
class UserAccount(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True
    )
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    nick_name = models.CharField(max_length=60)
    bio = models.CharField(max_length=255, null=True, blank=True)
    friends = models.ManyToManyField("UserAccount", related_name="Friends", null=True, blank=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(
        ("staff status"),
        default=False,
        help_text=("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        ("active"),
        default=True,
        help_text=(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )

    objects = MyUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email
    
    @property
    def get_is_admin(self):
        '''
        Is the user admin
        '''
        return self.is_admin

class BaseRequest(models.Model):
    '''
    Base Class for requests Models
    '''
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request_from = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='%(class)s_request_from')
    request_to = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='%(class)s_request_to')
    status=models.CharField(max_length=264,null=True,blank=True,default="unread")

    class Meta:
        abstract = True # creates seperate tables for kids (turn off mutliple-table inheritance)

    def __str__(self):
        return f'from {self.request_from} to {self.request_to}'

class FriendRequest(BaseRequest):
    '''
    Invitation to the friend list
    '''
    pass