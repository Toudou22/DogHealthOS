/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Canine Psychology, Cognitive Ethology & Age-Calibrated Activities Engine
 * Grounded in research from Duke Canine Cognition Center, Fear Free Pets,
 * and Dr. Brian Hare / Dr. Stanley Coren cognitive frameworks.
 */

import { DogSize } from '../types.ts';

export interface CognitiveArchetype {
  archetypeTitle: string;
  tagline: string;
  thinkingStyle: string;
  whatTheyWant: string[];
  innerMonologue: string;
  playfulnessScore: number; // 1-10
  playfulnessDesc: string;
  intelligenceType: string;
  intelligenceDesc: string;
  laybackScore: number; // 1-10
  laybackDesc: string;
  fearSensitivityScore: number; // 1-10
  fearTriggers: string[];
  emotionalSecurityAdvice: string;
}

export interface AgeActivityPlan {
  stageName: string;
  ageSpan: string;
  exerciseRule: string;
  growthPlateGuidance: string;
  sleepRequirementHours: string;
  recommendedPhysicalActivities: { title: string; duration: string; details: string }[];
  recommendedMentalEnrichment: { title: string; mentalBenefit: string; howToPlay: string }[];
  emotionalFocus: string;
  caution: string;
}

export interface BrainGame {
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prepTime: string;
  burnRateVsWalking: string;
  instructions: string;
  cognitiveBenefit: string;
}

export function getCanineCognitiveArchetype(breedName: string, breedGroup: string, size: DogSize): CognitiveArchetype {
  const name = breedName.toLowerCase();
  const group = (breedGroup || '').toLowerCase();

  // 1. Analytical Problem Solvers (Herding / Working thinkers)
  if (group.includes('herding') || name.includes('shepherd') || name.includes('collie') || name.includes('poodle') || name.includes('corgi') || name.includes('malinois') || name.includes('cattle dog')) {
    return {
      archetypeTitle: "The Analytical Problem Solver & Strategic Thinker",
      tagline: "High cognitive drive, visual pattern analyst, and task-oriented partner",
      thinkingStyle: "Processes human gestures and environmental micro-changes in real-time. Constantly evaluating: 'What is my job right now? What is my human about to do next?'",
      whatTheyWant: [
        "A clear daily mental task or 'job' to solve (puzzles, scent search, agility obstacles)",
        "Clear, consistent communication without chaotic shouting or erratic signals",
        "Physical decompression after high-intensity herding or fetch games to prevent adrenaline loops",
        "Predictable daily rhythm with dedicated quiet spaces to switch off"
      ],
      innerMonologue: `"I noticed you put on your left shoe first. That means we're walking. I've already calculated our route, cataloged the neighborhood squirrels, and ready to complete our mission together!"`,
      playfulnessScore: 9,
      playfulnessDesc: "Intense, task-driven play. Loves fetch with rules, agility courses, and structured tug with a crisp 'drop it' cue.",
      intelligenceType: "Working & Adaptive Intelligence (Top Tier)",
      intelligenceDesc: "Learns complex multi-step commands in 5 or fewer repetitions. If bored, will invent their own complex games or herd household members.",
      laybackScore: 4,
      laybackDesc: "Low baseline layback. Finds it difficult to self-settle without taught 'place' commands and sensory decompression protocols.",
      fearSensitivityScore: 7,
      fearTriggers: ["Sudden loud metallic noises / fireworks", "Erratic moving objects (skateboards, scooters)", "Boredom-induced hyper-vigilance"],
      emotionalSecurityAdvice: "Teach an off-switch early. Prevent continuous repetitive ball-throwing which floods their bloodstream with addictive cortisol and adrenaline."
    };
  }

  // 2. Prosocial Eager Empaths (Sporting / Retrievers)
  if (group.includes('sporting') || name.includes('retriever') || name.includes('spaniel') || name.includes('setter') || name.includes('vizsla') || name.includes('pointer')) {
    return {
      archetypeTitle: "The Joyful Prosocial Empath & Cooperative Partner",
      tagline: "Eager to please, oral sensory explorer, and deeply socially attuned",
      thinkingStyle: "Seeks social harmony and connection above all. Evaluates the emotional climate of the room: 'Is everyone happy? Can I bring you this shoe to make you smile?'",
      whatTheyWant: [
        "Deep emotional closeness, eye contact, and cooperative shared activities",
        "Safe oral exploration (holding soft toys, carrying objects on walks)",
        "Gentle, positive-reinforcement coaching (shuts down with harsh reprimands)",
        "Water activities and retrieving outlets that satisfy ancient genetic instincts"
      ],
      innerMonologue: `"I found this sock! It smells just like you! I'm not going to chew it, I just need to carry it around because holding it makes my heart feel full."`,
      playfulnessScore: 9,
      playfulnessDesc: "Universally playful and friendly. Thrives on retrieving games, gentle wrestling, and joyful play-bow greetings.",
      intelligenceType: "Cooperative & Social Intelligence",
      intelligenceDesc: "Exceptional empathy and facial expression reading. Highly trainable through enthusiastic verbal praise and food rewards.",
      laybackScore: 6,
      laybackDesc: "Moderately layback once their physical and social energy needs are met; loves curling up touching your feet.",
      fearSensitivityScore: 5,
      fearTriggers: ["Prolonged social isolation / separation anxiety", "Harsh vocal reprimands", "Being excluded from family activities"],
      emotionalSecurityAdvice: "Never scold them for greeting you with an item in their mouth—it is an appeasement gesture designed to channel emotional excitement."
    };
  }

  // 3. Independent Scent Detectives (Hounds)
  if (group.includes('hound') || name.includes('beagle') || name.includes('basset') || name.includes('dachshund') || name.includes('bloodhound') || name.includes('coohound') || name.includes('rhodesian')) {
    return {
      archetypeTitle: "The Independent Scent Detective & Olfactory Explorer",
      tagline: "Guided by the nose, autonomous decision-maker, and determined tracker",
      thinkingStyle: "Lives in an invisible world of rich aromatic data. When tracking, the auditory cortex literally down-regulates: 'I am not ignoring you, I am decoding a 4-hour-old rabbit scent!'",
      whatTheyWant: [
        "Unrushed 'Sniffaris' where they dictate the pace and explore scent trails",
        "High-value food incentives (cheese, liver) for cooperative recall",
        "Respect for their independent problem-solving nature",
        "Cozy burrowing sleeping quarters after long outdoor explorations"
      ],
      innerMonologue: `"Wait! Stop walking! A fox walked past this blade of grass at 3:15 AM, and she was heading east. I must catalog every single molecule before we take another step!"`,
      playfulnessScore: 7,
      playfulnessDesc: "Playful through scent games, trailing, hide-and-seek, and vocal baying celebrations.",
      intelligenceType: "Instinctive & Olfactory Problem-Solving",
      intelligenceDesc: "Independent thinker. Will not perform tricks purely to please; requires genuine collaborative motivation and mutual respect.",
      laybackScore: 8,
      laybackDesc: "Very layback indoors (often legendary couch snoozers), transitioning to unstoppable drive once their nose catches a wild track.",
      fearSensitivityScore: 4,
      fearTriggers: ["Sudden physical restraint when tracking", "Sensory deprivation (sterile leash walks without sniffing)"],
      emotionalSecurityAdvice: "Denying an olfactory hound the chance to sniff on walks is psychologically exhausting. 15 minutes of sniffing produces more mental serenity than a 45-minute jog."
    };
  }

  // 4. Feisty Alert Specialists (Terriers)
  if (group.includes('terrier') || name.includes('schnauzer') || name.includes('pinscher')) {
    return {
      archetypeTitle: "The Tenacious Alert Specialist & High-Spirited Explorer",
      tagline: "Courageous, quick-witted, highly alert to perimeter movements, and full of grit",
      thinkingStyle: "Always on duty. Evaluates territory: 'What was that rustle? I am ready to investigate, defend our perimeter, and shake the squeaker out of that toy!'",
      whatTheyWant: [
        "Safe outlets for predatory motor patterns (flirt pole chases, squeaker dissections)",
        "Digging and burrowing zones (snuffle mats or a dedicated garden sandbox)",
        "Clear boundaries paired with autonomy and choice",
        "Mental challenges that channel their fierce independence into positive work"
      ],
      innerMonologue: `"I heard a leaf drop two blocks away. Don't worry, human, I will bark once to let the leaf know who owns this living room!"`,
      playfulnessScore: 8,
      playfulnessDesc: "High prey-drive play. Loves vigorous tug-of-war, flirt poles, and de-stuffing puzzle toys.",
      intelligenceType: "Tactical & Quick-Reaction Intelligence",
      intelligenceDesc: "Lightning-fast reaction times. Outsmarts standard containment or puzzle locks rapidly.",
      laybackScore: 3,
      laybackDesc: "Alert and spring-loaded. Needs dedicated calming rituals (chewing, lick mats) to fully power down.",
      fearSensitivityScore: 6,
      fearTriggers: ["Sudden looming physical restraint", "Being cornered by unfamiliar large dogs", "Unpredictable handling"],
      emotionalSecurityAdvice: "Use cooperative care for grooming and nail maintenance. Terriers resent forced physical restraint and respond wonderfully to voluntary consent training."
    };
  }

  // 5. Affectionate Sensitive Empaths (Toy & Companion breeds)
  if (size === 'toy' || group.includes('toy') || name.includes('chihuahua') || name.includes('maltese') || name.includes('cavalier') || name.includes('bichon') || name.includes('french bulldog') || name.includes('pug') || name.includes('shih tzu') || name.includes('papillon')) {
    return {
      archetypeTitle: "The Affectionate Sensitive Empath & Devoted Shadow",
      tagline: "Deeply bonded, emotionally intuitive, sensitive to human tone and spatial pressure",
      thinkingStyle: "Hyper-focused on their primary human. Evaluates spatial safety in a giant world: 'Is it safe down here? Can I sit on your lap where I can see everything and feel your warmth?'",
      whatTheyWant: [
        "Warmth, gentle physical contact, and secure proximity to their humans",
        "Protection from looming physical stances and rough handling",
        "Slow, respectful introductions to novel humans and tall dogs",
        "Comfortable stairs or ramps to avoid stressful leaping off furniture"
      ],
      innerMonologue: `"You're the center of my universe. When you smile at me, my whole body wiggles. Just please don't let that giant dog rush into my personal space!"`,
      playfulnessScore: 7,
      playfulnessDesc: "Burst playfulness. Delightful 5-minute living room zoomies followed by hours of contented cuddling.",
      intelligenceType: "Social-Emotional Micro-Attunement",
      intelligenceDesc: "Masters of human emotional calibration. They detect tears or tension before anyone else in the room.",
      laybackScore: 7,
      laybackDesc: "High layback capability provided they are near their bonded human; can become vocal when left alone.",
      fearSensitivityScore: 8,
      fearTriggers: ["Looming tall figures bending over them", "Thunderstorms and low-frequency rumbles", "Rude off-leash dogs invading their space", "Harsh vocal anger"],
      emotionalSecurityAdvice: "Always crouch down sideways rather than bending over them. A towering human posture feels like an aerial predator to a 7-pound companion."
    };
  }

  // 6. Gentle Couch Sentinels & Calm Guardians (Giant & Molosser breeds)
  if (size === 'giant' || name.includes('great dane') || name.includes('mastiff') || name.includes('bernese') || name.includes('newfoundland') || name.includes('saint bernard') || name.includes('leonberger') || name.includes('irish wolfhound')) {
    return {
      archetypeTitle: "The Gentle Couch Sentinel & Thoughtful Guardian",
      tagline: "Philosophical, calm, emotionally steady, and surprisingly sensitive in spirit",
      thinkingStyle: "Patiently observes before acting. Conserves metabolic energy: 'I see that newcomer. I will quietly watch from this comfortable rug unless true danger presents.'",
      whatTheyWant: [
        "Quiet companionship and soft orthopedic sanctuary spots",
        "Gentle, respectful leadership without physical coercion",
        "Short, meaningful strolls on grass rather than marathon forced hikes",
        "Time to process new environments at their own leisurely pace"
      ],
      innerMonologue: `"I may weigh 130 pounds, but on the inside I am a lap puppy who would like to rest my chin on your knee and sigh deeply."`,
      playfulnessScore: 5,
      playfulnessDesc: "Clumsy, heartwarming bursts of play. A few glorious bounding leaps across the yard before returning to a stately walk.",
      intelligenceType: "Observational & Intuitive Wisdom",
      intelligenceDesc: "Slow and deliberate to execute commands, not out of stubbornness, but because moving a massive frame requires calm consideration.",
      laybackScore: 9,
      laybackDesc: "Exemplary layback temperament. World-class couch loungers who bring a soothing, grounded aura to any home.",
      fearSensitivityScore: 5,
      fearTriggers: ["Slippery hardwood floors / unstable footing", "Sudden loud mechanical shifts", "Veterinary handling without adequate footing"],
      emotionalSecurityAdvice: "Keep non-slip rug runners on all hard floors. Giant breeds develop acute anxiety around slippery surfaces because a fall causes significant orthopedic pain."
    };
  }

  // 7. General Balanced Companion (Default)
  return {
    archetypeTitle: "The Adaptable Canine Companion & Loyal Observer",
    tagline: "Balanced, affectionate, and attuned to the daily rhythms of their family",
    thinkingStyle: "Constantly syncing their emotional frequency with their family. Desires security, purpose, and predictable companionship.",
    whatTheyWant: [
      "Daily collaborative outdoor time with plenty of sniffing opportunities",
      "Interactive play that exercises natural instincts without over-arousal",
      "Consistent positive-reinforcement routines",
      "A peaceful sanctuary space for undisturbed restorative sleep"
    ],
    innerMonologue: `"I'm ready for whatever today brings—whether that's an adventurous woodland hike or sleeping by your desk while you work!"`,
    playfulnessScore: 7,
    playfulnessDesc: "Eager participant in fetch, gentle tug, and scent hide-and-seek games.",
    intelligenceType: "Balanced Adaptive Intelligence",
    intelligenceDesc: "Quickly absorbs household patterns and communicates their needs with expressive eyes and body language.",
    laybackScore: 6,
    laybackDesc: "Good balance of playful enthusiasm outdoors and calm relaxation indoors.",
    fearSensitivityScore: 5,
    fearTriggers: ["Sudden loud noises (fireworks, construction)", "Being startled while sleeping", "Tense household arguments"],
    emotionalSecurityAdvice: "Prioritize agency: allow your companion to choose their own pace and sniff targets during walks to maintain optimal cortisol balance."
  };
}

export function getAgeCalibratedActivityPlan(stageName: string, size: DogSize, ageYears: number): AgeActivityPlan {
  const stage = (stageName || '').toLowerCase();

  // 1. Puppyhood (0 to ~1-1.5 yrs)
  if (stage.includes('pup')) {
    return {
      stageName: "Puppyhood & Early Socialization Stage",
      ageSpan: `${ageYears.toFixed(1)}y (Pediatric Window: 0 - 1.5 yrs)`,
      exerciseRule: "The Golden 5-Minute Rule: 5 minutes of structured walking per month of age, maximum twice daily (e.g., 4 months = 20 min walk).",
      growthPlateGuidance: "Cartilaginous growth plates (distal radius and ulna) remain soft and unfused. Avoid repetitive concussive impact on asphalt, forced running, agility jumps, or sliding down stairs.",
      sleepRequirementHours: "18 to 20 hours daily. (Crucial: 80% of puppy 'biting fits' and frantic zoomies are caused by overtiredness, NOT excess energy!)",
      recommendedPhysicalActivities: [
        { title: "Off-Leash Grass Exploration", duration: "10-15 mins", details: "Natural trotting, sniffing, and voluntary stops on soft turf allowing natural self-regulation." },
        { title: "Gentle Wobble Board & Novel Surfaces", duration: "5 mins", details: "Walking across safe cardboard, rubber, and grass mats to build proprioception and paw confidence." },
        { title: "Short-Distance Soft Toy Retrieves", duration: "5 mins", details: "Low-impact rolling of a soft plush toy on carpet; stop before the puppy gets over-aroused." }
      ],
      recommendedMentalEnrichment: [
        { title: "Kibble Snuffle Mat & Grass Scatter", mentalBenefit: "Calms pulse, builds focus, releases dopamine", howToPlay: "Scatter their meal in a fabric snuffle mat or tall clean grass instead of a bowl." },
        { title: "Cardboard Destruction Box", mentalBenefit: "Satisfies dissecting instinct without ruining furniture", howToPlay: "Place dry treats inside an unprinted egg carton or paper box; let puppy safely rip it apart." },
        { title: "Fear-Free Sound Desensitization", mentalBenefit: "Prevents lifelong thunderstorm & firework phobias", howToPlay: "Play thunderstorm audio at whisper volume while feeding high-value boiled chicken shreds." }
      ],
      emotionalFocus: "Navigating Primary (8-11w) & Adolescent (6-14m) Fear Periods: Never force the puppy toward something they avoid. Support them with calm distance and gentle treats.",
      caution: "Never take a growing puppy on a human jogging or cycling run. Repetitive pavement impact creates micro-fractures in immature joint cartilage."
    };
  }

  // 2. Young Adult (1.5 to 4 yrs)
  if (stage.includes('young')) {
    return {
      stageName: "Young Adult & High-Energy Cognitive Prime",
      ageSpan: `${ageYears.toFixed(1)}y (Cognitive Prime: 1.5 - 4 yrs)`,
      exerciseRule: "60 to 90 minutes total daily activity, split between aerobic conditioning and high-intensity mental problem solving.",
      growthPlateGuidance: "Growth plates have solidified! Safe for hiking, moderate jogging, swimming, and agility courses with appropriate gradual conditioning.",
      sleepRequirementHours: "12 to 14 hours daily (including daytime restorative naps).",
      recommendedPhysicalActivities: [
        { title: "Canine Sniffari & Decompression Walk", duration: "30-40 mins", details: "Walk on a 10-15ft long-line in a quiet park where the dog leads and sniffs with zero heel pressure." },
        { title: "Flirt Pole Impulse Control", duration: "10-15 mins", details: "Chase games with sudden 'wait' and 'take it' cues. Builds phenomenal emotional brakes and impulse control." },
        { title: "Hydrotherapy or Safe Swimming", duration: "15-20 mins", details: "Zero-concussion full-body muscular conditioning that strengthens hips and shoulders." }
      ],
      recommendedMentalEnrichment: [
        { title: "Nosework / Scent Detection Game", mentalBenefit: "Burns 3x more mental energy than physical jogging", howToPlay: "Hide a favorite treat or scented tin in the living room; cue 'Find it!' and celebrate when located." },
        { title: "Frozen Lick Mats with Greek Yogurt / Pumpkin", mentalBenefit: "Licking stimulates endorphin release and vagus nerve tranquility", howToPlay: "Freeze plain pumpkin puree and kefir onto textured silicone mats for post-walk calming." },
        { title: "Cooperative Care Consent Training", mentalBenefit: "Eliminates veterinary terror and nail trim struggles", howToPlay: "Teach a voluntary chin-rest on your knee. While chin stays down, handle paws or inspect ears." }
      ],
      emotionalFocus: "Social Maturity Shift: It is biologically normal for dogs around age 2-3 to shift from 'loves all dogs' to 'dog-selective' or 'dog-tolerant'. Do not force them into crowded chaotic dog parks.",
      caution: "Beware of ball-launcher addiction: repetitive 40mph sudden stops on ball retrieves cause high rates of ACL (cranial cruciate) tears and chronic cortisol elevation."
    };
  }

  // 3. Mature Adult (4 to 7-8 yrs)
  if (stage.includes('adult')) {
    return {
      stageName: "Mature Adult Stewardship Stage",
      ageSpan: `${ageYears.toFixed(1)}y (Prime Stability: 4 - 8 yrs)`,
      exerciseRule: "45 to 60 minutes daily structured low-impact physical exercise + 20 minutes daily cognitive engagement.",
      growthPlateGuidance: "Preserve joint synovial fluid and spinal flexibility. Prioritize warm-up walks before any vigorous sprinting.",
      sleepRequirementHours: "12 to 14 hours daily.",
      recommendedPhysicalActivities: [
        { title: "Steady-State Trail Ambulation", duration: "30-40 mins", details: "Moderate-paced walking on natural dirt trails which cushion footfalls and engage core stabilizer muscles." },
        { title: "Controlled Hill & Incline Trotting", duration: "10-15 mins", details: "Gentle upward slopes strengthen hindquarter muscle mass and protect knees from degenerative tear." },
        { title: "Interactive Backyard Search Games", duration: "15 mins", details: "Hiding toys behind trees and patio furniture to combine steady movement with mental deduction." }
      ],
      recommendedMentalEnrichment: [
        { title: "Multi-Tier Puzzle Feeders (Level 2/3)", mentalBenefit: "Maintains high problem-solving synaptic plasticity", howToPlay: "Wooden or slider puzzles requiring dogs to twist dials and slide panels to unlock food." },
        { title: "New Trick / Novel Skill Learning", mentalBenefit: "Prevents cognitive stagnation and reinforces partnership", howToPlay: "Spend 5 minutes teaching novel tricks (e.g., 'Put toys in the basket', 'Touch target with nose')." },
        { title: "Calm Coffee-Shop People Watching (Neutral Exposure)", mentalBenefit: "Practices relaxed neutrality in ambient environments", howToPlay: "Sit on an outdoor patio bench; reward calm relaxed lying down while life passes by." }
      ],
      emotionalFocus: "Preserving Emotional Stability & Routine: Mature dogs thrive on predictable schedules. Give them uninterrupted rest time away from chaotic young puppies or boisterous children.",
      caution: "Watch for subtle signs of early osteoarthritis (taking 2 extra seconds to stand up after naps, hesitation before jumping into cars)."
    };
  }

  // 4. Senior & Golden Years (7+ yrs)
  return {
    stageName: "Senior & Golden Years Sanctuary Stage",
    ageSpan: `${ageYears.toFixed(1)}y (Veteran & Golden Horizon: Senior)`,
    exerciseRule: "20 to 35 minutes daily gentle, dog-dictated walking on level grass. Emphasize frequency over single exhausting duration (e.g., two 15-minute gentle strolls).",
    growthPlateGuidance: "Joint cartilage has thinned and spinal discs are less hydrated. Eliminate jumping down from vehicles or beds. Provide ramps and supportive harnesses.",
    sleepRequirementHours: "14 to 18 hours daily of deep, restorative sleep on thick memory foam.",
    recommendedPhysicalActivities: [
      { title: "Sensory 'Sniff & Stroll' on Soft Grass", duration: "15-20 mins", details: "Zero speed expectations. Allow your senior to stop and sniff every leaf. Sniffing is their morning newspaper and cognitive lifeline." },
      { title: "Gentle Passive Range-of-Motion (PROM)", duration: "5-10 mins", details: "Gentle circular cycling of front and hind legs while lying comfortably on a warm blanket." },
      { title: "Warm Water Hydrotherapy Treadmill", duration: "10-15 mins", details: "Buoyant warm water supports body weight while exercising atrophied thigh muscles without pain." }
    ],
    recommendedMentalEnrichment: [
      { title: "Canine Cognitive Dysfunction (CCD) Scent Trail", mentalBenefit: "Fights canine dementia, stimulates memory circuits", howToPlay: "Lay a gentle trail of warm bone broth drops leading to an easy treasure dish." },
      { title: "Textured Warm Lick Mats with Bone Broth", mentalBenefit: "Soothes evening anxiety and sundowning disorientation", howToPlay: "Warm meat puree on a lick mat right before twilight to trigger serotonin release and ease evening transitions." },
      { title: "Gentle Massage & TTouch Ear Slides", mentalBenefit: "Reduces autonomic stress, eases arthritic muscular tension", howToPlay: "Slow, circular clockwise strokes along the neck, shoulders, and gentle slides along the ear leather." }
    ],
    emotionalFocus: "Sensory Loss Empathy (Vision & Hearing): If your senior dog startles easily, pair touch with a visual hand signal first. Keep furniture arrangements strictly identical to avoid disorientation.",
    caution: "Avoid slippery floors: install non-slip rug runners between their bed, water bowl, and exterior doors. A senior dog that slips loses confidence rapidly."
  };
}

export const TOP_FIVE_BRAIN_GAMES: BrainGame[] = [
  {
    title: "The Ultimate Sniffari (Sensory Autonomy)",
    difficulty: "Beginner",
    prepTime: "0 mins",
    burnRateVsWalking: "3x More Mentally Satisfying than Heel Walking",
    instructions: "Attach a 10-15 ft lead. Head to an open park or quiet leafy street. Put your phone away and surrender all control. If your dog wants to spend 4 full minutes investigating one tree trunk, let them! Their brain is processing thousands of olfactory messages.",
    cognitiveBenefit: "Activates the olfactory cortex, lowers resting cortisol by up to 35%, and fulfills ancient foraging drives."
  },
  {
    title: "The Cardboard Shred & Treat Scramble",
    difficulty: "Beginner",
    prepTime: "1 min",
    burnRateVsWalking: "Instant Dopamine & Frustration Relief",
    instructions: "Take an empty cardboard box or paper egg carton. Toss in a handful of high-value treats and a crumpled paper ball. Close the lid loosely. Hand it to your dog with the cue 'Go to work!'. Let them shred, dissect, and unpack the prize.",
    cognitiveBenefit: "Satisfies the natural canine predatory motor sequence (capture, dissect, consume) in a 100% legal, non-destructive way."
  },
  {
    title: "The Three-Cup Memory Shuffle",
    difficulty: "Intermediate",
    prepTime: "2 mins",
    burnRateVsWalking: "Drives High Working Memory Plasticity",
    instructions: "Place 3 plastic or ceramic cups upside down on the floor. In full view of your dog, place a smelly treat under one cup. Shuffle the cups slowly. Cue 'Where is it?'. Celebrate when they nudge or paw the correct cup with their nose.",
    cognitiveBenefit: "Strengthens object permanence, spatial reasoning, and working short-term memory circuits."
  },
  {
    title: "Hide-and-Seek Scent Trail (Human Search)",
    difficulty: "Intermediate",
    prepTime: "1 min",
    burnRateVsWalking: "Deepens Secure Human-Canine Attachment",
    instructions: "Have a family member hold your dog. Walk to another room and hide behind a door or behind a couch. Call your dog's name once: 'Come find me!'. When they locate you using scent and sound, throw a massive celebration with treats and praise.",
    cognitiveBenefit: "Reinforces joyful recall, auditory triangulation, and elevates oxytocin levels in both dog and guardian."
  },
  {
    title: "Frozen Textured Zen Licking Session",
    difficulty: "Beginner",
    prepTime: "3 mins",
    burnRateVsWalking: "Calms Autonomic Nervous System",
    instructions: "Spread a thin layer of pure canned pumpkin, unsweetened Greek yogurt, or wet food onto a textured silicone lick mat. Freeze for 30 minutes. Present to your dog during stressful times (thunderstorms, guests arriving, or post-walk wind-down).",
    cognitiveBenefit: "Repetitive rhythmic licking activates the parasympathetic vagal nerve, prompting the brain to release serotonin and endorphins."
  }
];

// ============================================================================
// Modern Working Life & Daycare Psychological Architecture
// ============================================================================

export interface ModernDaycarePressure {
  id: string;
  category: string;
  pressureTitle: string;
  parentReality: string;
  canineBiologicalImpact: string;
  clinicalEthologyVerdict: string;
  neurochemicalImpact: string;
  anatomicalStressor: string;
  actionablePrescription: string;
}

export interface AgeDaycareMatrixEntry {
  stageKey: 'puppy' | 'adolescent' | 'adult' | 'senior';
  stageTitle: string;
  ageRange: string;
  sleepRequirementHours: string;
  daycareSuitabilityVerdict: string;
  recommendedMaxHours: string;
  howDogDealsWithDaycare: string;
  biologicalRisks: string;
  clinicalGuideline: string;
}

export interface DaycareCompatibilityProfile {
  suitabilityScore: number; // 1-10
  verdict: 'Thrives in Structured Daycare' | 'Moderate / Half-Day Optimal' | 'Sensory Overwhelm Risk' | 'Contraindicated / In-Home Better';
  verdictBadgeColor: string;
  breedCopingMechanism: string;
  packDynamicRole: string;
  arousalRiskFactor: string;
  handlerInterventionNeed: string;
  ageSpecificReality: {
    stageTitle: string;
    daycareImpact: string;
    recommendedMaxHours: string;
    criticalRule: string;
  };
  allLifeStagesDaycareMatrix: AgeDaycareMatrixEntry[];
  modernPressures: ModernDaycarePressure[];
  stressSignals: string[];
  modernWorkingParentAlternatives: {
    title: string;
    benefit: string;
    implementation: string;
  }[];
  facilityEvaluationChecklist: string[];
}

export const MODERN_DAYCARE_PRESSURES: ModernDaycarePressure[] = [
  {
    id: "rto-mandates",
    category: "Workplace & Policy",
    pressureTitle: "Corporate Return-To-Office (RTO) & 9-to-10-Hour Absences",
    parentReality: "After years of hybrid flexibility, employers are mandating 3 to 5 full in-office days. Leaving a companion dog locked indoors alone for 9-10 continuous hours creates intense anxiety, guilt, and practical bladder-control concerns.",
    canineBiologicalImpact: "Adult canines possess bladder capacity for 6-8 hours, but continuous isolation without cognitive engagement creates acute boredom, frustration vocalization, or destructive chew displacement.",
    clinicalEthologyVerdict: "Daycare is often chosen as a panacea, but commercial open-pack facilities subject the dog to 8 hours of sensory bombardment. Half-day daycare or a 30-minute midday drop-in walker is medically superior.",
    neurochemicalImpact: "Elevated baseline salivary cortisol (+35%) and adrenaline; serotonin depletion caused by under-stimulated sensory isolation.",
    anatomicalStressor: "Pelvic floor muscle strain and extreme urinary bladder distension past the 7th continuous hour of retention.",
    actionablePrescription: "Cap alone-time at 5 hours via a midday drop-in walker, or book half-day daycare (9:00 AM – 1:00 PM) rather than 10-hour full days."
  },
  {
    id: "urban-commute",
    category: "Urban Geography",
    pressureTitle: "Long Urban Commute Times (1.5 to 2.5 Hours Daily)",
    parentReality: "Metropolitan traffic congestion and transit delays extend the standard 8-hour workday into an 11-hour absence from home. Parents cannot feasibly return home at lunch to let their dog out.",
    canineBiologicalImpact: "Being left alone from 7:30 AM to 6:30 PM forces dogs into prolonged urinary retention and circadian disruption, compounding separation anxiety and restlessness.",
    clinicalEthologyVerdict: "Drop-off daycares near transit hubs or dedicated neighborhood dog walkers prevent bladder stress while avoiding the adrenaline fatigue of warehouse daycares.",
    neurochemicalImpact: "Circadian melatonin dysregulation; chronic sympathetic nervous system arousal triggered by unpredictable guardian arrival cues.",
    anatomicalStressor: "Prolonged gastrointestinal motility stasis and urinary sphincter fatigue during 11+ hour intervals.",
    actionablePrescription: "Coordinate an in-building neighbor co-op or schedule a bonded drop-in walker at hour 5 of your commute window."
  },
  {
    id: "apartment-living",
    category: "Housing & Community",
    pressureTitle: "High-Density Condos, Zero Private Yards & Strict HOA Noise Rules",
    parentReality: "Modern urban high-rises lack direct yard access. A single alert-barking episode can trigger landlord citations, neighbor complaints, or lease violation warnings.",
    canineBiologicalImpact: "Confined in 700-1,200 sq ft without olfactory novelty, dogs alert-bark at hallway footfalls, elevator chimes, and delivery workers due to under-stimulated sensory thresholds.",
    clinicalEthologyVerdict: "Parents use daycare to 'tire out' apartment dogs. However, dogs over-aroused by daycare often return home more reactive to hallway noises. Tailored sniffing walks ('sniffaris') fulfill decompression far more effectively.",
    neurochemicalImpact: "Auditory sensitization: lowered acoustic auditory threshold causing hyper-reactive startle spikes in epinephrine.",
    anatomicalStressor: "Lack of natural horizontal movement and olfactory variation; restriction to hard flooring without grass grounding.",
    actionablePrescription: "Perform two 20-minute slow sniffing walks ('sniffaris') morning and evening; use white-noise sound dampeners near hallway doors."
  },
  {
    id: "shift-work",
    category: "Essential Professions",
    pressureTitle: "12-Hour Critical Shift Work (Healthcare, First Responders)",
    parentReality: "Nurses, physicians, paramedics, firefighters, and manufacturing specialists work consecutive 12-to-14-hour rotations (days or nights) that make standard pet ownership logistics brutal.",
    canineBiologicalImpact: "Dogs cannot go 14 hours without elimination and companionship. Irregular day/night shift schedules also disrupt the dog's internal biological clock.",
    clinicalEthologyVerdict: "Daycare provides essential custodial safety during long shifts. Key clinical requirement: ensure the facility enforces structured sleeping dens so the dog sleeps during the shift.",
    neurochemicalImpact: "Severe disruption of canine circadian rhythms, hypothalamic-pituitary-adrenal (HPA) axis, and feeding satiety hormones (leptin/ghrelin).",
    anatomicalStressor: "14-hour physical absence exceeds physiological renal filtration capacity by over 100%, causing dangerous bladder wall stretching.",
    actionablePrescription: "Partner with a dedicated home-boarding sitter or choose a facility with private quiet sleeping suites with soft bedding."
  },
  {
    id: "parent-guilt",
    category: "Societal Marketing",
    pressureTitle: "'Good Dog Parent' Social Guilt & Commercial Daycare Marketing",
    parentReality: "Social media and aggressive pet industry marketing convince guardians that 'a good parent sends their dog to play with 40 friends all day', framing home rest as neglect.",
    canineBiologicalImpact: "Canine ethology proves domestic dogs are NOT herd animals. Adult dogs naturally prefer 1 or 2 trusted canine companions over a chaotic room of 30 unfamiliar strangers.",
    clinicalEthologyVerdict: "Do not feel guilty leaving an adult dog home in a quiet, enriched environment. Quiet daytime sleep is biologically appropriate; 8 hours of chaotic dog wrestling is unnatural.",
    neurochemicalImpact: "Chronic hyper-arousal and dopamine-adrenaline spikes; the dog becomes dependent on extreme external stimulation to achieve exhaustion.",
    anatomicalStressor: "Musculoskeletal joint cartilage inflammation and micro-tears from repetitive concussive impact on sealed concrete or slick epoxy floors.",
    actionablePrescription: "Reframe restful sleep as supreme canine health! Provide two frozen Kongs or lick mats; adult dogs thrive on 12-14 hours of daily sleep."
  },
  {
    id: "home-disruption",
    category: "Domestic Environment",
    pressureTitle: "Home Renovations, Apartment Maintenance & Environmental Safety",
    parentReality: "Contractor foot traffic, open exterior doors, toxic paint fumes, power tool decibels, and exterminator treatments make homes unsafe or terrifying for dogs during work hours.",
    canineBiologicalImpact: "Unpredictable stranger presence and high-decibel acoustic triggers cause severe fight-or-flight panic and bolting risk.",
    clinicalEthologyVerdict: "Daycare serves as a vital safety harbor during domestic disruption, removing the animal from acoustic trauma and accidental escape hazards.",
    neurochemicalImpact: "Acute acoustic trauma: surge in noradrenaline and cortisol from unpredictably fluctuating high-decibel tool noise (85–110 dB).",
    anatomicalStressor: "Tympanic membrane acoustic fatigue; acute respiratory mucosal irritation from volatile airborne particulates or paint solvents.",
    actionablePrescription: "Temporary daycare or off-site boarding during active renovation hours is the safest veterinary intervention."
  }
];


export const ALL_LIFE_STAGES_DAYCARE_MATRIX: AgeDaycareMatrixEntry[] = [
  {
    stageKey: 'puppy',
    stageTitle: "Pediatric Puppyhood",
    ageRange: "8 Weeks to 6 Months",
    sleepRequirementHours: "18 to 20 Hours Daily (Mandatory for Neurodevelopment)",
    daycareSuitabilityVerdict: "Extreme Caution / Open Daycare Contraindicated",
    recommendedMaxHours: "0 Hours in Open Daycare (1-2 Hours in Structured Puppy Preschool Only)",
    howDogDealsWithDaycare: "Puppies cannot self-regulate arousal in a room full of stimuli. When overtired, their nervous systems crash into hyperactive frantic biting, zoomies, and tantrum behaviors that parents mistake for 'energy'.",
    biologicalRisks: "Severe sleep deprivation stunts growth hormone release; and during the Critical Fear Imprinting Periods (8-11w & ~6m), a single traumatic body-slam or bullying incident imprints lifelong dog-directed fear reactivity.",
    clinicalGuideline: "Never place a puppy under 6 months in an unpartitioned adult warehouse daycare. Choose specialized puppy preschools that enforce 45 minutes of quiet crate sleep for every 15 minutes of gentle play."
  },
  {
    stageKey: 'adolescent',
    stageTitle: "Adolescent Surge",
    ageRange: "6 Months to 18-24 Months",
    sleepRequirementHours: "14 to 16 Hours Daily",
    daycareSuitabilityVerdict: "Moderate / High Monitoring Required",
    recommendedMaxHours: "3 to 4 Hours Max (Structured Half-Day Only)",
    howDogDealsWithDaycare: "Adolescents are flooded with hormonal surges and testing social boundaries. They are the most frequent instigators of scuffles due to rude greetings, body-slamming, mounting, and ignoring other dogs' cut-off signals.",
    biologicalRisks: "High risk of becoming either a target of aggressive corrections from older dogs or developing bullying play habits that crystallize into permanent adult social dysfunction.",
    clinicalGuideline: "Mandate facilities with low dog-to-staff ratios (under 1:10) where handlers redirect mounting and inappropriate play instantly. Never use 8-hour continuous daycare as an 'energy dumper'."
  },
  {
    stageKey: 'adult',
    stageTitle: "Mature Adulthood",
    ageRange: "2 to 7 Years",
    sleepRequirementHours: "12 to 14 Hours Daily",
    daycareSuitabilityVerdict: "Selective / Half-Day or In-Home Walker Optimal",
    recommendedMaxHours: "4 Hours Max (or 1-2 Non-Consecutive Days/Week)",
    howDogDealsWithDaycare: "As canines mature past age 2, they naturally transition from 'dog-social' (loves everyone) to 'dog-selective' (enjoys familiar friends, indifferent or annoyed by rude strangers). Many adults find warehouse daycares like being trapped in a loud nightclub all day.",
    biologicalRisks: "The '48-Hour Daycare Coma': Dogs collapsing for 2 straight days after daycare are experiencing neurological burnout and adrenal depletion, not peaceful rest. High risk of doorstep reluctance and leash reactivity.",
    clinicalGuideline: "Listen to subtle avoidance signs: lip-licking, hesitation at the facility door, or pulling back to the car. An in-home drop-in dog walker is clinically vastly superior for mature adults."
  },
  {
    stageKey: 'senior',
    stageTitle: "Senior & Geriatric",
    ageRange: "7+ Years (5+ Years in Giant Breeds)",
    sleepRequirementHours: "16 to 18 Hours Daily",
    daycareSuitabilityVerdict: "Contraindicated in Commercial Open Daycare",
    recommendedMaxHours: "0 Hours in Open Daycare (Unless Quiet Specialized Senior Sanctuary)",
    howDogDealsWithDaycare: "Seniors with arthritic joints, thinned spinal cushioning, and subtle cataract or hearing loss feel vulnerable and defenseless in dynamic packs. They cannot escape bouncy young dogs and spend the day in chronic fight-or-flight tension.",
    biologicalRisks: "Slippery sealed epoxy or wet concrete floors cause microscopic slipping that tears cruciate ligaments (CCLs) and worsens hip dysplasia. Chronic sensory overload accelerates Canine Cognitive Dysfunction (CCD).",
    clinicalGuideline: "Do not send senior dogs to commercial open daycares. Provide a peaceful home sanctuary with orthopedic memory-foam bedding, warm sunshine, and a gentle midday drop-in walker for potty relief."
  }
];

export function getDaycareCompatibilityProfile(
  breedName: string,
  breedGroup: string,
  size: DogSize,
  age: number,
  stageName: string
): DaycareCompatibilityProfile {
  const name = breedName.toLowerCase();
  const group = (breedGroup || '').toLowerCase();
  const stage = (stageName || '').toLowerCase();

  // 1. BASE AGE REALITY & MAX HOURS
  let ageReality = {
    stageTitle: "Young Adult (1.5 - 4 yrs) - High Physical Energy",
    daycareImpact: "Can enjoy communal play if facilities enforce mandatory 1-to-2 hour crate rest rotations. High risk of adrenaline addiction and developing barrier frustration if allowed to wrestle uncontrollably all day.",
    recommendedMaxHours: "4 to 6 Hours Max (Half-Day is Gold Standard)",
    criticalRule: "Never book 5 consecutive full days. Limit to 2 non-consecutive days per week (e.g., Tuesday & Thursday) to allow the nervous system to decompress."
  };

  if (age < 0.6 || stage.includes('pup')) {
    ageReality = {
      stageTitle: "Pediatric Puppy (8w - 6m) - Sleep & Fear Vulnerability",
      daycareImpact: "Critical Warning: Puppies require 18-20 hours of sleep daily. 8 hours of uninterrupted daycare causes severe sleep deprivation, loss of bite inhibition, and frantic overtired tantrums. Additionally, negative encounters during fear periods (8-11w & 6-14m) cause lifelong dog-reactivity.",
      recommendedMaxHours: "0 Hours in Open Daycare (1-2 Hours in Puppy-Only Preschool)",
      criticalRule: "Ensure the facility has a designated, quiet puppy nursery with 75% mandatory naptime and strictly zero interactions with rough adolescent dogs."
    };
  } else if (age < 1.8) {
    ageReality = {
      stageTitle: "Adolescent Surge (6m - 1.8y) - Boundary Testing & Hormones",
      daycareImpact: "Adolescent hormone surges drive impulsive body-slamming, mounting, and ignoring cut-off signals. High risk of getting into altercations or becoming bullied by older dogs.",
      recommendedMaxHours: "3 to 4 Hours Max (Strictly Structured Half-Day)",
      criticalRule: "Requires active certified handlers who intervene within 3 seconds of over-arousal. Do not let daycare become an uncontrolled wrestling ring."
    };
  } else if (age >= 8.0 || stage.includes('senior')) {
    ageReality = {
      stageTitle: "Senior / Golden Years (8+ yrs) - Sensory & Orthopedic Vulnerability",
      daycareImpact: "Commercial open-play daycare is clinically contraindicated. Slower reflexes, thinned joint cartilage, and subtle vision/hearing decline make loud chaotic rooms terrifying. Arthritic seniors cannot escape bouncy young dogs on slippery epoxy floors.",
      recommendedMaxHours: "0 Hours in Standard Daycare (In-Home Rest Preferred)",
      criticalRule: "In-home rest on orthopedic bedding with a gentle midday drop-in walker is clinically vastly superior to daycare for seniors."
    };
  } else if (age >= 4.0 || stage.includes('adult')) {
    ageReality = {
      stageTitle: "Mature Adult (4 - 8 yrs) - Biological Social Maturity Shift",
      daycareImpact: "Normal Canine Ethology: Around ages 3 to 5, domestic dogs naturally transition from 'dog-social' (loves all dogs) to 'dog-selective' (tolerates polite dogs, annoyed by rude strangers). Many adults find warehouse daycares exhausting and prefer quiet spaces.",
      recommendedMaxHours: "3 to 4 Hours Max (or 1-on-1 Dog Walker)",
      criticalRule: "Do not feel guilty if your mature adult dog no longer enjoys daycare. Preferring home comfort over 30 barking stranger dogs is normal, healthy adulthood!"
    };
  }

  // 2. BREED-SPECIFIC PACK DYNAMICS & COPING MECHANISMS
  let baseScore = 6;
  let verdict: DaycareCompatibilityProfile['verdict'] = 'Moderate / Half-Day Optimal';
  let badgeColor = 'bg-amber-500 text-stone-950';
  let packRole = "The Observant Companion";
  let copingMechanism = "Tolerates communal play in moderate doses; seeks calm corners when energy levels spike.";
  let arousalRiskFactor = "Medium: Can become fatigued if play groups are unstructured without resting pauses.";
  let handlerInterventionNeed = "Standard: Ensure comfortable nap breaks and polite play partners.";

  // Herding / Controllers
  if (group.includes('herding') || name.includes('shepherd') || name.includes('collie') || name.includes('corgi') || name.includes('cattle dog') || name.includes('malinois') || name.includes('aussie')) {
    baseScore = 4;
    verdict = 'Sensory Overwhelm Risk';
    badgeColor = 'bg-rose-500 text-white';
    packRole = "The Self-Appointed 'Fun Police' & Motion Controller";
    copingMechanism = "Becomes hyper-vigilant trying to manage the motion of other dogs. Nips heels, barks at wrestling pairs, and leaves daycare physically exhausted but mentally over-stimulated with elevated stress hormones.";
    arousalRiskFactor = "High to Critical: Movement of running dogs triggers compulsive predatory motor patterns (stalk, chase, heel-nip).";
    handlerInterventionNeed = "Immediate: Must be redirected before fixation occurs; open daycares frequently induce barrier frustration and leash reactivity in herders.";
  }
  // Sporting / Retrievers (High Prosocial)
  else if (group.includes('sporting') || name.includes('retriever') || name.includes('spaniel') || name.includes('pointer') || name.includes('setter')) {
    baseScore = 8;
    verdict = 'Thrives in Structured Daycare';
    badgeColor = 'bg-emerald-600 text-white';
    packRole = "The Prosocial Social Butterfly";
    copingMechanism = "Naturally communicative and loves play-bowing and group play. However, without mandatory nap breaks, will play past the point of exhaustion and develop over-arousal habits.";
    arousalRiskFactor = "Moderate to High: Lacks internal 'off-switch'; will run until cardiac or musculoskeletal exhaustion without human-enforced rest.";
    handlerInterventionNeed = "Enforced Rest: Mandatory 2-hour crate quiet time with frozen enrichment to break the adrenaline cycle.";
  }
  // Toy / Sensitive Companions
  else if (size === 'toy' || group.includes('toy') || name.includes('chihuahua') || name.includes('maltese') || name.includes('french bulldog') || name.includes('pug') || name.includes('cavalier') || name.includes('yorkie') || name.includes('pomeranian')) {
    baseScore = 3;
    verdict = 'Sensory Overwhelm Risk';
    badgeColor = 'bg-rose-500 text-white';
    packRole = "The Human Shadow & Perimeter Watcher";
    copingMechanism = "Easily overwhelmed by large pack volumes, echoing warehouse barks, and rough physical play. Often clings to human daycare attendants or hides beneath benches to avoid being trampled.";
    arousalRiskFactor = "Severe Fear/Trauma Risk: High risk of learned helplessness or fear-biting if larger or boisterous dogs invade their personal space.";
    handlerInterventionNeed = "Micro-Separation: Must be kept strictly in a quiet, dedicated toy-dog sanctuary under 15 lbs with cushioned rubber flooring.";
  }
  // Scent Hounds & Sight Hounds
  else if (group.includes('hound') || name.includes('beagle') || name.includes('basset') || name.includes('dachshund') || name.includes('whippet') || name.includes('greyhound')) {
    baseScore = 5;
    verdict = 'Moderate / Half-Day Optimal';
    badgeColor = 'bg-amber-500 text-stone-950';
    packRole = "The Disconnected Floor Sniffer / Quiet Sprinter";
    copingMechanism = "Largely ignores dog play groups to sniff every floor drain and perimeter wall. Can become frustrated by indoor confinement without natural outdoor scent trails, while sighthounds dislike chaotic wrestling due to thin skin.";
    arousalRiskFactor = "Low Dog-Arousal, High Frustration: Vocalization / baying if confined indoors without olfactory complexity.";
    handlerInterventionNeed = "Provide scent enrichment or private outdoor turf runs rather than forcing participation in dog scrums.";
  }
  // Terriers & Bull Breeds
  else if (group.includes('terrier') || name.includes('schnauzer') || name.includes('staffordshire') || name.includes('pit bull')) {
    baseScore = 4;
    verdict = 'Sensory Overwhelm Risk';
    badgeColor = 'bg-rose-500 text-white';
    packRole = "The Zero-Tolerance Boundary Enforcer";
    copingMechanism = "Low tolerance for rude, clumsy adolescents invading their personal space. Will deliver sharp corrections that can escalate into scuffles if daycare staff fail to intervene promptly.";
    arousalRiskFactor = "High: High tenacious arousal; corrections are fast and intense, which other dogs can misinterpret as aggression.";
    handlerInterventionNeed = "High Vigilance: Requires staff who know how to manage play styles and prevent toy/doorway resource guarding.";
  }
  // Giants
  else if (size === 'giant' || name.includes('great dane') || name.includes('mastiff') || name.includes('bernese') || name.includes('newfoundland') || name.includes('saint bernard')) {
    baseScore = 4;
    verdict = 'Moderate / Half-Day Optimal';
    badgeColor = 'bg-amber-500 text-stone-950';
    packRole = "The Gentle Lounger";
    copingMechanism = "Lacks the cardiac and orthopedic stamina for 6-8 hours of continuous upright pacing on hard floors. Requires soft bedding and slow, polite playmates.";
    arousalRiskFactor = "Orthopedic Strain: Heavy joints suffer micro-trauma on hard concrete or slick floors.";
    handlerInterventionNeed = "Orthopedic Accommodation: Access to soft, raised beds and gentle play sessions under 30 minutes.";
  }
  // Guardian & Primitive
  else if (group.includes('working') || group.includes('guardian') || name.includes('rottweiler') || name.includes('doberman') || name.includes('shiba') || name.includes('akita')) {
    baseScore = 3;
    verdict = 'Sensory Overwhelm Risk';
    badgeColor = 'bg-rose-500 text-white';
    packRole = "The Perimeter Guardian & Aloof Observer";
    copingMechanism = "Naturally wary of strangers and uncomfortable in an unstructured room where 30 unfamiliar dogs constantly cycle through. Stiffens, monitors doors, and prefers personal space.";
    arousalRiskFactor = "Defensive Stress: Unsolicited greetings from clumsy dogs trigger defensive posturing.";
    handlerInterventionNeed = "Respect distance: Do not force communal pack immersion; in-home pet care is clinically superior.";
  }

  // Adjust score by age
  if (age >= 8.0) {
    baseScore = Math.min(baseScore, 2);
    verdict = 'Contraindicated / In-Home Better';
    badgeColor = 'bg-red-600 text-white';
  } else if (age < 0.6) {
    baseScore = Math.min(baseScore, 3);
    verdict = 'Sensory Overwhelm Risk';
    badgeColor = 'bg-rose-500 text-white';
  }

  const stressSignals = [
    "The 48-Hour Daycare Coma: Sleeping without eating or interacting for 2 days after daycare is chronic neurological exhaustion/burnout, not 'healthy tiredness'.",
    "Doorway Hesitation or Leash Reluctance: Hesitating, turning back to the car, lip-licking, or yawning when approaching the daycare facility entrance.",
    "On-Leash Reactivity Spikes: Sudden barking or lunging at neighborhood dogs on regular walks (caused by constant barrier-free adrenaline spikes at daycare).",
    "Appeasement Posture & Hiding: Clinging to staff members' legs, jumping into staff laps, or staying underneath playground equipment away from the pack.",
    "Post-Daycare Touch Sensitivity: Snapping or flinching when touched on the ears, neck, or paws due to unobserved rough play or physical soreness."
  ];

  const modernWorkingParentAlternatives = [
    {
      title: "Midday 30-Minute Solo 'Sniffari' Dog Walker",
      benefit: "Zero pack stress, 100% agency and olfactory fulfillment",
      implementation: "Hire a bonded local dog walker to visit at hour 4 or 5 of your workday. A 30-minute slow sniff walk fulfills mental needs without the noise of 30 barking dogs."
    },
    {
      title: "Structured Half-Day Daycare (9:00 AM - 1:00 PM)",
      benefit: "Captures social play without late-afternoon fatigue and cortisol spikes",
      implementation: "Pick up your dog (or use a pet taxi service) at lunchtime. They return home to sleep through your remaining work hours in their quiet sanctuary."
    },
    {
      title: "The Workday Enriched Home Environment Protocol",
      benefit: "Safe autonomous enrichment inside your familiar home sanctuary",
      implementation: "Prepare 2 frozen Kongs/lick mats with pumpkin and yogurt. Leave an unprinted cardboard shredding box, play DogTV or Through a Dog's Ear classical music, and provide a secure resting den."
    },
    {
      title: "Private 1-on-1 Neighbor Canine Co-op",
      benefit: "Predictable, low-stress social bonding with a single compatible friend",
      implementation: "Partner with a neighbor who has a dog of similar play style and size. Alternate days where one dog visits the other's yard for 45 minutes of gentle backyard play."
    }
  ];

  const facilityEvaluationChecklist = [
    "Mandatory 2-Hour Quiet Naptime: Does the facility enforce scheduled dark, quiet crate/room rest with soothing audio between 12:00 PM and 2:00 PM?",
    "Staff-to-Dog Ratio Under 1:12: Is there a trained handler actively observing body language for every 10-12 dogs (never 1 staff for 30+ dogs)?",
    "Strict Size & Play-Style Sorting: Are dogs divided not just by weight, but by energy level (gentle seniors separate from hyperactive adolescents)?",
    "Live Unrestricted Webcams: Can you check video streams at any moment during the day to ensure your dog is not cornered or stressed?",
    "Flooring Cushioning: Are play areas equipped with high-grip rubber mats rather than slick concrete or hard epoxy that tears canine ACLs?"
  ];

  return {
    suitabilityScore: baseScore,
    verdict,
    verdictBadgeColor: badgeColor,
    breedCopingMechanism: copingMechanism,
    packDynamicRole: packRole,
    arousalRiskFactor,
    handlerInterventionNeed,
    ageSpecificReality: ageReality,
    allLifeStagesDaycareMatrix: ALL_LIFE_STAGES_DAYCARE_MATRIX,
    modernPressures: MODERN_DAYCARE_PRESSURES,
    stressSignals,
    modernWorkingParentAlternatives,
    facilityEvaluationChecklist
  };
}


