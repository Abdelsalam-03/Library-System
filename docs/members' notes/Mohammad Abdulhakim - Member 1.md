## 🏗️ نظام الهوية والبنية التحتية للمشروع (Backend Core)

يا شباب، التأسيس البرمجي للـ Authentication والـ Core Logic خلص 100%. دي الخلاصة عشان تبدأوا تبنوا الـ Business Logic (الكتب، الاستعارة، إلخ) على نظافة.

### 1. تشغيل المشروع (Setup)

اتبع التعليمات في ملف `backend/README.md`

---

### 2. معمارية الردود (Standardized Response)

أنا عملت **Renderer** موحد. يعني أي Response هيرجع للفرونت إند هيكون دايمًا بنفس الهيكل، سواء كان نجاح أو فشل:

| **المفتاح**   | **الوصف**                               |
| ------------- | --------------------------------------- |
| `success`     | قيمة Boolean (True/False).              |
| `status_code` | كود الحالة (200, 201, 400, 500, ...).   |
| `data`        | البيانات المطلوبة (لو مفيش بترجع null). |
| `errors`      | تفاصيل الخطأ (لو مفيش بترجع null).      |

---

### 3. نظام الأدوار والصلاحيات (Roles & Permissions)

عندنا نوعين من المستخدمين في السيستم: `ADMIN` و `USER`.

عشان تحمي أي View عملته وتخلي الأدمن بس هو اللي يشوفه، استخدم الحراس اللي عملتهم في `accounts/permissions.py`:

```Python
from accounts.permissions import IsAdminRole

class BookCreateView(generics.CreateAPIView):
    permission_classes = [IsAdminRole] # كده اليوزر العادي هياخد 403 فوراً
```

---

### 4. الـ APIs الجاهزة للإستخدام (Postman/Frontend)

| **المسار (Endpoint)**        | **الطريقة (Method)** | **الوظيفة**                                             |
| ---------------------------- | -------------------- | ------------------------------------------------------- |
| `/api/auth/register/`        | `POST`               | إنشاء حساب جديد (باصي username, email, password, role). |
| `/api/auth/login/`           | `POST`               | تسجيل دخول (بتاخد access و refresh tokens).             |
| `/api/auth/logout/`          | `POST`               | تسجيل خروج (بتحتاج تبعت الـ refresh token).             |
| `/api/auth/me/`              | `GET/PATCH`          | عرض أو تعديل بيانات البروفايل الحالي.                   |
| `/api/auth/change-password/` | `POST`               | تغيير الباسورد (بتحتاج old_password و new_password).    |

---

### 5. الربط مع الفرونت إند (Vanilla JS)

عشان مش كل مرة نهاندل الـ Tokens والـ Refresh، أنا عملت دالة اسمها `customFetch` في ملف `api.js`.

**استعملوها بدل `fetch` العادية في أي حاجة محتاجة authorization:**

```JavaScript
// مثال: جلب الكتب
const res = await customFetch('/api/books/');
const result = await res.json();
if (result.success) {
    console.log(result.data); // البيانات هنا دايمًا
}
```

**الميزة:** الدالة دي بتجدد الـ Token لوحده في الخلفية لو خلص، ولو اليوزر مش مسجل دخول هتحوله لصفحة الـ Login أوتوماتيك.

---

### 💡 ملاحظات تقنية:

- **Validation:** أي خطأ هتعمله في السيريلايزر، الـ `StandardizedJSONRenderer` هيلقطه ويغلفه ويرجعه للفرونت إند بشكل شيك.
    
- **Security:** الباسوردات متشفرة بـ PBKDF2، ومستحيل حد يدخل على الـ API من غير `Bearer Token`.
    

بالتوفيق يا رجالة
