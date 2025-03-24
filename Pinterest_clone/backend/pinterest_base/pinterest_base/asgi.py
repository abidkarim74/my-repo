import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from feeds.routing import websocket_urlpatterns  # Replace with your actual app name
from feeds.middleware import JWTAuthMiddlewareStack  # Import middleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pinterest_base.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})
