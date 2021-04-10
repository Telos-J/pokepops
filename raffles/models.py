from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class Raffle(models.Model):
    image = models.ImageField(upload_to="images")
    name = models.CharField(max_length=100)
    type_name = models.CharField(max_length=50)
    slot = models.IntegerField(
        validators = [
            MaxValueValidator(6),
            MinValueValidator(1)
        ],
        blank=True, null=True
    )
    price = models.PositiveIntegerField()

    def __str__(self):
        return self.name
    
    def get_image_url(self):
        return self.image.url
