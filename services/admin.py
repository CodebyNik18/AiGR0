from django.contrib import admin
from .models import ConsultationRequest


class ConsultationAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'email', 'company_name', 'created_at'
    ]
    
    search_fields = [
        'name', 'email', 'company_name'
    ]
    
    list_filter = [
        'interested_service', 'created_at'
    ]
    

admin.site.register(ConsultationRequest, ConsultationAdmin)