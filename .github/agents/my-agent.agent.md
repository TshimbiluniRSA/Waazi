---
# Fill in the fields below to create a basic custom agent for your repository.
# The Copilot CLI can be used for local testing: https://gh.io/customagents/cli
# To make this agent available, merge this file into the default repository branch.
# For format details, see: https://gh.io/customagents/config

name:
description:
---

# My Agent

# 🏥 AI Health Risk Assessment — MVP 1 Build Plan
> Stack: Django 5 + DRF + PostgreSQL | React + Vite + TypeScript + Tailwind CSS | Claude claude-sonnet-4-6 API | WeasyPrint PDF

---

## 📋 AGENT INSTRUCTIONS

Work through each phase in order. Complete all tasks in a phase before moving to the next.
Use the file structure exactly as defined. Do not skip steps.

---

## 🗂️ PROJECT STRUCTURE

```
health-risk-mvp/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── users/
│   │   ├── models.py          # Custom User model
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── assessments/
│   │   ├── models.py          # Assessment + Result models
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── scoring.py         # Rule-based scoring engine
│   │   └── admin.py
│   ├── reports/
│   │   ├── views.py           # PDF generation endpoint
│   │   ├── templates/
│   │   │   └── report.html    # WeasyPrint HTML template
│   │   └── utils.py
│   └── ai/
│       ├── client.py          # Anthropic SDK wrapper
│       └── prompts.py         # Prompt templates
├── frontend/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── api/
│       │   ├── client.ts      # Axios instance
│       │   ├── auth.ts
│       │   └── assessment.ts
│       ├── types/
│       │   └── index.ts       # Shared TS types
│       ├── store/
│       │   └── useAssessmentStore.ts  # Zustand store
│       ├── pages/
│       │   ├── Landing.tsx
│       │   ├── Auth.tsx
│       │   ├── Consent.tsx
│       │   ├── Questionnaire.tsx
│       │   └── Results.tsx
│       └── components/
│           ├── StepIndicator.tsx
│           ├── QuestionCard.tsx
│           ├── RiskBadge.tsx
│           └── ReportActions.tsx
└── docker-compose.yml
```

---

## ⚙️ PHASE 1 — Project Bootstrap

### 1.1 Backend Setup

```bash
# Create project root
mkdir health-risk-mvp && cd health-risk-mvp

# Backend virtualenv
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt \
  django-cors-headers python-dotenv anthropic weasyprint \
  Pillow psycopg2-binary drf-spectacular
```

**`backend/requirements.txt`**
```
django==5.0.6
djangorestframework==3.15.2
djangorestframework-simplejwt==5.3.1
django-cors-headers==4.4.0
python-dotenv==1.0.1
anthropic==0.30.0
weasyprint==62.3
Pillow==10.4.0
psycopg2-binary==2.9.9
drf-spectacular==0.27.2
```

**`backend/.env.example`**
```
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://postgres:password@localhost:5432/healthrisk
ANTHROPIC_API_KEY=your-anthropic-api-key
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### 1.2 Django Settings (`config/settings.py`)

Configure the following exactly:

```python
from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.getenv('SECRET_KEY')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'drf_spectacular',
    'users',
    'assessments',
    'reports',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    # ... rest of default middleware
]

AUTH_USER_MODEL = 'users.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'healthrisk',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [BASE_DIR / 'reports' / 'templates'],
    'APP_DIRS': True,
    'OPTIONS': {'context_processors': ['django.template.context_processors.request', ...]},
}]
```

### 1.3 Frontend Setup

```bash
cd health-risk-mvp
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install axios zustand react-router-dom
```

**`frontend/tailwind.config.ts`**
```ts
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0F766E',   // teal-700
        danger: '#DC2626',
        warning: '#D97706',
        success: '#16A34A',
      }
    }
  },
  plugins: [],
}
```

**`frontend/vite.config.ts`**
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
})
```

---

## 🗃️ PHASE 2 — Backend Models & Database

### 2.1 Custom User Model (`users/models.py`)

```python
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
import uuid

class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra):
        if not email:
            raise ValueError('Email required')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password):
        user = self.create_user(email, name, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True)
    is_guest = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    objects = UserManager()

    def __str__(self):
        return self.email
```

### 2.2 Assessment Model (`assessments/models.py`)

```python
from django.db import models
from django.conf import settings
import uuid

class Assessment(models.Model):
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female'), ('O', 'Other')]
    EXERCISE_CHOICES = [('none', 'None'), ('low', '1-2x/week'), ('high', '3+/week')]
    ALCOHOL_CHOICES = [('none', 'None'), ('moderate', 'Moderate'), ('high', 'High')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assessments')
    created_at = models.DateTimeField(auto_now_add=True)

    # Section A: Basic Info
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    height_cm = models.FloatField()
    weight_kg = models.FloatField()

    # Section B: Lifestyle
    smokes = models.BooleanField(default=False)
    alcohol = models.CharField(max_length=10, choices=ALCOHOL_CHOICES, default='none')
    exercise = models.CharField(max_length=10, choices=EXERCISE_CHOICES, default='none')

    # Section C: Hypertension Symptoms
    frequent_headaches = models.BooleanField(default=False)
    dizziness = models.BooleanField(default=False)
    blurred_vision = models.BooleanField(default=False)

    # Section D: Diabetes Symptoms
    frequent_urination = models.BooleanField(default=False)
    excessive_thirst = models.BooleanField(default=False)
    fatigue = models.BooleanField(default=False)

    # Section E: Medical History
    family_diabetes = models.BooleanField(default=False)
    family_hypertension = models.BooleanField(default=False)
    previously_diagnosed = models.BooleanField(default=False)

    # Consent
    popia_consent = models.BooleanField(default=False)
    not_medical_advice_acknowledged = models.BooleanField(default=False)

    @property
    def bmi(self):
        height_m = self.height_cm / 100
        return round(self.weight_kg / (height_m ** 2), 1)

    def __str__(self):
        return f"Assessment({self.user.email}, {self.created_at.date()})"


class AssessmentResult(models.Model):
    RISK_LEVELS = [('low', 'Low'), ('moderate', 'Moderate'), ('high', 'High')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assessment = models.OneToOneField(Assessment, on_delete=models.CASCADE, related_name='result')
    created_at = models.DateTimeField(auto_now_add=True)

    bmi = models.FloatField()
    diabetes_score = models.IntegerField()
    hypertension_score = models.IntegerField()
    diabetes_risk = models.CharField(max_length=10, choices=RISK_LEVELS)
    hypertension_risk = models.CharField(max_length=10, choices=RISK_LEVELS)

    # AI-generated content
    diabetes_recommendation = models.TextField()
    hypertension_recommendation = models.TextField()
    key_risk_factors = models.JSONField(default=list)
    next_steps = models.JSONField(default=list)
    ai_summary = models.TextField(blank=True)

    def __str__(self):
        return f"Result(D:{self.diabetes_risk}, H:{self.hypertension_risk})"
```

### 2.3 Run Migrations

```bash
cd backend
python manage.py makemigrations users
python manage.py makemigrations assessments
python manage.py migrate
python manage.py createsuperuser
```

---

## 🧠 PHASE 3 — Scoring Engine & AI Integration

### 3.1 Scoring Logic (`assessments/scoring.py`)

Implement this EXACTLY as specified:

```python
def calculate_scores(assessment) -> dict:
    """
    Rule-based risk scoring engine.
    Returns dict with scores, risk levels, BMI, and risk factors.
    """
    bmi = assessment.bmi
    diabetes_score = 0
    hypertension_score = 0
    risk_factors = []

    # --- DIABETES SCORING ---
    if assessment.age > 45:
        diabetes_score += 2
        risk_factors.append("Age over 45")
    if bmi > 30:
        diabetes_score += 3
        risk_factors.append(f"Elevated BMI ({bmi})")
    if assessment.family_diabetes:
        diabetes_score += 2
        risk_factors.append("Family history of diabetes")
    if assessment.frequent_urination:
        diabetes_score += 2
        risk_factors.append("Frequent urination")
    if assessment.excessive_thirst:
        diabetes_score += 2
        risk_factors.append("Excessive thirst")
    if assessment.fatigue:
        diabetes_score += 1
        risk_factors.append("Fatigue")
    if assessment.exercise == 'none':
        diabetes_score += 1
        risk_factors.append("No regular exercise")

    # --- HYPERTENSION SCORING ---
    if assessment.age > 40:
        hypertension_score += 2
    if bmi > 30:
        hypertension_score += 2
    if assessment.smokes:
        hypertension_score += 2
        risk_factors.append("Smoking")
    if assessment.alcohol == 'high':
        hypertension_score += 2
        risk_factors.append("High alcohol intake")
    if assessment.frequent_headaches:
        hypertension_score += 1
        risk_factors.append("Frequent headaches")
    if assessment.dizziness:
        hypertension_score += 1
        risk_factors.append("Dizziness")
    if assessment.family_hypertension:
        hypertension_score += 2
        risk_factors.append("Family history of hypertension")

    # --- RISK LEVELS ---
    def diabetes_level(score):
        if score <= 3: return 'low'
        if score <= 7: return 'moderate'
        return 'high'

    def hypertension_level(score):
        if score <= 3: return 'low'
        if score <= 6: return 'moderate'
        return 'high'

    return {
        'bmi': bmi,
        'diabetes_score': diabetes_score,
        'hypertension_score': hypertension_score,
        'diabetes_risk': diabetes_level(diabetes_score),
        'hypertension_risk': hypertension_level(hypertension_score),
        'risk_factors': list(set(risk_factors)),  # deduplicate
    }
```

### 3.2 Claude AI Client (`ai/client.py`)

```python
import anthropic
from django.conf import settings

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

def generate_recommendations(scoring_result: dict, assessment_data: dict) -> dict:
    """
    Call Claude claude-sonnet-4-6 to generate personalised health recommendations.
    Returns structured recommendation text.
    """
    prompt = f"""
You are a health risk communication assistant. A patient has completed a health risk assessment.

Assessment Results:
- BMI: {scoring_result['bmi']}
- Diabetes Risk Level: {scoring_result['diabetes_risk']} (score: {scoring_result['diabetes_score']})
- Hypertension Risk Level: {scoring_result['hypertension_risk']} (score: {scoring_result['hypertension_score']})
- Key Risk Factors: {', '.join(scoring_result['risk_factors'])}
- Age: {assessment_data['age']}, Smokes: {assessment_data['smokes']}, Exercise: {assessment_data['exercise']}

Generate a JSON response with EXACTLY these fields:
{{
  "diabetes_recommendation": "1-2 sentence personalised recommendation for diabetes risk",
  "hypertension_recommendation": "1-2 sentence personalised recommendation for hypertension risk",
  "next_steps": ["step 1", "step 2", "step 3"],
  "ai_summary": "2-3 sentence overall health summary"
}}

Rules:
- Be empathetic, clear, and non-alarming
- Always include: this is not a medical diagnosis
- Tailor advice to the actual risk level (low/moderate/high)
- For high risk: recommend consulting a healthcare provider urgently
- For moderate: recommend testing within 30 days
- For low: recommend maintaining healthy habits
- Respond ONLY with valid JSON, no extra text
"""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )

    import json
    return json.loads(message.content[0].text)
```

---

## 🔌 PHASE 4 — API Endpoints

### 4.1 URL Structure (`config/urls.py`)

```python
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/assessments/', include('assessments.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs'),
]
```

### 4.2 Auth Endpoints (`users/urls.py`)

```
POST /api/auth/register/        → Register with name, email, password
POST /api/auth/login/           → JWT login → returns access + refresh tokens
POST /api/auth/guest/           → Create guest session → returns temp JWT
POST /api/auth/token/refresh/   → Refresh access token
GET  /api/auth/me/              → Current user profile
```

**`users/views.py`** — Implement these views:
- `RegisterView(generics.CreateAPIView)` — creates user, returns JWT tokens
- `GuestLoginView(APIView)` — creates guest user with uuid email, returns JWT
- `MeView(generics.RetrieveAPIView)` — returns current user (IsAuthenticated)

### 4.3 Assessment Endpoints (`assessments/urls.py`)

```
POST /api/assessments/submit/   → Submit questionnaire → triggers scoring + AI → returns result
GET  /api/assessments/          → List user's past assessments
GET  /api/assessments/{id}/     → Get single assessment with result
```

**`assessments/views.py`** — `AssessmentSubmitView(generics.CreateAPIView)`:

```python
class AssessmentSubmitView(generics.CreateAPIView):
    serializer_class = AssessmentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        assessment = serializer.save(user=self.request.user)

        # 1. Score the assessment
        from .scoring import calculate_scores
        scores = calculate_scores(assessment)

        # 2. Generate AI recommendations
        from ai.client import generate_recommendations
        ai_output = generate_recommendations(scores, AssessmentSerializer(assessment).data)

        # 3. Save result
        AssessmentResult.objects.create(
            assessment=assessment,
            **scores,
            **ai_output,
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        result = serializer.instance.result
        return Response(AssessmentResultSerializer(result).data, status=201)
```

### 4.4 Report Endpoint (`reports/urls.py`)

```
GET  /api/reports/{assessment_id}/pdf/   → Returns PDF file stream
```

---

## 📄 PHASE 5 — PDF Report Generation

### 5.1 WeasyPrint Template (`reports/templates/report.html`)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #1f2937; }
    .header { border-bottom: 3px solid #0F766E; padding-bottom: 16px; margin-bottom: 24px; }
    .header h1 { color: #0F766E; font-size: 22px; margin: 0; }
    .header p { color: #6b7280; font-size: 12px; margin: 4px 0 0; }
    .meta { display: flex; gap: 32px; margin-bottom: 24px; font-size: 13px; }
    .risk-grid { display: flex; gap: 16px; margin-bottom: 24px; }
    .risk-card { flex: 1; padding: 16px; border-radius: 8px; text-align: center; }
    .risk-card.low { background: #dcfce7; border: 1px solid #16a34a; }
    .risk-card.moderate { background: #fef9c3; border: 1px solid #d97706; }
    .risk-card.high { background: #fee2e2; border: 1px solid #dc2626; }
    .risk-card h3 { margin: 0 0 4px; font-size: 13px; color: #374151; }
    .risk-card .level { font-size: 22px; font-weight: bold; margin: 0; }
    .risk-card.low .level { color: #16a34a; }
    .risk-card.moderate .level { color: #d97706; }
    .risk-card.high .level { color: #dc2626; }
    .section { margin-bottom: 20px; }
    .section h2 { color: #0F766E; font-size: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
    ul { padding-left: 20px; line-height: 1.8; font-size: 13px; }
    .disclaimer { margin-top: 32px; padding: 12px; background: #f3f4f6; border-radius: 6px; font-size: 11px; color: #6b7280; }
    .footer { margin-top: 24px; font-size: 11px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🩺 Health Risk Assessment Report</h1>
    <p>Generated by HealthCheck — Not a medical diagnosis</p>
  </div>

  <div class="meta">
    <div><strong>Name:</strong> {{ user_name }}</div>
    <div><strong>Date:</strong> {{ date }}</div>
    <div><strong>BMI:</strong> {{ bmi }}</div>
  </div>

  <div class="risk-grid">
    <div class="risk-card {{ diabetes_risk }}">
      <h3>Diabetes Risk</h3>
      <p class="level">{{ diabetes_risk|title }}</p>
    </div>
    <div class="risk-card {{ hypertension_risk }}">
      <h3>Hypertension Risk</h3>
      <p class="level">{{ hypertension_risk|title }}</p>
    </div>
  </div>

  <div class="section">
    <h2>Key Risk Factors Identified</h2>
    <ul>
      {% for factor in risk_factors %}
        <li>{{ factor }}</li>
      {% empty %}
        <li>No significant risk factors identified</li>
      {% endfor %}
    </ul>
  </div>

  <div class="section">
    <h2>Recommendations</h2>
    <p><strong>Diabetes:</strong> {{ diabetes_recommendation }}</p>
    <p><strong>Hypertension:</strong> {{ hypertension_recommendation }}</p>
  </div>

  <div class="section">
    <h2>Recommended Next Steps</h2>
    <ul>
      {% for step in next_steps %}
        <li>{{ step }}</li>
      {% endfor %}
    </ul>
  </div>

  <div class="section">
    <h2>Summary</h2>
    <p>{{ ai_summary }}</p>
  </div>

  <div class="disclaimer">
    ⚠️ <strong>Disclaimer:</strong> This assessment is not a medical diagnosis.
    Results are based on self-reported information and a rule-based algorithm.
    Please consult a qualified healthcare professional for medical advice.
    This report was generated in compliance with POPIA data privacy regulations.
  </div>

  <div class="footer">HealthCheck MVP • {{ date }} • Confidential</div>
</body>
</html>
```

### 5.2 PDF View (`reports/views.py`)

```python
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from assessments.models import Assessment
from datetime import date

class DownloadReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_id):
        assessment = Assessment.objects.select_related('result').get(
            id=assessment_id, user=request.user
        )
        result = assessment.result

        context = {
            'user_name': request.user.name,
            'date': date.today().strftime('%d %B %Y'),
            'bmi': result.bmi,
            'diabetes_risk': result.diabetes_risk,
            'hypertension_risk': result.hypertension_risk,
            'risk_factors': result.key_risk_factors,
            'diabetes_recommendation': result.diabetes_recommendation,
            'hypertension_recommendation': result.hypertension_recommendation,
            'next_steps': result.next_steps,
            'ai_summary': result.ai_summary,
        }

        html_string = render_to_string('report.html', context)
        pdf = HTML(string=html_string).write_pdf()

        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="health-report-{assessment_id}.pdf"'
        return response
```

---

## 🎨 PHASE 6 — Frontend Implementation

### 6.1 TypeScript Types (`src/types/index.ts`)

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  is_guest: boolean;
}

export type RiskLevel = 'low' | 'moderate' | 'high';
export type Exercise = 'none' | 'low' | 'high';
export type Alcohol = 'none' | 'moderate' | 'high';

export interface AssessmentPayload {
  // Section A
  age: number;
  gender: 'M' | 'F' | 'O';
  height_cm: number;
  weight_kg: number;
  // Section B
  smokes: boolean;
  alcohol: Alcohol;
  exercise: Exercise;
  // Section C
  frequent_headaches: boolean;
  dizziness: boolean;
  blurred_vision: boolean;
  // Section D
  frequent_urination: boolean;
  excessive_thirst: boolean;
  fatigue: boolean;
  // Section E
  family_diabetes: boolean;
  family_hypertension: boolean;
  previously_diagnosed: boolean;
  // Consent
  popia_consent: boolean;
  not_medical_advice_acknowledged: boolean;
}

export interface AssessmentResult {
  id: string;
  bmi: number;
  diabetes_score: number;
  hypertension_score: number;
  diabetes_risk: RiskLevel;
  hypertension_risk: RiskLevel;
  diabetes_recommendation: string;
  hypertension_recommendation: string;
  key_risk_factors: string[];
  next_steps: string[];
  ai_summary: string;
  assessment_id: string;
}
```

### 6.2 Zustand Store (`src/store/useAssessmentStore.ts`)

```typescript
import { create } from 'zustand';
import { AssessmentPayload, AssessmentResult, User } from '../types';

interface AssessmentStore {
  user: User | null;
  token: string | null;
  formData: Partial<AssessmentPayload>;
  result: AssessmentResult | null;
  currentStep: number;

  setUser: (user: User, token: string) => void;
  updateForm: (data: Partial<AssessmentPayload>) => void;
  setResult: (result: AssessmentResult) => void;
  setStep: (step: number) => void;
  reset: () => void;
}

export const useAssessmentStore = create<AssessmentStore>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  formData: {},
  result: null,
  currentStep: 0,

  setUser: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },
  updateForm: (data) => set((s) => ({ formData: { ...s.formData, ...data } })),
  setResult: (result) => set({ result }),
  setStep: (step) => set({ currentStep: step }),
  reset: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, formData: {}, result: null, currentStep: 0 });
  },
}));
```

### 6.3 API Client (`src/api/client.ts`)

```typescript
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 6.4 Page Components — Build Each Page

#### `src/pages/Landing.tsx`
- Full-width hero section with title: **"Check Your Risk for Diabetes & Hypertension in 3 Minutes"**
- Primary CTA button: "Start Free Assessment" → navigates to `/auth`
- 3 trust signal cards: 🔒 Private & Secure | ⚕️ Not a Diagnosis | ⚡ 3 Minutes
- Clean teal/white color scheme

#### `src/pages/Auth.tsx`
- Tab toggle: "Sign Up" / "Log In"
- Sign Up fields: Full Name, Email, Password
- Log In fields: Email, Password
- "Continue as Guest" link below form
- On success → navigate to `/consent`

#### `src/pages/Consent.tsx`
- Two checkboxes (both required to continue):
  - ✅ I agree to my data being used for this assessment (POPIA)
  - ✅ I understand this is not a medical diagnosis
- "Continue" button (disabled until both checked)
- On continue → navigate to `/questionnaire`

#### `src/pages/Questionnaire.tsx`
Multi-step form with 5 sections. Show `<StepIndicator />` at top.

```
Step 1: Basic Info        (age, gender, height, weight)
Step 2: Lifestyle         (smoking, alcohol, exercise)
Step 3: Hypertension Sx   (headaches, dizziness, blurred vision)
Step 4: Diabetes Sx       (urination, thirst, fatigue)
Step 5: Medical History   (family history, previous diagnosis)
```

- "Next" / "Back" navigation between steps
- Show live BMI calculation when height + weight are entered
- On final step "Submit" → POST to `/api/assessments/submit/` → navigate to `/results`
- Show loading spinner during API call

#### `src/pages/Results.tsx`
Display `AssessmentResult` from store:

- Two `<RiskBadge />` cards side by side (Diabetes + Hypertension)
- Risk factor list
- AI-generated recommendations section
- Next steps list
- Action buttons:
  - "📥 Download PDF" → GET `/api/reports/{id}/pdf/`
  - "💬 Share via WhatsApp" → `https://wa.me/?text=...` with summary text
  - "🔄 Retake Assessment" → reset store, go to `/questionnaire`

### 6.5 Reusable Components

#### `src/components/StepIndicator.tsx`
```tsx
// Props: currentStep: number, totalSteps: number, labels: string[]
// Renders: numbered circles connected by lines, active step in teal
```

#### `src/components/RiskBadge.tsx`
```tsx
// Props: type: 'diabetes' | 'hypertension', level: RiskLevel, score: number
// Colors: low=green, moderate=amber, high=red
// Shows: icon, label, risk level, score
```

#### `src/components/QuestionCard.tsx`
```tsx
// Props: question: string, type: 'boolean' | 'select' | 'number', options?: string[]
// Renders styled card with question and appropriate input
```

### 6.6 App Router (`src/App.tsx`)

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Consent from './pages/Consent';
import Questionnaire from './pages/Questionnaire';
import Results from './pages/Results';
import { useAssessmentStore } from './store/useAssessmentStore';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAssessmentStore((s) => s.token);
  return token ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/consent" element={<ProtectedRoute><Consent /></ProtectedRoute>} />
        <Route path="/questionnaire" element={<ProtectedRoute><Questionnaire /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🐳 PHASE 7 — Docker & Local Dev

### `docker-compose.yml`

```yaml
version: '3.9'
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: healthrisk
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    depends_on:
      - db

  frontend:
    build: ./frontend
    command: npm run dev -- --host
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## 🧪 PHASE 8 — Testing Checklist

Run these manually before declaring MVP complete:

### Auth Flow
- [ ] User can register with name, email, password
- [ ] User can log in and receive JWT token
- [ ] Guest login creates account and returns token
- [ ] Protected routes redirect to /auth when not logged in

### Questionnaire Flow
- [ ] All 5 steps render correctly
- [ ] BMI calculates live on step 1
- [ ] Boolean questions (Yes/No) work correctly
- [ ] Form validates required fields before "Next"
- [ ] Submit sends correct payload to API

### Scoring Verification
Test these cases against the scoring table:

| Test Case | Expected Diabetes | Expected Hypertension |
|---|---|---|
| Age 50, BMI 32, family history, all symptoms | High | High |
| Age 35, BMI 22, no symptoms | Low | Low |
| Age 46, BMI 31, family history only | Moderate | Moderate |

### Results & Report
- [ ] Results page shows correct risk levels and colours
- [ ] AI recommendations are populated (not empty)
- [ ] PDF download returns a valid PDF file
- [ ] WhatsApp share link opens with correct text
- [ ] Retake button resets form and goes back to questionnaire

### Django Admin
- [ ] `/admin/` shows User, Assessment, AssessmentResult tables
- [ ] Assessment list shows user email, date, risk levels

---

## 🚀 PHASE 9 — Launch Prep

### Environment Variables (Production)
```
SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_hex(50))">
DEBUG=False
ALLOWED_HOSTS=yourdomain.com
DATABASE_URL=<production postgres URL>
ANTHROPIC_API_KEY=<your key>
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### Pre-Launch Checklist
- [ ] Set `DEBUG=False`
- [ ] Set strong `SECRET_KEY`
- [ ] Run `python manage.py collectstatic`
- [ ] Configure HTTPS (required for POPIA compliance)
- [ ] Add rate limiting to `/api/assessments/submit/` (max 5/hour per user)
- [ ] Add POPIA privacy policy page
- [ ] Test PDF generation in production environment

---

## 📦 QUICK REFERENCE — API Payload Examples

### POST `/api/auth/register/`
```json
{ "name": "Sipho Dlamini", "email": "sipho@example.com", "password": "SecurePass123!" }
```

### POST `/api/assessments/submit/`
```json
{
  "age": 48, "gender": "M", "height_cm": 175, "weight_kg": 95,
  "smokes": true, "alcohol": "moderate", "exercise": "none",
  "frequent_headaches": true, "dizziness": false, "blurred_vision": false,
  "frequent_urination": true, "excessive_thirst": true, "fatigue": true,
  "family_diabetes": true, "family_hypertension": false, "previously_diagnosed": false,
  "popia_consent": true, "not_medical_advice_acknowledged": true
}
```

### Response from `/api/assessments/submit/`
```json
{
  "id": "uuid",
  "bmi": 31.0,
  "diabetes_score": 11,
  "hypertension_score": 8,
  "diabetes_risk": "high",
  "hypertension_risk": "high",
  "diabetes_recommendation": "...",
  "hypertension_recommendation": "...",
  "key_risk_factors": ["Elevated BMI (31.0)", "Family history of diabetes", "Smoking"],
  "next_steps": ["Book a blood glucose test", "Check blood pressure", "Consult a doctor"],
  "ai_summary": "..."
}
```

---

## ⚠️ IMPORTANT NOTES FOR THE AGENT

1. **Never hardcode the ANTHROPIC_API_KEY** — always read from environment variables
2. **Always validate consent fields** — `popia_consent` and `not_medical_advice_acknowledged` must both be `true` to accept a submission
3. **PDF generation requires WeasyPrint** — on Linux, install system deps: `apt-get install -y libpango-1.0-0 libharfbuzz0b libpangoft2-1.0-0`
4. **CORS** — must be configured before frontend can call backend locally
5. **JWT tokens** — store in `localStorage`, include as `Authorization: Bearer <token>` on all protected requests
6. **Error handling** — all API views must return meaningful error messages, not 500 errors
7. **Claude model string** — always use `claude-sonnet-4-20250514` in the Anthropic API call

---

*Build Plan Version: 1.0 | Stack: Django 5 + DRF + React + Vite + TypeScript + Tailwind + Claude claude-sonnet-4-6*
