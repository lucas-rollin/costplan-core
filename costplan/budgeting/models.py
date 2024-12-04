from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Project(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='projects')
    code = models.CharField(max_length=16)
    name = models.CharField(max_length=100)
    date = models.DateField(auto_now=True, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    template = models.ForeignKey('CostBreakdownTemplate', default=1, on_delete=models.SET_NULL, blank=True, null=True, related_name='projects')

    class Meta:
        verbose_name = "Projeto"

    def __str__(self):
        return f"{self.name} (Notice: {self.code})"

    def generate_cost_breakdown(self):
        """Generates a new cost breakdown for this project based on the standard structure."""
        standard_items = CostBreakdownSheet.objects.all()
        
        # Prepare a list of ProjectCostBreakdown objects
        project_breakdowns = [
            ProjectCostBreakdown(
                project=self,
                standard_item=item,
                quantity=0
            )
            for item in standard_items if item.is_leaf
        ]
        
        # Bulk create all objects
        ProjectCostBreakdown.objects.bulk_create(project_breakdowns)
    
    def generate_bdi(self):
        """Generates an empty BDI for this project."""
        bdi_items = BudgetDifferenceIncome.objects.all()

        # Prepare a list of ProjectBDI objects
        bdi_entries = [
            ProjectBDI(
                project=self,
                bdi_item=item,
                rate=item.default_rate  # Use the default rate for each item
            )
            for item in bdi_items
        ]
        
        # Bulk create all objects
        ProjectBDI.objects.bulk_create(bdi_entries)


class BudgetDifferenceIncome(models.Model):
    CATEGORY_CHOICES = [
        ("1", "AC - ADMINISTRAÇÃO CENTRAL"),
        ("2", "S - SEGUROS"),
        ("3", "R - RISCOS"),
        ("4", "G - GARANTIAS"),
        ("5", "DF - DESPESAS FINANCEIRAS"),
        ("6", "BONIFICAÇÃO"),
        ("7", "ALÍQUOTA DOS TRIBUTOS INCIDENTES SOBRE O VALOR TOTAL DA OBRA"),
    ]

    class Meta:
        verbose_name = "BDI"
        verbose_name_plural = "BDI"

    id = models.CharField(max_length=3, primary_key=True)
    category = models.CharField(max_length=1, choices=CATEGORY_CHOICES)
    description = models.CharField(max_length=200)
    default_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)


class ProjectBDI(models.Model):
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name="bdi")
    bdi_item = models.ForeignKey('BudgetDifferenceIncome', on_delete=models.CASCADE, related_name="rate")
    rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        verbose_name = "BDI-Projeto"
        unique_together = ('project', 'bdi_item')
    
    def __str__(self):
        return f"{self.bdi_item.id} - {self.bdi_item.description}: R$ {self.rate}"


class CostBreakdownTemplate(models.Model):
    """Template for Cost Breakdown Sheets."""
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name="templates")  # Null if it's a standard template  

    class Meta:
        verbose_name = "Template"

    def __str__(self):
        return f"{self.name} (Standard)" if self.user is None else f"{self.name} (User: {self.user.username})"

    @classmethod
    def get_standard_templates(cls):
        return cls.objects.filter(user__isnull=True)

    @classmethod
    def get_user_templates(cls, user):
        return cls.objects.filter(user=user)

    @classmethod
    def get_visible_templates(cls, user):
        return cls.objects.filter(models.Q(user__isnull=True) | models.Q(user=user))


class CostBreakdownSheet(models.Model):
    POSSIBLE_UNITS = (
        ("un", "Unidade"),
        ("m", "Metro"),
        ("kg", "Quilograma"),
        ("m²", "Metro quadrado"),
        ("m³", "Metro cúbico")
    )

    id = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=255)
    unit = models.CharField(max_length=2, choices=POSSIBLE_UNITS, blank=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='children')
    is_leaf = models.BooleanField(default=True)
    resources = models.ManyToManyField('Resource', through='CostComposition', related_name='cost_breakdowns', blank=True)
    
    class Meta:
        verbose_name = "PPU"
        verbose_name_plural = "PPU"

    def __str__(self):
        return f"{self.id} {self.name}"
    
    def unit_cost(self):
        if self.is_leaf:
            return sum(composition.total_cost() for composition in self.cost_composition.all())
        else:
            return sum(child.unit_cost() for child in self.children.all())


class ProjectCostBreakdown(models.Model):
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='cost_breakdowns')
    standard_item = models.ForeignKey('CostBreakdownSheet', on_delete=models.CASCADE, related_name='project_breakdowns')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        verbose_name = "PPU-projeto"
        unique_together = ('project', 'standard_item')

    def __str__(self):
        return f"{self.project.name}: {self.standard_item.name} (Quantity: {self.quantity})"

    @property
    def unit_cost(self):
        """Calculate the unit cost of the standard item associated with this breakdown."""
        return self.standard_item.unit_cost()

    @property
    def total_cost(self):
        """Calculate the total cost for this breakdown based on quantity and unit cost."""
        return self.unit_cost * self.quantity


class CostComposition(models.Model):
    item = models.ForeignKey('CostBreakdownSheet', on_delete=models.CASCADE, related_name='cost_composition')
    resource = models.ForeignKey('Resource', on_delete=models.CASCADE, related_name='cost_composition')
    template = models.ForeignKey('CostBreakdownTemplate', on_delete=models.CASCADE, default=1, related_name='cost_composition')
    quantity = models.DecimalField(max_digits=10, decimal_places=4)

    class Meta:
        verbose_name = "CPU"
        unique_together = ('item', 'resource', 'template')

    def __str__(self):
        return f"{self.item} - {self.resource.id}, quantity: {self.quantity}"
    
    def total_cost(self):
        """Calculate the total cost for this resource in the composition."""
        return self.resource.cost * self.quantity


class MeasurementUnit(models.Model):
    symbol = models.CharField(max_length=16)
    name = models.CharField(max_length=32)

    class Meta:
        verbose_name = "Unidade de Medida"
        verbose_name_plural = "Unidades de Medida"

    def __str__(self):
        return f"{self.symbol}"


class Resource(models.Model):    
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=200)
    unit = models.ForeignKey('MeasurementUnit', on_delete=models.CASCADE, blank=True, null=True, related_name='%(class)s_units')
    cost = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = "Recurso"

    def __str__(self):
        return f"{self.id} - {self.name}"


