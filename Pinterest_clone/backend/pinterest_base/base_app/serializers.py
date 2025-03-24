from rest_framework import serializers
from . import models

class CustomUserSerializer(serializers.ModelSerializer):
    followers = serializers.SerializerMethodField()
    followings = serializers.SerializerMethodField()

    class Meta:
        model = models.CustomUser
        fields = ["username", "first_name", "last_name", "email", "bio", "profileImage", "followings", "followers"]

    def get_followers(self, obj):
        return obj.followers.count()

    def get_followings(self, obj):
        return obj.followings.count()
