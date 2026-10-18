/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Breed, DogSize, LifeStage, Milestone, TimelineStage } from './types.ts';

/**
 * Standard AVMA & AAHA veterinary clinical canine-to-human age equivalence matrix.
 * Calibrated according to canine breed size class and developmental physiology.
 */
const CANINE_HUMAN_AGE_TABLE: Record<DogSize, number[]> = {
  toy:    [0, 15, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80],
  small:  [0, 15, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80],
  medium: [0, 15, 24, 28, 32, 36, 42, 47, 51, 56, 60, 65, 69, 74, 78, 83, 87],
  large:  [0, 15, 24, 28, 33, 38, 45, 50, 55, 61, 66, 72, 77, 82, 88, 93, 99],
  giant:  [0, 12, 22, 31, 38, 45, 49, 57, 64, 71, 78, 86, 93, 101, 108, 115, 120],
};

/**
 * Calculates human age equivalence using precise AVMA / AAHA size-adjusted veterinary tables
 * with smooth piecewise linear interpolation for fractional ages.
 */
export function toHumanYears(dogAge: number, size: DogSize): number {
  if (dogAge <= 0) return 0;
  
  const table = CANINE_HUMAN_AGE_TABLE[size] || CANINE_HUMAN_AGE_TABLE.medium;
  const maxIndex = table.length - 1;

  if (dogAge <= maxIndex) {
    const lower = Math.floor(dogAge);
    const upper = Math.ceil(dogAge);
    if (lower === upper) return table[lower];
    const fraction = dogAge - lower;
    return Math.round((table[lower] + fraction * (table[upper] - table[lower])) * 10) / 10;
  }

  // Beyond index 16, extrapolate with size-adjusted annual geriatric progression rate
  const lastVal = table[maxIndex];
  const annualRate = size === 'giant' ? 7.5 : size === 'large' ? 5.5 : size === 'medium' ? 4.5 : 4.0;
  return Math.round((lastVal + (dogAge - maxIndex) * annualRate) * 10) / 10;
}

/**
 * Calculates size-specific life stage transition thresholds based on AVMA / AAHA veterinary medicine standards.
 */
export function getStageThresholds(size: DogSize, maxLife: number) {
  let puppyEnd = 0.75;
  let youngEnd = 3.5;
  let adultEnd = 9.5;
  let seniorEnd = 14;

  switch (size) {
    case 'toy':
      puppyEnd = 0.75;
      youngEnd = 3.5;
      adultEnd = 9.5; // At age 10, human age is 56 -> Senior
      seniorEnd = Math.min(maxLife - 0.5, Math.max(14, maxLife * 0.75));
      break;
    case 'small':
      puppyEnd = 0.85;
      youngEnd = 3.5;
      adultEnd = 9.5; // At age 10, human age is 56 -> Senior
      seniorEnd = Math.min(maxLife - 0.5, Math.max(13, maxLife * 0.75));
      break;
    case 'medium':
      puppyEnd = 1.0;
      youngEnd = 3.0;
      adultEnd = 7.5; // At age 8, human age is 54 -> Senior
      seniorEnd = Math.min(maxLife - 0.5, Math.max(11.5, maxLife * 0.78));
      break;
    case 'large':
      puppyEnd = 1.25;
      youngEnd = 3.0;
      adultEnd = 6.5; // At age 7, human age is 54 -> Senior
      seniorEnd = Math.min(maxLife - 0.5, Math.max(9.5, maxLife * 0.80));
      break;
    case 'giant':
      puppyEnd = 1.5;
      youngEnd = 2.5;
      adultEnd = 5.5; // At age 6, human age is 52-59 -> Senior
      seniorEnd = Math.min(maxLife - 0.5, Math.max(7.5, maxLife * 0.80));
      break;
  }

  const safePuppy = Math.min(puppyEnd, maxLife * 0.2);
  const safeYoung = Math.min(Math.max(youngEnd, safePuppy + 0.5), maxLife * 0.45);
  const safeAdult = Math.min(Math.max(adultEnd, safeYoung + 1.0), maxLife * 0.75);
  const safeSenior = Math.min(Math.max(seniorEnd, safeAdult + 1.0), maxLife * 0.92);

  return {
    puppyEnd: Math.round(safePuppy * 10) / 10,
    youngEnd: Math.round(safeYoung * 10) / 10,
    adultEnd: Math.round(safeAdult * 10) / 10,
    seniorEnd: Math.round(safeSenior * 10) / 10,
  };
}

/**
 * Categorize life stages based on veterinary size-adjusted chronological thresholds.
 */
export function getLifeStage(dogAge: number, maxLife: number, size: DogSize): LifeStage {
  const { puppyEnd, youngEnd, adultEnd, seniorEnd } = getStageThresholds(size, maxLife);

  if (dogAge <= puppyEnd) {
    return {
      name: 'Puppy',
      color: '#FF6B4A',
      textColor: 'text-[#FF6B4A]',
      icon: 'Paw',
      desc: 'Rapid growth, learning, socialization, and boundless curiosity. Every day is a grand discovery.'
    };
  }

  if (dogAge < youngEnd) {
    return {
      name: 'Young Adult',
      color: '#E5A836',
      textColor: 'text-[#E5A836]',
      icon: 'Zap',
      desc: 'Peak energy levels, absolute physical prime, and playful spirit. The world is their personal playground.'
    };
  }

  if (dogAge < adultEnd) {
    return {
      name: 'Adult',
      color: '#2D8C6F',
      textColor: 'text-[#2D8C6F]',
      icon: 'CheckCircle',
      desc: 'Settled maturity — calm, steady-minded, extremely loyal, and deeply attuned to your habits. The deepest bond is forged in this phase.'
    };
  }

  if (dogAge < seniorEnd) {
    return {
      name: 'Senior',
      color: '#B87333',
      textColor: 'text-[#B87333]',
      icon: 'HeartHandshake',
      desc: 'Accrued wisdom — peaceful pacing, deeper affection, and subtle silver graying. Time to appreciate quiet routines.'
    };
  }

  return {
    name: 'Golden Years',
    color: '#C75B7A',
    textColor: 'text-[#C75B7A]',
    icon: 'Sparkles',
    desc: 'The sacred twilight chapter — delicate care, immense gratitude, and unconditional companion love. Precious days to cuddle and hold close.'
  };
}

/**
 * Builds milestone indicators based on physiological and chronological development.
 */
export function getMilestones(breed: Breed, age: number): Milestone[] {
  const { puppyEnd, youngEnd, adultEnd, seniorEnd } = getStageThresholds(breed.size, breed.max);
  const size = breed.size;

  const isPuppyAge = age <= puppyEnd;

  if (isPuppyAge) {
    // Return precise puppy physiological pathway milestones
    return [
      {
        year: 0.1,
        icon: 'Baby',
        label: 'Neonatal & Socialization Window',
        targetPeriod: '0–8 wks',
        color: '#FF6B4A',
        achieved: age >= 0.15,
        isCurrent: age < 0.15,
        desc: 'Maternal antibody protection, sensory awakening, and early environmental fear-imprint socialization window.',
        physiologicalDetails: 'Tapering maternal colostrum antibodies, rapid neurological synapse development.',
        clinicalAction: 'Controlled positive socialization in clean environments.'
      },
      {
        year: 0.25,
        icon: 'Shield',
        label: 'Primary Core Immunization & Deworming',
        targetPeriod: '8–16 wks',
        color: '#E5A836',
        achieved: age >= 0.35,
        isCurrent: age >= 0.15 && age < 0.35,
        desc: 'Sequential DHPP (Parvovirus/Distemper) series, core Rabies booster, and internal parasite eradication.',
        physiologicalDetails: 'Active immune response generation overcoming declining maternal antibodies.',
        clinicalAction: 'Strict isolation from dog parks and public soil until 2 weeks after final booster.'
      },
      {
        year: 0.4,
        icon: 'Sparkles',
        label: 'Deciduous Teeth Eruption & Teething Phase',
        targetPeriod: '3–6 mos',
        color: '#2D8C6F',
        achieved: age >= 0.55,
        isCurrent: age >= 0.25 && age < 0.55,
        desc: 'Shedding of 28 deciduous baby teeth and emergence of 42 adult teeth. High surveillance for retained baby canines.',
        physiologicalDetails: 'Gingival remodeling and adult canine eruption beneath baby roots.',
        clinicalAction: 'Provide soft textured teething toys. Check for double-fanged retained teeth.'
      },
      {
        year: 0.6,
        icon: 'Zap',
        label: 'Rapid Skeletal & Muscle Growth Acceleration',
        targetPeriod: `2–${Math.round(puppyEnd * 12)} mos`,
        color: '#FF6B4A',
        achieved: age >= puppyEnd,
        isCurrent: age >= 0.15 && age < puppyEnd,
        desc: 'Peak linear bone elongation at open growth plates and cellular muscle accretion.',
        physiologicalDetails: 'High metabolic calcium/protein synthesis and hyperplastic growth.',
        clinicalAction: 'Feed calibrated puppy food; maintain lean growth curve to protect developing joints.'
      },
      {
        year: Math.round(puppyEnd * 10) / 10,
        icon: 'Award',
        label: 'Growth Plate Closure & Spay/Neuter Window',
        targetPeriod: `${Math.round(puppyEnd * 12)} mos`,
        color: '#E5A836',
        achieved: age >= youngEnd,
        isCurrent: age >= puppyEnd && age < youngEnd,
        desc: 'Epiphyseal growth plate ossification, hormonal maturation, and transition to adult maintenance.',
        physiologicalDetails: 'Calcification of distal radial and femoral growth plates.',
        clinicalAction: 'Consult vet regarding breed-specific spay/neuter timing and transition to adult diet.'
      }
    ];
  }

  // Adult, Senior, and Golden Years Pathway
  const steps: Milestone[] = [
    {
      year: 0.5,
      icon: 'Baby',
      label: 'Puppy Growth & Teething Transition',
      targetPeriod: '0–1 yr',
      color: '#FF6B4A',
      achieved: age >= 1.0,
      isCurrent: age < 1.0,
      desc: 'Completed primary core vaccinations, deciduous tooth shedding, and initial skeletal growth.'
    },
    {
      year: 1,
      icon: 'Award',
      label: 'First Birthday & Skeletal Maturity',
      targetPeriod: '1 yr',
      color: '#E5A836',
      achieved: age >= 1.0,
      isCurrent: age >= 1.0 && age < youngEnd,
      desc: 'Complete growth plate ossification, baseline adult weight, and full adult dentition established.'
    },
    {
      year: Math.round(youngEnd),
      icon: 'Zap',
      label: 'Young Adult Physical Prime',
      targetPeriod: `${Math.round(youngEnd)} yrs`,
      color: '#2D8C6F',
      achieved: age >= youngEnd,
      isCurrent: age >= youngEnd && age < adultEnd,
      desc: 'Peak muscular conditioning, maximum cardiovascular endurance, and stable adult immune competence.'
    },
    {
      year: Math.round(adultEnd),
      icon: 'Shield',
      label: 'Senior Transition & Organ Baseline',
      targetPeriod: `${Math.round(adultEnd)} yrs`,
      color: '#B87333',
      achieved: age >= adultEnd,
      isCurrent: age >= adultEnd && age < seniorEnd,
      desc: 'Metabolic rate slowdown, initiation of semi-annual geriatric blood panels (SDMA/kidney/liver), and joint mobility care.'
    },
    {
      year: Math.round(seniorEnd),
      icon: 'Heart',
      label: 'Golden Years Comfort & Cognitive Vitality',
      targetPeriod: `${Math.round(seniorEnd)}+ yrs`,
      color: '#C75B7A',
      achieved: age >= seniorEnd,
      isCurrent: age >= seniorEnd,
      desc: 'Palliative comfort routines, orthopedic bedding, cardiac surveillance, and cognitive enrichment.'
    },
  ];

  return steps.map(step => ({
    ...step,
    achieved: age >= step.year
  }));
}

/**
 * Computes exact timeline section divisions showing widths out of 100%.
 */
export function getTimelineStages(breed: Breed): TimelineStage[] {
  const max = breed.max;
  const { puppyEnd, youngEnd, adultEnd, seniorEnd } = getStageThresholds(breed.size, max);

  const rawStages = [
    { name: 'Puppy', start: 0, end: puppyEnd, color: '#FF6B4A' },
    { name: 'Young', start: puppyEnd, end: youngEnd, color: '#E5A836' },
    { name: 'Adult', start: youngEnd, end: adultEnd, color: '#2D8C6F' },
    { name: 'Senior', start: adultEnd, end: seniorEnd, color: '#B87333' },
    { name: 'Elder', start: seniorEnd, end: max, color: '#C75B7A' }
  ];

  return rawStages.map(stage => {
    const duration = Math.max(0.1, stage.end - stage.start);
    return {
      name: stage.name,
      start: stage.start,
      end: stage.end,
      color: stage.color,
      pct: (duration / max) * 100
    };
  });
}
