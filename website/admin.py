from django.contrib import admin
from .models import Home_HeroSection, Home_ApproachSection


class HeroAdmin(admin.ModelAdmin):
    list_display = [
        'hero_title', 'updated_at'
    ]

class ApproachAdmin(admin.ModelAdmin):
    list_display = [
        'approach_title', 'updated_at'
    ]
    
    
admin.site.register(Home_HeroSection, HeroAdmin)
admin.site.register(Home_ApproachSection, ApproachAdmin)