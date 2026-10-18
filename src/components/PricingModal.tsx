import * as React from 'react';
import { useState } from 'react';
import {
  X,
  Check,
  Sparkles,
  Shield,
  Building2,
  Crown,
  Zap,
  Heart,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Mic,
  FileText,
  Lock,
  Calendar,
  Activity,
  Users
} from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTier?: (tierName: string) => void;
  onOpenBreederSuite?: () => void;
}

export default function PricingModal({
  isOpen,
  onClose,
  onSelectTier,
  onOpenBreederSuite
}: PricingModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showFeatureMatrix, setShowFeatureMatrix] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleChoose = (tierName: string) => {
    if (onSelectTier) onSelectTier(tierName);
    onClose();
    if (
      (tierName.includes('Breeder') || tierName === 'Pack & Breeder Pro' || tierName === 'Elite Pro Breeder') &&
      onOpenBreederSuite
    ) {
      onOpenBreederSuite();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-3 sm:p-6 md:p-8 flex justify-center items-start pt-4 sm:pt-8 pb-16 animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-6xl bg-[#F5F0E8] dark:bg-[#1C1A17] border-[3px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[8px_8px_0_#FF6B4A] rounded-2xl p-5 sm:p-8 text-[#1A1A1A] dark:text-[#F0ECE6] my-auto">
        
        {/* Sticky/Top Navigation Bar inside Modal */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-dashed border-[#1A1A1A]/15 dark:border-white/15 gap-2">
          {/* Direct Return to Home Button */}
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#282420] text-[#1A1A1A] dark:text-[#F0ECE6] shadow-[2.5px_2.5px_0_#1A1A1A] dark:shadow-[2.5px_2.5px_0_#F0ECE6] flex items-center gap-2 text-xs font-black uppercase tracking-wider hover:bg-[#FF6B4A] hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Return to DogHealthOS™ Home</span>
          </button>

          {/* Top Right Close Button */}
          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#282420] text-[#1A1A1A] dark:text-[#F0ECE6] shadow-[2.5px_2.5px_0_#1A1A1A] dark:shadow-[2.5px_2.5px_0_#F0ECE6] flex items-center justify-center font-bold hover:bg-[#FF6B4A] hover:text-white transition-all cursor-pointer shrink-0"
            aria-label="Close pricing modal"
            title="Close modal and return home"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B4A]/10 border border-[#FF6B4A]/30 text-[#FF6B4A] text-xs font-black tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Audited Pricing & Professional Tiers
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Choose the Right <span className="text-[#FF6B4A]">DogHealthOS™</span> Plan
          </h2>
          
          <p className="text-xs sm:text-sm text-[#8A8680] dark:text-[#9A9590] mt-2 leading-relaxed max-w-2xl mx-auto">
            Transparent, evidence-based canine longevity memberships designed for individual pet parents, ethical preservation breeders, and accredited veterinary clinics.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center gap-3 bg-white dark:bg-[#282420] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] rounded-xl p-1.5 mt-6">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-black tracking-wider uppercase transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-[#FF6B4A] text-white shadow-[2px_2px_0_#1A1A1A]'
                  : 'text-[#8A8680] dark:text-[#9A9590] hover:text-[#1A1A1A] dark:hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-lg text-xs font-black tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-[#FF6B4A] text-white shadow-[2px_2px_0_#1A1A1A]'
                  : 'text-[#8A8680] dark:text-[#9A9590] hover:text-[#1A1A1A] dark:hover:text-white'
              }`}
            >
              Annual Billing
              <span className="px-1.5 py-0.5 rounded bg-[#2D8C6F] text-white text-[0.62rem] font-bold">
                Save ~33%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid (4 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          
          {/* TIER 1: FREE FOREVER */}
          <div className="bg-white dark:bg-[#282420] border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-5 flex flex-col justify-between relative hover:translate-y-[-2px] transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-[#1A1A1A] dark:text-white">
                  <Heart className="w-5 h-5 text-rose-500" />
                </span>
                <span className="text-[0.65rem] font-mono font-bold uppercase px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                  Community
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight">Free Lifetime Care</h3>
              <p className="text-[0.72rem] text-[#8A8680] dark:text-[#9A9590] mt-1">
                Essential longevity benchmarks, life stages & growth tools for every pet parent.
              </p>

              <div className="my-4 pb-4 border-b border-[#1A1A1A]/10 dark:border-white/10">
                <span className="text-3xl font-black font-mono">$0</span>
                <span className="text-xs font-bold text-[#8A8680] dark:text-[#9A9590]"> / forever</span>
                <div className="text-[0.68rem] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                  100% Free Forever • No Card
                </div>
              </div>

              <ul className="space-y-2.5 text-xs">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2D8C6F] shrink-0 mt-0.5" />
                  <span><strong>200+ Canine Breeds</strong> Life Expectancy & biological age calculator</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2D8C6F] shrink-0 mt-0.5" />
                  <span>Epigenetic non-linear age conversion (DNA methylation science)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2D8C6F] shrink-0 mt-0.5" />
                  <span>D3 Gompertz Sigmoidal Growth Curves (P10–P90 percentiles)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2D8C6F] shrink-0 mt-0.5" />
                  <span>WSAVA 9-Point Body Condition Score & weight guides</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2D8C6F] shrink-0 mt-0.5" />
                  <span>Purina Caloric Restriction Longevity Simulator preview</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2D8C6F] shrink-0 mt-0.5" />
                  <span><strong>1 Free Neural Spoken Audio Passport</strong> consultation trial</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2D8C6F] shrink-0 mt-0.5" />
                  <span>AVMA / AAHA Evidence Reference Library</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleChoose('Free Lifetime Care')}
              className="mt-6 w-full py-2.5 text-xs font-extrabold uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-[#1A1A1A] dark:text-[#F0ECE6] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[2px_2px_0_#1A1A1A] dark:shadow-[2px_2px_0_#F0ECE6] rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-all cursor-pointer"
            >
              Current Active Plan
            </button>
          </div>

          {/* TIER 2: HEALTHSPAN PRO ($4.99/MO) */}
          <div className="bg-white dark:bg-[#282420] border-[2.5px] border-[#FF6B4A] shadow-[4px_4px_0_#FF6B4A] rounded-xl p-5 flex flex-col justify-between relative hover:translate-y-[-2px] transition-all ring-2 ring-[#FF6B4A]/30">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF6B4A] text-white text-[0.62rem] font-black uppercase tracking-widest px-3 py-0.5 rounded-full border border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] whitespace-nowrap">
              ⭐ Most Popular
            </div>
            <div>
              <div className="flex items-center justify-between mb-3 mt-1">
                <span className="p-2 rounded-lg bg-[#FF6B4A]/10 text-[#FF6B4A]">
                  <Zap className="w-5 h-5" />
                </span>
                <span className="text-[0.65rem] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#FF6B4A]/15 text-[#FF6B4A]">
                  Pet Parent Pro
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight">Healthspan Pro</h3>
              <p className="text-[0.72rem] text-[#8A8680] dark:text-[#9A9590] mt-1">
                Complete clinical longevity suite for dedicated pet parents & households.
              </p>

              <div className="my-4 pb-4 border-b border-[#1A1A1A]/10 dark:border-white/10">
                <span className="text-3xl font-black font-mono">
                  {billingCycle === 'monthly' ? '$4.99' : '$3.33'}
                </span>
                <span className="text-xs font-bold text-[#8A8680] dark:text-[#9A9590]">
                  {billingCycle === 'monthly' ? ' / month' : ' / month ($39.99/yr)'}
                </span>
                <div className="text-[0.68rem] text-[#FF6B4A] font-bold mt-1">
                  {billingCycle === 'annual' ? 'Billed annually ($39.99/yr) • Save 33%' : 'Flexible monthly billing • Cancel anytime'}
                </div>
              </div>

              <ul className="space-y-2.5 text-xs">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2D8C6F] shrink-0 mt-0.5" />
                  <span><strong>Unlimited Neural Studio Audio Passports</strong> across all <strong>8 Specialist Clinicians</strong> (Dr. Barnes, Dr. Sterling, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2D8C6F] shrink-0 mt-0.5" />
                  <span><strong>Studio Pitch & Speed Controls</strong> with waveform visualizer & <strong>Master MP3 Download</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2D8C6F] shrink-0 mt-0.5" />
                  <span><strong>Full Vector PDF Health Passports</strong> with verified QR codes for vet visits & pet insurance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2D8C6F] shrink-0 mt-0.5" />
                  <span><strong>Purina Longevity Penalty Simulator</strong>: Full weight sensitivity & lifespan extension variance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2D8C6F] shrink-0 mt-0.5" />
                  <span><strong>Comprehensive Multi-Entry Biometrics</strong>: Unlimited weigh-in tracking & growth surge warnings</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2D8C6F] shrink-0 mt-0.5" />
                  <span><strong>Smart Vet Calendar Sync</strong>: Pre-visit triage checklists & RFC 5545 <code>.ics</code> calendar export</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2D8C6F] shrink-0 mt-0.5" />
                  <span><strong>Encrypted Medical Vault</strong>: Store up to <strong>3 dogs</strong> with PIN & biometric protection</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleChoose('Healthspan Pro')}
              className="mt-6 w-full py-2.5 text-xs font-extrabold uppercase tracking-wider bg-[#FF6B4A] text-white border-2 border-[#1A1A1A] shadow-[2.5px_2.5px_0_#1A1A1A] rounded-lg hover:bg-[#ff5d38] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Get Healthspan Pro ($4.99/mo)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* TIER 3: PACK & BREEDER PRO ($9.99/MO) */}
          <div className="bg-gradient-to-b from-amber-500/10 to-transparent dark:from-amber-500/15 bg-white dark:bg-[#282420] border-[2.5px] border-amber-500 dark:border-amber-400 shadow-[4px_4px_0_#d97706] rounded-xl p-5 flex flex-col justify-between relative hover:translate-y-[-2px] transition-all">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[0.62rem] font-black uppercase tracking-widest px-3 py-0.5 rounded-full border border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] whitespace-nowrap">
              🏆 Best for Breeders & Packs
            </div>
            <div>
              <div className="flex items-center justify-between mb-3 mt-1">
                <span className="p-2 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  <Crown className="w-5 h-5" />
                </span>
                <span className="text-[0.65rem] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  Breeder & Pack
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight">Pack & Breeder Pro</h3>
              <p className="text-[0.72rem] text-[#8A8680] dark:text-[#9A9590] mt-1">
                Command center for kennels, multi-dog packs & adopter transfer passports.
              </p>

              <div className="my-4 pb-4 border-b border-[#1A1A1A]/10 dark:border-white/10">
                <span className="text-3xl font-black font-mono">
                  {billingCycle === 'monthly' ? '$9.99' : '$6.66'}
                </span>
                <span className="text-xs font-bold text-[#8A8680] dark:text-[#9A9590]">
                  {billingCycle === 'monthly' ? ' / month' : ' / month ($79.99/yr)'}
                </span>
                <div className="text-[0.68rem] text-amber-600 dark:text-amber-400 font-bold mt-1">
                  {billingCycle === 'annual' ? 'Billed annually ($79.99/yr) • Save 33%' : 'Flexible monthly billing • Cancel anytime'}
                </div>
              </div>

              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Dedicated Breeder Pro Suite Hub</strong>: Multi-litter cohorts, dam & sire pairings, heat cycles</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Puppy Health Passports (PDF)</strong> with custom kennel insignia, microchip tags & adopter logs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>WALTHAM Pediatric Growth Curves</strong>: Track entire litters simultaneously from birth to 12 weeks</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Hereditary Risk Matrix</strong>: Cross-referenced with AKC, OFA & AVMA clearance screening</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Batch Nutri-Chef & Weaning Analytics</strong> for nursing dams & transitioning puppies</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Adopter CRM Pipeline</strong> (manage prospective puppy buyers & litter waitlists)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Unlimited Dog Profiles</strong> (manage 10, 25, or 50+ dogs with zero per-dog fees)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Priority Audio Synthesis Queue</strong> for rapid voice generation</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleChoose('Pack & Breeder Pro')}
              className="mt-6 w-full py-2.5 text-xs font-extrabold uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-white border-2 border-[#1A1A1A] shadow-[2.5px_2.5px_0_#1A1A1A] rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Get Pack & Breeder Pro</span>
              <Crown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* TIER 4: VETERINARY CLINICAL SUITE ($49.00/MO) */}
          <div className="bg-white dark:bg-[#282420] border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#2D8C6F] rounded-xl p-5 flex flex-col justify-between relative hover:translate-y-[-2px] transition-all">
            <div>
              <div className="flex items-center justify-between mb-3 mt-1">
                <span className="p-2 rounded-lg bg-[#2D8C6F]/10 text-[#2D8C6F]">
                  <Building2 className="w-5 h-5" />
                </span>
                <span className="text-[0.65rem] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#2D8C6F]/15 text-[#2D8C6F]">
                  B2B SaaS
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight">Veterinary Clinical Suite</h3>
              <p className="text-[0.72rem] text-[#8A8680] dark:text-[#9A9590] mt-1">
                For veterinary hospitals, primary practices & regional animal shelters.
              </p>

              <div className="my-4 pb-4 border-b border-[#1A1A1A]/10 dark:border-white/10">
                <span className="text-3xl font-black font-mono">
                  {billingCycle === 'monthly' ? '$49.00' : '$40.83'}
                </span>
                <span className="text-xs font-bold text-[#8A8680] dark:text-[#9A9590]">
                  {billingCycle === 'monthly' ? ' / month' : ' / month ($490/yr)'}
                </span>
                <div className="text-[0.68rem] text-[#2D8C6F] font-bold mt-1">
                  {billingCycle === 'annual' ? 'Billed annually ($490.00/yr) • Save 17%' : 'Flexible monthly clinic licensing'}
                </div>
              </div>

              <ul className="space-y-2.5 text-xs">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2D8C6F] shrink-0 mt-0.5" />
                  <span><strong>White-Label Client Intake Widget</strong> for clinic website integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2D8C6F] shrink-0 mt-0.5" />
                  <span>Branded PDF reports with custom clinic logo & <strong>"Book Appointment" QR code</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2D8C6F] shrink-0 mt-0.5" />
                  <span><strong>Post-Discharge Audio Instructions</strong> in clinician voice directly to owner phones</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2D8C6F] shrink-0 mt-0.5" />
                  <span>Up to <strong>10 staff credentials</strong> for veterinarians, vet techs & practice managers</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2D8C6F] shrink-0 mt-0.5" />
                  <span>Pet insurance underwriting & claims export integration (Trupanion, Healthy Paws, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2D8C6F] shrink-0 mt-0.5" />
                  <span>Dedicated account manager & priority telephone support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleChoose('Veterinary Suite')}
              className="mt-6 w-full py-2.5 text-xs font-extrabold uppercase tracking-wider bg-[#2D8C6F] hover:bg-[#25755c] text-white border-2 border-[#1A1A1A] shadow-[2.5px_2.5px_0_#1A1A1A] rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Subscribe Vet Suite</span>
              <Building2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Feature Comparison Matrix Accordion */}
        <div className="mt-8 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl bg-white dark:bg-[#201D1A] overflow-hidden shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6]">
          <button
            onClick={() => setShowFeatureMatrix(!showFeatureMatrix)}
            className="w-full px-5 py-3.5 bg-stone-100 dark:bg-stone-800 text-left font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-between cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FF6B4A]" />
              Detailed Side-by-Side Feature Matrix (All 4 Tiers)
            </span>
            <div className="flex items-center gap-1 text-xs text-[#8A8680] dark:text-[#9A9590] font-bold">
              <span>{showFeatureMatrix ? 'Hide Full Comparison' : 'View Full Comparison'}</span>
              {showFeatureMatrix ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showFeatureMatrix && (
            <div className="overflow-x-auto p-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#1A1A1A]/20 dark:border-white/20">
                    <th className="py-2.5 px-3 font-black text-[#8A8680] dark:text-[#9A9590] uppercase">Feature / Capability</th>
                    <th className="py-2.5 px-3 font-black text-stone-700 dark:text-stone-300 text-center">Free ($0)</th>
                    <th className="py-2.5 px-3 font-black text-[#FF6B4A] text-center bg-[#FF6B4A]/5">Healthspan Pro ($4.99/mo)</th>
                    <th className="py-2.5 px-3 font-black text-amber-600 dark:text-amber-400 text-center">Pack & Breeder ($9.99/mo)</th>
                    <th className="py-2.5 px-3 font-black text-[#2D8C6F] text-center">Vet Suite ($49/mo)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]/10 dark:divide-white/10 font-medium">
                  {/* Category: Core Longevity */}
                  <tr className="bg-stone-50 dark:bg-stone-900/50 font-black text-[0.7rem] uppercase text-[#8A8680]">
                    <td colSpan={5} className="py-2 px-3">1. Core Longevity & Growth Telemetry</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">200+ Canine Breeds Longevity Database</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Included</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold bg-[#FF6B4A]/5">✅ Included</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Included</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Included</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Epigenetic Non-Linear Age Modeling</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Included</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold bg-[#FF6B4A]/5">✅ Included</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Included</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Included</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">D3 Sigmoidal Gompertz Curves (P10–P90)</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Standard</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold bg-[#FF6B4A]/5">✅ Full Multi-Entry</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ WALTHAM Cohorts</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Clinic Multi-Patient</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Purina Caloric Restriction Longevity Simulator</td>
                    <td className="py-2 px-3 text-center text-[#8A8680]">Preview Only</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold bg-[#FF6B4A]/5">✅ Full Interactive (+2.5 yrs)</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Full Interactive</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Full Interactive</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Lifetime Veterinary Cost Forecaster</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Baseline</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold bg-[#FF6B4A]/5">✅ Detailed Risk Modeler</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Litter Risk Modeler</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Institutional Forecast</td>
                  </tr>

                  {/* Category: Neural Audio Studio */}
                  <tr className="bg-stone-50 dark:bg-stone-900/50 font-black text-[0.7rem] uppercase text-[#8A8680]">
                    <td colSpan={5} className="py-2 px-3">2. Neural Spoken Audio Passports & Clinicians</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">8 Specialist Clinician Personas (Dr. Barnes, Chef Stella, etc.)</td>
                    <td className="py-2 px-3 text-center text-[#8A8680]">1 Free Trial</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold bg-[#FF6B4A]/5">✅ Unlimited Consultations</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Priority Queue</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Custom Discharge Voice</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Acoustic Pitch (-2Hz, 0Hz, +2Hz) & Speed Controls</td>
                    <td className="py-2 px-3 text-center text-[#8A8680]">Default only</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold bg-[#FF6B4A]/5">✅ Full Studio Modulation</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Full Studio Modulation</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Full Studio Modulation</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Master MP3 Audio Download & Transcript</td>
                    <td className="py-2 px-3 text-center text-[#8A8680]">❌</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold bg-[#FF6B4A]/5">✅ Unlimited MP3</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Unlimited MP3</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Unlimited MP3</td>
                  </tr>

                  {/* Category: Clinical PDF & Vault */}
                  <tr className="bg-stone-50 dark:bg-stone-900/50 font-black text-[0.7rem] uppercase text-[#8A8680]">
                    <td colSpan={5} className="py-2 px-3">3. Clinical Passports, Vault & Calendar Sync</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Vector PDF Health Passport with QR Code</td>
                    <td className="py-2 px-3 text-center text-[#8A8680]">Basic summary</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold bg-[#FF6B4A]/5">✅ Full Multi-Page Clinical PDF</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Kennel Branded Passports</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Clinic White-Label PDF</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Smart Vet Calendar (.ics standard export)</td>
                    <td className="py-2 px-3 text-center text-[#8A8680]">Up to 2 appts</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold bg-[#FF6B4A]/5">✅ Unlimited + Sync</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Unlimited + Sync</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Clinic PIMS Roster</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Encrypted Medical Vault Profiles</td>
                    <td className="py-2 px-3 text-center text-[#8A8680]">1 Dog Profile</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold bg-[#FF6B4A]/5">Up to 3 Dog Profiles</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">Unlimited Dogs</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">Unlimited Patients</td>
                  </tr>

                  {/* Category: Professional & B2B */}
                  <tr className="bg-stone-50 dark:bg-stone-900/50 font-black text-[0.7rem] uppercase text-[#8A8680]">
                    <td colSpan={5} className="py-2 px-3">4. Professional Breeder & Clinic Infrastructure</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Breeder Pro Suite (Litters, Pairings, CRM)</td>
                    <td className="py-2 px-3 text-center text-[#8A8680]">❌</td>
                    <td className="py-2 px-3 text-center text-[#8A8680]">❌</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Full Breeder Suite</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ Full Breeder Suite</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">White-Label Clinic Embed Widget & Staff Logins</td>
                    <td className="py-2 px-3 text-center text-[#8A8680]">❌</td>
                    <td className="py-2 px-3 text-center text-[#8A8680]">❌</td>
                    <td className="py-2 px-3 text-center text-[#8A8680]">❌</td>
                    <td className="py-2 px-3 text-center text-[#2D8C6F] font-bold">✅ 10 Staff Seats + Widget</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* À La Carte Options & High-Trust Assurance */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl shadow-[2px_2px_0_#1A1A1A]">
            <div className="flex items-center gap-2 font-black text-xs uppercase text-[#FF6B4A] mb-1">
              <Mic className="w-4 h-4" /> Single Audio Pass ($1.99)
            </div>
            <p className="text-[0.72rem] text-[#8A8680] dark:text-[#9A9590]">
              Need just one specialized triage consultation? Purchase an à la carte Neural Studio audio pass with zero recurring commitment.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl shadow-[2px_2px_0_#1A1A1A]">
            <div className="flex items-center gap-2 font-black text-xs uppercase text-amber-600 mb-1">
              <FileText className="w-4 h-4" /> Keepsake Bound Passport ($19.99)
            </div>
            <p className="text-[0.72rem] text-[#8A8680] dark:text-[#9A9590]">
              Archival, foil-stamped hardcover canine health book with permanent vaccine stamps and QR emergency vault verification.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl shadow-[2px_2px_0_#1A1A1A]">
            <div className="flex items-center gap-2 font-black text-xs uppercase text-[#2D8C6F] mb-1">
              <CreditCard className="w-4 h-4" /> Stripe Payment Ready
            </div>
            <p className="text-[0.72rem] text-[#8A8680] dark:text-[#9A9590]">
              Enterprise 256-bit AES encryption. Apple Pay, Google Pay, and major cards supported. Cancel or switch tiers at any time.
            </p>
          </div>
        </div>

        {/* Bottom Home Return Button & Footer */}
        <div className="mt-8 pt-6 border-t-2 border-dashed border-[#1A1A1A]/15 dark:border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#1A1A1A] dark:text-[#F0ECE6]">
            <Shield className="w-4 h-4 text-[#2D8C6F] shrink-0" />
            <span>100% Risk-Free Guarantee • Cancel Anytime • Evidence-Based Canine Longevity</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#FF6B4A] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] hover:bg-[#ff5a36] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Calculator & Main App</span>
          </button>
        </div>

      </div>
    </div>
  );
}
