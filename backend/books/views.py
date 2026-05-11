from django.http import JsonResponse

def get_books(request):
    data = [
        {"id": 1, "title": "Atomic Habits"},
        {"id": 2, "title": "Clean Code"}
    ]
    return JsonResponse(data, safe=False)
