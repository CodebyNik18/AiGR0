from django.db import models

class Home_HeroSection(models.Model):
    page_title = models.CharField(max_length=100)
    hero_title = models.CharField(max_length=500)
    hero_body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.hero_title
    
    
class Home_ApproachSection(models.Model):
    approach_title = models.CharField(max_length=500)
    approach_body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.approach_title
    
    
# class AboutPage(models.Model):
#     page_title = models.CharField(max_length=100)
#     about_title = models.CharField(max_length=250)
#     about_description = models.CharField(max_length=300)
#     mission_title = models.CharField(max_length=250)
#     mission_description = models.TextField()
#     quote = models.CharField(max_length=250)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     def __str__(self):
#         return self.about_title
    

# class ServicePage(models.Model):
#     page_title = models.CharField(max_length=100)
#     service_title = models.CharField(max_length=250)
#     service_description = models.CharField(max_length=300)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     def __str__(self):
#         return self.service_title
    

# class CareerPage(models.Model):
#     page_title = models.CharField(max_length=100)
#     career_title = models.CharField(max_length=250)
#     career_description = models.CharField(max_length=300)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     def __str__(self):
#         return self.career_title


# class FAQ(models.Model):
#     ADMIN_SERVICE_CHOICE = [
#         ('WDD', 'Web Design Dev'),
#         ('SEO', 'Search Engine Optimization'),
#         ('GA', 'Google Ads'),
#         ('SM', 'Social Marketing'),
#         ('VM', 'Video Marketing'),
#         ('PR', 'Public Relations'),
#     ]
    
#     services = models.CharField(choices=ADMIN_SERVICE_CHOICE)
#     question = models.CharField(max_length=250)
#     answer = models.CharField(max_length=300)
#     created_at = models.DateTimeField(auto_now=True)
#     updated_at = models.DateTimeField(auto_now_add=True)