from typing import List
from core.models import Dashboard, User
from core.services.element_service import ElementService

class DashboardException(Exception):
    pass

class DashboardService:

    @staticmethod
    def create_dashboard(owner: User, identifier: str, title: str = "", populate_default: bool = True) -> Dashboard:
        """
        Create a new dashboard for a user.

        Arguments:
            owner: User -- User to own the dashboard
            identifier: str -- Unique identifier for the dashboard

        Optional Arguments:
            title: str -- Title for the dashboard, default ""
            populate_default: bool -- Whether to populate dashboard with default elements

        Returns:
            Dashboard: Newly created dashboard

        Raises:
            DashboardException: If identifier is blank
            django.db.utils.IntegrityError: If identifier is already in use
        """
        if identifier == "":
            raise DashboardException("Identifier must not be blank.")

        dashboard = Dashboard(
            owner=owner,
            identifier=identifier,
            title=title
        )
        dashboard.save()

        if populate_default:
            ElementService.reset_elements_to_default(dashboard)
        return dashboard


    @staticmethod
    def get_dashboards_for_user(user: User) -> List[Dashboard]:
        """
        Return a list of all dashboards for a user.

        Arguments:
            user: User -- The user to get dashboards for

        Returns:
            List[Dashboard] -- List of all dashboards owned by the user
        """
        return user.dashboards.all()
