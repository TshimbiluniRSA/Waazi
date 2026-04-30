import anthropic
import json
from django.conf import settings


def generate_recommendations(scoring_result: dict, assessment_data: dict) -> dict:
    """
    Calls Claude claude-sonnet-4-6 to generate personalised health recommendations.

    Args:
        scoring_result: Output from calculate_scores()
        assessment_data: Serialized assessment dict (age, exercise, smokes, etc.)

    Returns:
        dict with: diabetes_recommendation, hypertension_recommendation,
                   next_steps (list), ai_summary, key_risk_factors (list)
    """
    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

    prompt = f"""You are a health risk communication assistant helping patients understand their risk assessment results.

Patient Assessment Summary:
- Age: {assessment_data.get('age')}
- BMI: {scoring_result['bmi']} ({'overweight' if scoring_result['bmi'] > 25 else 'normal'})
- Diabetes Risk: {scoring_result['diabetes_risk'].upper()} (score: {scoring_result['diabetes_score']}/14)
- Hypertension Risk: {scoring_result['hypertension_risk'].upper()} (score: {scoring_result['hypertension_score']}/14)
- Risk Factors Found: {', '.join(scoring_result['risk_factors']) if scoring_result['risk_factors'] else 'None identified'}
- Smokes: {assessment_data.get('smokes')}
- Exercise: {assessment_data.get('exercise')}
- Alcohol: {assessment_data.get('alcohol')}
- Previously diagnosed: {assessment_data.get('previously_diagnosed')}

Generate a JSON response with EXACTLY these fields (no extra text, no markdown):
{{
  "diabetes_recommendation": "1-2 sentence personalised recommendation based on their diabetes risk level",
  "hypertension_recommendation": "1-2 sentence personalised recommendation based on their hypertension risk level",
  "next_steps": ["action 1", "action 2", "action 3"],
  "ai_summary": "2-3 sentence compassionate overall health summary",
  "key_risk_factors": ["factor 1", "factor 2"]
}}

Guidelines:
- Be empathetic, clear, and non-alarming
- Always note this is not a medical diagnosis
- HIGH risk → recommend consulting a healthcare provider urgently and testing as soon as possible
- MODERATE risk → recommend getting tested within the next 30 days
- LOW risk → encourage maintaining healthy lifestyle habits
- next_steps should be practical and actionable (max 4 steps)
- key_risk_factors should list the top 2-3 factors from the assessment
- Respond ONLY with valid JSON"""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = message.content[0].text.strip()

    # Strip markdown code fences if model wraps them
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    return json.loads(raw)


def get_fallback_recommendations(scoring_result: dict) -> dict:
    """
    Fallback recommendations if Claude API call fails.
    Used to prevent user-facing errors.
    """
    level_map = {
        'high': "You should consult a healthcare provider and get tested as soon as possible.",
        'moderate': "We recommend getting tested within the next 30 days.",
        'low': "Your risk appears low. Keep maintaining a healthy lifestyle.",
    }
    return {
        'diabetes_recommendation': level_map[scoring_result['diabetes_risk']],
        'hypertension_recommendation': level_map[scoring_result['hypertension_risk']],
        'next_steps': [
            "Book a blood glucose and blood pressure check",
            "Speak to your healthcare provider about your results",
            "Maintain a balanced diet and regular exercise routine",
        ],
        'ai_summary': "Based on your responses, we have identified your risk levels above. Please consult a healthcare professional for a proper diagnosis. This assessment is not a substitute for medical advice.",
        'key_risk_factors': scoring_result['risk_factors'][:3],
    }
