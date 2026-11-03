from django.contrib import admin
from django.urls import path
from frontend.views import about, contact

urlpatterns = [
    path("admin/", admin.site.urls),
    path("about/", about, name="about"),
    path("contact/", contact, name="contact"),
]