from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    class RoleChoices(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        USER = 'USER', 'User'
        
    role = models.CharField(max_length=10, choices=RoleChoices.choices, default=RoleChoices.USER)
    
    def __str__(self):
        return f"{self.username} - {self.role}"
    