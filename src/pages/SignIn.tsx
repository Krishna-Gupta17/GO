import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const { signInWithEmailPassword, sendResetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailPassword(email, password);
      toast.success('Welcome back!');
      navigate('/profile');
    } catch (e:any) {
      toast.error(e?.message || 'Sign-in failed');
    } finally { setLoading(false); }
  };

  const forgot = async () => {
    try {
      await sendResetPassword(email);
      toast.info('Password reset email sent');
    } catch (e:any) {
      toast.error(e?.message || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="py-12">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
          <form onSubmit={submit} className="space-y-4">
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com" className="w-full px-4 py-3 border rounded-lg" required />
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Your password" className="w-full px-4 py-3 border rounded-lg" required />
            <button disabled={loading} className="w-full bg-emerald-600 text-white py-3 rounded-lg">{loading? 'Signing in…':'Sign in'}</button>
          </form>
          <button onClick={forgot} className="mt-3 text-sm text-emerald-700">Forgot password?</button>
          {/* Removed Google sign-in */}
          <p className="mt-6 text-lg text-slate-800">Don’t have an account? <a className="text-emerald-700 font-semibold underline hover:text-emerald-800" href="/#/student-signup">Sign up</a></p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
