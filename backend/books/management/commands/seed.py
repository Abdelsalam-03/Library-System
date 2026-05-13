"""
Seed command: python manage.py seed
Options:
  --clear   Wipe all seeded data before re-seeding
"""

from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from books.models import Book, Genre

User = get_user_model()

# ---------------------------------------------------------------------------
# Seed data
# ---------------------------------------------------------------------------

GENRES = [
    "Fiction",
    "Non-Fiction",
    "Science & Technology",
    "History",
    "Biography",
    "Mystery & Thriller",
    "Fantasy",
    "Self-Help",
    "Philosophy",
    "Romance",
]

BOOKS = [
    # Fiction
    {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "isbn": "978-0-7432-7356-5",
        "year": 1925,
        "copies": 5,
        "available": 3,
        "price": 12.99,
        "genre": "Fiction",
        "description": "A story of wealth, love, and the American Dream set in the Jazz Age.",
    },
    {
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "isbn": "978-0-06-112008-4",
        "year": 1960,
        "copies": 4,
        "available": 4,
        "price": 14.99,
        "genre": "Fiction",
        "description": "A gripping tale of racial injustice and loss of innocence in the American South.",
    },
    {
        "title": "1984",
        "author": "George Orwell",
        "isbn": "978-0-452-28423-4",
        "year": 1949,
        "copies": 6,
        "available": 2,
        "price": 11.99,
        "genre": "Fiction",
        "description": "A dystopian novel about totalitarianism, surveillance, and the loss of individual freedom.",
    },
    # Non-Fiction
    {
        "title": "Sapiens: A Brief History of Humankind",
        "author": "Yuval Noah Harari",
        "isbn": "978-0-06-231609-7",
        "year": 2011,
        "copies": 5,
        "available": 5,
        "price": 18.99,
        "genre": "Non-Fiction",
        "description": "An exploration of the history and impact of Homo sapiens on the world.",
    },
    {
        "title": "Educated",
        "author": "Tara Westover",
        "isbn": "978-0-399-59050-4",
        "year": 2018,
        "copies": 3,
        "available": 1,
        "price": 16.99,
        "genre": "Non-Fiction",
        "description": "A memoir about a woman who grows up in a survivalist family and pursues education.",
    },
    # Science & Technology
    {
        "title": "A Brief History of Time",
        "author": "Stephen Hawking",
        "isbn": "978-0-553-38016-3",
        "year": 1988,
        "copies": 4,
        "available": 4,
        "price": 15.99,
        "genre": "Science & Technology",
        "description": "An accessible exploration of cosmology, space, time, and the universe.",
    },
    {
        "title": "The Pragmatic Programmer",
        "author": "Andrew Hunt & David Thomas",
        "isbn": "978-0-13-595705-9",
        "year": 1999,
        "copies": 3,
        "available": 3,
        "price": 49.99,
        "genre": "Science & Technology",
        "description": "Timeless advice for software developers on crafting better code and careers.",
    },
    {
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "isbn": "978-0-13-235088-4",
        "year": 2008,
        "copies": 4,
        "available": 2,
        "price": 44.99,
        "genre": "Science & Technology",
        "description": "A handbook of agile software craftsmanship for writing readable, maintainable code.",
    },
    # History
    {
        "title": "The Art of War",
        "author": "Sun Tzu",
        "isbn": "978-1-59030-225-6",
        "year": -500,
        "copies": 5,
        "available": 5,
        "price": 9.99,
        "genre": "History",
        "description": "An ancient Chinese military treatise on strategy, tactics, and philosophy.",
    },
    {
        "title": "Guns, Germs, and Steel",
        "author": "Jared Diamond",
        "isbn": "978-0-393-31755-8",
        "year": 1997,
        "copies": 3,
        "available": 3,
        "price": 17.99,
        "genre": "History",
        "description": "Why some civilizations came to dominate others — a geography-based analysis.",
    },
    # Biography
    {
        "title": "Steve Jobs",
        "author": "Walter Isaacson",
        "isbn": "978-1-4516-4853-9",
        "year": 2011,
        "copies": 4,
        "available": 3,
        "price": 19.99,
        "genre": "Biography",
        "description": "An intimate biography of Apple's co-founder based on exclusive interviews.",
    },
    {
        "title": "Long Walk to Freedom",
        "author": "Nelson Mandela",
        "isbn": "978-0-316-54818-4",
        "year": 1994,
        "copies": 2,
        "available": 2,
        "price": 18.50,
        "genre": "Biography",
        "description": "The autobiography of Nelson Mandela, tracing his path from boyhood to presidency.",
    },
    # Mystery & Thriller
    {
        "title": "The Girl with the Dragon Tattoo",
        "author": "Stieg Larsson",
        "isbn": "978-0-307-47347-9",
        "year": 2005,
        "copies": 4,
        "available": 1,
        "price": 15.99,
        "genre": "Mystery & Thriller",
        "description": "A journalist and a hacker investigate a decades-old disappearance in Sweden.",
    },
    {
        "title": "Gone Girl",
        "author": "Gillian Flynn",
        "isbn": "978-0-307-58836-4",
        "year": 2012,
        "copies": 3,
        "available": 3,
        "price": 14.99,
        "genre": "Mystery & Thriller",
        "description": "A psychological thriller about a marriage gone terrifyingly wrong.",
    },
    # Fantasy
    {
        "title": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "isbn": "978-0-618-00221-4",
        "year": 1937,
        "copies": 6,
        "available": 4,
        "price": 13.99,
        "genre": "Fantasy",
        "description": "A hobbit embarks on an unexpected journey with dwarves to reclaim a dragon-guarded treasure.",
    },
    {
        "title": "Harry Potter and the Philosopher's Stone",
        "author": "J.K. Rowling",
        "isbn": "978-0-439-70818-8",
        "year": 1997,
        "copies": 8,
        "available": 5,
        "price": 12.99,
        "genre": "Fantasy",
        "description": "A young boy discovers he is a wizard and begins his education at Hogwarts School.",
    },
    # Self-Help
    {
        "title": "Atomic Habits",
        "author": "James Clear",
        "isbn": "978-0-735-21129-2",
        "year": 2018,
        "copies": 5,
        "available": 5,
        "price": 16.99,
        "genre": "Self-Help",
        "description": "A practical guide to building good habits and breaking bad ones.",
    },
    {
        "title": "The 7 Habits of Highly Effective People",
        "author": "Stephen R. Covey",
        "isbn": "978-1-982-13701-8",
        "year": 1989,
        "copies": 4,
        "available": 4,
        "price": 17.99,
        "genre": "Self-Help",
        "description": "Timeless principles for personal and professional effectiveness.",
    },
    # Philosophy
    {
        "title": "Meditations",
        "author": "Marcus Aurelius",
        "isbn": "978-0-14-044140-6",
        "year": 180,
        "copies": 4,
        "available": 4,
        "price": 10.99,
        "genre": "Philosophy",
        "description": "Personal writings of the Roman Emperor reflecting Stoic philosophy.",
    },
    {
        "title": "Thus Spoke Zarathustra",
        "author": "Friedrich Nietzsche",
        "isbn": "978-0-14-044118-5",
        "year": 1883,
        "copies": 2,
        "available": 2,
        "price": 11.99,
        "genre": "Philosophy",
        "description": "Nietzsche's philosophical novel about the prophet Zarathustra and his teachings.",
    },
    # Romance
    {
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "isbn": "978-0-14-143951-8",
        "year": 1813,
        "copies": 5,
        "available": 5,
        "price": 10.99,
        "genre": "Romance",
        "description": "A timeless tale of love, manners, and marriage in 19th-century England.",
    },
    {
        "title": "The Notebook",
        "author": "Nicholas Sparks",
        "isbn": "978-0-446-52805-6",
        "year": 1996,
        "copies": 3,
        "available": 3,
        "price": 13.99,
        "genre": "Romance",
        "description": "A timeless story of a love so true it could outlast war and illness.",
    },
]

USERS = [
    {
        "username": "admin",
        "email": "admin@library.com",
        "password": "Admin@1234",
        "first_name": "Admin",
        "last_name": "User",
        "role": "ADMIN",
        "is_staff": True,
        "is_superuser": True,
    },
    {
        "username": "librarian",
        "email": "librarian@library.com",
        "password": "Librarian@1234",
        "first_name": "Sara",
        "last_name": "Ali",
        "role": "ADMIN",
        "is_staff": True,
        "is_superuser": False,
    },
    {
        "username": "john_doe",
        "email": "john.doe@example.com",
        "password": "User@1234",
        "first_name": "John",
        "last_name": "Doe",
        "role": "USER",
        "is_staff": False,
        "is_superuser": False,
    },
    {
        "username": "jane_smith",
        "email": "jane.smith@example.com",
        "password": "User@1234",
        "first_name": "Jane",
        "last_name": "Smith",
        "role": "USER",
        "is_staff": False,
        "is_superuser": False,
    },
    {
        "username": "ahmed_hassan",
        "email": "ahmed.hassan@example.com",
        "password": "User@1234",
        "first_name": "Ahmed",
        "last_name": "Hassan",
        "role": "USER",
        "is_staff": False,
        "is_superuser": False,
    },
    {
        "username": "nour_omar",
        "email": "nour.omar@example.com",
        "password": "User@1234",
        "first_name": "Nour",
        "last_name": "Omar",
        "role": "USER",
        "is_staff": False,
        "is_superuser": False,
    },
]

# BorrowRecord seeds — (username, book_isbn, status, days_ago_requested, days_borrowed)
# days_borrowed is only meaningful for approved/overdue/returned
BORROW_RECORDS = [
    # Approved (active borrows)
    ("john_doe",    "978-0-7432-7356-5",  "approved",  5,  None),
    ("jane_smith",  "978-0-452-28423-4",  "approved",  3,  None),
    ("ahmed_hassan","978-0-13-235088-4",  "approved",  7,  None),
    # Pending
    ("nour_omar",   "978-0-06-112008-4",  "pending",   1,  None),
    ("john_doe",    "978-0-618-00221-4",  "pending",   2,  None),
    # Returned
    ("jane_smith",  "978-0-735-21129-2",  "returned",  20, 14),
    ("ahmed_hassan","978-0-553-38016-3",  "returned",  30, 14),
    ("nour_omar",   "978-0-06-231609-7",  "returned",  15, 10),
    # Rejected
    ("john_doe",    "978-0-399-59050-4",  "rejected",  10, None),
    # Overdue
    ("nour_omar",   "978-0-439-70818-8",  "overdue",   25, None),
]


class Command(BaseCommand):
    help = "Seed the database with sample genres, books, users, and borrow records."

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing seeded data before seeding.",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self._clear_data()

        self._seed_genres()
        self._seed_books()
        self._seed_users()
        self._seed_borrow_records()

        self.stdout.write(self.style.SUCCESS("\n✅  Database seeded successfully!\n"))
        self._print_summary()

    # ------------------------------------------------------------------
    # Clear
    # ------------------------------------------------------------------

    def _clear_data(self):
        self.stdout.write(self.style.WARNING("🗑️  Clearing existing data..."))
        try:
            from borrowing.models import BorrowRecord
            BorrowRecord.objects.all().delete()
        except Exception:
            pass  # borrowing may not be migrated yet
        Book.objects.all().delete()
        Genre.objects.all().delete()
        User.objects.filter(username__in=[u["username"] for u in USERS]).delete()
        self.stdout.write("   Done.\n")

    # ------------------------------------------------------------------
    # Genres
    # ------------------------------------------------------------------

    def _seed_genres(self):
        self.stdout.write("📚  Seeding genres...")
        created = 0
        for name in GENRES:
            _, was_created = Genre.objects.get_or_create(name=name)
            if was_created:
                created += 1
        self.stdout.write(f"   {created} genre(s) created, {len(GENRES) - created} already existed.")

    # ------------------------------------------------------------------
    # Books
    # ------------------------------------------------------------------

    def _seed_books(self):
        self.stdout.write("📖  Seeding books...")
        created = 0
        for data in BOOKS:
            genre = Genre.objects.get(name=data["genre"])
            _, was_created = Book.objects.get_or_create(
                isbn=data["isbn"],
                defaults={
                    "title":       data["title"],
                    "author":      data["author"],
                    "year":        data["year"],
                    "copies":      data["copies"],
                    "available":   data["available"],
                    "price":       data["price"],
                    "description": data["description"],
                    "genre":       genre,
                },
            )
            if was_created:
                created += 1
        self.stdout.write(f"   {created} book(s) created, {len(BOOKS) - created} already existed.")

    # ------------------------------------------------------------------
    # Users
    # ------------------------------------------------------------------

    def _seed_users(self):
        self.stdout.write("👤  Seeding users...")
        created = 0
        for data in USERS:
            if User.objects.filter(username=data["username"]).exists():
                continue
            user = User(
                username=data["username"],
                email=data["email"],
                first_name=data["first_name"],
                last_name=data["last_name"],
                role=data["role"],
                is_staff=data["is_staff"],
                is_superuser=data["is_superuser"],
            )
            user.set_password(data["password"])
            user.save()
            created += 1
        self.stdout.write(f"   {created} user(s) created, {len(USERS) - created} already existed.")

    # ------------------------------------------------------------------
    # Borrow Records
    # ------------------------------------------------------------------

    def _seed_borrow_records(self):
        # Borrowing app may not be installed — import lazily
        try:
            from borrowing.models import BorrowRecord
        except ImportError:
            self.stdout.write(
                self.style.WARNING(
                    "⚠️   borrowing app not found / not migrated — skipping borrow records."
                )
            )
            return

        self.stdout.write("📋  Seeding borrow records...")
        now = timezone.now()
        created = 0

        for username, isbn, status, days_ago, days_borrowed in BORROW_RECORDS:
            try:
                user = User.objects.get(username=username)
                book = Book.objects.get(isbn=isbn)
            except (User.DoesNotExist, Book.DoesNotExist):
                self.stdout.write(
                    self.style.WARNING(f"   Skipping record for {username} / {isbn} — not found.")
                )
                continue

            requested_at = now - timedelta(days=days_ago)

            record_kwargs = {
                "user":         user,
                "book_id":      book.pk,
                "status":       status,
                "requested_at": requested_at,
                "created_at":   requested_at,
            }

            if status in ("approved", "overdue"):
                approved_at = requested_at + timedelta(days=1)
                record_kwargs["approved_at"] = approved_at
                record_kwargs["borrowed_at"] = approved_at
                if status == "approved":
                    record_kwargs["due_date"] = approved_at + timedelta(days=14)
                else:  # overdue
                    record_kwargs["due_date"] = approved_at + timedelta(days=7)  # already past

            elif status == "returned":
                approved_at = requested_at + timedelta(days=1)
                returned_at = approved_at + timedelta(days=days_borrowed or 14)
                record_kwargs["approved_at"] = approved_at
                record_kwargs["borrowed_at"] = approved_at
                record_kwargs["due_date"]    = approved_at + timedelta(days=14)
                record_kwargs["returned_at"] = returned_at

            elif status == "rejected":
                record_kwargs["rejected_at"]      = requested_at + timedelta(days=1)
                record_kwargs["rejection_reason"] = "Book currently unavailable."

            # Avoid duplicate records for same user + book + status
            if not BorrowRecord.objects.filter(
                user=user, book_id=book.pk, status=status
            ).exists():
                BorrowRecord.objects.create(**record_kwargs)
                created += 1

        self.stdout.write(f"   {created} borrow record(s) created.")

    # ------------------------------------------------------------------
    # Summary table
    # ------------------------------------------------------------------

    def _print_summary(self):
        try:
            from borrowing.models import BorrowRecord
            borrow_count = BorrowRecord.objects.count()
        except Exception:
            borrow_count = "N/A"

        self.stdout.write("=" * 45)
        self.stdout.write(f"  Genres          : {Genre.objects.count()}")
        self.stdout.write(f"  Books           : {Book.objects.count()}")
        self.stdout.write(f"  Users           : {User.objects.count()}")
        self.stdout.write(f"  Borrow Records  : {borrow_count}")
        self.stdout.write("=" * 45)
        self.stdout.write("")
        self.stdout.write("  Default credentials:")
        self.stdout.write("  ┌─────────────┬──────────────┬───────────────────┐")
        self.stdout.write("  │ Username    │ Password     │ Role              │")
        self.stdout.write("  ├─────────────┼──────────────┼───────────────────┤")
        self.stdout.write("  │ admin       │ Admin@1234   │ Superuser / Admin │")
        self.stdout.write("  │ librarian   │ Librarian@1234│ Staff / Admin    │")
        self.stdout.write("  │ john_doe    │ User@1234    │ User              │")
        self.stdout.write("  │ jane_smith  │ User@1234    │ User              │")
        self.stdout.write("  │ ahmed_hassan│ User@1234    │ User              │")
        self.stdout.write("  │ nour_omar   │ User@1234    │ User              │")
        self.stdout.write("  └─────────────┴──────────────┴───────────────────┘")
        self.stdout.write("")
