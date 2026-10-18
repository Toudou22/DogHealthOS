/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Activity, ShieldAlert, Info, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { Breed } from '../types';

interface LifespanConditionHeatmapProps {
  breed: Breed;
  currentAgeYears: number;
}

interface ConditionProfile {
  name: string;
  category: 'Orthopedic' | 'Cardiology' | 'Oncology' | 'Endocrine' | 'Ophthalmic' | 'Neurology' | 'Gastrointestinal';
  riskByStage: {
    puppy: { level: 0 | 1 | 2 | 3; advice: string; screening: string };
    youngAdult: { level: 0 | 1 | 2 | 3; advice: string; screening: string };
    adult: { level: 0 | 1 | 2 | 3; advice: string; screening: string };
    senior: { level: 0 | 1 | 2 | 3; advice: string; screening: string };
    geriatric: { level: 0 | 1 | 2 | 3; advice: string; screening: string };
  };
}

const STAGES = [
  { key: 'puppy', label: 'Puppyhood', range: '0–1y', minAge: 0, maxAge: 1 },
  { key: 'youngAdult', label: 'Young Adult', range: '1–3y', minAge: 1, maxAge: 3 },
  { key: 'adult', label: 'Mature Adult', range: '3–7y', minAge: 3, maxAge: 7 },
  { key: 'senior', label: 'Senior', range: '7–11y', minAge: 7, maxAge: 11 },
  { key: 'geriatric', label: 'Geriatric', range: '11y+', minAge: 11, maxAge: 20 },
] as const;

export default function LifespanConditionHeatmap({ breed, currentAgeYears }: LifespanConditionHeatmapProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeHoverCell, setActiveHoverCell] = useState<{
    condition: string;
    stageLabel: string;
    level: number;
    advice: string;
    screening: string;
  } | null>(null);

  // Generate mapped condition profiles based on breed health list
  const conditions = useMemo<ConditionProfile[]>(() => {
    const rawList = breed.health && breed.health.length > 0 ? breed.health : [
      'Hip dysplasia',
      'Heart conditions (mitral valve disease)',
      'Cataracts',
      'Hypothyroidism',
      'Dental disease',
      'Arthritis'
    ];

    return rawList.map((issue) => {
      const lower = issue.toLowerCase();
      let category: ConditionProfile['category'] = 'Orthopedic';

      if (lower.includes('heart') || lower.includes('cardio') || lower.includes('valve') || lower.includes('murmur') || lower.includes('dcm')) {
        category = 'Cardiology';
      } else if (lower.includes('cancer') || lower.includes('tumor') || lower.includes('sarcoma') || lower.includes('lymphoma') || lower.includes('hemangiosarcoma')) {
        category = 'Oncology';
      } else if (lower.includes('eye') || lower.includes('cataract') || lower.includes('pra') || lower.includes('glaucoma') || lower.includes('retinal')) {
        category = 'Ophthalmic';
      } else if (lower.includes('thyroid') || lower.includes('diabetes') || lower.includes('cushing') || lower.includes('endocrine') || lower.includes('pancreatitis')) {
        category = 'Endocrine';
      } else if (lower.includes('epilepsy') || lower.includes('seizure') || lower.includes('myelopathy') || lower.includes('syringomyelia') || lower.includes('spine') || lower.includes('ivdd')) {
        category = 'Neurology';
      } else if (lower.includes('bloat') || lower.includes('gdv') || lower.includes('colitis') || lower.includes('stomach') || lower.includes('gi')) {
        category = 'Gastrointestinal';
      } else {
        category = 'Orthopedic';
      }

      // Assign realistic age curves based on etiology
      if (category === 'Orthopedic') {
        return {
          name: issue,
          category,
          riskByStage: {
            puppy: { level: 1, advice: 'Genetic juvenile formation period; avoid high-impact jumping.', screening: 'PennHIP / OFA preliminary palpation at 16-24 weeks.' },
            youngAdult: { level: 2, advice: 'Joint cartilage stress; support with omega-3 fatty acids.', screening: 'Official OFA radiographic evaluation at 24 months.' },
            adult: { level: 2, advice: 'Maintain lean BCS to reduce weight pressure on hip/elbow sockets.', screening: 'Annual orthopedic range-of-motion assessment.' },
            senior: { level: 3, advice: 'Secondary osteoarthritis risk; introduce joint chondroprotectants.', screening: 'Bi-annual mobility evaluation & pain score mapping.' },
            geriatric: { level: 3, advice: 'Stiffness & muscular atrophy; physical rehab & orthopedic bedding.', screening: 'Multimodal pain management protocol (NSAIDs/Laser).' }
          }
        };
      }

      if (category === 'Cardiology') {
        return {
          name: issue,
          category,
          riskByStage: {
            puppy: { level: 0, advice: 'Congenital auscultation check during puppy vaccinations.', screening: 'Stethoscope heart sound check at 8, 12, and 16 weeks.' },
            youngAdult: { level: 1, advice: 'Baseline adult cardiac rhythm check.', screening: 'Annual wellness auscultation.' },
            adult: { level: 2, advice: 'Emergence of early asymptomatic murmurs (B1 Stage).', screening: 'Baseline echocardiogram & blood pressure at age 4-5.' },
            senior: { level: 3, advice: 'Progressive valve insufficiency or cardiomyopathy surveillance.', screening: 'Annual echocardiography & chest thoracic radiographs.' },
            geriatric: { level: 3, advice: 'Active heart failure risk management; low sodium diet.', screening: 'Frequent cardiac biomarker (NT-proBNP) monitoring.' }
          }
        };
      }

      if (category === 'Oncology') {
        return {
          name: issue,
          category,
          riskByStage: {
            puppy: { level: 0, advice: 'Extremely rare in juvenile stages.', screening: 'Routine baseline physical exam.' },
            youngAdult: { level: 0, advice: 'Routine lymph node checks during annual wellness exams.', screening: 'Annual palpation.' },
            adult: { level: 1, advice: 'Early surveillance window; monitor any dermal lumps.', screening: 'FNA (Fine Needle Aspirate) on any cutaneous mass > 1cm.' },
            senior: { level: 3, advice: 'Peak statistical incidence window for breed.', screening: 'Annual abdominal ultrasound, chest x-rays & CBC blood panels.' },
            geriatric: { level: 3, advice: 'High surveillance vigilance; monitor appetite & energy.', screening: 'Bi-annual full senior oncology diagnostic panel.' }
          }
        };
      }

      if (category === 'Ophthalmic') {
        return {
          name: issue,
          category,
          riskByStage: {
            puppy: { level: 1, advice: 'Juvenile cataract & corneal screening.', screening: 'Ophthalmoscopic exam by licensed veterinarian.' },
            youngAdult: { level: 1, advice: 'Check intraocular pressure for early glaucoma/lens luxation.', screening: 'Annual CAER / CERF eye registry examination.' },
            adult: { level: 2, advice: 'Progressive retinal changes or nuclear sclerosis onset.', screening: 'Tonometry (eye pressure) & direct ophthalmoscopy.' },
            senior: { level: 3, advice: 'Cataract maturation or dry eye (KCS) development.', screening: 'Schirmer tear test & bi-annual ophthalmic evaluation.' },
            geriatric: { level: 3, advice: 'Vision loss adaptations; keep household furniture stationary.', screening: 'Prescription lubricating eye drops & comfort checks.' }
          }
        };
      }

      if (category === 'Endocrine') {
        return {
          name: issue,
          category,
          riskByStage: {
            puppy: { level: 0, advice: 'Monitor growth rate and juvenile blood glucose.', screening: 'Baseline vaccination bloodwork.' },
            youngAdult: { level: 1, advice: 'Track unexplained lethargy, coat thinning or weight surges.', screening: 'Baseline total T4 & chemistry profile.' },
            adult: { level: 2, advice: 'Prime adult onset window for thyroid/adrenal dysregulation.', screening: 'Annual comprehensive thyroid panel (Free T4, TSH).' },
            senior: { level: 3, advice: 'Elevated prevalence of metabolic imbalance.', screening: 'Bi-annual urinalysis, fructosamine / ACTH response test.' },
            geriatric: { level: 2, advice: 'Maintain strict medication timing and therapeutic blood levels.', screening: 'Quarterly hormone level titration checks.' }
          }
        };
      }

      // Default
      return {
        name: issue,
        category,
        riskByStage: {
          puppy: { level: 1, advice: 'Juvenile developmental baseline.', screening: 'Standard pediatric evaluation.' },
          youngAdult: { level: 1, advice: 'Young adult baseline stabilization.', screening: 'Annual veterinary physical.' },
          adult: { level: 2, advice: 'Active health surveillance protocol.', screening: 'Annual comprehensive blood & diagnostic check.' },
          senior: { level: 3, advice: 'Senior preventive intervention window.', screening: 'Bi-annual senior wellness exams.' },
          geriatric: { level: 3, advice: 'Palliative comfort & preservation protocol.', screening: 'Regular geriatric comfort and quality of life audits.' }
        }
      };
    });
  }, [breed.health]);

  // Filter conditions
  const filteredConditions = useMemo(() => {
    if (selectedCategory === 'all') return conditions;
    return conditions.filter((c) => c.category === selectedCategory);
  }, [conditions, selectedCategory]);

  // Determine current active stage key based on current age
  const currentStageKey = useMemo(() => {
    if (currentAgeYears < 1) return 'puppy';
    if (currentAgeYears < 3) return 'youngAdult';
    if (currentAgeYears < 7) return 'adult';
    if (currentAgeYears < 11) return 'senior';
    return 'geriatric';
  }, [currentAgeYears]);

  const categories = useMemo(() => {
    const cats = new Set(conditions.map((c) => c.category));
    return ['all', ...Array.from(cats)];
  }, [conditions]);

  const getHeatColor = (level: 0 | 1 | 2 | 3) => {
    switch (level) {
      case 0:
        return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
      case 1:
        return 'bg-amber-500/25 text-amber-800 dark:text-amber-200 border-amber-500/40';
      case 2:
        return 'bg-[#FF6B4A]/40 text-[#FF6B4A] dark:text-[#ff9278] border-[#FF6B4A]/50';
      case 3:
        return 'bg-[#FF6B4A] text-white border-[#1A1A1A] font-bold shadow-sm';
      default:
        return 'bg-stone-200 text-stone-700';
    }
  };

  const getLevelLabel = (level: 0 | 1 | 2 | 3) => {
    switch (level) {
      case 0:
        return 'Low / Baseline';
      case 1:
        return 'Moderate Risk';
      case 2:
        return 'Elevated Window';
      case 3:
        return 'Peak Risk Window';
    }
  };

  return (
    <div className="border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl bg-white dark:bg-[#1E1C18] p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#2D8C6F]/10 text-[#2D8C6F] border border-[#2D8C6F]/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-[#1A1A1A] dark:text-[#F0ECE6] uppercase tracking-wider">
              Lifespan Condition Heatmap & Screening Matrix
            </h4>
            <p className="text-[0.7rem] text-stone-600 dark:text-stone-300">
              Etiological risk progression across {breed.name}'s life stages with accredited diagnostic windows.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-1 rounded-md text-[0.62rem] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1A1A1A] dark:bg-[#F0ECE6] text-white dark:text-[#1A1A1A] shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 text-[0.65rem] font-bold">
        <span className="text-stone-500 uppercase tracking-wider">Surveillance Intensity:</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50 inline-block" />
            <span className="text-stone-600 dark:text-stone-300">Baseline (0)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500/50 inline-block" />
            <span className="text-stone-600 dark:text-stone-300">Moderate (1)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-[#FF6B4A]/50 border border-[#FF6B4A]/70 inline-block" />
            <span className="text-stone-600 dark:text-stone-300">Elevated (2)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-[#FF6B4A] border border-[#1A1A1A] inline-block" />
            <span className="text-stone-600 dark:text-stone-300">Peak Risk (3)</span>
          </span>
        </div>
      </div>

      {/* Interactive Matrix Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-stone-300 dark:border-stone-700">
              <th className="p-2.5 text-stone-700 dark:text-stone-200 font-black uppercase text-[0.65rem] tracking-wider w-1/3">
                Condition / Pathology
              </th>
              {STAGES.map((st) => {
                const isCurrentStage = st.key === currentStageKey;
                return (
                  <th
                    key={st.key}
                    className={`p-2.5 text-center font-black uppercase text-[0.65rem] tracking-wider transition-colors ${
                      isCurrentStage
                        ? 'bg-[#FF6B4A]/15 text-[#FF6B4A] rounded-t-lg border-x-2 border-t-2 border-[#FF6B4A]'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <div>{st.label}</div>
                    <div className="text-[0.58rem] font-mono font-normal opacity-80">{st.range}</div>
                    {isCurrentStage && (
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded-full bg-[#FF6B4A] text-white text-[0.52rem] font-black">
                        YOU ARE HERE ({currentAgeYears}y)
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
            {filteredConditions.map((cond) => (
              <tr key={cond.name} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors">
                <td className="p-2.5 font-bold text-[#1A1A1A] dark:text-[#F0ECE6] flex flex-col justify-center">
                  <div className="flex items-center gap-1.5">
                    <span>{cond.name}</span>
                  </div>
                  <span className="text-[0.6rem] font-mono text-stone-500 uppercase tracking-wider">
                    {cond.category} System
                  </span>
                </td>

                {STAGES.map((st) => {
                  const data = cond.riskByStage[st.key];
                  const isCurrentStage = st.key === currentStageKey;
                  return (
                    <td
                      key={st.key}
                      className={`p-1.5 text-center transition-all ${
                        isCurrentStage ? 'bg-[#FF6B4A]/5 border-x-2 border-[#FF6B4A]/30' : ''
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setActiveHoverCell({
                            condition: cond.name,
                            stageLabel: st.label,
                            level: data.level,
                            advice: data.advice,
                            screening: data.screening
                          })
                        }
                        onMouseEnter={() =>
                          setActiveHoverCell({
                            condition: cond.name,
                            stageLabel: st.label,
                            level: data.level,
                            advice: data.advice,
                            screening: data.screening
                          })
                        }
                        className={`w-full py-2.5 px-1 rounded-lg border text-[0.68rem] font-mono font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 ${getHeatColor(
                          data.level
                        )}`}
                      >
                        Tier {data.level}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interactive Detail Drawer for Selected/Hovered Cell */}
      {activeHoverCell && (
        <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 animate-[fadeIn_0.2s_ease-out] space-y-2">
          <div className="flex items-center justify-between border-b border-stone-300 dark:border-stone-800 pb-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#FF6B4A]" />
              <span className="text-xs font-black text-[#1A1A1A] dark:text-[#F0ECE6] uppercase tracking-wide">
                {activeHoverCell.condition} — {activeHoverCell.stageLabel} Guidance
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[0.65rem] font-bold uppercase tracking-wider bg-[#FF6B4A] text-white">
              {getLevelLabel(activeHoverCell.level as 0 | 1 | 2 | 3)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#1E1C18] border border-stone-200 dark:border-stone-800">
              <div className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider mb-1">
                Clinical Pathology Context:
              </div>
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-[0.72rem]">
                {activeHoverCell.advice}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#1E1C18] border border-stone-200 dark:border-stone-800">
              <div className="text-[0.65rem] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                Recommended Diagnostic & Screening Window:
              </div>
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-[0.72rem]">
                {activeHoverCell.screening}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
