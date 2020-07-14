from django.contrib import admin
from django.urls import path, include
from . import views
urlpatterns = [
    path('signup/', views.SignUpView.as_view()),
    path('accept/', views.AcceptCode.as_view()),
    path('signin/', views.SignInView.as_view()),
    path('reset-password/confirm/', views.ResetPasswordConfirm.as_view()),
    path('reset-password/reset/', views.ResetPassword.as_view()),
]