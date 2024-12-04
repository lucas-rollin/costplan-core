from django.contrib import admin
from .models import User, Project, BudgetDifferenceIncome, ProjectBDI, CostBreakdownSheet, ProjectCostBreakdown, CostComposition, MeasurementUnit, Resource, CostBreakdownTemplate

admin.site.register(User)
admin.site.register(Resource)
admin.site.register(CostComposition)
admin.site.register(Project)
admin.site.register(BudgetDifferenceIncome)
admin.site.register(ProjectBDI)
admin.site.register(CostBreakdownSheet)
admin.site.register(ProjectCostBreakdown)
admin.site.register(MeasurementUnit)
admin.site.register(CostBreakdownTemplate)

