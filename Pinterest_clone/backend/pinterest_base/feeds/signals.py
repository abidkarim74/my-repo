from django.db.models.signals import post_save
from django.dispatch import receiver
from base_app.models import CustomUser  # Adjust the import path as needed
from .models import UserFeed

@receiver(post_save, sender=CustomUser)
def create_user_feed(sender, instance, created, **kwargs):
    if created:
        UserFeed.objects.create(user=instance)
