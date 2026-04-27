from django.contrib import admin
from .models import Car


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ['brand', 'name', 'category', 'year', 'price_per_day', 'status']
    list_filter = ['category', 'status', 'brand', 'transmission', 'fuel_type']
    search_fields = ['name', 'brand', 'description']
    ordering = ['-created_at']
    list_editable = ['status', 'price_per_day']
