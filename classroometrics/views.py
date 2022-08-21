from django.shortcuts import redirect

from core.services.authentication_service import AuthenticationService


def logout(request):
    AuthenticationService.remove_user_from_session(request)
    return redirect("/")
