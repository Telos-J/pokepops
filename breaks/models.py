from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.postgres.fields import ArrayField

def get_break_default():
    return [True]*12
    
class Break(models.Model):
    image = models.ImageField(upload_to="images")
    name = models.CharField(max_length=100)
    type_name = models.CharField(max_length=50)
    slots = ArrayField(models.BooleanField(default=True), size=12, default=get_break_default)
    price = models.PositiveIntegerField()

    def __str__(self):
        return self.name
    
    def get_image_url(self):
        return self.image.url
