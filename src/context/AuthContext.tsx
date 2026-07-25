import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Firebase is imported lazily so the ~150KB gz vendor chunk stays off the
  // landing page's critical path — only admin routes and lead capture need it.
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    (async () => {
      const { auth, isFirebaseConfigured } = await import('../lib/firebase');
      if (!isFirebaseConfigured) {
        setIsLoading(false);
        return;
      }
      const { onAuthStateChanged } = await import('firebase/auth');
      if (cancelled) return;
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setIsLoading(false);
      });
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const signOut = async () => {
    const { auth, isFirebaseConfigured } = await import('../lib/firebase');
    if (!isFirebaseConfigured) return;
    const { signOut: firebaseSignOut } = await import('firebase/auth');
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
