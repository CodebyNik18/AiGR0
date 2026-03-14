from django.shortcuts import render

def services(request):
    return render(request=request, template_name='services.html')

def googleadservice(request):
    return render(request=request, template_name='google_ad_service.html')


def publicservice(request):
    return render(request=request, template_name='creative_graphic.html')


def seoservice(request):
    return render(request=request, template_name='seo_service.html')


def socialservice(request):
    return render(request=request, template_name='social_service.html')


def videoservice(request):
    return render(request=request, template_name='video_service.html')


def webservice(request):
    return render(request=request, template_name='web_service.html')