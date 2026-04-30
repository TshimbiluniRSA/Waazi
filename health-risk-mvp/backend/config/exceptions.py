from rest_framework.views import exception_handler
from rest_framework.response import Response


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        # Ensure every error response has a 'detail' field
        if not isinstance(response.data, dict):
            response.data = {'detail': str(response.data)}
        elif 'detail' not in response.data:
            response.data = {'detail': response.data}
    return response
