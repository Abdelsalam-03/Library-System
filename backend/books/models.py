from django.db import models

class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Book(models.Model):
    genre = models.ForeignKey(
        Genre,
        on_delete=models.CASCADE,
        related_name='books'
    )

    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    isbn = models.CharField(max_length=100, unique=True)
    year = models.IntegerField()
    copies = models.IntegerField(default=1)
    available = models.IntegerField(default=1)
    price = models.FloatField()
    description = models.CharField(max_length=512, null=True)
    # cover_image = models.ImageField(upload_to='book_covers/', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title