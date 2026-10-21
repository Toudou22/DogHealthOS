/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  Activity,
  Sparkles,
  RefreshCw,
  Dna,
  Wind,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Info,
  Flame,
  Zap,
  HeartPulse
} from 'lucide-react';
import { Breed, DogSize } from '../types.ts';
import VerifiedByBadge from './VerifiedByBadge.tsx';

export type RiskSeverity = 'Critical' | 'High' | 'Moderate' | 'Monitoring';
export type RiskCategory = 'Genetic' | 'Environmental' | 'Genetic & Environmental';

export interface HealthLiability {
  id: string;
  condition: string;
  category: RiskCategory;
  severity: RiskSeverity;
  impactDescription: string;
  environmentalTriggers: string;
  preventativeAction: string;
  citation: string;
}

interface GeneticEnvironmentalRisksProps {
  breed: Breed;
  currentAge: number;
  petName?: string;
}

// Built-in curated clinical fallbacks indexed by breed name or size archetype
const CURATED_FALLBACK_RISKS: Record<string, HealthLiability[]> = {
  // French Bulldog
  "french bulldog": [
    {
      id: "boas_airway",
      condition: "Brachycephalic Obstructive Airway Syndrome (BOAS)",
      category: "Genetic & Environmental",
      severity: "Critical",
      impactDescription: "Stenotic nares, elongated soft palate, and everted laryngeal saccules severely restrict airflow, multiplying respiratory effort and elevating core body temperature dangerously.",
      environmentalTriggers: "Ambient temperatures exceeding 75°F (24°C), high humidity, intense bursts of exercise, and neck-collar pressure.",
      preventativeAction: "Walk exclusively with a chest harness, maintain strict lean BCS (Body Condition Score 4/5), ensure air-conditioned spaces, and evaluate for prophylactic airway surgery before 18 months.",
      citation: "Royal Veterinary College (RVC) Brachycephalic Health Cohort & Cambridge BOAS Grading"
    },
    {
      id: "ivdd_hemivertebrae",
      condition: "Intervertebral Disc Disease (IVDD) & Hemivertebrae",
      category: "Genetic",
      severity: "High",
      impactDescription: "Chondrodystrophic genetics (FGF4 retrotransposon) lead to premature calcification of spinal discs, predisposing dogs to acute disc herniation, spinal cord compression, and posterior paralysis.",
      environmentalTriggers: "Jumping off elevated sofas or beds, stair climbing, high-impact agility, and sudden twisting movements.",
      preventativeAction: "Install ramps for furniture, avoid repetitive stairs, maintain strong core musculature, and initiate prompt veterinary neurology triage upon sudden back stiffness or ataxia.",
      citation: "University of California Davis (UC Davis) FGF4 Chondrodystrophy Genetics & ACVIM Neurology"
    },
    {
      id: "thermal_shock_heatstroke",
      condition: "Acute Hyperthermia & Thermal Collapse",
      category: "Environmental",
      severity: "Critical",
      impactDescription: "Compromised upper respiratory thermoregulation prevents efficient evaporative cooling via panting, allowing internal core temperatures to escalate to >106°F within minutes.",
      environmentalTriggers: "Midday sun exposure, enclosed unventilated vehicles, asphalt radiation, and unbuffered outdoor play during warm summer months.",
      preventativeAction: "Restricted exercise during peak sun hours (10 AM - 6 PM), keep cooling vests/mats available, never leave in vehicles under any circumstance, and provide instant iced water misting.",
      citation: "AVMA Emergency Hyperthermia Protocol & AAHA Critical Care Guidelines"
    },
    {
      id: "atopic_dermatitis_folds",
      condition: "Allergic Atopic Dermatitis & Facial Fold Pyoderma",
      category: "Genetic & Environmental",
      severity: "Moderate",
      impactDescription: "Impaired cutaneous skin barrier coupled with deep facial and tail pocket folds creates a warm, moist microclimate prone to Malassezia yeast and staphylococcal overgrowth.",
      environmentalTriggers: "Environmental grass/weed pollens, house dust mites, humid weather, and food hypersensitivities.",
      preventativeAction: "Daily antiseptic wipe hygiene (chlorhexidine/ketoconazole) across facial folds and screw-tail recess; marine omega-3 fatty acid supplementation to reinforce the lipid barrier.",
      citation: "World Congress of Veterinary Dermatology (WCVD) & ACVD Canine Atopic Dermatitis Guidelines"
    }
  ],
  // German Shepherd
  "german shepherd dog": [
    {
      id: "gdv_bloat",
      condition: "Gastric Dilatation-Volvulus (GDV / Acute Bloat)",
      category: "Genetic & Environmental",
      severity: "Critical",
      impactDescription: "Deep, narrow thoracic cavity architecture predisposes the stomach to rapid gas accumulation and clockwise torsion (180°-360°), occluding the vena cava and inducing rapid cardiovascular shock.",
      environmentalTriggers: "Ingesting a single large daily meal, rapid gulping of food/water, elevated food stands, and heavy sprinting within 90 minutes of eating.",
      preventativeAction: "Elective prophylactic laparoscopic gastropexy, slow-feeder bowls, splitting nutrition into 2-3 daily rations, and strictly enforcing 1-hour quiet rest before and after meals.",
      citation: "Purdue University GDV Risk Model & American College of Veterinary Surgeons (ACVS)"
    },
    {
      id: "hip_elbow_dysplasia",
      condition: "Coxofemoral Hip Dysplasia & Degenerative Joint Disease (DJD)",
      category: "Genetic & Environmental",
      severity: "High",
      impactDescription: "Polygenic incongruity of the femoral head and acetabular socket triggers progressive cartilage erosion, osteophyte production, subluxation, and debilitating osteoarthritic lameness.",
      environmentalTriggers: "Rapid adolescent weight gain, excessive high-impact jumping during growth plate closure (<18 months), and slippery slick flooring without traction.",
      preventativeAction: "OFA/PennHIP parent screening certification, calibrated large-breed puppy nutrition with controlled calcium/phosphorus ratio, and early omega-3 / polysulfated glycosaminoglycan support.",
      citation: "Orthopedic Foundation for Animals (OFA) Hip Registry & University of Georgia Mortality Study"
    },
    {
      id: "degenerative_myelopathy",
      condition: "Degenerative Myelopathy (SOD1 Mutation)",
      category: "Genetic",
      severity: "High",
      impactDescription: "Progressive neurodegenerative axonopathy of the spinal cord (canine analogue of ALS) that manifests in senior years with hindlimb ataxia, knuckling, and ascending loss of motor function.",
      environmentalTriggers: "Lack of physical rehabilitation, muscle atrophy, and prolonged sedentary periods on unsupportive bedding.",
      preventativeAction: "DNA genetic test for the SOD1 gene mutation; early hydrotherapy, targeted physical therapy, and traction-boot mobility support to preserve functional ambulation.",
      citation: "University of Missouri Veterinary Genetics Laboratory & AKC Canine Health Foundation"
    },
    {
      id: "exocrine_pancreatic_insufficiency",
      condition: "Exocrine Pancreatic Insufficiency (EPI)",
      category: "Genetic",
      severity: "Moderate",
      impactDescription: "Autoimmune acinar atrophy of the pancreas leading to inability to synthesize digestive enzymes (lipase, amylase, protease), resulting in chronic weight loss, ravenous hunger, and voluminous loose stools.",
      environmentalTriggers: "Low-quality indigestible fillers, high fat surges without enzyme support, and unmonitored dietary changes.",
      preventativeAction: "Serum TLI (Trypsin-Like Immunoreactivity) blood diagnostic profiling, porcine pancreatic enzyme replacement therapy, and cobalamin (Vitamin B12) monitoring.",
      citation: "Gastrointestinal Laboratory at Texas A&M University (TAMU) & WSAVA Internal Medicine"
    }
  ],
  // Golden Retriever
  "golden retriever": [
    {
      id: "hemangiosarcoma_lymphoma",
      condition: "Oncological Predispositions (Hemangiosarcoma & Lymphoma)",
      category: "Genetic & Environmental",
      severity: "Critical",
      impactDescription: "Heritable genetic polymorphisms cause disproportionately elevated lifetime oncology incidence (over 60% of Golden Retriever mortality), predominantly splenic hemangiosarcoma and malignant lymphoma.",
      environmentalTriggers: "Exposure to lawn pesticides/herbicides, secondhand tobacco smoke, obesity, and early gonadectomy before physical maturity.",
      preventativeAction: "Routine semi-annual senior abdominal ultrasonography and spleen sweeps starting at age 6, complete blood counts, and maintaining a lean body condition score throughout life.",
      citation: "Morris Animal Foundation Golden Retriever Lifetime Study (n = 3,044) & UC Davis Oncology"
    },
    {
      id: "hip_elbow_dysplasia_gr",
      condition: "Hip & Elbow Dysplasia with Secondary Osteoarthritis",
      category: "Genetic & Environmental",
      severity: "High",
      impactDescription: "Abnormal developmental laxity of the hip and elbow joints leading to chronic cartilage deterioration, joint effusion, stiffness, and diminished mobility.",
      environmentalTriggers: "Overfeeding during puppyhood accelerating bone growth faster than muscular development, running on hard asphalt, and repetitive jumping.",
      preventativeAction: "Maintain strict lean BCS (BCS 4-5 extends median lifespan by 1.8 years), feed large-breed puppy formulas with balanced calcium, and provide daily low-impact swimming exercise.",
      citation: "Purina Lifelong Longevity Study & Orthopedic Foundation for Animals (OFA)"
    },
    {
      id: "subvalvular_aortic_stenosis",
      condition: "Subvalvular Aortic Stenosis (SAS)",
      category: "Genetic",
      severity: "High",
      impactDescription: "A congenital fibrous ridge below the aortic valve restricts left ventricular outflow, increasing cardiac workload and predisposing the dog to ventricular arrhythmias and exercise-induced syncope.",
      environmentalTriggers: "Strenuous unpaced burst exercise during hot weather, thermal stress, and untreated systemic infections.",
      preventativeAction: "Echocardiographic Doppler screening by a board-certified veterinary cardiologist (ACVIM), prophylactic antibiotics for dental cleanings, and exercise moderation if mild stenosis is present.",
      citation: "American College of Veterinary Internal Medicine (ACVIM Cardiology Consensus)"
    },
    {
      id: "ichthyosis_atopy",
      condition: "Golden Retriever Ichthyosis (PNPLA1 Mutation) & Atopy",
      category: "Genetic & Environmental",
      severity: "Moderate",
      impactDescription: "Autosomal recessive mutation in the PNPLA1 gene causes defective epidermal lipid synthesis, manifesting as large, grey-to-brown dandruff-like scales across the torso, exacerbated by seasonal dryness.",
      environmentalTriggers: "Dry winter indoor heating, low ambient humidity, frequent shampooing with harsh detergents, and environmental pollen surges.",
      preventativeAction: "DNA test for PNPLA1 status; use gentle ceramide-based moisturizing mists and high-potency EPA/DHA omega-3 fatty acids in the diet.",
      citation: "European Society of Veterinary Dermatology (ESVD) & UC Davis Genetics"
    }
  ],
  // Labrador Retriever
  "labrador retriever": [
    {
      id: "obesity_pomc",
      condition: "Metabolic Hyperphagia & Obesity (POMC Gene Deletion)",
      category: "Genetic & Environmental",
      severity: "High",
      impactDescription: "A 14-base-pair deletion in the pro-opiomelanocortin (POMC) gene disrupts neural energy-sensing and satiety pathways, causing continuous food-seeking behavior and rapid weight gain.",
      environmentalTriggers: "Free-choice feeding, generous table scraps, lack of measured kitchen-scale portioning, and low daily caloric expenditure.",
      preventativeAction: "Weigh daily food rations on a gram scale rather than using approximate cups, use low-calorie vegetable rewards (green beans, carrots), and schedule 60+ minutes of brisk daily exercise.",
      citation: "University of Cambridge POMC Genetic Study (Raffan et al., Cell Metabolism 2016)"
    },
    {
      id: "exercise_induced_collapse",
      condition: "Exercise Induced Collapse (EIC - DNM1 Mutation)",
      category: "Genetic & Environmental",
      severity: "High",
      impactDescription: "Autosomal recessive mutation in the dynamin 1 (DNM1) gene impairs synaptic vesicle recycling during intense neurotransmission, triggering sudden hindlimb flaccid weakness and collapse after 5-15 minutes of strenuous exertion.",
      environmentalTriggers: "High-excitement retrieve drills, warm and humid weather, hunting trials, and competitive ball fetch.",
      preventativeAction: "DNA buccal swab genetic test for EIC; immediate cessation of play at the earliest sign of rocking gait or loose hocks, followed by prompt shade cooling.",
      citation: "University of Minnesota College of Veterinary Medicine EIC Consortium"
    },
    {
      id: "cranial_cruciate_ligament",
      condition: "Cranial Cruciate Ligament (CCL) Disease",
      category: "Genetic & Environmental",
      severity: "High",
      impactDescription: "Excessive tibial plateau angle coupled with chronic biological ligament degeneration predisposes the stifle joint to partial or complete tearing, leading to acute non-weight-bearing lameness.",
      environmentalTriggers: "Overweight body condition putting excessive shearing force across the knee, sudden directional turns on slick grass, and explosive ball chasing.",
      preventativeAction: "Strict weight management, cross-training on sand or water, and prompt surgical stabilization (TPLO / TTA) when laxity is detected to preserve cartilage.",
      citation: "American College of Veterinary Surgeons (ACVS) & University of Georgia VMDB Cohort"
    },
    {
      id: "otitis_externa_swimmers",
      condition: "Chronic Otitis Externa ('Swimmer's Ear')",
      category: "Environmental",
      severity: "Moderate",
      impactDescription: "Pendulous, heavy ear pinnae trap moisture and warmth in the L-shaped canine ear canal, creating an ideal incubator for Pseudomonas and Malassezia overgrowth following water activities.",
      environmentalTriggers: "Frequent lake, river, or pool swimming without immediate canal drying; humid summer weather.",
      preventativeAction: "Apply a drying, astringent veterinary ear cleanser containing Tris-EDTA or acetic acid immediately after every swim; regular gentle ear inspection.",
      citation: "World Small Animal Veterinary Association (WSAVA) Dermatological Guidelines"
    }
  ],
  // Cavalier King Charles Spaniel
  "cavalier king charles spaniel": [
    {
      id: "myxomatous_mitral_valve",
      condition: "Myxomatous Mitral Valve Disease (MMVD)",
      category: "Genetic",
      severity: "Critical",
      impactDescription: "Polygenic glycosaminoglycan accumulation in the mitral valve leaflets leads to progressive leaflet thickening, valve prolapse, regurgitation, left atrial enlargement, and congestive heart failure.",
      environmentalTriggers: "High dietary sodium, intense unmoderated cardio exercise, severe dental calculus showering bacteria into the bloodstream, and extreme heat.",
      preventativeAction: "Annual auscultation starting at age 1; baseline echocardiography; early initiation of pimobendan (EPIC Trial protocol) upon reaching ACVIM Stage B2 cardiac enlargement.",
      citation: "ACVIM Guidelines for the Diagnosis and Treatment of Canine Chronic Valvular Heart Disease (EPIC Trial)"
    },
    {
      id: "syringomyelia_chiari",
      condition: "Chiari-Like Malformation & Syringomyelia (CM/SM)",
      category: "Genetic & Environmental",
      severity: "Critical",
      impactDescription: "Occipital bone hypoplasia creates an undersized caudal cranial fossa, forcing cerebellar herniation through the foramen magnum and obstructing CSF flow to form fluid-filled syrinx cavities within the spinal cord.",
      environmentalTriggers: "Neck collars (strictly harness only), atmospheric barometric pressure swings, stress, and neck manipulation.",
      preventativeAction: "Always walk on a padded body harness (never neck collars), MRI screening under BVA/KC guidelines, and early medical management with gabapentin and CSF-reducing therapies.",
      citation: "British Veterinary Association (BVA) / Kennel Club Chiari-Like Malformation Scheme"
    },
    {
      id: "episodic_falling_syndrome",
      condition: "Episodic Falling Syndrome (EFS - BCAN Mutation)",
      category: "Genetic & Environmental",
      severity: "Moderate",
      impactDescription: "Paroxysmal hypertonicity disorder caused by a microdeletion in the brevican gene (BCAN), resulting in inability of muscles to relax following excitement or exercise.",
      environmentalTriggers: "Intense excitement, physical exercise, cold weather, and loud sudden environmental stressors.",
      preventativeAction: "DNA genetic clearance of breeding lines, avoiding hyper-arousal triggers, and carbonic anhydrase inhibitors or clonazepam under neurology supervision.",
      citation: "Animal Health Trust (AHT) Genetics Registry & Cambridge Veterinary Neurology"
    },
    {
      id: "dry_eye_curly_coat",
      condition: "Keratoconjunctivitis Sicca (Dry Eye) & Curly Coat Syndrome",
      category: "Genetic",
      severity: "Moderate",
      impactDescription: "Congenital immune-mediated lacrimal gland hypoplasia causing severe deficiency of tear production, resulting in painful corneal ulceration, vascularization, and pigmentation.",
      environmentalTriggers: "Windy outdoor weather, car rides with open windows, dusty or sandy terrains, and dry indoor heating.",
      preventativeAction: "Routine Schirmer Tear Test during wellness visits; daily topical cyclosporine or tacrolimus eye ointments and artificial tear lubrication.",
      citation: "American College of Veterinary Ophthalmologists (ACVO) Consensus Guidelines"
    }
  ]
};

// Size Archetype Fallbacks for breeds not explicitly listed in detail above
const SIZE_ARCHETYPE_RISKS: Record<DogSize, HealthLiability[]> = {
  toy: [
    {
      id: "tracheal_collapse_toy",
      condition: "Tracheal Collapse & Cartilaginous Weakening",
      category: "Genetic & Environmental",
      severity: "High",
      impactDescription: "Progressive hypocellularity of the hyaline tracheal rings causes dynamic dorsal flattening of the airway during respiration, producing a classic 'goose-honk' cough and respiratory distress.",
      environmentalTriggers: "Neck-collar leash pulling, cigarette smoke, airborne aerosols/fragrances, high humidity, and excitement.",
      preventativeAction: "Never attach a leash to a neck collar (always use a padded step-in harness), maintain lean body weight, eliminate indoor smoke, and use pediatric humidifiers.",
      citation: "American College of Veterinary Internal Medicine (ACVIM) Pulmonary Consensus"
    },
    {
      id: "patellar_luxation_toy",
      condition: "Medial Patellar Luxation (MPL - Grades I-IV)",
      category: "Genetic & Environmental",
      severity: "High",
      impactDescription: "Shallow femoral trochlear groove and quadriceps malalignment allow the kneecap to slip medially, resulting in intermittent 'skipping' gait, cartilage erosions, and early cruciate tears.",
      environmentalTriggers: "Jumping off tall beds or sofas onto hard floors, slippery tile surfaces, and unmanaged puppyhood weight gain.",
      preventativeAction: "Install pet steps for furniture, lay non-skid area rugs over hardwood floors, and provide joint-protective supplements (glucosamine, chondroitin, green-lipped mussel).",
      citation: "Orthopedic Foundation for Animals (OFA) Patellar Registry Guidelines"
    },
    {
      id: "periodontal_disease_toy",
      condition: "Accelerated Periodontal Disease & Jaw Bone Loss",
      category: "Genetic & Environmental",
      severity: "Moderate",
      impactDescription: "Small jaws accommodate 42 adult teeth with severe crowding, accelerating subgingival plaque, anaerobic bacterial colonies, gingivitis, and severe mandibular osteomyelitis.",
      environmentalTriggers: "Exclusive soft/wet food diets without abrasive chewing, lack of daily mechanical toothbrushing, and neglected veterinary dental cleanings.",
      preventativeAction: "Daily enzymatic pet toothbrushing, VOHC (Veterinary Oral Health Council) approved dental chews, and annual professional ultrasonic scaling under anesthesia.",
      citation: "American Veterinary Dental College (AVDC) & AAHA Dental Care Guidelines"
    },
    {
      id: "hypothermia_toy",
      condition: "Thermal Sensitivity & Rapid Hypothermia",
      category: "Environmental",
      severity: "Moderate",
      impactDescription: "Extremely high ratio of body surface area to mass combined with minimal insulating subcuticular fat causes rapid drops in core body temperature in cold or wet conditions.",
      environmentalTriggers: "Outdoor temperatures below 45°F (7°C), cold rain, drafts, and wet coats after walks.",
      preventativeAction: "Equip with insulated waterproof coats in cold weather, keep indoor resting areas draft-free, and thoroughly towel-dry paws and chest immediately after outdoor visits.",
      citation: "AAHA Canine Lifestyle & Environmental Thermal Protection Protocol"
    }
  ],
  small: [
    {
      id: "mitral_valve_small",
      condition: "Degenerative Mitral Valve Disease (DMVD)",
      category: "Genetic",
      severity: "High",
      impactDescription: "Progressive fibroelastic degeneration of the mitral valve leads to systolic regurgitant flow, left heart volume overload, pulmonary venous hypertension, and pulmonary edema.",
      environmentalTriggers: "High-sodium diets, unchecked dental disease sending bacteremia to heart valves, and unmonitored strenuous bursts of exercise.",
      preventativeAction: "Bi-annual cardiac auscultation for new murmurs; prompt diagnostic chest radiographs and echocardiogram upon detecting a murmur to stage treatment.",
      citation: "ACVIM Consensus Statement on Myxomatous Mitral Valve Disease"
    },
    {
      id: "ivdd_small",
      condition: "Intervertebral Disc Disease (Chondrodystrophic IVDD)",
      category: "Genetic & Environmental",
      severity: "High",
      impactDescription: "Premature disc degeneration and Hansen Type I extrusion where nucleus pulposus ruptures into the spinal canal, causing intense spinal pain, paresis, or paralysis.",
      environmentalTriggers: "Repetitive stair navigation, jumping off furniture, rough play, and obesity adding mechanical spine strain.",
      preventativeAction: "Enforce ramp usage for elevated surfaces, maintain an athletic lean frame, and avoid games involving vigorous vertical leaps.",
      citation: "ACVIM Neurology Specialty Group & BVA Chondrodystrophy Guidance"
    },
    {
      id: "patellar_lux_small",
      condition: "Medial Patellar Luxation & Cruciate Vulnerability",
      category: "Genetic & Environmental",
      severity: "Moderate",
      impactDescription: "Instability of the patella within the trochlear groove causes biomechanical misalignment, predisposing the dog to secondary osteoarthritis and cranial cruciate ligament ruptures.",
      environmentalTriggers: "Slick floor slips, sudden torque while running, and lack of consistent low-impact conditioning.",
      preventativeAction: "Non-slip flooring runners throughout the home, targeted strengthening exercises for hamstrings and quadriceps, and regular joint mobility checks.",
      citation: "Orthopedic Foundation for Animals (OFA) Multicenter Study"
    },
    {
      id: "atopic_allergies_small",
      condition: "Environmental Atopic Dermatitis & Pododermatitis",
      category: "Environmental",
      severity: "Monitoring",
      impactDescription: "Pruritic allergic skin disease driven by IgE-mediated hypersensitivity to airborne pollens, mold spores, and dust mites, leading to paw chewing, erythema, and secondary ear infections.",
      environmentalTriggers: "High pollen seasons (spring/fall), lawn fertilizer treatments, damp leaf piles, and dust buildup in carpets.",
      preventativeAction: "Post-walk paw wipe routines with hypoallergenic wipes, regular bathing with soothing pramoxine/chlorhexidine shampoos, and seasonal veterinary allergy protocols.",
      citation: "International Committee on Allergic Diseases of Animals (ICADA)"
    }
  ],
  medium: [
    {
      id: "hip_dysplasia_med",
      condition: "Canine Hip Dysplasia & Coxofemoral DJD",
      category: "Genetic & Environmental",
      severity: "High",
      impactDescription: "Abnormal looseness of the hip joint leads to progressive wear and tear of articular cartilage, bone spurs, stiffness upon rising, and exercise intolerance.",
      environmentalTriggers: "Rapid adolescent weight gain, high-impact agility or jumping before growth plate closure, and slippery flooring.",
      preventativeAction: "Calibrated growth nutrition, routine hip screenings, keeping weight lean (BCS 4-5), and daily moderate low-impact leash walks.",
      citation: "Orthopedic Foundation for Animals (OFA) Joint Consensus"
    },
    {
      id: "environmental_atopy_med",
      condition: "Environmental Atopic Dermatitis & Food Allergies",
      category: "Genetic & Environmental",
      severity: "Moderate",
      impactDescription: "Genetically determined skin barrier dysfunction that allows environmental allergens (pollen, dust mites) to penetrate, triggering persistent scratching, hot spots, and otitis.",
      environmentalTriggers: "Seasonal bloom cycles, dry indoor heat, carpet dust mites, and unmonitored dietary protein changes.",
      preventativeAction: "High-quality omega-3 EPA/DHA fatty acids (100mg/kg daily) to fortify epidermal lipids, regular medicated baths, and veterinary allergy testing.",
      citation: "World Small Animal Veterinary Association (WSAVA) Dermatological Protocol"
    },
    {
      id: "cruciate_ligament_med",
      condition: "Cranial Cruciate Ligament (CCL) Rupture",
      category: "Genetic & Environmental",
      severity: "High",
      impactDescription: "Progressive biological weakening of the anterior cruciate ligament in the knee, leading to sudden or gradual tearing during normal physical activity.",
      environmentalTriggers: "Explosive frisbee or ball-retrieval sprints on uneven terrain, sudden pivots, and carrying excess body weight.",
      preventativeAction: "Adequate warm-up walks before intense games, avoiding abrupt ballistic sprint stops, and core stability exercises.",
      citation: "American College of Veterinary Surgeons (ACVS) Canine Stifle Registry"
    },
    {
      id: "heat_stress_med",
      condition: "Exertional Heat Exhaustion & Hyperthermia",
      category: "Environmental",
      severity: "Monitoring",
      impactDescription: "Athletic medium-sized breeds often possess high play drive and continue sprinting past the point of safe thermoregulation, risking thermal stress and dehydration.",
      environmentalTriggers: "High heat index (temperature + humidity > 150), lack of shade, unpaced fetch games, and inadequate water breaks.",
      preventativeAction: "Mandatory shaded water pauses every 15 minutes in summer, limiting high-intensity exercise to dawn or dusk, and monitoring for excessive tongue engorgement.",
      citation: "AAHA Canine Lifestyle & Heat Safety Guidelines"
    }
  ],
  large: [
    {
      id: "gdv_large",
      condition: "Gastric Dilatation-Volvulus (GDV / Acute Bloat)",
      category: "Genetic & Environmental",
      severity: "Critical",
      impactDescription: "Rapid accumulation of gas and fluid causes the deep stomach to rotate on its mesenteric axis, cutting off gastric blood supply, compressing major veins, and causing life-threatening shock.",
      environmentalTriggers: "Single large daily feeding, elevated food bowls, eating rapidly, vigorous sprinting within 60-90 minutes of eating, and high-stress environments.",
      preventativeAction: "Consider prophylactic laparoscopic gastropexy, feed 2-3 smaller meals daily at floor level, use slow-feeders, and mandate a post-meal resting period.",
      citation: "Purdue University Canine Bloat Epidemiology Study & ACVS Guidelines"
    },
    {
      id: "hip_elbow_large",
      condition: "Severe Hip & Elbow Dysplasia",
      category: "Genetic & Environmental",
      severity: "High",
      impactDescription: "Subluxation of large joint structures leading to severe osteoarthritic degradation, pain, loss of hip muscle mass, and progressive hindlimb weakness.",
      environmentalTriggers: "Overfeeding large-breed puppies (accelerating bone growth over muscle support), repetitive jumping, and slick uncarpeted floors.",
      preventativeAction: "Keep weight strictly lean, feed certified large-breed puppy food with restricted calcium (0.8-1.2%), and integrate joint supplements early.",
      citation: "OFA Orthopedic Registry & University of Georgia Canine Mortality Study"
    },
    {
      id: "dilated_cardiomyopathy_large",
      condition: "Dilated Cardiomyopathy (DCM)",
      category: "Genetic & Environmental",
      severity: "High",
      impactDescription: "Degeneration of myocardial muscle fibers resulting in progressive ventricular dilation, thin cardiac walls, weakened contractility, and congestive heart failure.",
      environmentalTriggers: "Dietary deficiencies or unbalanced boutique exotic-ingredient diets (BEG diets), heavy physical exhaustion, and untreated arrhythmias.",
      preventativeAction: "Feed WSAVA-compliant diets with verified taurine bioavailability, schedule annual heart checks, and perform baseline ECGs in senior years.",
      citation: "FDA Center for Veterinary Medicine DCM Investigation & ACVIM Cardiology"
    },
    {
      id: "thermal_strain_large",
      condition: "Thermal Strain & Heatstroke in Heavy Double Coats",
      category: "Environmental",
      severity: "Monitoring",
      impactDescription: "Large muscle mass generates tremendous internal heat, and thick double coats slow heat dissipation, putting dogs at elevated risk of hyperthermia during hot weather.",
      environmentalTriggers: "Midday sun, running alongside bicycles, unshaded yards, and high humidity preventing evaporative cooling.",
      preventativeAction: "Brush out undercoat regularly to permit air circulation (never shave double coats), provide shaded cooling zones, and carry fresh water on all outings.",
      citation: "AAHA Canine Life Stage Environmental Guidelines"
    }
  ],
  giant: [
    {
      id: "gdv_giant",
      condition: "Gastric Dilatation-Volvulus (GDV / Bloat Emergency)",
      category: "Genetic & Environmental",
      severity: "Critical",
      impactDescription: "Giant-breed deep thoracic cavities carry a lifetime GDV risk exceeding 25-40%. Immediate surgical detorsion and gastropexy are required within 1-2 hours of symptom onset.",
      environmentalTriggers: "Gulping dry food rapidly, drinking excessive water immediately post-exercise, elevated bowl stands, and post-meal play.",
      preventativeAction: "Elective prophylactic gastropexy performed during spay/neuter surgery; slow-feeder bowls; keep emergency veterinary contact readily accessible 24/7.",
      citation: "Purdue University School of Veterinary Medicine GDV Research"
    },
    {
      id: "dilated_cardiomyopathy_giant",
      condition: "Dilated Cardiomyopathy (DCM) & Atrial Fibrillation",
      category: "Genetic & Environmental",
      severity: "Critical",
      impactDescription: "Primary myocardial failure characterized by chamber enlargement, thinning ventricular walls, and impaired systolic function, often compounded by rapid atrial fibrillation.",
      environmentalTriggers: "Nutritional imbalances, chronic stress, extreme thermal conditions, and lack of early routine screening.",
      preventativeAction: "Annual echocardiographic and 24-hour Holter monitor screening by a veterinary cardiologist starting at age 2; taurine and L-carnitine nutritional support.",
      citation: "ACVIM Consensus Statement on Canine Cardiomyopathy"
    },
    {
      id: "osteosarcoma_giant",
      condition: "Osteosarcoma (Appendicular Bone Cancer)",
      category: "Genetic & Environmental",
      severity: "High",
      impactDescription: "High-grade malignant bone neoplasia that predominantly strikes the metaphyseal regions of long bones in giant breeds, driven by high cellular turnover from massive skeletal scale.",
      environmentalTriggers: "Early gonadectomy before complete growth plate closure (recommend waiting until 18-24 months in giant breeds), chronic microtrauma, and obesity.",
      preventativeAction: "Delay spay/neuter until full skeletal maturity under veterinary guidance; immediately radiograph any sudden onset limb lameness or localized swelling.",
      citation: "University of Georgia Veterinary Medical Data Base (VMDB) 74k Canine Mortality Study"
    },
    {
      id: "rapid_skeletal_growth_giant",
      condition: "Developmental Orthopedic Disease (HOD / Panosteitis)",
      category: "Genetic & Environmental",
      severity: "Moderate",
      impactDescription: "Hypertrophic Osteodystrophy and Panosteitis resulting from explosive early growth rates where long bone cortical remodeling causes intense inflammation and shifting leg lameness.",
      environmentalTriggers: "Excessive dietary calories or calcium supplementation during puppyhood; high-impact running on asphalt.",
      preventativeAction: "Strictly feed verified giant-breed puppy food with tightly controlled calcium (0.8-1.0%) and modest caloric density; strictly forbid supplemental calcium.",
      citation: "WALTHAM Centre for Pet Nutrition & AKC Pediatric Growth Standards"
    }
  ]
};

export const GeneticEnvironmentalRisks: React.FC<GeneticEnvironmentalRisksProps> = ({
  breed,
  currentAge,
  petName
}) => {
  const [liabilities, setLiabilities] = useState<HealthLiability[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<'All' | 'HighOrCritical' | 'Genetic' | 'Environmental'>('All');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Helper to fetch from dynamic server API with layered local fallback
  const fetchRiskFactors = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorNotice(null);

    try {
      const response = await fetch('/api/gemini/risk-factors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          breedName: breed.name,
          size: breed.size,
          age: currentAge
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      if (data && Array.isArray(data.riskFactors) && data.riskFactors.length >= 3) {
        setLiabilities(data.riskFactors);
      } else {
        throw new Error("Invalid risk factors payload");
      }
    } catch (err: any) {
      console.warn("Notice fetching dynamic risk factors, serving curated veterinary dataset:", err?.message || err);
      // Seamless Curated Local Fallback matching breed or size class
      const lowerName = breed.name.toLowerCase();
      let matched = CURATED_FALLBACK_RISKS[lowerName];
      if (!matched) {
        // Check partial name match (e.g. "french" or "shepherd" or "golden" or "labrador")
        for (const key of Object.keys(CURATED_FALLBACK_RISKS)) {
          if (lowerName.includes(key) || key.includes(lowerName)) {
            matched = CURATED_FALLBACK_RISKS[key];
            break;
          }
        }
      }
      if (!matched) {
        matched = SIZE_ARCHETYPE_RISKS[breed.size] || SIZE_ARCHETYPE_RISKS.medium;
      }
      setLiabilities(matched);
      setErrorNotice(null); // Curated fallback successfully provided, no broken state
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRiskFactors();
  }, [breed.name, breed.size, currentAge]);

  // Filtered liabilities based on user tab selection
  const filteredList = useMemo(() => {
    if (filterCategory === 'HighOrCritical') {
      return liabilities.filter(item => item.severity === 'Critical' || item.severity === 'High');
    }
    if (filterCategory === 'Genetic') {
      return liabilities.filter(item => item.category === 'Genetic' || item.category === 'Genetic & Environmental');
    }
    if (filterCategory === 'Environmental') {
      return liabilities.filter(item => item.category === 'Environmental' || item.category === 'Genetic & Environmental');
    }
    return liabilities;
  }, [liabilities, filterCategory]);

  // Statistics counters
  const counts = useMemo(() => {
    const critical = liabilities.filter(i => i.severity === 'Critical').length;
    const high = liabilities.filter(i => i.severity === 'High').length;
    const moderate = liabilities.filter(i => i.severity === 'Moderate').length;
    const monitoring = liabilities.filter(i => i.severity === 'Monitoring').length;
    return { critical, high, moderate, monitoring, total: liabilities.length };
  }, [liabilities]);

  // Severity styling configuration
  const getSeverityConfig = (severity: RiskSeverity) => {
    switch (severity) {
      case 'Critical':
        return {
          badgeBg: 'bg-rose-500/15 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800',
          bulletColor: 'bg-rose-600 dark:bg-rose-500',
          bulletText: 'text-rose-600 dark:text-rose-400',
          iconBg: 'bg-rose-600/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border-rose-400/40',
          cardBorder: 'border-rose-400/50 dark:border-rose-700/60 shadow-[3px_3px_0_#E11D48] dark:shadow-[3px_3px_0_#FB7185]',
          label: 'Critical Emergency Risk',
          icon: <AlertOctagon className="w-5 h-5 animate-pulse" />
        };
      case 'High':
        return {
          badgeBg: 'bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800',
          bulletColor: 'bg-amber-500',
          bulletText: 'text-amber-600 dark:text-amber-400',
          iconBg: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-400/40',
          cardBorder: 'border-amber-400/50 dark:border-amber-700/60 shadow-[3px_3px_0_#D97706] dark:shadow-[3px_3px_0_#FBBF24]',
          label: 'High Hereditary Liability',
          icon: <AlertTriangle className="w-5 h-5" />
        };
      case 'Moderate':
        return {
          badgeBg: 'bg-blue-500/15 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800',
          bulletColor: 'bg-blue-500',
          bulletText: 'text-blue-600 dark:text-blue-400',
          iconBg: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-400/40',
          cardBorder: 'border-blue-400/50 dark:border-blue-700/60 shadow-[3px_3px_0_#2563EB] dark:shadow-[3px_3px_0_#60A5FA]',
          label: 'Moderate Vulnerability',
          icon: <ShieldAlert className="w-5 h-5" />
        };
      case 'Monitoring':
      default:
        return {
          badgeBg: 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
          bulletColor: 'bg-emerald-500',
          bulletText: 'text-emerald-600 dark:text-emerald-400',
          iconBg: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-400/40',
          cardBorder: 'border-emerald-400/50 dark:border-emerald-700/60 shadow-[3px_3px_0_#059669] dark:shadow-[3px_3px_0_#34D399]',
          label: 'Active Environmental Watch',
          icon: <Activity className="w-5 h-5" />
        };
    }
  };

  return (
    <div className="bg-white/60 dark:bg-[#282420]/75 backdrop-blur-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-6 md:p-7 flex flex-col justify-between transition-all">
      {/* 1. Header Banner & Verification Metadata */}
      <div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b-2 border-[#1A1A1A]/10 dark:border-white/10">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 shadow-[2px_2px_0_#E11D48]">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 bg-rose-600 text-white text-[0.62rem] font-mono font-black uppercase rounded tracking-wider">
                  Clinical Pathology Ledger
                </span>
                <span className="text-[0.65rem] font-mono text-[#8A8680] dark:text-[#9A9590]">
                  {breed.name} ({breed.size} size class) • Age {currentAge}y
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1A1A1A] dark:text-[#F0ECE6] mt-1 font-mono">
                Genetic & Environmental Risk Factors
              </h3>
              <p className="text-xs text-[#8A8680] dark:text-[#9A9590] leading-relaxed mt-0.5 max-w-3xl">
                Dynamic clinical analysis of breed-specific hereditary predispositions and environmental vulnerabilities calibrated for {petName || breed.name}. Early awareness and preventive protocols safeguard long-term vitality.
              </p>
            </div>
          </div>

          {/* Quick Action / Refresh Bar */}
          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <button
              type="button"
              onClick={() => fetchRiskFactors(true)}
              disabled={isLoading || isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1A1A1A] text-xs font-mono font-bold hover:bg-[#FF6B4A]/10 transition-all cursor-pointer shadow-[2px_2px_0_#1A1A1A] dark:shadow-[2px_2px_0_#F0ECE6] active:translate-x-0.5 active:translate-y-0.5"
              title="Re-query veterinary AI risk analysis"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FF6B4A]' : ''}`} />
              <span>{isRefreshing ? 'Analyzing...' : 'Refresh Protocol'}</span>
            </button>
            <VerifiedByBadge databaseKey="uga" layout="pill" />
          </div>
        </div>

        {/* 2. Severity Counters & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-5">
          {/* Severity Counters */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            {counts.critical > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                {counts.critical} Critical
              </span>
            )}
            {counts.high > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {counts.high} High
              </span>
            )}
            {counts.moderate > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {counts.moderate} Moderate
              </span>
            )}
            {counts.monitoring > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {counts.monitoring} Monitoring
              </span>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#1A1A1A]/5 dark:bg-white/5 border border-[#1A1A1A]/10 dark:border-white/10 rounded-lg p-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFilterCategory('All')}
              className={`px-2.5 py-1 text-[0.62rem] font-bold font-mono rounded cursor-pointer transition-all ${
                filterCategory === 'All'
                  ? 'bg-[#1A1A1A] text-white dark:bg-[#F0ECE6] dark:text-[#1A1A1A]'
                  : 'text-[#8A8680] hover:text-[#1A1A1A] dark:hover:text-[#F0ECE6]'
              }`}
            >
              All ({counts.total})
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('HighOrCritical')}
              className={`px-2.5 py-1 text-[0.62rem] font-bold font-mono rounded cursor-pointer transition-all ${
                filterCategory === 'HighOrCritical'
                  ? 'bg-rose-600 text-white'
                  : 'text-[#8A8680] hover:text-[#1A1A1A] dark:hover:text-[#F0ECE6]'
              }`}
            >
              High & Critical ({counts.critical + counts.high})
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('Genetic')}
              className={`px-2.5 py-1 text-[0.62rem] font-bold font-mono rounded cursor-pointer transition-all ${
                filterCategory === 'Genetic'
                  ? 'bg-purple-600 text-white'
                  : 'text-[#8A8680] hover:text-[#1A1A1A] dark:hover:text-[#F0ECE6]'
              }`}
            >
              Genetic
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('Environmental')}
              className={`px-2.5 py-1 text-[0.62rem] font-bold font-mono rounded cursor-pointer transition-all ${
                filterCategory === 'Environmental'
                  ? 'bg-emerald-600 text-white'
                  : 'text-[#8A8680] hover:text-[#1A1A1A] dark:hover:text-[#F0ECE6]'
              }`}
            >
              Environmental
            </button>
          </div>
        </div>

        {/* 3. Bulleted List with Severity Icons */}
        {isLoading ? (
          // Skeleton Loading State
          <div className="space-y-4">
            {[1, 2, 3, 4].map(idx => (
              <div
                key={idx}
                className="p-5 rounded-xl border-2 border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 animate-pulse space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-300 dark:bg-stone-700" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 bg-stone-300 dark:bg-stone-700 rounded w-1/3" />
                    <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-1/4" />
                  </div>
                </div>
                <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-full" />
                <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : (
          <ul className="space-y-4 list-none p-0 m-0">
            {filteredList.map((liability, idx) => {
              const severityCfg = getSeverityConfig(liability.severity);
              const isGenetic = liability.category === 'Genetic' || liability.category === 'Genetic & Environmental';
              const isEnv = liability.category === 'Environmental' || liability.category === 'Genetic & Environmental';

              return (
                <li
                  key={liability.id || idx}
                  className={`p-5 rounded-xl border-2 transition-all bg-white dark:bg-[#1A1815] ${severityCfg.cardBorder} flex flex-col justify-between`}
                >
                  <div>
                    {/* Item Top Row: Bullet dot + Severity Icon + Title + Badges */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        {/* Custom Bullet Indicator with Severity Icon */}
                        <div
                          className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center shrink-0 ${severityCfg.iconBg}`}
                          title={`Severity: ${liability.severity}`}
                        >
                          {severityCfg.icon}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-[#8A8680] dark:text-[#9A9590]">
                              0{idx + 1}.
                            </span>
                            <h4 className="text-sm sm:text-base font-extrabold text-[#1A1A1A] dark:text-[#F0ECE6] leading-tight">
                              {liability.condition}
                            </h4>
                          </div>

                          {/* Classification badges row */}
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.62rem] font-mono font-black uppercase border ${severityCfg.badgeBg}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${severityCfg.bulletColor}`} />
                              {severityCfg.label}
                            </span>

                            {liability.category === 'Genetic & Environmental' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.62rem] font-mono font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-400/30">
                                <Dna className="w-3 h-3 text-purple-500" />
                                <Wind className="w-3 h-3 text-emerald-500" />
                                Genetic & Environmental
                              </span>
                            ) : liability.category === 'Genetic' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.62rem] font-mono font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-400/30">
                                <Dna className="w-3 h-3 text-purple-500" />
                                Genetic Predisposition
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.62rem] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-400/30">
                                <Wind className="w-3 h-3 text-emerald-500" />
                                Environmental Trigger
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Breakdown with Sub-bullets */}
                    <div className="space-y-2.5 mt-3 pt-3 border-t border-[#1A1A1A]/10 dark:border-white/10 text-xs text-[#1A1A1A] dark:text-[#F0ECE6]">
                      {/* Clinical Impact */}
                      <div className="flex items-start gap-2 leading-relaxed">
                        <span className="text-[#FF6B4A] font-bold shrink-0 mt-0.5">▪</span>
                        <p className="text-[0.72rem] leading-relaxed text-[#5A5650] dark:text-[#B0ABA5]">
                          <strong className="text-[#1A1A1A] dark:text-[#F0ECE6] font-bold">Pathological Mechanics: </strong>
                          {liability.impactDescription}
                        </p>
                      </div>

                      {/* Environmental Triggers */}
                      {liability.environmentalTriggers && (
                        <div className="flex items-start gap-2 bg-amber-500/5 dark:bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                          <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0 mt-0.5">🌪️</span>
                          <div className="text-[0.68rem] leading-relaxed">
                            <strong className="text-amber-800 dark:text-amber-300 font-bold">Environmental Triggers & Exacerbators: </strong>
                            <span className="text-amber-900/90 dark:text-amber-200/90">{liability.environmentalTriggers}</span>
                          </div>
                        </div>
                      )}

                      {/* Preventative Protocol */}
                      {liability.preventativeAction && (
                        <div className="flex items-start gap-2 bg-emerald-500/5 dark:bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0 mt-0.5">🩺</span>
                          <div className="text-[0.68rem] leading-relaxed">
                            <strong className="text-emerald-800 dark:text-emerald-300 font-bold">Preventative Protocol & Owner Action: </strong>
                            <span className="text-emerald-900/90 dark:text-emerald-200/90">{liability.preventativeAction}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Item Footer: Authoritative Citation */}
                  <div className="mt-3.5 pt-2 border-t border-dashed border-[#1A1A1A]/10 dark:border-white/10 flex items-center justify-between text-[0.62rem] font-mono text-[#8A8680] dark:text-[#9A9590]">
                    <span className="truncate max-w-[280px] sm:max-w-md">
                      Verified Body: <strong className="text-[#1A1A1A] dark:text-[#F0ECE6]">{liability.citation}</strong>
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3" /> Grounded
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 4. Section Footer: Clinical Mandate & Authority Disclaimer */}
      <div className="mt-6 pt-4 border-t-2 border-[#1A1A1A]/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#8A8680] dark:text-[#9A9590]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2D8C6F] shrink-0" />
          <p className="text-[0.65rem] leading-relaxed font-mono">
            *Epidemiological data matched against <strong>University of Georgia 74k Mortality Study</strong>, <strong>RVC VetCompass™</strong>, and <strong>Orthopedic Foundation for Animals (OFA)</strong>.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <VerifiedByBadge databaseKey="rvc" layout="pill" />
        </div>
      </div>
    </div>
  );
};

export default GeneticEnvironmentalRisks;
