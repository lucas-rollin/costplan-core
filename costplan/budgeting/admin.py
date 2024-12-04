from django.contrib import admin
from .models import User, Project, BudgetDifferenceIncome, ProjectBDI, CostBreakdownSheet, ProjectCostBreakdown, CostComposition, MeasurementUnit, Resource, CostBreakdownTemplate

admin.site.register(User)
admin.site.register(CostComposition)
admin.site.register(Project)
admin.site.register(BudgetDifferenceIncome)
admin.site.register(ProjectBDI)
admin.site.register(CostBreakdownSheet)
admin.site.register(ProjectCostBreakdown)
admin.site.register(MeasurementUnit)
admin.site.register(CostBreakdownTemplate)

class ResourceAdmin(admin.ModelAdmin):
    # Fields to display in the list view
    list_display = ('id', 'name', 'cost', 'unit')
    
    # Enable a search bar
    search_fields = ('id', 'name')
    
    # Default ordering
    ordering = ('id',)

# Register the model with the custom admin options
admin.site.register(Resource, ResourceAdmin)