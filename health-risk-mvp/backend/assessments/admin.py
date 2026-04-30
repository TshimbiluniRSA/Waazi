from django.contrib import admin
from .models import Assessment, AssessmentResult


class ResultInline(admin.StackedInline):
    model = AssessmentResult
    readonly_fields = ('bmi', 'diabetes_score', 'hypertension_score',
                       'diabetes_risk', 'hypertension_risk', 'ai_summary')
    extra = 0


@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'age', 'get_bmi',
                    'get_diabetes_risk', 'get_hypertension_risk')
    list_filter = ('result__diabetes_risk', 'result__hypertension_risk')
    search_fields = ('user__email', 'user__name')
    inlines = [ResultInline]

    def get_bmi(self, obj): return obj.bmi
    get_bmi.short_description = 'BMI'

    def get_diabetes_risk(self, obj):
        return obj.result.diabetes_risk if hasattr(obj, 'result') else '-'
    get_diabetes_risk.short_description = 'Diabetes Risk'

    def get_hypertension_risk(self, obj):
        return obj.result.hypertension_risk if hasattr(obj, 'result') else '-'
    get_hypertension_risk.short_description = 'Hypertension Risk'
