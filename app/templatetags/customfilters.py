from django import template
register = template.Library()

@register.filter
def getitem(list, i):
    return list.__getitem__(i)
