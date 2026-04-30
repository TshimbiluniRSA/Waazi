import { useNavigate } from 'react-router-dom';
import { useAssessmentStore } from '../store/useAssessmentStore';
import { downloadReport } from '../api/assessment';
import RiskBadge from '../components/RiskBadge';

export default function Results() {
  const store = useAssessmentStore();
  const navigate = useNavigate();
  const result = store.result;

  if (!result) {
    navigate('/');
    return null;
  }

  const handleDownload = async () => {
    const blob = await downloadReport(result.assessment_id);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'waazi-report.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareText = encodeURIComponent(
    `I just completed a health risk assessment!\n` +
    `Diabetes Risk: ${result.diabetes_risk.toUpperCase()}\n` +
    `Hypertension Risk: ${result.hypertension_risk.toUpperCase()}\n` +
    `Check yours at: https://waazi.app`
  );
  const whatsappUrl = `https://wa.me/?text=${shareText}`;

  const handleRetake = () => {
    store.logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">🩺 Your Waazi Health Results</h1>
          <p className="text-sm text-gray-500">BMI: {result.bmi}</p>
        </div>

        {/* Risk Badges */}
        <div className="flex gap-4">
          <RiskBadge type="diabetes" level={result.diabetes_risk} score={result.diabetes_score} />
          <RiskBadge type="hypertension" level={result.hypertension_risk} score={result.hypertension_score} />
        </div>

        {/* AI Summary */}
        {result.ai_summary && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="font-bold text-gray-800 mb-2">Summary</h2>
            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">{result.ai_summary}</p>
          </div>
        )}

        {/* Key Risk Factors */}
        {result.key_risk_factors.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="font-bold text-gray-800 mb-3">Key Risk Factors</h2>
            <ul className="space-y-1">
              {result.key_risk_factors.map((f, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-700 inline-block flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="font-bold text-gray-800">Personalised Recommendations</h2>
          <div className="border-l-4 border-teal-700 pl-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Diabetes</p>
            <p className="text-sm text-gray-700">{result.diabetes_recommendation}</p>
          </div>
          <div className="border-l-4 border-teal-700 pl-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Hypertension</p>
            <p className="text-sm text-gray-700">{result.hypertension_recommendation}</p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="font-bold text-gray-800 mb-3">Recommended Next Steps</h2>
          <ul className="space-y-2">
            {result.next_steps.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pb-8">
          <button onClick={handleDownload}
            className="w-full bg-teal-700 text-white font-bold py-3 rounded-xl hover:bg-teal-800 transition">
            📄 Download PDF Report
          </button>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
            className="w-full bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition text-center block">
            📲 Share on WhatsApp
          </a>
          <button onClick={handleRetake}
            className="w-full border-2 border-gray-300 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition">
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
