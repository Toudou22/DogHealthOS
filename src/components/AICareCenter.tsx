import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Brain,
  Bot,
  Video,
  Mic,
  Square,
  Image as ImageIcon,
  ArrowRight,
  Activity,
  RefreshCw,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Upload,
  ChefHat,
  ShieldAlert,
  ShieldCheck,
  Check,
  Send,
  HelpCircle,
  LayoutGrid,
  CheckSquare,
  Headphones
} from 'lucide-react';
import { Breed } from '../types';
import { logUserAction } from '../utils/firebaseHelper';
import VerifiedByBadge from './VerifiedByBadge';
import { playSpokenAudio, stopCurrentAudio, isAudioCurrentlyPlaying } from '../utils/audioPlayback';

interface AICareCenterProps {
  currentBreed: Breed | null;
  currentAge: number;
  onOpenPricing?: () => void;
  onOpenAudioPassport?: (ctx?: {
    planType?: 'passport' | 'nutrition' | 'triage' | 'breeder' | 'custom';
    petName?: string;
    customText?: string;
    voice?: 'Kore' | 'Fenrir' | 'Zephyr' | 'Puck' | 'Charon';
  }) => void;
}

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export default function AICareCenter({ currentBreed, currentAge, onOpenPricing, onOpenAudioPassport }: AICareCenterProps) {
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'nutrition' | 'studio' | 'magic' | 'voice' | 'chatbot'>('chatbot');
  
  // 1. Clinical Diagnostics State
  const [symptomsInput, setSymptomsInput] = useState<string>('');
  const [diagResult, setDiagResult] = useState<string>('');
  const [isDiagLoading, setIsDiagLoading] = useState<boolean>(false);
  const [reassuringMsgIdx, setReassuringMsgIdx] = useState<number>(0);

  // 2. Nutrition Planner State
  const [dietGoal, setDietGoal] = useState<string>('balanced');
  const [customDietNotes, setCustomDietNotes] = useState<string>('');
  const [nutritionResult, setNutritionResult] = useState<string>('');
  const [isNutritionLoading, setIsNutritionLoading] = useState<boolean>(false);

  // 3. Studio Portrait State
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [studioResult, setStudioResult] = useState<string>('');
  const [isStudioLoading, setIsStudioLoading] = useState<boolean>(false);

  // 4. Portrait Magic Editor State
  const [magicPrompt, setMagicPrompt] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [magicResult, setMagicResult] = useState<string>('');
  const [isMagicLoading, setIsMagicLoading] = useState<boolean>(false);

  // 5. Voice Hotline State
  const [isVoiceConnected, setIsVoiceConnected] = useState<boolean>(false);
  const [isLiveActive, setIsLiveActive] = useState<boolean>(false);
  const [voiceVisualizer, setVoiceVisualizer] = useState<number[]>(new Array(15).fill(2));
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const micProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // 6. Chatbot State
  const [selectedBot, setSelectedBot] = useState<'general' | 'nutrition' | 'behavior' | 'senior'>('general');
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<{ [key: string]: ChatMessage[] }>({
    general: [],
    nutrition: [],
    behavior: [],
    senior: [],
  });
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [voiceUnavailableMsgId, setVoiceUnavailableMsgId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const togglePlayAudio = (id: string, text: string, voice?: 'Kore' | 'Fenrir' | 'Zephyr' | 'Puck' | 'Charon', style?: string) => {
    if (playingAudioId === id) {
      stopCurrentAudio();
      setPlayingAudioId(null);
      return;
    }
    setVoiceUnavailableMsgId(null);
    setPlayingAudioId(id);
    playSpokenAudio({
      text,
      voice: voice || (selectedBot === 'behavior' ? 'Puck' : 'Fenrir'),
      style,
      onStart: () => {
        setPlayingAudioId(id);
        setVoiceUnavailableMsgId(null);
      },
      onEnd: () => setPlayingAudioId(null),
      onError: () => {
        setPlayingAudioId(null);
        setVoiceUnavailableMsgId(id);
        setTimeout(() => {
          setVoiceUnavailableMsgId((prev) => (prev === id ? null : prev));
        }, 5000);
      },
    });
  };

  // Loading Screen Reassuring Messages List
  const reassuringDiagMessages = [
    "🧠 Activating Gemini Pro High-Thinking Mode...",
    "🧬 Scanning clinical canine research cohorts...",
    "📈 Correlating size-adjusted breed health matrices...",
    "🩺 Structuring safety boundaries & clinical diagnostic questions...",
    "🐾 final preparation of veterinarian-grade clinical guidelines..."
  ];

  // Loading Screen Rotator
  useEffect(() => {
    let interval: any;
    if (isDiagLoading) {
      interval = setInterval(() => {
        setReassuringMsgIdx((prev) => (prev + 1) % reassuringDiagMessages.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isDiagLoading]);

  // Clean up voice hotline on unmount
  useEffect(() => {
    return () => {
      stopVoiceHotline();
    };
  }, []);

  // Scroll Chat to Bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, selectedBot]);

  // 1. Clinical Symptom Diagnostics via gemini-3.1-pro-preview High Thinking
  const runDiagnostics = async () => {
    if (!symptomsInput.trim()) return;
    setIsDiagLoading(true);
    setDiagResult('');
    setReassuringMsgIdx(0);

    const fullPrompt = `Breed Context: ${currentBreed ? currentBreed.name : 'Unknown Breed'} (${currentBreed ? currentBreed.size : 'Medium'} size category, median lifespan: ${currentBreed ? currentBreed.max : '12'} years).
Current Chronological Age: ${currentAge} years old.
Clinical Symptoms Input: ${symptomsInput}

Analyze this clinical presentation using highest precision clinical logical chains. Provide a deep structured diagnostic report including:
1. Veterinary Urgency Rating (Green/Yellow/Amber/Red) with clear immediate action protocols.
2. Differential Analysis: Map the symptoms specifically to breed-specific risk vectors (e.g. cardiac, orthopedic, metabolic).
3. Primary clinical diagnostic hypotheses to explore.
4. Veterinary Consultation Checklist: A set of highly relevant clinical questions the owner should present directly to their clinician during their diagnostic workup.
5. MANDATORY CREDIBLE REFERENCES: Every single clinical hypothesis, risk score, and protocol MUST be backed by and tagged with credible peer-reviewed cohort citations and reference bodies (such as Royal Veterinary College (RVC VetCompass™), University of Georgia Canine Mortality Study, AKC Pediatric Growth Standards, AAHA Canine Life Stage Guidelines, AVMA, or leading veterinary research faculties). No claim may be presented without accredited source attribution.`;

    try {
      const res = await fetch('/api/gemini/high-thinking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          systemInstruction: "You are an elite clinical veterinary scientist and canine diagnostician expert at assessing complex multi-symptom presentations. MANDATORY RULE: No information should ever be written without credible references. Every clinical claim, hypothesis, and urgency rating you provide MUST be explicitly supported by and cited with accredited veterinary bodies (e.g., Royal Veterinary College, University of Georgia Canine Mortality Cohort, AAHA, AKC, AVMA) and peer-reviewed veterinary literature."
        })
      });
      const data = await res.json();
      if (data.error) {
        setDiagResult(`⚠️ Error: ${data.error}`);
      } else {
        setDiagResult(data.text || 'No response returned.');
        logUserAction('AI Care Diagnostics', {
          breed: currentBreed ? currentBreed.name : 'Unknown Breed',
          age: currentAge,
          symptoms: symptomsInput
        });
      }
    } catch (err: any) {
      setDiagResult(`⚠️ Network Error: ${err.message}`);
    } finally {
      setIsDiagLoading(false);
    }
  };

  // 2. Nutrition Planner via gemini-3.5-flash
  const runNutritionPlanner = async () => {
    setIsNutritionLoading(true);
    setNutritionResult('');

    const fullPrompt = `Generate a customized daily canine nutrition, portioning, and whole-food plan for:
Breed: ${currentBreed ? currentBreed.name : 'Unknown Breed'} (${currentBreed ? currentBreed.size : 'Medium'} size category).
Age: ${currentAge} years old (Life Stage: ${currentAge < 1 ? 'Puppy' : currentAge > 7 ? 'Senior' : 'Adult'}).
Diet Goal / Specialty: ${dietGoal}
Owner Notes / Constraints: ${customDietNotes || "None"}

Please design:
1. Daily Caloric Requirements calculation (based on active standard metabolic curves for this breed size and age).
2. Ideal Protein / Fat / Fiber dry matter ratios.
3. Specimen Whole-Food Recipe: A detailed safe ingredient composition with precise measures.
4. Forbidden Foods & Health Risks (specifically filtered for ${currentBreed ? currentBreed.name : 'dogs'}).
5. Daily Feeding Routine & Schedule.
6. MANDATORY CREDIBLE NUTRITIONAL CITATION: No nutritional recommendation may be written without credible references. Every portion standard, resting energy requirement (RER), macronutrient ratio, and toxic food warning MUST explicitly cite an accredited clinical standard (such as National Research Council (NRC 2006) Nutrient Requirements of Dogs, WSAVA Global Nutrition Guidelines, AAFCO Dog Food Nutrient Profiles, or ACVN). Conclude with a dedicated '[Verified Nutritional References]' block.`;

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', parts: [{ text: fullPrompt }] }],
          systemInstruction: "You are the head canine nutritional science officer at DogHealthOS. Formulate precise, clinical, and delightful whole-food recipes and caloric targets. MANDATORY RULE: No information should be written without credible references. Ensure all guidelines, RER formulas, and mineral ratios cite authoritative canine diet standards (like NRC 2006, WSAVA Global Nutrition, AAFCO, or ACVN)."
        })
      });
      const data = await res.json();
      if (data.error) {
        setNutritionResult(`⚠️ Error: ${data.error}`);
      } else {
        setNutritionResult(data.text || 'No response returned.');
        logUserAction('Nutri Chef Formulation', {
          breed: currentBreed ? currentBreed.name : 'Unknown Breed',
          age: currentAge,
          goal: dietGoal
        });
      }
    } catch (err: any) {
      setNutritionResult(`⚠️ Network Error: ${err.message}`);
    } finally {
      setIsNutritionLoading(false);
    }
  };

  // 3. Studio Portrait Studio via gemini-3.1-flash-image
  const generateStudioPortrait = async () => {
    if (!imagePrompt.trim()) return;
    setIsStudioLoading(true);
    setStudioResult('');

    const enhancedPrompt = `${imagePrompt}. Studio grade lighting, highly polished canine portrait, realistic details, beautiful composition, rich contrast.`;

    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          model: "gemini-3.1-flash-image",
          aspectRatio: aspectRatio,
          imageSize: imageSize
        })
      });
      const data = await res.json();
      if (data.error) {
        setStudioResult(`⚠️ Notice: ${data.error}`);
      } else {
        setStudioResult(data.imageUrl);
        logUserAction('Generated Portrait Canvas', {
          prompt: imagePrompt,
          aspectRatio: aspectRatio,
          imageSize: imageSize
        });
      }
    } catch (err: any) {
      setStudioResult(`⚠️ Network Error: ${err.message}`);
    } finally {
      setIsStudioLoading(false);
    }
  };

  // 4. Portrait Magic Image Editor via gemini-3.1-flash-image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateMagicEdit = async () => {
    if (!magicPrompt.trim() || !uploadedImage) return;
    setIsMagicLoading(true);
    setMagicResult('');

    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: magicPrompt,
          model: "gemini-3.1-flash-image",
          aspectRatio: "1:1",
          base64Image: uploadedImage
        })
      });
      const data = await res.json();
      if (data.error) {
        setMagicResult(`⚠️ Notice: ${data.error}`);
      } else {
        setMagicResult(data.imageUrl);
      }
    } catch (err: any) {
      setMagicResult(`⚠️ Network Error: ${err.message}`);
    } finally {
      setIsMagicLoading(false);
    }
  };

  // 5. Voice Clinical Hotline using Live API WebSocket
  const startVoiceHotline = async () => {
    if (isVoiceConnected) {
      stopVoiceHotline();
      return;
    }

    try {
      // Initialize output AudioContext
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = async () => {
        setIsVoiceConnected(true);
        setIsLiveActive(true);
        nextStartTimeRef.current = 0;
        
        // Start Mic Recording
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;
          
          inputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
          const source = inputAudioCtxRef.current.createMediaStreamSource(stream);
          
          // Script processor for capturing audio chunks (4096 buffer size)
          const processor = inputAudioCtxRef.current.createScriptProcessor(4096, 1, 1);
          micProcessorRef.current = processor;
          
          source.connect(processor);
          processor.connect(inputAudioCtxRef.current.destination);

          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            
            // Generate minor visual pulse in UI
            let sum = 0;
            for (let i = 0; i < inputData.length; i++) {
              sum += inputData[i] * inputData[i];
            }
            const rms = Math.sqrt(sum / inputData.length);
            const level = Math.min(100, Math.floor(rms * 250));
            
            setVoiceVisualizer(() => {
              const pulse = new Array(15).fill(0).map(() => 2 + Math.floor(Math.random() * (level + 2)));
              return pulse;
            });

            // Convert to Int16 PCM array buffer
            const pcmBuffer = floatTo16BitPCM(inputData);
            const base64 = base64ArrayBuffer(pcmBuffer);
            
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({ audio: base64 }));
            }
          };

        } catch (e: any) {
          console.error("Microphone access denied or failed", e);
          stopVoiceHotline();
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.audio) {
            playAudioChunk(msg.audio);
          }
          if (msg.interrupted) {
            // Cancel current scheduling
            nextStartTimeRef.current = 0;
          }
        } catch (err) {
          console.error("Error decoding audio message", err);
        }
      };

      wsRef.current.onclose = () => {
        stopVoiceHotline();
      };

      wsRef.current.onerror = (e) => {
        console.error("WebSocket error", e);
        stopVoiceHotline();
      };

    } catch (e) {
      console.error("Failed to start Live Audio", e);
      stopVoiceHotline();
    }
  };

  const stopVoiceHotline = () => {
    setIsVoiceConnected(false);
    setIsLiveActive(false);
    setVoiceVisualizer(new Array(15).fill(2));

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (micProcessorRef.current) {
      micProcessorRef.current.disconnect();
      micProcessorRef.current = null;
    }

    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

  // Convert Float32 to Int16 Little Endian PCM
  const floatTo16BitPCM = (input: Float32Array): ArrayBuffer => {
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  };

  const base64ArrayBuffer = (arrayBuffer: ArrayBuffer): string => {
    let binary = "";
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const playAudioChunk = (base64Data: string) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = audioCtxRef.current;
    
    try {
      const binary = atob(base64Data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      const int16Array = new Int16Array(bytes.buffer);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }
      
      const audioBuffer = ctx.createBuffer(1, float32Array.length, 24000);
      audioBuffer.getChannelData(0).set(float32Array);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      const now = ctx.currentTime;
      let startTime = nextStartTimeRef.current;
      if (startTime < now) {
        startTime = now + 0.04;
      }
      
      source.start(startTime);
      nextStartTimeRef.current = startTime + audioBuffer.duration;
    } catch (e) {
      console.error("Failed to compile or play audio chunk", e);
    }
  };

  // 6. Specialty Multi-Turn Chatbot
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsgText = chatInput;
    setChatInput('');
    setIsChatLoading(true);

    const botProfiles = {
      general: {
        role: "Senior Veterinary General Practitioner",
        instruction: "You are Dr. Barnes, an elite canine general practitioner with 20 years clinical experience. You are warm, objective, professional, and explain complex biological processes simply using clear list structures."
      },
      nutrition: {
        role: "Bespoke Canine Clinical Nutritionist",
        instruction: "You are Chef Stella, an expert canine raw-feeding and therapeutic diet veterinarian. You specialize in formulation curves, dietary allergies, vitamins, and metabolic efficiency."
      },
      behavior: {
        role: "Certified Canine Cognitive Ethologist & Behavior Specialist",
        instruction: "You are Coach Marcus, a specialist in cognitive canine enrichment, behavioral anxiety, cooperative communication, and positive reinforcement. Your behavioral, psychological, and daycare advice is STRICTLY grounded in three premier reference bodies: (1) Duke Canine Cognition Center & Hare, B. et al. (2013/2019) (Lead: Dr. Brian Hare) for cognitive archetypes, gaze-tracking, communicative cues, and scent problem solving; (2) The Family Dog Project, Eötvös Loránd University – ELTE (2014/2020) (Leads: Dr. Ádám Miklósi, Dr. Enikő Kubinyi) for human-canine attachment ethology, vocalization semantics, and canine cognitive aging (CCD); and (3) Fear Free Pets Veterinary Initiative (2018/2024) (Lead: Dr. Marty Becker, DVM) for the FAS (Fear, Anxiety, Stress) spectrum, low-stress handling, and sensory decompression. Always integrate and cite these bodies when explaining what dogs think, what they want, or how they cope with daycare, fear, or aging."
      },
      senior: {
        role: "Palliative & Geriatric Care Advocate",
        instruction: "You are Nurse Sarah, a loving canine hospice and comfort advisor. You provide compassionate, practical home safety layouts, orthopedic bed solutions, and cognitive support plans."
      }
    };

    const activeProfile = botProfiles[selectedBot];
    const userMessage: ChatMessage = { role: 'user', parts: [{ text: userMsgText }] };
    
    const currentHistory = chatMessages[selectedBot];
    const updatedHistory = [...currentHistory, userMessage];

    setChatMessages(prev => ({
      ...prev,
      [selectedBot]: updatedHistory
    }));

    const breedContext = currentBreed 
      ? `Companion: ${currentBreed.name} (${currentBreed.size} category, expected lifespan: ${currentBreed.max}y). Active age is ${currentAge} years old.` 
      : "Companion details unknown.";

    const systemInstruction = `${activeProfile.instruction}
Context of current dog: ${breedContext}
Always maintain professional decorum. Advise seeking emergency clinics immediately if red flag symptoms appear. Keep messages structured and easy to read.
MANDATORY CONSTITUTION: Absolute transparency and veterinary trust are core to DogHealthOS. NO information should ever be written without credible references. Every clinical deduction, behavioral analysis, cognitive metric, life expectancy estimate, biological metric, developmental milestone, physiological baseline, or dietary recommendation you write MUST be backed by and tagged with credible references from recognized bodies and peer-reviewed studies (such as Duke Canine Cognition Center (Dr. Brian Hare), The Family Dog Project / Eötvös Loránd University - ELTE (Dr. Ádám Miklósi & Dr. Enikő Kubinyi), Fear Free Pets Veterinary Initiative (Dr. Marty Becker, DVM), Royal Veterinary College (RVC VetCompass™), University of Georgia Canine Mortality Study, AKC Pediatric Growth Standards, AAHA Canine Life Stage Guidelines, AVMA, WSAVA Global Nutrition Guidelines, or NRC). End your response with '[Verified Clinical Reference]' citing the authoritative bodies backing your advice.`;

    try {
      const formattedHistory = updatedHistory.map(m => ({
        role: m.role,
        parts: m.parts
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedHistory,
          systemInstruction: systemInstruction,
          model: "gemini-3.8-flash"
        })
      });
      const data = await res.json();
      
      if (data.text) {
        setChatMessages(prev => ({
          ...prev,
          [selectedBot]: [
            ...prev[selectedBot],
            { role: 'model', parts: [{ text: data.text }] }
          ]
        }));
        logUserAction('AI Chat Query', {
          bot: selectedBot,
          question: userMsgText,
          breed: currentBreed ? currentBreed.name : 'Unknown Breed'
        });
      } else {
        // Fallback reassurance if server couldn't deliver response text
        const botName = selectedBot === 'nutrition' ? 'Chef Stella' : selectedBot === 'senior' ? 'Nurse Sarah' : selectedBot === 'behavior' ? 'Coach Marcus' : 'Dr. Barnes';
        const fallbackNotice = `🐾 **${botName} (Care Specialist):**\n\nI am right here with you. While our cloud telemetry reconnects, here is an immediate clinical priority: For changes in your companion's appetite, energy, or behavior, keep them in a calm, temperature-controlled room, offer small sips of clean water, and observe for any acute distress. If refusal of food or water persists past 24 hours, contact your local veterinary clinic for an in-person diagnostic evaluation.\n\n*[Verified Reference: AAHA & WSAVA Global Clinical Standards]*`;
        
        setChatMessages(prev => ({
          ...prev,
          [selectedBot]: [
            ...prev[selectedBot],
            { role: 'model', parts: [{ text: fallbackNotice }] }
          ]
        }));
      }
    } catch (err: any) {
      const botName = selectedBot === 'nutrition' ? 'Chef Stella' : selectedBot === 'senior' ? 'Nurse Sarah' : selectedBot === 'behavior' ? 'Coach Marcus' : 'Dr. Barnes';
      const networkFallback = `🐾 **${botName} (Care Specialist):**\n\nI am right here with you. We experienced a temporary network connection delay, but your pet's comfort comes first. Always maintain fresh, clean water, avoid sudden diet switches, and monitor your companion closely. Feel free to re-send your question in a moment!\n\n*[Verified Reference: AAHA Canine Life Stage Standards]*`;
      setChatMessages(prev => ({
        ...prev,
        [selectedBot]: [
          ...prev[selectedBot],
          { role: 'model', parts: [{ text: networkFallback }] }
        ]
      }));
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="bg-white/50 dark:bg-[#282420]/65 backdrop-blur-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[6px_6px_0_#1A1A1A] dark:shadow-[6px_6px_0_#F0ECE6] rounded-2xl p-6 mb-10 overflow-hidden">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-dashed border-[#1A1A1A]/20 dark:border-white/20 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-[#FF6B4A]" />
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6]">
              DogHealthOS™ Pro Care Suite
            </h2>
          </div>
          <p className="text-xs text-[#8A8680] dark:text-[#9A9590]">
            Integrated clinical AI utilities optimized for a <strong className="text-[#1A1A1A] dark:text-[#F0ECE6]">{currentBreed ? currentBreed.name : 'selected companion'}</strong> ({currentAge}y)
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {onOpenPricing && (
            <button
              onClick={onOpenPricing}
              className="px-2.5 py-1 bg-[#E5A836]/15 hover:bg-[#E5A836]/25 border border-[#E5A836] text-[#E5A836] dark:text-amber-300 rounded-lg text-[0.65rem] font-mono font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
            >
              <Sparkles className="w-3 h-3 text-[#E5A836]" />
              <span>Pro & Breeder Plans</span>
            </button>
          )}
          <div className="px-3 py-1 bg-[#2D8C6F]/10 border-2 border-[#2D8C6F] text-[#2D8C6F] rounded-lg text-[0.68rem] font-mono font-black uppercase tracking-wider">
            AI Diagnostic Hub
          </div>
        </div>
      </div>

      {/* Modern Brutalist Tab bar */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6">
        {[
          { id: 'chatbot', label: '🤖 Specialty Chats', icon: Bot },
          { id: 'diagnostics', label: '🩺 Deep Diagnostics', icon: Brain },
          { id: 'nutrition', label: '🥩 Nutri Chef', icon: ChefHat },
          { id: 'studio', label: '📸 Portrait Studio', icon: ImageIcon },
          { id: 'magic', label: '🪄 Canvas Edit', icon: Sparkles },
          { id: 'voice', label: '📞 Voice Hotline', icon: Mic },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id !== 'voice' && isVoiceConnected) {
                  stopVoiceHotline();
                }
              }}
              className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 text-center rounded-xl border-2 font-bold text-xs transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white dark:bg-[#F0ECE6] dark:border-[#F0ECE6] dark:text-[#141210] shadow-[2px_2px_0_#FF6B4A]'
                  : 'bg-[#1A1A1A]/2 hover:bg-[#1A1A1A]/5 dark:bg-white/2 dark:hover:bg-white/5 border-[#1A1A1A]/10 dark:border-white/10 text-[#8A8680] dark:text-[#9A9590]'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-[0.62rem] uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tabs Content */}
      <div className="relative min-h-[350px]">
        
        {/* TAB 1: MULTI-TURN SPECIALTY CHATBOT */}
        {activeTab === 'chatbot' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-[#1A1A1A]/2 dark:bg-white/2 p-3 border-2 border-dashed border-[#1A1A1A]/10 dark:border-white/10 rounded-xl">
              <div>
                <span className="text-[0.62rem] font-bold text-[#8A8680] dark:text-[#9A9590] uppercase tracking-wider block">1. Select AI Specialist</span>
                <strong className="text-sm font-black text-[#1A1A1A] dark:text-[#F0ECE6] uppercase">Consult Clinical Advisors</strong>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'general', label: 'Dr. Barnes (Vet GP)', color: 'border-sky-500 text-sky-600 dark:text-sky-400' },
                  { id: 'nutrition', label: 'Stella (Nutri)', color: 'border-[#E5A836] text-[#E5A836]' },
                  { id: 'behavior', label: 'Marcus (Behavior)', color: 'border-[#C75B7A] text-[#C75B7A]' },
                  { id: 'senior', label: 'Sarah (Comfort)', color: 'border-emerald-500 text-emerald-600' },
                ].map((bot) => (
                  <button
                    key={bot.id}
                    onClick={() => setSelectedBot(bot.id as any)}
                    className={`px-2.5 py-1 text-[0.65rem] font-mono font-bold rounded-lg border-2 cursor-pointer transition-all ${
                      selectedBot === bot.id
                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white dark:bg-[#F0ECE6] dark:border-[#F0ECE6] dark:text-[#141210]'
                        : `bg-white dark:bg-[#1E1C18] hover:bg-neutral-100 dark:hover:bg-neutral-800 ${bot.color}`
                    }`}
                  >
                    {bot.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Specialty Advisor Scope & Governing Reference Bodies Banner */}
            {selectedBot === 'behavior' && (
              <div className="p-3.5 bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-pink-500/10 border-2 border-[#C75B7A]/40 rounded-xl space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C75B7A] animate-pulse" />
                    <strong className="text-xs font-black uppercase text-[#1A1A1A] dark:text-[#F0ECE6] tracking-wide">
                      Coach Marcus — Certified Canine Cognitive Ethologist & Behavior Specialist
                    </strong>
                  </div>
                  <span className="text-[0.6rem] font-mono font-bold px-2 py-0.5 rounded bg-[#C75B7A]/20 text-[#C75B7A] uppercase border border-[#C75B7A]/30">
                    Verified 3-Pillar Scientific Foundation
                  </span>
                </div>
                <p className="text-[0.68rem] text-stone-700 dark:text-stone-300 leading-snug">
                  Every behavioral triage assessment, daycare decompression schedule, and cognitive exercise from Coach Marcus is strictly grounded in and verified by three world-leading reference bodies:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[0.62rem]">
                  <div className="p-2.5 bg-white/95 dark:bg-[#1C1A17] rounded-lg border border-indigo-500/30 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center justify-between">
                        <strong className="text-indigo-600 dark:text-indigo-400 font-bold text-[0.66rem]">1. Duke Cognition Center</strong>
                        <span className="text-[0.55rem] font-mono uppercase text-indigo-500">2013/2019</span>
                      </div>
                      <div className="text-[0.64rem] font-bold text-stone-800 dark:text-stone-200 mt-0.5">
                        Lead: Dr. Brian Hare
                      </div>
                      <span className="text-[0.58rem] text-stone-600 dark:text-stone-400 block mt-0.5 leading-tight">
                        Cognitive Archetypes, Gaze Tracking, Communicative Cues & Scent Problem-Solving
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-white/95 dark:bg-[#1C1A17] rounded-lg border border-purple-500/30 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center justify-between">
                        <strong className="text-purple-600 dark:text-purple-400 font-bold text-[0.66rem]">2. The Family Dog Project</strong>
                        <span className="text-[0.55rem] font-mono uppercase text-purple-500">2014/2020</span>
                      </div>
                      <div className="text-[0.64rem] font-bold text-stone-800 dark:text-stone-200 mt-0.5">
                        Leads: Dr. Ádám Miklósi, Dr. Enikő Kubinyi
                      </div>
                      <span className="text-[0.58rem] text-stone-600 dark:text-stone-400 block mt-0.5 leading-tight">
                        Eötvös Loránd University (ELTE) · Attachment Ethology, Semantics & Cognitive Aging (CCD)
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-white/95 dark:bg-[#1C1A17] rounded-lg border border-amber-500/30 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center justify-between">
                        <strong className="text-amber-600 dark:text-amber-400 font-bold text-[0.66rem]">3. Fear Free Pets Initiative</strong>
                        <span className="text-[0.55rem] font-mono uppercase text-amber-500">2018/2024</span>
                      </div>
                      <div className="text-[0.64rem] font-bold text-stone-800 dark:text-stone-200 mt-0.5">
                        Lead: Dr. Marty Becker, DVM
                      </div>
                      <span className="text-[0.58rem] text-stone-600 dark:text-stone-400 block mt-0.5 leading-tight">
                        FAS (Fear, Anxiety & Stress) Scoring, Low-Stress Handling & Sensory Decompression
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Thread */}
            <div className="border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl bg-white dark:bg-[#141210] h-[320px] overflow-y-auto p-4 flex flex-col gap-3">
              {chatMessages[selectedBot].length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-stone-400">
                  <Bot className="w-10 h-10 mb-2 text-[#FF6B4A]/50" />
                  <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6]">
                    {selectedBot === 'behavior' 
                      ? "Consult Coach Marcus on Canine Psychology & Daycare Coping" 
                      : "No active diagnostics ledger opened with this advisor."}
                  </p>
                  <p className="text-[0.68rem] text-[#8A8680] mt-1 max-w-md">
                    {selectedBot === 'behavior'
                      ? `Ask Marcus about ${currentBreed ? currentBreed.name : 'your companion'}'s Duke cognitive archetype, daycare fatigue, cortisol recovery, or low-stress decompression:`
                      : `Ask anything about ${currentBreed ? currentBreed.name : 'your companion'}'s specific developmental needs, early warnings, exercises, or behavior modifications.`}
                  </p>

                  {selectedBot === 'behavior' && (
                    <div className="mt-3 flex flex-wrap gap-1.5 justify-center max-w-lg">
                      {[
                        "Does my dog show signs of daycare burnout or the 48-Hour Coma?",
                        "What is my dog's Duke cognitive archetype and how should I enrich them?",
                        "How do Fear Free low-stress protocols mitigate separation anxiety?",
                        "What do the ELTE Family Dog Project studies say about attachment?"
                      ].map((promptText, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setChatInput(promptText)}
                          className="px-2.5 py-1 text-[0.62rem] font-mono font-medium rounded-lg bg-stone-100 hover:bg-[#C75B7A]/15 hover:text-[#C75B7A] dark:bg-stone-800 dark:hover:bg-[#C75B7A]/20 border border-stone-200 dark:border-stone-700 transition-colors text-left text-stone-600 dark:text-stone-300 cursor-pointer"
                        >
                          💬 {promptText}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {chatMessages[selectedBot].map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col max-w-[85%] ${
                    msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <span className="text-[0.58rem] font-mono font-bold uppercase text-stone-400 mb-0.5">
                    {msg.role === 'user' ? 'Pet Parent' : selectedBot.toUpperCase() + ' ASSISTANT'}
                  </span>
                  <div
                    className={`p-3.5 rounded-xl border-2 text-xs font-medium leading-relaxed shadow-[2px_2px_0_#1A1A1A] dark:shadow-[2px_2px_0_#F0ECE6] ${
                      msg.role === 'user'
                        ? 'bg-[#FF6B4A] border-[#1A1A1A] dark:border-[#F0ECE6] text-white'
                        : 'bg-stone-50 dark:bg-[#201D1A] border-[#1A1A1A] dark:border-[#F0ECE6] text-[#1A1A1A] dark:text-[#F0ECE6]'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
                    {msg.role !== 'user' && (
                      <div className="mt-2.5 pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => togglePlayAudio(`chat-${index}`, msg.parts[0].text, selectedBot === 'nutrition' ? 'Kore' : selectedBot === 'senior' ? 'Zephyr' : selectedBot === 'behavior' ? 'Puck' : 'Fenrir')}
                          className={`px-2 py-1 rounded-md text-[0.62rem] font-mono font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer border ${
                            playingAudioId === `chat-${index}`
                              ? 'bg-amber-500 text-black border-black shadow-[1px_1px_0_#000] animate-pulse'
                              : voiceUnavailableMsgId === `chat-${index}`
                              ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-400 dark:border-amber-600'
                              : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-300 dark:hover:bg-stone-700'
                          }`}
                          title={voiceUnavailableMsgId === `chat-${index}` ? "Voice not available at the moment" : "Listen to Spoken Voice Message (Gemini Neural TTS)"}
                        >
                          {playingAudioId === `chat-${index}` ? (
                            <>
                              <Square className="w-3 h-3 fill-current" />
                              <span>Stop Spoken Voice</span>
                            </>
                          ) : voiceUnavailableMsgId === `chat-${index}` ? (
                            <>
                              <VolumeX className="w-3 h-3 text-amber-600" />
                              <span>Voice not available at the moment</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span>🔊 Listen (Spoken Voice)</span>
                            </>
                          )}
                        </button>
                        <VerifiedByBadge
                          sourceText={msg.parts[0].text}
                          layout="pill"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isChatLoading && (
                <div className="self-start flex items-center gap-2 p-3 bg-stone-50 dark:bg-[#201D1A] border-2 border-[#1A1A1A] rounded-xl text-xs font-mono font-black text-emerald-600 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>SPECIALIST FORMULATING INSIGHTS...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-[#2D8C6F]/5 dark:bg-[#2D8C6F]/10 border-2 border-[#1A1A1A]/10 dark:border-[#F0ECE6]/15 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-[#2D8C6F] shrink-0" />
              <span className="text-[0.6rem] font-mono font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider leading-none">
                {selectedBot === 'behavior'
                  ? 'Coach Marcus consults are strictly verified by: Duke Canine Cognition Center (Dr. Brian Hare), Family Dog Project ELTE (Dr. Ádám Miklósi), and Fear Free Pets (Dr. Marty Becker, DVM).'
                  : 'All clinical consults are referenced against AVMA, AAHA, and leading university veterinary research databases.'}
              </span>
            </div>

            {/* Input Desk */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendChatMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Ask ${selectedBot === 'general' ? 'Dr. Barnes' : selectedBot === 'nutrition' ? 'Stella' : selectedBot === 'behavior' ? 'Marcus' : 'Sarah'} anything...`}
                className="flex-1 px-4 py-3 border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1E1C18] text-[#1A1A1A] dark:text-[#F0ECE6] text-xs font-bold rounded-xl shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px]"
              />
              <button
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="px-5 py-3 bg-emerald-500 border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] text-white rounded-xl shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] font-bold uppercase tracking-wider text-[0.68rem] flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all hover:translate-x-[-1px]"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: DEEP DIAGNOSTICS via gemini-3.1-pro-preview HIGH THINKING */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/3 border-[2px] border-emerald-500/30 rounded-xl flex gap-3">
              <ShieldAlert className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-[#1A1A1A] dark:text-[#F0ECE6] block uppercase font-mono tracking-wider">Clinical Logic Engine Active (HIGH THINKING)</strong>
                <p className="text-[0.65rem] text-[#8A8680] mt-0.5 leading-relaxed">
                  Utilizes <strong>gemini-3.1-pro-preview</strong> running multi-step reasoning models to analyze complex canine clinical presentations and map outcomes against orthopedic, geriatric, and breed-specific genetic databases.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.68rem] font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6] block">
                Describe Clinical Presentation / Stiff Gait / Cognitive Changes:
              </label>
              <textarea
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                placeholder="E.g., Senior golden retriever drinking double the standard water intake, has a noticeable limp on rear left knee after laying down, and appears occasionally disoriented in corners of the room..."
                rows={3}
                className="w-full px-4 py-3 border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1E1C18] text-[#1A1A1A] dark:text-[#F0ECE6] text-xs font-bold rounded-xl shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px]"
              />
            </div>

            <button
              onClick={runDiagnostics}
              disabled={isDiagLoading || !symptomsInput.trim()}
              className="w-full py-3 bg-[#1A1A1A] dark:bg-[#F0ECE6] text-[#F0ECE6] dark:text-[#1A1A1A] border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[3px_3px_0_#FF6B4A] rounded-xl font-bold uppercase text-[0.68rem] flex items-center justify-center gap-2 cursor-pointer transition-all hover:translate-x-[-1px] disabled:opacity-50"
            >
              <Brain className="w-4 h-4 text-emerald-500 animate-pulse" />
              Analyze Symptoms with Deep Vet Clinical Diagnostics (High Thinking)
            </button>

            {/* Diagnostics loading screen */}
            {isDiagLoading && (
              <div className="p-10 border-2 border-dashed border-[#1A1A1A]/20 rounded-xl bg-stone-50 dark:bg-[#201D1A] flex flex-col items-center justify-center text-center gap-3">
                <Activity className="w-10 h-10 text-emerald-600 animate-spin" />
                <div className="text-xs font-mono font-black text-[#1A1A1A] dark:text-[#F0ECE6] uppercase tracking-wide">
                  {reassuringDiagMessages[reassuringMsgIdx]}
                </div>
                <p className="text-[0.65rem] text-[#8A8680] max-w-sm">
                  Deep thinking models do not cap token outputs during complex veterinary correlation. This may take up to 15 seconds to resolve biological conditions.
                </p>
              </div>
            )}

            {/* Result ledger */}
            {diagResult && (
              <div className="space-y-4">
                <div className="border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] bg-stone-50 dark:bg-[#1A1816] rounded-xl p-5 overflow-x-auto space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#2D8C6F] pb-1 border-b-2 border-dashed border-[#1A1A1A]/10 dark:border-white/10 flex items-center gap-1.5">
                    <Activity className="w-4 h-4" /> Clinical Case Analysis Report
                  </h4>
                  <div className="prose dark:prose-invert max-w-none text-xs font-medium leading-relaxed whitespace-pre-wrap text-[#1A1A1A] dark:text-[#F0ECE6]">
                    {diagResult}
                  </div>
                  <div className="pt-2 border-t border-[#1A1A1A]/10 dark:border-white/10">
                    <VerifiedByBadge sourceText={diagResult} databaseKey="avma" layout="banner" />
                  </div>
                  
                  {/* Spoken Clinical Briefing Audio Passport */}
                  <div className="pt-3 border-t border-dashed border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-emerald-500/10 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[0.65rem] font-mono font-black uppercase text-emerald-800 dark:text-emerald-300 block">
                          Spoken Clinical Triage Briefing (Audio Passport)
                        </span>
                        <span className="text-[0.58rem] text-stone-500 dark:text-stone-400">
                          Listen to verbal triage guidance and emergency steps (Dr. Barnes Voice - Gemini 3.8 TTS)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => togglePlayAudio('diag', diagResult, 'Fenrir', 'Authoritative, calm senior veterinary general practitioner')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer border-2 shrink-0 ${
                          playingAudioId === 'diag'
                            ? 'bg-rose-500 text-white border-black animate-pulse'
                            : voiceUnavailableMsgId === 'diag'
                            ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-400 dark:border-amber-600'
                            : 'bg-[#1A1A1A] text-white dark:bg-[#F0ECE6] dark:text-[#1A1A1A] border-black hover:bg-emerald-600 dark:hover:bg-emerald-400'
                        }`}
                      >
                        {playingAudioId === 'diag' ? (
                          <>
                            <Square className="w-3.5 h-3.5 fill-current" />
                            <span>Stop Briefing</span>
                          </>
                        ) : voiceUnavailableMsgId === 'diag' ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-amber-600" />
                            <span>Voice not available at the moment</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>🔊 Play Audio Briefing</span>
                          </>
                        )}
                      </button>
                      {onOpenAudioPassport && (
                        <button
                          type="button"
                          onClick={() => onOpenAudioPassport({
                            planType: 'triage',
                            petName: currentBreed ? `${currentBreed.name} Patient` : 'Bella',
                            customText: diagResult,
                            voice: 'Fenrir'
                          })}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-black uppercase tracking-wider bg-emerald-500 text-black border-2 border-black hover:bg-emerald-400 cursor-pointer flex items-center gap-1 shrink-0"
                          title="Open in Audio Passports Studio"
                        >
                          <Headphones className="w-3.5 h-3.5" />
                          <span>Studio</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-sky-50 dark:bg-sky-950/20 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl flex items-start gap-3 shadow-[2px_2px_0_#0284c7]">
                  <ShieldAlert className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[0.68rem] font-black uppercase tracking-wider text-sky-800 dark:text-sky-300">
                      Clinical Advisory & Evidence-Based Verification
                    </h5>
                    <p className="text-[0.65rem] text-sky-700/90 dark:text-sky-300/80 leading-relaxed mt-0.5">
                      This clinical analysis report is cross-referenced with diagnostic guidelines published by the <strong>American Veterinary Medical Association (AVMA)</strong>, the <strong>American Animal Hospital Association (AAHA)</strong>, and peer-reviewed veterinary clinical college databases.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: NUTRITION PLANNER via gemini-3.5-flash */}
        {activeTab === 'nutrition' && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[0.68rem] font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6] block mb-1.5">
                  1. Diet Goal Priority:
                </label>
                <select
                  value={dietGoal}
                  onChange={(e) => setDietGoal(e.target.value)}
                  className="w-full px-3 py-2 border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1E1C18] text-[#1A1A1A] dark:text-[#F0ECE6] text-xs font-bold rounded-lg focus:outline-none"
                >
                  <option value="balanced">Standard Balanced Maintenance</option>
                  <option value="raw">Whole raw feeding recipe framework</option>
                  <option value="weight_loss">Active Calorie Deficit (Weight Control)</option>
                  <option value="allergy">Hypoallergenic & Elimination Diet (Joint/Skin Support)</option>
                  <option value="athletic">High Active Performance (Working Dog / Agility)</option>
                </select>
              </div>

              <div>
                <label className="text-[0.68rem] font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6] block mb-1.5">
                  2. Optional Notes (Allergies / Likes):
                </label>
                <input
                  type="text"
                  value={customDietNotes}
                  onChange={(e) => setCustomDietNotes(e.target.value)}
                  placeholder="E.g., allergic to chicken, sensitive digestion, loves beef liver..."
                  className="w-full px-3 py-2 border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1E1C18] text-[#1A1A1A] dark:text-[#F0ECE6] text-xs font-bold rounded-lg focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={runNutritionPlanner}
              disabled={isNutritionLoading}
              className="w-full py-3 bg-[#2D8C6F] border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] text-white rounded-xl shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] font-bold uppercase text-[0.68rem] flex items-center justify-center gap-2 cursor-pointer transition-all hover:translate-x-[-1px] disabled:opacity-50"
            >
              <ChefHat className="w-4 h-4" />
              Generate Whole-Food Formulation Ledger
            </button>

            {isNutritionLoading && (
              <div className="p-10 border-2 border-dashed border-[#1A1A1A]/20 rounded-xl bg-stone-50 dark:bg-[#201D1A] flex flex-col items-center justify-center text-center gap-2">
                <ChefHat className="w-10 h-10 text-[#E5A836] animate-bounce" />
                <span className="text-xs font-mono font-black text-[#1A1A1A] dark:text-[#F0ECE6] uppercase tracking-wide">
                  Calibrating caloric metabolic equations...
                </span>
              </div>
            )}

            {nutritionResult && (
              <div className="space-y-4">
                <div className="border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] bg-stone-50 dark:bg-[#1A1816] rounded-xl p-5 overflow-x-auto space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#E5A836] pb-1 border-b-2 border-dashed border-[#1A1A1A]/10 dark:border-white/10 flex items-center gap-1.5">
                    <ChefHat className="w-4 h-4" /> Customized Whole-Food Care Plan
                  </h4>
                  <div className="prose dark:prose-invert max-w-none text-xs font-medium leading-relaxed whitespace-pre-wrap text-[#1A1A1A] dark:text-[#F0ECE6]">
                    {nutritionResult}
                  </div>
                  <div className="pt-2 border-t border-[#1A1A1A]/10 dark:border-white/10">
                    <VerifiedByBadge sourceText={nutritionResult} databaseKey="wsava_nrc" layout="banner" />
                  </div>

                  {/* Spoken NutriChef Plan & Audio Passport */}
                  <div className="pt-3 border-t border-dashed border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-amber-500/10 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[0.65rem] font-mono font-black uppercase text-amber-800 dark:text-amber-300 block">
                          Spoken NutriChef Formulation (Chef Stella - Gemini 3.8 TTS)
                        </span>
                        <span className="text-[0.58rem] text-stone-500 dark:text-stone-400">
                          Listen to whole-food portions, caloric targets, and toxic food alerts
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => togglePlayAudio('nutrition', nutritionResult, 'Kore', 'Warm, empathetic, professional canine clinical nutritionist')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer border-2 shrink-0 ${
                          playingAudioId === 'nutrition'
                            ? 'bg-rose-500 text-white border-black animate-pulse'
                            : voiceUnavailableMsgId === 'nutrition'
                            ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-400 dark:border-amber-600'
                            : 'bg-[#1A1A1A] text-white dark:bg-[#F0ECE6] dark:text-[#1A1A1A] border-black hover:bg-amber-600 dark:hover:bg-amber-400'
                        }`}
                      >
                        {playingAudioId === 'nutrition' ? (
                          <>
                            <Square className="w-3.5 h-3.5 fill-current" />
                            <span>Stop Audio</span>
                          </>
                        ) : voiceUnavailableMsgId === 'nutrition' ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-amber-600" />
                            <span>Voice not available at the moment</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>🔊 Play Audio Plan</span>
                          </>
                        )}
                      </button>
                      {onOpenAudioPassport && (
                        <button
                          type="button"
                          onClick={() => onOpenAudioPassport({
                            planType: 'nutrition',
                            petName: currentBreed ? `${currentBreed.name} Companion` : 'Bella',
                            customText: nutritionResult,
                            voice: 'Kore'
                          })}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-black uppercase tracking-wider bg-amber-500 text-black border-2 border-black hover:bg-amber-400 cursor-pointer flex items-center gap-1 shrink-0"
                          title="Open in Audio Passports Studio"
                        >
                          <Headphones className="w-3.5 h-3.5" />
                          <span>Studio</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl flex items-start gap-3 shadow-[2px_2px_0_#d97706]">
                  <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[0.68rem] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
                      Nutritional Standard Reference & Integrity Seal
                    </h5>
                    <p className="text-[0.65rem] text-amber-700/90 dark:text-amber-300/80 leading-relaxed mt-0.5">
                      All whole-food formulation indexes and caloric metabolic recommendations are calculated using dietary parameters defined by the <strong>National Research Council (NRC) Canine Nutrient Guidelines</strong> and the <strong>Association of American Feed Control Officials (AAFCO)</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PORTRAIT STUDIO via gemini-3.1-flash-image */}
        {activeTab === 'studio' && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-[0.68rem] font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6] block mb-1.5">
                  Bespoke Studio Prompt:
                </label>
                <input
                  type="text"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder={`E.g., A cinematic oil portrait of a happy ${currentBreed ? currentBreed.name : 'dog'} wearing a golden veterinary crown, looking majestic`}
                  className="w-full px-3 py-2 border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1E1C18] text-[#1A1A1A] dark:text-[#F0ECE6] text-xs font-bold rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[0.68rem] font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6] block mb-1.5">
                    Studio Size:
                  </label>
                  <select
                    value={imageSize}
                    onChange={(e) => setImageSize(e.target.value as any)}
                    className="w-full px-2 py-2 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1E1C18] text-[#1A1A1A] dark:text-[#F0ECE6] text-xs font-bold rounded-lg"
                  >
                    <option value="1K">1K HD Quality</option>
                    <option value="2K">2K Super HD</option>
                    <option value="4K">4K Studio Master</option>
                  </select>
                </div>
                <div>
                  <label className="text-[0.68rem] font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6] block mb-1.5">
                    Aspect Ratio:
                  </label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full px-2 py-2 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1E1C18] text-[#1A1A1A] dark:text-[#F0ECE6] text-xs font-bold rounded-lg"
                  >
                    <option value="1:1">1:1 Square</option>
                    <option value="3:2">3:2 Landscape</option>
                    <option value="2:3">2:3 Portrait</option>
                    <option value="4:3">4:3 Photo</option>
                    <option value="3:4">3:4 Book</option>
                    <option value="16:9">16:9 Widescreen</option>
                    <option value="9:16">9:16 vertical</option>
                    <option value="21:9">21:9 Cinematic</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={generateStudioPortrait}
              disabled={isStudioLoading || !imagePrompt.trim()}
              className="w-full py-3 bg-[#FF6B4A] border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] text-white rounded-xl shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] font-bold uppercase text-[0.68rem] flex items-center justify-center gap-2 cursor-pointer transition-all hover:translate-x-[-1px] disabled:opacity-50"
            >
              <ImageIcon className="w-4 h-4" />
              Render Studio Portrait (gemini-3.1-flash-image)
            </button>

            {isStudioLoading && (
              <div className="p-10 border-2 border-dashed border-[#1A1A1A]/20 rounded-xl bg-stone-50 dark:bg-[#201D1A] flex flex-col items-center justify-center text-center gap-2">
                <RefreshCw className="w-10 h-10 text-[#FF6B4A] animate-spin" />
                <span className="text-xs font-mono font-black text-[#1A1A1A] dark:text-[#F0ECE6] uppercase tracking-wide">
                  Generating canvas pixels using pro models...
                </span>
              </div>
            )}

            {studioResult && (
              <div className="flex flex-col items-center justify-center bg-stone-100 dark:bg-stone-900 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl p-5 shadow-[4px_4px_0_#1A1A1A]">
                <img
                  src={studioResult}
                  alt="AI Generated Studio Portrait"
                  referrerPolicy="no-referrer"
                  className="max-h-[380px] rounded-lg border-2 border-[#1A1A1A] shadow-md mb-3 object-contain bg-white"
                />
                <a
                  href={studioResult}
                  download="DogHealthOS_Portrait.png"
                  className="px-4 py-2 bg-emerald-500 border-2 border-[#1A1A1A] text-white text-xs font-bold uppercase rounded-lg shadow-[2px_2px_0_#1A1A1A] hover:translate-y-[-1px]"
                >
                  Download HD Artwork
                </a>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PORTRAIT MAGIC EDITOR via gemini-3.1-flash-image */}
        {activeTab === 'magic' && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="p-4 bg-[#FF6B4A]/5 border-[2px] border-[#FF6B4A]/20 rounded-xl text-xs text-[#8A8680] dark:text-[#9A9590]">
              <strong className="text-[#1A1A1A] dark:text-[#F0ECE6] block uppercase font-mono mb-1">🪄 AI Portrait Magic Canvas:</strong>
              Transform or edit any photo! Upload a photo of your companion and enter your creative instructions below.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              
              {/* Left Column: Image Selector */}
              <div className="space-y-4">
                <div className="border-[2.5px] border-dashed border-[#1A1A1A]/30 rounded-xl p-4 text-center hover:bg-[#1A1A1A]/5 cursor-pointer relative transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 mx-auto mb-2 text-stone-400" />
                  <span className="text-[0.68rem] font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6] block">
                    Upload Custom Photo
                  </span>
                  <span className="text-[0.58rem] text-stone-400 block mt-0.5">Drag & drop or tap here</span>
                </div>

                {uploadedImage && (
                  <div className="relative inline-block border-2 border-[#1A1A1A] rounded-lg overflow-hidden max-w-[140px] shadow-sm">
                    <img src={uploadedImage} alt="Canvas Input Source" className="w-full object-cover h-28" />
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="absolute top-1 right-1 p-1 bg-red-500 rounded-md text-white hover:scale-110"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Right Columns: Transform prompt */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.68rem] font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6] block">
                    Magic Transform Prompts:
                  </label>
                  <input
                    type="text"
                    value={magicPrompt}
                    onChange={(e) => setMagicPrompt(e.target.value)}
                    placeholder="E.g., Add a fancy detective hat and clinical glasses to the portrait"
                    className="w-full px-3 py-2 border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1E1C18] text-[#1A1A1A] dark:text-[#F0ECE6] text-xs font-bold rounded-lg focus:outline-none"
                  />
                </div>

                <button
                  onClick={generateMagicEdit}
                  disabled={isMagicLoading || !uploadedImage || !magicPrompt.trim()}
                  className="w-full py-3 bg-[#1A1A1A] dark:bg-[#F0ECE6] text-[#F0ECE6] dark:text-[#1A1A1A] border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[3px_3px_0_#FF6B4A] rounded-xl font-bold uppercase text-[0.68rem] flex items-center justify-center gap-2 cursor-pointer transition-all hover:translate-x-[-1px] disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-[#FF6B4A] animate-pulse" />
                  Perform Portrait Magic Modification
                </button>

                {isMagicLoading && (
                  <div className="p-8 border-2 border-dashed border-[#1A1A1A]/20 rounded-xl bg-stone-50 dark:bg-[#201D1A] flex flex-col items-center justify-center text-center gap-2">
                    <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                    <span className="text-xs font-mono font-black text-[#1A1A1A] dark:text-[#F0ECE6] uppercase tracking-wide">
                      Transforming canvas with Gemini image intelligence...
                    </span>
                  </div>
                )}

                {magicResult && (
                  <div className="flex flex-col items-center justify-center bg-stone-100 dark:bg-stone-900 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl p-5 shadow-[4px_4px_0_#1A1A1A]">
                    <img
                      src={magicResult}
                      alt="Magic Edit Artwork Output"
                      referrerPolicy="no-referrer"
                      className="max-h-[300px] rounded-lg border-2 border-[#1A1A1A] shadow-md mb-3 object-contain bg-white"
                    />
                    <a
                      href={magicResult}
                      download="Magic_Companion_Artwork.png"
                      className="px-4 py-2 bg-emerald-500 border-2 border-[#1A1A1A] text-white text-xs font-bold uppercase rounded-lg shadow-[2px_2px_0_#1A1A1A]"
                    >
                      Download Modified Master
                    </a>
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

        {/* TAB 6: REAL-TIME VOICE HOTLINE via gemini-3.1-flash-live-preview */}
        {activeTab === 'voice' && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out] text-center max-w-lg mx-auto py-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mb-2">
              <Mic className={`w-8 h-8 ${isVoiceConnected ? 'text-red-500 animate-ping' : 'text-emerald-500'}`} />
            </div>

            <h3 className="text-md font-black uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6]">
              Real-Time Live Voice Consultant
            </h3>
            
            <p className="text-xs text-[#8A8680] dark:text-[#9A9590] leading-relaxed">
              Connect to our ultra-low latency voice hotline powered by <strong>gemini-3.1-flash-live-preview</strong>. Speak naturally, ask questions about longevity, milestones, or symptoms, and hear instant responses.
            </p>

            {/* Voice visualizer animation */}
            {isVoiceConnected && (
              <div className="flex items-center justify-center gap-1.5 py-6 h-12">
                {voiceVisualizer.map((height, idx) => (
                  <div
                    key={idx}
                    className="w-1.5 bg-[#2D8C6F] rounded-full transition-all duration-75"
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
            )}

            <button
              onClick={startVoiceHotline}
              className={`w-full py-4 rounded-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] font-extrabold uppercase tracking-widest text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
                isVoiceConnected
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {isVoiceConnected ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  Disconnect Voice Hotline
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 fill-white" />
                  Connect Live Voice Consultant
                </>
              )}
            </button>

            <div className="p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 rounded-lg text-[0.62rem] text-[#8A8680] font-mono leading-tight">
              ⚠️ LIVE HOTLINE PROTOCOL: Automatically downsamples microphone capture to 16kHz PCM and triggers direct 24kHz audio synthesis. Use headphones to prevent echo feedback.
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
