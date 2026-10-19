/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { PawPrint, Calculator, RotateCcw, Sparkles, Mic } from 'lucide-react';
import { Breed } from './types.ts';
import { BREEDS } from './breeds.ts';
import Navbar from './components/Navbar.tsx';
import BreedSearch from './components/BreedSearch.tsx';
import InteractiveTimeline from './components/InteractiveTimeline.tsx';
import UserFeedbackForm from './components/UserFeedbackForm.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { logUserAction } from './utils/firebaseHelper.ts';
import { getBreedImagePath } from './utils/breedImages.ts';

// Dynamically chunked components (code-splitting) for sub-350KB initial route bundle
const ResultsDisplay = React.lazy(() => import('./components/ResultsDisplay.tsx'));
const AICareCenter = React.lazy(() => import('./components/AICareCenter.tsx'));
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard.tsx'));
const AIReferenceCenter = React.lazy(() => import('./components/AIReferenceCenter.tsx'));
const PricingModal = React.lazy(() => import('./components/PricingModal.tsx'));
const BreederProSuite = React.lazy(() => import('./components/BreederProSuite.tsx'));
const MedicalVaultModal = React.lazy(() => import('./components/MedicalVaultModal.tsx'));
const BreedProfileModal = React.lazy(() => import('./components/BreedProfileModal.tsx'));
const AudioPassportModal = React.lazy(() => import('./components/AudioPassportModal.tsx'));

interface PawIndicator {
  id: number;
  x: number;
  y: number;
  rotation: number;
  size: number;
}

export default function App() {
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);
  const [petName, setPetName] = useState<string>('');
  const [currentAge, setCurrentAge] = useState<number>(3);
  const [calculated, setCalculated] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>('');
  const [paws, setPaws] = useState<PawIndicator[]>([]);
  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState<boolean>(false);
  const [isPricingOpen, setIsPricingOpen] = useState<boolean>(false);
  const [isBreederSuiteOpen, setIsBreederSuiteOpen] = useState<boolean>(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState<boolean>(false);
  const [profileModalBreed, setProfileModalBreed] = useState<Breed | null>(null);
  const [isAudioPassportModalOpen, setIsAudioPassportModalOpen] = useState<boolean>(false);
  const [audioPassportContext, setAudioPassportContext] = useState<{
    planType?: 'passport' | 'nutrition' | 'triage' | 'breeder' | 'custom';
    petName?: string;
    customText?: string;
    voice?: 'Kore' | 'Fenrir' | 'Zephyr' | 'Puck' | 'Charon';
  }>({});

  const handleOpenAudioPassport = (ctx?: {
    planType?: 'passport' | 'nutrition' | 'triage' | 'breeder' | 'custom';
    petName?: string;
    customText?: string;
    voice?: 'Kore' | 'Fenrir' | 'Zephyr' | 'Puck' | 'Charon';
  }) => {
    // Require dog breed selection first unless custom text or breeder suite context is provided
    if (!selectedBreed && !ctx?.customText && ctx?.planType !== 'breeder') {
      triggerToast("⚠️ Please select your dog's breed and age first to generate their personalized spoken report!");
      setTimeout(() => {
        searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return;
    }

    if (ctx) {
      setAudioPassportContext({
        ...ctx,
        petName: ctx.petName || petName || (selectedBreed ? `${selectedBreed.name} Companion` : 'Companion')
      });
    } else {
      setAudioPassportContext({
        planType: 'passport',
        petName: petName || (selectedBreed ? `${selectedBreed.name} Companion` : 'Companion')
      });
    }
    setIsAudioPassportModalOpen(true);
    logUserAction('Open Audio Passport Studio', ctx || {});
  };

  const lastPawTime = useRef<number>(0);
  const toastTimeoutRef = useRef<number | null>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);
  const resultsSectionRef = useRef<HTMLDivElement>(null);

  // Trigger Toast alerts safely
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMsg('');
    }, 2800);
  };

  // Keep track of cursor movement for Paw Trail
  const handleMouseMove = (e: React.MouseEvent) => {
    const now = Date.now();
    // Throttle paw generation (every 140ms max)
    if (now - lastPawTime.current < 140) return;
    lastPawTime.current = now;

    const newPaw: PawIndicator = {
      id: now,
      x: e.clientX,
      y: e.clientY,
      rotation: Math.random() * 40 - 20,
      size: 11 + Math.random() * 9,
    };

    setPaws((prev) => [...prev.slice(-12), newPaw]);
  };

  // Clean expired paw indicators without triggering idle re-render loops
  useEffect(() => {
    const handler = setInterval(() => {
      const boundary = Date.now() - 900;
      setPaws((prev) => {
        if (prev.length === 0) return prev;
        const filtered = prev.filter((p) => p.id > boundary);
        return filtered.length === prev.length ? prev : filtered;
      });
    }, 250);

    return () => {
      clearInterval(handler);
      if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Track initial application load / visit and support direct deep linking from printed report QR codes
  useEffect(() => {
    logUserAction('Page Visit');

    try {
      const params = new URLSearchParams(window.location.search);
      const breedParam = params.get('breed');
      if (breedParam) {
        const decoded = decodeURIComponent(breedParam).toLowerCase().trim();
        const matched = BREEDS.find((b) => b.name.toLowerCase() === decoded) ||
                        BREEDS.find((b) => b.name.toLowerCase().includes(decoded));
        if (matched) {
          setSelectedBreed(matched);
          setCalculated(true);
          const ageParam = params.get('age');
          if (ageParam && !isNaN(Number(ageParam))) {
            setCurrentAge(Math.max(0.2, Math.min(25, Number(ageParam))));
          }
          const showProfile = params.get('profile') === '1' || params.get('modal') === '1';
          if (showProfile) {
            setProfileModalBreed(matched);
          }
          triggerToast(`🐾 Loaded veterinary profile for ${matched.name}`);
          setTimeout(() => {
            if (!showProfile) {
              resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 350);
        }
      }
    } catch (e) {
      console.warn('Could not parse breed from URL parameter:', e);
    }
  }, []);

  // Set direct active presets
  const applyPresetAge = (age: number) => {
    setCurrentAge(age);
    triggerToast(`Age set to ${age} ${age === 1 ? 'Year' : 'Years'} old`);
  };

  const handleCalculate = () => {
    if (!selectedBreed) {
      triggerToast('⚠️ Please select a dog breed first to calculate!');
      return;
    }
    setCalculated(true);
    // Log calculation event with breed specifics
    logUserAction('Calculate Lifespan', {
      breed: selectedBreed.name,
      age: currentAge,
      lifespanMax: selectedBreed.max
    });
    // Dynamic scroll trigger
    setTimeout(() => {
      resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleReset = () => {
    setSelectedBreed(null);
    setCurrentAge(3);
    setCalculated(false);
    triggerToast('Inputs cleared! Try another companion.');
    setTimeout(() => {
      searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-x-hidden flex flex-col selection:bg-[#FF6B4A] selection:text-white"
    >
      {/* Decorative Blur Background Blobs */}
      <div className="ambient-blob w-72 h-72 sm:w-[450px] sm:h-[450px] bg-[#FF6B4A]/10 dark:bg-[#FF6B4A]/3 top-10 -right-20" aria-hidden="true" />
      <div className="ambient-blob w-64 h-64 sm:w-[350px] sm:h-[350px] bg-[#2D8C6F]/10 dark:bg-[#2D8C6F]/3 bottom-10 -left-10" aria-hidden="true" />
      <div className="ambient-blob w-80 h-80 bg-[#E5A836]/8 dark:bg-[#E5A836]/3 top-1/2 left-1/3 -translate-y-1/2" aria-hidden="true" />

      {/* Floating cursors paws */}
      {paws.map((p) => {
        const ageInMs = Date.now() - p.id;
        const opacity = Math.max(0, 1 - ageInMs / 800);
        return (
          <div
            key={p.id}
            className="fixed pointer-events-none z-50 text-[#FF6B4A] select-none transition-all duration-700 ease-out"
            style={{
              left: p.x,
              top: p.y,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg) scale(${opacity})`,
              opacity: opacity * 0.45,
              fontSize: `${p.size}px`,
            }}
          >
            🐾
          </div>
        );
      })}

      {/* Top Application Navigation Bar */}
      <Navbar
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenBreederSuite={() => setIsBreederSuiteOpen(true)}
        onOpenAudioPassport={() => handleOpenAudioPassport()}
        onToggleAdminConsole={() => setIsAdminConsoleOpen(!isAdminConsoleOpen)}
        isAdminConsoleOpen={isAdminConsoleOpen}
        onOpenVaultModal={() => setIsVaultModalOpen(true)}
        selectedBreedName={selectedBreed?.name}
      />

      {/* Lazy Modal Suspense Wrapper */}
      <ErrorBoundary fallbackTitle="Modal Service Recovery">
        <React.Suspense fallback={null}>
          {/* Pricing & Subscriptions Modal */}
          <PricingModal
            isOpen={isPricingOpen}
            onClose={() => setIsPricingOpen(false)}
            onOpenBreederSuite={() => setIsBreederSuiteOpen(true)}
            onSelectTier={(tierName) => {
              triggerToast(`Selected Tier: ${tierName}. Tier benefits active!`);
              logUserAction('Select Pricing Tier', { tier: tierName });
            }}
          />

          {/* Professional Breeder Pro Suite Fullscreen Modal */}
          {isBreederSuiteOpen && (
            <BreederProSuite
              isOpen={isBreederSuiteOpen}
              onClose={() => setIsBreederSuiteOpen(false)}
              onOpenAudioPassport={(pup) => handleOpenAudioPassport({
                planType: 'breeder',
                petName: pup?.callName || 'Puppy',
                voice: 'Charon'
              })}
            />
          )}

          {/* Spoken Clinical Plans & Audio Passports Modal */}
          <AudioPassportModal
            isOpen={isAudioPassportModalOpen}
            onClose={() => setIsAudioPassportModalOpen(false)}
            currentBreed={selectedBreed}
            currentAge={currentAge}
            initialPetName={audioPassportContext.petName || (selectedBreed ? `${selectedBreed.name} Companion` : 'Bella')}
            initialPlanType={audioPassportContext.planType || 'passport'}
            initialCustomText={audioPassportContext.customText || ''}
            initialVoice={audioPassportContext.voice || 'Fenrir'}
          />

          {/* Medical Privacy Vault Modal */}
          <MedicalVaultModal
            isOpen={isVaultModalOpen}
            onClose={() => setIsVaultModalOpen(false)}
            onVaultStateChange={() => {
              triggerToast('Medical Vault security state updated');
            }}
          />

          {/* Encyclopedic Breed Profile / Dossier Modal */}
          <BreedProfileModal
            breed={profileModalBreed}
            isOpen={!!profileModalBreed}
            onClose={() => setProfileModalBreed(null)}
            onSelectBreedForCalculation={(b) => {
              setSelectedBreed(b);
              setProfileModalBreed(null);
              setCalculated(true);
              triggerToast(`Selected ${b.name} for calculation`);
              setTimeout(() => {
                resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 150);
            }}
          />

          {/* God Mode Dashboard Overlay */}
          {isAdminConsoleOpen && (
            <AdminDashboard onClose={() => setIsAdminConsoleOpen(false)} />
          )}
        </React.Suspense>
      </ErrorBoundary>

      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 py-8 sm:py-10 flex-1 flex flex-col gap-8 sm:gap-10">
        
        {/* Hero Header Block with Top-Right Breed Showcase */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 animate-[fadeIn_0.5s_ease-out]">
          <div className="flex flex-col gap-3 max-w-xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1A1A1A] dark:text-[#F0ECE6] leading-[1.08]">
              Dog Breed <br />
              <span className="text-[#FF6B4A]">Life Expectancy</span> Calculator
            </h1>
            
            <p className="text-sm sm:text-base text-[#8A8680] dark:text-[#9A9590] leading-relaxed">
              Discover your companion’s personalized timeline, life stage conversion, and evidence-based clinical health insights — adjusted by breed genetics and age.
            </p>

            <div className="w-16 h-1 bg-[#FF6B4A] rounded-full mt-1" />
          </div>

          {/* Top Right High-Res Breed Showcase Card */}
          <div className="shrink-0 w-full md:w-80 bg-white/70 dark:bg-[#282420]/80 backdrop-blur-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-2xl p-4 flex flex-col items-center text-center transition-all">
            {selectedBreed ? (
              <div className="w-full flex flex-col items-center gap-2">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[2.5px_2.5px_0_#1A1A1A] dark:shadow-[2.5px_2.5px_0_#F0ECE6] bg-amber-500/10">
                  <img
                    src={getBreedImagePath(selectedBreed.name) || ''}
                    alt={selectedBreed.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-[#1A1A1A] text-white text-[0.55rem] font-mono font-bold uppercase">
                    {selectedBreed.size}
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-sm text-[#1A1A1A] dark:text-[#F0ECE6] leading-tight">
                    {petName ? `${petName} (${selectedBreed.name})` : selectedBreed.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5 mt-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-[#FF6B4A]/15 text-[#FF6B4A] font-mono text-[0.62rem] font-black border border-[#FF6B4A]/30">
                      {selectedBreed.min}-{selectedBreed.max} Yrs Expectancy
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#2D8C6F]/15 text-[#2D8C6F] font-mono text-[0.62rem] font-bold border border-[#2D8C6F]/30">
                      {selectedBreed.group}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setProfileModalBreed(selectedBreed)}
                  className="mt-1 w-full py-1.5 text-[0.68rem] font-black uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-[#1A1A1A] rounded-lg border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] transition-all cursor-pointer active:scale-95"
                >
                  View Breed Dossier
                </button>
              </div>
            ) : (
              <div className="w-full py-2 px-1 flex flex-col items-center text-center gap-2">
                <div className="w-14 h-14 rounded-full bg-[#FF6B4A]/10 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] flex items-center justify-center text-2xl shadow-[2px_2px_0_#1A1A1A] dark:shadow-[2px_2px_0_#F0ECE6]">
                  🐕
                </div>
                <div>
                  <span className="block text-xs font-black uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6]">
                    Breed Photo & Profile Showcase
                  </span>
                  <p className="text-[0.72rem] text-[#8A8680] dark:text-[#9A9590] mt-1 leading-snug">
                    Select your dog's breed below to render their high-res photo, genetics, and personalized lifespan plan!
                  </p>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Search Panel / Input Bench Grid */}
        <section
          ref={searchSectionRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
          aria-label="Dog health and expectancy configuration area"
        >
          {/* Box 1. Autocomplete Search Component */}
          <BreedSearch
            selectedBreed={selectedBreed}
            onSelectBreed={(b) => {
              setSelectedBreed(b);
              if (!b) {
                setCalculated(false);
                if (typeof window !== 'undefined' && window.history?.replaceState) {
                  window.history.replaceState(null, '', window.location.pathname);
                }
              } else {
                if (typeof window !== 'undefined' && window.history?.replaceState) {
                  window.history.replaceState(null, '', `?breed=${encodeURIComponent(b.name)}`);
                }
              }
            }}
            onOpenProfileModal={(b) => setProfileModalBreed(b)}
          />

          {/* Box 2. Age Step Picker & Fast Presets */}
          <div className="flex flex-col gap-4">
            <div className="bg-white/50 dark:bg-[#282420]/65 backdrop-blur-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-5 flex flex-col justify-between min-h-[220px]">
              <div>
                {/* Pet Name Input Field */}
                <div className="mb-4">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#1A1A1A] dark:text-[#F0ECE6] flex items-center justify-between">
                    <span>1. Companion / Pet's Name</span>
                    <span className="text-[0.65rem] font-mono text-[#FF6B4A] font-bold">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Bella, Max, Charlie, Luna..."
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm font-bold border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1E1C18] shadow-[2.5px_2.5px_0_#1A1A1A] dark:shadow-[2.5px_2.5px_0_#F0ECE6] rounded-lg text-[#1A1A1A] dark:text-[#F0ECE6] placeholder-[#8A8680] dark:placeholder-[#6A6660] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]"
                    />
                    {petName && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[0.62rem] font-mono font-black uppercase">
                        ● Personalized
                      </span>
                    )}
                  </div>
                </div>

                <label className="block text-xs font-bold uppercase tracking-wider mb-3 text-[#1A1A1A] dark:text-[#F0ECE6]">
                  2. Choose Current Age
                </label>

                {/* Brutalist stepper controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentAge((prev) => Math.max(0, +(prev - 0.5).toFixed(1)))}
                    className="w-12 h-12 flex items-center justify-center font-bold text-xl rounded-lg border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1E1C18] text-[#1A1A1A] dark:text-[#F0ECE6] shadow-[2.5px_2.5px_0_#1A1A1A] dark:shadow-[2.5px_2.5px_0_#F0ECE6] active:translate-y-[2px] active:shadow-none hover:bg-black/5 dark:hover:bg-white/5 transition-all text-center cursor-pointer select-none"
                    aria-label="Subtract half a year"
                  >
                    -
                  </button>
                  <div className="flex-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      max="25"
                      value={currentAge}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setCurrentAge(Math.max(0, Math.min(25, val)));
                      }}
                      className="w-full text-center py-2 text-2xl font-black font-mono border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1E1C18] shadow-[2.5px_2.5px_0_#1A1A1A] dark:shadow-[2.5px_2.5px_0_#F0ECE6] rounded-lg tracking-tight text-[#1A1A1A] dark:text-[#F0ECE6] focus:outline-none"
                      aria-label="Numerical age input"
                    />
                  </div>
                  <button
                    onClick={() => setCurrentAge((prev) => Math.min(25, +(prev + 0.5).toFixed(1)))}
                    className="w-12 h-12 flex items-center justify-center font-bold text-xl rounded-lg border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1E1C18] text-[#1A1A1A] dark:text-[#F0ECE6] shadow-[2.5px_2.5px_0_#1A1A1A] dark:shadow-[2.5px_2.5px_0_#F0ECE6] active:translate-y-[2px] active:shadow-none hover:bg-black/5 dark:hover:bg-white/5 transition-all text-center cursor-pointer select-none"
                    aria-label="Add half a year"
                  >
                    +
                  </button>
                </div>
                <p className="text-center text-[0.68rem] font-mono font-bold text-[#8A8680] dark:text-[#9A9590] mt-2 uppercase tracking-wider">
                  Companion Chronological Years old
                </p>
              </div>

              {/* Fast Age Presets */}
              <div className="mt-4 pt-3 border-t border-[#1A1A1A]/10 dark:border-white/10">
                <span className="block text-[0.68rem] font-bold text-[#8A8680] dark:text-[#9A9590] uppercase tracking-wider mb-2">
                  Quick Period Shortcuts:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => applyPresetAge(0.5)}
                    className="px-2.5 py-1 text-[0.68rem] font-mono font-bold rounded-md border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1E1C18] text-[#1A1A1A] dark:text-[#F0ECE6] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    Puppy (6m)
                  </button>
                  <button
                    onClick={() => applyPresetAge(1)}
                    className="px-2.5 py-1 text-[0.68rem] font-mono font-bold rounded-md border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1E1C18] text-[#1A1A1A] dark:text-[#F0ECE6] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    1 Year
                  </button>
                  <button
                    onClick={() => applyPresetAge(3)}
                    className="px-2.5 py-1 text-[0.68rem] font-mono font-bold rounded-md border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1E1C18] text-[#1A1A1A] dark:text-[#F0ECE6] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    3 Years
                  </button>
                  <button
                    onClick={() => applyPresetAge(7)}
                    className="px-2.5 py-1 text-[0.68rem] font-mono font-bold rounded-md border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1E1C18] text-[#1A1A1A] dark:text-[#F0ECE6] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    Senior (7y)
                  </button>
                  <button
                    onClick={() => applyPresetAge(10)}
                    className="px-2.5 py-1 text-[0.68rem] font-mono font-bold rounded-md border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1E1C18] text-[#1A1A1A] dark:text-[#F0ECE6] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    Veteran (10y)
                  </button>
                </div>
              </div>
            </div>

            {/* Brutalist Calculation Button */}
            <button
              onClick={handleCalculate}
              className="w-full py-4 text-md font-extrabold uppercase bg-[#FF6B4A] hover:bg-[#ff5d38] text-white rounded-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1A1A1A] dark:hover:shadow-[6px_6px_0_#F0ECE6] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1.5px_1.5px_0_#1A1A1A] dark:active:shadow-[1.5px_1.5px_0_#F0ECE6] flex items-center justify-center gap-2 cursor-pointer transition-all uppercase tracking-wider"
            >
              <Calculator className="w-5 h-5" />
              Calculate Live Lifespan Metrics
            </button>

            {/* Spoken Clinical Plan Quick Trigger */}
            <div className="mt-3.5 pt-2.5 border-t border-dashed border-[#1A1A1A]/15 dark:border-white/15 flex items-center justify-between gap-2">
              <span className="text-[0.72rem] text-stone-500 dark:text-stone-400 font-mono">
                Multimodal Audio Hub:
              </span>
              <button
                type="button"
                onClick={() => handleOpenAudioPassport({
                  petName: selectedBreed?.name,
                  planType: 'passport'
                })}
                className="text-xs font-black text-[#2D8C6F] dark:text-emerald-400 hover:text-[#23775d] flex items-center gap-1.5 underline decoration-emerald-500/40 underline-offset-4 cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
                <span>🎙️ Spoken Clinical Plan & Audio Passports Studio →</span>
              </button>
            </div>
          </div>
        </section>

        {/* Results Zone */}
        {calculated && selectedBreed && (
          <div ref={resultsSectionRef} className="flex flex-col gap-6 scroll-mt-20">
            {/* Developmental interactive timeline view */}
            <InteractiveTimeline breed={selectedBreed} age={currentAge} />

            {/* In depth bento cards with metrics */}
            <ErrorBoundary fallbackTitle="Clinical Metrics Recovery">
              <React.Suspense fallback={
                <div className="p-8 text-center bg-white/40 dark:bg-[#1E1C18]/40 rounded-2xl border-2 border-dashed border-[#1A1A1A]/20 dark:border-white/20 font-mono text-sm text-[#8A8680] animate-pulse">
                  🐾 Loading clinical longevity analysis...
                </div>
              }>
                <ResultsDisplay
                  breed={selectedBreed}
                  age={currentAge}
                  petName={petName}
                  onOpenProfileModal={(b) => setProfileModalBreed(b)}
                  onOpenVaultModal={() => setIsVaultModalOpen(true)}
                  onOpenAudioPassport={(ctx) => handleOpenAudioPassport({
                    petName: petName || selectedBreed.name,
                    ...ctx
                  })}
                />

                {/* AI Pro Care Suite */}
                <AICareCenter
                  currentBreed={selectedBreed}
                  currentAge={currentAge}
                  onOpenPricing={() => setIsPricingOpen(true)}
                  onOpenAudioPassport={(ctx) => handleOpenAudioPassport(ctx)}
                />
              </React.Suspense>
            </ErrorBoundary>

            {/* Reset option button */}
            <div className="flex justify-center items-center py-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-[#1A1A1A] dark:bg-[#F0ECE6] text-[#F5F0E8] dark:text-[#141210] border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#FF6B4A] rounded-xl font-bold flex items-center gap-2 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_#FF6B4A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Change Dog Breed Selection
              </button>
            </div>
          </div>
        )}

        {/* User feedback submission panel */}
        <UserFeedbackForm currentBreed={selectedBreed} currentAge={currentAge} />

        {/* Clinical Evidence & Reference Library */}
        <React.Suspense fallback={null}>
          <AIReferenceCenter />
        </React.Suspense>

        {/* Dynamic Advice footnote */}
        <section className="bg-white/20 dark:bg-[#282420]/25 border-t border-[#1A1A1A]/10 dark:border-white/10 pt-6 text-center text-[0.72rem] md:text-xs text-[#8A8680] dark:text-[#9A9590] flex flex-col gap-1 items-center justify-center">
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#E5A836]" />
            <span>Loving Care Drives True Longevity</span>
          </div>
          <p className="max-w-2xl leading-relaxed">
            Canine age calculations are derived from verified veterinary charts and cohort study metrics. Real longevity is highly unique – custom high-potency diets, regular veterinary checks, heart-worm preventatives, and an environment of safety can substantially prolong a dog's golden years!
          </p>
        </section>

      </main>

      {/* Branded Footer */}
      <footer>
Designed by TOUDOU DIGITAL — Copyright © 2026 TOUDOU DIGITAL
      </footer>

      {/* Floating Spoken Clinical Plan Quick Trigger */}
      <button
        type="button"
        onClick={() => handleOpenAudioPassport({
          petName: selectedBreed?.name,
          planType: 'passport'
        })}
        className="fixed bottom-5 right-5 z-40 bg-[#2D8C6F] hover:bg-[#23775d] text-white border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-full px-4 py-2.5 flex items-center gap-2 cursor-pointer font-black text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ring-2 ring-emerald-400/40 no-print"
        title="🎙️ Open Spoken Clinical Plan & Audio Passports (Gemini 3.8 Flash-Lite TTS)"
      >
        <Mic className="w-4 h-4 text-emerald-200 animate-pulse" />
        <span className="hidden sm:inline">🎙️ Spoken Clinical Plan</span>
        <span className="sm:hidden">🎙️ Plan</span>
      </button>

      {/* Floating toast alert window */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1A1A1A] dark:bg-[#F0ECE6] text-white dark:text-[#141210] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#FF6B4A] px-5 py-3 rounded-xl z-50 flex items-center justify-center gap-2 text-xs font-bold font-mono tracking-tight animate-[fadeIn_0.2s_ease-out]">
          <span>🐾</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
