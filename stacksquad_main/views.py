from django.shortcuts import render, redirect
from website.models import Home_HeroSection, Home_ApproachSection
from django.contrib import messages
from services.models import ConsultationRequest
from django.core.mail import EmailMessage
from django.conf import settings
import os
from brevo import Brevo
from brevo.transactional_emails import (
    SendTransacEmailRequestSender,
    SendTransacEmailRequestToItem,
)

brevo_client = Brevo(api_key=os.environ.get('BREVO_API_KEY'))

def home(request):
    hero_data = Home_HeroSection.objects.first()
    approach_data = Home_ApproachSection.objects.first()
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
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Consultation Request</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #f4f6f8;
    font-family: Arial, Helvetica, sans-serif;
    color: #1f2937;
">

    <div style="
        max-width: 650px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    ">

        <!-- Header -->
        <div style="
            background-color: #111827;
            padding: 28px 32px;
            text-align: center;
        ">
            <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 24px;
                font-weight: 600;
            ">
                New Consultation Request
            </h1>

            <p style="
                margin: 8px 0 0;
                color: #d1d5db;
                font-size: 14px;
            ">
                A new lead has submitted a consultation request.
            </p>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">

            <p style="
                margin: 0 0 24px;
                font-size: 15px;
                line-height: 1.6;
                color: #4b5563;
            ">
                A new consultation request has been submitted through the
                <strong>AiGRO</strong> website.
            </p>

            <!-- Lead Information -->
            <h2 style="
                margin: 0 0 16px;
                font-size: 18px;
                color: #111827;
            ">
                Lead Information
            </h2>

            <div style="
                background-color: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 20px;
            ">

                <p style="margin: 0 0 12px; font-size: 14px;">
                    <strong>Name:</strong><br>
                    {name}
                </p>

                <p style="margin: 0 0 12px; font-size: 14px;">
                    <strong>Email:</strong><br>
                    {email}
                </p>

                <p style="margin: 0 0 12px; font-size: 14px;">
                    <strong>Phone:</strong><br>
                    {phone}
                </p>

                <p style="margin: 0; font-size: 14px;">
                    <strong>Company:</strong><br>
                    {company_name}
                </p>

            </div>

            <!-- Services -->
            <h2 style="
                margin: 28px 0 16px;
                font-size: 18px;
                color: #111827;
            ">
                Services Interested In
            </h2>

            <div style="
                background-color: #f9fafb;
                border-left: 4px solid #111827;
                padding: 16px 18px;
                border-radius: 4px;
                font-size: 14px;
                line-height: 1.6;
            ">
                {interested_service}
            </div>

            <!-- Message -->
            <h2 style="
                margin: 28px 0 16px;
                font-size: 18px;
                color: #111827;
            ">
                Message
            </h2>

            <div style="
                background-color: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 18px;
                font-size: 14px;
                line-height: 1.7;
                color: #4b5563;
                white-space: pre-line;
            ">
                {message}
            </div>

            <!-- CTA -->
            <div style="
                margin-top: 30px;
                padding: 18px;
                background-color: #fef3c7;
                border-radius: 8px;
                text-align: center;
            ">
                <p style="
                    margin: 0;
                    font-size: 14px;
                    font-weight: 600;
                    color: #92400e;
                ">
                    Please contact this lead as soon as possible.
                </p>
            </div>

        </div>

        <!-- Footer -->
        <div style="
            padding: 20px 32px;
            background-color: #f9fafb;
            border-top: 1px solid #e5e7eb;
            text-align: center;
        ">
            <p style="
                margin: 0;
                font-size: 12px;
                color: #9ca3af;
            ">
                This is an automated notification from the AiGRO website.
            </p>
        </div>

    </div>

</body>
</html>
"""
            brevo_client.transactional_emails.send_transac_email(
                subject="New Consultation Request",
                html_content=email_message,
                sender=SendTransacEmailRequestSender(
                    name="AiGRO",
                    email="contact.aigr0@gmail.com"
                ),
                to=[SendTransacEmailRequestToItem(
                    email="contact.aigr0@gmail.com"
                )]
            )
            
            messages.success(request, "Your message has been sent successfully. Our team will contact you within 1 business day.")
            return redirect('contact_us')
        
        else:
            messages.error(request=request, message="Please check the \"I agree to Anthony Media Group's Terms of Service and Privacy Policy.\" for further contacting")
            return redirect('contact_us')
            
    return render(request=request, template_name='contact.html')

def careers(request):
    return render(request=request, template_name='career.html')