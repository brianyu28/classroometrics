import json

from functools import wraps
from django.http import JsonResponse
from typing import Callable, List

from core.models import UserToken
from core.services.authentication_service import AuthenticationException, AuthenticationService


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
        # See if we have a user from the Authorization token during CSRF middleware
        user = getattr(request, "token_authenticated_user", None)
        if user is not None:
            return function(user, request, *args, **kwargs)
        try:
            user = AuthenticationService.authenticate_user_from_request_headers(request)
        except AuthenticationException as e:
            return api_error(str(e))
        return function(user, request, *args, **kwargs)
    return wrap
