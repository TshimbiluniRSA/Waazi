// ── Auth ────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  is_guest: boolean;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

// ── Assessment ──────────────────────────────────────────────────
export type Gender   = 'M' | 'F' | 'O';
export type Exercise = 'none' | 'low' | 'high';
export type Alcohol  = 'none' | 'moderate' | 'high';
export type RiskLevel = 'low' | 'moderate' | 'high';

export interface AssessmentPayload {
  // Section A
  age: number;
  gender: Gender;
  height_cm: number;
  weight_kg: number;
  // Section B
  smokes: boolean;
  alcohol: Alcohol;
  exercise: Exercise;
  // Section C — Hypertension
  frequent_headaches: boolean;
  dizziness: boolean;
  blurred_vision: boolean;
  // Section D — Diabetes
  frequent_urination: boolean;
  excessive_thirst: boolean;
  fatigue: boolean;
  // Section E — History
  family_diabetes: boolean;
  family_hypertension: boolean;
  previously_diagnosed: boolean;
  // Consent
  popia_consent: boolean;
  not_medical_advice_acknowledged: boolean;
}

export interface AssessmentResult {
  id: string;
  assessment_id: string;
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
  created_at: string;
}
