from django.urls import path, include
from . import views
urlpatterns = [
    path('gettaxi/', views.GetTaxi.as_view()),
]