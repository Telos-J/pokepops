from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import BreaksView

app_name = "breaks"

urlpatterns = [
    path("", BreaksView.as_view(), name="breaks"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
