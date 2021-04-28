from django.contrib.admin.options import get_content_type_for_model
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext as _
from django.utils import timezone
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
    if itemstr == 'break':
        item = Break.objects.last()
    elif itemstr == 'raffle':
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
    body = json.loads(request.body)
    item = get_item(body['item'])
    slots = [int(i) for i in body['indexes']]
    order_item = make_order(request, item, slots)
    data = {
        'quantity': order_item.quantity,
        'slots': order_item.slots
    }

    return JsonResponse(data)


def get_cart(request):
    if request.user.is_authenticated:
        order, order_created = Order.objects.get_or_create(user=request.user, ordered=False)
        data = {
            'total': order.get_total_price(),
            'items': [],
        }

        for order_item in order.items.all():
            data['items'].append({
                'id': order_item.id,
                'url': order_item.content_object.get_image_url(),
                'name': order_item.content_object.name,
                'quantity': order_item.quantity,
                'price': order_item.get_total_price(),
                'currency': 'USD',
            })

        response = JsonResponse(data)
    else:
        data = {
            'error': _("Login required!")
        }
        response = JsonResponse(data)
        response.status_code = 403
    
    return response


def remove_from_cart(request):
    body = json.loads(request.body)
    order_item = OrderItem.objects.get(id=body['id'])
    order_item.delete()

    return JsonResponse({})


def complete_order(request):
    body = json.loads(request.body)
    order = Order.objects.get(user=request.user, ordered=False)
    value = int(float(body['amount']['value']))

    if order.get_total_price() == value:
        for order_item in order.items.all():
            order_item.ordered = True
            order_item.save()
            for idx in order_item.slots:
                order_item.content_object.slots[idx] = False
            order_item.content_object.save()

        order.name = body['shipping']['name']['full_name']
        order.email_address = body['payee']['email_address']
        order.address_line_1 = body['shipping']['address']['address_line_1']
        order.admin_area_1 = body['shipping']['address']['admin_area_1']
        order.admin_area_2 = body['shipping']['address']['admin_area_2']
        order.country_code = body['shipping']['address']['country_code']
        order.postal_code = body['shipping']['address']['postal_code']
        order.paid_value = value
        order.ordered_date = timezone.now()
        order.ordered = True
        order.save()

    return JsonResponse(body)
