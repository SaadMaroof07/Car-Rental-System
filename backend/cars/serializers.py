from rest_framework import serializers
from .models import Car


class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = (
            'id',
            'name',
            'brand',
            'category',
            'year',
            'price_per_day',
            'status',
            'seats',
            'transmission',
            'fuel_type',
            'description',
            'image',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')