import React from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Using HashRouter to avoid 404 on static host refreshes (no server-side rewrites needed)
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './src/context/auth';
import axios from 'axios';

import Home from './src/pages/Home';
import StudentSignup from './src/pages/StudentSignup';
import FindMentor from './src/pages/FindMentor';
import BecomeMentor from './src/pages/BecomeMentor';
import JourneyTogether from './src/pages/JourneyTogether';
import JourneyTracker from './src/pages/JourneyTracker';
import BookSession from './src/pages/BookSession';
import SignIn from './src/pages/SignIn';
import Profile from './src/pages/Profile';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const [checking, setChecking] = React.useState(true);
  const [allowed, setAllowed] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const check = async () => {
      if (loading) return;
      if (!user) { setAllowed(false); setChecking(false); return; }
      try {
        const token = await user.getIdToken();
        const res = await axios.get(`${BACKEND}/api/students/status`, { headers: { Authorization: `Bearer ${token}` } });
        const ok = !!res.data?.ok;
        const hasProfile = !!res.data?.hasProfile;
        const emailVerified = !!res.data?.emailVerified;
        if (mounted) setAllowed(ok && hasProfile && emailVerified);
      } catch {
        if (mounted) setAllowed(false);
      } finally {
        if (mounted) setChecking(false);
      }
    };
    check();
    return () => { mounted = false; };
  }, [user, loading]);

  if (loading || checking) return <div className="p-6 text-center text-slate-500">Loading…</div>;
  return allowed ? <>{children}</> : <Navigate to="/student-signup" replace />;
};

const App: React.FC = () => {
  return (
    <Theme appearance="inherit" radius="large" scaling="100%">
      <AuthProvider>
        <Router>
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/student-signup" element={<StudentSignup />} />
              <Route path="/signin" element={<SignIn />} />
              {/* <Route path="/profile" element={<Profile /> */}
              <Route path="/find-mentor" element={<FindMentor />} />
              <Route path="/become-mentor" element={<BecomeMentor} />
              <Route path="/journey-together" element={<JourneyTogether />} />
              <Route path="/journey-tracker" element={<JourneyTracker />} />
              <Route path="/mentor/:id/book" element={<BookSession />} />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              newestOnTop
              closeOnClick
              pauseOnHover
            />
          </main>
        </Router>
      </AuthProvider>
    </Theme>
  );
}

export default App;
