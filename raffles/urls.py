from django.urls import path
from .views import RafflesView

app_name = "raffles"

urlpatterns = [
    path("", RafflesView.as_view(), name="raffles"),
]