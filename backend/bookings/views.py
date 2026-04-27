from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .models import Booking
from .serializers import BookingSerializer
from .permissions import IsAdminRole, IsCustomerRole
from cars.models import Car
from django.core.mail import send_mail
from django.db.models import Sum



class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer

    def get_permissions(self):
        if self.action in ['create', 'list', 'retrieve', 'cancel']:
            return [IsAuthenticated(), IsCustomerRole()]
        return [IsAuthenticated(), IsAdminRole()]

    def get_queryset(self):
        user = self.request.user
        # Admin → Sari bookings
        if user.role == 'admin':
            return Booking.objects.all().order_by('-created_at')
        # Customer → Sirf apni bookings
        return Booking.objects.filter(user=user).order_by('-created_at')

    def perform_create(self, serializer):
        booking = serializer.save(user=self.request.user)
        # Booking confirmation email
        send_mail(
            subject='Booking Confirmed - Car Rental',
            message=f'''Hello {booking.user.email},

Your booking has been confirmed!

Car: {booking.car.brand} {booking.car.name}
Start Date: {booking.start_date}
End Date: {booking.end_date}
Total Price: ${booking.total_price}

Thank you for choosing Car Rental!

Car Rental Team''',
            from_email=None,
            recipient_list=[booking.user.email],
            fail_silently=False,
        )

    # Customer apni booking cancel kare
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def cancel(self, request, pk=None):
        booking = self.get_object()

        # Sirf apni booking cancel kar sakta hai
        if booking.user != request.user and request.user.role != 'admin':
            return Response(
                {'error': 'You cannot cancel this booking.'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Pehle se cancel nahi honi chahiye
        if booking.status == 'cancelled':
            return Response(
                {'error': 'Booking is already cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Completed booking cancel nahi ho sakti
        if booking.status == 'completed':
            return Response(
                {'error': 'Completed booking cannot be cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Car wapas available kar do
        booking.car.status = 'available'
        booking.car.save()

        # Booking cancel karo
        booking.status = 'cancelled'
        booking.save()

        # Cancellation email
        send_mail(
            subject='Booking Cancelled - Car Rental',
            message=f'''Hello {booking.user.email},

Your booking has been cancelled.

Car: {booking.car.brand} {booking.car.name}
Start Date: {booking.start_date}
End Date: {booking.end_date}

If you have any questions, please contact us.

Car Rental Team''',
            from_email=None,
            recipient_list=[booking.user.email],
            fail_silently=False,
        )

        return Response(
            {'message': 'Booking cancelled successfully.'},
            status=status.HTTP_200_OK
        )

    # Admin booking status update kare
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdminRole])
    def update_status(self, request, pk=None):
        booking = self.get_object()
        new_status = request.data.get('status')

        allowed_statuses = ['pending', 'confirmed', 'cancelled', 'completed']
        if new_status not in allowed_statuses:
            return Response(
                {'error': 'Invalid status.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Completed → Car wapas available
        if new_status == 'completed':
            booking.car.status = 'available'
            booking.car.save()

        # Cancelled → Car wapas available
        if new_status == 'cancelled':
            booking.car.status = 'available'
            booking.car.save()

        booking.status = new_status
        booking.save()

        # Status update email
        send_mail(
            subject=f'Booking Status Updated - Car Rental',
            message=f'''Hello {booking.user.email},

Your booking status has been updated.

Car: {booking.car.brand} {booking.car.name}
New Status: {new_status.upper()}

Thank you for choosing Car Rental!

Car Rental Team''',
            from_email=None,
            recipient_list=[booking.user.email],
            fail_silently=False,
        )

        return Response(
            {'message': f'Booking status updated to {new_status}.'},
            status=status.HTTP_200_OK
        )

    # Admin dashboard stats
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsAdminRole])
    def stats(self, request):
        total_bookings = Booking.objects.count()
        pending = Booking.objects.filter(status='pending').count()
        confirmed = Booking.objects.filter(status='confirmed').count()
        cancelled = Booking.objects.filter(status='cancelled').count()
        completed = Booking.objects.filter(status='completed').count()
        revenue_data = Booking.objects.filter(
            status__in=['confirmed', 'completed']
        ).aggregate(total=Sum('total_price'))

        # Agar koi booking na ho to 0 dikhao, warna total raqam
        total_revenue = revenue_data['total'] or 0

        return Response({
            'total_bookings': total_bookings,
            'pending': pending,
            'confirmed': confirmed,
            'cancelled': cancelled,
            'completed': completed,
            'total_revenue': total_revenue,
        })

