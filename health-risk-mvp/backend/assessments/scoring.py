def calculate_scores(assessment) -> dict:
    """
    Rule-based health risk scoring engine.
    Returns scores, risk levels, BMI, and identified risk factors.
    """
    bmi = assessment.bmi
    diabetes_score = 0
    hypertension_score = 0
    risk_factors = []

    # ── DIABETES RISK ────────────────────────────────────────────
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
        risk_factors.append("Persistent fatigue")

    if assessment.exercise == 'none':
        diabetes_score += 1
        risk_factors.append("No regular exercise")

    # ── HYPERTENSION RISK ────────────────────────────────────────
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

    # ── RISK LEVEL THRESHOLDS ────────────────────────────────────
    def diabetes_level(score: int) -> str:
        if score <= 3: return 'low'
        if score <= 7: return 'moderate'
        return 'high'

    def hypertension_level(score: int) -> str:
        if score <= 3: return 'low'
        if score <= 6: return 'moderate'
        return 'high'

    return {
        'bmi': bmi,
        'diabetes_score': diabetes_score,
        'hypertension_score': hypertension_score,
        'diabetes_risk': diabetes_level(diabetes_score),
        'hypertension_risk': hypertension_level(hypertension_score),
        'risk_factors': list(dict.fromkeys(risk_factors)),  # preserve order, deduplicate
    }
