import React from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Using HashRouter to avoid 404 on static host refreshes (no server-side rewrites needed)
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './src/pages/Home';
import StudentSignup from './src/pages/StudentSignup';
import FindMentor from './src/pages/FindMentor';
import BecomeMentor from './src/pages/BecomeMentor';
import JourneyTogether from './src/pages/JourneyTogether';
import JourneyTracker from './src/pages/JourneyTracker';
import BookSession from './src/pages/BookSession';
import NotFound from './src/pages/NotFound';

const App: React.FC = () => {
  return (
    <Theme appearance="inherit" radius="large" scaling="100%">
      <Router>
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/student-signup" element={<StudentSignup />} />
            <Route path="/find-mentor" element={<FindMentor />} />
            <Route path="/become-mentor" element={<BecomeMentor />} />
            <Route path="/journey-together" element={<JourneyTogether />} />
            <Route path="/journey-tracker" element={<JourneyTracker />} />
            <Route path="/mentor/:id/book" element={<BookSession />} />
            <Route path="*" element={<NotFound />} />
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
    </Theme>
  );
}

export default App;
