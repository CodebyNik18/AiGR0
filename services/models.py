from django.db import models


class ConsultationRequest(models.Model):
    name = models.CharField(max_length=300, blank=False, null=False)
    email = models.EmailField(blank=False, null=False)
    phone = models.CharField(max_length=15, blank=False, null=False)
    company_name = models.CharField(max_length=300, blank=True)
    interested_service = models.TextField(blank=False, null=False)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.email