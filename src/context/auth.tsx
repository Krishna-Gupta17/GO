import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  EmailAuthProvider,
  linkWithCredential,
  updatePassword,
  type User,
} from 'firebase/auth';
import axios from 'axios';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

interface AuthContextShape {
  user: User | null;
  loading: boolean;
  emailVerified: boolean;
  sendMagicLink: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendResetPassword: (email: string) => Promise<void>;
  linkEmailPassword: (email: string, password: string) => Promise<void>;
  setUserPassword: (newPassword: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextShape>({
  user: null,
  loading: true,
  emailVerified: false,
  sendMagicLink: async () => {},
  sendVerificationEmail: async () => {},
  signInWithEmailPassword: async () => {},
  signInWithGoogle: async () => {},
  sendResetPassword: async () => {},
  linkEmailPassword: async () => {},
  setUserPassword: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setEmailVerified(!!u?.emailVerified);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Helper to read query params both from the URL and from the hash fragment (for hash routers)
  const getQueryParam = (name: string): string | null => {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has(name)) return url.searchParams.get(name);
      const hash = window.location.hash || '';
      const idx = hash.indexOf('?');
      if (idx >= 0) {
        const params = new URLSearchParams(hash.substring(idx + 1));
        if (params.has(name)) return params.get(name);
      }
    } catch {}
    return null;
  };

  // Handle magic sign-in link completion (kept for email link sign-in), not for email verification
  useEffect(() => {
    const href = window.location.href;
    // Detect if the magic link params are present in the hash fragment as '?...'
    const hash = window.location.hash || '';
    let reconstructedLink: string | null = null;
    if (!isSignInWithEmailLink(auth, href)) {
      // Try to reconstruct from hash query (e.g., /route?apiKey=...&oobCode=...)
      const qIndex = hash.indexOf('?');
      if (qIndex >= 0) {
        const qs = hash.substring(qIndex + 1);
        const params = new URLSearchParams(qs);
        if (params.has('oobCode') && params.has('apiKey')) {
          reconstructedLink = `${window.location.origin}/?${qs}`;
        }
      }
    }

    if (isSignInWithEmailLink(auth, href) || (reconstructedLink && isSignInWithEmailLink(auth, reconstructedLink))) {
      // Try localStorage first, then fallback to a query param, then prompt
      let email = window.localStorage.getItem('pendingEmail');
      if (!email) {
        email = getQueryParam('loginEmail') || undefined as any;
      }
      if (!email) {
        email = window.prompt('Please confirm your email address to complete sign-in') || undefined as any;
      }
      if (!email) return; // cannot complete without email

      const linkToUse = reconstructedLink || href;
      signInWithEmailLink(auth, email, linkToUse)
        .then(async () => {
          window.localStorage.removeItem('pendingEmail');
          const idToken = await auth.currentUser?.getIdToken();
          if (idToken) {
            try { await axios.post(`${BACKEND}/api/students/verify`, { idToken }); } catch {}
          }
          setEmailVerified(true);
        })
        .catch(console.error);
    }
  }, []);

  const sendMagicLink = async (email: string) => {
    // Put the email into the continue URL so we can recover it on another device/browser
    const cont = new URL(window.location.origin + '/student-signup');
    cont.searchParams.set('loginEmail', email);
    const actionCodeSettings = {
      url: cont.toString(),
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('pendingEmail', email);
  };

  const signInWithEmailPassword = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const sendVerificationEmail = async () => {
    if (!auth.currentUser) throw new Error('Not signed in');
    // Send a standard Firebase-hosted verification link (no in-app handling, no redirect)
    // This will show the Firebase confirmation page when the user clicks the link.
    await sendEmailVerification(auth.currentUser);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const sendResetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const linkEmailPassword = async (email: string, password: string) => {
    if (!auth.currentUser) throw new Error('Not signed in');
    const cred = EmailAuthProvider.credential(email, password);
    await linkWithCredential(auth.currentUser, cred);
    setEmailVerified(true);
  };

  const setUserPassword = async (newPassword: string) => {
    if (!auth.currentUser) throw new Error('Not signed in');
    await updatePassword(auth.currentUser, newPassword);
  };

  const doSignOut = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      emailVerified,
      sendMagicLink,
      sendVerificationEmail,
      signInWithEmailPassword,
      signInWithGoogle,
      sendResetPassword,
      linkEmailPassword,
      setUserPassword,
      signOut: doSignOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { auth };