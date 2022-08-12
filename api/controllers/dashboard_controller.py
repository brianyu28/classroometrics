from sqlite3 import IntegrityError
from django.http import JsonResponse
from django.http.request import HttpRequest
from django.views.decorators.http import require_http_methods

from core.models import User
from core.services.dashboard_service import DashboardException, DashboardService

from api.util import api_error, parse_json, require_authentication, require_fields

@require_http_methods(["GET", "POST"])
@parse_json()
@require_fields(["identifier", "title"])
@require_authentication
def dashboards(user: User, request: HttpRequest, body: dict) -> JsonResponse:
    """
    GET
    Get all dashboards for user.

    POST
    Create a new dashboard.

    Request parameters:
        identifier: str -- Dashboard identifier
        title: str -- Dashboard title

    Optional request parameters:
        populate_default: bool -- Whether to populate dashboard with default elements, default True
    """
    if request.method == "GET":
        dashboards = DashboardService.get_dashboards_for_user(user)
        return JsonResponse([
            dashboard.serialize()
            for dashboard in dashboards
        ], safe=False)

    elif request.method == "POST":
        identifier = body["identifier"]
        title = body["title"]
        populate_default = body.get("populate_default", True)

        try:
            dashboard = DashboardService.create_dashboard(user, identifier, title, populate_default)
        except IntegrityError:
            return api_error("Dashboard identifier already in use.")
        except DashboardException:
            return api_error("Dashboard identifier cannot be blank.")
        return JsonResponse(dashboard.serialize())
