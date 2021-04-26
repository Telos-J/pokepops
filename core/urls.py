from django.urls import path
from .views import HomeView, add_to_cart, get_cart, remove_from_cart


app_name = "core"

urlpatterns = [
    path("", HomeView.as_view(), name="home"),
    path("add-to-cart/", add_to_cart, name="add-to-cart"),
    path("get-cart/", get_cart, name="get-cart"),
    path("remove-from-cart/", remove_from_cart, name="remove-from-cart"),
]

