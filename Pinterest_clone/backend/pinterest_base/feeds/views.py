from rest_framework.response import Response
from rest_framework.views import APIView
from feeds.models import UserFeed, Post
from feeds.serializers import PostSerializer, CommentSerializer, CatagorySerializer # Ensure your PostSerializer is correctly defined.
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
import json
from .models import Tag, Comment, CommentLike, Catagory
from rest_framework.parsers import MultiPartParser, FormParser




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def posts(request):
    print("Working")
    return Response({"message": "It's fine"})


def get_posts_with_tags(tags):
    # posts_queryset = Post.objects.filter(tags__in=tags).distinct()
    # return [post for post in posts_queryset]
    return Post.objects.filter(tags__in=tags).distinct().order_by('-created_at')


class HomeFeedView(APIView):
    parser_classes = [MultiPartParser, FormParser]


    permission_classes = [IsAuthenticated]
    def get(self, request):
        posts = []
    
        try:
            feed = UserFeed.objects.get(user=request.user)
            tags = feed.tags.all()
            print(tags)
            posts = get_posts_with_tags(tags)

            print(posts)
            
        except UserFeed.DoesNotExist:

            return Response(
                
                {"error": "Feed for this user does not exist"},
                status=404,
            )

        serializer = PostSerializer(posts, many=True)
        print("Here we are")

        return Response(serializer.data, status=200)
    


    def post(self, request, *args, **kwargs):
        # Create a mutable copy of the incoming request data
        data = request.data.dict()  # Convert QueryDict to a mutable dictionary

        # Debug log: Before processing
     

        # Ensure 'tags' field exists
        if "tags" not in data or not data["tags"]:
            return Response({"error": "Tags are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Convert the 'tags' field from JSON string to a Python list
            data["tags"] = json.loads(data["tags"])
        except (json.JSONDecodeError, TypeError) as e:
            print(f"Error decoding tags: {e}")
            return Response(
                {"error": "Invalid tags format"}, status=status.HTTP_400_BAD_REQUEST
            )

    

        # Pass the processed data to the serializer
        serializer = PostSerializer(data=data)
        if serializer.is_valid():
            print("fuu")
            serializer.save(user=request.user)  # Save post associated with the authenticated user
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # If invalid, return errors
        print("hghg")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    
class PostDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def getPost(self, pk):
        try:
            post = Post.objects.get(id=pk)
            return post
            
        except Post.DoesNotExist:
            return None    
        
    def get(self, request, pk):
        post = self.getPost(pk)
        serializer = PostSerializer(post, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)  
    


class CommentListView(APIView):
    permission_classes = [IsAuthenticated]

    def getPost(self, postID):
        try:
            post = Post.objects.get(id=postID)
            return post

        except Comment.DoesNotExist:
            return None
        

    def post(self, request, postID):
        request.data["user"] = request.user
        post = self.getPost(postID)
        request.data["post"] = post
        print(request.data)
        serializer = CommentSerializer(data=request.data)
      
        if serializer.is_valid():
            comment = serializer.save(user=request.user, post=post)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)     
        

    def get(self, request, postID):
        post  = self.getPost(postID)
        comments = Comment.objects.filter(post=post)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

       
class CatagoryListView(APIView):
    def get(self, request):
        catagories = Catagory.objects.all()
        serializer = CatagorySerializer(catagories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        