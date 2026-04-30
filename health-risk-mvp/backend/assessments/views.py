from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Assessment, AssessmentResult
from .serializers import AssessmentSerializer, AssessmentResultSerializer
from .scoring import calculate_scores
from ai.client import generate_recommendations, get_fallback_recommendations


class AssessmentSubmitView(generics.CreateAPIView):
    serializer_class = AssessmentSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        assessment = serializer.save(user=request.user)

        # 1. Score
        scores = calculate_scores(assessment)

        # 2. AI recommendations (with fallback)
        try:
            ai_output = generate_recommendations(scores, serializer.data)
        except Exception as e:
            print(f"Claude API error: {e}")
            ai_output = get_fallback_recommendations(scores)

        # 3. Persist result
        result = AssessmentResult.objects.create(
            assessment=assessment,
            bmi=scores['bmi'],
            diabetes_score=scores['diabetes_score'],
            hypertension_score=scores['hypertension_score'],
            diabetes_risk=scores['diabetes_risk'],
            hypertension_risk=scores['hypertension_risk'],
            diabetes_recommendation=ai_output['diabetes_recommendation'],
            hypertension_recommendation=ai_output['hypertension_recommendation'],
            key_risk_factors=ai_output.get('key_risk_factors', scores['risk_factors']),
            next_steps=ai_output['next_steps'],
            ai_summary=ai_output.get('ai_summary', ''),
        )

        return Response(AssessmentResultSerializer(result).data, status=status.HTTP_201_CREATED)


class AssessmentListView(generics.ListAPIView):
    serializer_class = AssessmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Assessment.objects.filter(user=self.request.user).select_related('result')


class AssessmentDetailView(generics.RetrieveAPIView):
    serializer_class = AssessmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Assessment.objects.filter(user=self.request.user).select_related('result')
