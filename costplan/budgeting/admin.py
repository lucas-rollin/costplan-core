from django.contrib import admin
from .models import User, Project, BudgetDifferenceIncome, ProjectBDI, CostBreakdownSheet, ProjectCostBreakdown, CostComposition, MeasurementUnit, Resource, Charge, Material, Labor, Service, CostBreakdownTemplate, ProjectCharge

admin.site.register(User)
admin.site.register(Charge)
admin.site.register(ProjectCharge)
admin.site.register(Resource)
admin.site.register(Material)
admin.site.register(Labor)
admin.site.register(Service)
admin.site.register(CostComposition)
admin.site.register(Project)
admin.site.register(BudgetDifferenceIncome)
admin.site.register(ProjectBDI)
admin.site.register(CostBreakdownSheet)
admin.site.register(ProjectCostBreakdown)
admin.site.register(MeasurementUnit)
admin.site.register(CostBreakdownTemplate)

