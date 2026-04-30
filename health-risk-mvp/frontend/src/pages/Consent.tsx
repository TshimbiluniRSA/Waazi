import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessmentStore } from '../store/useAssessmentStore';

export default function Consent() {
  const [popiaSigned, setPopiaSigned] = useState(false);
  const [disclaimerSigned, setDisclaimerSigned] = useState(false);
  const store = useAssessmentStore();
  const navigate = useNavigate();

  const canContinue = popiaSigned && disclaimerSigned;

  const handleContinue = () => {
    store.setConsent(true);
    store.updateForm({ popia_consent: true, not_medical_advice_acknowledged: true });
    navigate('/questionnaire');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-teal-700 mb-2">Before We Begin</h1>
        <p className="text-gray-500 text-sm mb-6">
          Please read and accept the following before proceeding.
        </p>

        <div className="space-y-4 mb-8">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={popiaSigned}
              onChange={(e) => setPopiaSigned(e.target.checked)}
              className="mt-1 w-4 h-4 accent-teal-700" />
            <span className="text-sm text-gray-700">
              I agree to my data being used for this health assessment in accordance with POPIA
              (Protection of Personal Information Act).
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={disclaimerSigned}
              onChange={(e) => setDisclaimerSigned(e.target.checked)}
              className="mt-1 w-4 h-4 accent-teal-700" />
            <span className="text-sm text-gray-700">
              I understand this is <strong>not a medical diagnosis</strong> or a substitute for
              professional medical advice.
            </span>
          </label>
        </div>

        <button onClick={handleContinue} disabled={!canContinue}
          className="w-full bg-teal-700 text-white font-bold py-2.5 rounded-lg hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed transition">
          Continue
        </button>
      </div>
    </div>
  );
}
