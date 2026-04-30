import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login, guestLogin } from '../api/auth';
import { useAssessmentStore } from '../store/useAssessmentStore';

export default function Auth() {
  const [tab, setTab] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const store = useAssessmentStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = tab === 'register'
        ? await register({ name, email, password })
        : await login({ email, password });
      store.setAuth(data.user, data.access, data.refresh);
      navigate('/consent');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    try {
      const data = await guestLogin();
      store.setAuth(data.user, data.access, data.refresh);
      navigate('/consent');
    } catch {
      setError('Could not create guest session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-teal-700 text-center mb-6">Waazi</h1>

        {/* Tabs */}
        <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-6">
          {(['register', 'login'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-medium transition
                ${tab === t ? 'bg-teal-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              {t === 'register' ? 'Sign Up' : 'Log In'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <input
              type="text" placeholder="Full Name" value={name}
              onChange={(e) => setName(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
          )}
          <input
            type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
          <input
            type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-teal-700 text-white font-bold py-2.5 rounded-lg hover:bg-teal-800 disabled:opacity-50 transition">
            {loading ? 'Please wait…' : tab === 'register' ? 'Create Account' : 'Log In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={handleGuest} disabled={loading}
            className="text-sm text-teal-700 underline hover:text-teal-900 disabled:opacity-50">
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
