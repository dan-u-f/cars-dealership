from django.contrib import admin
from django.urls import path
from frontend.views import about, contact, login_user, logout_user, csrf_token, register_user, get_all_dealers, get_dealer_by_id, get_dealers_by_state, get_dealer_reviews, get_all_car_makes, analyze_review, add_review, react_app, current_user, coursera_login, coursera_logout, coursera_get_cars

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
    path("api/dealers/<int:dealer_id>/reviews/add/", add_review, name="add_review"),
    path("", react_app, name="home"),
    path("dealers", react_app, name="dealers"),
    path("dealers/<int:dealer_id>", react_app, name="dealer_details"),
    path("dealers/<int:dealer_id>/review", react_app, name="dealer_review"),
    path("api/me/", current_user, name="current_user"),
    path("djangoapp/login", coursera_login, name="coursera_login"),
    path("djangoapp/logout", coursera_logout, name="coursera_logout"),
    path("djangoapp/get_cars", coursera_get_cars, name="coursera_get_cars"),


]