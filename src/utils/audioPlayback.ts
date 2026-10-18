// Audio Playback & Human Voice Engine for Spoken Clinical Plans
// Delivers warm, authoritative, emotionally nuanced veterinary specialist narration
// with natural conversational breathing pauses, flagship neural studio synthesis, and instant preview.

import { 
  getAvailableHumanVoices, 
  getBestVoiceForPersona, 
  getProsodySettings, 
  splitIntoThoughtSentences, 
  cleanClinicalSpokenText, 
  playConsultationStartChime,
  createAcousticConsultationWav,
  EmotionalBedsideTone,
  SpecialistPersonaId,
  HumanVoiceDescriptor,
  NEURAL_STUDIO_VOICES,
  NeuralStudioVoiceInfo
} from './humanVoiceEngine';

export { 
  getAvailableHumanVoices, 
  getBestVoiceForPersona, 
  cleanClinicalSpokenText, 
  playConsultationStartChime,
  NEURAL_STUDIO_VOICES
};
export type { HumanVoiceDescriptor, EmotionalBedsideTone, SpecialistPersonaId, NeuralStudioVoiceInfo };

let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentPlaybackRate = 1.0;
let isPlaybackCancelled = false;
let currentPauseTimer: any = null;
let onPlaybackStoppedListener: (() => void) | null = null;

export interface PlayAudioOptions {
  text: string;
  voice?: SpecialistPersonaId;
  neuralVoice?: string;
  preferredVoiceName?: string;
  pitch?: string;
  style?: string;
  tone?: EmotionalBedsideTone;
  playbackRate?: number;
  playChime?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onSentenceChange?: (sentenceIndex: number, totalSentences: number, sentenceText: string) => void;
  onLoaded?: (audioUrl: string, duration: number) => void;
}

export interface AudioGenerationResult {
  audioUrl?: string;
  rawBase64?: string;
  mimeType?: string;
  neuralVoice?: string;
  provider?: string;
  isWebSpeech?: boolean;
  voice: string;
  cleanText: string;
}

export function stopCurrentAudio(): void {
  isPlaybackCancelled = true;
  if (currentPauseTimer) {
    clearTimeout(currentPauseTimer);
    currentPauseTimer = null;
  }
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (_) {}
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
    currentUtterance = null;
  }
  if (onPlaybackStoppedListener) {
    try {
      onPlaybackStoppedListener();
    } catch (_) {}
    onPlaybackStoppedListener = null;
  }
}

export function pauseCurrentAudio(): void {
  if (currentAudio) {
    currentAudio.pause();
  } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
}

export function resumeCurrentAudio(): void {
  if (currentAudio) {
    currentAudio.play().catch(() => {});
  } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}

export function setPlaybackRate(rate: number): void {
  currentPlaybackRate = rate;
  if (currentAudio) {
    currentAudio.playbackRate = rate;
  }
}

export function isAudioCurrentlyPlaying(): boolean {
  return (currentAudio !== null && !currentAudio.paused) || 
         (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking && !window.speechSynthesis.paused);
}

export function cleanSpokenText(text: string): string {
  return cleanClinicalSpokenText(text);
}

/**
 * Previews a specialist's human voice with an authentic clinical greeting.
 * Returns a Promise that resolves when the audio audition finishes or is stopped.
 */
export async function previewSpecialistVoice(
  personaId: SpecialistPersonaId = 'Fenrir',
  preferredVoiceName?: string,
  tone: EmotionalBedsideTone = 'compassionate',
  customPitch?: string
): Promise<void> {
  stopCurrentAudio();
  isPlaybackCancelled = false;

  const persona = NEURAL_STUDIO_VOICES.find(v => v.id === personaId) || NEURAL_STUDIO_VOICES[0];
  const sampleText = persona.sampleGreeting;

  return new Promise<void>(async (resolve) => {
    let isResolved = false;
    const safeResolve = () => {
      if (!isResolved) {
        isResolved = true;
        onPlaybackStoppedListener = null;
        resolve();
      }
    };

    onPlaybackStoppedListener = safeResolve;

    try {
      await playSpokenAudio({
        text: sampleText,
        voice: personaId,
        neuralVoice: persona.neuralCode,
        preferredVoiceName,
        pitch: customPitch,
        tone,
        playChime: true,
        playbackRate: 1.0,
        onEnd: safeResolve,
        onError: safeResolve
      });
    } catch (_) {
      safeResolve();
    }
  });
}

/**
 * Generates an audio passport MP3 buffer from the Flagship Neural TTS service
 */
export async function generateAudioPassport(
  text: string,
  voice: SpecialistPersonaId = 'Fenrir',
  style: string = 'Warm, empathetic, professional veterinary clinical specialist',
  tone: EmotionalBedsideTone = 'compassionate',
  playbackRate: number = 1.0,
  pitch?: string,
  neuralVoice?: string
): Promise<AudioGenerationResult> {
  const cleaned = cleanSpokenText(text);
  if (!cleaned) {
    throw new Error('No valid text provided for audio passport generation.');
  }

  const persona = NEURAL_STUDIO_VOICES.find(v => v.id === voice);
  const resolvedNeuralVoice = neuralVoice || persona?.neuralCode || 'en-US-ChristopherNeural';

  // Attempt server-side Flagship Neural TTS with a 15s timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch('/api/gemini/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: cleaned,
        voice,
        neuralVoice: resolvedNeuralVoice,
        style,
        tone,
        speed: playbackRate,
        pitch
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.audioUrl && data.isVoiceAvailable !== false) {
        return {
          audioUrl: data.audioUrl,
          rawBase64: data.rawBase64,
          mimeType: data.mimeType || 'audio/wav',
          voice,
          neuralVoice: data.neuralVoice || resolvedNeuralVoice,
          provider: data.provider || 'Gemini Neural Studio Engine',
          cleanText: cleaned,
          isWebSpeech: false
        };
      }
      
      throw new Error(data.error || 'Voice not available at the moment');
    } else {
      throw new Error('Voice not available at the moment');
    }
  } catch (err: any) {
    throw new Error(err?.message || 'Voice not available at the moment');
  }
}

/**
 * Initiates direct download of the synthesized broadcast-quality audio file
 */
export function downloadAudioWavFile(audioUrl: string, petNameOrFilename: string = 'Canine', planType: string = 'Clinical_Passport'): void {
  try {
    const a = document.createElement('a');
    a.href = audioUrl;
    let filename = petNameOrFilename;
    if (!filename.includes('.')) {
      const sanitizedPetName = petNameOrFilename.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'Companion';
      const ext = audioUrl.includes('audio/mp3') || audioUrl.startsWith('data:audio/mp3') ? 'mp3' : 'wav';
      filename = `${sanitizedPetName}_${planType}_Audio_Passport.${ext}`;
    }
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (e) {
    console.warn('Audio download notice:', e);
  }
}

/**
 * Primary Spoken Clinical Plan player
 * Strictly uses Studio-Quality Gemini Neural Voices.
 * BANNED: Metallic browser synthetic speech is completely forbidden.
 * If neural voice cannot be generated, signals "Voice not available at the moment".
 */
export async function playSpokenAudio(options: PlayAudioOptions): Promise<void> {
  stopCurrentAudio();
  isPlaybackCancelled = false;

  const { 
    text, 
    voice = 'Puck', 
    neuralVoice,
    preferredVoiceName,
    pitch,
    style, 
    tone = 'compassionate',
    playbackRate = 1.0,
    playChime = false,
    onStart, 
    onEnd, 
    onError,
    onTimeUpdate,
    onSentenceChange,
    onLoaded
  } = options;

  currentPlaybackRate = playbackRate;
  const cleaned = cleanSpokenText(text);
  if (!cleaned) return;

  onStart?.();

  try {
    const serverResult = await generateAudioPassport(cleaned, voice, style, tone, playbackRate, pitch, neuralVoice);
    if (isPlaybackCancelled) return;

    if (serverResult.audioUrl) {
      const audio = new Audio(serverResult.audioUrl);
      currentAudio = audio;
      audio.playbackRate = currentPlaybackRate;

      // Sentence synchronization tracking
      const sentences = splitIntoThoughtSentences(cleaned);
      const totalSentences = sentences.length;
      const sentenceWordCounts = sentences.map(s => Math.max(1, s.split(' ').length));
      const totalWords = sentenceWordCounts.reduce((a, b) => a + b, 0);
      const sentenceThresholds: number[] = [];
      let accumulated = 0;
      for (const w of sentenceWordCounts) {
        accumulated += w;
        sentenceThresholds.push(accumulated / totalWords);
      }

      audio.onloadedmetadata = () => {
        onLoaded?.(serverResult.audioUrl!, audio.duration);
        if (totalSentences > 0) {
          onSentenceChange?.(0, totalSentences, sentences[0]);
        }
      };

      audio.ontimeupdate = () => {
        const cur = audio.currentTime;
        const dur = audio.duration || 1;
        onTimeUpdate?.(cur, dur);

        if (totalSentences > 0 && dur > 0) {
          const ratio = Math.min(0.999, cur / dur);
          let matchedIdx = sentenceThresholds.findIndex(thresh => thresh >= ratio);
          if (matchedIdx === -1) matchedIdx = totalSentences - 1;
          onSentenceChange?.(matchedIdx, totalSentences, sentences[matchedIdx] || '');
        }
      };

      audio.onended = () => {
        currentAudio = null;
        onEnd?.();
      };

      audio.onerror = () => {
        currentAudio = null;
        onError?.(new Error("Voice not available at the moment"));
      };

      await audio.play();
    } else {
      throw new Error("Voice not available at the moment");
    }
  } catch (err: any) {
    currentAudio = null;
    onError?.(new Error("Voice not available at the moment"));
  }
}
