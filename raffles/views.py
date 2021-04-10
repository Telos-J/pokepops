from django.views.generic import TemplateView
from .models import Raffle


class RafflesView(TemplateView):
    template_name = "raffles.html"
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        raffle_object = Raffle.objects.last()
        context["raffle"] = raffle_object

        return context