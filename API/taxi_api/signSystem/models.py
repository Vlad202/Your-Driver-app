from django.db import models
from django.contrib.auth.models import User

class UserPhone(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mobile_phone = models.CharField(max_length=12)
    token = models.CharField(max_length=64, default=None)
    
    def __str__(self):
        return self.user.first_name