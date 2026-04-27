from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'user',
        'car',
        'start_date',
        'end_date',
        'total_price',
        'status',
        'created_at',
    ]
    
    list_filter = ['status', 'user', 'car']
    search_fields = ['user__email', 'car__name', 'car__brand']
    ordering = ['-created_at']
    list_editable = ['status', 'total_price']
    