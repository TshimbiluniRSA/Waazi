from rest_framework import serializers
from .models import Assessment, AssessmentResult


class AssessmentResultSerializer(serializers.ModelSerializer):
    assessment_id = serializers.UUIDField(source='assessment.id', read_only=True)

    class Meta:
        model = AssessmentResult
        fields = (
            'id', 'assessment_id', 'bmi',
            'diabetes_score', 'hypertension_score',
            'diabetes_risk', 'hypertension_risk',
            'diabetes_recommendation', 'hypertension_recommendation',
            'key_risk_factors', 'next_steps', 'ai_summary',
            'created_at',
        )


class AssessmentSerializer(serializers.ModelSerializer):
    result = AssessmentResultSerializer(read_only=True)
    bmi = serializers.FloatField(read_only=True)

    class Meta:
        model = Assessment
        exclude = ('user',)
        read_only_fields = ('id', 'created_at', 'bmi')

    def validate(self, data):
        if not data.get('popia_consent'):
            raise serializers.ValidationError(
                {'popia_consent': 'You must accept the data usage agreement.'}
            )
        if not data.get('not_medical_advice_acknowledged'):
            raise serializers.ValidationError(
                {'not_medical_advice_acknowledged': 'You must acknowledge this is not medical advice.'}
            )
        return data
