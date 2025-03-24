from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from . import models
from .serializers import CustomUserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.views import APIView
from rest_framework import status
# Create your views here.




class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens["access"]
            refresh_tokens = tokens["refresh"]
            res = Response()
            res.data = {"success": True}


            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite=None,
                path="/"
            )
            res.set_cookie(
                key="refresh_token",
                value=refresh_tokens,
                httponly=True,
                secure=True,
                samesite=None,
                path="/"
            )
            return res
        
        except:
            return Response({"success": False}, status=401)



class CustonRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            request.data["refresh"] = refresh_token

            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens.get("access")
            refresh_token = tokens.get("refresh")

            res = Response()
            res.data = {"refreshed": True}

            # Set new tokens in cookies
            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite=None,
                path="/"
            )
            if refresh_token:
                res.set_cookie(
                    key="refresh_token",
                    value=refresh_token,
                    httponly=True,
                    secure=True,
                    samesite=None,
                    path="/"
                )
            return res
        except:
            return Response({"refreshed": False})


@api_view(["POST"])
def logout(request):
    try:
        res = Response()
        res.data = {"success": True}
        res.delete_cookie("access_token", path="/", samesite="None")
        res.delete_cookie("refresh_token", path="/", samesite="None")
        return res

    except:
        return Response({"success": False})
    



class FollowingDetailCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def getUser(self, username):
        try:
            user = models.CustomUser.objects.get(username=username)
            return user
        except models.CustomUser.DoesNotExist:
            return None


    def get(self, request, username):
        try:
            user = self.getUser(username)

            if user is None:
                return Response({"error": "User not found!"}, status=status.HTTP_404_NOT_FOUND)
            
            is_following = request.user.followings.filter(username=user.username).exists()
            
            return Response({"is_following": is_following}, status=status.HTTP_200_OK)

        except:
            return Response({"error": "Something went wrong!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    def post(self, request, username):
        user = self.getUser(username)
        if user is None:
            return Response({"error": "User not found!"})
        try:
            if request.user.followings.filter(pk=user.pk).exists():
                request.user.followings.remove(user)
                return Response({"status": True, "message": "Unfollowed successfully."}, status=status.HTTP_200_OK)
            else:
                request.user.followings.add(user)
                return Response({"status": True, "message": "Followed successfully."}, status=status.HTTP_200_OK)  

        except Exception as e:
            return Response({"error": "Something went wrong!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  


            
        


             

        




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    user = request.user
    serializer = CustomUserSerializer(user, many=False)
    # print(serializer.data)
    return Response({"authenticated": True, "user": serializer.data}, status=status.HTTP_200_OK)
        

class CustomUserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def getUser(self, pk):
        try:
            print()
            user = models.CustomUser.objects.get(username=pk)
            return user
        
        except models.CustomUser.DoesNotExist:
            return None  
  
    def get(self, request, pk):
        user = self.getUser(pk)

        print(request.user)

        if user is None:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CustomUserSerializer(user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    



        