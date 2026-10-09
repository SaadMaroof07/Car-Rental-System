# Car Rental Platform

This project is a full-stack car rental application where users can browse available cars, book them for a date range, and manage reservations. It has a Django REST API backend and a Vue 3 frontend, with separate customer and admin roles.

## What this project does

- Users can register and log in
- Customers can view available cars and their details
- Customers can create bookings with start and end dates
- Booking totals are calculated based on rental duration and daily price
- Admins can manage cars and update booking statuses
- Admin dashboard shows booking statistics and revenue summary

## Features

### Customer features

- User registration and login
- JWT-based authentication
- Car listing and detail pages
- Booking creation for selected cars
- Booking history and status tracking
- Protected routes for authenticated users

### Admin features

- Admin dashboard
- Add new cars
- Edit car information
- Delete cars
- View all bookings
- Change booking status: pending, confirmed, completed, cancelled
- Revenue and booking statistics overview

## Technologies used

### Frontend

- Vue 3
- Vite
- Vue Router
- Pinia state management
- Axios for API calls
- JavaScript

### Backend

- Python
- Django
- Django REST Framework
- JWT authentication with SimpleJWT
- PostgreSQL database
- Django CORS Headers
- Django Filters

## Project structure

- frontend: Vue app and UI
- backend: Django REST API and database logic
- users: user authentication and role management
- cars: car model, APIs, and admin management
- bookings: booking model and reservation logic
