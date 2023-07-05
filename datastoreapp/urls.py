from django.urls import path
from . import views


urlpatterns = [
    path('',views.index),
    path('save_custom_time', views.save_custom_time, name='save_custom_time'),
]