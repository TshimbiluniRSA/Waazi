from django.http import HttpResponse
from django.template.loader import render_to_string
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from weasyprint import HTML
from assessments.models import Assessment
from datetime import date


class DownloadReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_id):
        assessment = get_object_or_404(
            Assessment.objects.select_related('result'),
            id=assessment_id,
            user=request.user
        )

        if not hasattr(assessment, 'result'):
            return Response({'detail': 'Result not found for this assessment.'}, status=404)

        result = assessment.result

        context = {
            'user_name': request.user.name,
            'date': date.today().strftime('%d %B %Y'),
            'bmi': result.bmi,
            'diabetes_risk': result.diabetes_risk,
            'hypertension_risk': result.hypertension_risk,
            'diabetes_score': result.diabetes_score,
            'hypertension_score': result.hypertension_score,
            'risk_factors': result.key_risk_factors,
            'diabetes_recommendation': result.diabetes_recommendation,
            'hypertension_recommendation': result.hypertension_recommendation,
            'next_steps': result.next_steps,
            'ai_summary': result.ai_summary,
        }

        html_string = render_to_string('report.html', context)
        pdf_bytes = HTML(string=html_string).write_pdf()

        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        response['Content-Disposition'] = (
            f'attachment; filename="waazi-report-{assessment_id}.pdf"'
        )
        return response
