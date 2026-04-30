export const questions = [
  { id: 'age', question: 'What is your age?', type: 'slider', min: 18, max: 80, unit: 'years' },
  {
    id: 'gender',
    question: 'What is your sex assigned at birth? (for risk profiling)',
    type: 'choice',
    options: ['Female', 'Male', 'Intersex / another variation', 'Prefer not to say']
  },
  {
    id: 'exercise',
    question: 'How many days per week do you do at least 30 minutes of moderate activity?',
    type: 'slider',
    min: 0,
    max: 7,
    unit: 'days/week'
  },
  {
    id: 'smoking',
    question: 'Which best describes your tobacco use?',
    type: 'choice',
    options: ['Never smoked', 'Former smoker', 'Current smoker']
  },
  {
    id: 'vegetables',
    question: 'Average fruit + vegetable servings per day?',
    type: 'slider',
    min: 0,
    max: 10,
    unit: 'servings/day'
  },
  {
    id: 'familyHistory',
    question: 'Any first-degree family history of diabetes, heart disease, or hypertension?',
    type: 'choice',
    options: ['Yes', 'No', 'Not sure']
  },
  {
    id: 'weight',
    question: 'Which BMI category best matches you?',
    type: 'choice',
    options: ['Underweight (BMI <18.5)', 'Healthy (BMI 18.5-24.9)', 'Overweight (BMI 25-29.9)', 'Obesity (BMI 30+)']
  },
  {
    id: 'bloodPressure',
    question: 'What is your current blood pressure status?',
    type: 'choice',
    options: ['Normal / not diagnosed', 'Elevated / borderline', 'Diagnosed high blood pressure', 'Not sure']
  }
];

export const facilities = [
  {
    name: 'Mbagathi County Hospital - NCD Clinic',
    distance: '4.1 km',
    services: 'BP checks, fasting blood sugar, clinician consult',
    cost: 'ZAR 1,000 - 1,800',
    phone: '0701122334'
  },
  {
    name: 'Mama Lucy Kibaki Hospital - Outpatient',
    distance: '6.3 km',
    services: 'General review, ECG referral, lab tests',
    cost: 'ZAR 1,200 - 2,500',
    phone: '0702456789'
  },
  {
    name: 'Aga Khan University Hospital - Wellness',
    distance: '8.0 km',
    services: 'Comprehensive risk panel, lipids, HbA1c',
    cost: 'ZAR 3,500 - 7,000',
    phone: '0703567890'
  }
];

export const faqs = [
  {
    q: 'Is this result a diagnosis?',
    a: 'No. This is a risk estimate based on mock frontend data. Only a licensed clinician can diagnose disease.'
  },
  {
    q: 'How often should adults screen for NCD risk factors?',
    a: 'Most adults should check blood pressure at least yearly, and screen glucose/lipids more often if risk is moderate or high.'
  },
  {
    q: 'When should I seek urgent care instead of waiting?',
    a: 'Seek urgent care for chest pain, severe shortness of breath, weakness on one side, confusion, or severe headache.'
  }
];
