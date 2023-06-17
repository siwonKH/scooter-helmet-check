from django.urls import path
from scooter import views

urlpatterns = [
    path('', views.home),
    path('check', views.CheckHelmet.as_view()),
    path('ride', views.RideAvailable.as_view()),
    path('unavailable', views.RideUnavailable.as_view()),
]
