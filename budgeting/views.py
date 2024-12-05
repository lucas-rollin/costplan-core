import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, JsonResponse
from django.db import IntegrityError
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .utils import build_cost_composition_data
from django.db.models import Sum, F


from .models import User, Project, ProjectBDI, CostBreakdownSheet, ProjectCostBreakdown, CostComposition, CostBreakdownTemplate, Resource


@login_required
def index(request):
    """Loads the index page or sets the active project in the session."""
    if request.method == "POST":
        project_id = request.POST["project_id"]
        request.session["project_id"] = project_id
        return HttpResponseRedirect(reverse("index"))  # Clean URL redirect

    project_id = request.session.get("project_id")
    if not project_id:
        return HttpResponseRedirect(reverse("project"))  # Redirect if no project_id found

    try:
        project = Project.objects.get(pk=project_id)
    except Project.DoesNotExist:
        return HttpResponseRedirect(reverse("project"))

    cbs = CostBreakdownSheet.objects.all().order_by('id')
    user = request.user
    template = CostBreakdownTemplate.get_visible_templates(user)

    return render(request, "budgeting/index.html", {
        "project": project,
        "cbs": cbs,
        "template": template,
    })


def login_view(request):
    """Handles user authentication."""
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("project"))
        else:
            return render(request, "budgeting/login.html", {
                "message": "Usuário e/ou senha inválidos"
            })
    else:
        return render(request, "budgeting/login.html")


def logout_view(request):
    """Logs out the user."""
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "budgeting/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "budgeting/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "budgeting/register.html")


@login_required
def project(request):
    """Loads the project selection page and handles project creation."""
    if request.method == "POST":
        # Get image and content data
        data = json.loads(request.body)
        code = data.get("code", "")
        name = data.get("name", "")

        # Reject blank content field
        if not code or not name:
            return JsonResponse({"error": "Missing required field."}, status=400)

        # Save project to Project model
        project = Project(user=request.user, code=code, name=name)
        project.save()

        project.generate_bdi()
        project.generate_cost_breakdown()

        return JsonResponse({"message": "Project created successfully.", "project_id": project.pk}, status=201)
    
    projects = Project.objects.filter(user=request.user)

    return render(request, "budgeting/project.html", {
        "projects": [project for project in projects]
    })


@login_required
def update_project(request):
    """Updates project details."""
    if request.method == "PUT":

        project_id = request.session.get("project_id")
        project = get_object_or_404(Project, pk=project_id, user=request.user)

        if request.user != project.user:
            return JsonResponse({"error": "You don't have permission to update this project."}, status=403)

        data = json.loads(request.body)

        # Update basic project fields
        project.code = data.get('notice', project.code)
        project.name = data.get('name', project.name)
        project.date = data.get('date', project.date)
        project.description = data.get('description', project.description)
        project.location = data.get('location', project.location)

        # Handle template selection
        template_id = data.get('template')
        if template_id:
            visible_templates = CostBreakdownTemplate.get_visible_templates(request.user)
            try:
                template = visible_templates.get(pk=template_id)
                project.template = template
            except CostBreakdownTemplate.DoesNotExist:
                return JsonResponse({"error": "Invalid template selected."}, status=400)

        project.save()

        return JsonResponse({"message": "Project updated successfully."})
    return JsonResponse({"error": "PUT request required."})


@login_required
def template(request):
    """Handles template creation."""
    if request.method == "POST":
        # Get image and content data
        data = json.loads(request.body)
        name = data.get("name", "")
        base_template = data.get("base_template", "")
        description = data.get("description", "")

        # Reject blank content field
        if not name or not base_template:
            return JsonResponse({"error": "Missing required field."}, status=400)

        # Save template to CostBreakdownTemplate model
        template = CostBreakdownTemplate(user=request.user, name=name, description=description)
        template.save()

        # Copy all cost compositions from the base template
        base_template = CostBreakdownTemplate(pk=base_template)
        base_compositions = CostComposition.objects.filter(template=base_template)

        new_template_compositions =  [
            CostComposition(
                item=c.item,
                resource=c.resource,
                template=template,
                quantity=c.quantity
            )
            for c in base_compositions
        ]

        # Bulk create all objects
        CostComposition.objects.bulk_create(new_template_compositions)

        return JsonResponse({"message": "Project created successfully.", "template_id": template.pk}, status=201)
    return JsonResponse({"error": "POST request required."}, status=400)


@login_required
def update_cbs(request):
    """Updates quantities in the ProjectCostBreakdown model."""
    if request.method == "PUT":
        project_id = request.session.get("project_id")
        project = get_object_or_404(Project, pk=project_id, user=request.user)

        data = json.loads(request.body)

        updates = []
        
        for key, value in data.items():
            try:
                value = float(value.replace(".","").replace(",", "."))
            except ValueError:
                return JsonResponse({"error": f"Invalid value for {key}."}, status=400)

            cbs_item = ProjectCostBreakdown.objects.filter(project=project, standard_item=key).first()
            if cbs_item:
                cbs_item.quantity = value
                updates.append(cbs_item)
            else:
                return JsonResponse({"error": f"CBS item {key} not found."}, status=404)

        ProjectCostBreakdown.objects.bulk_update(updates, ['quantity'])

        return JsonResponse({"message": "Cost Breakdown Sheet updated successfully."})
    return JsonResponse({"error": "PUT request required."}, status=400)


@login_required
def get_cbs(request):
    """Fetches ProjectCostBreakdown data for display."""
    project_id = request.session.get("project_id")
    project = get_object_or_404(Project, pk=project_id, user=request.user)
    bdi = (1 + ProjectBDI.objects.filter(project=project_id).aggregate(Sum('rate'))['rate__sum'] / 100)

    cbs_items = ProjectCostBreakdown.objects.filter(project=project).select_related("standard_item")
    data = [
        {
            "id": item.standard_item.id,
            "quantity": item.quantity,
            "unit_cost": item.unit_cost * bdi,
            "total_cost": item.total_cost * bdi,
        }
        for item in cbs_items
    ]
    return JsonResponse(data, safe=False)


@login_required
def cost_composition(request):
    """Fetches detailed data for a single cost composition."""
    template_id = request.GET.get("template") or 1
    composition_id = request.GET.get("composition")
    project_id = request.session.get("project_id")

    template = get_object_or_404(CostBreakdownTemplate, pk=template_id)
    cost_breakdown_sheet = get_object_or_404(CostBreakdownSheet, id=composition_id)
    bdi = ProjectBDI.objects.filter(project=project_id).aggregate(Sum('rate'))['rate__sum']

    # Get related CostComposition entries
    cost_compositions = CostComposition.objects.filter(
        item=cost_breakdown_sheet, template_id=template
    ).select_related('resource')

    # Get the ProjectCostBreakdown entry
    project_cost_breakdown = ProjectCostBreakdown.objects.get(
        project_id=project_id, 
        standard_item=cost_breakdown_sheet
    )

    # Use the helper function to build the response data
    response = build_cost_composition_data(cost_compositions, project_cost_breakdown, bdi)

    response = {
        "data": build_cost_composition_data(cost_compositions, project_cost_breakdown, bdi),
        "can_edit": (template.user == request.user) 
    }

    return JsonResponse(response, safe=False)


@login_required
def cost_composition_all(request):
    """Provides paginated data for multiple cost compositions."""
    # Get query parameters
    page_number = request.GET.get("page") or 1
    template_id = request.GET.get("template") or 1
    project_id = request.session.get("project_id")

    # Load models
    template = get_object_or_404(CostBreakdownTemplate, pk=template_id)
    cost_breakdown_sheets = CostBreakdownSheet.objects.filter(is_leaf=True).order_by('id').values()
    bdi = ProjectBDI.objects.filter(project=project_id).aggregate(Sum('rate'))['rate__sum']
    
    # Paginate the results
    paginator = Paginator(cost_breakdown_sheets, 5)  # 10 items per page
    try:
        page_obj = paginator.page(page_number)
    except PageNotAnInteger:
        page_obj = paginator.page(1)
    except EmptyPage:
        page_obj = paginator.page(paginator.num_pages)

    # Build JSON data for each sheet on the current page
    data = []
    for sheet in page_obj.object_list:
        sheet_instance = CostBreakdownSheet.objects.get(id=sheet["id"])
        project_cost_breakdown = ProjectCostBreakdown.objects.get(project_id=project_id, standard_item=sheet_instance)    
        cost_compositions = CostComposition.objects.filter(item=sheet_instance, template_id=template).select_related('resource')
        sheet_data = build_cost_composition_data(cost_compositions, project_cost_breakdown, bdi)
        data.append(sheet_data)

    # Include pagination metadata
    response = {
        "data": data,
        "pagination": {
            "current_page": page_obj.number,
            "total_pages": paginator.num_pages,
            "has_next": page_obj.has_next(),
            "has_previous": page_obj.has_previous(),
        }
    }

    return JsonResponse(response, safe=False)


@login_required
def update_bdi(request):
    """Edits project-specific BDI rates."""
    if request.method == "PUT":
        project_id = request.session.get("project_id")
        project = get_object_or_404(Project, pk=project_id, user=request.user)

        data = json.loads(request.body)
        updates = []
        
        for key, value in data.items():
            try:
                value = float(value.replace(",", "."))
            except ValueError:
                return JsonResponse({"error": f"Invalid value for {key}."}, status=400)

            bdi_item = ProjectBDI.objects.filter(project=project, bdi_item=key).first()
            if bdi_item:
                bdi_item.rate = value
                updates.append(bdi_item)
            else:
                return JsonResponse({"error": f"BDI item {key} not found."}, status=404)

        ProjectBDI.objects.bulk_update(updates, ['rate'])

        return JsonResponse({"message": "BDI updated successfully."})
    return JsonResponse({"error": "PUT request required."}, status=400)


@login_required
def get_bdi(request):
    """Fetches BDI data."""
    project_id = request.session.get("project_id")
    project = get_object_or_404(Project, pk=project_id, user=request.user)

    bdi_items = ProjectBDI.objects.filter(project=project).select_related("bdi_item")
    data = [
        {
            "id": item.bdi_item.id,
            "rate": item.rate
        }
        for item in bdi_items
    ]
    return JsonResponse(data, safe=False)


@login_required
def update_composition(request, template_id, composition_id):
    """Edits cost composition entries."""
    if request.method == "PUT":
        user = request.user

        template = get_object_or_404(CostBreakdownTemplate, pk=template_id, user=user)
        compostion = get_object_or_404(CostBreakdownSheet, pk=composition_id)

        data = json.loads(request.body)
        updates = []

        data = json.loads(request.body)
        updates = []
        
        for key, value in data.items():
            try:
                value = float(value.replace(",", "."))
            except ValueError:
                return JsonResponse({"error": f"Invalid value for {key}."}, status=400)

            resource = CostComposition.objects.get(template=template, item=compostion, resource=key)
            print(resource)
            if resource:
                resource.quantity = value
                updates.append(resource)
            else:
                return JsonResponse({"error": f"Resource {key} in Composition {compostion.pk} not found."}, status=404)
        print(updates)
        CostComposition.objects.bulk_update(updates, ['quantity'])

        return JsonResponse({"message": "Cost Composition updated successfully."})
    return JsonResponse({"error": "PUT request required."}, status=400)


@login_required
def report(request, project_id):
    """Generates a PDF report for a given project."""
    project = get_object_or_404(Project, pk=project_id, user=request.user)
    cbs = CostBreakdownSheet.objects.all().order_by('id')
    user = request.user
    template = CostBreakdownTemplate.get_visible_templates(user)

    return render(request, "budgeting/report.html", {
        "project": project,
        "cbs": cbs,
        "template": template
    })
    

def get_project_resource(request):
    """Fetches resource data with total quantities and cost."""
    project_id = request.session.get("project_id")

    # Get resources and annotate total quantity
    resources = Resource.objects.filter(
        cost_composition__item__project_breakdowns__project_id=project_id
    ).annotate(
        quantity=Sum(F("cost_composition__quantity") * F("cost_composition__item__project_breakdowns__quantity"))
    )

    # Create a JSON structure
    data = [
        {
            "id": resource.id,
            "name": resource.name,
            "unit": resource.unit.symbol,
            "quantity": float(resource.quantity) if resource.quantity else 0,
            "unit_cost": float(resource.cost),
            "total_cost": float(resource.cost * resource.quantity) if resource.quantity else 0,
        }
        for resource in resources
    ]

    # Convert to JSON string
    return JsonResponse(data, safe=False)