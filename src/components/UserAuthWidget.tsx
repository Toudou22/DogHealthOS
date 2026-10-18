import * as React from 'react';
import { useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { LogIn, LogOut, User as UserIcon, Shield, Chrome, X, Mail, Lock, Sparkles, CheckCircle } from 'lucide-react';
import { logUserAction } from '../utils/firebaseHelper';

interface UserAuthWidgetProps {
  onToggleAdminConsole: () => void;
  isAdminConsoleOpen: boolean;
  onOpenPricing?: () => void;
}

export default function UserAuthWidget({ onToggleAdminConsole, isAdminConsoleOpen, onOpenPricing }: UserAuthWidgetProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  
  // Form State
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        logUserAction('User Login Session', {
          email: currentUser.email,
          uid: currentUser.uid,
          providerId: currentUser.providerData[0]?.providerId
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const isUserAdmin = user?.email?.toLowerCase() === 'anthonytoudou@gmail.com';

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setSuccess(`Welcome, ${result.user.email}!`);
      logUserAction('Google Sign In Success', { email: result.user.email });
      setTimeout(() => {
        setIsOpen(false);
        setSuccess('');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Google Auth failed');
      logUserAction('Google Sign In Failed', { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (authTab === 'login') {
        const result = await signInWithEmailAndPassword(auth, email, password);
        setSuccess('Logged in successfully!');
        logUserAction('Email Sign In Success', { email: result.user.email });
        setTimeout(() => {
          setIsOpen(false);
          setSuccess('');
        }, 1500);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        setSuccess('Account created successfully!');
        logUserAction('Email Registration Success', { email: result.user.email });
        setTimeout(() => {
          setIsOpen(false);
          setSuccess('');
        }, 1500);
      }
    } catch (err: any) {
      let friendlyError = err.message;
      if (err.code === 'auth/wrong-password') friendlyError = 'Incorrect password.';
      if (err.code === 'auth/user-not-found') friendlyError = 'No account found with this email.';
      if (err.code === 'auth/email-already-in-use') friendlyError = 'Email already in use.';
      setError(friendlyError);
      logUserAction('Auth Form Error', { tab: authTab, email, code: err.code, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const emailCached = user?.email;
      await signOut(auth);
      logUserAction('User Logout', { email: emailCached });
      setIsOpen(false);
    } catch (err: any) {
      console.error('Signout failed', err);
    }
  };

  return (
    <div className="fixed top-4 right-18 z-40">
      {/* Floating Status Button on Top Right */}
      <div className="flex items-center gap-2">
        {onOpenPricing && (
          <button
            onClick={onOpenPricing}
            className="h-11 px-3.5 text-xs font-black uppercase tracking-wider rounded-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] bg-[#E5A836] hover:bg-[#d99b28] text-white shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center gap-1.5"
            title="View Subscription Pricing Tiers"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Pricing & Plans</span>
            <span className="sm:hidden">Pricing</span>
          </button>
        )}

        {user && isUserAdmin && (
          <button
            onClick={onToggleAdminConsole}
            className={`px-3 py-2 text-[0.68rem] font-mono font-black uppercase tracking-widest rounded-xl border-2 shadow-[2px_2px_0_#1A1A1A] dark:shadow-[2px_2px_0_#F0ECE6] cursor-pointer transition-all hover:translate-y-[-1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1.5 ${
              isAdminConsoleOpen
                ? 'bg-rose-500 border-[#1A1A1A] text-white'
                : 'bg-emerald-500 border-[#1A1A1A] text-white'
            }`}
          >
            <Shield className={`w-3.5 h-3.5 ${isAdminConsoleOpen ? 'animate-bounce' : 'animate-pulse'}`} />
            <span>{isAdminConsoleOpen ? 'Close God Console' : 'Open God Console'}</span>
          </button>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-11 px-4 text-xs font-black uppercase tracking-wider rounded-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] cursor-pointer flex items-center gap-2 shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all ${
            user
              ? isUserAdmin
                ? 'bg-[#E5A836]/20 text-[#1A1A1A] dark:text-[#F0ECE6]'
                : 'bg-emerald-500/10 text-[#1A1A1A] dark:text-[#F0ECE6]'
              : 'bg-[#FF6B4A] text-white hover:bg-[#FF6B4A]/90'
          }`}
        >
          {user ? (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <UserIcon className="w-4 h-4 shrink-0" />
              <span className="max-w-[100px] truncate">
                {isUserAdmin ? '👑 Admin' : user.email?.split('@')[0]}
              </span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 shrink-0" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </div>

      {/* Dropdown Menu / Login Form Dialog */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#1C1A18] border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[6px_6px_0_#1A1A1A] dark:shadow-[6px_6px_0_#F0ECE6] rounded-2xl p-5 z-50 text-[#1A1A1A] dark:text-[#F0ECE6] animate-[fadeIn_0.2s_ease-out]">
          
          <div className="flex justify-between items-center mb-4 border-b-2 border-dashed border-[#1A1A1A]/10 dark:border-white/10 pb-2">
            <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF6B4A]" />
              {user ? 'Profile Control Ledger' : 'Account Desk'}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {user ? (
            /* Logged In View */
            <div className="space-y-4">
              <div className="p-3 bg-stone-50 dark:bg-[#2A2622] rounded-xl border-2 border-[#1A1A1A] dark:border-[#F0ECE6]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-[#FF6B4A] flex items-center justify-center text-white text-xs font-black font-mono">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[0.68rem] font-black font-mono tracking-wider text-stone-400 uppercase leading-none">Registered Email</p>
                    <p className="text-xs font-black truncate text-[#1A1A1A] dark:text-[#F0ECE6]">{user.email}</p>
                  </div>
                </div>

                {isUserAdmin ? (
                  <div className="mt-3 px-2 py-1 bg-amber-500/15 border-2 border-[#E5A836] text-[#E5A836] text-[0.65rem] font-mono font-black uppercase tracking-widest text-center rounded-lg animate-pulse">
                    ⚡ 👑 GOD MODE PRIVILEGES ACTIVE 👑 ⚡
                  </div>
                ) : (
                  <div className="mt-3 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[0.65rem] font-mono font-bold uppercase tracking-wider text-center rounded-lg">
                    ✓ Verified Companion Account
                  </div>
                )}
              </div>

              {onOpenPricing && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenPricing();
                  }}
                  className="w-full py-2.5 bg-[#E5A836] hover:bg-[#d99b28] text-white font-bold border-2 border-[#1A1A1A] rounded-xl shadow-[3px_3px_0_#1A1A1A] hover:translate-y-[-1px] text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Explore Subscription Plans & Tiers
                </button>
              )}

              {isUserAdmin && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onToggleAdminConsole();
                  }}
                  className="w-full py-2.5 bg-emerald-500 text-white font-bold border-2 border-[#1A1A1A] rounded-xl shadow-[3px_3px_0_#1A1A1A] hover:translate-y-[-1px] text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Shield className="w-4 h-4" />
                  {isAdminConsoleOpen ? 'Close God Dashboard' : 'Review Logs & Feedback'}
                </button>
              )}

              <button
                onClick={handleSignOut}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 font-bold border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            /* Authentication Form */
            <div className="space-y-4">
              {/* Tab selector */}
              <div className="grid grid-cols-2 gap-1.5 bg-[#1A1A1A]/5 p-1 rounded-xl">
                <button
                  onClick={() => setAuthTab('login')}
                  className={`py-1.5 text-[0.68rem] font-black uppercase tracking-wider rounded-lg cursor-pointer ${
                    authTab === 'login' ? 'bg-white dark:bg-[#1E1C18] shadow-sm text-[#1A1A1A] dark:text-[#F0ECE6]' : 'text-stone-500'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setAuthTab('register')}
                  className={`py-1.5 text-[0.68rem] font-black uppercase tracking-wider rounded-lg cursor-pointer ${
                    authTab === 'register' ? 'bg-white dark:bg-[#1E1C18] shadow-sm text-[#1A1A1A] dark:text-[#F0ECE6]' : 'text-stone-500'
                  }`}
                >
                  Register
                </button>
              </div>

              {error && (
                <div className="p-2.5 bg-red-500/10 border-2 border-red-500 text-red-600 dark:text-red-400 text-[0.68rem] font-bold rounded-lg uppercase tracking-wider leading-snug">
                  ⚠ {error}
                </div>
              )}

              {success && (
                <div className="p-2.5 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 text-[0.68rem] font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 animate-bounce" />
                  {success}
                </div>
              )}

              <form onSubmit={handleEmailAuth} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[0.62rem] font-bold uppercase tracking-wider text-[#8A8680]">Email Ledger</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full pl-9 pr-3 py-2 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-stone-50 dark:bg-[#121110] text-xs font-bold rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[0.62rem] font-bold uppercase tracking-wider text-[#8A8680]">Access Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-stone-50 dark:bg-[#121110] text-xs font-bold rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 mt-2 bg-[#FF6B4A] text-white font-bold border-2 border-[#1A1A1A] rounded-xl shadow-[2.5px_2.5px_0_#1A1A1A] hover:translate-y-[-1px] text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  {authTab === 'login' ? 'Confirm Sign In' : 'Register Account'}
                </button>
              </form>

              <div className="flex items-center gap-2 my-2 text-stone-400 text-[0.62rem] font-bold uppercase tracking-widest justify-center">
                <span className="h-px bg-[#1A1A1A]/10 dark:bg-white/10 flex-1" />
                <span>Or Access via</span>
                <span className="h-px bg-[#1A1A1A]/10 dark:bg-white/10 flex-1" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2 bg-white hover:bg-neutral-50 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[#1A1A1A] dark:text-[#F0ECE6] font-bold border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[2.5px_2.5px_0_#1A1A1A] dark:shadow-[2.5px_2.5px_0_#F0ECE6]"
              >
                <Chrome className="w-4 h-4 text-[#FF6B4A]" />
                Google Single Sign-on
              </button>

              <p className="text-[0.6rem] text-[#8A8680] dark:text-[#9A9590] text-center leading-relaxed font-mono">
                Admin test access: Register/login with <strong className="text-amber-500">anthonytoudou@gmail.com</strong> to gain absolute God Mode permissions.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
