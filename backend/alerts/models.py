from django.db import models

# Create your models here.



class Company(models.Model):
    name = models.CharField(max_length=100)
    industry = models.CharField(max_length=100)

class JobPosting(models.Model):
    title = models.CharField(max_length=100)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    budget = models.DecimalField(max_digits=10, decimal_places=2)  # salary budget


