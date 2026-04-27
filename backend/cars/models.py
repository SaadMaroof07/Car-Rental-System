from django.db import models

# Create your models here.
from django.db import models


class Car(models.Model):
    AVAILABLE = 'available'
    BOOKED = 'booked'
    MAINTENANCE = 'maintenance'

    STATUS_CHOICES = [
        (AVAILABLE, 'Available'),
        (BOOKED, 'Booked'),
        (MAINTENANCE, 'Maintenance'),
    ]

    SEDAN = 'sedan'
    SUV = 'suv'
    COUPE = 'coupe'
    CONVERTIBLE = 'convertible'
    SPORTS = 'sports'
    LUXURY = 'luxury'
    ELECTRIC = 'electric'

    CATEGORY_CHOICES = [
        (SEDAN, 'Sedan'),
        (SUV, 'SUV'),
        (COUPE, 'Coupe'),
        (CONVERTIBLE, 'Convertible'),
        (SPORTS, 'Sports'),
        (LUXURY, 'Luxury'),
        (ELECTRIC, 'Electric'),
    ]


    name = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default=SEDAN
    )
    year = models.IntegerField()
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=AVAILABLE
    )
    seats = models.IntegerField()
    transmission = models.CharField(max_length=50)
    fuel_type = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='cars/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.brand} {self.name} ({self.year})'