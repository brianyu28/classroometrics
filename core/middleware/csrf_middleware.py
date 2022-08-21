"""
CSRF middleware for core app.
"""

from django.middleware.csrf import CsrfViewMiddleware

from core.services.authentication_service import (
    AuthenticationException,
    AuthenticationService,
)


class CRMetCsrfViewMiddleware(CsrfViewMiddleware):
    """
    Overrideen CSRF middleware.
    Allows authentication via request headers as alternative to CSRF.
    """

    def process_view(self, request, callback, callback_args, callback_kwargs):
        if AuthenticationService.request_has_authorization_header(request):
            try:
                user = AuthenticationService.authenticate_user_from_request_headers(
                    request
                )
                # Custom property set for indicating the user authenticated from request headers
                request.token_authenticated_user = user
                return self._accept(request)
            except AuthenticationException:
                pass
        return super().process_view(request, callback, callback_args, callback_kwargs)
