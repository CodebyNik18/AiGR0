from django.shortcuts import render, redirect
from website.models import HeroSection, ApproachSection
from django.http import HttpResponse
from django.contrib import messages
from services.models import ConsultationRequest
from django.core.mail import EmailMessage
from django.conf import settings


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
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        company_name = request.POST.get('company_name', '')
        interested_service = request.POST.getlist('interested_service')
        message = request.POST.get('message', '')
        terms_conditions = request.POST.get('terms_conditions')
        
        if not name or not email or not phone or not interested_service:
            messages.error(request, "Please fill all required (*) fields.")
            return redirect('contact_us')
        
        if terms_conditions:
            interested_service = ", ".join(interested_service)
            
            ConsultationRequest.objects.create(
                name=name,
                email=email,
                phone=phone,
                company_name=company_name,
                interested_service=interested_service,
                message=message
            )
            
            email_message = f"""
New Consultation Request Received

A new consultation request has been submitted through the website.

Name: {name}
Email: {email}
Phone: {phone}
Company: {company_name}

Services Interested In:
{interested_service}

Message:
{message}

Please contact this lead as soon as possible.
"""
            
            contact_email = EmailMessage(
                subject=f"New Consultation Request – {name}",
                body=email_message,
                from_email=settings.EMAIL_HOST_USER,
                to=[settings.EMAIL_HOST_USER],
                reply_to=[email]
            )
            
            contact_email.send(fail_silently=False)
            
            messages.success(request, "Your message has been sent successfully. Our team will contact you within 1 business day.")
            return redirect('contact_us')
        
        else:
            messages.error(request=request, message="Please check the \"I agree to Anthony Media Group's Terms of Service and Privacy Policy.\" for further contacting")
            return redirect('contact_us')
            
    return render(request=request, template_name='contact.html')

def careers(request):
    return render(request=request, template_name='career.html')