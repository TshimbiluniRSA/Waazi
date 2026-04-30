import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessmentStore } from '../store/useAssessmentStore';
import { submitAssessment } from '../api/assessment';
import StepIndicator from '../components/StepIndicator';
import type { AssessmentPayload, Gender, Alcohol, Exercise } from '../types';

const STEPS = ['Basic Info', 'Lifestyle', 'Hypertension', 'Diabetes', 'History'];

function YesNo({ value, onChange }: { value: boolean | undefined; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-3">
      <button type="button" onClick={() => onChange(true)}
        className={`flex-1 py-2 rounded-lg font-medium border-2 transition
          ${value === true ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200 text-gray-600'}`}>
        Yes
      </button>
      <button type="button" onClick={() => onChange(false)}
        className={`flex-1 py-2 rounded-lg font-medium border-2 transition
          ${value === false ? 'bg-red-400 border-red-400 text-white' : 'border-gray-200 text-gray-600'}`}>
        No
      </button>
    </div>
  );
}

export default function Questionnaire() {
  const store = useAssessmentStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [local, setLocal] = useState<Partial<AssessmentPayload>>(store.formData);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key: keyof AssessmentPayload, val: unknown) =>
    setLocal((prev) => ({ ...prev, [key]: val }));

  const bmi = local.height_cm && local.weight_kg
    ? (local.weight_kg / Math.pow(local.height_cm / 100, 2)).toFixed(1)
    : null;

  const handleNext = () => {
    setError('');
    if (step === 0) {
      if (!local.age || !local.gender || !local.height_cm || !local.weight_kg) {
        setError('Please fill in all fields.'); return;
      }
    }
    store.updateForm(local);
    if (step < 4) { setStep(step + 1); }
  };

  const handleBack = () => { if (step > 0) setStep(step - 1); };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload: AssessmentPayload = {
        ...(store.formData as AssessmentPayload),
        ...local,
        popia_consent: true,
        not_medical_advice_acknowledged: true,
      };
      const result = await submitAssessment(payload);
      store.setResult(result);
      navigate('/results');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8">
        <StepIndicator steps={STEPS} current={step} />

        {/* Step 0: Basic Info */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input type="number" min={18} max={100} value={local.age ?? ''}
                onChange={(e) => set('age', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <div className="flex gap-2">
                {([['M', 'Male'], ['F', 'Female'], ['O', 'Other']] as [Gender, string][]).map(([v, l]) => (
                  <button key={v} type="button" onClick={() => set('gender', v)}
                    className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition
                      ${local.gender === v ? 'bg-teal-700 border-teal-700 text-white' : 'border-gray-200 text-gray-600'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input type="number" value={local.height_cm ?? ''}
                  onChange={(e) => set('height_cm', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input type="number" value={local.weight_kg ?? ''}
                  onChange={(e) => set('weight_kg', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none" />
              </div>
            </div>
            {bmi && (
              <p className="text-sm text-teal-700 font-medium bg-teal-50 px-3 py-2 rounded-lg">
                Your BMI: {bmi}
              </p>
            )}
          </div>
        )}

        {/* Step 1: Lifestyle */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-gray-800">Lifestyle</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Do you smoke?</label>
              <YesNo value={local.smokes} onChange={(v) => set('smokes', v)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alcohol consumption</label>
              <div className="flex gap-2">
                {([['none', 'None'], ['moderate', 'Moderate'], ['high', 'High']] as [Alcohol, string][]).map(([v, l]) => (
                  <button key={v} type="button" onClick={() => set('alcohol', v)}
                    className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition
                      ${local.alcohol === v ? 'bg-teal-700 border-teal-700 text-white' : 'border-gray-200 text-gray-600'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exercise frequency</label>
              <div className="flex gap-2">
                {([['none', 'None'], ['low', '1–2x/wk'], ['high', '3+/wk']] as [Exercise, string][]).map(([v, l]) => (
                  <button key={v} type="button" onClick={() => set('exercise', v)}
                    className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition
                      ${local.exercise === v ? 'bg-teal-700 border-teal-700 text-white' : 'border-gray-200 text-gray-600'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Hypertension Symptoms */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-gray-800">Hypertension Symptoms</h2>
            {([
              ['frequent_headaches', 'Frequent headaches?'],
              ['dizziness', 'Do you experience dizziness?'],
              ['blurred_vision', 'Blurred vision?'],
            ] as [keyof AssessmentPayload, string][]).map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                <YesNo value={local[key] as boolean | undefined} onChange={(v) => set(key, v)} />
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Diabetes Symptoms */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-gray-800">Diabetes Symptoms</h2>
            {([
              ['frequent_urination', 'Frequent urination?'],
              ['excessive_thirst', 'Excessive thirst?'],
              ['fatigue', 'Persistent fatigue?'],
            ] as [keyof AssessmentPayload, string][]).map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                <YesNo value={local[key] as boolean | undefined} onChange={(v) => set(key, v)} />
              </div>
            ))}
          </div>
        )}

        {/* Step 4: Medical History */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-gray-800">Medical History</h2>
            {([
              ['family_diabetes', 'Family history of diabetes?'],
              ['family_hypertension', 'Family history of hypertension?'],
              ['previously_diagnosed', 'Previously diagnosed with either condition?'],
            ] as [keyof AssessmentPayload, string][]).map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                <YesNo value={local[key] as boolean | undefined} onChange={(v) => set(key, v)} />
              </div>
            ))}
          </div>
        )}

        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button onClick={handleBack}
              className="flex-1 border-2 border-gray-300 text-gray-600 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition">
              Back
            </button>
          )}
          {step < 4 ? (
            <button onClick={handleNext}
              className="flex-1 bg-teal-700 text-white font-bold py-2.5 rounded-lg hover:bg-teal-800 transition">
              Next
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 bg-teal-700 text-white font-bold py-2.5 rounded-lg hover:bg-teal-800 disabled:opacity-50 transition">
              {loading ? 'Analysing…' : 'Get My Results'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
