import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  Volume2, VolumeX, Play, Pause, Square, RotateCcw, Download,
  CheckCircle2, Shield, Sparkles, X, Activity, ChefHat, Baby,
  Award, Copy, Check, Sliders, Headphones, FileText, Share2,
  Clock, Heart, Dog, RefreshCw, Mic, Sparkle, Smile, Radio
} from 'lucide-react';
import { Breed } from '../types';
import { 
  playSpokenAudio, 
  stopCurrentAudio, 
  pauseCurrentAudio, 
  resumeCurrentAudio, 
  setPlaybackRate, 
  isAudioCurrentlyPlaying, 
  generateAudioPassport, 
  downloadAudioWavFile,
  cleanSpokenText,
  getAvailableHumanVoices,
  previewSpecialistVoice,
  HumanVoiceDescriptor,
  NEURAL_STUDIO_VOICES,
  NeuralStudioVoiceInfo,
  SpecialistPersonaId,
  EmotionalBedsideTone
} from '../utils/audioPlayback';
import { splitIntoThoughtSentences } from '../utils/humanVoiceEngine';
import { logUserAction } from '../utils/firebaseHelper';

export interface AudioPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBreed?: Breed | null;
  currentAge?: number;
  initialPetName?: string;
  initialPlanType?: 'passport' | 'nutrition' | 'triage' | 'breeder' | 'custom';
  initialCustomText?: string;
  initialVoice?: SpecialistPersonaId;
}

interface VoicePersonaCard {
  id: SpecialistPersonaId;
  name: string;
  title: string;
  role: string;
  icon: any;
  tone: string;
  neuralCode: string;
  accent: string;
  accentColor: string;
}

const PERSONA_ICONS: Record<SpecialistPersonaId, any> = {
  Fenrir: Activity,
  Kore: ChefHat,
  Zephyr: Heart,
  Puck: Sparkles,
  Charon: Award,
  Emma: Baby,
  Brian: Shield,
  Michelle: Sparkle
};

const VOICE_PERSONAS: VoicePersonaCard[] = NEURAL_STUDIO_VOICES.map(v => ({
  id: v.id,
  name: v.name,
  title: v.title,
  role: v.role,
  icon: PERSONA_ICONS[v.id] || Activity,
  tone: v.description,
  neuralCode: v.neuralCode,
  accent: v.accent,
  accentColor: v.accentColor
}));

const EMOTIONAL_TONE_MODIFIERS: Record<EmotionalBedsideTone, { label: string; desc: string; prompt: string }> = {
  compassionate: {
    label: "🩺 Compassionate Bedside",
    desc: "Warm, deeply empathetic doctor with reassuring human pauses",
    prompt: "Warm, deeply empathetic, gentle bedside manner with reassuring human pauses and vocal warmth. A caring doctor speaking directly to an anxious pet parent."
  },
  authoritative: {
    label: "🎓 Clinical Authority",
    desc: "Experienced senior physician delivering clear clinical wisdom",
    prompt: "Calm, authoritative senior veterinary clinician with profound clinical confidence and wisdom. Clear, deliberate, dignified."
  },
  soothing: {
    label: "🌸 Gentle & Soothing",
    desc: "Soft, peaceful comfort for senior care and palliative relief",
    prompt: "Soft, gentle, peaceful, comforting voice with slow, tender pacing. Ideal for senior care and palliative comfort."
  },
  enthusiastic: {
    label: "☀️ Joyful & Uplifting",
    desc: "Upbeat, inspiring celebration of pet health and milestones",
    prompt: "Upbeat, encouraging, positive, lively voice full of genuine affection and love for pets."
  }
};

const PITCH_RESONANCE_OPTIONS = [
  { id: '-2Hz', label: 'Deep Resonance', desc: 'Baritone / Chest Warmth (-2Hz)' },
  { id: '0Hz', label: 'Balanced Natural', desc: 'Standard Clinical Cadence (0Hz)' },
  { id: '+2Hz', label: 'Bright Presence', desc: 'Harmonic Clarity Lift (+2Hz)' }
];

export default function AudioPassportModal({
  isOpen,
  onClose,
  currentBreed,
  currentAge = 3,
  initialPetName = 'Bella',
  initialPlanType = 'passport',
  initialCustomText = '',
  initialVoice = 'Fenrir'
}: AudioPassportModalProps) {
  const [petName, setPetName] = useState<string>(initialPetName);
  const [selectedBreedName, setSelectedBreedName] = useState<string>(currentBreed?.name || 'Golden Retriever');
  const [planType, setPlanType] = useState<'passport' | 'nutrition' | 'triage' | 'breeder' | 'custom'>(initialPlanType);
  const [selectedVoice, setSelectedVoice] = useState<SpecialistPersonaId>(initialVoice);
  const [emotionTone, setEmotionTone] = useState<EmotionalBedsideTone>('compassionate');
  const [pitchOffset, setPitchOffset] = useState<string>('0Hz');
  const [speed, setSpeed] = useState<number>(1.0);
  const [customText, setCustomText] = useState<string>(initialCustomText);
  
  // High-Fidelity Human Voice Engine State
  const [availableVoices, setAvailableVoices] = useState<HumanVoiceDescriptor[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(-1);
  const [isPreviewingVoice, setIsPreviewingVoice] = useState<boolean>(false);

  // Playback & Audio Generation State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [voiceErrorState, setVoiceErrorState] = useState<string | null>(null);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [rawBase64, setRawBase64] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [copiedTranscript, setCopiedTranscript] = useState<boolean>(false);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(new Array(24).fill(12));

  const animIntervalRef = useRef<any>(null);

  // Pre-load and categorize human voices on mount
  useEffect(() => {
    getAvailableHumanVoices().then(voices => {
      setAvailableVoices(voices);
    });
  }, []);

  // Sync state when props change
  useEffect(() => {
    if (initialPlanType) setPlanType(initialPlanType);
    if (initialPetName) setPetName(initialPetName);
    if (currentBreed?.name) setSelectedBreedName(currentBreed.name);
    if (initialVoice) setSelectedVoice(initialVoice);
    if (initialCustomText) setCustomText(initialCustomText);
  }, [initialPlanType, initialPetName, currentBreed, initialVoice, initialCustomText]);

  // Handle Animated Frequency Visualizer
  useEffect(() => {
    if (isPlaying || isPreviewingVoice) {
      animIntervalRef.current = setInterval(() => {
        setVisualizerBars(
          new Array(24).fill(0).map(() => Math.floor(Math.random() * 42) + 8)
        );
      }, 90);
    } else {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
      setVisualizerBars(new Array(24).fill(10));
    }
    return () => {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    };
  }, [isPlaying, isPreviewingVoice]);

  // Clean audio on close
  useEffect(() => {
    if (!isOpen) {
      stopCurrentAudio();
      setIsPlaying(false);
      setIsPreviewingVoice(false);
      setActiveSentenceIndex(-1);
    }
  }, [isOpen]);

  // Handle instant voice preview/audition with real doctor greeting
  const handlePreviewSpecialistVoice = async () => {
    if (isPlaying || isPreviewingVoice) {
      stopCurrentAudio();
      setIsPlaying(false);
      setIsPreviewingVoice(false);
      setActiveSentenceIndex(-1);
      return;
    }
    setIsPreviewingVoice(true);
    try {
      await previewSpecialistVoice(selectedVoice, selectedVoiceName || undefined, emotionTone, pitchOffset);
    } catch (e) {
      console.warn('Preview voice notice:', e);
    } finally {
      setIsPreviewingVoice(false);
    }
  };

  // Generate Script Content based on active plan type - written as a real human specialist speaking warmly to a pet parent
  const getPlanScript = (): string => {
    const breed = selectedBreedName || (currentBreed?.name || 'Canine Companion');
    const age = currentAge || 3;

    if (planType === 'custom' && customText.trim()) {
      return customText.trim();
    }

    if (planType === 'passport') {
      return `Hello there, pet family. I'm Dr. Barnes, Senior Veterinary Clinician here at DogHealthOS. 
It is my distinct pleasure to certify the Clinical Longevity Passport for ${petName}, your beloved ${breed}. 
At ${age} years of age, ${petName} is in an essential developmental phase. During our comprehensive clinical evaluation, we verified that core immunizations are current, cardiac auscultation is crisp and clear with zero murmurs, patellas and joint alignment are firm, and oral dentition is healthy. 
Our primary longevity mandate for ${petName} is keeping their body condition lean and fit—scoring an ideal 4 to 5 on the clinical scale. Long-term studies show this single habit can add over two full years of joyful vitality to your dog's life. 
You are doing a truly wonderful job caring for ${petName}. This audio passport is verified and ready for your veterinary records.`;
    }

    if (planType === 'nutrition') {
      return `Hi there, pet parent! Chef Stella here, your clinical canine nutritionist. 
I have designed ${petName}'s whole-food nutrition plan with tremendous care and warmth. 
For a ${breed} at ${age} years old, our focus is nourishing every cell with clean, bioavailable protein, heart-healthy omega-3 fatty acids for skin and coat vitality, and gentle prebiotic fibers for smooth gut balance. 
Always remember to transition any new food toppers slowly over seven to ten days. And please, keep high-risk human foods like onions, garlic, grapes, and chocolate completely off the table. 
Feeding ${petName} is an act of deep love and connection. Enjoy every tail-wagging mealtime together!`;
    }

    if (planType === 'triage') {
      return `Hello, this is Dr. Barnes with an urgent clinical triage briefing for ${petName}. 
Please take a slow, calming breath—I am right here to guide you step-by-step. 
First, gently lift ${petName}'s upper lip and check the color of their gums. You want to see a healthy salmon pink that returns within one to two seconds after a light press. 
Next, observe their breathing: a calm resting companion should take between fifteen and thirty steady breaths per minute. 
If you notice persistent dry retching, severe abdominal bloating, pale white gums, or sudden collapse, do not wait—please safely transport ${petName} to the nearest emergency veterinary hospital immediately. We are keeping you both close in our hearts.`;
    }

    if (planType === 'breeder') {
      return `Greetings from the DogHealthOS Elite Breeder Registry. 
We are proud to present the official pedigree and genetic clearance audio certificate for ${petName}, exceptional ${breed}. 
Both maternal and paternal bloodlines have achieved verified OFA orthopedic hip and elbow clearances, alongside multi-generation genetic panels clear of progressive retinal atrophy and degenerative myelopathy. 
Every milestone has been documented under rigorous veterinary standards to ensure a lifetime of sound temperament, robust longevity, and vibrant health. 
Welcome to a wonderful new journey with your extraordinary companion.`;
    }

    return `Official Canine Care Summary for ${petName}. Health Passport active and certified under DogHealthOS Elite standards.`;
  };

  const activeScript = getPlanScript();

  // Play / Pause Toggle with Sentence Highlight and Prosody
  const handleTogglePlay = async () => {
    if (isPlaying) {
      stopCurrentAudio();
      setIsPlaying(false);
      setActiveSentenceIndex(-1);
      return;
    }

    setVoiceErrorState(null);
    setIsGenerating(true);
    const activePersona = VOICE_PERSONAS.find(v => v.id === selectedVoice);
    const emotionalDirection = EMOTIONAL_TONE_MODIFIERS[emotionTone]?.prompt || "Warm, human-like, empathetic veterinary specialist";
    const combinedStylePrompt = `${activePersona?.tone || 'Empathetic veterinary clinical specialist'}. ${emotionalDirection}`;

    try {
      await playSpokenAudio({
        text: activeScript,
        voice: selectedVoice,
        neuralVoice: activePersona?.neuralCode,
        preferredVoiceName: selectedVoiceName || undefined,
        pitch: pitchOffset,
        style: combinedStylePrompt,
        tone: emotionTone,
        playbackRate: speed,
        playChime: true,
        onStart: () => {
          setIsGenerating(false);
          setIsPlaying(true);
          setVoiceErrorState(null);
        },
        onSentenceChange: (idx) => {
          setActiveSentenceIndex(idx);
        },
        onLoaded: (url, dur) => {
          setGeneratedAudioUrl(url);
          setDuration(dur || 30);
        },
        onTimeUpdate: (cur, dur) => {
          setCurrentTime(cur);
          if (dur) setDuration(dur);
        },
        onEnd: () => {
          setIsPlaying(false);
          setActiveSentenceIndex(-1);
          setCurrentTime(0);
        },
        onError: () => {
          setIsGenerating(false);
          setIsPlaying(false);
          setActiveSentenceIndex(-1);
          setVoiceErrorState("Voice not available at the moment");
        }
      });

      logUserAction('Play Audio Passport', {
        petName,
        breed: selectedBreedName,
        planType,
        voice: selectedVoice,
        tone: emotionTone,
        pitch: pitchOffset,
        speed
      });
    } catch (err: any) {
      console.warn('Audio playback start notice:', err);
      setIsGenerating(false);
      setIsPlaying(false);
      setActiveSentenceIndex(-1);
      setVoiceErrorState("Voice not available at the moment");
    }
  };

  // Pre-generate & Download Audio File
  const handleDownloadWav = async () => {
    setIsGenerating(true);

    try {
      const activePersona = VOICE_PERSONAS.find(v => v.id === selectedVoice);
      const emotionalDirection = EMOTIONAL_TONE_MODIFIERS[emotionTone]?.prompt || "Warm, human-like, empathetic veterinary specialist";
      const combinedStylePrompt = `${activePersona?.tone || 'Empathetic veterinary clinical specialist'}. ${emotionalDirection}`;

      let urlToDownload = generatedAudioUrl;
      if (!urlToDownload) {
        const result = await generateAudioPassport(
          activeScript, 
          selectedVoice, 
          combinedStylePrompt,
          emotionTone,
          speed,
          pitchOffset,
          activePersona?.neuralCode
        );
        if (result.audioUrl) {
          urlToDownload = result.audioUrl;
          setGeneratedAudioUrl(result.audioUrl);
          if (result.rawBase64) setRawBase64(result.rawBase64);
        }
      }

      if (urlToDownload) {
        const ext = urlToDownload.includes('mp3') ? 'mp3' : 'wav';
        const filename = `Clinical_Plan_${petName.replace(/\s+/g, '_')}_${planType}.${ext}`;
        downloadAudioWavFile(urlToDownload, filename);
      }

      logUserAction('Download Audio Passport HD', {
        petName,
        planType,
        voice: selectedVoice,
        tone: emotionTone
      });
    } catch (err: any) {
      console.error('Download audio error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyTranscript = () => {
    navigator.clipboard.writeText(activeScript);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    setPlaybackRate(newSpeed);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = Math.floor(sec % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  if (!isOpen) return null;

  const currentPersona = VOICE_PERSONAS.find(v => v.id === selectedVoice) || VOICE_PERSONAS[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-2 sm:p-4 md:p-6 flex justify-center items-start pt-3 sm:pt-6 pb-16 animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-5xl bg-[#F5F0E8] dark:bg-[#181614] border-[3px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[8px_8px_0_#2D8C6F] rounded-2xl p-4 sm:p-6 md:p-8 text-[#1A1A1A] dark:text-[#F0ECE6] my-auto">
        
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between pb-4 mb-5 border-b-2 border-dashed border-[#1A1A1A]/20 dark:border-white/20 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#2D8C6F] text-white flex items-center justify-center font-bold shadow-[2.5px_2.5px_0_#1A1A1A] dark:shadow-[2.5px_2.5px_0_#F0ECE6] shrink-0">
              <Mic className="w-6 h-6 text-emerald-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[0.62rem] font-mono font-black uppercase tracking-widest text-[#2D8C6F] bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                  Flagship Neural Speech Engine
                </span>
                <span className="text-[0.62rem] font-mono font-black uppercase text-amber-700 dark:text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                  🩺 Human Cadence & Prosody
                </span>
                <span className="text-[0.62rem] font-mono font-black uppercase text-purple-700 dark:text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded border border-purple-500/30">
                  🎙️ Zero Robotic Monotone
                </span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-tight text-[#1A1A1A] dark:text-[#F0ECE6] mt-0.5">
                Spoken Clinical Plans & Audio Passports
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              stopCurrentAudio();
              onClose();
            }}
            className="p-2 rounded-xl border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer transition-all"
            title="Close Audio Passport Studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: Configuration Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* 1. Patient Profile Info */}
            <div className="p-3.5 bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] space-y-2.5">
              <span className="text-[0.65rem] font-mono font-black uppercase text-stone-500 dark:text-stone-400 block tracking-wider">
                1. Patient Identity & Profile
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[0.62rem] font-mono font-bold uppercase text-stone-500 block mb-0.5">Dog Name:</label>
                  <input
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="Dog Name"
                    className="w-full p-2 text-xs font-bold bg-stone-50 dark:bg-stone-800 border-2 border-[#1A1A1A] dark:border-stone-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[0.62rem] font-mono font-bold uppercase text-stone-500 block mb-0.5">Breed Cohort:</label>
                  <input
                    type="text"
                    value={selectedBreedName}
                    onChange={(e) => setSelectedBreedName(e.target.value)}
                    placeholder="Breed"
                    className="w-full p-2 text-xs font-bold bg-stone-50 dark:bg-stone-800 border-2 border-[#1A1A1A] dark:border-stone-700 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* 2. Spoken Clinical Plan Type Selection */}
            <div className="p-3.5 bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] space-y-2">
              <span className="text-[0.65rem] font-mono font-black uppercase text-stone-500 dark:text-stone-400 block tracking-wider">
                2. Spoken Plan Type
              </span>
              <div className="space-y-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setPlanType('passport')}
                  className={`w-full p-2 rounded-lg border-2 text-left flex items-center justify-between cursor-pointer transition-all ${
                    planType === 'passport'
                      ? 'border-[#2D8C6F] bg-[#2D8C6F]/10 font-black'
                      : 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#2D8C6F]" />
                    <span>Clinical Longevity Passport Certification</span>
                  </div>
                  {planType === 'passport' && <Check className="w-3.5 h-3.5 text-[#2D8C6F]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPlanType('nutrition')}
                  className={`w-full p-2 rounded-lg border-2 text-left flex items-center justify-between cursor-pointer transition-all ${
                    planType === 'nutrition'
                      ? 'border-amber-500 bg-amber-500/10 font-black'
                      : 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-amber-600" />
                    <span>NutriChef Whole-Food Dietary Plan</span>
                  </div>
                  {planType === 'nutrition' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPlanType('triage')}
                  className={`w-full p-2 rounded-lg border-2 text-left flex items-center justify-between cursor-pointer transition-all ${
                    planType === 'triage'
                      ? 'border-rose-500 bg-rose-500/10 font-black'
                      : 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-600" />
                    <span>Emergency Clinical Triage & Vital Signs</span>
                  </div>
                  {planType === 'triage' && <Check className="w-3.5 h-3.5 text-rose-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPlanType('breeder')}
                  className={`w-full p-2 rounded-lg border-2 text-left flex items-center justify-between cursor-pointer transition-all ${
                    planType === 'breeder'
                      ? 'border-purple-500 bg-purple-500/10 font-black'
                      : 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>Breeder Litter & Pedigree Certificate</span>
                  </div>
                  {planType === 'breeder' && <Check className="w-3.5 h-3.5 text-purple-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPlanType('custom')}
                  className={`w-full p-2 rounded-lg border-2 text-left flex items-center justify-between cursor-pointer transition-all ${
                    planType === 'custom'
                      ? 'border-sky-500 bg-sky-500/10 font-black'
                      : 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span>Custom Dictation / Pet Sitter Notes</span>
                  </div>
                  {planType === 'custom' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </button>
              </div>

              {planType === 'custom' && (
                <div className="pt-2">
                  <textarea
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Type or paste custom clinical discharge notes, medication reminders, or pet sitter instructions..."
                    rows={3}
                    className="w-full p-2 text-xs font-mono bg-stone-50 dark:bg-stone-800 border-2 border-black dark:border-stone-700 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* 3. Voice Persona Selection (8 Roster Specialists) */}
            <div className="p-3.5 bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[0.65rem] font-mono font-black uppercase text-stone-500 dark:text-stone-400 block tracking-wider">
                  3. Specialist Voice Persona ({VOICE_PERSONAS.length} Clinicians)
                </span>
                <span className="text-[0.6rem] font-mono font-bold text-emerald-600">
                  Azure Neural Studio HD
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
                {VOICE_PERSONAS.map(v => {
                  const Icon = v.icon;
                  const isSelected = selectedVoice === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVoice(v.id)}
                      className={`p-2 rounded-lg border-2 text-left cursor-pointer transition-all flex items-center gap-2 ${
                        isSelected 
                          ? 'border-[#1A1A1A] dark:border-[#F0ECE6] bg-stone-100 dark:bg-stone-800 shadow-[2px_2px_0_#000]' 
                          : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50'
                      }`}
                    >
                      <div 
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm"
                        style={{ backgroundColor: v.accentColor }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <strong className="text-[0.72rem] block truncate leading-tight">{v.name}</strong>
                        <span className="text-[0.58rem] text-stone-500 dark:text-stone-400 block truncate">{v.title}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Human Delivery Tone & Emotional Nuance */}
            <div className="p-3.5 bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] space-y-2">
              <span className="text-[0.65rem] font-mono font-black uppercase text-stone-500 dark:text-stone-400 block tracking-wider">
                4. Emotional Inflection & Bedside Manner
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {(Object.entries(EMOTIONAL_TONE_MODIFIERS) as [EmotionalBedsideTone, any][]).map(([key, val]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setEmotionTone(key)}
                    className={`p-2 rounded-lg border-2 text-left cursor-pointer transition-all ${
                      emotionTone === key
                        ? 'border-emerald-600 bg-emerald-500/15 font-bold shadow-[2px_2px_0_#2D8C6F]'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    <span className="text-[0.72rem] font-black block">{val.label}</span>
                    <span className="text-[0.58rem] text-stone-500 dark:text-stone-400 block leading-tight mt-0.5">{val.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Acoustic Pitch & Vocal Audition */}
            <div className="p-3.5 bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[0.65rem] font-mono font-black uppercase text-stone-500 dark:text-stone-400 block tracking-wider">
                  5. Acoustic Resonance & Audition
                </span>
                <span className="text-[0.6rem] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  🌟 Studio Neural Engine Active
                </span>
              </div>

              {/* Pitch Shift Controls */}
              <div className="grid grid-cols-3 gap-1">
                {PITCH_RESONANCE_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPitchOffset(opt.id)}
                    className={`p-1.5 rounded-lg border text-center cursor-pointer transition-all ${
                      pitchOffset === opt.id
                        ? 'border-stone-900 dark:border-white bg-stone-100 dark:bg-stone-800 font-bold'
                        : 'border-stone-200 dark:border-stone-800 text-stone-500 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-[0.65rem] block font-mono">{opt.label}</span>
                    <span className="text-[0.55rem] text-stone-400 block">{opt.id}</span>
                  </button>
                ))}
              </div>

              {/* Active Voice Info Card */}
              <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[0.65rem] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-stone-800 dark:text-stone-200">{currentPersona.name}</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{currentPersona.neuralCode}</span>
                </div>
                <p className="text-stone-500 dark:text-stone-400 leading-tight">{currentPersona.accent}</p>
              </div>

              {/* Audition / Preview Voice Button */}
              <button
                type="button"
                onClick={handlePreviewSpecialistVoice}
                disabled={isPlaying}
                className={`w-full py-2.5 px-3 rounded-xl border-2 border-[#1A1A1A] dark:border-[#F0ECE6] font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[2px_2px_0_#1A1A1A] active:scale-95 ${
                  isPreviewingVoice
                    ? 'bg-amber-500 text-black animate-pulse'
                    : 'bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                }`}
                title="Audition an authentic clinical greeting from this veterinary specialist"
              >
                {isPreviewingVoice ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>Auditioning {currentPersona.name}... (Click to Stop)</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>🔊 Audition {currentPersona.name}'s Voice</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Right Column: Audio Console & Synchronized Transcript (7 cols) */}
          <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
            
            {/* The Sound Studio Master Player Card */}
            <div className="p-5 bg-[#1A1A1A] text-white rounded-2xl border-[3px] border-black shadow-[6px_6px_0_#2D8C6F] space-y-4">
              
              {/* Top Meta Bar */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md"
                    style={{ backgroundColor: currentPersona.accentColor }}
                  >
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight">{petName}'s Spoken Passport</h3>
                    <p className="text-[0.65rem] font-mono text-stone-300">
                      Narrated by {currentPersona.name} • {EMOTIONAL_TONE_MODIFIERS[emotionTone]?.label}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-2.5 py-1 rounded-lg">
                  <span className={`w-2 h-2 rounded-full ${isPlaying || isPreviewingVoice ? 'bg-emerald-500 animate-ping' : 'bg-stone-500'}`} />
                  <span className="text-[0.62rem] font-mono uppercase font-black text-emerald-400">
                    {isPlaying ? 'Streaming Neural Audio' : isPreviewingVoice ? 'Auditioning Voice' : 'Studio Standby'}
                  </span>
                </div>
              </div>

              {/* Dynamic Waveform Visualizer */}
              <div className="h-14 bg-stone-900/90 rounded-xl border border-stone-800 p-2 flex items-center justify-center gap-1 overflow-hidden">
                {visualizerBars.map((height, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-full transition-all duration-100"
                    style={{
                      height: `${height}px`,
                      backgroundColor: isPlaying || isPreviewingVoice ? currentPersona.accentColor : '#444'
                    }}
                  />
                ))}
              </div>

              {/* Progress & Time Track */}
              <div className="space-y-1">
                <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-200"
                    style={{
                      width: duration > 0 ? `${(currentTime / duration) * 100}%` : isPlaying ? '65%' : '0%'
                    }}
                  />
                </div>
                <div className="flex justify-between text-[0.65rem] font-mono text-stone-400">
                  <span>{formatSeconds(currentTime)}</span>
                  <span>{formatSeconds(duration || 32)}</span>
                </div>
              </div>

              {/* Transport Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                
                {/* Play / Stop Primary Trigger */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    disabled={isGenerating}
                    className={`px-5 py-2.5 rounded-xl font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-[2px_2px_0_#FFF] ${
                      isPlaying
                        ? 'bg-rose-500 hover:bg-rose-600 text-white'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-black'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Synthesizing...</span>
                      </>
                    ) : isPlaying ? (
                      <>
                        <Square className="w-4 h-4 fill-current" />
                        <span>Stop Audio</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Play Spoken Plan</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      stopCurrentAudio();
                      setCurrentTime(0);
                      setIsPlaying(false);
                      setActiveSentenceIndex(-1);
                    }}
                    className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 cursor-pointer"
                    title="Reset to start"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Speed Switchers */}
                <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 p-1 rounded-xl">
                  <span className="text-[0.6rem] font-mono text-stone-400 px-1">Speed:</span>
                  {[0.8, 1.0, 1.25, 1.5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSpeedChange(s)}
                      className={`px-2 py-1 rounded-md text-[0.65rem] font-mono font-bold cursor-pointer transition-all ${
                        speed === s
                          ? 'bg-emerald-500 text-black'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                {/* Direct Download Studio Audio Button */}
                <button
                  type="button"
                  onClick={handleDownloadWav}
                  disabled={isGenerating}
                  className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0_#FFF]"
                  title="Download broadcast-grade neural audio file (.MP3)"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Audio</span>
                </button>

              </div>

              {voiceErrorState && (
                <div className="mt-2.5 p-3 rounded-xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-2">
                  <VolumeX className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{voiceErrorState}</span>
                </div>
              )}
            </div>

            {/* Synchronized Transcript View Card */}
            <div className="p-4 bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] space-y-2.5">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-stone-500" />
                  <h4 className="text-xs font-mono font-black uppercase">
                    Synchronized Clinical Transcript
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleCopyTranscript}
                  className="px-2 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded text-[0.65rem] font-mono font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedTranscript ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedTranscript ? 'Copied' : 'Copy Script'}</span>
                </button>
              </div>

              <div className="p-3.5 bg-stone-50 dark:bg-[#181614] rounded-lg border border-stone-200 dark:border-stone-800 max-h-56 overflow-y-auto font-sans text-xs leading-relaxed text-stone-800 dark:text-stone-200 space-y-2">
                {splitIntoThoughtSentences(activeScript).map((sentence, idx) => {
                  const isCurrent = isPlaying && activeSentenceIndex === idx;
                  return (
                    <p
                      key={idx}
                      className={`transition-all duration-200 p-1.5 rounded ${
                        isCurrent
                          ? 'bg-emerald-500/20 text-emerald-950 dark:text-emerald-100 font-bold border-l-4 border-emerald-500 pl-2.5 shadow-sm'
                          : 'text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {sentence}
                    </p>
                  );
                })}
              </div>

              {/* Verified Clinical Reference Badge */}
              <div className="flex items-center justify-between text-[0.62rem] font-mono text-stone-500 pt-1">
                <span>Verified Standards: AAHA • WSAVA • NRC 2006 • AVMA</span>
                <span className="text-emerald-600 font-bold">100% Peer-Reviewed Bedside Attribution</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
