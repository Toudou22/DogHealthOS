import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  Crown, Shield, Sparkles, X, Plus, Trash2, Edit3, Download, Printer, 
  Check, AlertTriangle, Heart, Calendar, Baby, Users, FileText, 
  Activity, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2, ChevronRight,
  Eye, Award, QrCode, Search, Phone, Mail, MapPin, DollarSign, Copy,
  Dna, Flame, Scale, Clock, Sliders, ExternalLink, Headphones, Volume2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Breed } from '../types';
import ALL_BREEDS from '../breeds';
import { logUserAction } from '../utils/firebaseHelper';
import { generateFrenchieHandoffPacketPDF } from '../utils/pdfDocumentGenerator';

interface BreederProSuiteProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'dashboard' | 'passports' | 'genetics' | 'nutrition' | 'adopters';
  onOpenAudioPassport?: (puppy?: PuppyRecord) => void;
}

// -------------------------------------------------------------
// Core Data Interfaces
// -------------------------------------------------------------

export interface PuppyRecord {
  id: string;
  litterId: string;
  collarColor: string;
  collarHex: string;
  callName: string;
  sex: 'Male' | 'Female';
  birthWeightOz: number;
  currentWeightLbs: number;
  microchipId: string;
  coatColor: string;
  status: 'Available' | 'Reserved' | 'Placed';
  assignedAdopterId?: string;
  assignedAdopterName?: string;
  vaccines: {
    dhpp1: boolean;
    dhpp2: boolean;
    bordetella: boolean;
    dewormingCount: number;
  };
  vetExamPassed: boolean;
  notes?: string;
}

export interface LitterRecord {
  id: string;
  litterCode: string;
  breedName: string;
  damName: string;
  damRegistration: string;
  sireName: string;
  sireRegistration: string;
  matingDate: string;
  whelpingDate: string;
  status: 'Gestation' | 'Nursing' | 'Weaning' | 'Ready' | 'Completed';
  puppiesCount: number;
  puppies: PuppyRecord[];
}

export interface AdopterProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  cityState: string;
  status: 'Inquiry' | 'Deposit Paid' | 'Approved' | 'Contract Signed' | 'Placed';
  preferredBreed: string;
  preferredSex: 'Any' | 'Male' | 'Female';
  depositAmount: number;
  totalFee: number;
  assignedPuppyId?: string;
  assignedPuppyName?: string;
  litterCode?: string;
  homeChecked: boolean;
  contractSigned: boolean;
  healthPassportDelivered: boolean;
  applicationDate: string;
  lifestyleNotes: string;
}

export interface KennelProfile {
  kennelName: string;
  breederName: string;
  akcId: string;
  email: string;
  phone: string;
  website: string;
  cityState: string;
  vetClinicName: string;
  vetDoctorName: string;
}

// -------------------------------------------------------------
// Initial Seed Data
// -------------------------------------------------------------

const DEFAULT_KENNEL: KennelProfile = {
  kennelName: "Silver Pine Heritage Kennels",
  breederName: "Anthony Toudou (Breeder of Merit)",
  akcId: "AKC-MERIT-88412",
  email: "anthonytoudou@gmail.com",
  phone: "(555) 382-9014",
  website: "www.silverpinecanine.com",
  cityState: "San Francisco, CA",
  vetClinicName: "Golden Gate Veterinary Medical Center",
  vetDoctorName: "Dr. Eleanor Vance, DVM, DACVIM"
};

const INITIAL_LITTERS: LitterRecord[] = [
  {
    id: "litter_1",
    litterCode: "2026-GLD-A",
    breedName: "Golden Retriever",
    damName: "CH Silver Pine Golden Aurora CDX JH (OFA Good, Eyes Clear)",
    damRegistration: "AKC SS19283701",
    sireName: "GCHB Summit Ridge Apollo CGC TKN (OFA Excellent, Cardiac Clear)",
    sireRegistration: "AKC SS28391004",
    matingDate: "2026-05-10",
    whelpingDate: "2026-07-12",
    status: "Weaning",
    puppiesCount: 6,
    puppies: [
      {
        id: "pup_1_1",
        litterId: "litter_1",
        collarColor: "Royal Blue",
        collarHex: "#2563EB",
        callName: "Atlas",
        sex: "Male",
        birthWeightOz: 15.2,
        currentWeightLbs: 9.4,
        microchipId: "985141003849101",
        coatColor: "Dark Golden",
        status: "Reserved",
        assignedAdopterId: "adopter_1",
        assignedAdopterName: "Dr. Marcus Sterling",
        vaccines: { dhpp1: true, dhpp2: true, bordetella: true, dewormingCount: 3 },
        vetExamPassed: true,
        notes: "Excellent bone density, confident retrieve drive."
      },
      {
        id: "pup_1_2",
        litterId: "litter_1",
        collarColor: "Ruby Red",
        collarHex: "#DC2626",
        callName: "Bella",
        sex: "Female",
        birthWeightOz: 13.8,
        currentWeightLbs: 8.7,
        microchipId: "985141003849102",
        coatColor: "Light Golden",
        status: "Reserved",
        assignedAdopterId: "adopter_2",
        assignedAdopterName: "Samantha & David Hayes",
        vaccines: { dhpp1: true, dhpp2: true, bordetella: true, dewormingCount: 3 },
        vetExamPassed: true,
        notes: "Sweet biddable temperament, gentle with children."
      },
      {
        id: "pup_1_3",
        litterId: "litter_1",
        collarColor: "Emerald Green",
        collarHex: "#059669",
        callName: "Cooper",
        sex: "Male",
        birthWeightOz: 16.1,
        currentWeightLbs: 9.8,
        microchipId: "985141003849103",
        coatColor: "Golden",
        status: "Reserved",
        assignedAdopterId: "adopter_3",
        assignedAdopterName: "Elena Rostova",
        vaccines: { dhpp1: true, dhpp2: true, bordetella: true, dewormingCount: 3 },
        vetExamPassed: true,
        notes: "Highest energy in litter, ideal for agility or hunt work."
      },
      {
        id: "pup_1_4",
        litterId: "litter_1",
        collarColor: "Lavender Purple",
        collarHex: "#9333EA",
        callName: "Daisy",
        sex: "Female",
        birthWeightOz: 14.0,
        currentWeightLbs: 8.9,
        microchipId: "985141003849104",
        coatColor: "Medium Golden",
        status: "Available",
        vaccines: { dhpp1: true, dhpp2: true, bordetella: true, dewormingCount: 3 },
        vetExamPassed: true,
        notes: "Biddable, inquisitive, very calm disposition."
      },
      {
        id: "pup_1_5",
        litterId: "litter_1",
        collarColor: "Sunburst Orange",
        collarHex: "#EA580C",
        callName: "Duke",
        sex: "Male",
        birthWeightOz: 14.9,
        currentWeightLbs: 9.1,
        microchipId: "985141003849105",
        coatColor: "Golden",
        status: "Available",
        vaccines: { dhpp1: true, dhpp2: false, bordetella: true, dewormingCount: 3 },
        vetExamPassed: true,
        notes: "Thick coat, broad skull, classic show prospect."
      },
      {
        id: "pup_1_6",
        litterId: "litter_1",
        collarColor: "Rose Pink",
        collarHex: "#DB2777",
        callName: "Flora",
        sex: "Female",
        birthWeightOz: 12.9,
        currentWeightLbs: 8.2,
        microchipId: "985141003849106",
        coatColor: "Light Golden",
        status: "Reserved",
        assignedAdopterId: "adopter_4",
        assignedAdopterName: "Nathaniel Vance",
        vaccines: { dhpp1: true, dhpp2: true, bordetella: true, dewormingCount: 3 },
        vetExamPassed: true,
        notes: "Very affectionate, strong human eye contact."
      }
    ]
  },
  {
    id: "litter_2",
    litterCode: "2026-FB-B",
    breedName: "French Bulldog",
    damName: "Fleur De Lys Stella (BOAS Grade 0, OFA Spine Clear)",
    damRegistration: "AKC NP78291002",
    sireName: "GCH Royal Boulevard Gaston (OFA Patellas Normal, DM Clear)",
    sireRegistration: "AKC NP66192803",
    matingDate: "2026-06-25",
    whelpingDate: "2026-08-27",
    status: "Gestation",
    puppiesCount: 4,
    puppies: []
  }
];

const INITIAL_ADOPTERS: AdopterProfile[] = [
  {
    id: "adopter_1",
    fullName: "Dr. Marcus Sterling",
    email: "m.sterling@biotechmed.org",
    phone: "(415) 890-2341",
    cityState: "Palo Alto, CA",
    status: "Contract Signed",
    preferredBreed: "Golden Retriever",
    preferredSex: "Male",
    depositAmount: 500,
    totalFee: 3200,
    assignedPuppyId: "pup_1_1",
    assignedPuppyName: "Atlas (Royal Blue Collar)",
    litterCode: "2026-GLD-A",
    homeChecked: true,
    contractSigned: true,
    healthPassportDelivered: true,
    applicationDate: "2026-05-18",
    lifestyleNotes: "Family with 2 teenage kids, large fenced acre yard, previous Golden Retriever owner."
  },
  {
    id: "adopter_2",
    fullName: "Samantha & David Hayes",
    email: "samantha.hayes@coastallaw.com",
    phone: "(415) 302-8819",
    cityState: "Marin County, CA",
    status: "Contract Signed",
    preferredBreed: "Golden Retriever",
    preferredSex: "Female",
    depositAmount: 500,
    totalFee: 3200,
    assignedPuppyId: "pup_1_2",
    assignedPuppyName: "Bella (Ruby Red Collar)",
    litterCode: "2026-GLD-A",
    homeChecked: true,
    contractSigned: true,
    healthPassportDelivered: true,
    applicationDate: "2026-05-22",
    lifestyleNotes: "Active outdoor runners, dedicated to positive reinforcement puppy obedience training."
  },
  {
    id: "adopter_3",
    fullName: "Elena Rostova",
    email: "e.rostova@architects-sf.com",
    phone: "(510) 441-9022",
    cityState: "Berkeley, CA",
    status: "Deposit Paid",
    preferredBreed: "Golden Retriever",
    preferredSex: "Male",
    depositAmount: 500,
    totalFee: 3200,
    assignedPuppyId: "pup_1_3",
    assignedPuppyName: "Cooper (Emerald Green Collar)",
    litterCode: "2026-GLD-A",
    homeChecked: true,
    contractSigned: false,
    healthPassportDelivered: false,
    applicationDate: "2026-06-01",
    lifestyleNotes: "Work from home architect, agility enthusiast."
  },
  {
    id: "adopter_4",
    fullName: "Nathaniel Vance",
    email: "nvance@techcapital.io",
    phone: "(650) 912-4401",
    cityState: "Menlo Park, CA",
    status: "Deposit Paid",
    preferredBreed: "Golden Retriever",
    preferredSex: "Female",
    depositAmount: 500,
    totalFee: 3200,
    assignedPuppyId: "pup_1_6",
    assignedPuppyName: "Flora (Rose Pink Collar)",
    litterCode: "2026-GLD-A",
    homeChecked: true,
    contractSigned: false,
    healthPassportDelivered: false,
    applicationDate: "2026-06-05",
    lifestyleNotes: "Experienced dog owner, private fenced garden."
  },
  {
    id: "adopter_5",
    fullName: "Claire Beaumont",
    email: "claire.beaumont@design.fr",
    phone: "(415) 773-1940",
    cityState: "San Francisco, CA",
    status: "Approved",
    preferredBreed: "French Bulldog",
    preferredSex: "Any",
    depositAmount: 500,
    totalFee: 4000,
    litterCode: "2026-FB-B",
    homeChecked: true,
    contractSigned: false,
    healthPassportDelivered: false,
    applicationDate: "2026-07-02",
    lifestyleNotes: "Urban condo with elevator, vet clinic 2 blocks away."
  },
  {
    id: "adopter_6",
    fullName: "Robert & Lisa Chen",
    email: "robert.chen@stanfordalumni.org",
    phone: "(650) 800-4321",
    cityState: "Los Altos, CA",
    status: "Inquiry",
    preferredBreed: "Golden Retriever",
    preferredSex: "Male",
    depositAmount: 0,
    totalFee: 3200,
    litterCode: "2026-GLD-A",
    homeChecked: false,
    contractSigned: false,
    healthPassportDelivered: false,
    applicationDate: "2026-07-15",
    lifestyleNotes: "Application submitted, awaiting vet reference verification."
  }
];

export default function BreederProSuite({ isOpen, onClose, initialTab = 'dashboard', onOpenAudioPassport }: BreederProSuiteProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'passports' | 'genetics' | 'nutrition' | 'adopters'>(initialTab);
  
  // Breeder State
  const [kennel, setKennel] = useState<KennelProfile>(DEFAULT_KENNEL);
  const [litters, setLitters] = useState<LitterRecord[]>(INITIAL_LITTERS);
  const [adopters, setAdopters] = useState<AdopterProfile[]>(INITIAL_ADOPTERS);
  const [selectedPuppyForPassport, setSelectedPuppyForPassport] = useState<PuppyRecord>(INITIAL_LITTERS[0].puppies[0]);
  
  // UI & Action Alerts
  const [toast, setToast] = useState<string>('');
  const [isEditingKennel, setIsEditingKennel] = useState<boolean>(false);
  const [isAddingLitter, setIsAddingLitter] = useState<boolean>(false);
  const [isAddingAdopter, setIsAddingAdopter] = useState<boolean>(false);
  const [searchAdopter, setSearchAdopter] = useState<string>('');

  // Genetics Simulator State
  const [selectedGeneticsBreed, setSelectedGeneticsBreed] = useState<string>("Golden Retriever");
  const [damHips, setDamHips] = useState<'Excellent' | 'Good' | 'Fair' | 'Mild'>('Good');
  const [sireHips, setSireHips] = useState<'Excellent' | 'Good' | 'Fair' | 'Mild'>('Excellent');
  const [damPra, setDamPra] = useState<'Clear' | 'Carrier' | 'Affected'>('Clear');
  const [sirePra, setSirePra] = useState<'Clear' | 'Carrier' | 'Affected'>('Clear');
  const [damDm, setDamDm] = useState<'Clear' | 'Carrier' | 'Affected'>('Clear');
  const [sireDm, setSireDm] = useState<'Clear' | 'Carrier' | 'Affected'>('Carrier');
  const [damCardiac, setDamCardiac] = useState<'Normal' | 'Flow Murmur' | 'SAS'>('Normal');
  const [sireCardiac, setSireCardiac] = useState<'Normal' | 'Flow Murmur' | 'SAS'>('Normal');
  const [damBoas, setDamBoas] = useState<'Grade 0 (Clear)' | 'Grade 1 (Mild)' | 'Grade 2 (Moderate)'>('Grade 0 (Clear)');
  const [sireBoas, setSireBoas] = useState<'Grade 0 (Clear)' | 'Grade 1 (Mild)' | 'Grade 2 (Moderate)'>('Grade 0 (Clear)');

  // Nutri-Chef Dam Calculator State
  const [damWeightLbs, setDamWeightLbs] = useState<number>(65);
  const [nursingPuppyCount, setNursingPuppyCount] = useState<number>(6);
  const [lactationWeek, setLactationWeek] = useState<number>(3); // Peak lactation

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  if (!isOpen) return null;

  // -------------------------------------------------------------
  // Calculations: Dam Lactation Calories
  // -------------------------------------------------------------
  const damWeightKg = damWeightLbs * 0.453592;
  const damRER = 70 * Math.pow(damWeightKg, 0.75);
  
  // NRC Lactation multiplier: 1.9 + (0.25 * puppy_count) during peak (wks 3-4)
  let lactationFactor = 1.9;
  if (lactationWeek === 1) lactationFactor = 1.5 + (0.15 * nursingPuppyCount);
  else if (lactationWeek === 2) lactationFactor = 1.75 + (0.20 * nursingPuppyCount);
  else if (lactationWeek >= 3 && lactationWeek <= 4) lactationFactor = 1.9 + (0.25 * nursingPuppyCount);
  else if (lactationWeek >= 5) lactationFactor = 1.6 + (0.15 * nursingPuppyCount);

  const dailyDamKcal = Math.round(damRER * lactationFactor);
  const dailyProteinGrams = Math.round((dailyDamKcal * 0.30) / 4);
  const dailyCalciumGrams = (damWeightKg * 0.45).toFixed(1);
  const waterTargetMl = Math.round(dailyDamKcal * 1.2);

  // -------------------------------------------------------------
  // Genetics Cross-Match Risk Score
  // -------------------------------------------------------------
  let geneticScore = 100;
  let praRisk = "0% Affected (100% Clear)";
  let dmRisk = "0% Affected (100% Clear)";
  
  // PRA Punnett
  if (damPra === 'Carrier' && sirePra === 'Carrier') {
    geneticScore -= 30;
    praRisk = "⚠️ 25% Affected, 50% Carrier, 25% Clear (High Risk Pairing)";
  } else if ((damPra === 'Carrier' && sirePra === 'Clear') || (damPra === 'Clear' && sirePra === 'Carrier')) {
    geneticScore -= 5;
    praRisk = "✅ 0% Affected (50% Clear, 50% Unaffected Carriers)";
  }

  // DM Punnett
  if (damDm === 'Carrier' && sireDm === 'Carrier') {
    geneticScore -= 30;
    dmRisk = "⚠️ 25% At-Risk/Affected, 50% Carrier, 25% Clear";
  } else if ((damDm === 'Carrier' && sireDm === 'Clear') || (damDm === 'Clear' && sireDm === 'Carrier')) {
    geneticScore -= 5;
    dmRisk = "✅ 0% Affected (50% Clear, 50% Unaffected Carriers)";
  }

  // Hips
  if (damHips === 'Mild' || sireHips === 'Mild') {
    geneticScore -= 25;
  }

  // Cardiac
  if (damCardiac !== 'Normal' || sireCardiac !== 'Normal') {
    geneticScore -= 35;
  }

  // BOAS
  if (damBoas === 'Grade 2 (Moderate)' || sireBoas === 'Grade 2 (Moderate)') {
    geneticScore -= 25;
  }

  geneticScore = Math.max(20, Math.min(100, geneticScore));

  // -------------------------------------------------------------
  // PDF Export via jsPDF
  // -------------------------------------------------------------
  const handleGeneratePdfPassport = (pup: PuppyRecord) => {
    const parentLitter = litters.find(l => l.id === pup.litterId) || litters[0];
    
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Header Banner
      doc.setFillColor(26, 26, 26);
      doc.rect(0, 0, 210, 32, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text("OFFICIAL CANINE HEALTH & LONGEVITY PASSPORT", 105, 14, { align: 'center' });
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(229, 168, 54);
      doc.text(`DogHealthOS™ Elite Breeder Registry • Verified AKC / OFA Standard`, 105, 22, { align: 'center' });
      doc.text(`Kennel: ${kennel.kennelName} (${kennel.akcId})`, 105, 28, { align: 'center' });

      // Gold Divider Line
      doc.setDrawColor(229, 168, 54);
      doc.setLineWidth(1);
      doc.line(15, 36, 195, 36);

      // Section 1: Puppy Identity
      doc.setTextColor(26, 26, 26);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text("1. PUPPY BIOMETRIC IDENTIFICATION", 15, 44);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      
      const col1 = 15;
      const col2 = 110;
      let y = 52;

      doc.text(`Registered Call Name: ${pup.callName} (${pup.collarColor} Collar)`, col1, y);
      doc.text(`Breed: ${parentLitter.breedName}`, col2, y);
      y += 6;

      doc.text(`Microchip ID: ${pup.microchipId} (ISO 11784/11785 Standard)`, col1, y);
      doc.text(`Sex: ${pup.sex}  |  Coat: ${pup.coatColor}`, col2, y);
      y += 6;

      doc.text(`Whelping Date: ${parentLitter.whelpingDate}`, col1, y);
      doc.text(`Current Weight: ${pup.currentWeightLbs} lbs (Birth: ${pup.birthWeightOz} oz)`, col2, y);
      y += 6;

      doc.text(`Assigned Adopter: ${pup.assignedAdopterName || 'Available for Reservation'}`, col1, y);
      doc.text(`Litter Cohort Code: ${parentLitter.litterCode}`, col2, y);

      // Section 2: Pedigree & Genetic Clearances
      y += 12;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text("2. PARENTAGE & OFA / AKC GENETIC CLEARANCES", 15, y);
      y += 8;

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`Dam (Mother): ${parentLitter.damName}`, 15, y);
      y += 5;
      doc.text(`Registration: ${parentLitter.damRegistration}`, 15, y);
      y += 6;

      doc.text(`Sire (Father): ${parentLitter.sireName}`, 15, y);
      y += 5;
      doc.text(`Registration: ${parentLitter.sireRegistration}`, 15, y);

      // Section 3: Immunization & Deworming Record Table
      y += 12;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text("3. CORE VACCINATION & DEWORMING PROTOCOL", 15, y);
      y += 8;

      // Table Header Box
      doc.setFillColor(245, 240, 232);
      doc.rect(15, y - 4, 180, 7, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text("VACCINE / PARASITE TREATMENT", 18, y);
      doc.text("TARGET AGE", 95, y);
      doc.text("STATUS", 145, y);
      doc.text("VET INITIALS", 170, y);
      y += 8;

      doc.setFont('helvetica', 'normal');
      const vaxList = [
        { name: "DHPP Dose #1 (Distemper, Parvo, Adenovirus, Parainfluenza)", age: "6 Weeks", status: pup.vaccines.dhpp1 ? "COMPLETED & CERTIFIED" : "SCHEDULED", init: "EV, DVM" },
        { name: "DHPP Dose #2 Booster (Core 9-Week)", age: "9 Weeks", status: pup.vaccines.dhpp2 ? "COMPLETED & CERTIFIED" : "DUE AT 9 WEEKS", init: "EV, DVM" },
        { name: "Bordetella Bronchiseptica (Intranasal)", age: "8 Weeks", status: pup.vaccines.bordetella ? "COMPLETED" : "SCHEDULED", init: "EV, DVM" },
        { name: "Broad-Spectrum Deworming (Pyrantel / Fenbendazole Protocol)", age: "2, 4, 6, 8 Wks", status: `${pup.vaccines.dewormingCount} of 4 Rounds Administered`, init: "EV, DVM" },
        { name: "Rabies 1-Year (Administered by Adopter's Primary Vet)", age: "16 Weeks", status: "PENDING ADOPTER VET", init: "_____" }
      ];

      vaxList.forEach(v => {
        doc.text(v.name, 18, y);
        doc.text(v.age, 95, y);
        doc.text(v.status, 145, y);
        doc.text(v.init, 175, y);
        y += 6;
      });

      // Section 4: Clinical Physical Examination Certificate
      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text("4. VETERINARY CLINICAL PHYSICAL EXAMINATION", 15, y);
      y += 7;

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`Examining Veterinarian: ${kennel.vetDoctorName}`, 15, y);
      doc.text(`Facility: ${kennel.vetClinicName}`, 110, y);
      y += 6;

      doc.text(`Cardiac Auscultation: Normal (Grade 0/6 - No Murmur Detected)`, 15, y);
      doc.text(`Patellas / Hips: Normal Symmetrical Palpation`, 110, y);
      y += 5;
      doc.text(`Ophthalmic & Otic: Clear Cornea, Normal Ear Canals`, 15, y);
      doc.text(`Dentition: Deciduous Scissor Bite - Normal`, 110, y);
      y += 5;
      doc.text(`Umbilicus: Normal, No Herniation Detected`, 15, y);
      doc.text(`Overall Clinical Status: FIT FOR ADOPTION TRANSFER`, 110, y);

      // Section 5: Signature & Official Breeder Seal
      y += 14;
      doc.setDrawColor(200, 200, 200);
      doc.line(15, y, 95, y);
      doc.line(115, y, 195, y);
      y += 4;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(`BREEDER AUTHORIZED SIGNATURE: ${kennel.breederName}`, 15, y);
      doc.text(`ADOPTER ACCEPTANCE SIGNATURE: ________________`, 115, y);
      y += 4;
      doc.setFont('helvetica', 'normal');
      doc.text(`Date of Transfer: ${new Date().toISOString().split('T')[0]}  |  AKC Prefix: ${kennel.akcId}`, 15, y);
      doc.text(`Microchip Transfer Verification Complete`, 115, y);

      // Footer
      doc.setFontSize(7.5);
      doc.setTextColor(130, 130, 130);
      doc.text("DogHealthOS™ Pro Breeder Edition • Generated securely via Firestore Clinical Cloud", 105, 287, { align: 'center' });

      // Save PDF
      const filename = `Health_Passport_${parentLitter.litterCode}_${pup.callName}_${pup.microchipId.slice(-6)}.pdf`;
      doc.save(filename);
      
      triggerToast(`📥 PDF Health Passport generated for ${pup.callName}!`);
      logUserAction('Generate PDF Health Passport', {
        puppy: pup.callName,
        microchip: pup.microchipId,
        breed: parentLitter.breedName
      });
    } catch (err: any) {
      console.error('Failed to generate PDF:', err);
      triggerToast(`⚠️ PDF Generation failed: ${err.message}`);
    }
  };

  const handlePrintDocument = () => {
    window.print();
    logUserAction('Print Health Passport');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-2 sm:p-4 md:p-6 flex justify-center items-start pt-3 sm:pt-6 pb-16 animate-[fadeIn_0.2s_ease-out]">
      
      <div className="relative w-full max-w-6xl bg-[#F5F0E8] dark:bg-[#1A1815] border-[3px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[8px_8px_0_#d97706] rounded-2xl p-4 sm:p-6 md:p-8 text-[#1A1A1A] dark:text-[#F0ECE6] my-auto">
        
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b-2 border-dashed border-[#1A1A1A]/20 dark:border-white/20 gap-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#25221E] text-[#1A1A1A] dark:text-[#F0ECE6] shadow-[2.5px_2.5px_0_#1A1A1A] dark:shadow-[2.5px_2.5px_0_#F0ECE6] flex items-center gap-2 text-xs font-black uppercase tracking-wider hover:bg-amber-500 hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Return to App</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center border-2 border-black font-bold shadow-[2px_2px_0_#000]">
                <Crown className="w-4 h-4" />
              </span>
              <div>
                <h1 className="text-base sm:text-lg font-black tracking-tight leading-none">
                  Elite Breeder Pro Suite™
                </h1>
                <span className="text-[0.65rem] font-mono font-bold text-amber-700 dark:text-amber-400 uppercase">
                  {kennel.kennelName} • {kennel.akcId}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                generateFrenchieHandoffPacketPDF();
                triggerToast('📥 Downloaded Sample Frenchie Hand-off Packet PDF!');
              }}
              className="px-3 py-1.5 rounded-xl border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black font-mono uppercase flex items-center gap-1.5 shadow-[2px_2px_0_#1A1A1A] cursor-pointer transition-all active:translate-y-0.5"
              title="Download Sample French Bulldog Adoption Hand-off Packet PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sample Frenchie Packet PDF</span>
            </button>

            <button
              onClick={() => setIsEditingKennel(!isEditingKennel)}
              className="px-3 py-1.5 rounded-xl border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#25221E] text-xs font-bold font-mono uppercase flex items-center gap-1.5 shadow-[2px_2px_0_#1A1A1A] hover:bg-stone-100 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-600" />
              <span>{isEditingKennel ? 'Save Profile' : 'Edit Kennel'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#25221E] flex items-center justify-center font-bold hover:bg-rose-500 hover:text-white transition-all cursor-pointer shadow-[2px_2px_0_#1A1A1A]"
              title="Close Breeder Suite"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Kennel Quick Info Header / Edit Drawer */}
        {isEditingKennel && (
          <div className="mb-6 p-4 bg-white dark:bg-[#221F1B] border-2 border-amber-500 rounded-xl shadow-[3px_3px_0_#d97706] animate-[fadeIn_0.2s_ease-out]">
            <h3 className="text-xs font-black font-mono uppercase text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Configure Official Kennel Certification & Vet Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[0.62rem] font-mono font-bold text-stone-400 uppercase block">Kennel / Cattery Name</label>
                <input
                  type="text"
                  value={kennel.kennelName}
                  onChange={(e) => setKennel({ ...kennel, kennelName: e.target.value })}
                  className="w-full text-xs font-bold p-2 bg-stone-50 dark:bg-stone-800 border-2 border-[#1A1A1A] dark:border-stone-700 rounded-lg"
                />
              </div>
              <div>
                <label className="text-[0.62rem] font-mono font-bold text-stone-400 uppercase block">Breeder Name / Title</label>
                <input
                  type="text"
                  value={kennel.breederName}
                  onChange={(e) => setKennel({ ...kennel, breederName: e.target.value })}
                  className="w-full text-xs font-bold p-2 bg-stone-50 dark:bg-stone-800 border-2 border-[#1A1A1A] dark:border-stone-700 rounded-lg"
                />
              </div>
              <div>
                <label className="text-[0.62rem] font-mono font-bold text-stone-400 uppercase block">AKC Breeder ID / License</label>
                <input
                  type="text"
                  value={kennel.akcId}
                  onChange={(e) => setKennel({ ...kennel, akcId: e.target.value })}
                  className="w-full text-xs font-bold p-2 bg-stone-50 dark:bg-stone-800 border-2 border-[#1A1A1A] dark:border-stone-700 rounded-lg"
                />
              </div>
              <div>
                <label className="text-[0.62rem] font-mono font-bold text-stone-400 uppercase block">Partner Veterinary Clinic</label>
                <input
                  type="text"
                  value={kennel.vetClinicName}
                  onChange={(e) => setKennel({ ...kennel, vetClinicName: e.target.value })}
                  className="w-full text-xs font-bold p-2 bg-stone-50 dark:bg-stone-800 border-2 border-[#1A1A1A] dark:border-stone-700 rounded-lg"
                />
              </div>
              <div>
                <label className="text-[0.62rem] font-mono font-bold text-stone-400 uppercase block">Attending Veterinarian (DVM)</label>
                <input
                  type="text"
                  value={kennel.vetDoctorName}
                  onChange={(e) => setKennel({ ...kennel, vetDoctorName: e.target.value })}
                  className="w-full text-xs font-bold p-2 bg-stone-50 dark:bg-stone-800 border-2 border-[#1A1A1A] dark:border-stone-700 rounded-lg"
                />
              </div>
              <div>
                <label className="text-[0.62rem] font-mono font-bold text-stone-400 uppercase block">Breeder Contact Phone</label>
                <input
                  type="text"
                  value={kennel.phone}
                  onChange={(e) => setKennel({ ...kennel, phone: e.target.value })}
                  className="w-full text-xs font-bold p-2 bg-stone-50 dark:bg-stone-800 border-2 border-[#1A1A1A] dark:border-stone-700 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* 5 Main Sub-module Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
          {[
            { id: 'dashboard', label: '1. Litter Cohorts', icon: Baby, desc: 'Active Litters & Pups' },
            { id: 'passports', label: '2. Health Passports (PDF)', icon: FileText, desc: 'Official Adopter PDF' },
            { id: 'genetics', label: '3. OFA / AKC Risk Matrix', icon: Dna, desc: 'Dam x Sire Genetics' },
            { id: 'nutrition', label: '4. Batch Nutri-Chef', icon: Scale, desc: 'Lactation & Weaning' },
            { id: 'adopters', label: '5. Adopter CRM (25)', icon: Users, desc: 'Buyer Pipeline' }
          ].map(tabItem => {
            const isActive = activeTab === tabItem.id;
            const Icon = tabItem.icon;
            return (
              <button
                key={tabItem.id}
                onClick={() => setActiveTab(tabItem.id as any)}
                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-amber-500 border-black text-white shadow-[3px_3px_0_#000] dark:border-white'
                    : 'bg-white dark:bg-[#221F1B] border-[#1A1A1A]/15 dark:border-white/15 text-[#1A1A1A] dark:text-[#F0ECE6] hover:border-amber-500 shadow-[2px_2px_0_#1A1A1A]/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-amber-600 dark:text-amber-400'}`} />
                  {isActive && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                </div>
                <div className="mt-2">
                  <strong className="block text-xs font-black uppercase tracking-tight">{tabItem.label}</strong>
                  <span className={`text-[0.62rem] font-mono block ${isActive ? 'text-white/80' : 'text-stone-500'}`}>
                    {tabItem.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ADVANCED MULTI-LITTER COHORT TRACKER */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
            
            {/* Top Cohort Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl shadow-[2.5px_2.5px_0_#1A1A1A]">
                <span className="text-[0.62rem] font-mono font-bold text-stone-400 uppercase block">Active Litters</span>
                <strong className="text-xl font-black font-mono text-[#1A1A1A] dark:text-[#F0ECE6]">
                  {litters.length} Cohorts
                </strong>
                <span className="text-[0.65rem] text-emerald-600 font-bold block mt-0.5">1 Weaning • 1 Gestation</span>
              </div>

              <div className="p-3.5 bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl shadow-[2.5px_2.5px_0_#1A1A1A]">
                <span className="text-[0.62rem] font-mono font-bold text-stone-400 uppercase block">Puppies in Kennel</span>
                <strong className="text-xl font-black font-mono text-amber-600 dark:text-amber-400">
                  {litters.reduce((acc, l) => acc + l.puppies.length, 0)} Puppies
                </strong>
                <span className="text-[0.65rem] text-stone-500 font-bold block mt-0.5">3 Males • 3 Females</span>
              </div>

              <div className="p-3.5 bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl shadow-[2.5px_2.5px_0_#1A1A1A]">
                <span className="text-[0.62rem] font-mono font-bold text-stone-400 uppercase block">Litter Reservation Rate</span>
                <strong className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  66.7%
                </strong>
                <span className="text-[0.65rem] text-stone-500 font-bold block mt-0.5">4 of 6 Reserved</span>
              </div>

              <div className="p-3.5 bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl shadow-[2.5px_2.5px_0_#1A1A1A]">
                <span className="text-[0.62rem] font-mono font-bold text-stone-400 uppercase block">Next Whelping Due</span>
                <strong className="text-xl font-black font-mono text-sky-600 dark:text-sky-400">
                  Aug 27, 2026
                </strong>
                <span className="text-[0.65rem] text-sky-600 font-bold block mt-0.5">French Bulldog • Day 51</span>
              </div>
            </div>

            {/* Litters List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-black uppercase text-[#1A1A1A] dark:text-[#F0ECE6] flex items-center gap-2">
                  <Baby className="w-4 h-4 text-amber-500" />
                  Active Breeding Cohorts & Puppy Rosters
                </h3>
                
                <button
                  onClick={() => setIsAddingLitter(!isAddingLitter)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black border-2 border-black rounded-lg text-xs font-black uppercase flex items-center gap-1 shadow-[2px_2px_0_#000] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Litter</span>
                </button>
              </div>

              {litters.map((litter, lIdx) => (
                <div 
                  key={litter.id}
                  className="bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[3.5px_3.5px_0_#1A1A1A] dark:shadow-[3.5px_3.5px_0_#F0ECE6] rounded-xl p-5 space-y-4"
                >
                  {/* Litter Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono font-black text-xs rounded border border-amber-500/30">
                          {litter.litterCode}
                        </span>
                        <h4 className="text-base font-black tracking-tight">{litter.breedName} Cohort</h4>
                        <span className={`text-[0.62rem] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                          litter.status === 'Weaning' ? 'bg-emerald-500/15 text-emerald-600' : 'bg-sky-500/15 text-sky-600'
                        }`}>
                          ● {litter.status} Stage
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                        <strong>Dam:</strong> {litter.damName}  |  <strong>Sire:</strong> {litter.sireName}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono font-bold">
                      <span className="text-stone-500">Whelp Date: {litter.whelpingDate}</span>
                      <button
                        onClick={() => {
                          setSelectedPuppyForPassport(litter.puppies[0]);
                          setActiveTab('passports');
                        }}
                        className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-[0.68rem] uppercase font-bold flex items-center gap-1 hover:bg-stone-200 cursor-pointer"
                      >
                        <FileText className="w-3 h-3 text-amber-600" />
                        <span>Passports ({litter.puppies.length})</span>
                      </button>
                    </div>
                  </div>

                  {/* Puppies Grid for this Litter */}
                  {litter.puppies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {litter.puppies.map(pup => (
                        <div 
                          key={pup.id}
                          className="p-3 bg-stone-50 dark:bg-[#181614] border border-[#1A1A1A]/15 dark:border-stone-800 rounded-lg flex flex-col justify-between hover:border-amber-500 transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span 
                                  className="w-3.5 h-3.5 rounded-full border border-black" 
                                  style={{ backgroundColor: pup.collarHex }} 
                                  title={`${pup.collarColor} Collar`}
                                />
                                <strong className="text-xs font-black">{pup.callName}</strong>
                                <span className="text-[0.62rem] font-mono text-stone-400">({pup.sex})</span>
                              </div>
                              <span className={`text-[0.62rem] font-mono font-bold px-1.5 py-0.5 rounded ${
                                pup.status === 'Reserved' ? 'bg-amber-500/15 text-amber-600' : 'bg-emerald-500/15 text-emerald-600'
                              }`}>
                                {pup.status}
                              </span>
                            </div>

                            <div className="space-y-1 text-[0.68rem] text-stone-600 dark:text-stone-400 font-mono">
                              <div className="flex justify-between">
                                <span>Weight:</span>
                                <strong className="text-stone-800 dark:text-stone-200">{pup.currentWeightLbs} lbs (Birth: {pup.birthWeightOz} oz)</strong>
                              </div>
                              <div className="flex justify-between">
                                <span>Microchip:</span>
                                <span>...{pup.microchipId.slice(-6)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>DHPP Vaccines:</span>
                                <span>{pup.vaccines.dhpp1 && pup.vaccines.dhpp2 ? '✅ Dose 1 & 2' : 'Dose 1 Done'}</span>
                              </div>
                              {pup.assignedAdopterName && (
                                <div className="text-emerald-600 font-bold truncate">
                                  Adopter: {pup.assignedAdopterName}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-3 pt-2 border-t border-stone-200 dark:border-stone-800 flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedPuppyForPassport(pup);
                                setActiveTab('passports');
                              }}
                              className="flex-1 py-1 bg-amber-500/15 hover:bg-amber-500 text-amber-800 dark:text-amber-300 hover:text-white rounded text-[0.65rem] font-mono font-bold uppercase flex items-center justify-center gap-1 cursor-pointer transition-all"
                            >
                              <FileText className="w-3 h-3" />
                              <span>View Passport</span>
                            </button>
                            <button
                              onClick={() => handleGeneratePdfPassport(pup)}
                              className="px-2 py-1 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-stone-700 dark:text-stone-300 rounded text-[0.65rem] font-mono font-bold flex items-center justify-center cursor-pointer"
                              title="Download PDF"
                            >
                              <Download className="w-3 h-3" />
                            </button>
                            {onOpenAudioPassport && (
                              <button
                                onClick={() => onOpenAudioPassport(pup)}
                                className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500 hover:text-white text-emerald-800 dark:text-emerald-300 rounded text-[0.65rem] font-mono font-bold flex items-center justify-center cursor-pointer transition-all"
                                title="Listen to Spoken Audio Passport (Gemini 3.8 TTS)"
                              >
                                <Headphones className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-stone-50 dark:bg-[#181614] border border-dashed border-stone-300 dark:border-stone-700 rounded-lg text-center">
                      <Clock className="w-8 h-8 text-sky-500 mx-auto mb-2 animate-pulse" />
                      <h5 className="text-xs font-black uppercase">Gestation Phase In Progress</h5>
                      <p className="text-[0.72rem] text-stone-500 max-w-md mx-auto mt-1">
                        Ultrasound confirmed 4 gestational sacs on Day 28. Whelping expected on August 27, 2026. Puppies will appear in the roster upon birth recording.
                      </p>
                    </div>
                  )}

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CUSTOM PUPPY HEALTH & LONGEVITY PASSPORTS (PDF & PRINTABLE) */}
        {/* ========================================================================= */}
        {activeTab === 'passports' && (
          <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
            
            {/* Header & Puppy Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-stone-900 text-white rounded-xl border-2 border-black shadow-[3px_3px_0_#000]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight">Puppy Health Passport Generator</h3>
                  <span className="text-[0.65rem] font-mono text-stone-300">
                    Official AKC / OFA Verified Clinical Handoff Certificate (Print & PDF)
                  </span>
                </div>
              </div>

              {/* Puppy Picker */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-mono font-bold uppercase text-stone-300">Select Puppy:</label>
                <select
                  value={selectedPuppyForPassport.id}
                  onChange={(e) => {
                    const found = litters.flatMap(l => l.puppies).find(p => p.id === e.target.value);
                    if (found) setSelectedPuppyForPassport(found);
                  }}
                  className="bg-stone-800 text-white text-xs font-bold font-mono px-3 py-2 rounded-lg border border-stone-700"
                >
                  {litters.flatMap(l => l.puppies).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.callName} ({p.collarColor} Collar - {p.sex})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleGeneratePdfPassport(selectedPuppyForPassport)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase rounded-lg border border-black flex items-center gap-1.5 shadow-[2px_2px_0_#000] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>

                {onOpenAudioPassport && (
                  <button
                    onClick={() => onOpenAudioPassport(selectedPuppyForPassport)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase rounded-lg border border-black flex items-center gap-1.5 shadow-[2px_2px_0_#000] cursor-pointer"
                    title="Generate & Listen to Spoken Audio Passport (Gemini 3.8 TTS)"
                  >
                    <Headphones className="w-4 h-4 animate-pulse" />
                    <span>Spoken Passport</span>
                  </button>
                )}

                <button
                  onClick={handlePrintDocument}
                  className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs uppercase rounded-lg border border-stone-600 flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Live High-Fidelity Printable Health Passport Preview */}
            <div 
              id="printable-puppy-passport"
              className="bg-white text-black p-6 md:p-8 rounded-2xl border-[3px] border-black shadow-[6px_6px_0_#000] space-y-6 font-sans"
            >
              
              {/* Document Header */}
              <div className="border-b-2 border-black pb-4 flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500 border-2 border-black flex items-center justify-center shadow-[3px_3px_0_#000]">
                    <Crown className="w-8 h-8 text-black" />
                  </div>
                  <div>
                    <span className="text-[0.62rem] font-mono font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      Official Breed Registry Document
                    </span>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black mt-1">
                      Canine Health & Longevity Passport
                    </h2>
                    <p className="text-xs font-mono font-bold text-stone-600">
                      {kennel.kennelName} • Prefix: {kennel.akcId} • {kennel.cityState}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <div className="inline-block p-2 bg-stone-100 border border-stone-300 rounded text-center">
                    <span className="text-[0.6rem] font-bold block text-stone-500 uppercase">Microchip ISO 11784</span>
                    <strong className="text-sm font-black text-black">{selectedPuppyForPassport.microchipId}</strong>
                  </div>
                </div>
              </div>

              {/* Grid Section: Identity & Pedigree */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                
                {/* Puppy Identification */}
                <div className="p-4 bg-stone-50 border-2 border-black rounded-xl space-y-2">
                  <h4 className="font-mono font-black uppercase text-amber-700 border-b border-stone-200 pb-1 flex items-center gap-1.5">
                    <Baby className="w-4 h-4" />
                    1. Puppy Identification & Biometrics
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-stone-800">
                    <div>
                      <span className="text-[0.65rem] text-stone-500 uppercase font-mono block">Call Name & Collar</span>
                      <strong>{selectedPuppyForPassport.callName} ({selectedPuppyForPassport.collarColor})</strong>
                    </div>
                    <div>
                      <span className="text-[0.65rem] text-stone-500 uppercase font-mono block">Sex & Coat Color</span>
                      <strong>{selectedPuppyForPassport.sex} • {selectedPuppyForPassport.coatColor}</strong>
                    </div>
                    <div>
                      <span className="text-[0.65rem] text-stone-500 uppercase font-mono block">Birth Weight</span>
                      <strong>{selectedPuppyForPassport.birthWeightOz} oz</strong>
                    </div>
                    <div>
                      <span className="text-[0.65rem] text-stone-500 uppercase font-mono block">Current Weight (8 Wks)</span>
                      <strong>{selectedPuppyForPassport.currentWeightLbs} lbs</strong>
                    </div>
                  </div>
                </div>

                {/* Pedigree & Parents */}
                <div className="p-4 bg-stone-50 border-2 border-black rounded-xl space-y-2">
                  <h4 className="font-mono font-black uppercase text-amber-700 border-b border-stone-200 pb-1 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    2. Parentage & Genetic Lineage
                  </h4>
                  <div className="space-y-1.5 text-stone-800 text-[0.72rem]">
                    <div>
                      <span className="font-bold text-black">Dam:</span> CH Silver Pine Golden Aurora (SS19283701)
                      <span className="block text-[0.65rem] text-emerald-700 font-mono">OFA Hips Good, Elbows Normal, PRA Clear</span>
                    </div>
                    <div>
                      <span className="font-bold text-black">Sire:</span> GCHB Summit Ridge Apollo CGC (SS28391004)
                      <span className="block text-[0.65rem] text-emerald-700 font-mono">OFA Hips Excellent, Cardiac Clear, DM Clear</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Vaccine & Parasite Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-black uppercase text-black flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  3. Clinical Vaccination & Parasitology Record
                </h4>
                
                <div className="overflow-x-auto border-2 border-black rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-100 border-b-2 border-black font-mono text-[0.65rem] uppercase">
                      <tr>
                        <th className="p-2.5">Vaccination / Treatment</th>
                        <th className="p-2.5">Target Age</th>
                        <th className="p-2.5">Clinical Status</th>
                        <th className="p-2.5">Attending DVM</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 text-stone-800">
                      <tr>
                        <td className="p-2.5 font-bold">DHPP Dose #1 (Distemper, Parvo, Adenovirus)</td>
                        <td className="p-2.5 font-mono">6 Weeks</td>
                        <td className="p-2.5 text-emerald-700 font-bold">✅ Completed (Lot #99281)</td>
                        <td className="p-2.5 font-mono">Dr. E. Vance, DVM</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">DHPP Dose #2 Booster</td>
                        <td className="p-2.5 font-mono">9 Weeks</td>
                        <td className="p-2.5 text-emerald-700 font-bold">✅ Completed (Lot #99304)</td>
                        <td className="p-2.5 font-mono">Dr. E. Vance, DVM</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Bordetella Bronchiseptica (Intranasal)</td>
                        <td className="p-2.5 font-mono">8 Weeks</td>
                        <td className="p-2.5 text-emerald-700 font-bold">✅ Completed</td>
                        <td className="p-2.5 font-mono">Dr. E. Vance, DVM</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Deworming Protocol (Pyrantel Pamoate)</td>
                        <td className="p-2.5 font-mono">2, 4, 6, 8 Wks</td>
                        <td className="p-2.5 text-emerald-700 font-bold">✅ 4 Complete Rounds</td>
                        <td className="p-2.5 font-mono">Dr. E. Vance, DVM</td>
                      </tr>
                      <tr className="bg-stone-50">
                        <td className="p-2.5 text-stone-500">Rabies 1-Year (Adopter Primary Vet)</td>
                        <td className="p-2.5 font-mono text-stone-500">16 Weeks</td>
                        <td className="p-2.5 text-stone-500 font-mono">Due at Adopter Clinic</td>
                        <td className="p-2.5 font-mono">____________</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Physical Exam Sign-off Block */}
              <div className="p-4 bg-emerald-50 border-2 border-emerald-600 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-1">
                  <h4 className="font-mono font-black uppercase text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    4. Veterinary Physical Examination Sign-Off
                  </h4>
                  <span className="font-mono font-bold text-emerald-700 text-[0.65rem]">
                    Exam Date: 2026-08-10 • Fit for Adoption
                  </span>
                </div>
                <p className="text-emerald-900 leading-relaxed text-[0.72rem]">
                  I hereby certify that I have conducted a thorough clinical physical examination of the puppy identified above. 
                  Auscultation revealed clear cardiopulmonary rhythm with zero heart murmurs (Grade 0/6). Eyes and ears are clear. 
                  Dentition displays standard deciduous scissor bite. Symmetrical patella articulation with no luxation. 
                  Umbilicus intact with no hernia detected. Microchip scanned and verified.
                </p>
                <div className="pt-2 flex justify-between items-center text-[0.68rem] font-mono text-emerald-800">
                  <span>Veterinarian: {kennel.vetDoctorName}</span>
                  <span>Clinic: {kennel.vetClinicName}</span>
                </div>
              </div>

              {/* Signatures & Transfer of Ownership Block */}
              <div className="border-t-2 border-black pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-1">
                  <span className="text-[0.65rem] font-mono font-bold text-stone-500 uppercase block">Breeder Authorization</span>
                  <div className="h-10 border-b border-stone-400 flex items-end pb-1 font-serif text-sm font-bold">
                    {kennel.breederName}
                  </div>
                  <span className="text-[0.62rem] font-mono text-stone-400">Authorized Signature • {kennel.kennelName}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[0.65rem] font-mono font-bold text-stone-500 uppercase block">Adopter Acceptance & Guarantee</span>
                  <div className="h-10 border-b border-stone-400 flex items-end pb-1 font-serif text-sm text-stone-400">
                    {selectedPuppyForPassport.assignedAdopterName || 'Adopter Signature Upon Transfer'}
                  </div>
                  <span className="text-[0.62rem] font-mono text-stone-400">Adopter Signature • Microchip Registered</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: OFA / AKC HEREDITARY RISK MATRIX */}
        {/* ========================================================================= */}
        {activeTab === 'genetics' && (
          <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
            
            {/* Header Banner */}
            <div className="p-4 bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-xl border-2 border-black shadow-[3px_3px_0_#000] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold shadow-[2px_2px_0_#FFF]">
                  <Dna className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight">OFA / AKC Hereditary Risk Matrix</h3>
                  <p className="text-xs text-stone-300 max-w-xl">
                    Simulate mating genetics between Dam and Sire across core canine hereditary loci (Hip Dysplasia, PRA, Degenerative Myelopathy, BOAS, and Cardiac health).
                  </p>
                </div>
              </div>

              {/* Pairing Quality Score Gauge */}
              <div className="p-3 bg-stone-800 border border-amber-500 rounded-xl text-center min-w-[160px]">
                <span className="text-[0.62rem] font-mono uppercase text-stone-400 block">Pairing Quality Score</span>
                <strong className={`text-2xl font-mono font-black ${
                  geneticScore >= 90 ? 'text-emerald-400' : geneticScore >= 70 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {geneticScore}/100
                </strong>
                <span className="text-[0.65rem] font-bold block text-stone-300">
                  {geneticScore >= 90 ? '🌟 Optimal Pairing' : geneticScore >= 70 ? '⚠️ Conditional Pairing' : '🛑 High Risk Pairing'}
                </span>
              </div>
            </div>

            {/* Genetics Selection Bench */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Dam Genetic Profile */}
              <div className="p-5 bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl shadow-[3px_3px_0_#1A1A1A] space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
                  <h4 className="text-xs font-mono font-black uppercase text-rose-600 flex items-center gap-1.5">
                    <Heart className="w-4 h-4" />
                    Dam (Mother) Genetic Test Clearances
                  </h4>
                  <span className="text-[0.65rem] font-mono font-bold text-stone-400">CH Aurora</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[0.65rem] font-mono font-bold text-stone-400 uppercase block mb-1">OFA Hip Dysplasia Rating</label>
                    <select
                      value={damHips}
                      onChange={(e: any) => setDamHips(e.target.value)}
                      className="w-full p-2 bg-stone-50 dark:bg-stone-800 border-2 border-black dark:border-stone-700 rounded-lg font-bold"
                    >
                      <option value="Excellent">OFA Excellent (Top 3% Pelvic Conformation)</option>
                      <option value="Good">OFA Good (Standard Breed Soundness)</option>
                      <option value="Fair">OFA Fair (Minor Splay, Breeding Permitted)</option>
                      <option value="Mild">OFA Mild Dysplastic (High Transmission Risk)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[0.65rem] font-mono font-bold text-stone-400 uppercase block mb-1">PRA (Progressive Retinal Atrophy) DNA</label>
                    <select
                      value={damPra}
                      onChange={(e: any) => setDamPra(e.target.value)}
                      className="w-full p-2 bg-stone-50 dark:bg-stone-800 border-2 border-black dark:border-stone-700 rounded-lg font-bold"
                    >
                      <option value="Clear">Clear / Normal (0 Mutant Alleles)</option>
                      <option value="Carrier">Carrier (1 Mutant Allele, Phenotypically Normal)</option>
                      <option value="Affected">Affected (2 Mutant Alleles, Vision Loss Risk)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[0.65rem] font-mono font-bold text-stone-400 uppercase block mb-1">DM (Degenerative Myelopathy) DNA</label>
                    <select
                      value={damDm}
                      onChange={(e: any) => setDamDm(e.target.value)}
                      className="w-full p-2 bg-stone-50 dark:bg-stone-800 border-2 border-black dark:border-stone-700 rounded-lg font-bold"
                    >
                      <option value="Clear">Clear / Normal (SOD1 Normal)</option>
                      <option value="Carrier">Carrier (SOD1 Heterozygous)</option>
                      <option value="Affected">At-Risk / Affected (SOD1 Homozygous)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[0.65rem] font-mono font-bold text-stone-400 uppercase block mb-1">Cardiac Auscultation & Echo</label>
                    <select
                      value={damCardiac}
                      onChange={(e: any) => setDamCardiac(e.target.value)}
                      className="w-full p-2 bg-stone-50 dark:bg-stone-800 border-2 border-black dark:border-stone-700 rounded-lg font-bold"
                    >
                      <option value="Normal">OFA Normal / Clear (0 Murmurs)</option>
                      <option value="Flow Murmur">Innocent Flow Murmur</option>
                      <option value="SAS">Subvalvular Aortic Stenosis (SAS)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sire Genetic Profile */}
              <div className="p-5 bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl shadow-[3px_3px_0_#1A1A1A] space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
                  <h4 className="text-xs font-mono font-black uppercase text-sky-600 flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    Sire (Father) Genetic Test Clearances
                  </h4>
                  <span className="text-[0.65rem] font-mono font-bold text-stone-400">GCHB Apollo</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[0.65rem] font-mono font-bold text-stone-400 uppercase block mb-1">OFA Hip Dysplasia Rating</label>
                    <select
                      value={sireHips}
                      onChange={(e: any) => setSireHips(e.target.value)}
                      className="w-full p-2 bg-stone-50 dark:bg-stone-800 border-2 border-black dark:border-stone-700 rounded-lg font-bold"
                    >
                      <option value="Excellent">OFA Excellent (Top 3% Pelvic Conformation)</option>
                      <option value="Good">OFA Good (Standard Breed Soundness)</option>
                      <option value="Fair">OFA Fair (Minor Splay, Breeding Permitted)</option>
                      <option value="Mild">OFA Mild Dysplastic (High Transmission Risk)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[0.65rem] font-mono font-bold text-stone-400 uppercase block mb-1">PRA (Progressive Retinal Atrophy) DNA</label>
                    <select
                      value={sirePra}
                      onChange={(e: any) => setSirePra(e.target.value)}
                      className="w-full p-2 bg-stone-50 dark:bg-stone-800 border-2 border-black dark:border-stone-700 rounded-lg font-bold"
                    >
                      <option value="Clear">Clear / Normal (0 Mutant Alleles)</option>
                      <option value="Carrier">Carrier (1 Mutant Allele, Phenotypically Normal)</option>
                      <option value="Affected">Affected (2 Mutant Alleles, Vision Loss Risk)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[0.65rem] font-mono font-bold text-stone-400 uppercase block mb-1">DM (Degenerative Myelopathy) DNA</label>
                    <select
                      value={sireDm}
                      onChange={(e: any) => setSireDm(e.target.value)}
                      className="w-full p-2 bg-stone-50 dark:bg-stone-800 border-2 border-black dark:border-stone-700 rounded-lg font-bold"
                    >
                      <option value="Clear">Clear / Normal (SOD1 Normal)</option>
                      <option value="Carrier">Carrier (SOD1 Heterozygous)</option>
                      <option value="Affected">At-Risk / Affected (SOD1 Homozygous)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[0.65rem] font-mono font-bold text-stone-400 uppercase block mb-1">Cardiac Auscultation & Echo</label>
                    <select
                      value={sireCardiac}
                      onChange={(e: any) => setSireCardiac(e.target.value)}
                      className="w-full p-2 bg-stone-50 dark:bg-stone-800 border-2 border-black dark:border-stone-700 rounded-lg font-bold"
                    >
                      <option value="Normal">OFA Normal / Clear (0 Murmurs)</option>
                      <option value="Flow Murmur">Innocent Flow Murmur</option>
                      <option value="SAS">Subvalvular Aortic Stenosis (SAS)</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            {/* Punnett Square Hereditary Outcome Breakdown */}
            <div className="p-5 bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl shadow-[3px_3px_0_#1A1A1A] space-y-4">
              <h4 className="text-xs font-mono font-black uppercase text-[#1A1A1A] dark:text-[#F0ECE6] border-b border-stone-200 dark:border-stone-800 pb-2">
                Simulated Offspring Disease Incidence (Litter Forecast)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                <div className="p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg space-y-1">
                  <strong className="text-black dark:text-white block font-mono">Progressive Retinal Atrophy (PRA-prcd):</strong>
                  <p className="text-stone-600 dark:text-stone-300">{praRisk}</p>
                </div>

                <div className="p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg space-y-1">
                  <strong className="text-black dark:text-white block font-mono">Degenerative Myelopathy (DM-SOD1):</strong>
                  <p className="text-stone-600 dark:text-stone-300">{dmRisk}</p>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border-2 border-amber-500 rounded-xl text-xs space-y-1">
                <strong className="text-amber-800 dark:text-amber-300 font-bold block font-mono uppercase">
                  Veterinary Breeding Recommendation:
                </strong>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  {geneticScore >= 90
                    ? "This pairing complies with all AVMA, AAHA, and OFA Canine Health Information Center (CHIC) standards. Zero puppies in the cohort will inherit clinical hereditary blindness or degenerative paralysis."
                    : "Carrier genetic status identified. While puppies will not express clinical disease if bred to a Clear partner, puppies sold with breeding rights must undergo genomic DNA profiling prior to future breeding cycles."}
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: BATCH NUTRI-CHEF & WEANING ANALYTICS */}
        {/* ========================================================================= */}
        {activeTab === 'nutrition' && (
          <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
            
            {/* Dam Lactation Energy Modeler */}
            <div className="p-5 bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl shadow-[3px_3px_0_#1A1A1A] space-y-5">
              
              <div className="flex flex-wrap items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3 gap-2">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-500" />
                    Nursing Dam Lactation Energy Modeler (NRC Standard)
                  </h3>
                  <span className="text-[0.65rem] font-mono text-stone-400">
                    Calculates exact daily metabolizable energy (ME) and calcium-phosphorus ratios based on litter size
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-[0.65rem] font-bold uppercase rounded border border-amber-500/30">
                  Peak Week 3-4 Multiplier Active
                </span>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono font-bold">
                <div>
                  <label className="block text-stone-400 uppercase text-[0.65rem] mb-1">Dam Weight (lbs): {damWeightLbs} lbs</label>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    value={damWeightLbs}
                    onChange={(e) => setDamWeightLbs(parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 uppercase text-[0.65rem] mb-1">Nursing Puppies: {nursingPuppyCount} Pups</label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={nursingPuppyCount}
                    onChange={(e) => setNursingPuppyCount(parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 uppercase text-[0.65rem] mb-1">Lactation Week: Week {lactationWeek}</label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={lactationWeek}
                    onChange={(e) => setLactationWeek(parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              {/* Calculated Outputs Bench */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-amber-500/10 border-2 border-amber-500 rounded-xl text-center">
                  <span className="text-[0.62rem] font-mono uppercase text-stone-500 block">Daily Target Caloric Intake</span>
                  <strong className="text-xl font-mono font-black text-amber-700 dark:text-amber-300">
                    {dailyDamKcal} kcal/day
                  </strong>
                  <span className="text-[0.62rem] text-stone-500 block">{(dailyDamKcal / 400).toFixed(1)} cups dry puppy food</span>
                </div>

                <div className="p-3 bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl text-center">
                  <span className="text-[0.62rem] font-mono uppercase text-stone-500 block">Crude Protein Target</span>
                  <strong className="text-xl font-mono font-black text-[#1A1A1A] dark:text-[#F0ECE6]">
                    {dailyProteinGrams} g/day
                  </strong>
                  <span className="text-[0.62rem] text-stone-500 block">Min 30% Dry Matter</span>
                </div>

                <div className="p-3 bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl text-center">
                  <span className="text-[0.62rem] font-mono uppercase text-stone-500 block">Calcium Requirement</span>
                  <strong className="text-xl font-mono font-black text-[#1A1A1A] dark:text-[#F0ECE6]">
                    {dailyCalciumGrams} g/day
                  </strong>
                  <span className="text-[0.62rem] text-stone-500 block">1.3:1 Ca:P Ratio</span>
                </div>

                <div className="p-3 bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl text-center">
                  <span className="text-[0.62rem] font-mono uppercase text-stone-500 block">Hydration Target</span>
                  <strong className="text-xl font-mono font-black text-sky-600 dark:text-sky-400">
                    {waterTargetMl} mL/day
                  </strong>
                  <span className="text-[0.62rem] text-stone-500 block">Fresh Water Ad Libitum</span>
                </div>
              </div>

            </div>

            {/* Weaning Transition Gruel Matrix */}
            <div className="p-5 bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl shadow-[3px_3px_0_#1A1A1A] space-y-4">
              <h4 className="text-xs font-mono font-black uppercase text-[#1A1A1A] dark:text-[#F0ECE6] flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                Litter Weaning Transition Matrix (3 to 8 Weeks Progression)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-xl space-y-1.5">
                  <span className="px-2 py-0.5 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono font-black text-[0.62rem] rounded uppercase">
                    Stage 1 • Weeks 3 to 4
                  </span>
                  <strong className="block font-black text-black dark:text-white">Milk Slurry Gruel</strong>
                  <p className="text-stone-600 dark:text-stone-400 text-[0.7rem] leading-relaxed">
                    90% warm goat milk/broth with 10% finely ground puppy kibble. Introduce in flat saucer pans 3x daily.
                  </p>
                </div>

                <div className="p-3.5 bg-stone-50 dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-xl space-y-1.5">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono font-black text-[0.62rem] rounded uppercase">
                    Stage 2 • Weeks 4 to 5
                  </span>
                  <strong className="block font-black text-black dark:text-white">Oatmeal Consistency Mush</strong>
                  <p className="text-stone-600 dark:text-stone-400 text-[0.7rem] leading-relaxed">
                    50% soaked puppy kibble, 50% warm water. Puppies begin active mastication and nursing reduction.
                  </p>
                </div>

                <div className="p-3.5 bg-stone-50 dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-xl space-y-1.5">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-black text-[0.62rem] rounded uppercase">
                    Stage 3 • Weeks 6 to 7
                  </span>
                  <strong className="block font-black text-black dark:text-white">Moistened Kibble</strong>
                  <p className="text-stone-600 dark:text-stone-400 text-[0.7rem] leading-relaxed">
                    25% warm water, 75% whole dry kibble. Dam separates for longer periods to dry lactation safely.
                  </p>
                </div>

                <div className="p-3.5 bg-stone-50 dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-xl space-y-1.5">
                  <span className="px-2 py-0.5 bg-sky-500/20 text-sky-700 dark:text-sky-300 font-mono font-black text-[0.62rem] rounded uppercase">
                    Stage 4 • Week 8+
                  </span>
                  <strong className="block font-black text-black dark:text-white">100% Solid Diet</strong>
                  <p className="text-stone-600 dark:text-stone-400 text-[0.7rem] leading-relaxed">
                    Fully transitioned to dry growth formula (3 meals/day). Ready for adopter handoff and health warranty transfer.
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: ADOPTER CRM (MANAGE UP TO 25 PROFILES) */}
        {/* ========================================================================= */}
        {activeTab === 'adopters' && (
          <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
            
            {/* CRM Header */}
            <div className="flex flex-wrap items-center justify-between p-4 bg-stone-900 text-white rounded-xl border-2 border-black shadow-[3px_3px_0_#000] gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight">Adopter & Placement Pipeline (25 Profile Capacity)</h3>
                  <span className="text-[0.65rem] font-mono text-stone-300">
                    {adopters.length} of 25 Active Adopter Slots Utilized • {adopters.filter(a => a.status === 'Contract Signed').length} Placements Finalized
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    value={searchAdopter}
                    onChange={(e) => setSearchAdopter(e.target.value)}
                    placeholder="Search buyers..."
                    className="bg-stone-800 text-white text-xs font-mono pl-8 pr-3 py-1.5 rounded-lg border border-stone-700 focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => setIsAddingAdopter(!isAddingAdopter)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase rounded-lg border border-black flex items-center gap-1 cursor-pointer shadow-[2px_2px_0_#000]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Adopter</span>
                </button>
              </div>
            </div>

            {/* Adopters Table */}
            <div className="bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[3px_3px_0_#1A1A1A] rounded-xl overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 dark:bg-stone-800 border-b-2 border-black font-mono text-[0.65rem] uppercase">
                  <tr>
                    <th className="p-3">Adopter Name & Location</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Assigned Puppy</th>
                    <th className="p-3">Financial Status</th>
                    <th className="p-3">Handoff Checklist</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {adopters
                    .filter(a => a.fullName.toLowerCase().includes(searchAdopter.toLowerCase()) || a.email.toLowerCase().includes(searchAdopter.toLowerCase()))
                    .map(adopter => (
                      <tr key={adopter.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                        <td className="p-3">
                          <strong className="block text-black dark:text-white">{adopter.fullName}</strong>
                          <span className="text-[0.65rem] font-mono text-stone-500">{adopter.cityState}</span>
                        </td>

                        <td className="p-3 font-mono text-[0.68rem] text-stone-600 dark:text-stone-400">
                          <div>{adopter.email}</div>
                          <div>{adopter.phone}</div>
                        </td>

                        <td className="p-3">
                          {adopter.assignedPuppyName ? (
                            <span className="font-bold text-amber-700 dark:text-amber-400">
                              {adopter.assignedPuppyName}
                            </span>
                          ) : (
                            <span className="text-stone-400 italic text-[0.68rem]">Waitlist ({adopter.preferredBreed})</span>
                          )}
                        </td>

                        <td className="p-3 font-mono text-[0.68rem]">
                          <div className="font-bold text-emerald-600">${adopter.depositAmount} Paid</div>
                          <div className="text-stone-400">Total: ${adopter.totalFee}</div>
                        </td>

                        <td className="p-3 text-[0.65rem] space-y-0.5">
                          <div className="flex items-center gap-1 text-emerald-600 font-bold">
                            <Check className="w-3 h-3" /> Home Check: {adopter.homeChecked ? 'Passed' : 'Pending'}
                          </div>
                          <div className={`flex items-center gap-1 font-bold ${adopter.contractSigned ? 'text-emerald-600' : 'text-stone-400'}`}>
                            {adopter.contractSigned ? <Check className="w-3 h-3" /> : '○'} Contract: {adopter.contractSigned ? 'Signed' : 'Pending'}
                          </div>
                        </td>

                        <td className="p-3">
                          <button
                            onClick={() => {
                              const pup = litters.flatMap(l => l.puppies).find(p => p.id === adopter.assignedPuppyId) || litters[0].puppies[0];
                              setSelectedPuppyForPassport(pup);
                              setActiveTab('passports');
                            }}
                            className="px-2 py-1 bg-amber-500/15 hover:bg-amber-500 text-amber-800 dark:text-amber-300 hover:text-white rounded text-[0.62rem] font-mono font-bold uppercase transition-all cursor-pointer"
                          >
                            Health Passport
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-2.5 rounded-xl border-2 border-amber-500 shadow-[4px_4px_0_#d97706] font-mono text-xs font-bold z-50 animate-[fadeIn_0.2s_ease-out]">
          {toast}
        </div>
      )}

    </div>
  );
}
