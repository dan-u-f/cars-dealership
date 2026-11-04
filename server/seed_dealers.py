
from frontend.models import Dealer

dealers = [
    {
        "full_name": "Kansas City Auto Center",
        "short_name": "KC Auto",
        "city": "Kansas City",
        "state": "Kansas",
        "address": "1200 Main Street",
        "zip_code": "66101",
    },
    {
        "full_name": "Wichita Motors",
        "short_name": "Wichita Motors",
        "city": "Wichita",
        "state": "Kansas",
        "address": "450 Douglas Avenue",
        "zip_code": "67202",
    },
    {
        "full_name": "Denver Premium Cars",
        "short_name": "Denver Cars",
        "city": "Denver",
        "state": "Colorado",
        "address": "800 Broadway",
        "zip_code": "80203",
    },
]

for dealer_data in dealers:
    dealer, created = Dealer.objects.get_or_create(
        full_name=dealer_data["full_name"],
        defaults=dealer_data,
    )

    if created:
        print(f"Creado: {dealer.full_name}")
    else:
        print(f"Ya existe: {dealer.full_name}")

print("Carga de concesionarios finalizada.")
