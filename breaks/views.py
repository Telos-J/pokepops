from django.views.generic import TemplateView
from .models import Break


class BreaksView(TemplateView):
    template_name = "breaks.html"
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        break_object = Break.objects.last()
        context["break"] = break_object

        return context