from django.http import JsonResponse
from django.http.request import HttpRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from core.models import User
from core.services.authentication_service import AuthenticationService
from core.services.user_token_service import UserTokenService

from api.util import parse_json, require_authentication, require_fields

@csrf_exempt
@require_http_methods(["POST"])
@parse_json()
@require_fields(["username", "password"])
def login(request: HttpRequest, body: dict) -> JsonResponse:
    """
    Accept user credentials and return a user token.

    Request parameters:
        username (str): Username
        password (str): Password

    Optional request parameters:
        create_session (bool): Whether to save user session, default False
    """
    username = body["username"]
    password = body["password"]
    should_create_session = body.get("create_session", False)

    user = AuthenticationService.authenticate_user(username, password)
    if user is None:
        return JsonResponse(AuthenticationService.get_guest_auth_data())

    if should_create_session:
        AuthenticationService.attach_authenticated_user_to_session(request, user)
    return JsonResponse(AuthenticationService.get_user_auth_data(user))


@require_http_methods(["GET"])
def me(request: HttpRequest) -> JsonResponse:
    """
    Get information about currently signed in user.
    """
    user = AuthenticationService.get_user_for_current_session(request)
    if user is None:
        return JsonResponse(AuthenticationService.get_guest_auth_data())
    return JsonResponse(AuthenticationService.get_user_auth_data(user))


@require_http_methods(["POST"])
@require_authentication
def logout(user: User, request: HttpRequest) -> JsonResponse:
    AuthenticationService.remove_user_from_session(request)
    return JsonResponse(AuthenticationService.get_guest_auth_data())
