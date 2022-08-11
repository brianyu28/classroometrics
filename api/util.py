import json

from functools import wraps
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from typing import Callable, List

from core.models import UserToken


def api_error(message: str, status: int = 400) -> JsonResponse:
    """
    Return an API error to the client.

    Arguments:
        message: str -- The error message

    Optional arguments:
        status: int -- Error status, default 400

    Returns:
        JsonResponse -- Response with error message
    """
    return JsonResponse({"error": message}, status=status)


def parse_json(methods: List[str] = ["POST", "PUT"]) -> Callable:
    """
    Parse JSON payload from request body.

    Arguments:
        methods: str -- Request methods for which to parse JSON

    Returns:
        Callable -- Decorator for view function
    """
    def wrapper(function):
        @wraps(function)
        def wrap(request, *args, **kwargs):
            if request.method in methods:
                try:
                    body = json.loads(request.body)
                except json.decoder.JSONDecodeError:
                    return api_error("Invalid JSON body.")
                return function(request, body, *args, **kwargs)
            else:
                return function(request, None, *args, **kwargs)
        return wrap
    return wrapper


def require_fields(fields: List[str], method: str = "POST") -> Callable:
    """
    Check for required API fields before running view function.

    Arguments:
        fields: List[str] -- Required fields
        method: str -- Request method for which to require fields

    Returns:
        Callable -- Decorator for view function
    """
    def wrapper(function):
        @wraps(function)
        def wrap(request, body, *args, **kwargs):
            if request.method == method:
                for field in fields:
                    if field not in body:
                        return api_error(f"Missing required field: {field}")
            return function(request, body, *args, **kwargs)
        return wrap
    return wrapper


def require_authentication(function: Callable) -> Callable:
    """
    Decorator to require token authentication for a view.

    Arguments:
        function: Callable -- View function

    Returns:
        Callable -- Wrapped view function
    """
    @wraps(function)
    def wrap(request, *args, **kwargs):

        # Allow Django signed-in user.
        if not request.user.is_anonymous:
            return function(request.user, request, *args, **kwargs)

        # Otherwise, check for Authentication header.
        auth_header = request.headers.get("Authorization")
        if auth_header is None:
            return api_error("Authentication required.")
        parts = auth_header.strip().split(" ")
        if len(parts) != 2 or parts[0] != "token":
            return api_error("Invalid format for authentication header.")
        token = parts[1]
        user = UserToken.get_user_from_token(token)
        if user is None:
            return api_error("Invalid credentials.", 403)
        return csrf_exempt(function(user, request, *args, **kwargs))
    return wrap
