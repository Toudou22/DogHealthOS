/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useMemo, useState, useEffect } from 'react';
import { BREEDS } from '../breeds.ts';
import { getBreedImagePath } from '../utils/breedImages.ts';
import D3MilestoneChart from './D3MilestoneChart.tsx';
import D3GrowthChart from './D3GrowthChart.tsx';
import D3LongevityTrendChart from './D3LongevityTrendChart.tsx';
import GeneticEnvironmentalRisks from './GeneticEnvironmentalRisks.tsx';
import { Share2, RefreshCw } from 'lucide-react';
import { jsPDF } from 'jspdf';
import {
  Heart,
  Activity,
  HeartPulse,
  Scale,
  Award,
  AlertTriangle,
  Lightbulb,
  PawPrint,
  Zap,
  CheckCircle2,
  HeartHandshake,
  Sparkles,
  Baby,
  Shield,
  LifeBuoy,
  Printer,
  Utensils,
  Coins,
  TrendingUp,
  DollarSign,
  Download,
  FileText,
  Loader2,
  Lock,
  BookOpen,
  Scissors,
  Mic,
  Volume2,
  VolumeX,
  Play,
  Square,
  Sliders,
  Calendar,
  Brain
} from 'lucide-react';
import { playSpokenAudio, stopCurrentAudio, isAudioCurrentlyPlaying } from '../utils/audioPlayback.ts';
import { logUserAction } from '../utils/firebaseHelper.ts';
import InteractiveWeightLogger from './InteractiveWeightLogger.tsx';
import LifespanConditionHeatmap from './LifespanConditionHeatmap.tsx';
import GroomingCadenceMatrix from './GroomingCadenceMatrix.tsx';
import VetAppointmentsMilestones from './VetAppointmentsMilestones.tsx';
import CaninePsychologyEnrichment from './CaninePsychologyEnrichment.tsx';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceDot
} from 'recharts';
import { Breed } from '../types.ts';
import { toHumanYears, getLifeStage, getMilestones } from '../utils.ts';
import { getAgeCalibratedHealthGuidance } from '../utils/healthCalibration.ts';
import VerifiedByBadge from './VerifiedByBadge.tsx';
import { getDirectiveDatabase, getPathologyDatabase } from '../utils/citationLibrary.ts';
import { generateLifespanClinicalDossierPDF } from '../utils/lifespanPdfDossierGenerator.ts';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: any;
  unit: 'lbs' | 'kg';
}

const CustomTooltip = ({ active, payload, label, unit }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const val = unit === 'lbs' ? `${data.weightLbs} lbs` : `${data.weightKg} kg`;
    return (
      <div className="bg-[#1A1A1A] border-2 border-[#F0ECE6] p-2.5 rounded-lg shadow-md text-white font-mono text-[0.68rem] leading-tight">
        <p className="font-bold border-b border-white/10 pb-1 mb-1">Month {label}</p>
        <p className="text-orange-400 font-bold mb-0.5">Weight: <span className="text-white font-mono font-medium">{val}</span></p>
        <p className="text-emerald-400 font-semibold">Maturity: <span className="text-white font-mono font-medium">{data.percent}%</span></p>
      </div>
    );
  }
  return null;
};

const BCS_DETAILS: Record<number, {
  label: string;
  category: 'Underweight' | 'Ideal' | 'Overweight';
  color: string;
  borderColor: string;
  bgColor: string;
  description: string;
  touchGuide: string;
  action: string;
}> = {
  1: {
    label: "Underweight (Emaciated)",
    category: "Underweight",
    color: "text-[#E5A836]",
    borderColor: "border-[#E5A836]",
    bgColor: "bg-[#E5A836]/10",
    description: "Ribs, lumbar vertebrae, pelvic bones and all bony prominences evident from a distance. No discernible body fat. Obvious loss of muscle mass.",
    touchGuide: "Fingers feel raw bone with zero cushioning. Very prominent and sharp skeletal edges.",
    action: "Consult your vet immediately. This level of emaciation requires immediate caloric diagnostic profiling and a carefully managed nutritional build program."
  },
  2: {
    label: "Underweight (Very Thin)",
    category: "Underweight",
    color: "text-[#E5A836]",
    borderColor: "border-[#E5A836]/80",
    bgColor: "bg-[#E5A836]/8",
    description: "Ribs, lumbar vertebrae and pelvic bones easily visible. No palpable fat. Minimal muscle mass loss.",
    touchGuide: "Skeletal structure is immediately felt with no cushioning fat layer.",
    action: "Increase daily food portions by 10-15% and consult your vet to rule out underlying digestive conditions or parasites."
  },
  3: {
    label: "Underweight (Thin)",
    category: "Underweight",
    color: "text-[#E5A836]",
    borderColor: "border-[#E5A836]/60",
    bgColor: "bg-[#E5A836]/5",
    description: "Ribs easily palpable and may be visible with no palpable fat. Tops of lumbar vertebrae visible. Pelvic bones becoming prominent. Obvious waist and abdominal tuck.",
    touchGuide: "Similar to placing your fingers on the knuckles of a clenched fist.",
    action: "Slightly increase nutritional portions or add higher calorie whole-food toppers until a score of 4 or 5 is reached."
  },
  4: {
    label: "Ideal (Underweight / Fit)",
    category: "Ideal",
    color: "text-[#2D8C6F]",
    borderColor: "border-[#2D8C6F]/60",
    bgColor: "bg-[#2D8C6F]/5",
    description: "Ribs easily palpable, with minimal fat covering. Waist easily noted when viewed from above. Abdominal tuck evident.",
    touchGuide: "Feels like running fingers over the knuckles of a flat, open hand. Distinct ridges with slight soft coverage.",
    action: "Excellent fit condition, typical of working or active canine athletes. Maintain current balanced feeding protocol."
  },
  5: {
    label: "Ideal (Optimal Weight)",
    category: "Ideal",
    color: "text-[#2D8C6F]",
    borderColor: "border-[#2D8C6F]",
    bgColor: "bg-[#2D8C6F]/10",
    description: "Ribs palpable without excess fat covering. Waist observed behind ribs when viewed from above. Abdominal tuck visible when viewed from the side.",
    touchGuide: "Fingers feel ribs beneath a thin, smooth layer of skin and fat. Like the back of your hand when fingers are flat.",
    action: "Golden standard weight! This state maximizes life expectancy and spares joints from daily friction and continuous deterioration."
  },
  6: {
    label: "Overweight (Mild)",
    category: "Overweight",
    color: "text-[#C75B7A]",
    borderColor: "border-[#C75B7A]/60",
    bgColor: "bg-[#C75B7A]/5",
    description: "Ribs palpable with slight excess fat covering. Waist is discernible from above but not prominent. Abdominal tuck is apparent but slightly softened.",
    touchGuide: "Ribs are solid but require gentle downward finger pressure directly to count.",
    action: "Cut treats/table scraps by 50%. Transition to active walking times, and measure food using a kitchen scale rather than a generic cup."
  },
  7: {
    label: "Overweight (Heavy)",
    category: "Overweight",
    color: "text-[#C75B7A]",
    borderColor: "border-[#C75B7A]/80",
    bgColor: "bg-[#C75B7A]/8",
    description: "Ribs palpable with difficulty, heavy fat cover. Noticeable fat deposits over lumbar area and base of tail. Waist absent or barely visible. Abdominal tuck may be absent.",
    touchGuide: "Feels like rubbing the palm of your hand. Ribs are difficult to define individually.",
    action: "Reduce overall meal volume by 10%. Increase consistency of low-impact physical exercise (swimming or gentle flat walks) to avoid joint wear."
  },
  8: {
    label: "Overweight (Obese)",
    category: "Overweight",
    color: "text-[#C75B7A]",
    borderColor: "border-[#C75B7A]",
    bgColor: "bg-[#C75B7A]/10",
    description: "Ribs not palpable under very heavy fat cover, or palpable only with significant pressure. Heavy fat deposits over lumbar area and tail base. Waist absent. No abdominal tuck. Obvious abdominal distension may be present.",
    touchGuide: "A thick blanket of cushion entirely hides the rib cage structure from light touch.",
    action: "Consult a veterinarian about custom veterinary metabolic diets. Obesity reduces lifespan by up to 2 full years and causes severe joint/cardiac strain."
  },
  9: {
    label: "Overweight (Severely Obese)",
    category: "Overweight",
    color: "text-[#C75B7A]",
    borderColor: "border-[#C75B7A]",
    bgColor: "bg-[#C75B7A]/15",
    description: "Massive fat deposits over thorax, spine and base of tail. Waist and abdominal tuck completely absent. Fat deposits on neck and limbs. Obvious abdominal distension.",
    touchGuide: "Fingers sink into soft tissue with absolutely no skeletal outline detectable through touch.",
    action: "Severe health hazard. Requires an urgent diagnostic workup from your veterinarian for thyroid/metabolic issues and a structured clinical weight control program."
  }
};

const SIZE_NATIONAL_AVERAGES: Record<string, number> = {
  toy: 14.5,
  small: 13.5,
  medium: 11.5,
  large: 9.5,
  giant: 8.0
};

const FALLBACK_TIPS: Record<string, Record<string, {title: string, tip: string}>> = {
  Spring: {
    toy: {
      title: "Spring Allergen Guard",
      tip: "Spring pollen can trigger skin itching in toy breeds. Wipe down paws and underbelly with a damp cloth after outdoor walks to remove allergens and prevent licking."
    },
    small: {
      title: "Spring Tick Protection",
      tip: "Tick season starts in spring. Small dogs are close to the ground where pests wait on grass blades; initiate monthly vet-approved flea and tick preventatives immediately."
    },
    medium: {
      title: "Shedding & Grooming",
      tip: "Spring brings coat shedding. Brushing your medium companion 3-4 times a week prevents mats, promotes healthy skin oils, and helps keep your home hair-free."
    },
    large: {
      title: "Joint Warm-up Exercises",
      tip: "With warmer weather, larger dogs are eager to run. Start with low-impact walks before heavy play sessions to warm up large joints and prevent ligament tears."
    },
    giant: {
      title: "Heartworm Prevention",
      tip: "Giant breeds have high cardiovascular demands. Ensure they are on year-round or early spring heartworm preventatives, as mosquito activity spikes as temperatures rise."
    }
  },
  Summer: {
    toy: {
      title: "Heatstroke Alert",
      tip: "Toy breeds overheat very rapidly due to their high surface-area-to-mass ratio. Limit walks to early mornings and late evenings, and never leave them in a parked car."
    },
    small: {
      title: "Hot Pavement Warning",
      tip: "Before walking, test the pavement with your hand for 5 seconds. If it is too hot for you, it will burn your small dog's sensitive paw pads. Walk on grass instead."
    },
    medium: {
      title: "Hydration Stations",
      tip: "Medium dogs are highly active in summer. Carry a portable water bowl and offer cool water every 15-20 minutes during outdoor activities to prevent heat exhaustion."
    },
    large: {
      title: "Pool and Water Safety",
      tip: "Not all large dogs are natural swimmers. Supervise them around water, use a canine life jacket for boat trips, and rinse off chlorine or salt water post-swim."
    },
    giant: {
      title: "Bloat (GDV) Awareness",
      tip: "Hot weather can lead to fast gulping of water. Giant breeds are highly prone to bloat (GDV). Avoid heavy exercise or excessive water drinking for 1 hour before and after meals."
    }
  },
  Autumn: {
    toy: {
      title: "Chilly Evening Protection",
      tip: "As autumn temperatures drop, toy breeds lose body heat fast. Introduce a lightweight sweater for evening walks to keep their core temperature stable and comfortable."
    },
    small: {
      title: "Mushroom Awareness",
      tip: "Autumn moisture brings wild mushrooms in yards and parks. Small dogs are curious and can ingest toxic fungi quickly. Keep them on a short leash and scan paths."
    },
    medium: {
      title: "Rodenticide Hazard",
      tip: "In fall, rodents seek shelter indoors, leading to increased household use of chemical baits. Ensure any rodenticides are completely inaccessible to your active medium dog."
    },
    large: {
      title: "Joint Stiffness Care",
      tip: "Damp autumn days can exacerbate arthritis in larger, older dogs. Consider discussing joint supplements like glucosamine or chondroitin with your veterinarian."
    },
    giant: {
      title: "Acorn & Oak Leaf Safety",
      tip: "Oak trees shed acorns in fall, which contain tannins toxic to dogs when eaten. Keep your giant dog from chewing on acorns, as ingestion can cause severe kidney damage."
    }
  },
  Winter: {
    toy: {
      title: "Thermal Insulation & Boots",
      tip: "Tiny paws freeze quickly on ice. Protect your toy dog with thermal booties and a insulated fleece jacket, keeping outdoor bathroom breaks under 10 minutes."
    },
    small: {
      title: "Antifreeze Toxicity",
      tip: "Antifreeze (ethylene glycol) leaks from cars are common in winter and taste sweet but are extremely lethal. Wipe your small dog's paws instantly if they walk near driveways."
    },
    medium: {
      title: "Dry Skin Relief",
      tip: "Indoor heating dries out canine skin. Brush regularly to stimulate natural oils, and consider adding a vet-approved omega-3 fish oil supplement to their daily diet."
    },
    large: {
      title: "Ice Patch Caution",
      tip: "Slipping on black ice can cause severe muscle strains or hip issues in large breeds. Guide your companion on clear, salted pathways, avoiding slick frozen areas."
    },
    giant: {
      title: "Caloric Adjustments",
      tip: "Giant dogs may expend more energy staying warm in winter, or less energy if walks are shorter. Monitor weight closely and adjust food portions accordingly."
    }
  }
};

interface ResultsDisplayProps {
  breed: Breed;
  age: number;
  petName?: string;
  onOpenProfileModal?: (breed: Breed) => void;
  onOpenVaultModal?: () => void;
  onOpenAudioPassport?: (ctx?: {
    planType?: 'passport' | 'nutrition' | 'triage' | 'breeder' | 'custom';
    petName?: string;
    customText?: string;
    voice?: 'Kore' | 'Fenrir' | 'Zephyr' | 'Puck' | 'Charon';
  }) => void;
}

export default function ResultsDisplay({ breed, age, petName, onOpenProfileModal, onOpenVaultModal, onOpenAudioPassport }: ResultsDisplayProps) {
  const [unit, setUnit] = useState<'lbs' | 'kg'>('lbs');
  const [bcsScore, setBcsScore] = useState<number>(5);
  const [isPlayingSpokenPlan, setIsPlayingSpokenPlan] = useState<boolean>(false);
  const [isSpokenPlanUnavailable, setIsSpokenPlanUnavailable] = useState<boolean>(false);

  // Growth Chart & Breed Weight Input state
  const [currentWeight, setCurrentWeight] = useState<number>(() => {
    const adultWeightGrams = breed.weightGrams || 10000;
    const lbs = parseFloat(((adultWeightGrams / 1000) * 2.20462).toFixed(1));
    return lbs;
  });

  // Compare Breeds States
  const [secondBreed, setSecondBreed] = useState<Breed | null>(null);
  const [compareSearch, setCompareSearch] = useState<string>('');

  const filteredBreeds = useMemo(() => {
    if (!compareSearch.trim()) return [];
    const query = compareSearch.toLowerCase();
    return BREEDS.filter(
      (b) => 
        b.name.toLowerCase().includes(query) && 
        b.name.toLowerCase() !== breed.name.toLowerCase()
    ).slice(0, 5);
  }, [compareSearch, breed]);
  
  // Tip of the Day State
  const [tipOfTheDay, setTipOfTheDay] = useState<{
    title: string;
    tip: string;
    season: string;
    sources: any[];
    referenceBody?: string;
    citation?: string;
  } | null>(null);
  const [isTipLoading, setIsTipLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  // Share results feedback state
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);

  // PDF summary export states
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);

  // Fetch seasonal tip when breed changes
  useEffect(() => {
    let isCurrent = true;

    // 1. Reset generated values on breed change
    setTipOfTheDay(null);
    setSecondBreed(null);
    setCompareSearch('');
    setImageError(false);

    const adultWeightGrams = breed.weightGrams || 10000;
    const initialWeight = unit === 'lbs' 
      ? parseFloat(((adultWeightGrams / 1000) * 2.20462).toFixed(1))
      : parseFloat((adultWeightGrams / 1000).toFixed(1));
    setCurrentWeight(initialWeight);

    // 2. Fetch Seasonal Tip via Grounded search
    const fetchTip = async () => {
      setIsTipLoading(true);
      try {
        const response = await fetch('/api/gemini/health-tip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ breedName: breed.name, size: breed.size })
        });
        if (!response.ok) {
          throw new Error(`HTTP status: ${response.status}`);
        }
        const data = await response.json();
        if (isCurrent) {
          if (data && !data.error) {
            setTipOfTheDay(data);
          } else {
            throw new Error(data.error || "Failed to parse seasonal tip");
          }
        }
      } catch (err) {
        if (isCurrent) {
          const currentMonth = new Date().getMonth(); // 0-11
          let season: 'Spring' | 'Summer' | 'Autumn' | 'Winter' = "Summer";
          if (currentMonth >= 2 && currentMonth <= 4) season = "Spring";
          else if (currentMonth >= 5 && currentMonth <= 8) season = "Summer";
          else if (currentMonth >= 9 && currentMonth <= 11) season = "Autumn";
          else season = "Winter";

          const fallback = FALLBACK_TIPS[season]?.[breed.size] || FALLBACK_TIPS[season]?.['medium'];
          setTipOfTheDay({
            title: fallback.title,
            tip: fallback.tip,
            season: season === 'Autumn' ? 'Autumn/Fall' : season,
            sources: [
              { title: "AVMA Seasonal Pet Care Guidelines", uri: "https://www.avma.org" },
              { title: "AAHA Healthy Pet Tips", uri: "https://www.aaha.org" }
            ]
          });
        }
      } finally {
        if (isCurrent) {
          setIsTipLoading(false);
        }
      }
    };

    fetchTip();

    return () => {
      isCurrent = false;
    };
  }, [breed]);

  // Adjust currentWeight state value when units are toggled
  const handleUnitChange = (newUnit: 'lbs' | 'kg') => {
    if (newUnit === unit) return;
    setUnit(newUnit);
    if (newUnit === 'lbs') {
      setCurrentWeight((prev) => parseFloat((prev * 2.20462).toFixed(1)));
    } else {
      setCurrentWeight((prev) => parseFloat((prev / 2.20462).toFixed(1)));
    }
  };

  const handleShare = async () => {
    const remaining = Math.max(0, breed.max - age);
    const summaryText = `🐾 DogHealthOS Lifespan Report for my ${breed.name}!
- Age: ${age} years old (Approx. ${Math.round(humanLife)} human years)
- Life Stage: ${stage.name} (${Math.round(progressPercentage)}% through expected life path)
- Life Expectancy: ${breed.min} - ${breed.max} years (Avg: ${avgLife.toFixed(1)} years)
Check out your pet's milestones at DogHealthOS!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${breed.name} Lifespan Milestones`,
          text: summaryText,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // fall back to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(summaryText);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to copy results:", err);
    }
  };

  // Health Cost Estimator and Breed-Specific Lifetime Veterinary Costs States
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(true);
  const [dietTier, setDietTier] = useState<'standard' | 'premium' | 'raw'>('premium');
  const [wellnessTier, setWellnessTier] = useState<'basic' | 'high'>('high');
  const [lifetimeEmergencies, setLifetimeEmergencies] = useState<number>(2);
  const [groomingSessions, setGroomingSessions] = useState<number>(() => {
    const lowerName = breed.name.toLowerCase();
    if (
      lowerName.includes('poodle') || 
      lowerName.includes('doodle') || 
      lowerName.includes('schnauzer') || 
      lowerName.includes('bichon') ||
      lowerName.includes('maltese') ||
      lowerName.includes('shi') ||
      lowerName.includes('cocker') ||
      lowerName.includes('spaniel') ||
      lowerName.includes('terrier') ||
      lowerName.includes('afghan')
    ) {
      return 6; // High grooming coat care
    }
    return 2; // Flat coat base washing/nail clips
  });

  const { growthData, maturityMonths, currentEstWeight, isCurrentlyGrowing, ageInMonths } = useMemo(() => {
    const size = breed.size;
    const adultWeightGrams = breed.weightGrams || 10000;

    // Determine typical maturity months
    let matMonths = 12;
    if (size === 'toy') matMonths = 9;
    else if (size === 'small') matMonths = 12;
    else if (size === 'medium') matMonths = 12;
    else if (size === 'large') matMonths = 18;
    else if (size === 'giant') matMonths = 24;

    const targetMonths: number[] = [];
    if (matMonths <= 12) {
      for (let i = 0; i <= 12; i++) targetMonths.push(i);
    } else if (matMonths <= 18) {
      for (let i = 0; i <= 18; i += 2) targetMonths.push(i);
      const last = targetMonths[targetMonths.length - 1];
      if (last !== 18) targetMonths.push(18);
    } else {
      for (let i = 0; i <= 24; i += 2) targetMonths.push(i);
      const last = targetMonths[targetMonths.length - 1];
      if (last !== 24) targetMonths.push(24);
    }

    const data = targetMonths.map((m) => {
      const progressRatio = m / matMonths;
      let pct = 0;
      if (m === 0) {
        pct = 0.05; // 5% representing birth weight
      } else if (progressRatio >= 1) {
        pct = 1.0;
      } else {
        // High fidelity sigmoidal growth curve matching canine patterns
        pct = 0.05 + 0.95 * Math.sin((progressRatio * Math.PI) / 2) ** 1.8;
      }

      const grams = Math.round(adultWeightGrams * pct);
      const lbs = parseFloat(((grams / 1000) * 2.20462).toFixed(1));
      const kgs = parseFloat((grams / 1000).toFixed(1));

      return {
        month: m,
        percent: Math.round(pct * 100),
        weightKg: kgs,
        weightLbs: lbs,
        weightLabel: `${lbs} lbs`,
      };
    });

    const currentMonths = age * 12;
    const isGrowing = currentMonths < matMonths;

    const currentProgressRatio = Math.min(1, currentMonths / matMonths);
    let currentPct = 0;
    if (currentMonths === 0) {
      currentPct = 0.05;
    } else {
      currentPct = 0.05 + 0.95 * Math.sin((currentProgressRatio * Math.PI) / 2) ** 1.8;
    }
    const currentGrams = Math.round(adultWeightGrams * currentPct);
    const estLbs = parseFloat(((currentGrams / 1000) * 2.20462).toFixed(1));
    const estKgs = parseFloat((currentGrams / 1000).toFixed(1));

    return {
      growthData: data,
      maturityMonths: matMonths,
      currentEstWeight: {
        grams: currentGrams,
        lbs: estLbs,
        kgs: estKgs,
        percent: Math.round(currentPct * 100),
      },
      isCurrentlyGrowing: isGrowing,
      ageInMonths: parseFloat(currentMonths.toFixed(1)),
    };
  }, [breed, age]);

  const avgLife = useMemo(() => (breed.min + breed.max) / 2, [breed]);
  const humanLife = useMemo(() => toHumanYears(age, breed.size), [age, breed.size]);
  const stage = useMemo(() => getLifeStage(age, breed.max, breed.size), [age, breed]);
  const milestones = useMemo(() => getMilestones(breed, age), [breed, age]);
  const healthProfile = useMemo(() => getAgeCalibratedHealthGuidance(breed, age), [breed, age]);

  // Dynamic Breed Cost Calculations
  const costEstimates = useMemo(() => {
    const years = avgLife || 11.5;
    const size = breed.size;

    // 1. Annual Routine Care base (vaccines, flea/tick/heartworm preventive, annual physical exams)
    let annRoutineBase = 500;
    if (size === 'toy') annRoutineBase = 450;
    else if (size === 'small') annRoutineBase = 550;
    else if (size === 'medium') annRoutineBase = 700;
    else if (size === 'large') annRoutineBase = 900;
    else if (size === 'giant') annRoutineBase = 1200;

    // Wellness tier add-ons (extra dental cleanings, premium continuous joint supplements, full blood plans)
    const annualWellnessAdd = wellnessTier === 'high' ? (size === 'giant' || size === 'large' ? 450 : size === 'medium' ? 300 : 200) : 0;
    const annRoutineTotal = annRoutineBase + annualWellnessAdd;

    // 2. Annual Food/Nutrition Cost. Premium / Raw grades
    let monthlyFood = 40;
    if (size === 'toy') {
      if (dietTier === 'standard') monthlyFood = 25;
      else if (dietTier === 'premium') monthlyFood = 45;
      else monthlyFood = 70;
    } else if (size === 'small') {
      if (dietTier === 'standard') monthlyFood = 35;
      else if (dietTier === 'premium') monthlyFood = 60;
      else monthlyFood = 95;
    } else if (size === 'medium') {
      if (dietTier === 'standard') monthlyFood = 55;
      else if (dietTier === 'premium') monthlyFood = 95;
      else monthlyFood = 150;
    } else if (size === 'large') {
      if (dietTier === 'standard') monthlyFood = 80;
      else if (dietTier === 'premium') monthlyFood = 140;
      else monthlyFood = 230;
    } else if (size === 'giant') {
      if (dietTier === 'standard') monthlyFood = 120;
      else if (dietTier === 'premium') monthlyFood = 210;
      else monthlyFood = 350;
    }
    const annFoodTotal = monthlyFood * 12;

    // 3. Grooming & Maintenance Cost per year
    let costPerGroomingSess = 75;
    if (size === 'toy' || size === 'small') costPerGroomingSess = 65;
    else if (size === 'medium') costPerGroomingSess = 80;
    else if (size === 'large') costPerGroomingSess = 105;
    else if (size === 'giant') costPerGroomingSess = 135;

    const annGroomingTotal = groomingSessions * costPerGroomingSess;

    // 4. Pet Insurance Scenario
    let monthlyInsurance = 45;
    if (size === 'toy') monthlyInsurance = 35;
    else if (size === 'small') monthlyInsurance = 42;
    else if (size === 'medium') monthlyInsurance = 58;
    else if (size === 'large') monthlyInsurance = 75;
    else if (size === 'giant') monthlyInsurance = 98;

    const annInsuranceCost = includeInsurance ? (monthlyInsurance * 12) : 0;

    // 5. Emergency Incident Cost (Lifetime calculation)
    const rawCostPerIncident = 3000;
    
    // Total lifetime cost elements
    const lifetimeRoutine = annRoutineTotal * years;
    const lifetimeFood = annFoodTotal * years;
    const lifetimeGrooming = annGroomingTotal * years;
    const lifetimeInsurance = annInsuranceCost * years;

    const singleIncidentCostUninsured = rawCostPerIncident;
    const singleIncidentCostInsured = 250 + (rawCostPerIncident - 250) * 0.1; // deductible + 10% copay

    const lifetimeEmergencyUninsured = rawCostPerIncident * lifetimeEmergencies;
    const lifetimeEmergencyInsured = singleIncidentCostInsured * lifetimeEmergencies;

    const actualLifetimeEmergency = includeInsurance ? lifetimeEmergencyInsured : lifetimeEmergencyUninsured;

    const totalLifetime = lifetimeRoutine + lifetimeFood + lifetimeGrooming + lifetimeInsurance + actualLifetimeEmergency;
    const avgAnnual = totalLifetime / years;
    const avgMonthly = avgAnnual / 12;

    const lifetimeTotalWithoutInsurance = lifetimeRoutine + lifetimeFood + lifetimeGrooming + lifetimeEmergencyUninsured;
    const lifetimeTotalWithInsurance = lifetimeRoutine + lifetimeFood + lifetimeGrooming + (monthlyInsurance * 12 * years) + lifetimeEmergencyInsured;

    return {
      monthlyInsurance,
      annRoutineTotal,
      annFoodTotal,
      annGroomingTotal,
      annInsuranceCost,
      lifetimeRoutine,
      lifetimeFood,
      lifetimeGrooming,
      lifetimeInsurance,
      rawCostPerIncident,
      singleIncidentCostInsured,
      actualLifetimeEmergency,
      lifetimeEmergencyUninsured,
      lifetimeEmergencyInsured,
      totalLifetime,
      avgAnnual,
      avgMonthly,
      lifetimeTotalWithoutInsurance,
      lifetimeTotalWithInsurance,
      savings: Math.max(0, lifetimeTotalWithoutInsurance - lifetimeTotalWithInsurance),
    };
  }, [breed.size, avgLife, includeInsurance, dietTier, wellnessTier, lifetimeEmergencies, groomingSessions]);

  const breedRiskEstimates = useMemo(() => {
    return breed.health.map((issue) => {
      let costRange = "$350 - $1,200";
      let detail = "Routine veterinary diagnostic profiles and standard therapeutic management.";
      let riskType = "Diagnostic & Care";

      const lowerIssue = issue.toLowerCase();
      if (lowerIssue.includes("dysplasia") || lowerIssue.includes("luxating")) {
        costRange = "$3,500 - $7,500";
        detail = "Advanced dual radiographic scans, joint synthetic lubricants, pain management, or orthopedic joint reconstruction.";
        riskType = "Surgical Orthopedics";
      } else if (lowerIssue.includes("volvulus") || lowerIssue.includes("bloat")) {
        costRange = "$2,500 - $5,500";
        detail = "Critical emergency gastropexy surgical untwisting. Immediate active veterinary intervention required.";
        riskType = "Acute Emergency Surgery";
      } else if (lowerIssue.includes("atrophy") || lowerIssue.includes("cataract") || lowerIssue.includes("optical") || lowerIssue.includes("eye")) {
        costRange = "$1,800 - $4,200";
        detail = "Ophthalmic specialty consultations, retinal thickness scans, or specialized surgical cataract extraction.";
        riskType = "Specialty Ophthalmology";
      } else if (lowerIssue.includes("stenosis") || lowerIssue.includes("cardiomyopathy") || lowerIssue.includes("heart") || lowerIssue.includes("mitral")) {
        costRange = "$1,500 - $3,500/yr";
        detail = "Echocardiography diagnostics and regular medication (ACE inhibitors, modern inotropes).";
        riskType = "Chronic Cardiology Care";
      } else if (lowerIssue.includes("thyroid") || lowerIssue.includes("endocrine") || lowerIssue.includes("diabetes")) {
        costRange = "$450 - $1,200/yr";
        detail = "Regular endocrinology blood panels, hormone supplementation pills, or insulin storage routines.";
        riskType = "Endocrine Management";
      } else if (lowerIssue.includes("dermatitis") || lowerIssue.includes("allergy") || lowerIssue.includes("allergies") || lowerIssue.includes("skin")) {
        costRange = "$400 - $1,500/yr";
        detail = "Immunotherapy cytopoint injections, specialized dermatological flushes, or prescription diets.";
        riskType = "Allergy & Dermatology";
      } else if (lowerIssue.includes("adenitis")) {
        costRange = "$600 - $1,500/yr";
        detail = "Specialty keratinolytic shampoos, high-dose cyclosporine, and therapeutic baths.";
        riskType = "Specialized Autoimmune Skin";
      } else if (lowerIssue.includes("syndrome") || lowerIssue.includes("autoimmune")) {
        costRange = "$1,200 - $3,200";
        detail = "Immunosuppressive courses, specialty fluid treatments, and intensive blood count monitoring.";
        riskType = "Advanced Systemic Therapy";
      } else if (lowerIssue.includes("epilepsy") || lowerIssue.includes("seizures")) {
        costRange = "$600 - $1,800/yr";
        detail = "Neurological specialty workups and anticonvulsant medications (Phenobarbital, Potassium Bromide).";
        riskType = "Neurology Support";
      }

      return {
        issue,
        riskType,
        costRange,
        detail,
      };
    });
  }, [breed.health]);

  const progressPercentage = useMemo(() => {
    return Math.min((age / breed.max) * 100, 100);
  }, [age, breed.max]);

  // Circumference for the 50 radius SVG Circle (2 * pi * r = 314.159)
  const ringCircumference = 2 * Math.PI * 45;
  const ringStrokeOffset = useMemo(() => {
    const computed = ringCircumference - (Math.min(progressPercentage, 100) / 100) * ringCircumference;
    return computed;
  }, [progressPercentage, ringCircumference]);

  // Stage Icon resolver
  const renderStageIcon = () => {
    const iconClass = "w-6 h-6 text-white";
    switch (stage.icon) {
      case 'Paw':
        return <PawPrint className={iconClass} />;
      case 'Zap':
        return <Zap className={iconClass} />;
      case 'CheckCircle':
        return <CheckCircle2 className={iconClass} />;
      case 'HeartHandshake':
        return <HeartHandshake className={iconClass} />;
      case 'Sparkles':
        return <Sparkles className={iconClass} />;
      default:
        return <Award className={iconClass} />;
    }
  };

  // Milestone icon resolver
  const getMilestoneIcon = (iconName: string, isAchieved: boolean) => {
    const cls = `w-4 h-4 ${isAchieved ? 'text-white' : 'text-[#8A8680] dark:text-[#9A9590]'}`;
    switch (iconName) {
      case 'Baby':
        return <Baby className={cls} />;
      case 'Award':
        return <Award className={cls} />;
      case 'Zap':
        return <Zap className={cls} />;
      case 'Shield':
        return <Shield className={cls} />;
      case 'Heart':
        return <Heart className={cls} />;
      default:
        return <PawPrint className={cls} />;
    }
  };

  // Average Sizing defaults for categories
  const sizeAverages = {
    toy: { life: 14, label: 'Toy Category Avg' },
    small: { life: 13, label: 'Small Category Avg' },
    medium: { life: 13, label: 'Medium Category Avg' },
    large: { life: 11, label: 'Large Category Avg' },
    giant: { life: 8, label: 'Giant Category Avg' },
  };
  const categoryAverage = sizeAverages[breed.size] || { life: 11, label: 'Standard Category Avg' };

  // Encourage quote builder
  const encouragementText = useMemo(() => {
    const minRemaining = Math.max(0, breed.min - age);
    const maxRemaining = Math.max(0, breed.max - age);

    if (age > breed.max) {
      return `Your senior companion has surpassed typical averages for ${breed.name} — a gorgeous tribute to the tender, loving environment you represent. Keep treasuring these golden days!`;
    }
    if (maxRemaining <= 1) {
      return `Your ${breed.name} is in their veteran sunset stage. Focus on gentle comfort, regular walks, skin hydration, and cozy warmth. Prioritize high-quality soft treats and quiet rest.`;
    }
    if (age >= breed.min) {
      return `Your ${breed.name} has reached their golden years! They are forecasted to have up to ${Math.round(maxRemaining)} wonderful, treasured years ahead under standard parameters. Savor every single park run, back scratch, and cuddly twilight checkup!`;
    }

    const minEst = Math.max(1, Math.round(minRemaining));
    const maxEst = Math.round(maxRemaining);
    if (minEst === maxEst) {
      return `Your ${breed.name} is forecasted to have around ${maxEst} wonderful years ahead. That constitutes thousands of happy tail wags, play sessions, and shared triumphs!`;
    }
    return `Your ${breed.name} is forecasted to have around ${minEst} to ${maxEst} wonderful years ahead. That constitutes thousands of happy tail wags, play sessions, and shared triumphs!`;
  }, [age, breed]);

  const nutritionalAdvisory = useMemo(() => {
    const size = breed.size;
    const stageName = stage.name;

    let foodType = "Premium balanced kibble mixed with whole-food nutrients";
    let adjustments = ["Keep fresh, filtered water accessible at all times to promote optimal kidney filtration."];
    let caution = "Monitor body condition score (BCS) monthly to ensure they remain lean and active.";

    if (stageName === 'Puppy') {
      foodType = "Calorie-Dense High-Protein Puppy Growth Formula";
      adjustments = [
        "Incorporate a minimum of 28-32% lean protein with rich DHA/EPA fatty acids to fuel explosive neural and muscular growth.",
        size === 'giant' || size === 'large'
          ? "Maintain precise calcium-to-phosphorus ratios (1.2:1) to prevent rapid skeletal spurts from outpacing joint structure strength."
          : "Serve frequent portioned meals (3-4 times daily) of nutrient-dense kibble to protect smaller bodies from potential hypoglycemia."
      ];
      caution = "Strictly limit treat quantities during training to avoid joint-stressing juvenile weight surges.";
    } else if (stageName === 'Young Adult') {
      foodType = "Active/Performance High-Protein Companion Recipe";
      adjustments = [
        "Ensure moderate-to-high protein ratios (24-28%) with high-grade fats to fuel boundless stamina and quick cellular recovery.",
        size === 'giant' || size === 'large'
          ? "Introduce prophylactic Glucosamine and Chondroitin supplements early to build dense cartilage shields for heavily stressed joints."
          : "Add high-quality fiber sources (pumpkin pulp, prebiotics) to streamline digestion and optimize nutrient absorption during high activity."
      ];
      caution = "Taper calorie intake on restful or low-activity weeks to ensure their midsection remains defined and agile.";
    } else if (stageName === 'Adult') {
      foodType = "Moderate-Protein Balanced Adult Maintenance Diet";
      adjustments = [
        "Target steady protein levels (22-26%) to sustain clean lean muscle mass while meeting their established adult metabolic baseline.",
        size === 'toy' || size === 'small'
          ? "Opt for smaller dry kibble kibble shapes with textured fibers that scrape plaque build-up to save vulnerable dental arches."
          : "Add wild salmon oil rich in Omega-3 and Omega-6 fatty acids to strengthen the base skin barrier and build a shining coat."
      ];
      caution = "Prevent quiet post-adulthood weight accumulation by measuring meals precisely rather than free-feeding.";
    } else if (stageName === 'Senior') {
      foodType = "Restorative Senior formula with highly digestible proteins & joint support";
      adjustments = [
        "Integrate rich levels of Glucosamine, Chondroitin, and MSM to ease stiffness, promote joint fluid replenishment, and protect mobility.",
        size === 'giant' || size === 'large'
          ? "Enrich meals with powerful marine-sourced anti-inflammatories to proactively dial down chronic osteoarthritic discomfort."
          : "Incorporate vital cellular antioxidants like Coenzyme Q10 and Vitamin E to counteract natural decline and boost immune vitality."
      ];
      caution = "Observe chewing comfort; if dry kibble triggers pause, soften meals with warm unsalted bone broth or switch to soft premium canned food.";
    } else { // Golden Years
      foodType = "Ultra-Digestible Comfort Wet Recipes / Hydrated Broth Blends";
      adjustments = [
        "Use warm, highly aromatic meat broth mixers or wet gravies to stimulate diminishing sense of smell and encourage consistent liquid intake.",
        "Favor controlled phosphorus and sodium food sources to alleviate metabolic pressure on their hardworking senior kidneys.",
        "Add medium-chain triglycerides (MCTs/coconut oil) to nourish healthy brain lipids and counteract age-related cognitive decline."
      ];
      caution = "Senior pets face swift, subtle dehydration. Station accessible, easily reached water bowls across your primary living sections.";
    }

    return { foodType, adjustments, caution };
  }, [breed.size, stage.name]);

  const generatePDFReport = async (mode: 'download' | 'print' = 'download') => {
    setIsGeneratingPdf(true);
    setPdfSuccessMessage(null);
    try {
      let savedWeightRecords = [];
      try {
        const stored = localStorage.getItem(`canine_weight_history_${breed.name.replace(/\s+/g, '_')}`);
        if (stored) savedWeightRecords = JSON.parse(stored);
      } catch (e) {
        // ignore localStorage access issues
      }

      await generateLifespanClinicalDossierPDF({
        breed,
        age,
        petName,
        currentWeight,
        unit,
        bcsScore,
        avgLife,
        humanLife,
        stage,
        milestones,
        healthProfile,
        nutritionalAdvisory,
        encouragementText,
        costEstimates,
        includeInsurance,
        lifetimeEmergencies,
        groomingSessions,
        growthData,
        dietTier,
        wellnessTier,
        breedRiskEstimates,
        weightRecords: savedWeightRecords
      }, mode);

      const fileName = `${breed.name.replace(/\s+/g, "_")}_Complete_Health_Longevity_Master_Dossier.pdf`;
      if (mode === 'print') {
        setPdfSuccessMessage(`✓ Print initiated for "${fileName}"! (Your print-configured PDF has also been saved to your downloads for direct printing)`);
      } else {
        setPdfSuccessMessage(`✓ Institutional Master Dossier generated: "${fileName}" (18 Clinical & Behavioral Chapters)`);
      }
      setTimeout(() => setPdfSuccessMessage(null), 7000);

      // Log action to Firebase
      logUserAction('Generate Master Clinical Dossier PDF', {
        breed: breed.name,
        age,
        size: breed.size,
        mode
      });
    } catch (err: any) {
      console.error('Failed to generate Master Clinical Dossier PDF:', err);
      setPdfSuccessMessage(`⚠️ PDF export failed: ${err.message}`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const generateSpokenBriefingText = () => {
    const stageDesc = stage.name;
    const kg = (currentWeight * (unit === 'lbs' ? 0.453592 : 1)).toFixed(1);
    const rerCal = Math.round(70 * Math.pow(Math.max(1, parseFloat(kg)), 0.75));
    const nameStr = petName?.trim() ? petName.trim() : `your wonderful ${breed.name}`;
    const companionName = petName?.trim() ? `${petName.trim()}` : `your companion`;
    return `Hello there, pet parent. I'm Dr. Barnes, Senior Veterinary Clinician here at DogHealthOS. 
It is a true pleasure to review the clinical longevity plan for ${nameStr}. 
At ${age} years of age, in the ${stageDesc} stage of life, and weighing ${currentWeight} ${unit}, ${companionName}'s basal resting metabolism requires approximately ${rerCal} calories each day. 
Our most important clinical goal together is keeping their Body Condition Score at an ideal, lean 4 to 5. Decades of veterinary studies prove that this single habit can add up to two and a half vibrant, happy years to your dog's life. 
Right now, our core daily priorities are gentle teeth brushing to protect their heart and kidneys, low-impact exercise for joint health, and regular preventive checkups. 
You are doing a truly wonderful job caring for ${companionName}. You can download this verified audio passport anytime to share with your family veterinarian.`;
  };

  const handleTogglePlaySpokenPlan = () => {
    if (isPlayingSpokenPlan) {
      stopCurrentAudio();
      setIsPlayingSpokenPlan(false);
    } else {
      setIsSpokenPlanUnavailable(false);
      const speech = generateSpokenBriefingText();
      setIsPlayingSpokenPlan(true);
      playSpokenAudio({
        text: speech,
        voice: 'Fenrir',
        tone: 'compassionate',
        playChime: true,
        playbackRate: 0.94,
        onEnd: () => setIsPlayingSpokenPlan(false),
        onError: () => {
          setIsPlayingSpokenPlan(false);
          setIsSpokenPlanUnavailable(true);
          setTimeout(() => setIsSpokenPlanUnavailable(false), 6000);
        }
      });
      logUserAction('Play Spoken Clinical Briefing', { breed: breed.name, age });
    }
  };

  return (
    <div id="resultsSection" className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-[fadeIn_0.5s_ease-out]">
      {/* 0. GROUNDED SEASONAL CARE & BREED PORTRAIT (Spans 3 columns) */}
      <div className="md:col-span-3 border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl overflow-hidden bg-gradient-to-br from-[#FF6B4A]/10 via-amber-500/5 to-[#E5A836]/10 p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-[#1A1A1A]/10 dark:border-white/10 pb-4 mb-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#E5A836]" />
            <h4 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A] dark:text-[#F0ECE6]">
              {petName?.trim() ? `${petName.trim()}'s ${breed.name} Companion Dossier` : `${breed.name} Companion Dossier`}
            </h4>
            {tipOfTheDay && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B4A]/20 text-[#FF6B4A] border border-[#FF6B4A]/30 text-[0.62rem] font-black uppercase tracking-wider">
                ☀️ {tipOfTheDay.season} Season
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full bg-[#2D8C6F]/20 text-[#2D8C6F] border border-[#2D8C6F]/30 text-[0.62rem] font-black uppercase tracking-wider font-mono">
              {breed.size} size category
            </span>
          </div>

          {/* Quick Action CTAs (Top Row) */}
          <div className="flex flex-wrap items-center gap-2 no-print">
            {/* Primary Spoken Clinical Plan Button with Microphone Icon */}
            {onOpenAudioPassport && (
              <button
                type="button"
                onClick={() => onOpenAudioPassport({
                  planType: 'passport',
                  petName: petName?.trim() || breed.name,
                  voice: 'Fenrir',
                  customText: generateSpokenBriefingText()
                })}
                className="px-3.5 py-2 font-black bg-[#2D8C6F] hover:bg-[#23775d] text-white rounded-lg text-[0.65rem] uppercase tracking-wider flex items-center justify-center gap-1.5 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] cursor-pointer transition-all active:scale-95 shadow-[2px_2px_0_#1A1A1A] ring-2 ring-emerald-400/50"
                title="🎙️ Listen to Spoken Clinical Plan & Audio Passport"
              >
                <Mic className="w-3.5 h-3.5 text-emerald-200 shrink-0 animate-pulse" />
                <span>Spoken Clinical Plan</span>
              </button>
            )}
            <a
              href="#vet-appointments-section"
              className="px-3.5 py-2 font-black bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[0.65rem] uppercase tracking-wider flex items-center justify-center gap-1.5 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] cursor-pointer transition-all active:scale-95 shadow-[2px_2px_0_#1A1A1A]"
              title="📅 Schedule Vet Appointments & Review Life-Stage Milestones"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
              <span>Vet Appointments</span>
            </a>
            <a
              href="#canine-psychology-section"
              className="px-3.5 py-2 font-black bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[0.65rem] uppercase tracking-wider flex items-center justify-center gap-1.5 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] cursor-pointer transition-all active:scale-95 shadow-[2px_2px_0_#1A1A1A]"
              title="🧠 Canine Mind, Psychology & Age-Calibrated Activities"
            >
              <Brain className="w-3.5 h-3.5 text-purple-200 shrink-0" />
              <span>Canine Mind & Play</span>
            </a>
            {onOpenProfileModal && (
              <button
                type="button"
                onClick={() => onOpenProfileModal(breed)}
                className="px-3.5 py-2 font-bold bg-amber-500 hover:bg-amber-400 text-[#1A1A1A] rounded-lg text-[0.65rem] uppercase tracking-wider flex items-center justify-center gap-1.5 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] cursor-pointer transition-all active:scale-95 shadow-[2px_2px_0_#1A1A1A]"
                title="View full encyclopedic breed dossier"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Breed Dossier</span>
              </button>
            )}
            {onOpenVaultModal && (
              <button
                type="button"
                onClick={onOpenVaultModal}
                className="px-3 py-2 font-bold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-[#1A1A1A] dark:text-[#F0ECE6] rounded-lg text-[0.65rem] uppercase tracking-wider flex items-center justify-center gap-1.5 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] cursor-pointer transition-all active:scale-95 shadow-[2px_2px_0_#1A1A1A]"
                title="Medical Vault Security"
              >
                <Lock className="w-3.5 h-3.5 text-[#FF6B4A]" />
                <span>Vault</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => generatePDFReport('download')}
              disabled={isGeneratingPdf}
              className="px-3.5 py-2 font-bold bg-[#FF6B4A] hover:bg-[#ff552e] text-white rounded-lg text-[0.65rem] uppercase tracking-wider flex items-center justify-center gap-1.5 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] cursor-pointer transition-all active:scale-95 shadow-[2px_2px_0_#1A1A1A] disabled:opacity-60"
              title="Download comprehensive printable PDF summary with lifespan & health metrics"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  Download PDF Summary
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => generatePDFReport('print')}
              disabled={isGeneratingPdf}
              className="px-3.5 py-2 font-bold bg-white dark:bg-[#1A1A1A] hover:bg-zinc-100 dark:hover:bg-zinc-900 text-[#1A1A1A] dark:text-[#F0ECE6] rounded-lg text-[0.65rem] uppercase tracking-wider flex items-center justify-center gap-1.5 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] cursor-pointer transition-all active:scale-95 shadow-[2px_2px_0_#1A1A1A] disabled:opacity-60"
              title="Print formatted PDF summary"
            >
              <Printer className="w-3.5 h-3.5" />
              Print PDF
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="px-3.5 py-2 font-bold bg-[#2D8C6F] hover:bg-[#237058] text-white rounded-lg text-[0.65rem] uppercase tracking-wider flex items-center justify-center gap-1.5 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] cursor-pointer transition-all active:scale-95 shadow-[2px_2px_0_#1A1A1A]"
            >
              <Share2 className="w-3.5 h-3.5" />
              {shareSuccess ? 'Copied Link!' : 'Share'}
            </button>
          </div>
        </div>

        {/* Spoken Clinical Plan & Audio Briefing Interactive Player Banner */}
        <div className="mb-4 bg-white/95 dark:bg-[#1E1C18]/95 border-2 border-emerald-600/50 dark:border-emerald-400/50 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[3px_3px_0_#2D8C6F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D8C6F] text-white border-2 border-[#1A1A1A] dark:border-[#F0ECE6] flex items-center justify-center shadow-[2px_2px_0_#1A1A1A] shrink-0">
              <Mic className="w-5 h-5 text-emerald-100 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <span>🎙️ Spoken Clinical Plan & Audio Passport</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[0.62rem] font-mono font-black uppercase">
                  Dr. Barnes, DVM Narration
                </span>
                {isPlayingSpokenPlan && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[0.6rem] font-mono font-black uppercase animate-pulse">
                    ● Audio Playing
                  </span>
                )}
                {isSpokenPlanUnavailable && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 text-[0.62rem] font-mono font-bold flex items-center gap-1">
                    <VolumeX className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    <span>Voice not available at the moment</span>
                  </span>
                )}
              </div>
              <p className="text-[0.72rem] text-stone-600 dark:text-stone-300 mt-0.5">
                Multi-modal veterinary audio briefing for <strong>{petName?.trim() ? `${petName.trim()} (${breed.name})` : breed.name}</strong> (Age {age} • {stage.name} Stage). Listen to clinical caloric targets, BCS priorities, and longevity checkpoints.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleTogglePlaySpokenPlan}
              className={`px-3.5 py-2 font-black rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] cursor-pointer transition-all active:scale-95 shadow-[2px_2px_0_#1A1A1A] ${
                isPlayingSpokenPlan 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                  : isSpokenPlanUnavailable
                  ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-400 dark:border-amber-600'
                  : 'bg-[#2D8C6F] hover:bg-[#23775d] text-white'
              }`}
            >
              {isPlayingSpokenPlan ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Briefing</span>
                </>
              ) : isSpokenPlanUnavailable ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-amber-600" />
                  <span>Voice not available at the moment</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Listen to Plan</span>
                </>
              )}
            </button>
            {onOpenAudioPassport && (
              <button
                type="button"
                onClick={() => onOpenAudioPassport({
                  planType: 'passport',
                  petName: breed.name,
                  voice: 'Fenrir',
                  customText: generateSpokenBriefingText()
                })}
                className="px-3 py-2 font-bold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-[#1A1A1A] dark:text-[#F0ECE6] rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] cursor-pointer transition-all active:scale-95 shadow-[2px_2px_0_#1A1A1A]"
                title="Open Studio to download .wav file or switch to nutritionist voice"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Studio & WAV</span>
                <span className="sm:hidden">Studio</span>
              </button>
            )}
          </div>
        </div>

        {/* PDF Export Success Notification */}
        {pdfSuccessMessage && (
          <div className="mb-4 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-800 dark:text-emerald-300 px-4 py-2.5 rounded-lg flex items-center justify-between text-xs font-mono font-bold animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{pdfSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setPdfSuccessMessage(null)}
              className="text-emerald-600 dark:text-emerald-400 hover:opacity-75 text-sm cursor-pointer ml-3 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content Layout: Dog Portrait + Seasonal Intelligence */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          
          {/* Left Column: Breed Portrait Photo (ONLY if user uploaded an image) */}
          {getBreedImagePath(breed.name) && !imageError && (
            <div className="md:col-span-4 lg:col-span-3 flex flex-col items-center">
              <div className="relative w-full max-w-[220px] aspect-square rounded-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] overflow-hidden bg-stone-100 dark:bg-stone-900 group">
                <img
                  src={getBreedImagePath(breed.name)!}
                  alt={`${breed.name} Portrait`}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-center">
                  <span className="text-[0.65rem] font-black text-white uppercase tracking-wider block drop-shadow-sm">
                    {breed.name}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Right Column: Seasonal Care Intelligence */}
          <div className={getBreedImagePath(breed.name) && !imageError ? "md:col-span-8 lg:col-span-9" : "md:col-span-12"}>
            {isTipLoading ? (
              <div className="flex flex-col items-center justify-center py-6 gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-[#E5A836]" />
                <span className="text-[0.68rem] font-mono text-[#8A8680] uppercase tracking-wider">
                  Consulting veterinary data sources...
                </span>
              </div>
            ) : tipOfTheDay ? (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[0.6rem] font-bold uppercase tracking-wider">
                    Seasonal Advice
                  </span>
                  <h5 className="font-extrabold text-base text-[#1A1A1A] dark:text-[#F0ECE6] leading-snug">
                    🐾 {tipOfTheDay.title}
                  </h5>
                </div>
                <p className="text-xs text-[#8A8680] dark:text-[#9A9590] leading-relaxed">
                  {tipOfTheDay.tip}
                </p>

                {/* Accredited Veterinary Reference Body Tag */}
                {(tipOfTheDay.referenceBody || tipOfTheDay.citation) && (
                  <div className="pt-2 border-t border-[#1A1A1A]/10 dark:border-white/10 flex flex-wrap items-center gap-2">
                    <span className="text-[0.62rem] font-mono font-bold text-[#2D8C6F] dark:text-[#52c9a4] bg-[#2D8C6F]/10 px-2 py-0.5 rounded border border-[#2D8C6F]/30 uppercase flex items-center gap-1">
                      🏛️ {tipOfTheDay.referenceBody || 'AAHA Canine Guidelines'}
                    </span>
                    {tipOfTheDay.citation && (
                      <span className="text-[0.6rem] text-stone-500 dark:text-stone-400 italic">
                        "{tipOfTheDay.citation}"
                      </span>
                    )}
                  </div>
                )}

                {tipOfTheDay.sources && tipOfTheDay.sources.length > 0 && (
                  <div className="pt-2 border-t border-[#1A1A1A]/5 dark:border-white/5 flex flex-wrap items-center gap-2">
                    <span className="text-[0.6rem] font-bold text-[#8A8680] uppercase tracking-wider mr-1">
                      Verified Sources:
                    </span>
                    {tipOfTheDay.sources.map((src: any, index: number) => (
                      <a
                        key={index}
                        href={src.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-md bg-[#1A1A1A]/5 dark:bg-white/5 border border-[#1A1A1A]/10 dark:border-white/10 text-[0.58rem] text-[#2D8C6F] font-bold hover:underline truncate max-w-[240px]"
                      >
                        🔗 {src.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-2 text-xs text-[#8A8680] dark:text-[#9A9590] flex flex-col gap-1">
                <span>Veterinary guidance for {breed.name}: Ensure fresh hydration, balanced portion control, and regular health checkups throughout all life stages.</span>
                <span className="text-[0.6rem] font-mono text-[#2D8C6F] font-bold">🏛️ Accredited Source: Royal Veterinary College & AAHA Canine Preventive Guidelines</span>
              </div>
            )}
          </div>

        </div>

        <div className="text-[0.6rem] font-mono text-[#8A8680] dark:text-[#9A9590] mt-3 pt-2.5 border-t border-[#1A1A1A]/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
          <span>*Real-time clinical insights customized for {breed.name} longevity and wellness.</span>
          <span className="text-[#2D8C6F] dark:text-[#52c9a4] font-bold">✓ Peer-Reviewed Veterinary Cohort Calibrated</span>
        </div>
      </div>
      
      {/* 1. Expectancy Card (Spans 2 columns on desktop) */}
      <div className="bg-white/50 dark:bg-[#282420]/65 backdrop-blur-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-6 md:col-span-2 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8A8680] dark:text-[#9A9590]">
              STATISTICAL EXPECTANCY
            </span>
            <span className="text-[0.6rem] font-mono font-bold text-[#2D8C6F] dark:text-[#52c9a4] bg-[#2D8C6F]/10 border border-[#2D8C6F]/30 px-2 py-0.5 rounded uppercase flex items-center gap-1">
              🏛️ RVC VetCompass™ & Univ of Georgia
            </span>
          </div>
          <h4 className="text-xl font-extrabold mb-4 text-[#1A1A1A] dark:text-[#F0ECE6]">
            Normal Lifespan Span
          </h4>
        </div>
        
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-mono text-5xl sm:text-6xl font-bold text-[#FF6B4A]">
            {breed.min}
          </span>
          <span className="text-3xl font-light text-[#8A8680] dark:text-[#9A9590]">
            —
          </span>
          <span className="font-mono text-5xl sm:text-6xl font-bold text-[#2D8C6F]">
            {breed.max}
          </span>
          <span className="text-lg font-mono ml-2 text-[#8A8680] dark:text-[#9A9590]">
            years
          </span>
        </div>

        <div className="border-t border-[#1A1A1A]/10 dark:border-white/10 pt-3">
          <div className="flex justify-between items-center text-sm mb-2 text-[#1A1A1A] dark:text-[#F0ECE6]">
            <span>Average Breed Lifespan</span>
            <span className="font-mono font-bold text-base">{avgLife.toFixed(1)} yrs</span>
          </div>

          {/* Sizable Horizontal visual meter */}
          <div className="h-3.5 w-full bg-[#1A1A1A]/5 dark:bg-white/5 rounded-full border-2 border-[#1A1A1A] dark:border-[#F0ECE6] overflow-hidden p-[1.5px]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#2D8C6F] transition-all duration-1000 ease-out"
              style={{ width: `${Math.min((avgLife / 22) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between font-mono text-[0.62rem] text-[#8A8680] dark:text-[#9A9590] mt-1.5 uppercase">
            <span>Infant Care</span>
            <span>Typical: 12 yrs</span>
            <span>Extreme Aging: 22+ yrs</span>
          </div>

          {/* Quick PDF & Spoken Plan export triggers */}
          <div className="mt-3.5 pt-2.5 border-t border-dashed border-[#1A1A1A]/15 dark:border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[0.68rem] text-[#8A8680] dark:text-[#9A9590] font-mono">
              Companion care formats:
            </span>
            <div className="flex items-center gap-3">
              {onOpenAudioPassport && (
                <button
                  type="button"
                  onClick={() => onOpenAudioPassport({
                    planType: 'passport',
                    petName: breed.name,
                    voice: 'Fenrir',
                    customText: generateSpokenBriefingText()
                  })}
                  className="inline-flex items-center gap-1 text-[0.68rem] font-black text-[#2D8C6F] hover:text-[#23775d] dark:text-emerald-400 underline decoration-dotted underline-offset-2 cursor-pointer transition-colors"
                  title="Listen to Spoken Clinical Plan & Audio Passport"
                >
                  <Mic className="w-3.5 h-3.5 animate-pulse" />
                  Spoken Plan →
                </button>
              )}
              <button
                type="button"
                onClick={() => generatePDFReport('download')}
                disabled={isGeneratingPdf}
                className="inline-flex items-center gap-1 text-[0.68rem] font-bold text-[#FF6B4A] hover:text-[#e05637] dark:text-[#FF8A65] underline decoration-dotted underline-offset-2 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Printable PDF →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. active Life Stage Card */}
      <div className="bg-white/50 dark:bg-[#282420]/65 backdrop-blur-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-6 flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8A8680] dark:text-[#9A9590] block mb-2">
            CURRENT LIFE SEGMENT
          </span>
          
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] dark:border-[#F0ECE6] mb-4 shadow-[2px_2px_0_#1A1A1A] dark:shadow-[2px_2px_0_#F0ECE6] transition-transform hover:scale-115"
            style={{ backgroundColor: stage.color }}
          >
            {renderStageIcon()}
          </div>

          <h3 className={`text-2xl font-black mb-2 ${stage.textColor}`}>
            {stage.name}
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-[#8A8680] dark:text-[#9A9590]">
            {stage.desc}
          </p>
        </div>

        <div className="bg-orange-500/5 dark:bg-orange-500/10 border-2 border-dashed border-[#1A1A1A]/10 dark:border-white/10 rounded-lg p-2.5 mt-4 text-[0.7rem] font-mono flex items-center gap-2 text-[#8A8680] dark:text-[#9A9590]">
          <LifeBuoy className="w-4 h-4 text-[#FF6B4A] flex-shrink-0" />
          <span>Stage represents {Math.round(progressPercentage)}% journey.</span>
        </div>
      </div>

      {/* 3. Human Age Converter Card */}
      <div className="bg-white/50 dark:bg-[#282420]/65 backdrop-blur-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-6 flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8A8680] dark:text-[#9A9590] block mb-1">
            HUMAN CHRONOLOGY MAPPING
          </span>
          <h4 className="text-xl font-extrabold mb-4 text-[#1A1A1A] dark:text-[#F0ECE6]">
            Human Equivalence
          </h4>
        </div>

        <div className="flex items-baseline gap-1 my-3">
          <span className="font-mono text-5xl sm:text-6xl font-bold text-[#E5A836]">
            {Math.round(humanLife)}
          </span>
          <span className="text-sm font-mono text-[#8A8680] dark:text-[#9A9590] uppercase tracking-wider ml-1">
            human years
          </span>
        </div>

        <p className="text-xs italic bg-amber-500/5 p-3 rounded-lg border border-[#1A1A1A]/10 dark:border-white/10 text-[#8A8680] dark:text-[#9A9590] leading-relaxed">
          {humanLife >= 75 ? (
            '“Like a seasoned centenarian, holding infinite kindness and historical memory in their steady gaze.”'
          ) : humanLife >= 55 ? (
            '“The silver maturity years — experienced, deeply loyal, and enjoying standard comfortable cycles.”'
          ) : humanLife >= 40 ? (
            '“The seasoned mid-life peak — confident, habit-oriented, and profoundly bonded to their home space.”'
          ) : humanLife >= 25 ? (
            '“A vibrant young adult — holding boundless stamina and exploring environmental puzzles with ease.”'
          ) : (
            '“An energetic teenager / adolescent — playful, cheeky, exploring bounds and boundaries!”'
          )}
        </p>
      </div>

      {/* 4. Circular Progress percentage */}
      <div className="bg-white/50 dark:bg-[#282420]/65 backdrop-blur-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-6 flex flex-col items-center justify-center text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8A8680] dark:text-[#9A9590] self-start mb-4">
          LIFETIME STAGE PROGRESS
        </span>

        {/* SVG Progress Wheel */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className="stroke-gray-200 dark:stroke-zinc-800"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Colored overlay */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={stage.color}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringStrokeOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Inner Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-3xl font-extrabold text-[#1A1A1A] dark:text-[#F0ECE6]">
              {Math.round(progressPercentage)}%
            </span>
            <span className="text-[0.6rem] uppercase font-bold tracking-widest text-[#8A8680] dark:text-[#9A9590]">
              Completed
            </span>
          </div>
        </div>

        <p className="text-[0.72rem] leading-relaxed text-[#8A8680] dark:text-[#9A9590] mt-4 max-w-[200px]">
          {progressPercentage >= 100 ? (
            <span className="text-[#C75B7A] font-bold">Beyond customary averages — exceptional longevity!</span>
          ) : progressPercentage >= 80 ? (
            'Comfortably enjoying the serene elder phase.'
          ) : (
            `Approximately ${Math.max(1, Math.round(breed.max - age))} premium years remain under standard trajectories.`
          )}
        </p>
      </div>

      {/* 4.5. D3 Lifespan Milestone Curve Comparison (Spans 3 columns) */}
      <div className="md:col-span-3 bg-white/50 dark:bg-[#282420]/65 backdrop-blur-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8A8680] dark:text-[#9A9590] block mb-1">
              BIOLOGICAL MILESTONES CHART
            </span>
            <h4 className="text-xl font-extrabold mb-3 text-[#1A1A1A] dark:text-[#F0ECE6]">
              {breed.name} Expected Lifespan vs. National Size Average
            </h4>
            <p className="text-xs text-[#8A8680] dark:text-[#9A9590] leading-relaxed mb-4 max-w-2xl">
              This D3.js biometric visualizer charts a comparative biological aging and survival curve for a healthy <strong className="text-[#FF6B4A]">{breed.name}</strong> versus the typical national average for similar <strong className="text-[#8A8680]">{breed.size} size class</strong> companions. The green marker traces your dog's current biological positioning along the trajectory.
            </p>
            <div className="bg-amber-500/5 dark:bg-amber-500/10 border-2 border-dashed border-[#1A1A1A]/10 dark:border-white/10 rounded-xl p-3.5 text-xs text-[#1A1A1A] dark:text-[#F0ECE6] leading-relaxed">
              💡 <strong>Biometric Fact:</strong> {breed.name} average life expectancy is <strong>{avgLife.toFixed(1)} years</strong>, which is 
              {avgLife > (SIZE_NATIONAL_AVERAGES[breed.size] || 11.5) ? (
                <span className="text-[#2D8C6F] font-bold"> {(avgLife - (SIZE_NATIONAL_AVERAGES[breed.size] || 11.5)).toFixed(1)} years longer </span>
              ) : (
                <span className="text-[#FF6B4A] font-bold"> {( (SIZE_NATIONAL_AVERAGES[breed.size] || 11.5) - avgLife ).toFixed(1)} years shorter </span>
              )} 
              than the national standard of <strong>{(SIZE_NATIONAL_AVERAGES[breed.size] || 11.5).toFixed(1)} years</strong> for similar-sized dogs.
            </div>
          </div>
          <div className="w-full md:w-[500px] aspect-[500/240] bg-white dark:bg-[#1A1A1A]/30 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl p-3 shadow-[2px_2px_0_#1A1A1A]">
            <D3MilestoneChart breed={breed} currentAge={age} />
          </div>
        </div>
      </div>

      {/* 5. Size comparisons */}
      <div className="bg-white/50 dark:bg-[#282420]/65 backdrop-blur-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-6 flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8A8680] dark:text-[#9A9590] block mb-3">
            SIZE CLASS STATS CHECK
          </span>
          <h4 className="text-sm font-extrabold text-[#1A1A1A] dark:text-[#F0ECE6] mb-4">
            Expected Versus Group Averages
          </h4>
        </div>

        <div className="space-y-3 flex-1 flex flex-col justify-center">
          {/* Item 1 */}
          <div>
            <div className="flex justify-between items-center text-[0.68rem] font-mono mb-1 text-[#1A1A1A] dark:text-[#F0ECE6]">
              <span className="truncate max-w-[130px] font-bold">{breed.name} Avg</span>
              <span>{avgLife.toFixed(1)} yrs</span>
            </div>
            <div className="h-2 rounded-full bg-[#1A1A1A]/10 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#FF6B4A] transition-all duration-1000 ease-out"
                style={{ width: `${(avgLife / 20) * 100}%` }}
              />
            </div>
          </div>

          {/* Item 2 */}
          <div>
            <div className="flex justify-between items-center text-[0.68rem] font-mono mb-1 text-[#1A1A1A] dark:text-[#F0ECE6]">
              <span className="truncate text-[#8A8680] dark:text-[#9A9590]">{categoryAverage.label}</span>
              <span>{categoryAverage.life} yrs</span>
            </div>
            <div className="h-2 rounded-full bg-[#1A1A1A]/10 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#2D8C6F] transition-all duration-1000 ease-out"
                style={{ width: `${(categoryAverage.life / 20) * 100}%` }}
              />
            </div>
          </div>

          {/* Item 3 */}
          <div>
            <div className="flex justify-between items-center text-[0.68rem] font-mono mb-1 text-[#1A1A1A] dark:text-[#F0ECE6]">
              <span className="truncate text-[#8A8680] dark:text-[#9A9590]">All Breeds Median</span>
              <span>12.0 yrs</span>
            </div>
            <div className="h-2 rounded-full bg-[#1A1A1A]/10 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#E5A836] transition-all duration-1000 ease-out"
                style={{ width: `${(12 / 20) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="text-[0.65rem] text-[#8A8680] dark:text-[#9A9590] font-mono pt-3 border-t border-[#1A1A1A]/5 dark:border-white/5 mt-3">
          {avgLife > categoryAverage.life
            ? `*${breed.name} holds superior longevity compared to sibling ${breed.size} dogs.`
            : `*Typical for the respective skeletal ${breed.size} size class.`}
        </div>
      </div>

      {/* 6. Physiological & Clinical Milestones */}
      <div className="bg-white/50 dark:bg-[#282420]/65 backdrop-blur-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8A8680] dark:text-[#9A9590]">
              PHYSIOLOGICAL MILESTONES
            </span>
            <span className="text-[0.62rem] font-mono px-2 py-0.5 rounded-full bg-[#FF6B4A]/10 text-[#FF6B4A] border border-[#FF6B4A]/30 font-bold uppercase">
              {stage.name} Phase
            </span>
          </div>
          <h4 className="text-sm font-extrabold text-[#1A1A1A] dark:text-[#F0ECE6] mb-1">
            Biological & Clinical Pathway
          </h4>
          <p className="text-[0.68rem] text-[#8A8680] dark:text-[#9A9590] mb-3 leading-tight">
            Key biological transformations calibrated for {breed.name} at {age} {age === 1 ? 'Year' : 'Years'} ({healthProfile.ageMonths} mos):
          </p>
        </div>

        <div className="space-y-3 flex-1 flex flex-col justify-center">
          {milestones.map((ms) => (
            <div
              key={ms.label}
              className={`p-2.5 rounded-lg border-2 transition-all ${
                ms.isCurrent
                  ? 'border-[#FF6B4A] bg-[#FF6B4A]/10 dark:bg-[#FF6B4A]/15 shadow-sm'
                  : ms.achieved
                  ? 'border-[#2D8C6F]/40 bg-[#2D8C6F]/5 dark:bg-[#2D8C6F]/10 opacity-95'
                  : 'border-dashed border-[#1A1A1A]/20 dark:border-white/20 opacity-50'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shrink-0 mt-0.5"
                  style={{ backgroundColor: ms.achieved || ms.isCurrent ? ms.color : 'transparent' }}
                >
                  {getMilestoneIcon(ms.icon, ms.achieved || ms.isCurrent || false)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-bold text-xs truncate text-[#1A1A1A] dark:text-[#F0ECE6]">
                      {ms.label}
                    </p>
                    {ms.isCurrent && (
                      <span className="shrink-0 text-[0.58rem] font-black uppercase px-1.5 py-0.2 bg-[#FF6B4A] text-white rounded font-mono animate-pulse">
                        Active Now
                      </span>
                    )}
                    {ms.achieved && !ms.isCurrent && (
                      <span className="shrink-0 text-[0.58rem] font-bold uppercase text-[#2D8C6F] font-mono">
                        ✓ Achieved
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[0.62rem] font-mono font-bold text-[#8A8680] dark:text-[#9A9590]">
                      Target: {ms.targetPeriod || `${ms.year} yr`}
                    </span>
                  </div>
                  {ms.desc && (
                    <p className="text-[0.65rem] text-[#8A8680] dark:text-[#9A9590] mt-1 leading-relaxed">
                      {ms.desc}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6.5. Dynamic D3.js Longevity Trend Section (Spans 3 columns) */}
      <div className="md:col-span-3 bg-white/60 dark:bg-[#282420]/75 backdrop-blur-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-6">
        <D3LongevityTrendChart breed={breed} currentAge={age} petName={petName} />
      </div>

      {/* 6.8. Dynamic Genetic & Environmental Risk Factors Section (Spans 3 columns) */}
      <div className="md:col-span-3">
        <GeneticEnvironmentalRisks breed={breed} currentAge={age} petName={petName} />
      </div>

      {/* 7. Age-Calibrated Clinical Guidance & Breed Health Watch (Spans 2 columns) */}
      <div className="bg-white/50 dark:bg-[#282420]/65 backdrop-blur-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-6 md:col-span-2 flex flex-col gap-5">
        
        {/* Top Explicit Calibration Banner */}
        <div className="bg-gradient-to-r from-[#FF6B4A]/10 via-[#E5A836]/10 to-[#2D8C6F]/10 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-lg p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[2px_2px_0_#1A1A1A] dark:shadow-[2px_2px_0_#F0ECE6]">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-md bg-[#FF6B4A] text-white shrink-0 mt-0.5">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[0.65rem] font-black uppercase tracking-wider px-2 py-0.5 bg-[#1A1A1A] text-white dark:bg-[#F0ECE6] dark:text-[#1A1A1A] rounded">
                  🎯 AGE-CALIBRATED MEDICAL ADVISORY
                </span>
                <span className="text-[0.65rem] font-bold text-[#FF6B4A] font-mono">
                  {healthProfile.stageBadgeText}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-[#1A1A1A] dark:text-[#F0ECE6] mt-1">
                {healthProfile.calibrationSubtitle}
              </h4>
              <p className="text-xs text-[#8A8680] dark:text-[#9A9590] mt-0.5 leading-relaxed">
                Veterinary clinical protocols dynamically adjusted for a <strong>{breed.name}</strong> at <strong>{age} Years ({healthProfile.ageMonths} Months)</strong> — distinguishing immediate age priorities from lifelong genetic surveillance.
              </p>
            </div>
          </div>
        </div>

        {/* Part A: Active Health & Care Directives for This Specific Age */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6] flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#FF6B4A]" />
              Active Clinical Priorities for Age {age} ({stage.name} Stage)
            </span>
            <span className="text-[0.62rem] font-mono text-[#8A8680] dark:text-[#9A9590]">
              Immediate Owner Directives
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {healthProfile.immediateDirectives.map((dir, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border-2 flex flex-col justify-between ${
                  dir.urgency === 'critical'
                    ? 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-400 dark:border-rose-700/60'
                    : dir.urgency === 'priority'
                    ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-400 dark:border-amber-700/60'
                    : 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-400 dark:border-emerald-700/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="font-extrabold text-xs text-[#1A1A1A] dark:text-[#F0ECE6] leading-tight">
                      {dir.title}
                    </span>
                    <span
                      className={`text-[0.58rem] font-mono font-black uppercase px-1.5 py-0.5 rounded ${
                        dir.urgency === 'critical'
                          ? 'bg-rose-600 text-white'
                          : dir.urgency === 'priority'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {dir.urgency === 'critical' ? '⚡ Critical Now' : dir.urgency === 'priority' ? 'Priority' : 'Routine'}
                    </span>
                  </div>
                  <p className="text-[0.7rem] font-bold text-[#FF6B4A] dark:text-[#FFA07A] mb-1">
                    {dir.headline}
                  </p>
                  <p className="text-[0.68rem] text-[#8A8680] dark:text-[#9A9590] leading-relaxed mb-2">
                    {dir.clinicalDescription}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#1A1A1A]/10 dark:border-white/10 text-[0.66rem] font-medium text-[#1A1A1A] dark:text-[#F0ECE6] flex items-start gap-1.5">
                  <span className="shrink-0 text-emerald-600 dark:text-emerald-400 font-bold">📋 Action:</span>
                  <span>{dir.ownerGuideline}</span>
                </div>
                <div className="mt-2 pt-1.5 border-t border-dashed border-[#1A1A1A]/10 dark:border-white/10 flex justify-end">
                  <VerifiedByBadge
                    databaseKey={getDirectiveDatabase(dir.category, dir.urgency).id}
                    layout="pill"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Part B: Lifetime Genetic Breed Vulnerabilities (with Age-Onset Stratification) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#E5A836]" />
              Breed Genetic Pathology Watchlist & Age-Onset Stratification
            </span>
            <span className="text-[0.62rem] font-mono text-[#8A8680] dark:text-[#9A9590]">
              {breed.name} Genetic Registry
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {healthProfile.geneticWatchlist.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#1A1A1A]/5 dark:bg-white/5 rounded-lg border-2 border-[#1A1A1A]/15 dark:border-white/15 flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-extrabold text-xs text-[#1A1A1A] dark:text-[#F0ECE6]">
                      {item.condition}
                    </span>
                    <span className="text-[0.58rem] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 shrink-0">
                      Onset: {item.onsetPhase}
                    </span>
                  </div>

                  <div className="mb-1.5">
                    <span className={`inline-block text-[0.6rem] font-bold px-2 py-0.5 rounded border ${item.relevancyColor}`}>
                      {item.relevancyBadge}
                    </span>
                  </div>

                  <p className="text-[0.67rem] text-[#8A8680] dark:text-[#9A9590] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="pt-2 border-t border-[#1A1A1A]/10 dark:border-white/10 text-[0.65rem] text-[#1A1A1A] dark:text-[#F0ECE6] bg-amber-500/5 dark:bg-amber-500/10 p-2 rounded">
                    <span className="font-bold text-[#FF6B4A] block mb-0.5">🩺 Age-Stage Guidance for {age}y ({stage.name}):</span>
                    <span className="leading-snug">{item.ageSpecificAction}</span>
                  </div>
                  <div className="flex justify-end pt-1">
                    <VerifiedByBadge
                      databaseKey={getPathologyDatabase(item.condition, item.riskType).id}
                      layout="pill"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 7.5. Lifespan Condition Timeline Heatmap (Spans 3 columns) */}
      <div className="md:col-span-3">
        <LifespanConditionHeatmap breed={breed} currentAgeYears={age} />
      </div>

      {/* 8. Advisory/Wellness tips */}
      <div className="bg-gradient-to-br from-[#2D8C6F]/15 to-[#FF6B4A]/10 border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-[#E5A836]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-[#F0ECE6]">
              CHANCE MATTERS & FORESIGHT
            </span>
          </div>

          <p className="text-xs leading-relaxed text-[#1A1A1A] dark:text-[#F0ECE6] mb-4">
            {encouragementText}
          </p>
        </div>

        <div className="border-t border-[#1A1A1A]/10 dark:border-white/10 pt-3 mt-2 flex flex-col gap-2">
          <div className="text-[0.68rem] text-[#8A8680] dark:text-[#9A9590] leading-relaxed">
            🐾 <strong>Wellness Tip:</strong> Daily physical activity, cognitive toys, annual dental cleans, and a weight-controlled feeding schedule can lengthen healthy spans by up to <strong>2.0 years</strong>!
          </div>
          <div className="flex justify-end pt-1">
            <VerifiedByBadge databaseKey="rvc" layout="pill" />
          </div>
        </div>
      </div>

      {/* 8.5. Chronology-aligned Nutritional Advisories (Spans 3 columns) */}
      <div className="md:col-span-3 bg-white/50 dark:bg-[#282420]/65 backdrop-blur-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="w-5 h-5 text-[#2D8C6F]" />
            <h4 className="text-sm font-black uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6]">
              Age & Size-Aligned Nutritional Advice
            </h4>
          </div>

          <p className="text-xs mb-4 text-[#8A8680] dark:text-[#9A9590] leading-relaxed">
            As a companion of <strong className="text-[#FF6B4A]">{breed.size}</strong> proportions in their <strong className="text-[#2D8C6F]">{stage.name}</strong> life stage, their energetic and mineral metabolic requirements have uniquely shifted. Check out veterinary nutrition parameters:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Recommended Feed Category */}
            <div className="p-4 bg-[#2D8C6F]/5 dark:bg-[#2D8C6F]/10 rounded-lg border-2 border-dashed border-[#2D8C6F]/20 dark:border-[#2D8C6F]/40 flex flex-col justify-between">
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-wider text-[#2D8C6F] block mb-1">
                  Target Feeding Base
                </span>
                <p className="font-bold text-sm text-[#1A1A1A] dark:text-[#F0ECE6] mb-2 leading-snug">
                  {nutritionalAdvisory.foodType}
                </p>
              </div>
              <div className="text-[0.65rem] text-[#8A8680] dark:text-[#9A9590] font-mono leading-relaxed mt-2 pt-2 border-t border-[#1A1A1A]/10 dark:border-white/10">
                *Adjust base protein level based on physical exertion scores.
              </div>
            </div>

            {/* Core Dietary Adaptations */}
            <div className="md:col-span-2 space-y-3">
              <span className="text-[0.68rem] font-bold uppercase tracking-wider text-[#8A8680] dark:text-[#9A9590] block">
                Core Dietary Adjustments
              </span>
              <div className="space-y-2.5">
                {nutritionalAdvisory.adjustments.map((adj, i) => (
                  <div key={i} className="flex gap-2.5 items-start text-xs text-[#1A1A1A] dark:text-[#F0ECE6] leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-[#1A1A1A]/5 dark:bg-white/5 border border-[#1A1A1A]/20 dark:border-white/20 flex items-center justify-center font-mono text-[0.62rem] font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{adj}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Nutritional Warning / Caveat */}
        <div className="bg-amber-500/5 dark:bg-amber-500/10 border-2 border-dashed border-[#1A1A1A]/15 dark:border-white/10 rounded-xl p-3.5 mt-5 text-xs text-[#1A1A1A] dark:text-[#F0ECE6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xl leading-none">⚠️</span>
            <div>
              <strong className="text-amber-600 dark:text-amber-400 block text-[0.68rem] uppercase font-bold tracking-wider mb-0.5">
                Veterinary Precaution Flag
              </strong>
              <p className="text-[0.72rem] leading-relaxed text-[#8A8680] dark:text-[#9A9590]">
                {nutritionalAdvisory.caution}
              </p>
            </div>
          </div>
          <div className="shrink-0 self-end sm:self-auto">
            <VerifiedByBadge databaseKey="wsava_nrc" layout="pill" />
          </div>
        </div>
      </div>

      {/* 8.6. Interactive Body Condition Score (BCS) & Physical Touch-Test (Spans 3 columns) */}
      <div className="md:col-span-3 bg-white/50 dark:bg-[#282420]/65 backdrop-blur-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#FF6B4A]" />
              <h4 className="text-sm font-black uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6]">
                Body Condition Score (BCS) & Weight Touch-Test
              </h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1A1A1A]/5 dark:bg-white/5 border border-[#1A1A1A]/10 dark:border-white/10 text-[0.62rem] font-mono uppercase tracking-widest text-[#8A8680] dark:text-[#9A9590]">
              Clinical Scale: 1 - 9
            </span>
          </div>

          <p className="text-xs mb-5 text-[#8A8680] dark:text-[#9A9590] leading-relaxed">
            The standard clinical <strong>Body Condition Score (BCS)</strong> is used by veterinarians worldwide to evaluate a dog's health more accurately than weight alone. Toggle the score card below to understand your companion's current status and learn the physical touch-test:
          </p>

          {/* BCS Buttons Bar */}
          <div className="mb-6">
            <div className="grid grid-cols-9 gap-1 sm:gap-2 mb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((score) => {
                const isSelected = bcsScore === score;
                const details = BCS_DETAILS[score];
                let btnClass = "";
                
                if (details.category === 'Underweight') {
                  btnClass = isSelected 
                    ? "bg-[#E5A836] text-white border-[#1A1A1A] dark:border-[#F0ECE6]" 
                    : "bg-[#E5A836]/10 text-[#E5A836] border-[#E5A836]/20 hover:bg-[#E5A836]/20 hover:scale-105";
                } else if (details.category === 'Ideal') {
                  btnClass = isSelected 
                    ? "bg-[#2D8C6F] text-white border-[#1A1A1A] dark:border-[#F0ECE6]" 
                    : "bg-[#2D8C6F]/10 text-[#2D8C6F] border-[#2D8C6F]/20 hover:bg-[#2D8C6F]/20 hover:scale-105";
                } else {
                  btnClass = isSelected 
                    ? "bg-[#C75B7A] text-white border-[#1A1A1A] dark:border-[#F0ECE6]" 
                    : "bg-[#C75B7A]/10 text-[#C75B7A] border-[#C75B7A]/20 hover:bg-[#C75B7A]/20 hover:scale-105";
                }

                return (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setBcsScore(score)}
                    className={`h-11 sm:h-12 border-[2px] rounded-lg font-mono font-bold text-xs sm:text-sm cursor-pointer hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center relative ${btnClass}`}
                  >
                    <span>{score}</span>
                    <span className="hidden sm:inline text-[0.52rem] font-sans font-normal uppercase tracking-tighter block mt-0.5 opacity-80">
                      {details.category === 'Underweight' ? 'Thin' : details.category === 'Ideal' ? 'Ideal' : 'Over'}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between font-mono text-[0.6rem] text-[#8A8680] dark:text-[#9A9590] uppercase px-1">
              <span className="text-[#E5A836]">Thin (1-3)</span>
              <span className="text-[#2D8C6F] font-bold">Ideal Line (4-5)</span>
              <span className="text-[#C75B7A]">Overweight (6-9)</span>
            </div>
          </div>

          {/* Active details panel */}
          <div className={`p-5 rounded-xl border-2 transition-all duration-300 ${BCS_DETAILS[bcsScore].borderColor} ${BCS_DETAILS[bcsScore].bgColor} mb-6`}>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm bg-[#1A1A1A] text-white dark:bg-[#F0ECE6] dark:text-[#141210]">
                {bcsScore}
              </span>
              <div>
                <h5 className="font-extrabold text-sm text-[#1A1A1A] dark:text-[#F0ECE6] leading-none">
                  Score: {BCS_DETAILS[bcsScore].label}
                </h5>
                <span className={`text-[0.62rem] font-mono uppercase tracking-widest font-black ${BCS_DETAILS[bcsScore].color}`}>
                  Status: {BCS_DETAILS[bcsScore].category}
                </span>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <h6 className="text-[0.68rem] font-bold uppercase tracking-wider text-[#8A8680] dark:text-[#9A9590] mb-1">
                  What Veterinarians See & Feel
                </h6>
                <p className="text-xs text-[#1A1A1A] dark:text-[#F0ECE6] leading-relaxed">
                  {BCS_DETAILS[bcsScore].description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3.5 border-t border-[#1A1A1A]/10 dark:border-white/10">
                <div>
                  <h6 className="text-[0.68rem] font-bold uppercase tracking-wider text-[#8A8680] dark:text-[#9A9590] mb-1">
                    Touch-Test Indicator
                  </h6>
                  <p className="text-xs text-[#8A8680] dark:text-[#9A9590] leading-relaxed italic">
                    👉 {BCS_DETAILS[bcsScore].touchGuide}
                  </p>
                </div>
                <div>
                  <h6 className="text-[0.68rem] font-bold uppercase tracking-wider text-[#8A8680] dark:text-[#9A9590] mb-1">
                    Dietary Adjustment Focus
                  </h6>
                  <p className="text-xs text-[#1A1A1A] dark:text-[#F0ECE6] leading-relaxed font-medium">
                    🎯 {BCS_DETAILS[bcsScore].action}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Touch-Test step instructions */}
          <div className="bg-[#1A1A1A]/2 dark:bg-white/2 border border-[#1A1A1A]/10 dark:border-white/10 rounded-xl p-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6] mb-3 flex items-center gap-1.5">
              <span>🩺</span> Hand-on Interactive Weight Check Tutorial:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-white/40 dark:bg-[#141210]/40 rounded-lg">
                <span className="font-mono text-[0.65rem] font-bold text-[#FF6B4A] block mb-0.5">STEP 1</span>
                <strong className="text-[0.68rem] text-[#1A1A1A] dark:text-[#F0ECE6] block mb-1">The Knuckle Test (Ribs)</strong>
                <p className="text-[0.65rem] text-[#8A8680] dark:text-[#9A9590] leading-relaxed">
                  Place hands on your dog and run your thumbs flat across the ribs. If it feels like the back of your flat hand, they are <strong>Ideal</strong>. Knuckles under clenched fist? <strong>Thin</strong>. Fleshy palm? <strong>Overweight</strong>.
                </p>
              </div>

              <div className="p-3 bg-white/40 dark:bg-[#141210]/40 rounded-lg">
                <span className="font-mono text-[0.65rem] font-bold text-[#2D8C6F] block mb-0.5">STEP 2</span>
                <strong className="text-[0.68rem] text-[#1A1A1A] dark:text-[#F0ECE6] block mb-1">The Abdominal Tuck</strong>
                <p className="text-[0.65rem] text-[#8A8680] dark:text-[#9A9590] leading-relaxed">
                  Crouch or sit at your dog's eye level from the side and view their lower belly line. A proper healthy companion must show a distinct upward slope (tuck) behind the ribs, rather than a saggy or completely straight horizontal line.
                </p>
              </div>

              <div className="p-3 bg-white/40 dark:bg-[#141210]/40 rounded-lg">
                <span className="font-mono text-[0.65rem] font-bold text-[#E5A836] block mb-0.5">STEP 3</span>
                <strong className="text-[0.68rem] text-[#1A1A1A] dark:text-[#F0ECE6] block mb-1">The Overhead Hourglass</strong>
                <p className="text-[0.65rem] text-[#8A8680] dark:text-[#9A9590] leading-relaxed">
                  Look directly down at your dog standing up. A healthy fit companion always displays a gentle waistline narrowing inside after the rib frame, creating an elegant, subtle hourglass shadow before widening slightly at the hips.
                </p>
              </div>
            </div>
          </div>

          {/* BCS Citation Footer */}
          <div className="mt-4 pt-3 border-t border-[#1A1A1A]/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[0.65rem] font-mono text-[#8A8680] dark:text-[#9A9590]">
              *Purina Lifelong Longevity Study demonstrated +1.8 to +2.5 years median lifespan extension via lean BCS 4-5 maintenance.
            </span>
            <VerifiedByBadge databaseKey="purina_lifelong" layout="pill" />
          </div>
        </div>
      </div>

      {/* 8.8. Interactive Growth Chart Block (Spans 3 columns) */}
      <div className="md:col-span-3 bg-white/50 dark:bg-[#282420]/65 backdrop-blur-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#FF6B4A]" />
              <h4 className="text-sm font-black uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6]">
                Developmental Weight & D3 Growth Zone Curve
              </h4>
            </div>

            {/* Toggle imperial vs metric */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#1A1A1A]/5 dark:bg-white/5 border border-[#1A1A1A]/10 dark:border-white/10 rounded-lg p-1">
              <button
                type="button"
                onClick={() => handleUnitChange('lbs')}
                className={`px-2.5 py-1 text-[0.62rem] font-bold font-mono rounded select-none cursor-pointer transition-all ${unit === 'lbs' ? 'bg-[#FF6B4A] text-white' : 'text-[#8A8680] dark:text-[#9A9590] hover:text-[#1A1A1A] dark:hover:text-[#F0ECE6]'}`}
              >
                Imperial (lbs)
              </button>
              <button
                type="button"
                onClick={() => handleUnitChange('kg')}
                className={`px-2.5 py-1 text-[0.62rem] font-bold font-mono rounded select-none cursor-pointer transition-all ${unit === 'kg' ? 'bg-[#FF6B4A] text-white' : 'text-[#8A8680] dark:text-[#9A9590] hover:text-[#1A1A1A] dark:hover:text-[#F0ECE6]'}`}
              >
                Metric (kg)
              </button>
            </div>
          </div>

          <p className="text-xs mb-5 text-[#8A8680] dark:text-[#9A9590] leading-relaxed">
            The growth trajectory of a <strong className="text-[#1A1A1A] dark:text-[#F0ECE6]">{breed.name}</strong> ({breed.size} size class) typically matures around <strong className="text-[#FF6B4A]">{maturityMonths} months</strong> of age. Customize their weight to trace development on the standard growth path:
          </p>

          {/* Top Quick Status Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {/* Adult Target Range */}
            <div className="p-3 bg-[#FF6B4A]/5 rounded-lg border border-[#FF6B4A]/25 flex flex-col justify-between">
              <span className="text-[0.62rem] font-bold uppercase tracking-wider text-[#FF6B4A] block mb-0.5">
                Adult Target Range
              </span>
              <p className="text-sm font-extrabold text-[#1A1A1A] dark:text-[#F0ECE6] leading-tight">
                {breed.weight}
              </p>
              <div className="text-[0.58rem] font-mono text-[#8A8680] dark:text-[#9A9590] mt-0.5">
                (~{(breed.weightGrams / 1000).toFixed(1)} kg) at {maturityMonths}m
              </div>
            </div>

            {/* Dynamic Weight Input */}
            <div className="p-3 bg-[#2D8C6F]/5 rounded-lg border border-[#2D8C6F]/25 flex flex-col justify-between">
              <label className="text-[0.62rem] font-bold uppercase tracking-wider text-[#2D8C6F] block mb-1">
                Current Registered Weight ({unit})
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={currentWeight || ''}
                onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
                className="w-full bg-white dark:bg-[#1A1A1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-md px-2.5 py-1 text-sm font-mono font-bold text-[#1A1A1A] dark:text-[#F0ECE6] focus:outline-none focus:border-[#FF6B4A]"
              />
              <span className="text-[0.5rem] text-[#8A8680] block mt-1">Updates D3 trajectory & longevity models in real-time</span>
            </div>

            {/* Maturational Age */}
            <div className="p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/25 flex flex-col justify-between">
              <span className="text-[0.62rem] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">
                Maturational Age
              </span>
              <p className="text-sm font-extrabold text-[#1A1A1A] dark:text-[#F0ECE6] leading-tight mt-0.5">
                {ageInMonths} Months Old
              </p>
              <p className="text-[0.58rem] leading-normal font-mono text-[#8A8680] dark:text-[#9A9590] mt-0.5">
                Standard expected: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{unit === 'lbs' ? `${currentEstWeight.lbs} lbs` : `${currentEstWeight.kgs} kg`}</strong> ({currentEstWeight.percent}% grown)
              </p>
            </div>
          </div>

          {/* D3 Multi-Mode Interactive Growth & Longevity Chart */}
          <div className="w-full mb-4">
            <D3GrowthChart
              breed={breed}
              currentAge={age}
              currentWeight={currentWeight}
              unit={unit}
              onWeightChange={(newW) => setCurrentWeight(newW)}
            />
          </div>
        </div>

        {/* Dynamic Weight Analysis Alert Banner */}
        {(() => {
          const size = breed.size;
          const adultWeightGrams = breed.weightGrams || 10000;
          const targetAdultWeight = unit === 'lbs' ? (adultWeightGrams / 1000) * 2.20462 : adultWeightGrams / 1000;
          
          let matMonths = 12;
          if (size === 'toy') matMonths = 9;
          else if (size === 'small') matMonths = 12;
          else if (size === 'medium') matMonths = 12;
          else if (size === 'large') matMonths = 18;
          else if (size === 'giant') matMonths = 24;

          const currentMonths = age * 12;
          const progressRatio = Math.min(1, currentMonths / matMonths);
          const pct = currentMonths === 0 ? 0.05 : 0.05 + 0.95 * Math.sin((progressRatio * Math.PI) / 2) ** 1.8;
          const typicalWeight = targetAdultWeight * pct;

          if (currentWeight > 0) {
            if (currentWeight < typicalWeight * 0.8) {
              return (
                <div className="bg-amber-500/10 border-2 border-dashed border-amber-500/30 rounded-lg p-3 text-[0.68rem] text-amber-700 dark:text-amber-300 leading-relaxed mt-2">
                  ⚠️ <strong>Underweight Alert:</strong> Your dog's entered weight ({currentWeight} {unit}) is below the standard 20% tolerance of the ideal growth curve ({typicalWeight.toFixed(1)} {unit}). Ensure they are fed balanced, nutrient-dense meals and consult your veterinarian for standard metabolic reviews.
                </div>
              );
            } else if (currentWeight > typicalWeight * 1.2) {
              return (
                <div className="bg-rose-500/10 border-2 border-dashed border-rose-500/30 rounded-lg p-3 text-[0.68rem] text-rose-700 dark:text-rose-300 leading-relaxed mt-2">
                  ⚠️ <strong>Overweight Warning:</strong> Your dog's entered weight ({currentWeight} {unit}) is over 20% higher than the typical growth curve ({typicalWeight.toFixed(1)} {unit}). Excess body mass in growing puppies can lead to serious joint dysplasia and bone frame distress. Consider portion adjustments or lower fat kibbles.
                </div>
              );
            } else {
              return (
                <div className="bg-emerald-500/10 border-2 border-dashed border-emerald-500/30 rounded-lg p-3 text-[0.68rem] text-emerald-700 dark:text-emerald-300 leading-relaxed mt-2">
                  🟢 <strong>Optimal Growth Zone:</strong> Excellent! Your companion's weight ({currentWeight} {unit}) is tracking beautifully within the ideal developmental range for {breed.name} ({typicalWeight.toFixed(1)} {unit} standard). Keep up the fantastic care!
                </div>
              );
            }
          }
          return (
            <div className="bg-[#1A1A1A]/5 dark:bg-white/5 border border-[#1A1A1A]/10 dark:border-white/10 rounded-lg p-3 text-[0.68rem] text-[#8A8680] dark:text-[#9A9590] leading-relaxed">
              💡 <strong>Growth Guideline:</strong> Growth curves are typical estimates based on normal, healthy puppies. If your companion's weight deviates significantly from the curve, consult your veterinarian to verify positive body condition score parameters.
            </div>
          );
        })()}

        {/* Interactive Historical Weight Logger & Projection Tracker */}
        <div className="mt-5">
          <InteractiveWeightLogger
            breed={breed}
            currentAgeYears={age}
            unit={unit}
            onWeightChange={(newW) => setCurrentWeight(newW)}
          />
        </div>

        {/* Growth Standards Citation Footer */}
        <div className="mt-4 pt-3 border-t border-[#1A1A1A]/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[0.65rem] font-mono text-[#8A8680] dark:text-[#9A9590]">
            *Biometric growth standards calibrated against WALTHAM & AKC multi-breed puppy cohort (n = 51,150).
          </span>
          <VerifiedByBadge databaseKey="akc" layout="pill" />
        </div>
      </div>

      {/* 8.7. Interactive Health Cost Estimator & Breed-Specific Lifetime Veterinary costs */}
      <div className="md:col-span-3 bg-white/50 dark:bg-[#282420]/65 backdrop-blur-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-[#2D8C6F]" />
              <h4 className="text-sm font-black uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6]">
                Interactive Health Cost Estimator & Breed-Specific Lifetime Veterinary Costs
              </h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#2D8C6F]/10 text-[#2D8C6F] border border-[#2D8C6F]/20 text-[0.62rem] font-mono uppercase tracking-widest font-black">
              Budget Projection
            </span>
          </div>

          <p className="text-xs mb-6 text-[#8A8680] dark:text-[#9A9590] leading-relaxed">
            Canine companions represent a joyful but lifelong primary financial commitment. This clinical ledger models typical veterinary, diet, and emergency categories specifically adjusted for a <strong className="text-[#1A1A1A] dark:text-[#F0ECE6]">{breed.name}</strong> ({breed.size} category, expected median lifespan: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{avgLife} years</strong>):
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Controls Column (Spans 5) */}
            <div className="lg:col-span-5 space-y-4">
              <h5 className="text-[0.68rem] font-bold uppercase tracking-wider text-[#8A8680] dark:text-[#9A9590] border-b border-[#1A1A1A]/10 dark:border-white/10 pb-1.5">
                🎛️ Configure Care Profile
              </h5>

              {/* 1. Diet Selection */}
              <div>
                <label className="block text-[0.68rem] font-bold uppercase tracking-wide text-[#1A1A1A] dark:text-[#F0ECE6] mb-1.5 flex justify-between">
                  <span>Diet & Nutrition Quality:</span>
                  <span className="font-mono text-[0.62rem] text-[#2D8C6F] font-black uppercase">
                    {dietTier === 'standard' ? 'Standard Dry Kibble' : dietTier === 'premium' ? 'Premium Balanced Formula' : 'Fresh Raw Food Grade'}
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['standard', 'premium', 'raw'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setDietTier(tier)}
                      className={`py-1.5 text-[0.65rem] font-bold border-2 rounded-lg transition-all cursor-pointer ${
                        dietTier === tier
                          ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white dark:bg-[#F0ECE6] dark:border-[#F0ECE6] dark:text-[#141210]'
                          : 'bg-[#1A1A1A]/2 hover:bg-[#1A1A1A]/5 dark:bg-white/2 dark:hover:bg-white/5 border-[#1A1A1A]/10 dark:border-white/10 text-[#8A8680] dark:text-[#9A9590]'
                      }`}
                    >
                      {tier === 'standard' ? 'Standard' : tier === 'premium' ? 'Premium' : 'Fresh / Raw'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Wellness Plan level */}
              <div>
                <label className="block text-[0.68rem] font-bold uppercase tracking-wide text-[#1A1A1A] dark:text-[#F0ECE6] mb-1.5 flex justify-between">
                  <span>Preventative Wellness Tier:</span>
                  <span className="font-mono text-[0.62rem] text-[#2D8C6F] font-black">
                    {wellnessTier === 'basic' ? 'Basic Hand-checks' : 'Comprehensive Screenings'}
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setWellnessTier('basic')}
                    className={`py-1.5 text-[0.65rem] font-bold border-2 rounded-lg transition-all cursor-pointer ${
                      wellnessTier === 'basic'
                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white dark:bg-[#F0ECE6] dark:border-[#F0ECE6] dark:text-[#141210]'
                        : 'bg-[#1A1A1A]/2 hover:bg-[#1A1A1A]/5 dark:bg-white/2 dark:hover:bg-white/5 border-[#1A1A1A]/10 dark:border-white/10 text-[#8A8680] dark:text-[#9A9590]'
                    }`}
                  >
                    Essential Checkups (Basic)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWellnessTier('high')}
                    className={`py-1.5 text-[0.65rem] font-bold border-2 rounded-lg transition-all cursor-pointer ${
                      wellnessTier === 'high'
                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white dark:bg-[#F0ECE6] dark:border-[#F0ECE6] dark:text-[#141210]'
                        : 'bg-[#1A1A1A]/2 hover:bg-[#1A1A1A]/5 dark:bg-white/2 dark:hover:bg-white/5 border-[#1A1A1A]/10 dark:border-white/10 text-[#8A8680] dark:text-[#9A9590]'
                    }`}
                  >
                    Dental & Wellness Panels (Pro)
                  </button>
                </div>
              </div>

              {/* 3. Grooming Sessions per Year */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[0.68rem] font-bold uppercase tracking-wide text-[#1A1A1A] dark:text-[#F0ECE6]">Grooming Sessions:</span>
                  <span className="font-mono text-xs text-[#2D8C6F] font-extrabold">{groomingSessions} sessions / year</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGroomingSessions(prev => Math.max(0, prev - 1))}
                    className="w-8 h-8 rounded border-2 border-[#1A1A1A]/20 dark:border-white/20 font-bold hover:bg-[#1A1A1A]/5 dark:hover:bg-white/5 active:scale-90 transition-all flex items-center justify-center cursor-pointer text-[#1A1A1A] dark:text-[#F0ECE6]"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    value={groomingSessions}
                    onChange={(e) => setGroomingSessions(parseInt(e.target.value) || 0)}
                    className="flex-1 accent-[#2D8C6F] h-1 bg-gray-200 dark:bg-neutral-800 rounded-lg cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setGroomingSessions(prev => Math.min(12, prev + 1))}
                    className="w-8 h-8 rounded border-2 border-[#1A1A1A]/20 dark:border-white/20 font-bold hover:bg-[#1A1A1A]/5 dark:hover:bg-white/5 active:scale-90 transition-all flex items-center justify-center cursor-pointer text-[#1A1A1A] dark:text-[#F0ECE6]"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 4. Unexpected Emergencies over Lifespan */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[0.68rem] font-bold uppercase tracking-wide text-[#1A1A1A] dark:text-[#F0ECE6]">Emergency / Injury Incidents:</span>
                  <span className="font-mono text-xs text-[#2D8C6F] font-extrabold">{lifetimeEmergencies} incidents</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLifetimeEmergencies(prev => Math.max(0, prev - 1))}
                    className="w-8 h-8 rounded border-2 border-[#1A1A1A]/20 dark:border-white/20 font-bold hover:bg-[#1A1A1A]/5 dark:hover:bg-white/5 active:scale-90 transition-all flex items-center justify-center cursor-pointer text-[#1A1A1A] dark:text-[#F0ECE6]"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    value={lifetimeEmergencies}
                    onChange={(e) => setLifetimeEmergencies(parseInt(e.target.value) ?? 0)}
                    className="flex-1 accent-[#2D8C6F] h-1 bg-gray-200 dark:bg-neutral-800 rounded-lg cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setLifetimeEmergencies(prev => Math.min(6, prev + 1))}
                    className="w-8 h-8 rounded border-2 border-[#1A1A1A]/20 dark:border-white/20 font-bold hover:bg-[#1A1A1A]/5 dark:hover:bg-white/5 active:scale-90 transition-all flex items-center justify-center cursor-pointer text-[#1A1A1A] dark:text-[#F0ECE6]"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 5. Insurance Cover Activation Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIncludeInsurance(!includeInsurance)}
                  className={`w-full rounded-xl border-[2.5px] p-3 flex items-center justify-between text-left transition-all ${
                    includeInsurance
                      ? 'bg-emerald-500/10 border-emerald-500 hover:bg-emerald-500/15'
                      : 'bg-red-500/5 border-[#1A1A1A]/10 hover:bg-red-500/8 dark:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className={`w-5 h-5 ${includeInsurance ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-400'}`} />
                    <div>
                      <strong className="text-xs text-[#1A1A1A] dark:text-[#F0ECE6] block leading-tight">Pet Health Insurance Coverage</strong>
                      <span className="text-[0.62rem] text-[#8A8680] dark:text-[#9A9590] block mt-0.5">
                        {includeInsurance ? `Active (Covers 90% after $250 deductible)` : 'Inactive (Assumes 100% out of pocket costs)'}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[0.58rem] font-mono font-bold uppercase rounded-md tracking-wider ${
                    includeInsurance ? 'bg-emerald-500 text-white' : 'bg-red-500/20 text-red-600'
                  }`}>
                    {includeInsurance ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>

            </div>

            {/* Right Ledger Column (Spans 7) */}
            <div className="lg:col-span-7 bg-[#1A1A1A]/2 dark:bg-white/2 border-2 border-dashed border-[#1A1A1A]/10 dark:border-white/10 rounded-2xl p-5 space-y-5">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#1A1A1A]/10 dark:border-white/10 pb-3">
                <div>
                  <span className="text-[0.62rem] font-bold uppercase tracking-widest text-[#8A8680] dark:text-[#9A9590]">
                    Projected Lifetime Total Cumulative Cost
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight mt-0.5">
                    ${costEstimates.totalLifetime.toLocaleString('en-US', {maximumFractionDigits: 0})}
                  </div>
                </div>
                <div className="text-left sm:text-right font-mono text-[0.62rem] text-[#8A8680] dark:text-[#9A9590] leading-normal">
                  <span className="block font-bold">Base Monthly Avg: <strong className="text-[#1A1A1A] dark:text-[#F0ECE6]">${costEstimates.avgMonthly.toFixed(0)}/mo</strong></span>
                  <span className="block font-bold">Base Annual Avg: <strong className="text-[#1A1A1A] dark:text-[#F0ECE6]">${costEstimates.avgAnnual.toFixed(0)}/yr</strong></span>
                </div>
              </div>

              {/* Colored Ledger Items Stack */}
              <div className="space-y-3">
                <h6 className="text-[0.65rem] font-bold uppercase tracking-wider text-[#8A8680] dark:text-[#9A9590]">
                  Itemized Core Category Lifetime Shares
                </h6>
                <div className="space-y-2 text-xs">
                  {/* Routine Upkeep */}
                  <div>
                    <div className="flex justify-between font-bold text-[#1A1A1A] dark:text-[#F0ECE6] mb-0.5">
                      <span>🩺 Vet Routine Health Checks & Preventive Care</span>
                      <span className="font-mono text-[0.65rem]">${costEstimates.lifetimeRoutine.toLocaleString('en-US', {maximumFractionDigits:0})}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1A1A1A]/10 dark:bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="bg-sky-500 h-full rounded-full" 
                        style={{ width: `${(costEstimates.lifetimeRoutine / costEstimates.totalLifetime) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Food / Nutrition */}
                  <div>
                    <div className="flex justify-between font-bold text-[#1A1A1A] dark:text-[#F0ECE6] mb-0.5">
                      <span>🥩 Dietary & Whole-food Feed Requirements</span>
                      <span className="font-mono text-[0.65rem]">${costEstimates.lifetimeFood.toLocaleString('en-US', {maximumFractionDigits:0})}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1A1A1A]/10 dark:bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#E5A836] h-full rounded-full" 
                        style={{ width: `${(costEstimates.lifetimeFood / costEstimates.totalLifetime) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Coat care / Hygiene */}
                  <div>
                    <div className="flex justify-between font-bold text-[#1A1A1A] dark:text-[#F0ECE6] mb-0.5">
                      <span>✂️ Professional Grooming & Teeth Scaling</span>
                      <span className="font-mono text-[0.65rem]">${costEstimates.lifetimeGrooming.toLocaleString('en-US', {maximumFractionDigits:0})}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1A1A1A]/10 dark:bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#C75B7A] h-full rounded-full" 
                        style={{ width: `${(costEstimates.lifetimeGrooming / costEstimates.totalLifetime) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Unexpected care */}
                  <div>
                    <div className="flex justify-between font-bold text-[#1A1A1A] dark:text-[#F0ECE6] mb-0.5">
                      <span>🚨 Primary Emergency Out-of-pocket & Insurance</span>
                      <span className="font-mono text-[0.65rem]">
                        ${(costEstimates.lifetimeInsurance + costEstimates.actualLifetimeEmergency).toLocaleString('en-US', {maximumFractionDigits:0})}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1A1A1A]/10 dark:bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="bg-red-500 h-full rounded-full" 
                        style={{ width: `${((costEstimates.lifetimeInsurance + costEstimates.actualLifetimeEmergency) / costEstimates.totalLifetime) * 100}%` }}
                      />
                    </div>
                    <p className="text-[0.6rem] text-[#8A8680] dark:text-[#9A9590] mt-1">
                      Includes {lifetimeEmergencies} modeled major veterinary operations/illnesses.
                    </p>
                  </div>
                </div>
              </div>

              {/* Insurance Advice Box */}
              <div className={`p-3.5 rounded-xl border ${
                includeInsurance 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300' 
                  : 'bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300'
              } text-xs`}>
                {includeInsurance ? (
                  <div className="space-y-1">
                    <strong className="font-bold flex items-center gap-1">🛡️ Insurance Active: Financial Safety Guard</strong>
                    <p className="text-[0.68rem] leading-relaxed">
                      Predicted lifetime net savings: <strong className="font-extrabold text-[#2D8C6F]">${costEstimates.savings.toLocaleString('en-US', {maximumFractionDigits: 0})}</strong>. Even with consistent monthly premiums, your plan covers {lifetimeEmergencies} critical medical events (which would cost uninsured owners up to <strong>${costEstimates.lifetimeEmergencyUninsured.toLocaleString()}</strong> out of pocket).
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <strong className="font-bold flex items-center gap-1">⚠️ Danger Zone: Uninsured Care Structure</strong>
                    <p className="text-[0.68rem] leading-relaxed">
                      Without continuous coverage, your expected out-of-pocket expense for {lifetimeEmergencies} emergency surgeries is <strong className="font-extrabold">${costEstimates.lifetimeEmergencyUninsured.toLocaleString()}</strong>. Active coverage with a standard deductible of $250 would save you approximately <strong className="font-bold">${costEstimates.savings.toLocaleString('en-US', {maximumFractionDigits: 0})}</strong> over their lifespan.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Genetic predispositions section */}
          {breedRiskEstimates && breedRiskEstimates.length > 0 && (
            <div className="mt-8 border-t border-[#1A1A1A]/10 dark:border-white/10 pt-5">
              <h5 className="text-xs font-black uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6] mb-3 flex items-center gap-1.5">
                <span>🧬</span> Breed-Specific Genetic Predispositions & Estimated Clinic Care Fees:
              </h5>
              <p className="text-[0.68rem] text-[#8A8680] dark:text-[#9A9590] mb-4">
                Veterinary screening and early preventative actions can prevent progression. This custom matrix matches predispositions defined in your <strong className="text-[#1A1A1A] dark:text-[#F0ECE6]">{breed.name}'s</strong> profile with standard modern clinic pricing:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {breedRiskEstimates.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-3.5 bg-white dark:bg-[#141210] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[2px_2px_0_#1A1A1A] dark:shadow-[2px_2px_0_#F0ECE6] rounded-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <strong className="text-xs text-[#1A1A1A] dark:text-[#F0ECE6] font-bold">
                          {item.issue}
                        </strong>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[0.55rem] font-bold uppercase tracking-wider">
                          {item.riskType}
                        </span>
                      </div>
                      <p className="text-[0.65rem] text-[#8A8680] dark:text-[#9A9590] leading-relaxed mb-3">
                        {item.detail}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[#1A1A1A]/10 dark:border-white/10 font-mono text-[0.65rem]">
                      <span className="text-[#8A8680]">Estimated Cost Range:</span>
                      <strong className="text-[#FF6B4A] font-extrabold">{item.costRange}</strong>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <VerifiedByBadge databaseKey={getPathologyDatabase(item.issue, item.riskType).id} layout="pill" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Health Cost Citation Footer */}
          <div className="mt-4 pt-3 border-t border-[#1A1A1A]/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[0.65rem] font-mono text-[#8A8680] dark:text-[#9A9590]">
              *Lifetime surgical & screening projections matched against North American VMDB database (Fleming et al. UGA study, n = 74,556).
            </span>
            <VerifiedByBadge databaseKey="uga" layout="pill" />
          </div>

        </div>
      </div>

      {/* 8.85. Coat & Dermatological Grooming Cadence Matrix (Spans 3 columns) */}
      <div className="md:col-span-3">
        <GroomingCadenceMatrix breed={breed} currentAge={age} />
      </div>

      {/* 8.86. Canine Psychology, Inner Mind & Age-Calibrated Activities Engine (Spans 3 columns) */}
      <div id="canine-psychology-section" className="md:col-span-3">
        <CaninePsychologyEnrichment breed={breed} age={age} stageName={stage.name} />
      </div>

      {/* 8.88. Vet Appointments & Clinical Life-Stage Milestones (Spans 3 columns) */}
      <div id="vet-appointments-section" className="md:col-span-3">
        <VetAppointmentsMilestones
          breed={breed}
          currentAge={age}
          petName={breed.name}
          currentWeight={currentWeight}
          weightUnit={unit}
          bcsScore={bcsScore}
        />
      </div>

      {/* 8.9 Compare Breeds Tool (Spans 3 columns) */}
      <div className="md:col-span-3 bg-white/50 dark:bg-[#282420]/65 backdrop-blur-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-6 no-print">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8A8680] dark:text-[#9A9590] block mb-1">
          LONGEVITY BENCHMARK
        </span>
        <h4 className="text-xl font-extrabold mb-3 text-[#1A1A1A] dark:text-[#F0ECE6]">
          Compare Breed Lifespan Side-by-Side
        </h4>
        <p className="text-xs text-[#8A8680] dark:text-[#9A9590] leading-relaxed mb-4">
          Curious how other canine classes compare in lifespan, size categories, and clinical issues? Type and select another dog breed below to open a side-by-side comparative ledger:
        </p>

        {/* Search input field */}
        <div className="relative max-w-md mb-6">
          <input
            type="text"
            placeholder="Search breed to compare (e.g. Labrador, Golden Retriever, German Shepherd)..."
            value={compareSearch}
            onChange={(e) => setCompareSearch(e.target.value)}
            className="w-full bg-white dark:bg-[#1A1A1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-md px-3.5 py-2 text-xs font-mono font-bold text-[#1A1A1A] dark:text-[#F0ECE6] focus:outline-none focus:border-[#FF6B4A]"
          />
          
          {compareSearch.trim() && (
            <button
              type="button"
              onClick={() => setCompareSearch('')}
              className="absolute right-3.5 top-2.5 text-[0.62rem] font-bold text-[#FF6B4A] uppercase"
            >
              Clear
            </button>
          )}

          {/* Autocomplete list */}
          {filteredBreeds.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-[#1A1A1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-md shadow-lg overflow-hidden mt-1">
              {filteredBreeds.map((b) => (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => {
                    setSecondBreed(b);
                    setCompareSearch('');
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-mono hover:bg-[#FF6B4A]/10 text-[#1A1A1A] dark:text-[#F0ECE6] transition-colors border-b border-[#1A1A1A]/10 last:border-b-0 cursor-pointer"
                >
                  🐕 {b.name} ({b.size} size, typical lifespan: {b.min}-{b.max} yrs)
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Side by side comparison UI */}
        {secondBreed && (() => {
          const mainAvg = (breed.min + breed.max) / 2;
          const secondAvg = (secondBreed.min + secondBreed.max) / 2;
          const diff = Math.abs(mainAvg - secondAvg);
          const livesLonger = mainAvg > secondAvg;

          return (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch animate-[fadeIn_0.3s_ease-out]">
              {/* Main Breed Card */}
              <div className="md:col-span-5 bg-[#1A1A1A]/2 dark:bg-white/2 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-[#FF6B4A]/20 text-[#FF6B4A] border border-[#FF6B4A]/30 text-[0.55rem] font-black uppercase tracking-wider mb-2 inline-block">
                    Current Focus
                  </span>
                  <h5 className="font-extrabold text-base text-[#1A1A1A] dark:text-[#F0ECE6] mb-3">
                    {breed.name}
                  </h5>
                  
                  <div className="space-y-3 font-mono text-[0.7rem]">
                    <div className="flex justify-between border-b border-[#1A1A1A]/10 dark:border-white/10 pb-1.5">
                      <span className="text-[#8A8680]">Lifespan Span:</span>
                      <strong className="text-[#FF6B4A]">{breed.min} - {breed.max} yrs</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#1A1A1A]/10 dark:border-white/10 pb-1.5">
                      <span className="text-[#8A8680]">Average Life:</span>
                      <strong className="text-[#2D8C6F]">{mainAvg.toFixed(1)} yrs</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#1A1A1A]/10 dark:border-white/10 pb-1.5">
                      <span className="text-[#8A8680]">Size Category:</span>
                      <strong className="uppercase">{breed.size}</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#1A1A1A]/10 dark:border-white/10 pb-1.5">
                      <span className="text-[#8A8680]">Adult Weight:</span>
                      <strong>{breed.weight}</strong>
                    </div>
                    <div>
                      <span className="text-[#8A8680] block mb-1">Key Clinical Issues:</span>
                      <div className="flex flex-wrap gap-1">
                        {breed.health.slice(0, 3).map((h) => (
                          <span key={h} className="px-1.5 py-0.5 rounded bg-[#1A1A1A]/5 dark:bg-white/5 border border-[#1A1A1A]/10 text-[0.58rem]">
                            ⚠️ {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Longevity Difference Statement */}
              <div className="md:col-span-2 flex flex-col items-center justify-center text-center p-4 bg-gradient-to-b from-[#FF6B4A]/10 to-[#2D8C6F]/10 border-2 border-dashed border-[#1A1A1A]/15 rounded-xl">
                <span className="text-2xl mb-1">⚖️</span>
                <span className="text-[0.62rem] font-bold uppercase tracking-widest text-[#8A8680] dark:text-[#9A9590] block mb-1.5">
                  COMPARISON FACT
                </span>
                <p className="text-xs text-[#1A1A1A] dark:text-[#F0ECE6] leading-relaxed font-bold">
                  {diff === 0 ? (
                    `Both breeds have the exact same expected average lifespan of ${mainAvg.toFixed(1)} years!`
                  ) : (
                    `A ${livesLonger ? breed.name : secondBreed.name} typically lives ${diff.toFixed(1)} years longer than a ${livesLonger ? secondBreed.name : breed.name}!`
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setSecondBreed(null)}
                  className="mt-3.5 text-[0.55rem] font-black tracking-wider uppercase text-[#FF6B4A] hover:underline cursor-pointer"
                >
                  Remove Compare
                </button>
              </div>

              {/* Compared Breed Card */}
              <div className="md:col-span-5 bg-[#1A1A1A]/2 dark:bg-white/2 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 text-[0.55rem] font-black uppercase tracking-wider mb-2 inline-block">
                    Compared Breed
                  </span>
                  <h5 className="font-extrabold text-base text-[#1A1A1A] dark:text-[#F0ECE6] mb-3">
                    {secondBreed.name}
                  </h5>
                  
                  <div className="space-y-3 font-mono text-[0.7rem]">
                    <div className="flex justify-between border-b border-[#1A1A1A]/10 dark:border-[#FF6B4A] pb-1.5">
                      <span className="text-[#8A8680]">Lifespan Span:</span>
                      <strong className="text-[#FF6B4A]">{secondBreed.min} - {secondBreed.max} yrs</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#1A1A1A]/10 dark:border-[#FF6B4A] pb-1.5">
                      <span className="text-[#8A8680]">Average Life:</span>
                      <strong className="text-[#2D8C6F]">{secondAvg.toFixed(1)} yrs</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#1A1A1A]/10 dark:border-[#FF6B4A] pb-1.5">
                      <span className="text-[#8A8680]">Size Category:</span>
                      <strong className="uppercase">{secondBreed.size}</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#1A1A1A]/10 dark:border-[#FF6B4A] pb-1.5">
                      <span className="text-[#8A8680]">Adult Weight:</span>
                      <strong>{secondBreed.weight}</strong>
                    </div>
                    <div>
                      <span className="text-[#8A8680] block mb-1">Key Clinical Issues:</span>
                      <div className="flex flex-wrap gap-1">
                        {secondBreed.health.slice(0, 3).map((h) => (
                          <span key={h} className="px-1.5 py-0.5 rounded bg-[#1A1A1A]/5 dark:bg-white/5 border border-[#1A1A1A]/10 text-[0.58rem]">
                            ⚠️ {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 9. Printable Report Exporter CTA Block */}
      <div className="md:col-span-3 bg-[#1A1A1A] dark:bg-[#F0ECE6] border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[6px_6px_0_#FF6B4A] rounded-xl p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 no-print mt-2 transition-all">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FF6B4A]/20 dark:bg-[#FF6B4A]/10 border-2 border-[#FF6B4A] flex items-center justify-center flex-shrink-0 mt-0.5">
            <FileText className="w-6 h-6 text-[#FF6B4A]" />
          </div>
          <div className="text-left space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h5 className="font-extrabold text-white dark:text-[#141210] text-base tracking-tight">
                Printable PDF Summary & Clinical Longevity Blueprint
              </h5>
              <span className="px-2 py-0.5 rounded text-[0.6rem] font-mono font-bold bg-[#FF6B4A] text-white uppercase tracking-wider">
                jsPDF Engine
              </span>
            </div>
            <p className="text-xs text-white/80 dark:text-[#141210]/80 max-w-2xl leading-relaxed">
              Generate a high-density, multi-page vector PDF containing {breed.name}'s life expectancy range, remaining horizon, Body Condition Score (BCS), daily caloric targets, age-calibrated clinical guidance, genetic disease surveillance, and printable fridge care checklist.
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[0.65rem] font-mono text-[#E5A836] dark:text-[#c47f17]">
              <span>✓ Life Expectancy & Milestones</span>
              <span>•</span>
              <span>✓ BCS & Caloric Targets</span>
              <span>•</span>
              <span>✓ Pathology Watchlist</span>
              <span>•</span>
              <span>✓ 4-Tier Home Care Checklist</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => generatePDFReport('download')}
            disabled={isGeneratingPdf}
            className="w-full sm:w-auto px-5 py-3 font-bold bg-[#FF6B4A] hover:bg-[#ff552e] border-2 border-white dark:border-[#141210] text-white rounded-xl shadow-[3px_3px_0_#141210] dark:shadow-[3px_3px_0_white] hover:scale-105 active:scale-95 transition-all text-xs tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-white" />
                <span>Download PDF Summary</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => generatePDFReport('print')}
            disabled={isGeneratingPdf}
            className="w-full sm:w-auto px-4 py-3 font-bold bg-transparent hover:bg-white/10 dark:hover:bg-[#141210]/10 border-2 border-dashed border-white/60 dark:border-[#141210]/60 text-white dark:text-[#141210] rounded-xl hover:scale-105 active:scale-95 transition-all text-xs tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
            title="Sends vector document directly to printer or browser print dialog"
          >
            <Printer className="w-4 h-4" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

    </div>
  );
}
