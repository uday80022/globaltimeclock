from django.db import models


class CustomTime(models.Model):    
    time = models.CharField(max_length=15)
    
# Create a time field in datastoreapp_customtime table in the database 