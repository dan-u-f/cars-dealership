from django.shortcuts import render

def about(request):
    return render(request, "About.html")

def contact(request):
    return render(request, "Contact.html")