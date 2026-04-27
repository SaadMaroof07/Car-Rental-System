from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Car
from .serializers import CarSerializer
from .permissions import IsAdminRole


class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all().order_by('-created_at')
    serializer_class = CarSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status', 'brand', 'transmission', 'fuel_type']
    search_fields = ['name', 'brand', 'description']
    ordering_fields = ['price_per_day', 'year', 'created_at']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated(), IsAdminRole()]

