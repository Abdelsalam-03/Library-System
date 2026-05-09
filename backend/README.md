# Library System Backend API

## خطوات التشغيل للتيم (Local Setup)

### 1. تجهيز بيئة العمل (Virtual Environment)
افتح التيرمنال في مجلد المشروع ونفذ الأمر ده لإنشاء البيئة الوهمية:
```bash
python -m venv venv
```

**تفعيل البيئة:**

- **لو بتستخدم ويندوز:** `venv\Scripts\activate`
    
- **لو بتستخدم لينكس/ماك:** `source venv/bin/activate`
    

### 2. تسطيب المكتبات

اتأكد إنك مفعل الـ venv، وبعدها نفذ:

```Bash
pip install -r requirements.txt
```

### 3. إعداد متغيرات البيئة (.env)

اعمل ملف جديد في المسار الرئيسي للمشروع (نفس مكان `manage.py`) وسميه `.env` وانسخ جواه السطور دي (حط رابط الـ Cloud Database اللي الـ Admin بعتهولك):

```Code snippet
DATABASE_URL=postgresql://user:password@host:port/dbname
SECRET_KEY=django-insecure-your-secret-key-here
DEBUG=True
```

### 4. تجهيز الداتا بيز وتشغيل السيرفر

عشان تتأكد إن الداتا بيز مربوطة صح وتجيب أحدث التعديلات:

```Bash
python manage.py migrate
```

لتشغيل السيرفر محلياً:

```Bash
python manage.py runserver
```

الـ API هيكون متاح على: `http://127.0.0.1:8000/`