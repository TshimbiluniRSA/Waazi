import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-700 to-teal-500 text-white px-6 py-20 text-center">
        <h1 className="text-4xl font-bold max-w-2xl mx-auto leading-tight mb-4">
          Waazi — Know Your Risk for Diabetes &amp; Hypertension
        </h1>
        <p className="text-teal-100 mb-8 text-lg">Private, free, and not a medical diagnosis</p>
        <button
          onClick={() => navigate('/auth')}
          className="bg-white text-teal-700 font-bold px-8 py-3 rounded-full text-lg hover:bg-teal-50 transition">
          Start Free Assessment
        </button>
      </div>

      {/* Trust signals */}
      <div className="max-w-3xl mx-auto px-6 py-12 grid grid-cols-3 gap-6 text-center">
        {[
          { icon: '🔒', label: 'Private & Secure' },
          { icon: '⚕️', label: 'Not a Diagnosis' },
          { icon: '⚡', label: 'Takes 3 Minutes' },
        ].map((t) => (
          <div key={t.label} className="bg-gray-50 rounded-xl p-6">
            <div className="text-3xl mb-2">{t.icon}</div>
            <p className="font-medium text-gray-700">{t.label}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">How It Works</h2>
        <div className="grid grid-cols-3 gap-6 text-center">
          {[
            { step: 1, text: 'Answer a few health questions' },
            { step: 2, text: 'Get your risk score instantly' },
            { step: 3, text: 'Download your personal report' },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-teal-700 text-white flex items-center justify-center text-xl font-bold mb-3">
                {s.step}
              </div>
              <p className="text-gray-600">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
