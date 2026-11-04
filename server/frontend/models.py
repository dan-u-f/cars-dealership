from django.db import models
from django.contrib.auth.models import User


class Dealer(models.Model):
    full_name = models.CharField(max_length=200)
    short_name = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    zip_code = models.CharField(max_length=20)

    def __str__(self):
        return self.full_name


class Review(models.Model):
    dealer = models.ForeignKey(
        Dealer,
        on_delete=models.CASCADE,
        related_name="reviews"
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    review = models.TextField()
    purchase = models.BooleanField(default=False)
    purchase_date = models.DateField(null=True, blank=True)
    car_make = models.ForeignKey("CarMake",on_delete=models.SET_NULL,null=True,blank=True)
    car_year = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.dealer.full_name}"
    

class CarMake(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class CarModel(models.Model):
    make = models.ForeignKey(
        CarMake,
        on_delete=models.CASCADE,
        related_name="models"
    )
    name = models.CharField(max_length=100)
    car_type = models.CharField(max_length=50, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["make", "name"],
                name="unique_car_model_per_make"
            )
        ]

    def __str__(self):
        return f"{self.make.name} {self.name}"