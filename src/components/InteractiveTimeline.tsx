/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { 
  CalendarRange, 
  ChevronDown, 
  Bell, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { Breed } from '../types.ts';
import { getTimelineStages } from '../utils.ts';

interface InteractiveTimelineProps {
  breed: Breed;
  age: number;
}

interface MilestoneCareShift {
  domain: string;
  title: string;
  description: string;
  priority: 'Essential' | 'High' | 'Proactive';
}

interface UpcomingStageConfig {
  milestoneTitle: string;
  themeColor: string; // The distinct highlight color for this next predicted milestone
  textColor: string;
  darkTextColor: string;
  borderClass: string;
  darkBorderClass: string;
  bgClass: string;
  darkBgClass: string;
  badgeBg: string;
  shadowColor: string;
  darkShadowColor: string;
  summary: string;
  clinicalRationale: string;
  careShifts: MilestoneCareShift[];
}

const UPCOMING_STAGE_CONFIGS: Record<string, UpcomingStageConfig> = {
  Young: {
    milestoneTitle: 'Young Adult Transition (Adolescence & Physical Prime)',
    themeColor: '#0284C7', // Electric Sky Blue (distinct from Puppy coral #FF6B4A and Young gold #E5A836)
    textColor: 'text-[#0284C7]',
    darkTextColor: 'dark:text-[#38BDF8]',
    borderClass: 'border-[#0284C7]',
    darkBorderClass: 'dark:border-[#38BDF8]',
    bgClass: 'bg-sky-50/90',
    darkBgClass: 'dark:bg-[#082F49]/40',
    badgeBg: 'bg-[#0284C7]',
    shadowColor: '#0284C7',
    darkShadowColor: '#38BDF8',
    summary: 'Transitioning from rapid puppy growth into physiological adolescence and athletic young adult prime.',
    clinicalRationale: 'Initiating care adjustments 3–6 months prior to skeletal maturity protects bone growth plates before vigorous adult training.',
    careShifts: [
      {
        domain: 'Nutritional Calibration',
        title: 'Taper Puppy Calorie Surplus',
        description: 'Transition gradually from energy-dense puppy chow to adolescent maintenance to prevent rapid bone growth spikes.',
        priority: 'Essential'
      },
      {
        domain: 'Orthopedic Protection',
        title: 'Protect Skeletal Epiphyseal Plates',
        description: 'Avoid repetitive concussive jumping on hard pavement until long-bone growth plates finish fusing.',
        priority: 'High'
      },
      {
        domain: 'Behavioral Consolidation',
        title: 'Reinforce Impulse Control & Recall',
        description: 'Adolescent hormone surges can trigger fear periods or stubbornness; reinforce positive reinforcement habits.',
        priority: 'Proactive'
      },
      {
        domain: 'Veterinary Roadmap',
        title: 'Gonadectomy Timing & Microchip Audit',
        description: 'Consult your vet on optimal spay/neuter timing calibrated to your breed’s adult weight and skeletal closure.',
        priority: 'Essential'
      }
    ]
  },
  Adult: {
    milestoneTitle: 'Full Adult Maturity Transition (Metabolic Stability)',
    themeColor: '#8B5CF6', // Royal Purple (distinct from Young gold #E5A836 and Adult emerald #2D8C6F)
    textColor: 'text-[#8B5CF6]',
    darkTextColor: 'dark:text-[#A78BFA]',
    borderClass: 'border-[#8B5CF6]',
    darkBorderClass: 'dark:border-[#A78BFA]',
    bgClass: 'bg-purple-50/90',
    darkBgClass: 'dark:bg-[#2E1065]/40',
    badgeBg: 'bg-[#8B5CF6]',
    shadowColor: '#8B5CF6',
    darkShadowColor: '#A78BFA',
    summary: 'Transitioning into steady physiological adulthood, where basal metabolic rate begins leveling off.',
    clinicalRationale: 'Calibrating daily caloric intake during the adult transition prevents silent early-stage weight creep that shortens lifespan.',
    careShifts: [
      {
        domain: 'Metabolic Nutrition',
        title: 'Adopt Precise Gram-Weighed Adult Portions',
        description: 'Transition from young-dog feeding to adult maintenance measured in grams by target Body Condition Score (BCS 4-5).',
        priority: 'Essential'
      },
      {
        domain: 'Dental Prophylaxis',
        title: 'Establish Daily Enzymatic Brushing',
        description: 'Over 80% of dogs show periodontal degradation by age 3; start daily home hygiene before tartar hardens.',
        priority: 'Essential'
      },
      {
        domain: 'Orthopedic Screening',
        title: 'Baseline Hip & Elbow Clearances',
        description: 'Obtain definitive OFA/PennHIP joint evaluations if participating in agility, hunting, or working tasks.',
        priority: 'High'
      },
      {
        domain: 'Cardiovascular Fitness',
        title: 'Establish Structured Daily Endurance Routine',
        description: 'Consistent 45-60 minute structured brisk walking maintains lean muscle tone and healthy blood pressure.',
        priority: 'Proactive'
      }
    ]
  },
  Senior: {
    milestoneTitle: 'Senior Transition & Geriatric Vitality Protocol',
    themeColor: '#6366F1', // Electric Indigo (distinct from Adult emerald #2D8C6F and Senior copper #B87333)
    textColor: 'text-[#6366F1]',
    darkTextColor: 'dark:text-[#818CF8]',
    borderClass: 'border-[#6366F1]',
    darkBorderClass: 'dark:border-[#818CF8]',
    bgClass: 'bg-indigo-50/90',
    darkBgClass: 'dark:bg-[#1E1B4B]/40',
    badgeBg: 'bg-[#6366F1]',
    shadowColor: '#6366F1',
    darkShadowColor: '#818CF8',
    summary: 'Approaching the critical senior transition threshold. Proactive veterinary care before physical decline preserves cognitive function and mobility.',
    clinicalRationale: 'Clinical studies confirm that initiating senior interventions 6–12 months prior to overt slowing preserves up to 1.8 years of healthy lifespan.',
    careShifts: [
      {
        domain: 'Preventative Diagnostics',
        title: 'Schedule Pre-Senior Baseline Blood & Urine Panel',
        description: 'Establish baseline values for renal biomarkers (SDMA), hepatic enzymes, thyroid (T4), and complete blood count.',
        priority: 'Essential'
      },
      {
        domain: 'Joint & Cartilage Support',
        title: 'Initiate Marine Omega-3 (EPA/DHA) & Joint Actives',
        description: 'Introduce therapeutic Glucosamine, Chondroitin, and marine lipids before clinical stiffness or limping manifests.',
        priority: 'Essential'
      },
      {
        domain: 'Geriatric Caloric Shift',
        title: 'Transition to High-Quality Senior Protein Formula',
        description: 'Switch to easily digestible protein with controlled phosphorus to prevent sarcopenia while protecting renal function.',
        priority: 'High'
      },
      {
        domain: 'Home Environmental Ergonomics',
        title: 'Install Non-Slip Runners & Orthopedic Bedding',
        description: 'Place non-slip rugs on hardwood or tile floors and transition to high-density orthopedic memory foam beds.',
        priority: 'Proactive'
      }
    ]
  },
  Elder: {
    milestoneTitle: 'Golden Years Twilight Transition (Sacred Sanctuary)',
    themeColor: '#D946EF', // Vibrant Fuchsia (distinct from Senior copper #B87333 and Elder rose #C75B7A)
    textColor: 'text-[#D946EF]',
    darkTextColor: 'dark:text-[#F0ABFC]',
    borderClass: 'border-[#D946EF]',
    darkBorderClass: 'dark:border-[#F0ABFC]',
    bgClass: 'bg-fuchsia-50/90',
    darkBgClass: 'dark:bg-[#4A044E]/40',
    badgeBg: 'bg-[#D946EF]',
    shadowColor: '#D946EF',
    darkShadowColor: '#F0ABFC',
    summary: 'Transitioning into the tender twilight phase where comfort, gentle pace, and palliative vigilance take precedence.',
    clinicalRationale: 'Bi-annual physical examinations catch subtle sensory, cardiac, and arthritic shifts while non-invasive remedies remain highly effective.',
    careShifts: [
      {
        domain: 'Bi-Annual Clinical Vigilance',
        title: 'Twice-Yearly Senior Wellness Auscultations',
        description: 'Screen for emergent systolic heart murmurs, abdominal masses, dental pain, and blood pressure changes.',
        priority: 'Essential'
      },
      {
        domain: 'Pain Management Protocol',
        title: 'Proactive Osteoarthritis Pain Assessment',
        description: 'Discuss modern canine OA therapies (e.g., bedinvetmab monoclonal antibodies) if stairs or rising cause hesitation.',
        priority: 'Essential'
      },
      {
        domain: 'Cognitive & Sensory Adaptation',
        title: 'Nighttime Guidance Lighting & Scent Enrichment',
        description: 'Install nightlights along hallways, avoid rearranging furniture, and stimulate mental sharpness with snuffle mats.',
        priority: 'High'
      },
      {
        domain: 'Thermoregulation & Hydration',
        title: 'Warm Rest Zones & Elevated Water Stations',
        description: 'Place water bowls at shoulder height in multiple rooms and maintain comfortable ambient indoor warmth.',
        priority: 'Proactive'
      }
    ]
  }
};

export default function InteractiveTimeline({ breed, age }: InteractiveTimelineProps) {
  const stages = useMemo(() => getTimelineStages(breed), [breed]);

  // Position indicator out of max expected age
  const positionPercentage = useMemo(() => {
    return Math.min((age / breed.max) * 100, 100);
  }, [age, breed.max]);

  // Determine current stage index
  const currentStageIndex = useMemo(() => {
    const idx = stages.findIndex((s, i) => {
      if (i === stages.length - 1) return true;
      return age >= s.start && age < s.end;
    });
    return idx === -1 ? stages.length - 1 : idx;
  }, [stages, age]);

  const currentStage = stages[currentStageIndex];
  const nextStage = currentStageIndex < stages.length - 1 ? stages[currentStageIndex + 1] : null;

  // Upcoming milestone calculation
  const nextMilestoneConfig = nextStage ? UPCOMING_STAGE_CONFIGS[nextStage.name] : null;
  const yearsUntilNext = nextStage ? Math.max(0.1, +(nextStage.start - age).toFixed(1)) : 0;
  const monthsUntilNext = nextStage ? Math.max(1, Math.round((nextStage.start - age) * 12)) : 0;

  // Progress through current stage towards next milestone
  const currentStageProgressPct = useMemo(() => {
    if (!currentStage) return 100;
    const stageDuration = Math.max(0.1, currentStage.end - currentStage.start);
    const progressInStage = Math.max(0, Math.min(stageDuration, age - currentStage.start));
    return Math.round((progressInStage / stageDuration) * 100);
  }, [currentStage, age]);

  // Interactive preparation checklist tracker
  const [checkedShifts, setCheckedShifts] = useState<Record<string, boolean>>({});
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(true);

  const toggleShiftCheck = (key: string) => {
    setCheckedShifts(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const totalShiftsCount = nextMilestoneConfig?.careShifts.length || 0;
  const completedShiftsCount = nextMilestoneConfig 
    ? nextMilestoneConfig.careShifts.filter((_, idx) => checkedShifts[`${nextStage?.name}-${idx}`]).length 
    : 0;

  return (
    <div className="bg-white/40 dark:bg-[#282420]/40 backdrop-blur-md border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-5 md:p-6 flex flex-col gap-5">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CalendarRange className="w-4 h-4 text-[#FF6B4A]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6]">
            Breed Development Timeline & Developmental Milestones
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.67rem] text-[#8A8680] dark:text-[#9A9590] bg-white/70 dark:bg-[#1A1A1A]/70 px-2.5 py-0.5 rounded-full border border-gray-200 dark:border-zinc-700">
            Avg Lifespan: <span className="font-bold text-[#1A1A1A] dark:text-[#F0ECE6]">{breed.max} Years</span>
          </span>
          {nextStage && nextMilestoneConfig && (
            <span 
              className="font-mono text-[0.67rem] font-bold px-2 py-0.5 rounded-full border text-white flex items-center gap-1 shadow-xs"
              style={{ 
                backgroundColor: nextMilestoneConfig.themeColor,
                borderColor: nextMilestoneConfig.themeColor 
              }}
            >
              <Bell className="w-3 h-3 animate-pulse" />
              Next Milestone: {nextStage.name} (@ {nextStage.start}y)
            </span>
          )}
        </div>
      </div>

      {/* Proportional Segment Bar with Marker Pin & Next Milestone Beacon */}
      <div className="relative pt-7 pb-4">
        {/* Sliding Indicator Pin for Current Age */}
        <div
          className="absolute top-0 flex flex-col items-center -translate-x-1/2 transition-all duration-1000 ease-out z-20"
          style={{ left: `${positionPercentage}%` }}
        >
          <span className="bg-[#1A1A1A] dark:bg-[#F0ECE6] text-[#F5F0E8] dark:text-[#141210] font-mono text-[0.68rem] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap border border-black/20">
            {age < 1 ? `${age} yr (${Math.round(age * 12)} mos)` : `${age} ${age === 1 ? 'yr' : 'yrs'}`} (Current)
          </span>
          <ChevronDown className="w-4 h-4 text-[#1A1A1A] dark:text-[#F0ECE6] -mt-1 block animate-bounce" />
        </div>

        {/* Next Predicted Age Milestone Marker on Bar */}
        {nextStage && nextMilestoneConfig && (
          <div
            className="absolute -bottom-1 flex flex-col items-center -translate-x-1/2 transition-all duration-1000 z-20 pointer-events-none"
            style={{ left: `${Math.min((nextStage.start / breed.max) * 100, 98)}%` }}
          >
            <div 
              className="w-2.5 h-2.5 rotate-45 border-2 border-white shadow-xs"
              style={{ backgroundColor: nextMilestoneConfig.themeColor }}
            />
            <span 
              className="font-mono text-[0.6rem] font-bold px-1.5 py-0.2 rounded shadow-xs whitespace-nowrap text-white mt-0.5"
              style={{ backgroundColor: nextMilestoneConfig.themeColor }}
            >
              Next Milestone: {nextStage.start}y
            </span>
          </div>
        )}

        {/* Proportional Colors Bar */}
        <div className="h-5 w-full rounded-full border-2 border-[#1A1A1A] dark:border-[#F0ECE6] flex overflow-hidden shadow-sm bg-gray-200 dark:bg-[#1C1814] relative">
          {stages.map((stage) => {
            const isNext = nextStage?.name === stage.name;
            return (
              <div
                key={stage.name}
                className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-1000 relative group"
                style={{
                  width: `${stage.pct}%`,
                  backgroundColor: isNext && nextMilestoneConfig ? nextMilestoneConfig.themeColor : stage.color,
                  opacity: isNext ? 1 : 0.82,
                }}
                title={`${stage.name}: ${stage.start} to ${stage.end} yrs${isNext ? ' (Next Predicted Milestone)' : ''}`}
              >
                {/* Subtle highlight if next milestone */}
                {isNext && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
                )}
                {/* Hover detail */}
                <div className="absolute inset-0 hover:bg-white/30 dark:hover:bg-black/10 transition-colors pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend & Spans Grid with Distinct Highlighting for Current and Next Predicted Milestone */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1 text-[#1A1A1A] dark:text-[#F0ECE6]">
        {stages.map((stage) => {
          const isCurrent = age >= stage.start && age < stage.end;
          const isNext = nextStage?.name === stage.name;

          let cardStyle = 'border-dashed border-gray-300 dark:border-zinc-700 bg-transparent opacity-75';
          let badgeText = null;
          let badgeClass = '';

          if (isCurrent) {
            cardStyle = 'border-[#1A1A1A] dark:border-[#F0ECE6] bg-white/60 dark:bg-[#1E1C18]/60 shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] scale-[1.02] ring-1 ring-black/10';
            badgeText = 'Active Phase';
            badgeClass = 'bg-[#1A1A1A] dark:bg-[#F0ECE6] text-[#F5F0E8] dark:text-[#141210]';
          } else if (isNext && nextMilestoneConfig) {
            // Highlighted in different distinct milestone color
            cardStyle = `border-2 ${nextMilestoneConfig.borderClass} ${nextMilestoneConfig.darkBorderClass} ${nextMilestoneConfig.bgClass} ${nextMilestoneConfig.darkBgClass} shadow-[3px_3px_0_${nextMilestoneConfig.shadowColor}] dark:shadow-[3px_3px_0_${nextMilestoneConfig.darkShadowColor}] scale-[1.02] ring-2 ring-offset-1 ring-indigo-400/40`;
            badgeText = 'Upcoming Next';
            badgeClass = `${nextMilestoneConfig.badgeBg} text-white animate-pulse`;
          }

          return (
            <div
              key={stage.name}
              className={`p-2.5 rounded-lg border-2 flex flex-col justify-between gap-1.5 transition-all ${cardStyle}`}
            >
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                    style={{ 
                      backgroundColor: isNext && nextMilestoneConfig ? nextMilestoneConfig.themeColor : stage.color 
                    }}
                  />
                  <span className="font-bold text-xs capitalize leading-none">
                    {stage.name}
                  </span>
                </div>
                {badgeText && (
                  <span className={`text-[0.58rem] font-mono uppercase px-1.5 py-0.2 rounded-sm font-bold tracking-tight whitespace-nowrap ${badgeClass}`}>
                    {badgeText}
                  </span>
                )}
              </div>

              <div>
                <p className="font-mono text-[0.68rem] text-[#8A8680] dark:text-[#9A9590]">
                  {stage.start}–{stage.end} {stage.end === 1 ? 'yr' : 'yrs'}
                </p>
                {isNext && (
                  <p 
                    className="font-mono text-[0.62rem] font-bold mt-0.5"
                    style={{ color: nextMilestoneConfig?.themeColor }}
                  >
                    ⏳ In {yearsUntilNext} {yearsUntilNext === 1 ? 'yr' : 'yrs'} (~{monthsUntilNext} mo)
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* NOTIFICATION FEATURE: UPCOMING LIFE STAGE & CARE SHIFTS ALERT */}
      {/* ------------------------------------------------------------------ */}
      {nextStage && nextMilestoneConfig ? (
        <div 
          className={`rounded-xl border-[2.5px] p-4 md:p-5 transition-all duration-300 ${nextMilestoneConfig.borderClass} ${nextMilestoneConfig.darkBorderClass} ${nextMilestoneConfig.bgClass} ${nextMilestoneConfig.darkBgClass}`}
          style={{
            boxShadow: `4px 4px 0 ${nextMilestoneConfig.shadowColor}`
          }}
        >
          {/* Notification Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-xs relative"
                style={{ backgroundColor: nextMilestoneConfig.themeColor }}
              >
                <Bell className="w-4 h-4 animate-bounce" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border border-white animate-ping" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span 
                    className="text-[0.65rem] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded text-white"
                    style={{ backgroundColor: nextMilestoneConfig.themeColor }}
                  >
                    Upcoming Life Stage Notification
                  </span>
                  <span className="text-[0.68rem] font-mono text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Transition target: Age {nextStage.start} ({yearsUntilNext} {yearsUntilNext === 1 ? 'year' : 'years'} away)
                  </span>
                </div>
                <h4 className="text-sm md:text-base font-extrabold text-[#1A1A1A] dark:text-[#F0ECE6] mt-0.5">
                  Predicted Care Shift: Preparing for {nextStage.name} Transition
                </h4>
              </div>
            </div>

            {/* Quick Readiness Tracker */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[0.62rem] font-mono text-[#64748B] dark:text-[#94A3B8] block">
                  Care Shift Readiness
                </span>
                <span 
                  className="text-xs font-mono font-extrabold"
                  style={{ color: nextMilestoneConfig.themeColor }}
                >
                  {completedShiftsCount} of {totalShiftsCount} Preps Ready
                </span>
              </div>
              <button
                onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                className="px-2.5 py-1.5 rounded-md border border-[#1A1A1A]/30 dark:border-white/30 text-xs font-bold text-[#1A1A1A] dark:text-[#F0ECE6] bg-white/70 dark:bg-[#1E1C18]/70 hover:bg-white dark:hover:bg-[#1E1C18] transition-all flex items-center gap-1"
                aria-label={isDetailsExpanded ? 'Collapse care shifts' : 'Expand care shifts'}
              >
                <span className="text-[0.68rem] font-mono">
                  {isDetailsExpanded ? 'Hide Preps' : 'Show Preps'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDetailsExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Transition Progress Meter */}
          <div className="pt-3 pb-2 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[0.68rem] font-mono">
              <span className="text-[#64748B] dark:text-[#94A3B8]">
                Phase Progress: <strong className="text-[#1A1A1A] dark:text-[#F0ECE6]">{currentStage.name}</strong> ({currentStageProgressPct}%)
              </span>
              <span 
                className="font-bold flex items-center gap-1"
                style={{ color: nextMilestoneConfig.themeColor }}
              >
                <span>Target: {nextStage.name} at Age {nextStage.start}</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden flex">
              <div 
                className="h-full rounded-full transition-all duration-700"
                style={{ 
                  width: `${currentStageProgressPct}%`,
                  backgroundColor: nextMilestoneConfig.themeColor 
                }}
              />
            </div>
          </div>

          {/* Summary & Clinical Rationale */}
          <p className="text-xs text-[#475569] dark:text-[#CBD5E1] leading-relaxed pt-1">
            {nextMilestoneConfig.summary}{' '}
            <span className="font-semibold text-[#1A1A1A] dark:text-[#F0ECE6]">
              {nextMilestoneConfig.clinicalRationale}
            </span>
          </p>

          {/* Actionable Care Shifts Checklist */}
          {isDetailsExpanded && (
            <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: nextMilestoneConfig.themeColor }} />
                  Actionable Care Shifts to Prepare Ahead:
                </span>
                <span className="text-[0.65rem] font-mono text-[#64748B] dark:text-[#94A3B8]">
                  Click to mark steps as planned/completed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {nextMilestoneConfig.careShifts.map((shift, idx) => {
                  const checkKey = `${nextStage.name}-${idx}`;
                  const isChecked = Boolean(checkedShifts[checkKey]);

                  return (
                    <div
                      key={shift.title}
                      onClick={() => toggleShiftCheck(checkKey)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                        isChecked
                          ? 'border-[#10B981] bg-[#10B981]/10 dark:bg-[#10B981]/15 text-[#1A1A1A] dark:text-[#F0ECE6]'
                          : 'border-black/15 dark:border-white/15 bg-white/70 dark:bg-[#1E1C18]/70 hover:border-black/30 dark:hover:border-white/30 text-[#1A1A1A] dark:text-[#F0ECE6]'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 flex-shrink-0 text-gray-400 hover:text-[#10B981] transition-colors"
                        aria-label={`Toggle ${shift.title}`}
                      >
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                        ) : (
                          <div className="w-4 h-4 rounded border-2 border-gray-400 dark:border-zinc-500" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className="text-[0.62rem] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/10 text-[#64748B] dark:text-[#94A3B8]">
                            {shift.domain}
                          </span>
                          <span 
                            className={`text-[0.6rem] font-mono font-bold px-1.5 rounded ${
                              shift.priority === 'Essential'
                                ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400'
                                : shift.priority === 'High'
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                                : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                            }`}
                          >
                            {shift.priority}
                          </span>
                        </div>
                        <h5 className={`text-xs font-bold mt-1 ${isChecked ? 'line-through opacity-75' : ''}`}>
                          {shift.title}
                        </h5>
                        <p className="text-[0.68rem] text-[#64748B] dark:text-[#94A3B8] leading-tight mt-0.5">
                          {shift.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* If Dog is already in the final Elder / Golden Years stage */
        <div className="rounded-xl border-[2.5px] border-[#C75B7A] dark:border-[#F472B6] bg-rose-50/80 dark:bg-[#831843]/30 p-4 md:p-5 shadow-[4px_4px_0_#C75B7A] dark:shadow-[4px_4px_0_#F472B6]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C75B7A] flex items-center justify-center text-white flex-shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[0.65rem] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#C75B7A] text-white">
                Golden Years Care Stewardship Active
              </span>
              <h4 className="text-sm md:text-base font-extrabold text-[#1A1A1A] dark:text-[#F0ECE6] mt-0.5">
                Honoring the Sacred Twilight Chapter (Age {age} Years)
              </h4>
              <p className="text-xs text-[#475569] dark:text-[#CBD5E1] mt-1 leading-relaxed">
                Your companion has achieved full longevity milestones! Current priority care shifts emphasize palliative orthopedic comfort, twice-yearly geriatric blood/cardiac monitoring, gentle sensory enrichment, and daily quality-of-life stewardship.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sizing calibration disclaimer */}
      <p className="text-[0.68rem] italic text-[#8A8680] dark:text-[#9A9590] text-center">
        *Relative developmental thresholds are calibrated to clinical sizing standards for the {breed.name}. Large and giant breeds experience compressed adolescence and reach senior transitions up to 3 years earlier than toy companions.
      </p>
    </div>
  );
}
