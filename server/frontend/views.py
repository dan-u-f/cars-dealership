import json

from django.contrib.auth.decorators import login_required
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from .models import Dealer, Review, CarMake, CarModel
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.http import require_GET

def about(request):
    return render(request, "About.html")

def contact(request):
    return render(request, "Contact.html")

@require_POST
def login_user(request):
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse(
            {"error": "JSON inválido"},
            status=400
        )

    username = data.get("username", "")
    password = data.get("password", "")

    user = authenticate(
        request,
        username=username,
        password=password
    )

    if user is None:
        return JsonResponse(
            {"error": "Credenciales incorrectas"},
            status=401
        )

    login(request, user)

    return JsonResponse({
        "status": "success",
        "message": "Inicio de sesión correcto",
        "username": user.username
    })


@require_POST
def logout_user(request):
    logout(request)

    return JsonResponse({
        "status": "success",
        "message": "Sesión cerrada correctamente"
    })

@ensure_csrf_cookie
def csrf_token(request):
    return JsonResponse({"message": "CSRF cookie initialized"})


@require_POST
def register_user(request):
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse(
            {"error": "JSON inválido"},
            status=400
        )

    username = data.get("username", "").strip()
    first_name = data.get("firstName", "").strip()
    last_name = data.get("lastName", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not all([username, first_name, last_name, email, password]):
        return JsonResponse(
            {"error": "Todos los campos son obligatorios"},
            status=400
        )

    if User.objects.filter(username=username).exists():
        return JsonResponse(
            {"error": "El nombre de usuario ya existe"},
            status=409
        )

    if User.objects.filter(email__iexact=email).exists():
        return JsonResponse(
            {"error": "El correo electrónico ya está registrado"},
            status=409
        )

    user = User(
        username=username,
        first_name=first_name,
        last_name=last_name,
        email=email
    )

    try:
        validate_password(password, user=user)
    except ValidationError as error:
        return JsonResponse(
            {"error": " ".join(error.messages)},
            status=400
        )

    user.set_password(password)
    user.save()

    return JsonResponse(
        {
            "status": "success",
            "message": "Usuario registrado correctamente",
            "username": user.username
        },
        status=201
    )

from django.views.decorators.http import require_GET


@require_GET
def get_all_dealers(request):
    dealers = Dealer.objects.all().values(
        "id",
        "full_name",
        "short_name",
        "city",
        "state",
        "address",
        "zip_code"
    )

    return JsonResponse(
        {"dealers": list(dealers)},
        status=200
    )

@require_GET
def get_dealer_by_id(request, dealer_id):
    dealer = Dealer.objects.filter(id=dealer_id).values(
        "id",
        "full_name",
        "short_name",
        "city",
        "state",
        "address",
        "zip_code"
    ).first()

    if dealer is None:
        return JsonResponse(
            {"error": "Concesionario no encontrado"},
            status=404
        )

    return JsonResponse({"dealer": dealer}, status=200)

@require_GET
def get_dealers_by_state(request, state):
    dealers = Dealer.objects.filter(
        state__iexact=state
    ).values(
        "id",
        "full_name",
        "short_name",
        "city",
        "state",
        "address",
        "zip_code"
    )

    return JsonResponse(
        {"dealers": list(dealers)},
        status=200
    )

@require_GET
def get_dealer_reviews(request, dealer_id):
    if not Dealer.objects.filter(id=dealer_id).exists():
        return JsonResponse(
            {"error": "Concesionario no encontrado"},
            status=404
        )

    reviews = Review.objects.filter(
        dealer_id=dealer_id
    ).select_related("user")

    results = []

    for review in reviews:
        results.append({
            "id": review.id,
            "dealer_id": review.dealer_id,
            "username": review.user.username,
            "review": review.review,
            "purchase": review.purchase,
            "purchase_date": (
                review.purchase_date.isoformat()
                if review.purchase_date else None
            ),
            "created_at": review.created_at.isoformat()
        })

    return JsonResponse(
        {"reviews": results},
        status=200
    )

@require_GET
def get_all_car_makes(request):
    makes = CarMake.objects.prefetch_related("models").all()

    results = []

    for make in makes:
        results.append({
            "id": make.id,
            "name": make.name,
            "models": [
                {
                    "id": model.id,
                    "name": model.name,
                    "car_type": model.car_type
                }
                for model in make.models.all()
            ]
        })

    return JsonResponse(
        {"car_makes": results},
        status=200
    )

@require_GET
def analyze_review(request):
    text = request.GET.get("text", "").strip()

    if not text:
        return JsonResponse(
            {"error": "Debes proporcionar un texto para analizar"},
            status=400
        )

    analyzer = SentimentIntensityAnalyzer()
    scores = analyzer.polarity_scores(text)

    compound = scores["compound"]

    if compound >= 0.05:
        sentiment = "positive"
    elif compound <= -0.05:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    return JsonResponse({
        "text": text,
        "sentiment": sentiment,
        "scores": scores
    }, status=200)


@login_required
@require_POST
def add_review(request, dealer_id):
    try:
        dealer = Dealer.objects.get(id=dealer_id)
    except Dealer.DoesNotExist:
        return JsonResponse(
            {"error": "Concesionario no encontrado"},
            status=404
        )

    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse(
            {"error": "JSON inválido"},
            status=400
        )

    review_text = str(data.get("review", "")).strip()
    purchase = data.get("purchase", False)

    if not review_text:
        return JsonResponse(
            {"error": "La reseña no puede estar vacía"},
            status=400
        )

    if not isinstance(purchase, bool):
        return JsonResponse(
            {"error": "El campo purchase debe ser verdadero o falso"},
            status=400
        )

    review = Review.objects.create(
        dealer=dealer,
        user=request.user,
        review=review_text,
        purchase=purchase
    )

    return JsonResponse(
        {
            "status": "success",
            "message": "Reseña publicada correctamente",
            "review": {
                "id": review.id,
                "dealer_id": dealer.id,
                "username": request.user.username,
                "review": review.review,
                "purchase": review.purchase
            }
        },
        status=201
    )

@ensure_csrf_cookie
def react_app(request, dealer_id=None):
    index_path = settings.BASE_DIR / "frontend" / "dist" / "index.html"

    if not index_path.is_file():
        return HttpResponse(
            "React no está compilado. Ejecuta npm run build.",
            status=503,
        )

    return HttpResponse(
        index_path.read_text(encoding="utf-8"),
        content_type="text/html",
    )


@require_GET
def current_user(request):
    if request.user.is_authenticated:
        return JsonResponse({
            "authenticated": True,
            "username": request.user.username
        })

    return JsonResponse({
        "authenticated": False,
        "username": None
    })


@require_POST
def coursera_login(request):
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse(
            {"status": "Error", "message": "Invalid JSON"},
            status=400
        )

    username = data.get("userName", "")
    password = data.get("password", "")

    user = authenticate(
        request,
        username=username,
        password=password
    )

    if user is None:
        return JsonResponse(
            {"status": "Failed", "message": "Invalid credentials"},
            status=401
        )

    login(request, user)

    return JsonResponse({
        "status": "Authenticated",
        "userName": user.username
    })


@require_GET
def coursera_logout(request):
    logout(request)

    return JsonResponse({
        "userName": ""
    })


@require_GET
def coursera_get_cars(request):
    makes = CarMake.objects.prefetch_related("models").all()

    results = []

    for make in makes:
        results.append({
            "id": make.id,
            "name": make.name,
            "CarModels": [
                {
                    "id": model.id,
                    "name": model.name,
                    "car_type": model.car_type
                }
                for model in make.models.all()
            ]
        })

    return JsonResponse(
        {"CarMakes": results},
        status=200
    )
