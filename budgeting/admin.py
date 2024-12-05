from django.contrib import admin
from .models import User, Project, BudgetDifferenceIncome, ProjectBDI, CostBreakdownSheet, ProjectCostBreakdown, CostComposition, MeasurementUnit, Resource, CostBreakdownTemplate

admin.site.register(User)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'date' ,'user')
    search_fields = ('code', 'name')
    ordering = ('date',)


@admin.register(BudgetDifferenceIncome)
class BudgetDifferenceIncomeAdmin(admin.ModelAdmin):
    list_display = ('id', 'description', 'default_rate')
    ordering = ('id',)

    readonly_fields = ['id']  # Make the primary key read-only

    # Disable deletion and creation of objects
    def has_delete_permission(self, request, obj=None):
        return False
    
    def has_add_permission(self, request):
        return False


@admin.register(ProjectBDI)
class ProjectBDIAdmin(admin.ModelAdmin):
    list_display = ('project', 'bdi_item', 'rate')
    search_fields = ('project', 'bdi_item')
    ordering = ('project', 'bdi_item')


@admin.register(CostBreakdownTemplate)
class CostBreakdownTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'user')
    search_fields = ('id', 'name')
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


@admin.register(CostBreakdownSheet)
class CostBreakdownSheetAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'unit', 'is_leaf')
    search_fields = ('id', 'name')
    ordering = ('id',)


@admin.register(ProjectCostBreakdown)
class ProjectCostBreakdownAdmin(admin.ModelAdmin):
    list_display = ('project', 'standard_item', 'quantity')
    search_fields = ('project', 'standard_item')
    ordering = ('project', 'standard_item')


@admin.register(CostComposition)
class CostCompositionAdmin(admin.ModelAdmin):
    list_display = ('item', 'resource', 'template', 'quantity')
    search_fields = ('item', 'resource')
    ordering = ('item', 'resource')


@admin.register(MeasurementUnit)
class MeasurementUnitAdmin(admin.ModelAdmin):
    list_display = ('symbol', 'name')
    ordering = ('symbol',)


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'unit', 'cost')
    search_fields = ('id', 'name')
    ordering = ('id',)