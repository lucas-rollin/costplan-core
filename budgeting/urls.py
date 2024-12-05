from django.contrib.auth import views as auth_views
from django.urls import path
from . import views

urlpatterns = [
    # Web views
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("project", views.project, name="project"),
    path("update_project", views.update_project, name="update_project"),
    path("template", views.template, name="template"),
    path("update_bdi", views.update_bdi, name="update_bdi"),
    path("update_cbs", views.update_cbs, name="update_cbs"),
    path("update_composition/<int:template_id>/<str:composition_id>", views.update_composition, name="update_composition"),
    path("pdf/report/<int:project_id>", views.report, name="report"),

    # API routes
    path("api/get_bdi", views.get_bdi, name="get_bdi"),
    path("api/get_cbs", views.get_cbs, name="get_cbs"),
    path("api/cost_composition", views.cost_composition, name="cost_composition"),
    path("api/cost_composition_all", views.cost_composition_all, name="cost_composition_all"),
    path("api/get_project_resource", views.get_project_resource, name="get_project_resource"),
]