from django.urls import path
from . import views

urlpatterns = [
    path('', views.services, name='services'),
    path('ai-agents-automation/', views.aiagentsautomation, name='ai_agents_automation'),
    path('ai-chatbots-voice/', views.aichatbotsvoice, name='ai_chatbots_voice'),
    path('ai-development/', views.aidevelopment, name='ai_development'),
    path('ai-powered-marketing/', views.aipoweredmarketing, name='ai_powered_marketing'),
    path('performance-marketing/', views.performancemarketing, name='performance_marketing'),
    path('seo-services/', views.seo, name='seo')
]