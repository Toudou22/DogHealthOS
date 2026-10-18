/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Veterinary Clinical Health & Physiological Milestone Calibration Engine.
 * Dynamically calibrates developmental milestones and breed health advisories
 * to the companion's exact chronological age and breed size archetype.
 */

import { Breed, DogSize } from '../types.ts';
import { getStageThresholds, getLifeStage } from '../utils.ts';

export interface PhysiologicalMilestone {
  id: string;
  title: string;
  targetPeriod: string;
  startAgeYears: number;
  endAgeYears: number;
  category: 'immunology' | 'dentition' | 'skeletal' | 'developmental' | 'metabolic' | 'geriatric';
  icon: string;
  color: string;
  achieved: boolean;
  isCurrent: boolean;
  physiologicalDetails: string;
  clinicalAction: string;
}

export interface AgeCalibratedDirective {
  title: string;
  category: 'immunization' | 'dentition' | 'nutrition' | 'screening' | 'orthopedic' | 'behavioral' | 'geriatric' | 'preventive';
  urgency: 'critical' | 'priority' | 'routine' | 'preventive';
  icon: string;
  headline: string;
  clinicalDescription: string;
  ownerGuideline: string;
}

export interface GeneticRiskStratification {
  condition: string;
  onsetPhase: 'Congenital / Pediatric' | 'Juvenile (Puppy)' | 'Young Adult' | 'Adult (Progressive)' | 'Senior / Geriatric';
  riskType: string;
  estimatedCost: string;
  currentRelevancy: 'critical_now' | 'active_screening' | 'early_prevention' | 'monitoring';
  relevancyBadge: string;
  relevancyColor: string;
  description: string;
  ageSpecificAction: string;
}

export interface AgeCalibratedHealthProfile {
  ageYears: number;
  ageMonths: number;
  stageName: string;
  stageBadgeText: string;
  calibrationSubtitle: string;
  isPuppy: boolean;
  isYoungAdult: boolean;
  isAdult: boolean;
  isSenior: boolean;
  isElder: boolean;
  immediateDirectives: AgeCalibratedDirective[];
  geneticWatchlist: GeneticRiskStratification[];
  growthNote: string;
}

/**
 * Returns comprehensive, physiologically accurate developmental milestones
 * for a dog based on their breed size and current age.
 */
export function getPhysiologicalMilestones(breed: Breed, ageYears: number): PhysiologicalMilestone[] {
  const { puppyEnd, youngEnd, adultEnd, seniorEnd } = getStageThresholds(breed.size, breed.max);
  const size = breed.size;

  // Calibration points for size classes
  const puppyMonths = puppyEnd * 12;
  const growthPlateCloseYear = size === 'toy' || size === 'small' ? 0.75 : size === 'medium' ? 1.0 : size === 'large' ? 1.25 : 1.5;
  const teethingEndYear = 0.55; // ~6.5 months across all breeds

  const allMilestones: PhysiologicalMilestone[] = [
    {
      id: 'neonatal_social',
      title: 'Neonatal Sensory Awakening & Socialization Window',
      targetPeriod: '0 – 12 Weeks (0 – 0.25 Yrs)',
      startAgeYears: 0,
      endAgeYears: 0.25,
      category: 'developmental',
      icon: 'Baby',
      color: '#FF6B4A',
      achieved: ageYears >= 0.25,
      isCurrent: ageYears < 0.25,
      physiologicalDetails: 'Rapid neurological reflex development, eyelid and auditory canal opening, tapering of maternal colostrum antibodies, and the critical early socialization fear-imprint window (weeks 3 to 14).',
      clinicalAction: 'Introduce gentle novel household textures, sounds, and controlled positive human interactions while under maternal immunity.'
    },
    {
      id: 'core_vaccines',
      title: 'Primary Core Immunization & Parasite Defense',
      targetPeriod: '6 – 16 Weeks (0.15 – 0.35 Yrs)',
      startAgeYears: 0.15,
      endAgeYears: 0.35,
      category: 'immunology',
      icon: 'Shield',
      color: '#E5A836',
      achieved: ageYears >= 0.35,
      isCurrent: ageYears >= 0.15 && ageYears < 0.35,
      physiologicalDetails: 'Sequential DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza) booster series every 3–4 weeks to safely overcome declining maternal antibodies, followed by core Rabies vaccination and broad-spectrum internal deworming.',
      clinicalAction: 'Strict quarantine from public dog parks and unvaccinated canines until 10–14 days following the final 16-week booster series.'
    },
    {
      id: 'deciduous_teething',
      title: 'Deciduous (Baby) Teeth Eruption & Transition',
      targetPeriod: '12 – 26 Weeks (3 – 6.5 Mos)',
      startAgeYears: 0.25,
      endAgeYears: teethingEndYear,
      category: 'dentition',
      icon: 'Sparkles',
      color: '#2D8C6F',
      achieved: ageYears >= teethingEndYear,
      isCurrent: ageYears >= 0.25 && ageYears < teethingEndYear,
      physiologicalDetails: `Shedding of 28 needle-sharp deciduous teeth and eruption of 42 permanent adult teeth. ${size === 'toy' || size === 'small' ? 'High clinical risk for retained deciduous canine teeth causing double-fanged overcrowding and early periodontal tartar in toy/small jaws.' : 'Rapid jawbone elongation and gum tissue remodeling.'}`,
      clinicalAction: 'Provide soft pliable rubber teething toys (avoid hard antlers). Inspect incisors and canines weekly to ensure baby teeth fall out when adult teeth emerge.'
    },
    {
      id: 'growth_acceleration',
      title: 'Rapid Skeletal & Lean Muscle Growth Phase',
      targetPeriod: `2 – ${Math.round(puppyMonths)} Months (0.15 – ${puppyEnd} Yrs)`,
      startAgeYears: 0.15,
      endAgeYears: puppyEnd,
      category: 'skeletal',
      icon: 'Zap',
      color: '#FF6B4A',
      achieved: ageYears >= puppyEnd,
      isCurrent: ageYears >= 0.15 && ageYears < puppyEnd,
      physiologicalDetails: `Hyperplastic cellular proliferation, long-bone elongation at the epiphyseal physes, and high metabolic protein-calcium synthesis. ${size === 'large' || size === 'giant' ? 'Requires strictly controlled calcium/phosphorus ratios to prevent developmental orthopedic diseases (hip dysplasia, osteochondrosis).' : 'Rapid toy metabolism requires nutrient-dense, calorie-concentrated puppy formulas to prevent juvenile hypoglycemia.'}`,
      clinicalAction: 'Feed calibrated age/size puppy formulation; weigh bi-weekly to adjust daily portion allocations based on target adult curves.'
    },
    {
      id: 'growth_plate_closure',
      title: 'Growth Plate Ossification & Adult Baseline',
      targetPeriod: `${Math.round(growthPlateCloseYear * 12)} – ${Math.round(youngEnd * 12)} Months (${growthPlateCloseYear} – ${youngEnd} Yrs)`,
      startAgeYears: growthPlateCloseYear,
      endAgeYears: youngEnd,
      category: 'skeletal',
      icon: 'Award',
      color: '#E5A836',
      achieved: ageYears >= youngEnd,
      isCurrent: ageYears >= growthPlateCloseYear && ageYears < youngEnd,
      physiologicalDetails: 'Cartilaginous epiphyseal growth plates calcify into solid bone. Reproductive endocrine stabilization, final adult coat development, and establishment of adult resting metabolic rate.',
      clinicalAction: 'Gradual transition from puppy to adult formulation. Consult your vet regarding the ideal breed-specific timing for spay/neuter surgery.'
    },
    {
      id: 'adult_peak_prime',
      title: 'Musculoskeletal Prime & Periodontal Maintenance',
      targetPeriod: `${Math.round(youngEnd)} – ${Math.round(adultEnd)} Years`,
      startAgeYears: youngEnd,
      endAgeYears: adultEnd,
      category: 'metabolic',
      icon: 'CheckCircle',
      color: '#2D8C6F',
      achieved: ageYears >= adultEnd,
      isCurrent: ageYears >= youngEnd && ageYears < adultEnd,
      physiologicalDetails: 'Peak bone mineral density, maximum cardiovascular endurance, and stable adult immune competence. Subgingival plaque and calculus accumulation begin accelerating without active oral hygiene.',
      clinicalAction: 'Daily enzymatic teeth brushing, annual wellness physicals with heartworm/tick titer panels, and strict portion control to avoid mid-life obesity.'
    },
    {
      id: 'senior_organ_shift',
      title: 'Senior Metabolic & Organ Reserve Surveillance',
      targetPeriod: `${Math.round(adultEnd)} – ${Math.round(seniorEnd)} Years`,
      startAgeYears: adultEnd,
      endAgeYears: seniorEnd,
      category: 'geriatric',
      icon: 'HeartHandshake',
      color: '#B87333',
      achieved: ageYears >= seniorEnd,
      isCurrent: ageYears >= adultEnd && ageYears < seniorEnd,
      physiologicalDetails: 'Basal metabolic rate decreases by 10–20%; progressive loss of articular cartilage cushioning in weight-bearing joints; early onset of benign lens nuclear sclerosis; gradual decline in nephron filtration rate.',
      clinicalAction: 'Switch to semi-annual veterinary wellness exams with comprehensive senior blood panels (SDMA, BUN, Creatinine, ALT, ALP), blood pressure screening, and joint mobility supplements.'
    },
    {
      id: 'golden_vitality',
      title: 'Golden Years Comfort & Cognitive Vitality',
      targetPeriod: `${Math.round(seniorEnd)}+ Years`,
      startAgeYears: seniorEnd,
      endAgeYears: breed.max + 2,
      category: 'geriatric',
      icon: 'Sparkles',
      color: '#C75B7A',
      achieved: ageYears >= breed.max,
      isCurrent: ageYears >= seniorEnd,
      physiologicalDetails: 'Advanced geriatric phase requiring delicate thermal regulation, cognitive dysfunction syndrome (CDS) vigilance, heart murmur (valvular disease) surveillance, and palliative pain management.',
      clinicalAction: 'Provide orthopedic memory foam bedding, non-slip floor runners, ramps for furniture/cars, easily digestible high-quality protein, and cognitive enrichment puzzles.'
    }
  ];

  return allMilestones;
}

/**
 * Computes deeply age-calibrated health directives and stratifies genetic breed vulnerabilities
 * according to the exact current age of the dog.
 */
export function getAgeCalibratedHealthGuidance(breed: Breed, ageYears: number): AgeCalibratedHealthProfile {
  const ageMonths = Math.round(ageYears * 12 * 10) / 10;
  const { puppyEnd, youngEnd, adultEnd, seniorEnd } = getStageThresholds(breed.size, breed.max);
  const stage = getLifeStage(ageYears, breed.max, breed.size);
  const size = breed.size;
  const breedName = breed.name;

  const isPuppy = ageYears <= puppyEnd;
  const isYoungAdult = ageYears > puppyEnd && ageYears < youngEnd;
  const isAdult = ageYears >= youngEnd && ageYears < adultEnd;
  const isSenior = ageYears >= adultEnd && ageYears < seniorEnd;
  const isElder = ageYears >= seniorEnd;

  let stageBadgeText = '';
  let calibrationSubtitle = '';

  if (isPuppy) {
    stageBadgeText = `PUPPY STAGE (Age: ${ageYears} Yrs / ${ageMonths} Months)`;
    calibrationSubtitle = `Active Developmental Focus & Pediatric Care Calibration for ${breedName} Puppy`;
  } else if (isYoungAdult) {
    stageBadgeText = `YOUNG ADULT STAGE (Age: ${ageYears} Yrs)`;
    calibrationSubtitle = `Physical Prime, Habituation & Structural Health for Young ${breedName}`;
  } else if (isAdult) {
    stageBadgeText = `MATURE ADULT STAGE (Age: ${ageYears} Yrs)`;
    calibrationSubtitle = `Adult Longevity Maintenance, Organ Protection & Dental Care for ${breedName}`;
  } else if (isSenior) {
    stageBadgeText = `SENIOR STAGE (Age: ${ageYears} Yrs)`;
    calibrationSubtitle = `Geriatric Health Surveillance & Joint/Organ Longevity Protocols for Senior ${breedName}`;
  } else {
    stageBadgeText = `GOLDEN YEARS (Age: ${ageYears} Yrs)`;
    calibrationSubtitle = `Palliative Comfort, Cognitive Health & Gentle Longevity Care for Geriatric ${breedName}`;
  }

  // 1. Build Immediate Age-Specific Care Directives
  const immediateDirectives: AgeCalibratedDirective[] = [];

  if (isPuppy) {
    // Core Vaccination & Quarantine Safety
    immediateDirectives.push({
      title: 'Primary Core Immunization & Deworming Protocol',
      category: 'immunization',
      urgency: 'critical',
      icon: 'Shield',
      headline: 'Active DHPP & Parvovirus Protection Window',
      clinicalDescription: 'Maternal antibodies fade between 6 and 14 weeks of age. Complete the 3-dose DHPP (Distemper/Parvo) vaccination cycle and Rabies booster.',
      ownerGuideline: 'Maintain strict outdoor quarantine from public dog parks and soil frequented by strange dogs until 2 weeks after final puppy boosters.'
    });

    // Deciduous Teething & Retained Canines
    immediateDirectives.push({
      title: 'Deciduous Teeth Eruption & Teething Management',
      category: 'dentition',
      urgency: 'priority',
      icon: 'Sparkles',
      headline: 'Baby-to-Adult Tooth Transition (3–6 Months)',
      clinicalDescription: size === 'toy' || size === 'small' || breedName.includes('Terrier') || breedName.includes('Chihuahua')
        ? 'Toy and small puppies frequently fail to shed deciduous baby canine teeth (retained teeth), causing double fangs, food entrapment, and painful bite misalignment.'
        : 'Permanent teeth begin erupting under baby roots around 12–16 weeks. Gums will be tender and inflamed.',
      ownerGuideline: 'Inspect your puppy’s mouth weekly. Provide chilled textured rubber teething toys (no cooked bones or hard antlers). If baby canines remain past 6 months, have your vet extract them during spay/neuter.'
    });

    // Juvenile Hypoglycemia (especially crucial for Toy/Small breeds like Yorkie, Chihuahua, Maltese, Pomeranian)
    if (size === 'toy' || size === 'small') {
      immediateDirectives.push({
        title: 'Juvenile Hypoglycemia Emergency Protocol',
        category: 'nutrition',
        urgency: 'critical',
        icon: 'Zap',
        headline: 'Fragile Hepatic Glycogen Reserves in Toy Puppies',
        clinicalDescription: 'Toy puppies under 6–8 months have minimal muscle mass and tiny liver glycogen stores. Skipping even one meal, chilling, or intense stress can trigger sudden hypoglycemic shock.',
        ownerGuideline: 'Feed 3 to 4 small, high-calorie meals spaced evenly throughout the day. Keep a tube of Nutri-Cal gel, honey, or Karo syrup handy; rub a pea-sized drop on gums immediately if the puppy appears wobbly or lethargic.'
      });
    }

    // Pediatric Congenital Screening (Liver Shunt / Heart)
    const hasShuntRisk = breed.health.some(h => h.toLowerCase().includes('shunt') || h.toLowerCase().includes('portosystemic'));
    if (hasShuntRisk) {
      immediateDirectives.push({
        title: 'Congenital Portosystemic Shunt (PSS) Pre-Surgical Screen',
        category: 'screening',
        urgency: 'priority',
        icon: 'HeartPulse',
        headline: 'Pediatric Liver Function Check Before Anesthesia',
        clinicalDescription: `${breedName} has a documented genetic susceptibility to congenital extrahepatic liver shunts, where blood bypasses the liver without proper detoxification.`,
        ownerGuideline: 'Request a pre-prandial and post-prandial serum bile acids blood test from your veterinarian before your puppy undergoes general anesthesia for spay/neuter surgery.'
      });
    }

    // Skeletal & Growth Plate Protection
    immediateDirectives.push({
      title: 'Open Epiphyseal Growth Plate Protection',
      category: 'orthopedic',
      urgency: 'preventive',
      icon: 'Award',
      headline: 'Prevent High-Impact Joint Trauma in Developing Puppies',
      clinicalDescription: 'Long bone growth plates remain soft and cartilaginous throughout early puppyhood, making them susceptible to shear fractures and asymmetric angular limb deformities.',
      ownerGuideline: 'Prevent your puppy from leaping off elevated beds, couches, or vehicle steps. Use puppy gates and provide traction rugs on slick hardwood/tile floors.'
    });

    // Bully / Pitbull Breed Juvenile Skin Watch
    if (breedName.includes('Pit Bull') || breedName.includes('Pitbull') || breedName.includes('Staffordshire')) {
      immediateDirectives.push({
        title: 'Juvenile Demodex & Skin Barrier Surveillance',
        category: 'preventive',
        urgency: 'priority',
        icon: 'Shield',
        headline: 'Early Follicular Skin & Allergy Checks',
        clinicalDescription: 'Bully puppies have sensitive skin barriers and may display transient localized Demodex mite flaring around eyes and muzzle as immunity matures.',
        ownerGuideline: 'Check muzzle and paws weekly for patchy hair thinning or dry flakes. Modern veterinary isoxazoline flea/tick/mite prevention provides safe, effective protection.'
      });
    }

  } else if (isYoungAdult) {
    // Young Adult priorities
    immediateDirectives.push({
      title: 'Structural Alignment & Patellar / Joint Evaluation',
      category: 'orthopedic',
      urgency: 'priority',
      icon: 'Award',
      headline: 'Peak Physical Conditioning & Kneecap Stability',
      clinicalDescription: 'As full adult muscle mass sets in, hereditary orthopedic traits like medial patellar luxation or hip/elbow laxity become physically gradable on clinical palpation.',
      ownerGuideline: 'Ask your veterinarian to palpate patellar grooves at your annual physical. Maintain lean body weight to minimize ligamentous shear forces.'
    });

    // Bully / Pitbull Breed Cruciate Ligament Care
    if (breedName.includes('Pit Bull') || breedName.includes('Pitbull') || breedName.includes('Staffordshire')) {
      immediateDirectives.push({
        title: 'Cruciate Ligament & Stifle Joint Conditioning',
        category: 'orthopedic',
        urgency: 'priority',
        icon: 'Award',
        headline: 'Guard High-Torque Knees in Muscular Athletic Dogs',
        clinicalDescription: 'High-drive, athletic muscular terrier builds exert intense torque on the stifle joints, increasing the statistical incidence of cranial cruciate ligament (CCL) strain.',
        ownerGuideline: 'Warm up before vigorous sprinting, avoid sudden sharp pivot catches on wet grass, and keep body condition strictly lean (BCS 4.5/9).'
      });
    }

    // Tracheal Protection (Toy/Small breeds)
    if (size === 'toy' || size === 'small' || breedName.includes('Yorkshire') || breedName.includes('Chihuahua') || breedName.includes('Pomeranian')) {
      immediateDirectives.push({
        title: 'Tracheal Cartilage Protection (Harness Habituation)',
        category: 'preventive',
        urgency: 'priority',
        icon: 'Shield',
        headline: 'Prevent Mechanical Trauma to Delicate Tracheal Rings',
        clinicalDescription: 'Repeated pulling on standard neck collars damages the cartilaginous C-rings of the trachea, accelerating progressive tracheal collapse in adulthood.',
        ownerGuideline: 'Always attach walking leashes to a padded Y-shaped chest harness, never to a neck collar. Use a flat breakaway collar exclusively for ID tags.'
      });
    }

    // Oral Hygiene Foundation
    immediateDirectives.push({
      title: 'Daily Periodontal Plaque Defense Routine',
      category: 'dentition',
      urgency: 'routine',
      icon: 'Sparkles',
      headline: 'Establish Daily Enzymatic Tooth Brushing',
      clinicalDescription: 'Plague biofilms mineralize into hard subgingival calculus in as little as 48 hours, initiating periodontal bone loss and systemic bacteremia.',
      ownerGuideline: 'Brush daily using a soft finger brush with poultry/malt-flavored enzymatic canine toothpaste. Schedule your companion’s first professional dental cleaning baseline.'
    });

  } else if (isAdult) {
    // Mature Adult priorities
    immediateDirectives.push({
      title: 'Metabolic Weight & Body Condition Score (BCS) Control',
      category: 'nutrition',
      urgency: 'priority',
      icon: 'Zap',
      headline: 'Counteract Adult Metabolic Slowdown',
      clinicalDescription: 'Metabolic burn rate gradually tapers in mature adulthood. Maintaining a lean BCS (4 to 5 out of 9) has been proven to extend companion lifespan by up to 1.8–2.0 years.',
      ownerGuideline: 'Measure kibble portions accurately with a gram scale or standard cup. Use healthy crunchy vegetables (carrots, green beans) as low-calorie training treats.'
    });

    immediateDirectives.push({
      title: 'Annual Organ Chemistry & Cardiopulmonary Screening',
      category: 'screening',
      urgency: 'priority',
      icon: 'HeartPulse',
      headline: 'Comprehensive Blood & Cardiac Auscultation Baseline',
      clinicalDescription: 'Mid-life is the ideal window to establish individual baseline biochemistry (ALT, SDMA, BUN) and listen for early systolic murmurs or respiratory changes.',
      ownerGuideline: 'Schedule an annual comprehensive wellness visit including CBC, complete blood chemistry, and fecal/heartworm antigen verification.'
    });

    immediateDirectives.push({
      title: 'Subgingival Dental Prophylaxis & Periodontal Guard',
      category: 'dentition',
      urgency: 'routine',
      icon: 'Sparkles',
      headline: 'Prevent Periodontal Pocketing & Root Absorption',
      clinicalDescription: 'Periodontal disease affects over 80% of adult companion dogs, leading to systemic bacterial seeding of the heart valves and kidneys.',
      ownerGuideline: 'Have your veterinarian perform full oral examinations under anesthesia with dental radiography to assess bone density around tooth roots.'
    });

  } else {
    // Senior & Elder priorities
    immediateDirectives.push({
      title: 'Semi-Annual Geriatric Organ & Kidney Function Profile',
      category: 'geriatric',
      urgency: 'critical',
      icon: 'HeartPulse',
      headline: 'Bi-Annual SDMA & Renal/Hepatic Screening',
      clinicalDescription: 'Organ reserve declines progressively in senior years. The SDMA biomarker detects renal insufficiency when as little as 25–40% of kidney function is impaired (vs 75% for standard creatinine).',
      ownerGuideline: 'Shift from annual to bi-annual veterinary examinations. Run senior wellness blood panels, urinalysis (for microalbuminuria), and blood pressure checks.'
    });

    immediateDirectives.push({
      title: 'Arthritic Pain Management & Orthopedic Environmental Ramps',
      category: 'orthopedic',
      urgency: 'priority',
      icon: 'Award',
      headline: 'Maintain Mobility & Joint Comfort',
      clinicalDescription: 'Cartilage matrix thinning causes chronic osteoarthritic discomfort, subtle morning stiffness, and reluctance to jump or climb stairs.',
      ownerGuideline: 'Place supportive ramps near vehicles/beds, lay non-slip rugs across slick hardwood pathways, and discuss modern multimodal therapies (Omega-3 EPA/DHA, Adequan injections, Librela) with your vet.'
    });

    immediateDirectives.push({
      title: 'Cognitive Enrichment & Sensory Night-Lighting',
      category: 'behavioral',
      urgency: 'routine',
      icon: 'Sparkles',
      headline: 'Combat Canine Cognitive Dysfunction (CDS)',
      clinicalDescription: 'Senior brains experience oxidative stress and beta-amyloid deposition, manifesting as nighttime pacing, disorientation, or altered sleep cycles.',
      ownerGuideline: 'Place gentle nightlights in hallways near water bowls and bedding. Keep daily routines consistent and provide low-stress snuffle mats for mental stimulation.'
    });
  }

  // 2. Map Breed Genetic Health Vulnerabilities with Exact Age-Onset Stratification
  const geneticWatchlist: GeneticRiskStratification[] = breed.health.map((issue) => {
    const lower = issue.toLowerCase();
    let onsetPhase: GeneticRiskStratification['onsetPhase'] = 'Adult (Progressive)';
    let riskType = 'Diagnostic & Care';
    let estimatedCost = '$350 – $1,200';
    let currentRelevancy: GeneticRiskStratification['currentRelevancy'] = 'monitoring';
    let relevancyBadge = '🛡️ Lifelong Surveillance';
    let relevancyColor = 'text-stone-600 bg-stone-100 dark:bg-stone-800 dark:text-stone-300';
    let description = 'Statistical genetic liability documented in veterinary breed registries.';
    let ageSpecificAction = 'Discuss regular clinical surveillance with your veterinarian during annual physical checkups.';

    // Hypoglycemia
    if (lower.includes('hypoglycemia')) {
      onsetPhase = 'Juvenile (Puppy)';
      riskType = 'Metabolic Emergency';
      estimatedCost = '$250 – $950 / incident';
      description = 'Low blood glucose caused by immature liver glycogen storage and high metabolic rate in toy/miniature breeds.';
      if (isPuppy) {
        currentRelevancy = 'critical_now';
        relevancyBadge = '⚡ CRITICAL ACTIVE RISK (Puppy Phase)';
        relevancyColor = 'text-rose-700 bg-rose-100 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-800';
        ageSpecificAction = 'Feed 3-4 small, calorie-dense puppy meals daily. Keep Karo syrup or Nutri-Cal immediately accessible in case of lethargy or wobbliness.';
      } else {
        currentRelevancy = 'early_prevention';
        relevancyBadge = '✅ Stabilized Post-Puppyhood';
        relevancyColor = 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/70 dark:text-emerald-300';
        ageSpecificAction = 'Rare in healthy adults unless triggered by prolonged fasting, extreme exertion, or underlying endocrine disorder.';
      }
    }
    // Portosystemic Shunt (Liver Shunt)
    else if (lower.includes('shunt') || lower.includes('portosystemic')) {
      onsetPhase = 'Congenital / Pediatric';
      riskType = 'Vascular Pathology';
      estimatedCost = '$2,500 – $7,500';
      description = 'Abnormal vascular connection allowing portal blood to bypass liver detox filtering, leading to neurotoxin buildup (ammonia).';
      if (isPuppy) {
        currentRelevancy = 'active_screening';
        relevancyBadge = '⚠️ ACTIVE PEDIATRIC SCREENING WINDOW';
        relevancyColor = 'text-amber-700 bg-amber-100 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800';
        ageSpecificAction = 'Watch for post-meal pacing, head pressing, or poor weight gain. Request pre- and post-prandial serum bile acid tests before puppy spay/neuter surgery.';
      } else if (isYoungAdult) {
        currentRelevancy = 'early_prevention';
        relevancyBadge = '🔍 Clinical Rule-Out Phase';
        relevancyColor = 'text-sky-700 bg-sky-100 dark:bg-sky-950/70 dark:text-sky-300';
        ageSpecificAction = 'If asymptomatic through young adulthood with normal liver enzymes, congenital extrahepatic shunt is statistically unlikely.';
      } else {
        currentRelevancy = 'monitoring';
        relevancyBadge = '🛡️ Routine Hepatic Screening';
        relevancyColor = 'text-stone-700 bg-stone-100 dark:bg-stone-800 dark:text-stone-300';
        ageSpecificAction = 'Monitor routine ALT/ALP liver panels during senior wellness checkups.';
      }
    }
    // Tracheal Collapse
    else if (lower.includes('tracheal') || lower.includes('collapse')) {
      onsetPhase = 'Adult (Progressive)';
      riskType = 'Respiratory Airway';
      estimatedCost = '$800 – $4,500';
      description = 'Weakening of tracheal hyaline cartilage rings, causing mechanical airway flattening, honking cough, and respiratory distress.';
      if (isPuppy) {
        currentRelevancy = 'early_prevention';
        relevancyBadge = '🛡️ EARLY HABITUATION & PREVENTION';
        relevancyColor = 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
        ageSpecificAction = 'Train puppy exclusively on a chest harness from day one. Never attach walking leashes to neck collars to prevent micro-trauma to young cartilage rings.';
      } else if (isAdult || isSenior) {
        currentRelevancy = 'critical_now';
        relevancyBadge = '⚠️ ACTIVE CLINICAL SURVEILLANCE';
        relevancyColor = 'text-amber-700 bg-amber-100 dark:bg-amber-950/70 dark:text-amber-300';
        ageSpecificAction = 'Watch for "goose-honk" coughing during excitement or excitement in humid weather. Maintain strict lean weight and use home air humidifiers.';
      } else {
        currentRelevancy = 'monitoring';
        relevancyBadge = '🛡️ Harness-Only Protocol';
        relevancyColor = 'text-sky-700 bg-sky-100 dark:bg-sky-950/70 dark:text-sky-300';
        ageSpecificAction = 'Avoid neck leashes; keep home smoke- and irritant-free.';
      }
    }
    // Patellar Luxation
    else if (lower.includes('patellar') || lower.includes('luxat')) {
      onsetPhase = 'Young Adult';
      riskType = 'Orthopedic Joint';
      estimatedCost = '$1,500 – $5,500 / knee';
      description = 'Shallow femoral trochlear groove allowing the kneecap (patella) to slip medially or laterally out of alignment.';
      if (isPuppy) {
        currentRelevancy = 'early_prevention';
        relevancyBadge = '🔍 JUVENILE ORTHOPEDIC SCREENING';
        relevancyColor = 'text-sky-700 bg-sky-100 dark:bg-sky-950/70 dark:text-sky-300 border-sky-300 dark:border-sky-800';
        ageSpecificAction = 'Have vet palpate knees at 4- and 6-month puppy visits. Avoid high-impact furniture jumping and provide non-slip traction on slick floors.';
      } else if (isYoungAdult || isAdult) {
        currentRelevancy = 'critical_now';
        relevancyBadge = '⚡ ACTIVE MONITORING & GRADING';
        relevancyColor = 'text-amber-700 bg-amber-100 dark:bg-amber-950/70 dark:text-amber-300';
        ageSpecificAction = 'Watch for sudden rear-leg "skipping" or intermittent bunny-hopping gait. Grade I/II managed conservatively; Grade III/IV may require surgical sulcoplasty.';
      } else {
        currentRelevancy = 'monitoring';
        relevancyBadge = '🛡️ Joint Arthritis Maintenance';
        relevancyColor = 'text-stone-700 bg-stone-100 dark:bg-stone-800 dark:text-stone-300';
        ageSpecificAction = 'Provide daily joint chondroprotectants (Glucosamine, Chondroitin, Omega-3 EPA/DHA) to manage secondary osteoarthritic wear.';
      }
    }
    // Hip/Elbow Dysplasia
    else if (lower.includes('dysplasia')) {
      onsetPhase = 'Juvenile (Puppy)';
      riskType = 'Surgical Orthopedics';
      estimatedCost = '$3,500 – $7,500';
      description = 'Abnormal coxofemoral joint laxity and incongruity leading to progressive degenerative joint disease.';
      if (isPuppy) {
        currentRelevancy = 'critical_now';
        relevancyBadge = '⚡ CRITICAL GROWTH PHASE MANAGEMENT';
        relevancyColor = 'text-rose-700 bg-rose-100 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-800';
        ageSpecificAction = 'Avoid over-nutrition and rapid weight gain spikes. Keep puppy lean and avoid repetitive high-impact stairs or forced jogging before growth plates close.';
      } else {
        currentRelevancy = 'monitoring';
        relevancyBadge = '🛡️ Mobility & Weight Control';
        relevancyColor = 'text-stone-700 bg-stone-100 dark:bg-stone-800 dark:text-stone-300';
        ageSpecificAction = 'Maintain lean body condition score (BCS 4/9) and provide therapeutic joint supplementation and low-impact swimming/walking.';
      }
    }
    // Eye conditions (PRA, Cataracts, Glaucoma)
    else if (lower.includes('atrophy') || lower.includes('cataract') || lower.includes('glaucoma') || lower.includes('eye') || lower.includes('retinal')) {
      onsetPhase = 'Adult (Progressive)';
      riskType = 'Specialty Ophthalmology';
      estimatedCost = '$1,800 – $4,200';
      description = 'Progressive degeneration of retinal photoreceptor cells or clouding of crystalline lens fibers.';
      if (isPuppy) {
        currentRelevancy = 'early_prevention';
        relevancyBadge = '🛡️ Parental Genetic DNA Clearance';
        relevancyColor = 'text-stone-700 bg-stone-100 dark:bg-stone-800 dark:text-stone-300';
        ageSpecificAction = 'Verify parent DNA testing (e.g. prcd-PRA clearance from breeder). Protect eyes from direct foreign object trauma.';
      } else if (isSenior || isElder) {
        currentRelevancy = 'critical_now';
        relevancyBadge = '⚠️ ACTIVE OPHTHALMIC SURVEILLANCE';
        relevancyColor = 'text-amber-700 bg-amber-100 dark:bg-amber-950/70 dark:text-amber-300';
        ageSpecificAction = 'Schedule annual ophthalmic fundic exams. Distinguish normal bluish lens haze (nuclear sclerosis) from true vision-obstructing cataracts.';
      } else {
        currentRelevancy = 'monitoring';
        relevancyBadge = '🛡️ Annual Eye Exam';
        relevancyColor = 'text-sky-700 bg-sky-100 dark:bg-sky-950/70 dark:text-sky-300';
        ageSpecificAction = 'Check eyes during annual veterinary exam for cornea clarity, tear production, and pupil symmetry.';
      }
    }
    // Cardiac (Cardiomyopathy, MVD, Subaortic Stenosis)
    else if (lower.includes('cardio') || lower.includes('heart') || lower.includes('mitral') || lower.includes('stenosis')) {
      onsetPhase = 'Adult (Progressive)';
      riskType = 'Chronic Cardiology Care';
      estimatedCost = '$1,500 – $3,500 / yr';
      description = 'Valvular fibroblastic proliferation or myocardial thinning impacting cardiac output and systemic circulation.';
      if (isPuppy) {
        currentRelevancy = 'active_screening';
        relevancyBadge = '🔍 Congenital Murmur Check';
        relevancyColor = 'text-sky-700 bg-sky-100 dark:bg-sky-950/70 dark:text-sky-300';
        ageSpecificAction = 'Auscultate for innocent vs congenital puppy murmurs (e.g. PDA, subaortic stenosis) at each vaccination visit.';
      } else if (isSenior || isElder) {
        currentRelevancy = 'critical_now';
        relevancyBadge = '⚠️ ACTIVE CARDIAC MONITORING';
        relevancyColor = 'text-rose-700 bg-rose-100 dark:bg-rose-950/70 dark:text-rose-300';
        ageSpecificAction = 'Track resting sleeping respiratory rate at home (normal is under 30 breaths/min). Schedule echocardiograms if murmurs progress.';
      } else {
        currentRelevancy = 'monitoring';
        relevancyBadge = '🛡️ Annual Cardiac Auscultation';
        relevancyColor = 'text-stone-700 bg-stone-100 dark:bg-stone-800 dark:text-stone-300';
        ageSpecificAction = 'Have your vet listen closely to heart valves at each annual examination.';
      }
    }
    // Cranial Cruciate Ligament (CCL / ACL) Tears
    else if (lower.includes('cruciate') || lower.includes('ligament') || lower.includes('ccl')) {
      onsetPhase = 'Young Adult';
      riskType = 'Orthopedic Surgery';
      estimatedCost = '$3,200 – $6,500 (TPLO surgery)';
      description = 'Rupture or chronic partial tear of the cranial cruciate joint ligament under high athletic torque and tibial plateau angle.';
      if (isPuppy) {
        currentRelevancy = 'early_prevention';
        relevancyBadge = '🛡️ Growth Plate & Joint Conditioning';
        relevancyColor = 'text-sky-700 bg-sky-100 dark:bg-sky-950/70 dark:text-sky-300';
        ageSpecificAction = 'Avoid repetitive high-impact jumping, hard pivot turns, or frisbee leaping before 14-16 months when growth plates fully ossify.';
      } else if (isYoungAdult || isAdult) {
        currentRelevancy = 'critical_now';
        relevancyBadge = '⚡ HIGH-RISK ATHLETIC SURVEILLANCE';
        relevancyColor = 'text-amber-700 bg-amber-100 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800';
        ageSpecificAction = 'Watch for acute non-weight-bearing hindlimb lameness or "toe-touching" after play. Maintain strict lean weight; excess body fat doubles CCL rupture frequency.';
      } else {
        currentRelevancy = 'monitoring';
        relevancyBadge = '🛡️ Stifle Stability & Joint Supplements';
        relevancyColor = 'text-stone-700 bg-stone-100 dark:bg-stone-800 dark:text-stone-300';
        ageSpecificAction = 'Maintain daily Omega-3 fatty acids and joint protectants; dogs with one CCL tear have a 40-60% chance of tearing the opposite knee.';
      }
    }
    // Demodectic Mange, Dermatitis & Atopic Skin Allergies
    else if (lower.includes('demodectic') || lower.includes('mange') || lower.includes('allerg') || lower.includes('atopic') || lower.includes('dermatitis')) {
      onsetPhase = isPuppy ? 'Juvenile (Puppy)' : 'Young Adult';
      riskType = 'Dermatology & Immunology';
      estimatedCost = '$400 – $1,800 / yr';
      description = 'Immune-mediated Demodex canis proliferation in juveniles or environmental pollen/dust atopic dermatitis in adults causing pruritus and alopecia.';
      if (isPuppy) {
        currentRelevancy = 'critical_now';
        relevancyBadge = '⚡ JUVENILE DEMODEX WATCH WINDOW';
        relevancyColor = 'text-rose-700 bg-rose-100 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-800';
        ageSpecificAction = 'Inspect muzzle, eye peri-orbital rims, and paws for patchy hair thinning or redness. Most localized puppy demodex resolves as immune systems mature; modern isoxazoline parasiticides are curative.';
      } else {
        currentRelevancy = 'active_screening';
        relevancyBadge = '⚠️ CHRONIC ATOPY & EAR WATCH';
        relevancyColor = 'text-amber-700 bg-amber-100 dark:bg-amber-950/70 dark:text-amber-300';
        ageSpecificAction = 'Monitor for chronic paw-licking, belly rashes, or frequent head-shaking (otitis). Manage with cytopoint/apoquel therapy and hypoallergenic bathing protocols.';
      }
    }
    // Cerebellar Ataxia / Neurological
    else if (lower.includes('ataxia') || lower.includes('cerebellar')) {
      onsetPhase = 'Adult (Progressive)';
      riskType = 'Genetic Neurological Pathology';
      estimatedCost = '$800 – $2,500 (Diagnostic MRI & Supportive Care)';
      description = 'Inherited neuronal ceroid lipofuscinosis leading to progressive loss of coordination, balance, and hypermetric gait.';
      if (isPuppy || isYoungAdult) {
        currentRelevancy = 'early_prevention';
        relevancyBadge = '🧬 DNA SCREENING STATUS';
        relevancyColor = 'text-sky-700 bg-sky-100 dark:bg-sky-950/70 dark:text-sky-300';
        ageSpecificAction = 'Confirm both parents had DNA clearance for the homozygous recessive cerebellar ataxia gene mutation (NCL-A).';
      } else {
        currentRelevancy = 'critical_now';
        relevancyBadge = '⚠️ PROGRESSIVE ADULT ONSET WATCH (3-5 Yrs)';
        relevancyColor = 'text-amber-700 bg-amber-100 dark:bg-amber-950/70 dark:text-amber-300';
        ageSpecificAction = 'Observe agility on stairs, corner turning, and head tremors. Onset typically manifests between 3 and 5 years of age.';
      }
    }
    // Hypothyroidism
    else if (lower.includes('thyroid') || lower.includes('hypothyroidism')) {
      onsetPhase = 'Adult (Progressive)';
      riskType = 'Endocrine Medicine';
      estimatedCost = '$450 – $900 / yr (Levothyroxine)';
      description = 'Immune-mediated lymphocytic thyroiditis leading to deficient thyroid hormone synthesis, lethargy, weight gain, and bilateral coat thinning.';
      if (isAdult || isSenior) {
        currentRelevancy = 'critical_now';
        relevancyBadge = '⚡ ACTIVE ENDOCRINE SURVEILLANCE';
        relevancyColor = 'text-amber-700 bg-amber-100 dark:bg-amber-950/70 dark:text-amber-300';
        ageSpecificAction = 'Include total T4 and free T4 in annual senior blood chemistry panels if dog exhibits unexplained weight gain or "rat tail" alopecia.';
      } else {
        currentRelevancy = 'monitoring';
        relevancyBadge = '🛡️ Routine Adult Baseline';
        relevancyColor = 'text-stone-700 bg-stone-100 dark:bg-stone-800 dark:text-stone-300';
        ageSpecificAction = 'Establish baseline blood work at 3-4 years old to compare if energy levels or coat texture changes later in life.';
      }
    }

    return {
      condition: issue,
      onsetPhase,
      riskType,
      estimatedCost,
      currentRelevancy,
      relevancyBadge,
      relevancyColor,
      description,
      ageSpecificAction
    };
  });

  const growthNote = isPuppy
    ? `Your ${breedName} is currently in its rapid puppy developmental phase (${ageMonths} months old). Calibrated feeding, core vaccinations, deciduous tooth monitoring, and safe growth plate protection are top physiological priorities.`
    : isYoungAdult
    ? `Your ${breedName} has entered young adult prime (${ageYears} yrs old). Full skeletal ossification is established; focus on daily dental hygiene and lean body condition maintenance.`
    : isAdult
    ? `Your ${breedName} is in its mature adult stage (${ageYears} yrs old). Metabolic stability, annual blood baselines, and lean body weight protect against joint and organ stress.`
    : `Your ${breedName} is in its graceful ${stage.name.toLowerCase()} stage (${ageYears} yrs old). Semi-annual senior blood screening, joint comfort, and cognitive vitality are key.`;

  return {
    ageYears,
    ageMonths,
    stageName: stage.name,
    stageBadgeText,
    calibrationSubtitle,
    isPuppy,
    isYoungAdult,
    isAdult,
    isSenior,
    isElder,
    immediateDirectives,
    geneticWatchlist,
    growthNote
  };
}
