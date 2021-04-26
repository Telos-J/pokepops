from django.contrib import admin
from .models import OrderItem, Order, DeliveryCompany


admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(DeliveryCompany)
