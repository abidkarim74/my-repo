from rest_framework import serializers
from .models import Post, Comment, PostLike, CommentLike, Tag, Catagory
from base_app.serializers import CustomUserSerializer

from rest_framework import serializers
from .models import Post, Comment, PostLike, CommentLike, Tag
from base_app.serializers import CustomUserSerializer



class CatagorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Catagory
        fields = ["id", "name"]

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["name", "id"]


class PostSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)  # Ensure user is read-only
    tags = serializers.ListField(child=serializers.CharField(), write_only=True)
    total_likes = serializers.IntegerField(source="likes.count", read_only=True)
    total_comments = serializers.IntegerField(source="comments.count", read_only=True)
    comments = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = [
            "id", "description", "image", "tags", "user", "created_at", "commentsOn",
            "category", "total_comments", "total_likes", "comments"
        ]

    def create(self, validated_data):
        tags_data = validated_data.pop('tags')  # Extract tags from incoming data.
        post = Post.objects.create(**validated_data)

        # Process tags: Create or fetch existing.
        for tag_name in tags_data:
            tag, _ = Tag.objects.get_or_create(name=tag_name.lower().capitalize())  # Normalize.
            post.tags.add(tag)

        return post

    # def update(self, instance, validated_data):
    #     tags_data = validated_data.pop("tags", None)

    #     for attr, value in validated_data.items():
    #         setattr(instance, attr, value)

    #     if tags_data is not None:
    #         tag_instances = []
    #         for tag_name in tags_data:
    #             tag_obj, _ = Tag.objects.get_or_create(name=tag_name)
    #             tag_instances.append(tag_obj)

    #         instance.tags.set(tag_instances)

    #     instance.save()
    #     return instance

    def get_comments(self, obj):
        comments = obj.comments.all() 
        return CommentSerializer(comments, many=True).data


class CommentSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True) 
    # post = PostSerializer(read_only=True) 

    class Meta:
        model = Comment
        fields = ['id', 'content', 'user', 'created_at']
        ordering = ["-created_at"]


class PostLikeSerializer(serializers.ModelSerializer):
    liker = CustomUserSerializer(read_only=True) 
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())  

    class Meta:
        model = PostLike
        fields = ['id', 'liker', 'post']


class CommentLikeSerializer(serializers.ModelSerializer):
    liker = CustomUserSerializer(read_only=True)  
    comment = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all())  

    class Meta:
        model = CommentLike
        fields = ['id', 'liker', 'comment']

