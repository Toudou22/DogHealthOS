import * as React from 'react';
import { useState, useEffect } from 'react';
import { PawPrint, Sparkles, Shield, User as UserIcon, LogIn, LogOut, Sun, Moon, X, Mail, Lock, CheckCircle, Crown, Headphones, Mic } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { logUserAction } from '../utils/firebaseHelper';

interface NavbarProps {
  onOpenPricing: () => void;
  onOpenBreederSuite?: () => void;
  onOpenAudioPassport?: () => void;
  onToggleAdminConsole: () => void;
  isAdminConsoleOpen: boolean;
  onOpenVaultModal?: () => void;
  selectedBreedName?: string | null;
}

export default function Navbar({ onOpenPricing, onOpenBreederSuite, onOpenAudioPassport, onToggleAdminConsole, isAdminConsoleOpen, onOpenVaultModal, selectedBreedName }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  // Theme State
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme-preference');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Auth Form State
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme-preference', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme-preference', 'light');
    }
  }, [isDark]);

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

  // Root Admin verification with localStorage persistence
  const [isAdminOverridden, setIsAdminOverridden] = useState<boolean>(() => {
    return typeof window !== 'undefined' && localStorage.getItem('doghealthos_god_mode') === 'true';
  });

  const isUserAdmin = (user?.email?.toLowerCase() === 'anthonytoudou@gmail.com') || isAdminOverridden;

  const handleActivateGodMode = () => {
    localStorage.setItem('doghealthos_god_mode', 'true');
    setIsAdminOverridden(true);
    setSuccess('👑 God Mode Privileges Active for anthonytoudou@gmail.com!');
    setTimeout(() => {
      setSuccess('');
    }, 2500);
  };

  const handleRevokeGodMode = () => {
    localStorage.removeItem('doghealthos_god_mode');
    setIsAdminOverridden(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setSuccess(`Welcome, ${result.user.email}!`);
      logUserAction('Google Sign In Success', { email: result.user.email });
      setTimeout(() => {
        setIsAuthOpen(false);
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
          setIsAuthOpen(false);
          setSuccess('');
        }, 1500);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        setSuccess('Account created successfully!');
        logUserAction('Email Registration Success', { email: result.user.email });
        setTimeout(() => {
          setIsAuthOpen(false);
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
      handleRevokeGodMode();
      await signOut(auth);
      logUserAction('User Logout', { email: emailCached });
      setIsAuthOpen(false);
    } catch (err: any) {
      console.error('Signout failed', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F5F0E8]/95 dark:bg-[#181614]/95 backdrop-blur-md border-b-[2.5px] border-[#1A1A1A]/15 dark:border-[#F0ECE6]/15 transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        
        {/* Brand Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FF6B4A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] flex items-center justify-center shadow-[2.5px_2.5px_0_#1A1A1A] dark:shadow-[2.5px_2.5px_0_#F0ECE6] shrink-0">
            <PawPrint className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-base sm:text-lg tracking-tight text-[#1A1A1A] dark:text-[#F0ECE6] leading-none">
                DogHealthOS<span className="text-[#FF6B4A]">™</span>
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-[#FF6B4A]/10 text-[#FF6B4A] text-[0.62rem] font-mono font-black uppercase tracking-wider border border-[#FF6B4A]/25">
                LIFE EXPECTANCY TOOL
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar py-0.5">
          
          {/* Spoken Clinical Plans & Audio Passports Direct Launch (Microphone Icon) */}
          {onOpenAudioPassport && (
            <button
              onClick={onOpenAudioPassport}
              className={`h-9 sm:h-10 px-2.5 sm:px-3.5 text-[0.72rem] sm:text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[2.5px_2.5px_0_#1A1A1A] dark:shadow-[2.5px_2.5px_0_#F0ECE6] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                selectedBreedName
                  ? 'bg-[#2D8C6F] hover:bg-[#23775d] text-white ring-2 ring-emerald-400/40'
                  : 'bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 opacity-90'
              }`}
              title={selectedBreedName ? `🎙️ Listen to ${selectedBreedName}'s Spoken Clinical Plan` : "🎙️ Spoken Clinical Plan (Select breed and age first to generate)"}
            >
              <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-200 shrink-0 animate-pulse" />
              <span className="hidden md:inline">
                {selectedBreedName ? `Spoken Plan: ${selectedBreedName}` : 'Spoken Clinical Plan'}
              </span>
              <span className="md:hidden inline">Spoken Plan</span>
            </button>
          )}

          {/* Breeder Pro Suite Direct Launch */}
          {onOpenBreederSuite && (
            <button
              onClick={onOpenBreederSuite}
              className="h-9 sm:h-10 px-3 sm:px-3.5 text-[0.72rem] sm:text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-amber-500 hover:bg-amber-400 text-[#1A1A1A] shadow-[2.5px_2.5px_0_#1A1A1A] dark:shadow-[2.5px_2.5px_0_#F0ECE6] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              title="Open Professional Breeder Suite"
            >
              <Crown className="w-3.5 h-3.5 text-[#1A1A1A] shrink-0" />
              <span className="hidden sm:inline">Breeder Suite</span>
              <span className="sm:hidden">Breeder</span>
            </button>
          )}

          {/* Medical Vault Security Button */}
          {onOpenVaultModal && (
            <button
              type="button"
              onClick={onOpenVaultModal}
              className="h-9 sm:h-10 px-2.5 sm:px-3 text-[0.72rem] sm:text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-[#1A1A1A] dark:text-[#F0ECE6] shadow-[2.5px_2.5px_0_#1A1A1A] dark:shadow-[2.5px_2.5px_0_#F0ECE6] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              title="Medical Vault PIN & Biometric Protection"
            >
              <Lock className="w-3.5 h-3.5 text-[#FF6B4A] shrink-0" />
              <span className="hidden sm:inline">Medical Vault</span>
            </button>
          )}

          {/* Pricing & Plans Button */}
          <button
            onClick={onOpenPricing}
            className="h-9 sm:h-10 px-3 sm:px-3.5 text-[0.72rem] sm:text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-[#E5A836] hover:bg-[#d99b28] text-white shadow-[2.5px_2.5px_0_#1A1A1A] dark:shadow-[2.5px_2.5px_0_#F0ECE6] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            title="View Subscription Pricing Tiers"
          >
            <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="hidden sm:inline">Pricing & Plans</span>
            <span className="sm:hidden">Pricing</span>
          </button>

          {/* Admin God Console Toggle - ALWAYS ACCESSIBLE */}
          <button
            onClick={() => {
              if (isUserAdmin) {
                onToggleAdminConsole();
              } else {
                handleActivateGodMode();
                onToggleAdminConsole();
              }
            }}
            className={`h-9 sm:h-10 px-3 sm:px-3.5 text-[0.72rem] sm:text-xs font-mono font-black uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[2.5px_2.5px_0_#1A1A1A] cursor-pointer transition-all hover:translate-y-[-1px] flex items-center gap-1.5 shrink-0 text-white ${
              isAdminConsoleOpen
                ? 'bg-rose-500 hover:bg-rose-600'
                : isUserAdmin
                ? 'bg-emerald-600 hover:bg-emerald-500 ring-2 ring-emerald-400/40'
                : 'bg-stone-800 hover:bg-stone-700'
            }`}
            title="Open Administrative God Mode Dashboard (anthonytoudou@gmail.com)"
          >
            <Shield className={`w-3.5 h-3.5 shrink-0 ${isAdminConsoleOpen ? 'animate-bounce text-white' : 'animate-pulse text-amber-300'}`} />
            <span className="font-bold">
              {isAdminConsoleOpen ? 'Close God Mode' : 'God Mode'}
            </span>
            {isUserAdmin && (
              <span className="hidden sm:inline-block px-1.5 py-0.5 bg-amber-400 text-stone-900 text-[0.58rem] font-black rounded uppercase">
                Admin
              </span>
            )}
          </button>

          {/* User Account / Exit Door Icon Button */}
          <div className="relative">
            <button
              onClick={() => setIsAuthOpen(!isAuthOpen)}
              className={`h-9 sm:h-10 px-3 sm:px-3.5 text-[0.72rem] sm:text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] dark:border-[#F0ECE6] cursor-pointer flex items-center gap-1.5 shadow-[2.5px_2.5px_0_#1A1A1A] dark:shadow-[2.5px_2.5px_0_#F0ECE6] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all shrink-0 ${
                user || isUserAdmin
                  ? 'bg-amber-500/20 text-[#1A1A1A] dark:text-[#F0ECE6] border-amber-600/40'
                  : 'bg-[#FF6B4A] text-white hover:bg-[#FF6B4A]/90'
              }`}
              title={user ? `Account: ${user.email}` : isUserAdmin ? 'God Mode Admin Active' : 'Sign In or Access Account'}
            >
              {user ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <UserIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline max-w-[95px] truncate">
                    {isUserAdmin ? '👑 Admin' : user.email?.split('@')[0]}
                  </span>
                </>
              ) : isUserAdmin ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="hidden sm:inline">👑 Admin</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden xs:inline">Sign In</span>
                </>
              )}
            </button>

            {/* Auth Dropdown Panel - Generous Width, High Contrast, Gentle on Eyes */}
            {isAuthOpen && (
              <>
                {/* Backdrop overlay for quick dismissal */}
                <div 
                  className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]" 
                  onClick={() => setIsAuthOpen(false)} 
                />

                <div className="absolute right-0 mt-3 w-[480px] sm:w-[520px] max-w-[calc(100vw-1.5rem)] bg-white dark:bg-[#1E1C18] border-[3px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[8px_8px_0_#1A1A1A] dark:shadow-[8px_8px_0_#F0ECE6] rounded-2xl p-6 sm:p-7 z-50 text-[#1A1A1A] dark:text-[#F0ECE6] animate-[fadeIn_0.15s_ease-out] max-h-[85vh] overflow-y-auto">
                  
                  <div className="flex justify-between items-center mb-5 border-b-2 border-stone-200 dark:border-stone-800 pb-3">
                    <div>
                      <h3 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#FF6B4A]" />
                        {user || isUserAdmin ? 'Account & Control Ledger' : 'Companion Account Desk'}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                        {user || isUserAdmin ? 'Administrative privileges, system status & credentials' : 'Sign in to access personalized dossiers & God Mode'}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAuthOpen(false)}
                      className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl cursor-pointer text-stone-500 hover:text-stone-900 dark:hover:text-white"
                      title="Close window"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {user || isUserAdmin ? (
                    <div className="space-y-4">
                      {/* User identity card */}
                      <div className="p-4 bg-stone-50 dark:bg-[#26221E] rounded-xl border-2 border-[#1A1A1A] dark:border-[#F0ECE6]">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-[#FF6B4A] flex items-center justify-center text-white text-sm font-black font-mono shadow-[1.5px_1.5px_0_#1A1A1A]">
                            {(user?.email?.[0] || 'A').toUpperCase()}
                          </div>
                          <div className="overflow-hidden flex-1">
                            <p className="text-xs font-black font-mono tracking-wider text-stone-400 uppercase leading-none">Registered Email</p>
                            <p className="text-sm font-black truncate text-[#1A1A1A] dark:text-[#F0ECE6] mt-0.5">
                              {user?.email || 'anthonytoudou@gmail.com'}
                            </p>
                          </div>
                        </div>

                        {isUserAdmin ? (
                          <div className="mt-3 p-3 bg-amber-500/15 border-2 border-[#E5A836] text-[#E5A836] dark:text-amber-400 rounded-xl flex items-center justify-between gap-2 animate-pulse">
                            <div className="flex items-center gap-2">
                              <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                              <span className="text-xs font-mono font-black uppercase tracking-wider">
                                👑 GOD MODE PRIVILEGES ACTIVE
                              </span>
                            </div>
                            <span className="text-[0.65rem] font-bold px-2 py-0.5 bg-amber-500 text-stone-900 rounded font-mono">
                              ROOT ADMIN
                            </span>
                          </div>
                        ) : (
                          <div className="mt-3 p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider rounded-lg flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                            Verified Companion Account
                          </div>
                        )}
                      </div>

                      {/* Primary God Mode Action Button */}
                      <button
                        onClick={() => {
                          setIsAuthOpen(false);
                          if (!isUserAdmin) handleActivateGodMode();
                          onToggleAdminConsole();
                        }}
                        className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black border-2 border-[#1A1A1A] rounded-xl shadow-[3px_3px_0_#1A1A1A] hover:translate-y-[-1px] text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 cursor-pointer transition-all"
                      >
                        <Shield className="w-4 h-4 shrink-0" />
                        {isAdminConsoleOpen ? 'Close God Mode Console' : 'Open God Mode Administrative Dashboard'}
                      </button>

                      {/* Pricing Tier Direct Button */}
                      <button
                        onClick={() => {
                          setIsAuthOpen(false);
                          onOpenPricing();
                        }}
                        className="w-full py-2.5 px-4 bg-[#E5A836] hover:bg-[#d99b28] text-white font-bold border-2 border-[#1A1A1A] rounded-xl shadow-[2.5px_2.5px_0_#1A1A1A] hover:translate-y-[-1px] text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        Explore Pricing & Breeder Tiers
                      </button>

                      {/* Sign Out Button */}
                      <button
                        onClick={handleSignOut}
                        className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 font-bold border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Quick Root Admin Unlock Banner */}
                      <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/15 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-stone-900 shrink-0 font-bold shadow-[1.5px_1.5px_0_#1A1A1A]">
                            <Crown className="w-5 h-5 text-stone-900" />
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase text-[#1A1A1A] dark:text-[#F0ECE6]">Root Administrator Instant Unlock</p>
                            <p className="text-[0.7rem] font-mono text-stone-500 dark:text-stone-400">anthonytoudou@gmail.com</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            handleActivateGodMode();
                            setIsAuthOpen(false);
                            onToggleAdminConsole();
                          }}
                          className="w-full sm:w-auto px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-black border-2 border-[#1A1A1A] rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-[2px_2px_0_#1A1A1A] hover:translate-y-[-1px] transition-all whitespace-nowrap"
                        >
                          ⚡ 1-Click God Mode
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 bg-[#1A1A1A]/5 dark:bg-white/5 p-1 rounded-xl">
                        <button
                          onClick={() => setAuthTab('login')}
                          className={`py-2 text-xs font-black uppercase tracking-wider rounded-lg cursor-pointer transition-all ${
                            authTab === 'login' ? 'bg-white dark:bg-[#26221E] shadow-sm text-[#1A1A1A] dark:text-[#F0ECE6]' : 'text-stone-500'
                          }`}
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => setAuthTab('register')}
                          className={`py-2 text-xs font-black uppercase tracking-wider rounded-lg cursor-pointer transition-all ${
                            authTab === 'register' ? 'bg-white dark:bg-[#26221E] shadow-sm text-[#1A1A1A] dark:text-[#F0ECE6]' : 'text-stone-500'
                          }`}
                        >
                          Create Account
                        </button>
                      </div>

                      {error && (
                        <div className="p-3 bg-red-500/10 border-2 border-red-500 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl uppercase tracking-wider leading-snug">
                          ⚠ {error}
                        </div>
                      )}

                      {success && (
                        <div className="p-3 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl uppercase tracking-wider flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 animate-bounce" />
                          {success}
                        </div>
                      )}

                      <form onSubmit={handleEmailAuth} className="space-y-3.5">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="you@domain.com"
                              className="w-full pl-10 pr-3.5 py-2.5 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-stone-50 dark:bg-[#121110] text-sm font-medium rounded-xl focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                            Access Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full pl-10 pr-3.5 py-2.5 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-stone-50 dark:bg-[#121110] text-sm font-medium rounded-xl focus:outline-none"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 mt-2 bg-[#FF6B4A] hover:bg-[#e85e3e] text-white font-black border-2 border-[#1A1A1A] rounded-xl shadow-[2.5px_2.5px_0_#1A1A1A] hover:translate-y-[-1px] text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                        >
                          <LogIn className="w-4 h-4" />
                          {authTab === 'login' ? 'Confirm Sign In' : 'Register Account'}
                        </button>
                      </form>

                      <div className="flex items-center gap-2 my-2 text-stone-400 text-xs font-bold uppercase tracking-widest justify-center">
                        <span className="h-px bg-[#1A1A1A]/10 dark:bg-white/10 flex-1" />
                        <span>Or Access via</span>
                        <span className="h-px bg-[#1A1A1A]/10 dark:bg-white/10 flex-1" />
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full py-2.5 bg-white hover:bg-neutral-50 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[#1A1A1A] dark:text-[#F0ECE6] font-bold border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[2.5px_2.5px_0_#1A1A1A] dark:shadow-[2.5px_2.5px_0_#F0ECE6]"
                      >
                        <LogIn className="w-4 h-4 text-[#FF6B4A]" />
                        Google Single Sign-on
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-white/70 dark:bg-[#1E1C18]/80 backdrop-blur-md cursor-pointer flex items-center justify-center shadow-[2.5px_2.5px_0_#1A1A1A] dark:shadow-[2.5px_2.5px_0_#F0ECE6] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all text-[#1A1A1A] dark:text-[#F0ECE6] shrink-0"
            aria-label="Toggle visual contrast theme"
            title="Toggle Light/Dark Theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-[#E5A836] animate-pulse" />
            ) : (
              <Moon className="w-4 h-4 text-[#B87333]" />
            )}
          </button>

        </div>
      </div>
    </header>
  );
}
