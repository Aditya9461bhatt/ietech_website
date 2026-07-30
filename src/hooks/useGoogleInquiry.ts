import { useState } from 'react';
import { openLeadEmailDraft } from '../lib/leads';

/**
 * Google-popup lead capture shared by Hero, ContactModal, and the use-case
 * pages. Signing in alone stores nothing anyone follows up on — the lead must
 * be written to `contact_submissions`, and success must be tracked per
 * submission (not via global auth state, which would show "Inquiry received"
 * forever to anyone who ever signed in).
 *
 * If the Firestore write fails (e.g. billing disabled on the project) we still
 * hold the email Google just shared — salvage it into a prefilled draft in the
 * visitor's mail app and say so via `notice`, instead of dropping the lead.
 */
export function useGoogleInquiry() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitted, setSubmitted] = useState(false);

  /** Runs the popup + Firestore write. Resolves true only if the lead was stored. */
  const submit = async (): Promise<boolean> => {
    setError('');
    setNotice('');
    setIsLoading(true);
    let email = '';
    let phone = '';
    try {
      const { auth, db, isFirebaseConfigured } = await import('../lib/firebase');
      if (!isFirebaseConfigured) {
        setError('Contact is not configured for this environment yet. Please email us directly.');
        return false;
      }
      const [{ GoogleAuthProvider, signInWithPopup }, { collection, addDoc }] = await Promise.all([
        import('firebase/auth'),
        import('firebase/firestore'),
      ]);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      email = result.user.email ?? '';
      phone = result.user.phoneNumber ?? '';
      if (!email) {
        setError('Google did not share an email address. Please use the contact form instead.');
        return false;
      }
      await addDoc(collection(db, 'contact_submissions'), {
        email,
        phone,
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
      return true;
    } catch (err) {
      const code = typeof err === 'object' && err !== null && 'code' in err
        ? String((err as { code?: string }).code ?? '')
        : '';
      if (code === 'auth/popup-blocked') {
        setError('Google popup was blocked by your browser. Please allow popups and try again.');
      } else if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setError('Google sign-in was closed before completion.');
      } else if (code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for Google sign-in in Firebase.');
      } else if (email) {
        // Sign-in worked; only the write failed. Salvage the lead.
        openLeadEmailDraft({ email, phone });
        setNotice(
          'Our inquiry store is offline right now, so we opened a prefilled email to us in your mail app — press send and we will call you back.',
        );
      } else {
        setError('Something went wrong. Please try again or email us directly.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError('');
    setNotice('');
    setSubmitted(false);
    setIsLoading(false);
  };

  return { isLoading, error, notice, submitted, submit, reset };
}
