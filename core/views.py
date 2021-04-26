from django.contrib.admin.options import get_content_type_for_model
from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.auth.models import User
from django.http import JsonResponse
from breaks.models import Break
from raffles.models import Raffle
from .models import Order, OrderItem
import json


class HomeView(TemplateView):
    template_name = "home.html"


def get_item(itemstr):
    if (itemstr == 'break'):
        item = Break.objects.last()
    elif (itemstr == 'raffle'):
        item = Raffle.objects.last()

    return item


def make_order(request, item, slots):
    order, _ = Order.objects.get_or_create(user=request.user, ordered=False)
    order_item, _ = OrderItem.objects.get_or_create(user=request.user, ordered=False, object_id=item.id, content_type=get_content_type_for_model(item))
    order_item.slots.extend(slots)
    order_item.slots = list(set(order_item.slots))
    order_item.quantity = len(order_item.slots)
    order.items.add(order_item)
    order_item.save()
    order.save()

    return order_item


def add_to_cart(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    item = get_item(body['item'])
    slots = [int(i) for i in body['indexes']]
    order_item = make_order(request, item, slots)
    data = {
        'quantity': order_item.quantity,
        'slots': order_item.slots
    }

    return JsonResponse(data)

def get_cart(request):
    order, _ = Order.objects.get_or_create(user=request.user, ordered=False)
    data = {
        'total': order.get_total_price(),
        'items': {}
    }

    for order_item in order.items.all():
        data['items'][order_item.id] = {
            'url': order_item.content_object.get_image_url(),
            'name': order_item.content_object.name,
            'quantity': order_item.quantity,
            'price': order_item.get_total_price()
        }

    print(data)

    return JsonResponse(data)

def remove_from_cart(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    order_item = OrderItem.objects.get(id=body)
    order_item.delete()

    return JsonResponse({})

