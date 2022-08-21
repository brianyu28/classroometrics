"""
Application top-level views.
"""

from django.http.request import HttpRequest
from django.shortcuts import redirect

from core.services.authentication_service import AuthenticationService


def logout(request: HttpRequest):
    """
    Logout user and redirect to root.
    """
    AuthenticationService.remove_user_from_session(request)
    return redirect("/")
