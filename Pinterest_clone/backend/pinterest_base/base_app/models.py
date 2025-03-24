from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    email = models.EmailField(primary_key=True, unique=True)
    profileImage = models.ImageField(upload_to="profilePics/", null=True, blank=True)
    bio = models.CharField(max_length=600, blank=True)
    followers = models.ManyToManyField("self", symmetrical=False, related_name="followings", blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if not self.pk or "password" in self.get_dirty_fields():
            self.set_password(self.password)
        super().save(*args, **kwargs)


    def get_dirty_fields(self):
        if not self.pk: 
            return {}
        try:
            current_data = self.__class__.objects.get(pk=self.pk)
        except self.DoesNotExist:
            return {field.name: getattr(self, field.name) for field in self._meta.fields}
        dirty_fields = {}

        for field in self._meta.fields:
            field_name = field.name
            current_value = getattr(self, field_name)
            previous_value = getattr(current_data, field_name)
            if current_value != previous_value:
                dirty_fields[field_name] = current_value
        return dirty_fields
