from django.db import models
from base_app.models import CustomUser
import uuid

class Catagory(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name.title()
    
    
# Create your models here.
class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name.title()


class Post(models.Model):  
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    description = models.CharField(max_length=700, blank=True, null=True)
    image = models.ImageField(upload_to="postImages/", blank=True, null=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="posts")
    created_at = models.DateTimeField(auto_now_add=True)
    commentsOn = models.BooleanField(default=True)
    category = models.CharField(max_length=200)
    tags = models.ManyToManyField(Tag, related_name="posts", blank=True)

    class Meta:
        ordering = ['-created_at']

    # def __str__(self):
    #     return f"{self.caption[:30]}... by {self.user.username}"


class Comment(models.Model):
    content = models.CharField(max_length=1000)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="userComments")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Comment by {self.user.username}"


class PostLike(models.Model):
    liker = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="userLikes")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")
    
    class Meta:
        unique_together = ('liker', 'post')
        constraints = [
            models.UniqueConstraint(fields=['liker', 'post'], name='unique_post_like')
        ]

    def __str__(self):
        return f"{self.liker.username} liked {self.post.user.username}'s post."
    

class CommentLike(models.Model):
    liker = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="userCommentsLikes")
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="likes")

    class Meta:
        unique_together = ('liker', 'comment')
        constraints = [
            models.UniqueConstraint(fields=['liker', 'comment'], name='unique_comment_like')
        ]

    def __str__(self):
        return f"{self.liker.username} liked a comment by {self.comment.user.username}."



class UserFeed(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    tags = models.ManyToManyField(Tag, blank=True)
    savedPosts = models.ManyToManyField(Post, blank=True)

    def __str__(self):
        return f"{self.user.username} Feed"

    