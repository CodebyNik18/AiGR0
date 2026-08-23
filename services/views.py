from django.shortcuts import render

def services(request):
    return render(request=request, template_name='service.html')

def aichatbotsvoice(request):
    return render(request=request, template_name='ai_chatbots_voice.html')

def aidevelopment(request):
    return render(request=request, template_name='ai_development.html')


def aiagentsautomation(request):
    return render(request=request, template_name='ai_agents_agentic_system.html')


def aipoweredmarketing(request):
    return render(request=request, template_name='ai_automation_integration.html')


def performancemarketing(request):
    return render(request=request, template_name='performance_marketing.html')


def seo(request):
    return render(request=request, template_name='seo_organic_growth.html')