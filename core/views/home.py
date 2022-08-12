from django.shortcuts import HttpResponse, render

from core.services.dashboard_service import DashboardService

def index(request, path):
    return render(request, "core/index.html")

def viewer(request, identifier):
    dashboard = DashboardService.get_dashboard_by_identifier(identifier)
    if dashboard is None:
        return HttpResponse("Classroom not found.")
    return render(request, "core/viewer.html", {"identifier": identifier})
