from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.postgres.fields import ArrayField
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User
from django.shortcuts import reverse
from django.conf import settings
from django.db import models
import itertools, uuid, string, random, datetime


SHIPPING_FEE = 0
FREE_SHIPPING = 50000

ORDER_STATUS_CHOICES = (
    ("I", "결제대기"),
    ("P", "결제완료"),
    ("R", "배송준비중"),
    ("C", "주문취소"),
    ("S", "배송중"),
    ("D", "배송완료"),
)

ORDER_MESSAGE_CHOICES = (
    ("D", "문앞에 두고 가세요"),
    ("C", "배송전에 연락바랍니다"),
    ("H", "빨리 와주세요 현기증 난단 말이에요"),
)


def _generate_merchant_uid(Klass):
    unique_id = str(uuid.uuid4())
    while Klass.objects.filter(merchant_uid=unique_id).exists():
        unique_id = str(uuid.uuid4())

    return unique_id


def _generate_order_number(Klass):
    unique_number = datetime.datetime.now()
    unique_number = unique_number.strftime("%y%m%d")
    unique_number += "".join(random.choices(string.digits, k=4))
    while Klass.objects.filter(order_number=unique_number).exists():
        unique_number = unique_number[:6] + "".join(random.choices(string.digits, k=4))

    return unique_number


class DeliveryCompany(models.Model):
    name = models.CharField(max_length=100)
    url = models.CharField(max_length=100)

    def __str__(self):
        return str(self.name)


class OrderItem(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    slots = ArrayField(models.IntegerField(), default=list, blank=True)
    ordered = models.BooleanField(default=False)
    ordered_date = models.DateTimeField(blank=True, null=True)
    paid_total_price = models.PositiveIntegerField(blank=True, null=True)
    paid_total_final_price = models.PositiveIntegerField(blank=True, null=True)

    def __str__(self):
        return "{} ({}개)".format(self.content_object.name, self.quantity)

    def get_image_url(self):
        return self.content_object.get_image_url()

    def get_total_price(self):
        return self.content_object.price * self.quantity


class Order(models.Model):
    items = models.ManyToManyField(OrderItem)
    user = models.OneToOneField(User, blank=True, null=True, on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField(blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    postcode = models.CharField(max_length=10, blank=True, null=True)
    address = models.CharField(max_length=200, blank=True, null=True)
    detail_address = models.CharField(max_length=200, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    merchant_uid = models.CharField(max_length=100, blank=True, unique=True)
    order_number = models.CharField(max_length=10, blank=True, unique=True)
    password = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(choices=ORDER_STATUS_CHOICES, default="I", max_length=1)
    message = models.CharField(choices=ORDER_MESSAGE_CHOICES, default="H", max_length=1)
    paid_total_price = models.PositiveIntegerField(blank=True, null=True)
    paid_total_discount = models.PositiveIntegerField(blank=True, null=True)
    paid_shipping_fee = models.PositiveIntegerField(blank=True, null=True)
    paid_total = models.PositiveIntegerField(blank=True, null=True)
    delivery_company = models.ForeignKey(
        DeliveryCompany, blank=True, null=True, on_delete=models.SET_NULL
    )
    tracking_number = models.CharField(max_length=100, blank=True, null=True)

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

    def save(self, *args, **kwargs):
        if not self.merchant_uid:
            self.merchant_uid = _generate_merchant_uid(Order)

        if not self.order_number:
            self.order_number = _generate_order_number(Order)

        super().save(*args, **kwargs)
