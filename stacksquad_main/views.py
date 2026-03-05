from django.shortcuts import render
from website.models import HeroSection, ApproachSection
from django.http import HttpResponse


def home(request):
    hero_data = HeroSection.objects.first()
    approach_data = ApproachSection.objects.first()
    context = {
        'hero_data': hero_data,
        'approach_data': approach_data
    }
    return render(request=request, template_name='home.html', context=context)

def aboutus(request):
    return render(request=request, template_name='about.html')

def contactus(request):
    return HttpResponse("<h1> Contact Us Page. </h1>")

def careers(request):
    return render(request=request, template_name='career.html')