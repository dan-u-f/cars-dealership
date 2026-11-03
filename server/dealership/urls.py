from django.contrib import admin
from django.urls import path
from frontend.views import about, contact, login_user, logout_user, csrf_token, register_user, get_all_dealers, get_dealer_by_id, get_dealers_by_state, get_dealer_reviews, get_all_car_makes, analyze_review

urlpatterns = [
    path("admin/", admin.site.urls),
    path("about/", about, name="about"),
    path("contact/", contact, name="contact"),
    path("api/login/", login_user, name="login_user"),
    path("api/logout/", logout_user, name="logout_user"),
    path("api/csrf/", csrf_token, name="csrf_token"),
    path("api/register/", register_user, name="register_user"),
    path("api/dealers/", get_all_dealers, name="get_all_dealers"),
    path("api/dealers/<int:dealer_id>/", get_dealer_by_id, name="get_dealer_by_id"),
    path("api/dealers/state/<str:state>/", get_dealers_by_state, name="get_dealers_by_state"),
    path("api/dealers/<int:dealer_id>/reviews/", get_dealer_reviews,name="get_dealer_reviews"),
    path("api/cars/", get_all_car_makes, name="get_all_car_makes"),
    path("api/analyze/", analyze_review,name="analyze_review"),
]