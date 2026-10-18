// High-Fidelity Humanized Voice Engine for Veterinary Spoken Clinical Plans
// Solves robotic/mechanic AI speech by discovering OS natural neural voices,
// matching specialist doctor personas, and applying sentence-by-sentence human prosody with natural breathing pauses.

export interface HumanVoiceDescriptor {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
  gender: 'male' | 'female';
  qualityTier: 'neural-natural' | 'enhanced' | 'standard';
  badge: string;
  label: string;
  isNatural: boolean;
}

export type EmotionalBedsideTone = 'compassionate' | 'authoritative' | 'soothing' | 'enthusiastic';

export type SpecialistPersonaId = 'Fenrir' | 'Kore' | 'Zephyr' | 'Puck' | 'Charon' | 'Emma' | 'Brian' | 'Michelle';

export interface NeuralStudioVoiceInfo {
  id: SpecialistPersonaId;
  name: string;
  title: string;
  role: string;
  neuralCode: string;
  gender: 'male' | 'female';
  accent: string;
  description: string;
  sampleGreeting: string;
  accentColor: string;
  recommendedTone: EmotionalBedsideTone;
}

export const NEURAL_STUDIO_VOICES: NeuralStudioVoiceInfo[] = [
  {
    id: 'Fenrir',
    name: 'Dr. James Barnes, DVM',
    title: 'Senior Veterinary Clinician & Medical Director',
    role: 'Clinical Longevity & Internal Medicine',
    neuralCode: 'en-US-ChristopherNeural',
    gender: 'male',
    accent: 'US English (Deep Baritone, Authoritative & Warm)',
    description: 'Calm, authoritative senior clinician with commanding presence, measured cadence, and warm bedside reassurance.',
    sampleGreeting: "Hello pet family. I'm Dr. Barnes, Senior Veterinary Clinician. Let's review your companion's clinical longevity plan together.",
    accentColor: '#1E3A8A',
    recommendedTone: 'authoritative'
  },
  {
    id: 'Kore',
    name: 'Chef Stella Artois, MS',
    title: 'Clinical Canine Nutritionist & Formulator',
    role: 'Whole-Food Nutrition & Gut Microbiome',
    neuralCode: 'en-US-JennyNeural',
    gender: 'female',
    accent: 'US English (Warm Dynamic, Engaging & Vibrant)',
    description: 'Passionate whole-food nutritionist with cheerful, encouraging inflection and approachable culinary guidance.',
    sampleGreeting: "Hi pet parent! Chef Stella here. I've formulated a nutrient-dense, whole-food dietary plan to keep your dog thriving.",
    accentColor: '#D97706',
    recommendedTone: 'enthusiastic'
  },
  {
    id: 'Zephyr',
    name: 'Nurse Sarah Jenkins, RVT',
    title: 'Geriatric Comfort & Palliative Care Specialist',
    role: 'Senior Vitality & Chronic Pain Management',
    neuralCode: 'en-US-AriaNeural',
    gender: 'female',
    accent: 'US English (Gentle, Empathetic & Soothing)',
    description: 'Soft-spoken, deeply tender veterinary nurse specializing in peaceful hospice comfort, joint relief, and elder care.',
    sampleGreeting: "Hello dear friend. I'm Nurse Sarah. Every single day of your senior companion's journey deserves gentle dignity and peace.",
    accentColor: '#059669',
    recommendedTone: 'soothing'
  },
  {
    id: 'Puck',
    name: 'Coach Marcus Vance',
    title: 'Canine Behavioral Ethologist & Cognitive Coach',
    role: 'Duke Cognition, ELTE Ethology & Fear Free FAS Protocols',
    neuralCode: 'en-US-GuyNeural',
    gender: 'male',
    accent: 'US English (Crisp, Motivating & Energetic)',
    description: 'Energetic, motivational behavioral ethologist grounded in Duke Canine Cognition Center (Dr. Brian Hare), ELTE Family Dog Project (Dr. Ádám Miklósi), and Fear Free Pets (Dr. Marty Becker, DVM).',
    sampleGreeting: "Hey there! Coach Marcus here. Grounded in Duke Cognition, ELTE, and Fear Free protocols, let's fire up your companion's mental sharpness, calm confidence, and behavioral vitality!",
    accentColor: '#EA580C',
    recommendedTone: 'enthusiastic'
  },
  {
    id: 'Charon',
    name: 'Lord Alistair Vance, MRCVS',
    title: 'Chief Registrar, Elite Breed Registry',
    role: 'Genetics, Orthopedic OFA & Pedigree Authority',
    neuralCode: 'en-GB-RyanNeural',
    gender: 'male',
    accent: 'British English (Prestigious, Dignified Academic)',
    description: 'Distinguished British veterinary fellow with crisp diction, aristocratic poise, and pedigree certification authority.',
    sampleGreeting: "Greetings. Lord Alistair Vance certifying official pedigree standards and multi-generational genetic clearances under DogHealthOS Elite.",
    accentColor: '#7C3AED',
    recommendedTone: 'authoritative'
  },
  {
    id: 'Emma',
    name: 'Dr. Emma Foster, DVM',
    title: 'Pediatric Puppy Growth & Preventative Specialist',
    role: 'Early Developmental Milestones & Vaccines',
    neuralCode: 'en-US-EmmaNeural',
    gender: 'female',
    accent: 'US English (Bright, Empathetic & Articulate)',
    description: 'Warm, encouraging pediatrician guiding first-time pet parents through early socialization and developmental windows.',
    sampleGreeting: "Hello! I'm Dr. Emma Foster. Let's make sure your puppy's foundational growth milestones and vaccinations are on track.",
    accentColor: '#EC4899',
    recommendedTone: 'compassionate'
  },
  {
    id: 'Brian',
    name: 'Dr. Brian Gallagher, PhD',
    title: 'Comparative Canine Longevity Geneticist',
    role: 'Epigenetic Clock & Cellular Bio-markers',
    neuralCode: 'en-US-BrianNeural',
    gender: 'male',
    accent: 'US English (Measured, Scientific & Analytical)',
    description: 'Analytical longevity scientist explaining cellular health, telomere maintenance, and weight-to-longevity curves.',
    sampleGreeting: "Good day. Dr. Brian Gallagher here. We are analyzing the latest comparative longevity bio-markers for your dog's breed cohort.",
    accentColor: '#0284C7',
    recommendedTone: 'authoritative'
  },
  {
    id: 'Michelle',
    name: 'Dr. Michelle Wu, DVM',
    title: 'Integrative Wellness & Acupuncture Director',
    role: 'Holistic Longevity & Anti-Inflammatory Care',
    neuralCode: 'en-US-MichelleNeural',
    gender: 'female',
    accent: 'US English (Calm, Serene & Grounded)',
    description: 'Mindful, tranquil integrative practitioner blending modern clinical medicine with natural anti-inflammatory protocols.',
    sampleGreeting: "Welcome. Dr. Michelle Wu here. We're harmonizing internal balance and cellular vitality to support your companion's longevity.",
    accentColor: '#10B981',
    recommendedTone: 'soothing'
  }
];

let cachedVoices: HumanVoiceDescriptor[] = [];
let voiceLoadingPromise: Promise<HumanVoiceDescriptor[]> | null = null;

/**
 * Clean spoken clinical text of markdown, URLs, and noisy emoji while preserving natural punctuation
 */
export function cleanClinicalSpokenText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[#*_`~\[\]]/g, '')
    .replace(/🐾|🔬|🌸|🎾|🩺|⚠️|📥|🔊|🥗|🧬|🏛️|👑|🎙️|✨/g, '')
    .replace(/\b(?:https?|ftp):\/\/\S+/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Split text into natural sentence units for conversational breathing cadence
 */
export function splitIntoThoughtSentences(text: string): string[] {
  const cleaned = cleanClinicalSpokenText(text);
  if (!cleaned) return [];

  // Match sentence terminators (. ! ?) followed by whitespace or quotes
  const rawSentences = cleaned.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) || [cleaned];
  
  return rawSentences
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Discovers and ranks natural human voices installed on the system (Microsoft Online Natural, Google Natural, Apple Enhanced)
 */
export function getAvailableHumanVoices(): Promise<HumanVoiceDescriptor[]> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return Promise.resolve([]);
  }

  if (cachedVoices.length > 0) {
    return Promise.resolve(cachedVoices);
  }

  if (voiceLoadingPromise) {
    return voiceLoadingPromise;
  }

  voiceLoadingPromise = new Promise<HumanVoiceDescriptor[]>((resolve) => {
    const parseAndRank = () => {
      const rawVoices = window.speechSynthesis.getVoices();
      if (!rawVoices || rawVoices.length === 0) return [];

      // Filter for English voices, strictly excluding robotic synthesizers
      const englishVoices = rawVoices.filter(v => {
        const lang = (v.lang || '').toLowerCase();
        const name = (v.name || '').toLowerCase();
        
        // Exclude known mechanical/robotic synth artifacts
        if (name.includes('espeak') || name.includes('klatt') || name.includes('whisper') || name.includes('generic') || name.includes('mbrola')) {
          return false;
        }

        return lang.startsWith('en');
      });

      const descriptors: HumanVoiceDescriptor[] = englishVoices.map(v => {
        const name = v.name;
        const lowerName = name.toLowerCase();

        // Detect Neural / Online Natural human voices
        const isNeuralNatural = 
          lowerName.includes('natural') || 
          lowerName.includes('online') || 
          lowerName.includes('neural') ||
          lowerName.includes('wavenet') ||
          (lowerName.includes('google') && !lowerName.includes('robot'));

        const isEnhanced = 
          lowerName.includes('enhanced') || 
          lowerName.includes('premium') ||
          lowerName.includes('samantha') ||
          lowerName.includes('daniel') ||
          lowerName.includes('oliver') ||
          lowerName.includes('karen') ||
          lowerName.includes('serena') ||
          lowerName.includes('moira') ||
          lowerName.includes('tom') ||
          lowerName.includes('ava') ||
          lowerName.includes('zoe') ||
          lowerName.includes('alex');

        const qualityTier = isNeuralNatural ? 'neural-natural' : (isEnhanced ? 'enhanced' : 'standard');

        // Estimate gender based on standard voice names
        const femaleKeywords = ['jenny', 'aria', 'samantha', 'karen', 'serena', 'moira', 'ava', 'zoe', 'victoria', 'zira', 'libby', 'maisie', 'sonia', 'female', 'woman', 'girl'];
        const isFemale = femaleKeywords.some(kw => lowerName.includes(kw));
        const gender: 'male' | 'female' = isFemale ? 'female' : 'male';

        let badge = 'Standard';
        if (qualityTier === 'neural-natural') badge = '🌟 Neural Natural';
        else if (qualityTier === 'enhanced') badge = '✨ Studio Enhanced';

        // Friendly human display name
        const cleanName = name
          .replace(/Microsoft\s+/i, '')
          .replace(/Google\s+/i, 'Google ')
          .replace(/English\s+\(United States\)/i, 'US')
          .replace(/English\s+\(United Kingdom\)/i, 'UK')
          .replace(/Online\s+\(Natural\)/i, '(Natural)')
          .trim();

        return {
          voice: v,
          name: v.name,
          lang: v.lang,
          gender,
          qualityTier,
          badge,
          label: `${cleanName} — ${badge}`,
          isNatural: qualityTier !== 'standard'
        };
      });

      // Sort with Neural Natural at the very top, then Enhanced, then Standard
      descriptors.sort((a, b) => {
        const score = (d: HumanVoiceDescriptor) => {
          if (d.qualityTier === 'neural-natural') return 3;
          if (d.qualityTier === 'enhanced') return 2;
          return 1;
        };
        return score(b) - score(a);
      });

      return descriptors;
    };

    const initial = parseAndRank();
    if (initial.length > 0) {
      cachedVoices = initial;
      resolve(initial);
      return;
    }

    // Wait for onvoiceschanged event (Chrome / Edge / Safari requirement)
    const onVoicesChanged = () => {
      const parsed = parseAndRank();
      if (parsed.length > 0) {
        cachedVoices = parsed;
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        resolve(parsed);
      }
    };

    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);

    // Timeout fallback after 2.5 seconds
    setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      const fallback = parseAndRank();
      cachedVoices = fallback;
      resolve(fallback);
    }, 2500);
  });

  return voiceLoadingPromise;
}

/**
 * Finds the absolute best human voice matching the clinical persona
 */
export async function getBestVoiceForPersona(
  personaId: SpecialistPersonaId = 'Fenrir',
  userPreferredVoiceName?: string
): Promise<SpeechSynthesisVoice | null> {
  const voices = await getAvailableHumanVoices();
  if (voices.length === 0) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const all = window.speechSynthesis.getVoices();
      return all.find(v => v.lang.startsWith('en')) || all[0] || null;
    }
    return null;
  }

  // 1. If user explicitly selected a voice by name, use it
  if (userPreferredVoiceName) {
    const match = voices.find(v => v.name === userPreferredVoiceName);
    if (match) return match.voice;
  }

  // 2. Persona Priority lists
  const PERSONA_VOICE_PREFERENCES: Record<SpecialistPersonaId, { preferredKeywords: string[]; targetGender: 'male' | 'female' }> = {
    // Dr. Barnes, DVM: Senior male clinician, calm, deeply authoritative
    Fenrir: {
      preferredKeywords: ['christopher', 'guy', 'ryan', 'daniel', 'tom', 'oliver', 'alex', 'david', 'george', 'us english male', 'en-us-neural2-d'],
      targetGender: 'male'
    },
    // Chef Stella: Clinical canine nutritionist, warm, enthusiastic female
    Kore: {
      preferredKeywords: ['jenny', 'aria', 'sonia', 'samantha', 'karen', 'ava', 'victoria', 'zira', 'us english female', 'en-us-neural2-f'],
      targetGender: 'female'
    },
    // Nurse Sarah: Geriatric & palliative advocate, gentle, comforting female
    Zephyr: {
      preferredKeywords: ['libby', 'maisie', 'serena', 'moira', 'tessa', 'uk english female', 'samantha', 'jenny'],
      targetGender: 'female'
    },
    // Coach Marcus: Canine behavioral specialist, energetic, friendly male
    Puck: {
      preferredKeywords: ['guy', 'steffan', 'marcus', 'christopher', 'tom', 'oliver', 'fred', 'alex', 'david', 'male', 'natural', 'neural'],
      targetGender: 'male'
    },
    // Clinical Registrar: Official breed registry, formal, dignified British/Mid-Atlantic
    Charon: {
      preferredKeywords: ['george', 'uk english male', 'daniel', 'oliver', 'arthur', 'christopher'],
      targetGender: 'male'
    },
    // Dr. Emma Foster: Pediatric puppy development
    Emma: {
      preferredKeywords: ['emma', 'jenny', 'aria', 'ava', 'zoe', 'samantha'],
      targetGender: 'female'
    },
    // Dr. Brian Gallagher: Longevity scientist
    Brian: {
      preferredKeywords: ['brian', 'guy', 'christopher', 'ryan', 'oliver'],
      targetGender: 'male'
    },
    // Dr. Michelle Wu: Integrative medicine
    Michelle: {
      preferredKeywords: ['michelle', 'jenny', 'aria', 'serena', 'samantha'],
      targetGender: 'female'
    }
  };

  const pref = PERSONA_VOICE_PREFERENCES[personaId] || PERSONA_VOICE_PREFERENCES.Fenrir;

  // Try matching keywords in order
  for (const kw of pref.preferredKeywords) {
    const found = voices.find(v => v.name.toLowerCase().includes(kw));
    if (found) return found.voice;
  }

  // Fallback: Pick highest-ranked voice matching target gender
  const genderMatch = voices.find(v => v.gender === pref.targetGender);
  if (genderMatch) return genderMatch.voice;

  // Ultimate fallback: Highest quality voice available
  return voices[0]?.voice || null;
}

/**
 * Returns emotional prosody parameters (speech rate, pitch, pause length)
 */
export function getProsodySettings(
  tone: EmotionalBedsideTone = 'compassionate',
  personaId: SpecialistPersonaId = 'Fenrir',
  userSpeed: number = 1.0
): { rate: number; pitch: number; pauseAfterSentenceMs: number } {
  // Base parameters calibrated for human veterinary communication
  let baseRate = 0.92;
  let basePitch = 1.0;
  let pauseMs = 300;

  switch (tone) {
    case 'compassionate':
      // Warm, reassuring human bedside manner with thoughtful pauses
      baseRate = 0.88;
      basePitch = 0.98;
      pauseMs = 340;
      break;

    case 'authoritative':
      // Senior clinician authority: slightly deeper, deliberate, commanding respect
      baseRate = 0.93;
      basePitch = 0.92;
      pauseMs = 380;
      break;

    case 'soothing':
      // Gentle comfort for senior/palliative care: slower, gentle cadence
      baseRate = 0.82;
      basePitch = 1.02;
      pauseMs = 420;
      break;

    case 'enthusiastic':
      // Nutritional & behavioral vitality: lively, positive, encouraging
      baseRate = 1.02;
      basePitch = 1.05;
      pauseMs = 240;
      break;
  }

  // Specialist persona micro-adjustments
  if (personaId === 'Fenrir') {
    // Dr. Barnes has extra clinical gravitas
    basePitch = Math.max(0.85, basePitch - 0.05);
  } else if (personaId === 'Zephyr') {
    // Nurse Sarah is extra gentle
    baseRate = Math.min(baseRate, 0.85);
  } else if (personaId === 'Kore') {
    // Chef Stella is warm and friendly
    basePitch = Math.min(1.15, basePitch + 0.03);
  }

  return {
    rate: Math.max(0.65, Math.min(1.5, baseRate * userSpeed)),
    pitch: Math.max(0.8, Math.min(1.25, basePitch)),
    pauseAfterSentenceMs: pauseMs
  };
}

/**
 * Acoustic Chime & Consultation Sound Generator using Web Audio API
 * Produces a warm, comforting clinical consultation chime (528 Hz Solfeggio / 660 Hz harmonic)
 */
export function playConsultationStartChime(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const now = ctx.currentTime;
    
    // Note 1: 528 Hz (Warm clinical comfort)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(528, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.08, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.85);

    // Note 2: 660 Hz (Major third harmonic)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(660, now + 0.12);
    gain2.gain.setValueAtTime(0, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.07, now + 0.17);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 1.0);
  } catch (_) {
    // Non-critical audio enhancement
  }
}

/**
 * Synthesizes a studio-grade offline WAV audio file for direct download
 */
export function createAcousticConsultationWav(title: string, durationSec: number = 8): string {
  const sampleRate = 22050;
  const numSamples = Math.floor(sampleRate * durationSec);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // Helper to write ASCII strings to DataView
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // RIFF Header
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');

  // fmt chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // AudioFormat: PCM
  view.setUint16(22, 1, true); // NumChannels: Mono
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * 2, true); // ByteRate
  view.setUint16(32, 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample

  // data chunk
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // Synthesize gentle acoustic consultation chime and warmth harmonics
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    
    // 528 Hz chime fading out
    const chime1 = Math.sin(2 * Math.PI * 528 * t) * Math.exp(-t * 1.8);
    // 660 Hz chime entering at 0.15s
    const chime2 = t > 0.15 ? Math.sin(2 * Math.PI * 660 * (t - 0.15)) * Math.exp(-(t - 0.15) * 1.6) : 0;
    // Warm low-frequency ambient tone (176 Hz)
    const ambient = Math.sin(2 * Math.PI * 176 * t) * 0.04 * Math.exp(-t * 0.5);

    const sample = Math.max(-1, Math.min(1, (chime1 * 0.4 + chime2 * 0.35 + ambient) * 0.8));
    const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    view.setInt16(offset, int16, true);
    offset += 2;
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}
