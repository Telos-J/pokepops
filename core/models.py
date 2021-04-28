from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.postgres.fields import ArrayField
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User
from django.shortcuts import reverse
from django.conf import settings
from django.db import models
import itertools, uuid, string, random, datetime


FREE_SHIPPING = 100
SHIPPING_FEE = 30


class OrderItem(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    slots = ArrayField(models.IntegerField(), default=list, blank=True)
    ordered = models.BooleanField(default=False)
    ordered_date = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return "{} ({}개)".format(self.content_object.name, self.quantity)

    def get_image_url(self):
        return self.content_object.get_image_url()

    def get_total_price(self):
        return self.content_object.price * self.quantity


class Order(models.Model):
    items = models.ManyToManyField(OrderItem)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField(blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    email_address = models.EmailField(blank=True, null=True)
    address_line_1 = models.CharField(max_length=200, blank=True, null=True) 
    admin_area_1 = models.CharField(max_length=100, blank=True, null=True) 
    admin_area_2 = models.CharField(max_length=100, blank=True, null=True) 
    country_code = models.CharField(max_length=100, blank=True, null=True) 
    postal_code = models.CharField(max_length=10, blank=True, null=True)
    paid_value = models.PositiveIntegerField(blank=True, null=True)

    def __str__(self):
        return str(self.user)

    def get_absolute_url(self):
        return reverse("shop:order-detail", kwargs={"pk": self.id})

    def get_cancel_url(self):
        return reverse("shop:order-cancel", kwargs={"pk": self.id})

    def get_total_price(self):
        total = 0
        for order_item in self.items.all():
            total += order_item.get_total_price()
        return total

    def get_shipping_fee(self):
        if self.get_total_price() < FREE_SHIPPING:
            return SHIPPING_FEE
        else:
            return 0

    def get_total(self):
        return self.get_total_price() + self.get_shipping_fee()
