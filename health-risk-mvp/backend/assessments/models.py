from django.db import models
from django.conf import settings
import uuid


class Assessment(models.Model):
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female'), ('O', 'Other')]
    EXERCISE_CHOICES = [('none', 'None'), ('low', '1-2x per week'), ('high', '3+ per week')]
    ALCOHOL_CHOICES = [('none', 'None'), ('moderate', 'Moderate'), ('high', 'High')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='assessments'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    # Consent (must both be True to process)
    popia_consent = models.BooleanField(default=False)
    not_medical_advice_acknowledged = models.BooleanField(default=False)

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

    @property
    def bmi(self):
        height_m = self.height_cm / 100
        return round(self.weight_kg / (height_m ** 2), 1)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Assessment — {self.user.email} ({self.created_at.date()})"


class AssessmentResult(models.Model):
    RISK_LEVELS = [('low', 'Low'), ('moderate', 'Moderate'), ('high', 'High')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assessment = models.OneToOneField(
        Assessment,
        on_delete=models.CASCADE,
        related_name='result'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    # Scores
    bmi = models.FloatField()
    diabetes_score = models.IntegerField()
    hypertension_score = models.IntegerField()
    diabetes_risk = models.CharField(max_length=10, choices=RISK_LEVELS)
    hypertension_risk = models.CharField(max_length=10, choices=RISK_LEVELS)

    # AI Output
    diabetes_recommendation = models.TextField()
    hypertension_recommendation = models.TextField()
    key_risk_factors = models.JSONField(default=list)
    next_steps = models.JSONField(default=list)
    ai_summary = models.TextField(blank=True)

    def __str__(self):
        return f"Result — D:{self.diabetes_risk} H:{self.hypertension_risk}"
