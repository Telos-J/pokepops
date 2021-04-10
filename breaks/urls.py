from django.urls import path
from .views import BreaksView

app_name = "breaks"

urlpatterns = [
    path("", BreaksView.as_view(), name="breaks"),
]