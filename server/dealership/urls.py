from django.contrib import admin
from django.urls import path
from frontend.views import about, contact, login_user, logout_user, csrf_token, register_user

urlpatterns = [
    path("admin/", admin.site.urls),
    path("about/", about, name="about"),
    path("contact/", contact, name="contact"),
    path("api/login/", login_user, name="login_user"),
    path("api/logout/", logout_user, name="logout_user"),
    path("api/csrf/", csrf_token, name="csrf_token"),
    path("api/register/", register_user, name="register_user"),
]