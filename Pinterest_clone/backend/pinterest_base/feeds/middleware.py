from urllib.parse import parse_qs
from channels.auth import AuthMiddlewareStack
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
rest_framework_simplejwt.authentication.JWTAuthentication
from django.contrib.auth import get_user_model
import asyncio

User = get_user_model()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token", [None])[0]

        scope["user"] = await self.get_user(token)
        return await super().__call__(scope, receive, send)

    @staticmethod
    @database_sync_to_async
    def get_user(token):
        try:
            access_token = AccessToken(token)
            return User.objects.get(id=access_token["user_id"])
        except:
            return AnonymousUser()

def JWTAuthMiddlewareStack(inner):
    return JWTAuthMiddleware(AuthMiddlewareStack(inner))
