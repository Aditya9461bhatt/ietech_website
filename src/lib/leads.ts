import { site } from './content';

/**
 * Whether lead capture (Firebase Auth + Firestore) is available in this build.
 * Mirrors the check in lib/firebase.ts but reads the env directly so callers
 * can branch without pulling the Firebase chunk into their bundle.
 */
export const leadsConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID,
);

/**
 * Last-resort lead path: open a prefilled email draft to the primary contact
 * in the visitor's own mail app. Used when Firestore is unconfigured or down,
 * so a lead is never silently dropped.
 */
export function openLeadEmailDraft(details: { email?: string; phone?: string } = {}) {
  const to = site.contacts[0]?.email ?? 'ceojayraj@ietech.ai';
  const subject = 'Inquiry from ietech.ai';
  const lines = [
    'Hi, I would like to talk about i.e tech solutions for my business.',
    details.email ? `My email: ${details.email}` : '',
    details.phone ? `My phone: ${details.phone}` : '',
  ].filter(Boolean);
  const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  window.location.href = href;
}
