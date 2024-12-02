from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Sum


class User(AbstractUser):
    pass


class Project(models.Model):
    PROJECT_TYPE_CHOICES = [
        ("1", "Construção e Montagem de Linha Tronco de Aço Carbono"),
        ("2", "Construção e Montagem de Linha Tronco de Aço Carbono + PEAD"),
        ("3", "Construção e Montagem de Linha de Distribuição de Aço Carbono"),
        ("4", "Construção e Montagem de Remanejamento e/ou Proteção Mecânica da RDGN"),
        ("5", "Construção e Montagem de Linha de Distribuição de Aço Carbono + PEAD")
    ]

    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='projects')
    notice = models.IntegerField()
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=1, choices=PROJECT_TYPE_CHOICES, blank=True, null=True)
    date = models.DateField(auto_now_add=True)
    execution_regime = models.CharField(max_length=100, blank=True, null=True)
    requesting_area = models.CharField(max_length=100, blank=True, null=True)
    contract_term = models.IntegerField(blank=True, null=True)
    execution_term = models.IntegerField(blank=True, null=True)
    mobilization_term = models.IntegerField(blank=True, null=True)
    template = models.ForeignKey('CostBreakdownTemplate', on_delete=models.SET_NULL, blank=True, null=True, related_name='projects')

    class Meta:
        verbose_name = "Projeto"

    def __str__(self):
        return f"{self.name} (Notice: {self.notice})"

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

    def generate_charge(self):
        """Generates an empty BDI for this project."""
        charge_items = Charge.objects.all()

        # Prepare a list of ProjectCharge objects
        charge_entries = [
            ProjectCharge(
                project=self,
                charge_item=item,
                rate=item.default_rate  # Use the default rate for each item
            )
            for item in charge_items
        ]
        
        # Bulk create all objects
        ProjectCharge.objects.bulk_create(charge_entries)


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
        return f"{self.bdi_item.item} - {self.bdi_item.description}: R$ {self.rate}"


class Charge(models.Model):
    CATEGORY_CHOICES = [
        ("A", "GRUPO A"),
        ("B", "GRUPO B"),
        ("C", "GRUPO C"),
        ("D", "GRUPO D")
    ]

    id = models.CharField(max_length=2, primary_key=True)
    category = models.CharField(max_length=1, default="A", choices=CATEGORY_CHOICES)
    description = models.CharField(max_length=110)
    default_rate = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        verbose_name = "Encargo"


class ProjectCharge(models.Model):
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name="charge")
    charge_item = models.ForeignKey('Charge', on_delete=models.CASCADE, related_name="rate")
    rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        verbose_name = "Encargos-Projeto"
        unique_together = ('project', 'charge_item')
    
    def __str__(self):
        return f"{self.charge_item.id} - {self.charge_item.description}: R$ {self.rate}"


class CostBreakdownTemplate(models.Model):
    """Template for Cost Breakdown Sheets."""
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name="templates")  # Null if it's a standard template  

    class Meta:
        verbose_name = "PPU-Template"

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
        ("km", "Quilometro"),
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
        verbose_name = "PPU-Padrão"

    def __str__(self):
        return f"{self.id} {self.name}"
    
    def unit_cost(self, project):
        if self.is_leaf:
            return sum(composition.total_cost(project) for composition in self.cost_composition.all())
        else:
            return sum(child.unit_cost(project) for child in self.children.all())


class ProjectCostBreakdown(models.Model):
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='cost_breakdowns')
    standard_item = models.ForeignKey('CostBreakdownSheet', on_delete=models.CASCADE, related_name='project_breakdowns')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        verbose_name = "PPU projeto"
        unique_together = ('project', 'standard_item')

    def __str__(self):
        return f"{self.project.name}: {self.standard_item.name} (Quantity: {self.quantity})"

    @property
    def unit_cost(self):
        """Calculate the unit cost of the standard item associated with this breakdown."""
        return self.standard_item.unit_cost(self.project)

    @property
    def total_cost(self):
        """Calculate the total cost for this breakdown based on quantity and unit cost."""
        return self.unit_cost * self.quantity


class CostComposition(models.Model):
    item = models.ForeignKey('CostBreakdownSheet', on_delete=models.CASCADE, related_name='cost_composition')
    resource = models.ForeignKey('Resource', on_delete=models.CASCADE, related_name='cost_composition')
    template = models.ForeignKey('CostBreakdownTemplate', on_delete=models.CASCADE, blank=True, null=True, related_name='cost_composition')
    quantity = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = "CPU"
        unique_together = ('item', 'resource', 'template')

    def __str__(self):
        return f"{self.resource} - {self.item}"
    
    def total_cost(self, project):
        """Calculate the total cost for this resource in the composition."""
        return self.resource.get_cost(project) * self.quantity


class MeasurementUnit(models.Model):
    symbol = models.CharField(max_length=16)
    name = models.CharField(max_length=32)

    class Meta:
        verbose_name = "Unidade de Medida"
        verbose_name_plural = "Unidades de Medida"

    def __str__(self):
        return f"{self.symbol}"


class Resource(models.Model):
    RESOURCE_TYPE_CHOICES = [
        ('m', 'Material'), # Material
        ('l', 'Mão de obra'), # Labor
        ('s', 'Serviço') # Service
    ]
    
    id = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=200)
    unit = models.ForeignKey('MeasurementUnit', on_delete=models.CASCADE, blank=True, null=True, related_name='%(class)s_units')
    resource_type = models.CharField(max_length=1, choices=RESOURCE_TYPE_CHOICES, blank=True, null=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    is_leaf = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Recurso"

    def __str__(self):
        return f"{self.id} {self.name} ({self.resource_type})"


    def get_cost(self, project):
        if self.resource_type == 'm':
            return self.material.get_cost()
        elif self.resource_type == 'l':
            return self.labor.get_cost(project)
        elif self.resource_type == 's':
            return self.service.get_cost()
        else:
            raise ValueError(f"Unknown resource type: {self.resource_type}")


class Material(Resource):
    cost = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = "Material"
        verbose_name_plural = "Materiais"

    def __str__(self):
        return f"{self.id} {self.name} ({self.resource_type})"

    def get_cost(self):
        """Returns the material cost."""
        return self.cost


class Labor(Resource):
    LABOR_TYPE_CHOICES = [
        ("d", "direct"),
        ("i", "indirect")
    ]

    base_cost = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=1, choices=LABOR_TYPE_CHOICES)
    dangerousness = models.DecimalField(max_digits=3, decimal_places=2)

    class Meta:
        verbose_name = "Mão de obra"
        verbose_name_plural = verbose_name

    def __str__(self):
        return f"{self.id} {self.name} ({self.resource_type})"

    def get_cost(self, project):
        """Calculate the adjusted labor cost based on charges."""
        charges = ProjectCharge.objects.filter(project=project).aggregate(Sum('rate'))['rate__sum'] or 0
        return self.base_cost * (1 + charges / 100) * self.dangerousness


class Service(Resource):
    cost = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = "Serviço"
        verbose_name_plural = "Serviços"

    def __str__(self):
        return f"{self.id} {self.name} ({self.resource_type})"

    def get_cost(self):
        """Returns the service cost."""
        return self.cost
