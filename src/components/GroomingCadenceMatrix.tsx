/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Scissors, Sparkles, CheckCircle2, AlertCircle, Shield, Droplets, Calendar, RefreshCw } from 'lucide-react';
import { Breed } from '../types';

interface GroomingCadenceMatrixProps {
  breed: Breed;
  currentAge: number;
}

interface GroomingItem {
  id: string;
  task: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Seasonal';
  tool: string;
  clinicalPurpose: string;
}

export default function GroomingCadenceMatrix({ breed }: GroomingCadenceMatrixProps) {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const coatProfile = useMemo(() => {
    const name = breed.name.toLowerCase();
    const group = breed.group?.toLowerCase() || '';

    let coatType = 'Double Dense Coat';
    let sheddingLevel = 'Moderate to High Seasonal Shedding';
    let bathCadence = 'Every 4–6 Weeks (Avoid lipid strip)';
    let brushCadence = '2–3 Times Weekly (Daily during seasonal blow)';
    let dermatologicalRisk = 'Hot spots, matting near collar/tail, undercoat moisture trapping';

    if (name.includes('poodle') || name.includes('bichon') || name.includes('maltese') || name.includes('schnauzer') || name.includes('terrier')) {
      coatType = 'Low-Shedding Wire / Curly Single Coat';
      sheddingLevel = 'Minimal (Hypoallergenic)';
      bathCadence = 'Every 3–4 Weeks with conditioning rinse';
      brushCadence = 'Daily line brushing to prevent dense felt mats';
      dermatologicalRisk = 'Ear canal hair plucking/yeast, interdigital matting, skin dry itch';
    } else if (name.includes('pug') || name.includes('french') || name.includes('bulldog') || name.includes('boston') || name.includes('boxer') || name.includes('rottweiler') || name.includes('doberman') || name.includes('great dane')) {
      coatType = 'Short Smooth Single/Dense Coat';
      sheddingLevel = 'Continuous Fine Shedding';
      bathCadence = 'Every 6–8 Weeks or as needed';
      brushCadence = 'Weekly rubber curry mitt / bristle brush';
      dermatologicalRisk = 'Facial wrinkle fold pyoderma, interdigital cysts, dandruff';
    } else if (name.includes('husky') || name.includes('malamute') || name.includes('shepherd') || name.includes('samoyed') || name.includes('akita') || name.includes('golden') || name.includes('retriever')) {
      coatType = 'Heavy Weather-Resistant Double Coat';
      sheddingLevel = 'High (Major Spring & Autumn Blow Coat)';
      bathCadence = 'Every 6–8 Weeks with High-Velocity Blow Out';
      brushCadence = '3–4 Times Weekly with Undercoat Rake & Slicker';
      dermatologicalRisk = 'Severe undercoat impaction, acute moist dermatitis (hot spots)';
    } else if (name.includes('crested') || name.includes('xolo')) {
      coatType = 'Hairless / Minimal Crest';
      sheddingLevel = 'Zero Shedding';
      bathCadence = 'Weekly gentle hydrating wash';
      brushCadence = 'N/A (Daily skin moisturizing & UV sunscreen)';
      dermatologicalRisk = 'Sunburn, follicular occlusion acne, blackheads, dry skin cracks';
    }

    return {
      coatType,
      sheddingLevel,
      bathCadence,
      brushCadence,
      dermatologicalRisk
    };
  }, [breed.name, breed.group]);

  const groomingSchedule = useMemo<GroomingItem[]>(() => {
    const isDouble = coatProfile.coatType.includes('Double');
    const isCurly = coatProfile.coatType.includes('Curly') || coatProfile.coatType.includes('Wire');
    const isShort = coatProfile.coatType.includes('Short');
    const isHairless = coatProfile.coatType.includes('Hairless');

    const tasks: GroomingItem[] = [
      {
        id: 'brushing',
        task: isCurly ? 'Line Brushing & Comb Detangle' : isDouble ? 'Undercoat Rake & Slicker Stroke' : isHairless ? 'Skin Hydration & Sunscreen Application' : 'Curry Glove Deshedding Brush',
        frequency: isCurly || isHairless ? 'Daily' : 'Weekly',
        tool: isCurly ? 'Stainless Steel Greyhound Comb' : isDouble ? 'Undercoat Rake / Slicker Brush' : isHairless ? 'Veterinary Skin Emollient & SPF 30+' : 'Rubber Curry Mitt',
        clinicalPurpose: 'Prevents skin traction pain, aerates skin barrier, and eliminates dead follicle debris.'
      },
      {
        id: 'dental',
        task: 'Enzymatic Toothpaste Brushing',
        frequency: 'Daily',
        tool: 'Dual-Head Pet Toothbrush + Poultry/Beef Enzymatic Gel',
        clinicalPurpose: 'Removes bacterial biofilm before calcifying into subgingival tartar and causing cardiac bacteremia.'
      },
      {
        id: 'ear_clean',
        task: 'Ear Canal Flushing & Drying Check',
        frequency: 'Weekly',
        tool: 'pH-Balanced Astringent Drying Ear Flush (Phytosphingosine)',
        clinicalPurpose: 'Prevents moisture buildup and Malassezia pachydermatis yeast colonization.'
      },
      {
        id: 'nail_trim',
        task: 'Nail Quick Inspection & Dremel Filing',
        frequency: 'Weekly',
        tool: 'Diamond Bit Rotary Nail Grinder or Scissor Clipper',
        clinicalPurpose: 'Prevents hyperextension of digital joints, tendon strain, and postural arthritis.'
      },
      {
        id: 'paw_pad',
        task: 'Paw Pad & Interdigital Inspection',
        frequency: 'Weekly',
        tool: 'Paw Balm / Wax Barrier',
        clinicalPurpose: 'Checks for foxtails, burrs, salt burns, and hyperkeratosis cracking.'
      },
      {
        id: 'bath',
        task: 'Therapeutic pH-Neutral Hydrotherapy Bath',
        frequency: 'Monthly',
        tool: 'Soap-Free Colloidal Oatmeal Shampoo (pH 6.5–7.5)',
        clinicalPurpose: 'Cleanses without stripping protective lipid stratum corneum oils.'
      }
    ];

    if (breed.name.toLowerCase().includes('bulldog') || breed.name.toLowerCase().includes('pug') || breed.name.toLowerCase().includes('shar')) {
      tasks.unshift({
        id: 'wrinkle_wipe',
        task: 'Facial Fold & Wrinkle Disinfection',
        frequency: 'Daily',
        tool: 'Chlorhexidine 2% / Ketoconazole Antiseptic Wipes',
        clinicalPurpose: 'Eliminates anaerobic bacteria and intertriginous fold dermatitis.'
      });
    }

    return tasks;
  }, [coatProfile, breed.name]);

  return (
    <div className="border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl bg-white dark:bg-[#1E1C18] p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-[#1A1A1A] dark:text-[#F0ECE6] uppercase tracking-wider">
              Coat Genetics & Dermatological Grooming Cadence
            </h4>
            <p className="text-[0.7rem] text-stone-600 dark:text-stone-300">
              Custom preventive skin & hygiene protocol tailored to {breed.name}'s coat type.
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 text-[0.62rem] font-black uppercase tracking-wider">
          {coatProfile.coatType}
        </span>
      </div>

      {/* Coat Profile Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800">
          <div className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Brushing Frequency</span>
          </div>
          <div className="text-xs font-black text-[#1A1A1A] dark:text-[#F0ECE6] mt-1">
            {coatProfile.brushCadence}
          </div>
          <div className="text-[0.62rem] text-stone-500 mt-0.5">Undercoat aeration</div>
        </div>

        <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800">
          <div className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-cyan-500" />
            <span>Bathing Cadence</span>
          </div>
          <div className="text-xs font-black text-[#1A1A1A] dark:text-[#F0ECE6] mt-1">
            {coatProfile.bathCadence}
          </div>
          <div className="text-[0.62rem] text-stone-500 mt-0.5">Prevents lipid depletion</div>
        </div>

        <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800">
          <div className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Shedding Index</span>
          </div>
          <div className="text-xs font-black text-[#1A1A1A] dark:text-[#F0ECE6] mt-1">
            {coatProfile.sheddingLevel}
          </div>
          <div className="text-[0.62rem] text-stone-500 mt-0.5">Seasonal cycles</div>
        </div>
      </div>

      {/* Dermatological Clinical Warning Banner */}
      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-amber-900 dark:text-amber-300">
            Dermatological Surveillance Window:
          </span>{' '}
          <span className="text-stone-700 dark:text-stone-300">{coatProfile.dermatologicalRisk}</span>
        </div>
      </div>

      {/* Interactive Grooming Protocol Checklist */}
      <div className="space-y-2">
        <div className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center justify-between">
          <span>Step-by-Step Maintenance Protocol</span>
          <span className="text-[0.65rem] font-mono text-stone-500">
            {Object.values(completedTasks).filter(Boolean).length} / {groomingSchedule.length} Done
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {groomingSchedule.map((item) => {
            const isDone = !!completedTasks[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleTask(item.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-stone-500 line-through'
                    : 'bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 hover:border-indigo-500/50'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-md border-2 border-stone-400 dark:border-stone-600" />
                  )}
                </div>

                <div className="space-y-1 text-left flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#1A1A1A] dark:text-[#F0ECE6]">
                      {item.task}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[0.58rem] font-mono font-bold uppercase bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      {item.frequency}
                    </span>
                  </div>
                  <div className="text-[0.65rem] text-indigo-600 dark:text-indigo-400 font-medium">
                    🛠️ Recommended Tool: {item.tool}
                  </div>
                  <p className="text-[0.65rem] text-stone-600 dark:text-stone-400 leading-snug">
                    {item.clinicalPurpose}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
