/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  Heart, 
  HelpCircle, 
  Clock, 
  ShieldAlert, 
  Smile, 
  Moon, 
  Activity, 
  Compass, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  Volume2,
  Building2,
  Briefcase,
  Award,
  ExternalLink,
  BookOpen,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Breed, DogSize } from '../types.ts';
import { 
  getCanineCognitiveArchetype, 
  getAgeCalibratedActivityPlan, 
  TOP_FIVE_BRAIN_GAMES,
  getDaycareCompatibilityProfile
} from '../utils/caninePsychologyData.ts';

interface CaninePsychologyEnrichmentProps {
  breed: Breed;
  age: number;
  stageName: string;
}

export const CaninePsychologyEnrichment: React.FC<CaninePsychologyEnrichmentProps> = ({
  breed,
  age,
  stageName
}) => {
  const [activeTab, setActiveTab] = useState<'mind' | 'activities' | 'temperament' | 'games' | 'daycare'>('mind');
  const [selectedStageTab, setSelectedStageTab] = useState<string>(stageName);
  const [expandedGameIndex, setExpandedGameIndex] = useState<number | null>(0);
  const [showCredDetails, setShowCredDetails] = useState<boolean>(true);
  const [selectedPressureId, setSelectedPressureId] = useState<string | null>('rto-mandates');

  const archetype = getCanineCognitiveArchetype(breed.name, breed.group, breed.size);
  const currentActivityPlan = getAgeCalibratedActivityPlan(selectedStageTab, breed.size, age);
  const daycareProfile = getDaycareCompatibilityProfile(breed.name, breed.group, breed.size, age, stageName);

  const stageOptions = [
    { key: 'Puppy', label: 'Puppyhood (0-1.5y)', icon: '🐾' },
    { key: 'Young', label: 'Young Adult (1.5-4y)', icon: '⚡' },
    { key: 'Adult', label: 'Mature Adult (4-8y)', icon: '🌿' },
    { key: 'Senior', label: 'Senior / Golden (8y+)', icon: '👑' }
  ];

  return (
    <div className="bg-white dark:bg-[#201D1A] border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[5px_5px_0_#9333EA] dark:shadow-[5px_5px_0_#C084FC] rounded-2xl p-6 md:p-8 no-print transition-all">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-stone-200 dark:border-stone-800">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-purple-500/15 border-2 border-purple-500 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-purple-600 text-white text-[0.62rem] font-mono font-black uppercase rounded tracking-wider">
                Canine Cognition & Ethology
              </span>
              <span className="text-[0.68rem] font-mono text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Duke & Fear Free Grounded
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#1A1A1A] dark:text-[#F0ECE6] mt-1 font-mono">
              The {breed.name} Mind: Psychology & Activities
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 font-medium mt-0.5 max-w-2xl">
              What is your dog truly thinking? What do they want from you? Discover their cognitive archetype, emotional sensitivities, and age-calibrated activity architecture.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-stone-300 dark:border-stone-700">
          <button
            onClick={() => setActiveTab('mind')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'mind'
                ? 'bg-purple-600 text-white shadow-[2px_2px_0_#1A1A1A]'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inner Mind</span>
          </button>

          <button
            onClick={() => setActiveTab('temperament')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'temperament'
                ? 'bg-purple-600 text-white shadow-[2px_2px_0_#1A1A1A]'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Temperament</span>
          </button>

          <button
            onClick={() => setActiveTab('activities')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'activities'
                ? 'bg-purple-600 text-white shadow-[2px_2px_0_#1A1A1A]'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Age Activities</span>
          </button>

          <button
            onClick={() => setActiveTab('games')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'games'
                ? 'bg-purple-600 text-white shadow-[2px_2px_0_#1A1A1A]'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Brain Games</span>
          </button>

          <button
            onClick={() => setActiveTab('daycare')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'daycare'
                ? 'bg-purple-600 text-white shadow-[2px_2px_0_#1A1A1A]'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Daycare & Work Life</span>
          </button>
        </div>
      </div>

      {/* INSTITUTIONAL CREDENTIALS & REFERENCE BODIES ATTRIBUTION */}
      <div className="mt-5 p-4 rounded-xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-stone-50/80 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-stone-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-indigo-100 dark:border-indigo-900/40">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-[0.68rem] font-mono font-black uppercase text-indigo-900 dark:text-indigo-200 tracking-wider">
              Accredited Cognitive Ethology Reference Bodies & Scientific Leadership
            </span>
          </div>
          <button
            onClick={() => setShowCredDetails(!showCredDetails)}
            className="text-[0.62rem] font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            {showCredDetails ? 'Collapse Research Dossiers' : 'Inspect Scientific Leads & Methodologies'}
            {showCredDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* 3 Reference Bodies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          {/* Body 1: Duke Canine Cognition Center */}
          <div className="p-3 bg-white dark:bg-[#1C1A17] rounded-lg border border-indigo-100 dark:border-indigo-900/40 flex flex-col justify-between shadow-xs">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[0.6rem] font-mono font-black uppercase bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">
                  Duke Cognition
                </span>
                <span className="text-[0.6rem] font-mono text-stone-400">Duke University</span>
              </div>
              <h5 className="text-xs font-mono font-black text-[#1A1A1A] dark:text-[#F0ECE6]">
                Duke Canine Cognition Center
              </h5>
              <div className="text-[0.68rem] font-bold text-indigo-600 dark:text-indigo-400">
                Lead: Dr. Brian Hare
              </div>
              <p className="text-[0.65rem] text-stone-500 dark:text-stone-400">
                Professor of Evolutionary Anthropology; Author of <em>The Genius of Dogs</em>; Founder of Dognition.
              </p>
              {showCredDetails && (
                <div className="space-y-1 pt-1.5 border-t border-stone-100 dark:border-stone-800 text-[0.62rem] text-stone-600 dark:text-stone-300">
                  <div><strong className="text-stone-700 dark:text-stone-200">Domain:</strong> Cognitive Archetyping, Communicative Gaze & Cooperative Problem-Solving.</div>
                  <div className="italic text-stone-500">Hare, B. et al. (2002/2019) Science & Dutton.</div>
                </div>
              )}
            </div>
            <a 
              href="https://evolutionaryanthropology.duke.edu/research/dogs" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-2 text-[0.62rem] font-mono font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 flex items-center gap-1"
            >
              <span>Visit Duke Lab</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          {/* Body 2: The Family Dog Project */}
          <div className="p-3 bg-white dark:bg-[#1C1A17] rounded-lg border border-purple-100 dark:border-purple-900/40 flex flex-col justify-between shadow-xs">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[0.6rem] font-mono font-black uppercase bg-purple-500/15 text-purple-700 dark:text-purple-300">
                  ELTE Ethology
                </span>
                <span className="text-[0.6rem] font-mono text-stone-400">Budapest, Hungary</span>
              </div>
              <h5 className="text-xs font-mono font-black text-[#1A1A1A] dark:text-[#F0ECE6]">
                The Family Dog Project
              </h5>
              <div className="text-[0.68rem] font-bold text-purple-600 dark:text-purple-400">
                Lead: Dr. Ádám Miklósi & Dr. Enikő Kubinyi
              </div>
              <p className="text-[0.65rem] text-stone-500 dark:text-stone-400">
                Eötvös Loránd University; World's largest canine ethology research group (Est. 1994).
              </p>
              {showCredDetails && (
                <div className="space-y-1 pt-1.5 border-t border-stone-100 dark:border-stone-800 text-[0.62rem] text-stone-600 dark:text-stone-300">
                  <div><strong className="text-stone-700 dark:text-stone-200">Domain:</strong> Human-Canine Attachment Ethology, Canine Social Competence & Cognitive Aging (CCD).</div>
                  <div className="italic text-stone-500">Miklósi, Á. (2014) Oxford Univ Press; Kubinyi et al. GeroScience.</div>
                </div>
              )}
            </div>
            <a 
              href="https://familydogproject.elte.hu/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-2 text-[0.62rem] font-mono font-bold text-purple-600 hover:text-purple-800 dark:text-purple-400 flex items-center gap-1"
            >
              <span>Visit ELTE Project</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          {/* Body 3: Fear Free Pets */}
          <div className="p-3 bg-white dark:bg-[#1C1A17] rounded-lg border border-amber-100 dark:border-amber-900/40 flex flex-col justify-between shadow-xs">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[0.6rem] font-mono font-black uppercase bg-amber-500/15 text-amber-800 dark:text-amber-300">
                  Fear Free®
                </span>
                <span className="text-[0.6rem] font-mono text-stone-400">Clinical Veterinary</span>
              </div>
              <h5 className="text-xs font-mono font-black text-[#1A1A1A] dark:text-[#F0ECE6]">
                Fear Free Pets Initiative
              </h5>
              <div className="text-[0.68rem] font-bold text-amber-700 dark:text-amber-400">
                Lead: Dr. Marty Becker, DVM
              </div>
              <p className="text-[0.65rem] text-stone-500 dark:text-stone-400">
                "America's Veterinarian", Founder of Fear Free®; 150,000+ Certified Veterinary Professionals.
              </p>
              {showCredDetails && (
                <div className="space-y-1 pt-1.5 border-t border-stone-100 dark:border-stone-800 text-[0.62rem] text-stone-600 dark:text-stone-300">
                  <div><strong className="text-stone-700 dark:text-stone-200">Domain:</strong> FAS Spectrum (Fear, Anxiety & Stress), Low-Stress Handling & Sensory Decompression.</div>
                  <div className="italic text-stone-500">Becker, M. et al. (2018) 'From Fearful to Fear Free'.</div>
                </div>
              )}
            </div>
            <a 
              href="https://fearfreepets.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-2 text-[0.62rem] font-mono font-bold text-amber-700 hover:text-amber-900 dark:text-amber-400 flex items-center gap-1"
            >
              <span>Visit Fear Free®</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>

      {/* TAB 1: INNER MIND & WHAT THEY WANT */}
      {activeTab === 'mind' && (
        <div className="mt-6 space-y-6">
          {/* Inner Monologue Quote Card */}
          <div className="p-5 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-purple-500/10 border-2 border-purple-500/30 rounded-xl relative overflow-hidden">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-mono text-xs font-black uppercase tracking-wider mb-2">
              <Volume2 className="w-4 h-4" />
              <span>What is Your {breed.name} Thinking Right Now?</span>
            </div>
            <p className="text-base md:text-lg font-serif italic text-stone-800 dark:text-stone-100 leading-relaxed pl-2 border-l-4 border-purple-500">
              {archetype.innerMonologue}
            </p>
            <p className="text-[0.68rem] font-mono text-stone-500 dark:text-stone-400 mt-3">
              Cognitive Ethology Translation: Reflects the primary sensory processing and motivation channel for the {breed.name} archetype.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What They Truly Want */}
            <div className="p-5 bg-stone-50 dark:bg-[#181614] border-2 border-stone-200 dark:border-stone-800 rounded-xl">
              <h4 className="text-sm font-mono font-black uppercase text-[#1A1A1A] dark:text-[#F0ECE6] flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>What {breed.name}s Truly Want From Their Humans</span>
              </h4>
              <ul className="space-y-2.5">
                {archetype.whatTheyWant.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Canine Theory of Mind: Debunking Guilt & Spite */}
            <div className="p-5 bg-stone-50 dark:bg-[#181614] border-2 border-stone-200 dark:border-stone-800 rounded-xl">
              <h4 className="text-sm font-mono font-black uppercase text-[#1A1A1A] dark:text-[#F0ECE6] flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>Canine Emotional Spectrum & Theory of Mind</span>
              </h4>
              <div className="space-y-2.5 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                <p>
                  <strong>Cognitive Equivalence:</strong> Dogs possess the emotional and cognitive maturity of a <strong>2 to 2.5-year-old human child</strong> (Dr. Stanley Coren, UBC).
                </p>
                <p>
                  <strong>What They Truly Feel:</strong> Deep joy, intense fear, social attachment, curiosity, frustration, and love (oxytocin surges when gazing at their guardians).
                </p>
                <p className="p-2.5 bg-amber-500/10 border-l-2 border-amber-500 rounded text-[0.72rem] text-stone-700 dark:text-stone-300">
                  <strong>The Myth of "Guilt" or "Spite":</strong> Dogs do not possess human spite. The classic "guilty look" (head lowered, eyes averted, lip-licking) is pure <em>appeasement signaling</em> in response to tense human posture and voice—not an admission of moral wrongdoing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEMPERAMENT & BEHAVIORAL PROFILE */}
      {activeTab === 'temperament' && (
        <div className="mt-6 space-y-6">
          <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50 rounded-xl">
            <h4 className="text-sm font-black font-mono uppercase text-purple-900 dark:text-purple-300 flex items-center gap-2">
              <Compass className="w-4 h-4" /> {archetype.archetypeTitle}
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 font-medium">
              {archetype.tagline}. {archetype.thinkingStyle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Playfulness Meter */}
            <div className="p-4 bg-stone-50 dark:bg-[#181614] border-2 border-stone-200 dark:border-stone-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.68rem] font-mono font-bold text-stone-400 uppercase">Playfulness</span>
                <span className="text-xs font-mono font-black text-purple-600 dark:text-purple-400">
                  {archetype.playfulnessScore}/10
                </span>
              </div>
              <div className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-purple-600 rounded-full"
                  style={{ width: `${archetype.playfulnessScore * 10}%` }}
                />
              </div>
              <p className="text-[0.7rem] text-stone-600 dark:text-stone-300 leading-snug">
                {archetype.playfulnessDesc}
              </p>
            </div>

            {/* Intelligence Archetype */}
            <div className="p-4 bg-stone-50 dark:bg-[#181614] border-2 border-stone-200 dark:border-stone-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.68rem] font-mono font-bold text-stone-400 uppercase">Intelligence Style</span>
                <Brain className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <strong className="block text-xs font-mono font-black text-[#1A1A1A] dark:text-[#F0ECE6] mb-1.5">
                {archetype.intelligenceType}
              </strong>
              <p className="text-[0.7rem] text-stone-600 dark:text-stone-300 leading-snug">
                {archetype.intelligenceDesc}
              </p>
            </div>

            {/* Layback vs Alert Meter */}
            <div className="p-4 bg-stone-50 dark:bg-[#181614] border-2 border-stone-200 dark:border-stone-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.68rem] font-mono font-bold text-stone-400 uppercase">Layback / Chill Factor</span>
                <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400">
                  {archetype.laybackScore}/10
                </span>
              </div>
              <div className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-emerald-500 rounded-full"
                  style={{ width: `${archetype.laybackScore * 10}%` }}
                />
              </div>
              <p className="text-[0.7rem] text-stone-600 dark:text-stone-300 leading-snug">
                {archetype.laybackDesc}
              </p>
            </div>

            {/* Fear & Sensitivity Threshold */}
            <div className="p-4 bg-stone-50 dark:bg-[#181614] border-2 border-stone-200 dark:border-stone-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.68rem] font-mono font-bold text-stone-400 uppercase">Fear Sensitivity</span>
                <span className="text-xs font-mono font-black text-rose-600 dark:text-rose-400">
                  {archetype.fearSensitivityScore}/10
                </span>
              </div>
              <div className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full"
                  style={{ width: `${archetype.fearSensitivityScore * 10}%` }}
                />
              </div>
              <p className="text-[0.68rem] text-stone-600 dark:text-stone-300 leading-tight">
                <strong>Triggers:</strong> {archetype.fearTriggers.slice(0, 2).join('; ')}
              </p>
            </div>
          </div>

          {/* Emotional Security Shield Advice */}
          <div className="p-4 bg-rose-500/10 border-2 border-rose-500/30 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-mono font-black uppercase text-rose-900 dark:text-rose-300">
                Emotional Security Protocol for {breed.name}
              </h5>
              <p className="text-xs text-stone-700 dark:text-stone-300 mt-1 leading-relaxed">
                {archetype.emotionalSecurityAdvice}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AGE-CALIBRATED RECOMMENDED ACTIVITIES */}
      {activeTab === 'activities' && (
        <div className="mt-6 space-y-6">
          {/* Stage Selector Pills */}
          <div className="flex flex-wrap items-center gap-2 p-2 bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-stone-300 dark:border-stone-700">
            <span className="text-[0.68rem] font-mono font-bold text-stone-500 uppercase px-2">Select Life Stage:</span>
            {stageOptions.map(st => (
              <button
                key={st.key}
                onClick={() => setSelectedStageTab(st.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedStageTab.toLowerCase().includes(st.key.toLowerCase())
                    ? 'bg-[#1A1A1A] dark:bg-[#F0ECE6] text-white dark:text-[#1A1A1A] shadow-[2px_2px_0_#9333EA]'
                    : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600'
                }`}
              >
                <span>{st.icon}</span>
                <span>{st.label}</span>
              </button>
            ))}
          </div>

          {/* Active Stage Overview Card */}
          <div className="p-5 bg-gradient-to-br from-purple-500/10 via-stone-100/50 dark:via-stone-900/50 to-amber-500/10 border-2 border-stone-300 dark:border-stone-700 rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-[0.65rem] font-mono uppercase font-black text-purple-600 dark:text-purple-400">
                  {currentActivityPlan.ageSpan}
                </span>
                <h4 className="text-lg font-black font-mono uppercase text-[#1A1A1A] dark:text-[#F0ECE6]">
                  {currentActivityPlan.stageName}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Sleep: {currentActivityPlan.sleepRequirementHours.split(' ')[0]}h/day</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-white dark:bg-[#1E1C18] rounded-lg border border-stone-200 dark:border-stone-800">
                <span className="text-[0.65rem] font-mono uppercase font-bold text-stone-400 block mb-1">
                  Daily Exercise Cadence & Rule
                </span>
                <p className="text-xs text-stone-800 dark:text-stone-200 font-medium">
                  {currentActivityPlan.exerciseRule}
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-[#1E1C18] rounded-lg border border-stone-200 dark:border-stone-800">
                <span className="text-[0.65rem] font-mono uppercase font-bold text-stone-400 block mb-1">
                  Growth Plates & Orthopedic Integrity
                </span>
                <p className="text-xs text-stone-800 dark:text-stone-200 font-medium">
                  {currentActivityPlan.growthPlateGuidance}
                </p>
              </div>
            </div>
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Physical Activities */}
            <div className="p-5 bg-stone-50 dark:bg-[#181614] border-2 border-stone-200 dark:border-stone-800 rounded-xl space-y-3">
              <h5 className="text-xs font-mono font-black uppercase text-[#1A1A1A] dark:text-[#F0ECE6] flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>Recommended Physical Activities</span>
              </h5>
              <div className="space-y-3">
                {currentActivityPlan.recommendedPhysicalActivities.map((act, i) => (
                  <div key={i} className="p-3 bg-white dark:bg-[#201D1A] rounded-lg border border-stone-200 dark:border-stone-800">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-xs font-bold text-[#1A1A1A] dark:text-[#F0ECE6]">
                        {act.title}
                      </strong>
                      <span className="text-[0.65rem] font-mono font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded">
                        {act.duration}
                      </span>
                    </div>
                    <p className="text-[0.72rem] text-stone-600 dark:text-stone-300 leading-snug">
                      {act.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mental Enrichment & Brain Games */}
            <div className="p-5 bg-stone-50 dark:bg-[#181614] border-2 border-stone-200 dark:border-stone-800 rounded-xl space-y-3">
              <h5 className="text-xs font-mono font-black uppercase text-[#1A1A1A] dark:text-[#F0ECE6] flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-500" />
                <span>Recommended Mental Enrichment (Brain Work)</span>
              </h5>
              <div className="space-y-3">
                {currentActivityPlan.recommendedMentalEnrichment.map((enrich, i) => (
                  <div key={i} className="p-3 bg-white dark:bg-[#201D1A] rounded-lg border border-stone-200 dark:border-stone-800">
                    <strong className="text-xs font-bold text-purple-700 dark:text-purple-300 block mb-0.5">
                      {enrich.title}
                    </strong>
                    <p className="text-[0.7rem] text-stone-500 dark:text-stone-400 mb-1">
                      <em>Cognitive Benefit:</em> {enrich.mentalBenefit}
                    </p>
                    <p className="text-[0.72rem] text-stone-700 dark:text-stone-300 leading-snug">
                      <strong>How:</strong> {enrich.howToPlay}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Life Stage Emotional Caution & Sleep Insight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-amber-500/10 border-2 border-amber-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[0.62rem] font-mono uppercase font-black text-amber-700 dark:text-amber-400 block">
                  Clinical Caution For This Stage
                </span>
                <p className="text-xs text-stone-700 dark:text-stone-300 mt-1 leading-relaxed">
                  {currentActivityPlan.caution}
                </p>
              </div>
            </div>

            <div className="p-4 bg-indigo-500/10 border-2 border-indigo-500/30 rounded-xl flex items-start gap-3">
              <Moon className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[0.62rem] font-mono uppercase font-black text-indigo-700 dark:text-indigo-400 block">
                  Restorative Sleep Architecture
                </span>
                <p className="text-xs text-stone-700 dark:text-stone-300 mt-1 leading-relaxed">
                  {currentActivityPlan.sleepRequirementHours}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 5 PROVEN BRAIN GAMES */}
      {activeTab === 'games' && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <h4 className="text-sm font-mono font-black uppercase text-purple-900 dark:text-purple-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              5 Clinically Proven Brain Games (Playable at Home Today)
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
              Research at Duke Canine Cognition Center proves that <strong>15 minutes of structured scent and mental problem solving expends more autonomic energy and lowers cortisol more effectively</strong> than an exhausting 60-minute physical trot.
            </p>
          </div>

          <div className="space-y-3">
            {TOP_FIVE_BRAIN_GAMES.map((game, idx) => {
              const isExpanded = expandedGameIndex === idx;
              return (
                <div 
                  key={idx}
                  className="border-2 border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden bg-stone-50/50 dark:bg-[#181614]/50"
                >
                  <button
                    onClick={() => setExpandedGameIndex(isExpanded ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-mono font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <h5 className="text-xs md:text-sm font-mono font-black uppercase text-[#1A1A1A] dark:text-[#F0ECE6]">
                          {game.title}
                        </h5>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[0.62rem] font-mono font-bold px-1.5 py-0.5 bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded">
                            {game.difficulty}
                          </span>
                          <span className="text-[0.62rem] font-mono text-stone-500">
                            Prep: {game.prepTime}
                          </span>
                          <span className="text-[0.62rem] font-mono text-purple-600 dark:text-purple-400 font-bold">
                            {game.burnRateVsWalking}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-stone-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-[#201D1A] space-y-3">
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                        <strong className="text-purple-700 dark:text-purple-300 block mb-1">
                          Step-by-Step Instructions:
                        </strong>
                        {game.instructions}
                      </div>

                      <div className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>
                          <strong>Clinical & Neurochemical Impact:</strong> {game.cognitiveBenefit}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: DAYCARE & MODERN WORKING LIFE */}
      {activeTab === 'daycare' && (
        <div className="mt-6 space-y-6">
          {/* Section 1: Modern Working Dilemma Banner */}
          <div className="p-5 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-stone-100/50 dark:to-stone-900/50 border-2 border-indigo-300 dark:border-indigo-700/60 rounded-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-[0.65rem] font-mono uppercase font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  Modern Pet Parenting & Canine Ethology Synthesis
                </span>
                <h4 className="text-lg font-black font-mono uppercase text-[#1A1A1A] dark:text-[#F0ECE6]">
                  Modern Activities, Daycare Realities & {breed.name} Compatibility
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-lg text-xs font-mono font-black uppercase tracking-wider ${daycareProfile.verdictBadgeColor}`}>
                  {daycareProfile.verdict}
                </span>
                <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-xs font-mono font-black">
                  {daycareProfile.suitabilityScore}/10 Daycare Score
                </span>
              </div>
            </div>

            <p className="mt-3 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Modern career structures, return-to-office (RTO) policies, dense apartment dwellings, and multi-hour commutes have fundamentally altered canine domestic life. While commercial daycare is widely marketed as an all-day playground, veterinary ethology reveals that <strong>dogs are not herd animals</strong>. Below is an evidence-based audit of why modern parents rely on daycare, how {breed.name}s biologically cope in group rooms, and how stress manifests per age and breed.
            </p>

            {/* Breed Pack Dynamics & Coping Mechanisms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-3.5 bg-white dark:bg-[#1E1C18] rounded-lg border border-stone-200 dark:border-stone-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[0.65rem] font-mono uppercase font-bold text-stone-400">
                    Daycare Pack Dynamic Role
                  </span>
                  <span className="text-[0.65rem] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {breed.name}
                  </span>
                </div>
                <strong className="text-xs font-mono text-indigo-700 dark:text-indigo-300 block">
                  {daycareProfile.packDynamicRole}
                </strong>
                <p className="text-[0.72rem] text-stone-600 dark:text-stone-300 leading-snug">
                  {daycareProfile.breedCopingMechanism}
                </p>
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[0.68rem] text-stone-500">
                  <span className="font-bold text-rose-600 dark:text-rose-400">Arousal Risk:</span> {daycareProfile.arousalRiskFactor}
                </div>
              </div>

              <div className="p-3.5 bg-white dark:bg-[#1E1C18] rounded-lg border border-stone-200 dark:border-stone-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[0.65rem] font-mono uppercase font-bold text-stone-400">
                    Current Age Reality ({daycareProfile.ageSpecificReality.stageTitle})
                  </span>
                  <span className="text-[0.65rem] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Age {age.toFixed(1)}y
                  </span>
                </div>
                <span className="text-xs font-bold text-[#1A1A1A] dark:text-[#F0ECE6] block">
                  Max Safe Duration: {daycareProfile.ageSpecificReality.recommendedMaxHours}
                </span>
                <p className="text-[0.72rem] text-stone-600 dark:text-stone-300 leading-snug">
                  {daycareProfile.ageSpecificReality.criticalRule}
                </p>
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[0.68rem] text-stone-500">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Handler Directive:</span> {daycareProfile.handlerInterventionNeed}
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-xs text-stone-700 dark:text-stone-300 leading-relaxed border-l-4 border-indigo-600">
              <strong>Clinical Ethology Guidance:</strong> {daycareProfile.ageSpecificReality.daycareImpact}
            </div>
          </div>

          {/* Section 2: The Modern Pressures - Why Pet Parents Rely on Daycare */}
          <div className="p-5 bg-stone-50 dark:bg-[#181614] border-2 border-stone-200 dark:border-stone-800 rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[0.65rem] font-mono uppercase font-bold text-stone-400">
                  Societal & Workplace Context
                </span>
                <h5 className="text-sm font-mono font-black uppercase text-[#1A1A1A] dark:text-[#F0ECE6] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>The Modern Pressures Forcing Pet Parents into Daycare</span>
                </h5>
              </div>
              <span className="text-[0.7rem] text-indigo-600 dark:text-indigo-400 font-mono font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                Click any scenario below to inspect canine biological impact
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {daycareProfile.modernPressures.map((item) => {
                const isSelected = selectedPressureId === item.id;
                return (
                  <button 
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedPressureId(isSelected ? null : item.id)}
                    className={`p-3.5 text-left rounded-lg border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/50 border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/50 shadow-md'
                        : 'bg-white dark:bg-[#201D1A] border-stone-200 dark:border-stone-800 hover:border-indigo-400 hover:shadow-xs'
                    }`}
                  >
                    <div className="space-y-1.5 w-full">
                      <div className="flex items-center justify-between text-[0.65rem] font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400">
                        <span>{item.category}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[0.6rem] font-mono font-black ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                        }`}>
                          {isSelected ? '✓ Inspecting Biology' : 'Click to Inspect'}
                        </span>
                      </div>
                      <strong className="text-xs font-bold text-[#1A1A1A] dark:text-[#F0ECE6] block leading-snug">
                        {item.pressureTitle}
                      </strong>
                      <div className="p-2 bg-stone-50 dark:bg-stone-900/60 rounded text-[0.68rem] text-stone-600 dark:text-stone-300 leading-relaxed">
                        <span className="font-bold text-stone-500 block text-[0.62rem] uppercase font-mono">Parent Dilemma:</span>
                        {item.parentReality}
                      </div>
                      <div className="p-2 bg-amber-500/10 rounded text-[0.68rem] text-amber-900 dark:text-amber-300 leading-relaxed">
                        <span className="font-bold text-amber-700 dark:text-amber-400 block text-[0.62rem] uppercase font-mono">Canine Biology:</span>
                        {item.canineBiologicalImpact}
                      </div>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800 text-[0.68rem] text-emerald-700 dark:text-emerald-400 font-medium w-full">
                      <span className="font-bold text-[0.62rem] uppercase font-mono block">Ethology Verdict:</span>
                      {item.clinicalEthologyVerdict}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ACTIVE SCENARIO BIOLOGICAL IMPACT INSPECTION PANEL */}
            {(() => {
              const selectedPressure = daycareProfile.modernPressures.find(p => p.id === selectedPressureId);
              if (!selectedPressure) return null;
              return (
                <div className="mt-4 p-4.5 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white rounded-xl border-2 border-indigo-400 shadow-xl space-y-3.5 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-indigo-800/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[0.65rem] font-mono font-black uppercase text-indigo-300 tracking-wider">
                        Biological Impact Deep Dive
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        • {selectedPressure.pressureTitle}
                      </span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setSelectedPressureId(null)}
                      className="text-[0.65rem] font-mono text-indigo-300 hover:text-white underline cursor-pointer"
                    >
                      Close Inspection [×]
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {/* Neurochemical Impact */}
                    <div className="p-3 bg-indigo-900/60 rounded-lg border border-indigo-700/60 space-y-1.5">
                      <span className="text-[0.62rem] font-mono uppercase font-bold text-amber-300 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        1. Neurochemical & Endocrine Surge
                      </span>
                      <p className="text-[0.72rem] text-indigo-100 leading-relaxed font-sans">
                        {selectedPressure.neurochemicalImpact}
                      </p>
                    </div>

                    {/* Anatomical Stressor */}
                    <div className="p-3 bg-indigo-900/60 rounded-lg border border-indigo-700/60 space-y-1.5">
                      <span className="text-[0.62rem] font-mono uppercase font-bold text-rose-300 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                        2. Anatomical & Physiological Stressor
                      </span>
                      <p className="text-[0.72rem] text-indigo-100 leading-relaxed font-sans">
                        {selectedPressure.anatomicalStressor}
                      </p>
                    </div>

                    {/* Actionable Clinical Prescription */}
                    <div className="p-3 bg-emerald-950/70 rounded-lg border border-emerald-600/70 space-y-1.5">
                      <span className="text-[0.62rem] font-mono uppercase font-bold text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        3. Veterinarian-Prescribed Action Plan
                      </span>
                      <p className="text-[0.72rem] text-emerald-100 leading-relaxed font-sans">
                        {selectedPressure.actionablePrescription}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Section 3: How Dogs Deal With Daycare Across All 4 Life Stages */}
          <div className="p-5 bg-white dark:bg-[#1A1815] border-2 border-stone-200 dark:border-stone-800 rounded-xl space-y-4">
            <div>
              <span className="text-[0.65rem] font-mono uppercase font-bold text-purple-600 dark:text-purple-400">
                Developmental Ethology Matrix
              </span>
              <h5 className="text-sm font-mono font-black uppercase text-[#1A1A1A] dark:text-[#F0ECE6] flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>How Dogs Deal With Daycare Across Life Stages (Puppy to Senior)</span>
              </h5>
              <p className="text-[0.72rem] text-stone-500 mt-1">
                A dog's social threshold changes dramatically over its lifespan. While puppies are overwhelmed by lack of sleep, adults transition from "dog-social" to "dog-selective", and seniors face severe orthopedic hazards on daycare floors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {daycareProfile.allLifeStagesDaycareMatrix.map((stg) => {
                const isCurrent = (age < 0.6 && stg.stageKey === 'puppy') ||
                                  (age >= 0.6 && age < 1.8 && stg.stageKey === 'adolescent') ||
                                  (age >= 1.8 && age < 7.0 && stg.stageKey === 'adult') ||
                                  (age >= 7.0 && stg.stageKey === 'senior');
                return (
                  <div 
                    key={stg.stageKey}
                    className={`p-3.5 rounded-lg border-2 flex flex-col justify-between ${
                      isCurrent 
                        ? 'bg-purple-500/10 border-purple-500 dark:border-purple-400 ring-1 ring-purple-500' 
                        : 'bg-stone-50 dark:bg-[#201D1A] border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[0.65rem] font-mono font-black uppercase text-purple-600 dark:text-purple-400">
                          {stg.ageRange}
                        </span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 bg-purple-600 text-white rounded text-[0.6rem] font-mono font-bold uppercase">
                            Current Dog
                          </span>
                        )}
                      </div>
                      <strong className="text-xs font-bold text-[#1A1A1A] dark:text-[#F0ECE6] block">
                        {stg.stageTitle}
                      </strong>
                      <div className="text-[0.68rem] text-indigo-700 dark:text-indigo-300 font-mono font-bold">
                        Sleep Need: {stg.sleepRequirementHours}
                      </div>
                      <div className="text-[0.68rem] text-rose-600 dark:text-rose-400 font-mono font-bold">
                        Verdict: {stg.daycareSuitabilityVerdict}
                      </div>
                      <div className="p-2 bg-white dark:bg-[#181614] rounded border border-stone-200 dark:border-stone-800 text-[0.68rem] text-stone-600 dark:text-stone-300 leading-snug">
                        <span className="font-bold text-stone-500 block text-[0.6rem] uppercase">How They Cope in Pack:</span>
                        {stg.howDogDealsWithDaycare}
                      </div>
                      <div className="p-2 bg-rose-500/10 rounded text-[0.68rem] text-rose-900 dark:text-rose-300 leading-snug">
                        <span className="font-bold text-rose-700 dark:text-rose-400 block text-[0.6rem] uppercase">Biological Risks:</span>
                        {stg.biologicalRisks}
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-stone-200 dark:border-stone-800 text-[0.68rem] text-stone-700 dark:text-stone-300 font-medium">
                      <span className="font-bold text-purple-600 dark:text-purple-400 block text-[0.6rem] uppercase font-mono">Clinical Protocol:</span>
                      {stg.clinicalGuideline}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: 5 Daycare Burnout Signs vs Modern Solutions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stress & Burnout Signs */}
            <div className="p-5 bg-stone-50 dark:bg-[#181614] border-2 border-stone-200 dark:border-stone-800 rounded-xl space-y-3">
              <h5 className="text-xs font-mono font-black uppercase text-rose-700 dark:text-rose-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>5 Subtle Signs of Daycare Burnout & Stress</span>
              </h5>
              <p className="text-[0.72rem] text-stone-500 leading-relaxed">
                Many pet parents mistake a collapsed, unresponsive dog for "happy tired." Ethologists call this the <strong>"Daycare Hangover"</strong>—neurological exhaustion caused by hours of uninterrupted sensory overload and sustained cortisol release.
              </p>
              <div className="space-y-2.5">
                {daycareProfile.stressSignals.map((sig, i) => (
                  <div key={i} className="p-2.5 bg-white dark:bg-[#201D1A] rounded-lg border border-stone-200 dark:border-stone-800 text-[0.72rem] text-stone-700 dark:text-stone-300 leading-snug flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-rose-500/15 text-rose-600 font-mono text-[0.6rem] font-black flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{sig}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modern Workday Alternatives */}
            <div className="p-5 bg-stone-50 dark:bg-[#181614] border-2 border-stone-200 dark:border-stone-800 rounded-xl space-y-3">
              <h5 className="text-xs font-mono font-black uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>Guilt-Free Workday Solutions for Pet Parents</span>
              </h5>
              <p className="text-[0.72rem] text-stone-500 leading-relaxed">
                If your dog's temperament or age makes full-day daycare stressful, these evidence-based workplace routines keep them thriving without guilt:
              </p>
              <div className="space-y-2.5">
                {daycareProfile.modernWorkingParentAlternatives.map((alt, i) => (
                  <div key={i} className="p-2.5 bg-white dark:bg-[#201D1A] rounded-lg border border-stone-200 dark:border-stone-800">
                    <div className="flex items-center justify-between mb-0.5">
                      <strong className="text-xs font-bold text-[#1A1A1A] dark:text-[#F0ECE6]">
                        {alt.title}
                      </strong>
                    </div>
                    <span className="text-[0.65rem] font-mono text-emerald-600 dark:text-emerald-400 font-bold block mb-1">
                      Benefit: {alt.benefit}
                    </span>
                    <p className="text-[0.7rem] text-stone-600 dark:text-stone-300 leading-snug">
                      {alt.implementation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 5: Facility Evaluation Checklist */}
          <div className="p-5 bg-purple-500/10 border-2 border-purple-500/30 rounded-xl space-y-3">
            <h5 className="text-xs font-mono font-black uppercase text-purple-900 dark:text-purple-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>The 5 Non-Negotiable Questions Every Pet Parent Must Ask Daycare Facilities</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {daycareProfile.facilityEvaluationChecklist.map((chk, i) => (
                <div key={i} className="p-2.5 bg-white dark:bg-[#201D1A] rounded-lg border border-stone-200 dark:border-stone-800 text-[0.72rem] text-stone-700 dark:text-stone-300 leading-snug flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                  <span>{chk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaninePsychologyEnrichment;
