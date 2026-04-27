from rest_framework import serializers
from django.utils import timezone
from .models import Booking
from cars.serializers import CarSerializer


class BookingSerializer(serializers.ModelSerializer):
    car_detail = CarSerializer(source='car', read_only=True)
    total_days = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = (
            'id',
            'user',
            'car',
            'car_detail',
            'start_date',
            'end_date',
            'total_days',
            'total_price',
            'status',
            'created_at',
        )
        read_only_fields = ('id', 'user', 'total_price', 'status', 'created_at')

    def get_total_days(self, obj):
        return (obj.end_date - obj.start_date).days

    def validate(self, data):
        # Start date past mein nahi honi chahiye
        if data['start_date'] < timezone.now().date():
            raise serializers.ValidationError(
                {'start_date': 'Start date cannot be in the past.'}
            )
        # End date start date se pehle nahi honi chahiye
        if data['end_date'] <= data['start_date']:
            raise serializers.ValidationError(
                {'end_date': 'End date must be after start date.'}
            )
        # Car available hai?
        car = data['car']
        if car.status != 'available':
            raise serializers.ValidationError(
                {'car': 'This car is not available for booking.'}
            )
        return data

    def create(self, validated_data):
        car = validated_data['car']
        start_date = validated_data['start_date']
        end_date = validated_data['end_date']

        # Total price calculate karo
        total_days = (end_date - start_date).days
        validated_data['total_price'] = car.price_per_day * total_days

        # Car status booked kar do
        car.status = 'booked'
        car.save()

        return super().create(validated_data)