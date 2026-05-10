from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response


class StandardizedJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):

        if data is None:
            data = {}

        response = renderer_context.get("response")
        status_code = response.status_code

        is_success = status_code >= 200 and status_code < 300

        standardized_response = {
            "success": is_success,
            "data": data if is_success else None,
            "errors": data if not is_success else None,
            "status_code": status_code

        }

        return super().render(standardized_response, accepted_media_type, renderer_context)