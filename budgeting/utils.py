def build_cost_composition_data(cost_compositions, project_cost_breakdown, bdi):
    """
    Converts CostComposition data into a JSON-serializable format, including header information.
    """
    resources = set()
    for composition in cost_compositions:
        resource = composition.resource
        resources.add(resource)

    # Convert resources to a sorted list based on ID
    sorted_resources = sorted(resources, key=lambda r: r.id)

    # Build the response data
    items = []
    for resource in sorted_resources:
        # Leaf node corresponds to a CostComposition
        composition = cost_compositions.get(resource=resource)
        project_quantity = project_cost_breakdown.quantity * composition.quantity
        project_cost = composition.resource.cost * project_quantity
        items.append({
            "id": resource.id,
            "name": resource.name,
            "unit": resource.unit.symbol if resource.unit else "",
            "quantity": composition.quantity,
            "unit_cost": resource.cost,
            "total_cost": composition.total_cost(),
            "project_quantity": project_quantity,
            "project_cost": project_cost,
        })


    # Create header information
    header = {
        "id": project_cost_breakdown.standard_item.id,
        "name": project_cost_breakdown.standard_item.name,
        "unit": project_cost_breakdown.standard_item.unit,
        "quantity": project_cost_breakdown.quantity,
        "unit_cost": project_cost_breakdown.unit_cost,
        "total_cost": project_cost_breakdown.total_cost,
        "total_cost_bdi": project_cost_breakdown.total_cost * (1 + bdi / 100),
        "bdi": bdi
    }

    return {"items": items, "header": header}
