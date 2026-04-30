import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAssessmentStore } from './store/useAssessmentStore';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Consent from './pages/Consent';
import Questionnaire from './pages/Questionnaire';
import Results from './pages/Results';

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const token = useAssessmentStore((s) => s.accessToken);
  return token ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<Landing />} />
        <Route path="/auth"          element={<Auth />} />
        <Route path="/consent"       element={<ProtectedRoute><Consent /></ProtectedRoute>} />
        <Route path="/questionnaire" element={<ProtectedRoute><Questionnaire /></ProtectedRoute>} />
        <Route path="/results"       element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
