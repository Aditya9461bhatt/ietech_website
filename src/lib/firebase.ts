import { initializeApp, type FirebaseApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, type Auth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// A build without VITE_FIREBASE_* env vars must not take the whole site down:
// getAuth() throws auth/invalid-api-key at module scope, which blanks every page
// (and makes the prerenderer bake empty shells). Initialize only when configured
// and let Firebase-backed features fall back to their empty states.
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  authInstance = getAuth(app);
  // This project's Firestore is the NAMED database "default" (Enterprise
  // edition, freeTier: true) — the implicit "(default)" database does not
  // exist, and targeting it surfaces as a bogus "requires billing" error.
  dbInstance = getFirestore(app, 'default');
  // Local sandbox: `VITE_FIREBASE_EMULATOR=true npm run dev` after
  // `firebase emulators:start` — dev-only, never active in production builds.
  if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_EMULATOR === 'true') {
    connectAuthEmulator(authInstance, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(dbInstance, 'localhost', 8080);
    console.info('[firebase] using local Auth/Firestore emulators');
  }
} else {
  console.warn('[firebase] VITE_FIREBASE_* env vars are missing — auth, contact forms, and CMS content are disabled for this build.');
}

export const auth = authInstance as Auth;
export const db = dbInstance as Firestore;
