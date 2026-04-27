from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):

    # Roles
    CUSTOMER = 'customer'
    ADMIN = 'admin'

    ROLE_CHOICES = [(CUSTOMER, 'Customer'),(ADMIN, 'Admin'),]

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True)
    role = models.CharField(max_length=10,choices=ROLE_CHOICES,default=CUSTOMER)
    profile_picture = models.ImageField(upload_to='profiles/',blank=True,null=True)

    def __str__(self):
        return self.email
