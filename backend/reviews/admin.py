from django.contrib import admin
from django import forms
from .models import Review
from django.contrib.auth import get_user_model

User = get_user_model()


class ReviewAdminForm(forms.ModelForm):
    username = forms.CharField()
    rating = forms.IntegerField(min_value=1, max_value=5)

    class Meta:
        model = Review
        fields = ["username", "book_id", "rating", "comment"]

    def clean_username(self):
        username = self.cleaned_data.get("username")
        try:
            user = User.objects.get(username=username)
            return user
        except User.DoesNotExist:
            raise forms.ValidationError(f"User '{username}' does not exist.")

    def save(self, commit=True):
        instance = super().save(commit=False)
        instance.user = self.cleaned_data["username"]  # user object
        if commit:
            instance.save()
        return instance


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    form = ReviewAdminForm