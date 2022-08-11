from django.http import JsonResponse
from django.http.request import HttpRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from core.services.authentication_service import AuthenticationService
from core.services.user_token_service import UserTokenService

from api.util import parse_json, require_fields

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
    """
    username = body["username"]
    password = body["password"]
    user = AuthenticationService.authenticate_user(username, password)
    if user is None:
        return JsonResponse({
            "authenticated": False
        })
    token = UserTokenService.get_or_create_user_token(user)
    return JsonResponse({
        "authenticated": True,
        "user": user.serialize(),
        "token": token.token
    })
