from django.contrib import admin
from django.http import HttpRequest
from .models import User, Project, BudgetDifferenceIncome, ProjectBDI, CostBreakdownSheet, ProjectCostBreakdown, CostComposition, MeasurementUnit, Resource, CostBreakdownTemplate

admin.site.register(User)
admin.site.register(CostComposition)
admin.site.register(Project)
admin.site.register(ProjectBDI)
admin.site.register(CostBreakdownSheet)
admin.site.register(ProjectCostBreakdown)
admin.site.register(MeasurementUnit)

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    # Fields to display in the list view
    list_display = ('id', 'name', 'cost', 'unit')
    
    # Enable a search bar
    search_fields = ('id', 'name')
    
    # Default ordering
    ordering = ('id',)


@admin.register(BudgetDifferenceIncome)
class BudgetDifferenceIncomeAdmin(admin.ModelAdmin):

    # Fields to display in the list view
    list_display = ('id', 'description', 'default_rate')
    
    # Default ordering
    ordering = ('id',)

    readonly_fields = ['id']  # Make the primary key read-only

    # Disable deletion and creation of objects
    def has_delete_permission(self, request, obj=None):
        return False
    
    def has_add_permission(self, request):
        return False


@admin.register(CostBreakdownTemplate)
class CostBreakdownTemplateAdmin(admin.ModelAdmin):

    # Fields to display in the list view
    list_display = ('name', 'created_at', 'user')
    
    # Enable a search bar
    search_fields = ('id', 'name')
    
    # Default ordering
    ordering = ('id',)

    # Disable deletion or change of object with ID=1, aka. the standard Template
    def has_delete_permission(self, request, obj=None):
        if obj and obj.id == 1:
            return False
        return super().has_delete_permission(request, obj=obj)
    
    def has_change_permission(self, request, obj=None):
        if obj and obj.id ==1:
            return False
        return super().has_change_permission(request, obj)