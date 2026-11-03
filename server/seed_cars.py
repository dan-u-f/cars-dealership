
from frontend.models import CarMake, CarModel

cars = {
    "Toyota": [
        ("Corolla", "Sedan"),
        ("Camry", "Sedan"),
        ("RAV4", "SUV"),
    ],
    "Ford": [
        ("Mustang", "Coupe"),
        ("Explorer", "SUV"),
        ("F-150", "Truck"),
    ],
    "Honda": [
        ("Civic", "Sedan"),
        ("Accord", "Sedan"),
        ("CR-V", "SUV"),
    ],
    "Chevrolet": [
        ("Malibu", "Sedan"),
        ("Silverado", "Truck"),
        ("Equinox", "SUV"),
    ],
}

for make_name, models in cars.items():
    make, _ = CarMake.objects.get_or_create(
        name=make_name
    )

    for model_name, car_type in models:
        CarModel.objects.get_or_create(
            make=make,
            name=model_name,
            defaults={"car_type": car_type}
        )

print("Marcas registradas:", CarMake.objects.count())
print("Modelos registrados:", CarModel.objects.count())
