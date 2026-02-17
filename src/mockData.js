export const questions = [
  { id: 'age', question: 'What is your age?', type: 'slider', min: 18, max: 80, unit: 'years' },
  { id: 'gender', question: 'What is your gender?', type: 'choice', options: ['Male', 'Female'] },
  { id: 'exercise', question: 'How many days per week do you exercise 30+ minutes?', type: 'slider', min: 0, max: 7, unit: 'days' },
  { id: 'smoking', question: 'Do you smoke cigarettes?', type: 'choice', options: ['Yes', 'No', 'Former smoker'] },
  { id: 'vegetables', question: 'How many servings of vegetables daily?', type: 'slider', min: 0, max: 10, unit: 'servings' },
  { id: 'familyHistory', question: 'Family history of diabetes, heart disease, or high BP?', type: 'choice', options: ['Yes', 'No', 'Not sure'] },
  { id: 'weight', question: 'Would you describe your weight as:', type: 'choice', options: ['Underweight', 'Normal', 'Overweight', 'Obese'] },
  { id: 'stress', question: 'How would you rate your stress level?', type: 'slider', min: 1, max: 10, unit: '/10' }
];

export const facilities = [
  { name: 'Nairobi Health Centre', distance: '2.3 km', services: 'Diabetes screening, BP checks', cost: 'KES 800', phone: '0700123456' },
  { name: 'Community Clinic Kasarani', distance: '3.1 km', services: 'General checkup, Lab tests', cost: 'KES 1,200', phone: '0700234567' },
  { name: 'AfyaCare Eastlands', distance: '4.5 km', services: 'Full NCD screening', cost: 'KES 2,500', phone: '0700345678' }
];

export const faqs = [
  { q: 'What is diabetes?', a: 'Diabetes is a condition where blood sugar is too high. It can be managed with lifestyle changes and treatment.' },
  { q: 'How often should I get screened?', a: 'If moderate/high risk, screen every 6–12 months. If low risk, yearly is often enough.' },
  { q: 'Is this a diagnosis?', a: 'No. This is a mock-data risk estimate. Please visit a healthcare provider for diagnosis.' }
];
