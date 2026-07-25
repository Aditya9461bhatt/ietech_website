import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error(err);
      const code = String(err?.code ?? '');
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Incorrect email or password.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts — please wait a few minutes and try again.');
      } else if (code === 'auth/network-request-failed') {
        setError('Network error — check your connection and try again.');
      } else {
        setError('Sign-in failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-2 tracking-tighter text-center">Admin Login</h2>
        <p className="text-neutral-400 mb-8 text-center text-sm">Please sign in to access the CMS.</p>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ietech.com"
              required
              className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 text-sm focus:border-[#3F618C] outline-none transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 text-sm focus:border-[#3F618C] outline-none transition-colors"
            />
          </div>

          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

          <button 
            type="submit"
            disabled={isLoading}
            className="mt-4 flex items-center justify-center gap-3 w-full px-6 py-3 bg-[#3F618C] text-black font-bold uppercase tracking-wider text-xs hover:bg-white transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
