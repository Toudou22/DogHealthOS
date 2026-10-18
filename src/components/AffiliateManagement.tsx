/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState, useMemo } from 'react';
import { 
  Shield, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  Tag, 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Copy, 
  Check, 
  TrendingUp, 
  Award, 
  AlertCircle, 
  ArrowUpRight, 
  Utensils, 
  HeartHandshake, 
  BadgePercent,
  Download,
  Trash2,
  Edit2,
  X,
  Clock,
  ChevronDown,
  PauseCircle,
  Mail,
  Phone,
  Users,
  MessageSquare,
  FileCheck,
  History,
  Send,
  Save,
  UserCheck,
  Briefcase,
  ShieldCheck,
  Info,
  ChevronRight
} from 'lucide-react';

export type AffiliateStatus = 'active' | 'pending' | 'pending_renewal' | 'review' | 'inactive';

export interface ContactHistoryLog {
  id: string;
  date: string;
  type: 'email' | 'call' | 'meeting' | 'contract_update' | 'payout_review';
  author: string;
  summary: string;
  details?: string;
}

export interface PartnerContractTerms {
  termYears: number;
  autoRenew: boolean;
  terminationNoticeDays: number;
  paymentSchedule: 'Monthly Net 30' | 'Bi-Weekly Net 15' | 'Quarterly Net 45' | 'Custom';
  minimumPayoutThreshold: number;
  exclusivity: boolean;
  specialIncentiveTier?: string;
  complianceAuditStatus: 'Fully Verified' | 'Pending Audit' | 'Conditional Approval';
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;
}

export interface AffiliatePartner {
  id: string;
  name: string;
  category: 'insurance' | 'certified_food';
  tagline: string;
  affiliateNumber: string;
  affiliationStartDate: string;
  contractRenewalDate: string;
  feeStructure: string;
  feeType: 'flat_payout' | 'rev_share' | 'cpa_lead';
  averagePayout: number;
  status: AffiliateStatus;
  certifiedBody: string;
  certDetails: string;
  referralUrl: string;
  clicks: number;
  conversions: number;
  earnedRevenue: number;
  highlightSpecs: string[];
  notes?: string;
  contactHistory?: ContactHistoryLog[];
  contractTerms?: PartnerContractTerms;
}

interface StatusBadgeProps {
  status: AffiliateStatus;
  onStatusChange?: (newStatus: AffiliateStatus) => void;
  interactive?: boolean;
}

export function AffiliateStatusBadge({ status, onStatusChange, interactive = true }: StatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const configMap = {
    active: {
      label: 'Active',
      colorClass: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25',
      dotClass: 'bg-emerald-500',
      icon: CheckCircle2,
      pulse: true
    },
    pending: {
      label: 'Pending',
      colorClass: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/40 hover:bg-amber-500/25',
      dotClass: 'bg-amber-500',
      icon: Clock,
      pulse: false
    },
    pending_renewal: {
      label: 'Pending Renewal',
      colorClass: 'bg-yellow-500/15 text-yellow-800 dark:text-yellow-300 border-yellow-500/40 hover:bg-yellow-500/25',
      dotClass: 'bg-yellow-500',
      icon: AlertCircle,
      pulse: false
    },
    review: {
      label: 'Under Review',
      colorClass: 'bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/40 hover:bg-sky-500/25',
      dotClass: 'bg-sky-500',
      icon: Search,
      pulse: false
    },
    inactive: {
      label: 'Inactive',
      colorClass: 'bg-stone-500/15 text-stone-700 dark:text-stone-300 border-stone-500/40 hover:bg-stone-500/25',
      dotClass: 'bg-stone-400',
      icon: PauseCircle,
      pulse: false
    }
  };

  const current = configMap[status] || configMap.active;
  const Icon = current.icon;

  if (!interactive || !onStatusChange) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[0.62rem] font-bold uppercase tracking-wider border shadow-xs ${current.colorClass}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${current.dotClass} ${current.pulse ? 'animate-pulse' : ''}`} />
        <Icon className="w-3 h-3" />
        <span>{current.label}</span>
      </span>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[0.62rem] font-black uppercase tracking-wider border transition-all cursor-pointer shadow-xs active:scale-95 ${current.colorClass}`}
        title="Click to toggle or change partnership status"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${current.dotClass} ${current.pulse ? 'animate-pulse' : ''}`} />
        <Icon className="w-3 h-3" />
        <span>{current.label}</span>
        <ChevronDown className="w-2.5 h-2.5 opacity-60 ml-0.5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-1.5 w-44 rounded-xl bg-white dark:bg-[#1E1C18] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] p-1.5 z-40 space-y-1 font-mono text-[0.65rem]">
            <div className="px-2 py-1 text-[0.6rem] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-200 dark:border-stone-800">
              Set Partner Status
            </div>
            {(['active', 'pending', 'pending_renewal', 'review', 'inactive'] as AffiliateStatus[]).map((st) => {
              const item = configMap[st];
              const ItemIcon = item.icon;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    onStatusChange(st);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                    st === status
                      ? 'bg-stone-100 dark:bg-stone-800 font-bold text-[#1A1A1A] dark:text-white'
                      : 'hover:bg-stone-50 dark:hover:bg-stone-800/50 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${item.dotClass}`} />
                    <ItemIcon className="w-3 h-3 opacity-70" />
                    <span>{item.label}</span>
                  </span>
                  {st === status && <Check className="w-3 h-3 text-emerald-500" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

const INITIAL_AFFILIATES: AffiliatePartner[] = [
  // 1. Dog Insurance Companies
  {
    id: 'aff-ins-01',
    name: 'Lily & Lee Pet Insurance',
    category: 'insurance',
    tagline: 'Direct-to-vet reimbursement & hereditary condition coverage for all sizes',
    affiliateNumber: 'AFF-LL-90412',
    affiliationStartDate: '2024-02-10',
    contractRenewalDate: '2026-12-31',
    feeStructure: '$45.00 Flat CPA per Valid Policy',
    feeType: 'flat_payout',
    averagePayout: 45.0,
    status: 'active',
    certifiedBody: 'NAIC & State Dept of Insurance Licensed',
    certDetails: 'Underwritten by AM Best "A" Rated Carrier; No Breed Exclusions for Hip Dysplasia or BOAS',
    referralUrl: 'https://lilyandlee.com/partner/doghealthos?ref=AFF-LL-90412',
    clicks: 1420,
    conversions: 88,
    earnedRevenue: 3960,
    highlightSpecs: [
      'Up to 90% direct-pay vet coverage',
      'Hereditary & congenital coverage included',
      'Zero annual payout caps on Elite tiers'
    ]
  },
  {
    id: 'aff-ins-02',
    name: 'Fetch by The Dodo (FetchPets)',
    category: 'insurance',
    tagline: 'Comprehensive clinical sick visits, dental disease & exam fees',
    affiliateNumber: 'AFF-FETCH-77209',
    affiliationStartDate: '2023-11-01',
    contractRenewalDate: '2026-11-01',
    feeStructure: '$38.50 CPA Lead + 5% Recurring RevShare',
    feeType: 'cpa_lead',
    averagePayout: 38.5,
    status: 'active',
    certifiedBody: 'North American Pet Health Insurance Assoc. (NAPHIA)',
    certDetails: 'Full compliance with veterinary clinical guidelines; covers holistic treatments and physical therapy',
    referralUrl: 'https://fetchpet.com/doghealthos?aff_id=AFF-FETCH-77209',
    clicks: 2150,
    conversions: 142,
    earnedRevenue: 5467,
    highlightSpecs: [
      'Sick visit exam fees included in base policy',
      'Full dental injury and comprehensive illness cover',
      'Behavioral therapy coverage by vet referral'
    ]
  },
  {
    id: 'aff-ins-03',
    name: 'Trupanion Medical Coverage',
    category: 'insurance',
    tagline: 'Direct vet billing in seconds with 90% uncapped reimbursement',
    affiliateNumber: 'AFF-TRU-61904',
    affiliationStartDate: '2023-08-15',
    contractRenewalDate: '2027-01-15',
    feeStructure: '$50.00 per Activated Medical Policy',
    feeType: 'flat_payout',
    averagePayout: 50.0,
    status: 'active',
    certifiedBody: 'AVMA & AAHA Hospital Integrated System',
    certDetails: 'Direct vet software integration (Vet Direct Pay™); lifetime per-condition deductible design',
    referralUrl: 'https://trupanion.com/partner/doghealthos?affiliate=AFF-TRU-61904',
    clicks: 1890,
    conversions: 94,
    earnedRevenue: 4700,
    highlightSpecs: [
      'Pays veterinary clinic directly at checkout',
      'One-time condition deductible for dog life',
      'Unlimited lifetime coverage without payout ceilings'
    ]
  },
  {
    id: 'aff-ins-04',
    name: 'Lemonade Pet Health',
    category: 'insurance',
    tagline: 'AI-accelerated claims processing with customizable preventative add-ons',
    affiliateNumber: 'AFF-LEM-44120',
    affiliationStartDate: '2024-04-01',
    contractRenewalDate: '2027-04-01',
    feeStructure: '$35.00 Flat per Bound Policy',
    feeType: 'flat_payout',
    averagePayout: 35.0,
    status: 'pending_renewal',
    certifiedBody: 'Certified B-Corp & State Insurance Commissioners',
    certDetails: 'Giveback model donating unclaimed premiums; digital-first claims settled in under 3 minutes',
    referralUrl: 'https://lemonade.com/pet/doghealthos?promo=AFF-LEM-44120',
    clicks: 2840,
    conversions: 165,
    earnedRevenue: 5775,
    highlightSpecs: [
      'Lightning-fast claims approval via AI',
      'Tailored puppy and senior preventative add-ons',
      'Multi-pet discount and bundle savings'
    ]
  },
  {
    id: 'aff-ins-05',
    name: 'Spot Pet Insurance',
    category: 'insurance',
    tagline: 'Customizable deductibles and coverage limits with microchip support',
    affiliateNumber: 'AFF-SPOT-33829',
    affiliationStartDate: '2024-05-12',
    contractRenewalDate: '2026-10-12',
    feeStructure: '$42.00 CPA per Approved Plan',
    feeType: 'flat_payout',
    averagePayout: 42.0,
    status: 'pending',
    certifiedBody: 'AKC Pet Insurance Partner / NAPHIA Code of Conduct',
    certDetails: 'Covers breed-specific genetic traits, alternative therapies, and FDA-approved cancer treatments',
    referralUrl: 'https://spotpetins.com/affiliate/doghealthos?code=AFF-SPOT-33829',
    clicks: 1120,
    conversions: 62,
    earnedRevenue: 2604,
    highlightSpecs: [
      '24/7 Pet Telehealth helpline access',
      'No upper age restrictions on senior dogs',
      'Free microchip registration reimbursement'
    ]
  },
  {
    id: 'aff-ins-06',
    name: 'Healthy Paws Pet Insurance',
    category: 'insurance',
    tagline: 'Top-rated unlimited lifetime catastrophe and illness protection',
    affiliateNumber: 'AFF-HP-55318',
    affiliationStartDate: '2023-09-20',
    contractRenewalDate: '2026-09-20',
    feeStructure: '$40.00 Flat per Enrolled Pet',
    feeType: 'flat_payout',
    averagePayout: 40.0,
    status: 'active',
    certifiedBody: 'NAPHIA Platinum Standard / AM Best A+ Carrier',
    certDetails: 'Every policy helps fund pet homeless initiatives; zero lifetime maximum caps on all medical conditions',
    referralUrl: 'https://healthypawspetinsurance.com/partner/doghealthos?aff=AFF-HP-55318',
    clicks: 1310,
    conversions: 71,
    earnedRevenue: 2840,
    highlightSpecs: [
      'No caps on per-incident, annual, or lifetime payouts',
      'Covers diagnostic tests (X-rays, ultrasounds, blood work)',
      '99% of claims processed within two business days'
    ]
  },

  // 2. Animal Reference Bodies Certified Healthy Dog Food Companies
  {
    id: 'aff-food-01',
    name: 'Royal Canin Veterinary Diet',
    category: 'certified_food',
    tagline: 'Precision clinical veterinary diets formulated for size & hereditary health',
    affiliateNumber: 'AFF-RC-10492',
    affiliationStartDate: '2023-06-01',
    contractRenewalDate: '2027-06-01',
    feeStructure: '12% Monthly RevShare on Autoship Orders',
    feeType: 'rev_share',
    averagePayout: 18.5,
    status: 'active',
    certifiedBody: 'WSAVA Global Nutrition Committee & AAFCO Certified',
    certDetails: 'Strict compliance with WSAVA 8-point manufacturer guidelines; board-certified DACVIM veterinary nutritionists on full-time research staff',
    referralUrl: 'https://royalcanin.com/us/vet-diets?ref=AFF-RC-10492',
    clicks: 3410,
    conversions: 230,
    earnedRevenue: 4255,
    highlightSpecs: [
      'Calibrated for specific breed jaw sizes & metabolic rates',
      'Hydrolyzed protein & renal clinical therapeutic formulas',
      '100% complete and balanced across all AAFCO profiles'
    ]
  },
  {
    id: 'aff-food-02',
    name: "Hill's Prescription Diet & Science Diet",
    category: 'certified_food',
    tagline: 'Biology-based nutrition validated by over 220 PhD nutritionists & vets',
    affiliateNumber: 'AFF-HILLS-29481',
    affiliationStartDate: '2023-07-15',
    contractRenewalDate: '2027-07-15',
    feeStructure: '14% Recurring RevShare on Clinical Orders',
    feeType: 'rev_share',
    averagePayout: 21.0,
    status: 'active',
    certifiedBody: 'WSAVA & Global Veterinary Nutrition Taskforce',
    certDetails: 'Peer-reviewed clinical feeding trials according to AAFCO protocols; Global Pet Nutrition Center research facility verification',
    referralUrl: 'https://hillspet.com/science-diet?partner=AFF-HILLS-29481',
    clicks: 3980,
    conversions: 275,
    earnedRevenue: 5775,
    highlightSpecs: [
      'Clinically proven to improve mobility in 21 days (j/d formula)',
      'ActivBiome+ technology for gut microbiome optimization',
      'Strict quality controls with 100+ ingredient inspections'
    ]
  },
  {
    id: 'aff-food-03',
    name: 'Purina Pro Plan Veterinary Diets',
    category: 'certified_food',
    tagline: 'Evidence-based clinical formulas backed by the Purina 14-Year Longevity Study',
    affiliateNumber: 'AFF-PUR-40291',
    affiliationStartDate: '2023-09-10',
    contractRenewalDate: '2026-09-10',
    feeStructure: '11% RevShare on Veterinary Autoship',
    feeType: 'rev_share',
    averagePayout: 16.5,
    status: 'pending_renewal',
    certifiedBody: 'WSAVA Nutritional Standards & Purina Institute',
    certDetails: 'Conducted landmark 14-year life span trial proving 15% calorie restriction adds 1.8-2.5 healthy years (Kealy et al., JAVMA)',
    referralUrl: 'https://purina.com/pro-plan/veterinary-diets?aff_id=AFF-PUR-40291',
    clicks: 2750,
    conversions: 198,
    earnedRevenue: 3267,
    highlightSpecs: [
      'NeuroCare formula with medium-chain triglycerides (MCTs)',
      'Live probiotics guaranteed in every dry food kibble',
      'Purina Institute global peer-reviewed veterinary research'
    ]
  },
  {
    id: 'aff-food-04',
    name: "The Farmer's Dog (Human-Grade)",
    category: 'certified_food',
    tagline: 'Freshly cooked whole-food personalized meals delivered in precise daily packs',
    affiliateNumber: 'AFF-TFD-77312',
    affiliationStartDate: '2024-01-20',
    contractRenewalDate: '2027-01-20',
    feeStructure: '$48.00 per New Subscription Signup',
    feeType: 'flat_payout',
    averagePayout: 48.0,
    status: 'active',
    certifiedBody: 'AAFCO Dog Food Nutrient Profiles (All Life Stages)',
    certDetails: 'Cooked in USDA-inspected kitchens with 100% human-grade whole meats and vegetables; formulated by board-certified DACVIM nutritionists',
    referralUrl: 'https://thefarmersdog.com/doghealthos?deal=50off&aff=AFF-TFD-77312',
    clicks: 4210,
    conversions: 310,
    earnedRevenue: 14880,
    highlightSpecs: [
      'Pre-portioned caloric packets tailored to dog weight & RER',
      'Gently steamed whole meats without high-heat extrusion',
      'Nutrient absorption verified by veterinary clinical testing'
    ]
  },
  {
    id: 'aff-food-05',
    name: 'JustFoodForDogs Veterinary Diets',
    category: 'certified_food',
    tagline: 'Scientifically proven whole-food nutrition validated by university research',
    affiliateNumber: 'AFF-JFFD-88192',
    affiliationStartDate: '2024-03-05',
    contractRenewalDate: '2027-03-05',
    feeStructure: '15% Monthly RevShare on Rx Fresh Diets',
    feeType: 'rev_share',
    averagePayout: 24.0,
    status: 'review',
    certifiedBody: 'WSAVA Compliant & University of Illinois Clinical Trial Certified',
    certDetails: 'First whole food diet to complete year-long humane feeding trials proven to promote immune system health (Univ of Illinois study)',
    referralUrl: 'https://justfoodfordogs.com/partner/doghealthos?aff=AFF-JFFD-88192',
    clicks: 1950,
    conversions: 125,
    earnedRevenue: 3000,
    highlightSpecs: [
      'Prescription fresh food lines for hepatic, renal & GI support',
      'Zero feed-grade ingredients or preservative chemicals',
      'Open-to-public veterinary kitchens across North America'
    ]
  },
  {
    id: 'aff-food-06',
    name: 'Nom Nom Vet-Formulated Fresh Diet',
    category: 'certified_food',
    tagline: 'Individual vacuum-sealed fresh nutrition with targeted gut health prebiotics',
    affiliateNumber: 'AFF-NOM-66381',
    affiliationStartDate: '2024-02-28',
    contractRenewalDate: '2026-11-28',
    feeStructure: '$42.00 CPA + 8% Recurring RevShare',
    feeType: 'cpa_lead',
    averagePayout: 42.0,
    status: 'pending',
    certifiedBody: 'AAFCO Complete & Balanced Standard (DACVIM Formulated)',
    certDetails: 'Recipes custom-balanced by two Board-Certified Veterinary Nutritionists; manufactured in 100% company-owned facilities',
    referralUrl: 'https://nomnomnow.com/partner/doghealthos?ref=AFF-NOM-66381',
    clicks: 1680,
    conversions: 98,
    earnedRevenue: 4116,
    highlightSpecs: [
      'Strict AAFCO nutrient profiles exceeded in each formula',
      'Single-protein options for dogs with acute allergy sensitivities',
      'Microbiome testing kit included with 6-month plans'
    ]
  },
  {
    id: 'aff-food-07',
    name: 'Orijen & Acana Certified Biological Nutrition',
    category: 'certified_food',
    tagline: 'WholePrey protein-rich complete diets mirroring ancestral canine biology',
    affiliateNumber: 'AFF-ORJ-55209',
    affiliationStartDate: '2023-12-14',
    contractRenewalDate: '2026-12-14',
    feeStructure: '10% RevShare on Certified Retail Orders',
    feeType: 'rev_share',
    averagePayout: 14.0,
    status: 'active',
    certifiedBody: 'FEDIAF & AAFCO Complete Nutritional Standard',
    certDetails: '85% premium animal ingredients with organs and cartilage; verified nutrient bioavailability and natural amino acid preservation',
    referralUrl: 'https://orijenpetfoods.com/partner/doghealthos?aff=AFF-ORJ-55209',
    clicks: 1430,
    conversions: 82,
    earnedRevenue: 1148,
    highlightSpecs: [
      'Fresh and raw regional poultry, wild-caught fish and game',
      'Naturally nutrient-dense without synthetic vitamin supplementation',
      'Award-winning DogStar kitchen production with 100% traceability'
    ]
  }
];

export function ensurePartnerDetailsDefaults(partner: AffiliatePartner): AffiliatePartner {
  const defaultTerms: PartnerContractTerms = partner.contractTerms || {
    termYears: 3,
    autoRenew: true,
    terminationNoticeDays: 30,
    paymentSchedule: partner.feeType === 'rev_share' ? 'Monthly Net 30' : 'Bi-Weekly Net 15',
    minimumPayoutThreshold: 100,
    exclusivity: partner.category === 'certified_food',
    specialIncentiveTier: partner.earnedRevenue > 5000 
      ? 'Tier 1 Performance Bonus (+5% payout bonus on 100+ monthly conversions)' 
      : 'Standard Partner Tier',
    complianceAuditStatus: 'Fully Verified',
    primaryContactName: partner.name.includes('Lily') ? 'Sarah Jenkins' : partner.name.includes('Fetch') ? 'David Vance' : partner.name.includes('Trupanion') ? 'Mark Thornton' : 'Amanda Hayes',
    primaryContactEmail: `partnerships@${partner.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    primaryContactPhone: '+1 (800) 555-0199'
  };

  const defaultHistory: ContactHistoryLog[] = partner.contactHistory && partner.contactHistory.length > 0
    ? partner.contactHistory
    : [
        {
          id: `log-1-${partner.id}`,
          date: partner.affiliationStartDate,
          type: 'contract_update',
          author: 'Anthony T. (Admin)',
          summary: 'Initial Master Services Agreement Executed',
          details: `Agreement terms finalized with ${partner.feeStructure}. Certified compliance under ${partner.certifiedBody}.`
        },
        {
          id: `log-2-${partner.id}`,
          date: '2024-06-15',
          type: 'payout_review',
          author: 'Financial Audit Ops',
          summary: 'Quarterly Revenue Settlement & Tracking Verification',
          details: `Verified ${partner.conversions} total conversions with $${partner.earnedRevenue} earned payouts. Zero attribution discrepancies detected.`
        },
        {
          id: `log-3-${partner.id}`,
          date: '2024-09-10',
          type: 'meeting',
          author: 'Partnership Success Mgr',
          summary: 'Q3 Partner Strategy & API Integration Sync',
          details: 'Discussed co-marketing materials for DogHealthOS longevity suite and API tracking webhook stability.'
        }
      ];

  const defaultNotes = partner.notes !== undefined ? partner.notes : 
    `Strategic VIP partner with high conversion velocity. Verified under ${partner.certifiedBody}. Primary contact handles contract renewals and quarterly payout auditing.`;

  return {
    ...partner,
    contractTerms: defaultTerms,
    contactHistory: defaultHistory,
    notes: defaultNotes
  };
}

interface AffiliateDetailModalProps {
  partner: AffiliatePartner;
  onClose: () => void;
  onUpdatePartner: (updated: AffiliatePartner) => void;
}

export function AffiliateDetailModal({ partner, onClose, onUpdatePartner }: AffiliateDetailModalProps) {
  const fullPartner = useMemo(() => ensurePartnerDetailsDefaults(partner), [partner]);

  const [activeTab, setActiveTab] = useState<'terms' | 'history' | 'notes' | 'specs'>('terms');
  
  // Notes state
  const [notes, setNotes] = useState<string>(fullPartner.notes || '');
  const [notesSavedToast, setNotesSavedToast] = useState<boolean>(false);

  // Contract Terms state
  const [terms, setTerms] = useState<PartnerContractTerms>(fullPartner.contractTerms!);
  const [isEditingTerms, setIsEditingTerms] = useState<boolean>(false);

  // Contact History state
  const [contactLogs, setContactLogs] = useState<ContactHistoryLog[]>(fullPartner.contactHistory || []);
  const [isAddingLog, setIsAddingLog] = useState<boolean>(false);
  const [newLog, setNewLog] = useState<{
    date: string;
    type: ContactHistoryLog['type'];
    author: string;
    summary: string;
    details: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    type: 'email',
    author: 'Admin',
    summary: '',
    details: ''
  });

  const handleSaveNotes = () => {
    const updated = {
      ...fullPartner,
      notes
    };
    onUpdatePartner(updated);
    setNotesSavedToast(true);
    setTimeout(() => setNotesSavedToast(false), 2500);
  };

  const handleSaveTerms = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...fullPartner,
      contractTerms: terms
    };
    onUpdatePartner(updated);
    setIsEditingTerms(false);
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.summary.trim()) {
      return;
    }
    const createdLog: ContactHistoryLog = {
      id: `log-${Date.now()}`,
      date: newLog.date || new Date().toISOString().split('T')[0],
      type: newLog.type,
      author: newLog.author || 'Admin',
      summary: newLog.summary,
      details: newLog.details
    };
    const updatedLogs = [createdLog, ...contactLogs];
    setContactLogs(updatedLogs);
    const updated = {
      ...fullPartner,
      contactHistory: updatedLogs
    };
    onUpdatePartner(updated);
    setIsAddingLog(false);
    setNewLog({
      date: new Date().toISOString().split('T')[0],
      type: 'email',
      author: 'Admin',
      summary: '',
      details: ''
    });
  };

  const isInsurance = fullPartner.category === 'insurance';

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#1E1C18] border-[3px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[10px_10px_0_#FF6B4A] rounded-2xl max-w-4xl w-full p-6 my-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto text-[#1A1A1A] dark:text-[#F0ECE6]">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-stone-200 dark:border-stone-800 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full font-mono text-[0.62rem] font-black uppercase tracking-wider flex items-center gap-1 ${
                isInsurance 
                  ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                  : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
              }`}>
                {isInsurance ? <Shield className="w-3 h-3" /> : <Utensils className="w-3 h-3" />}
                {isInsurance ? 'Dog Insurance Partner' : 'Certified Food Partner'}
              </span>

              <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-mono text-[0.62rem] font-bold">
                {fullPartner.affiliateNumber}
              </span>

              <AffiliateStatusBadge 
                status={fullPartner.status} 
                onStatusChange={(newStatus) => {
                  onUpdatePartner({ ...fullPartner, status: newStatus });
                }} 
              />
            </div>

            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 font-mono">
              {fullPartner.name}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-0.5">
              {fullPartner.tagline}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1E1C18] hover:bg-rose-500 hover:text-white transition-all cursor-pointer shadow-[2px_2px_0_#1A1A1A] shrink-0"
            title="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-stone-50 dark:bg-[#141210] border border-[#1A1A1A]/10 dark:border-white/10 font-mono text-xs">
          <div>
            <span className="text-[0.6rem] uppercase tracking-wider text-stone-400 block mb-0.5 font-bold">
              Earned Revenue
            </span>
            <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm sm:text-base">
              ${fullPartner.earnedRevenue.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[0.6rem] uppercase tracking-wider text-stone-400 block mb-0.5 font-bold">
              Clicks / Conversions
            </span>
            <span className="font-bold text-stone-800 dark:text-stone-200">
              {fullPartner.clicks} / <strong className="text-[#FF6B4A]">{fullPartner.conversions}</strong>
            </span>
          </div>
          <div>
            <span className="text-[0.6rem] uppercase tracking-wider text-stone-400 block mb-0.5 font-bold">
              Fee Model
            </span>
            <span className="font-bold text-stone-800 dark:text-stone-200 text-[0.68rem] truncate block" title={fullPartner.feeStructure}>
              {fullPartner.feeStructure}
            </span>
          </div>
          <div>
            <span className="text-[0.6rem] uppercase tracking-wider text-stone-400 block mb-0.5 font-bold">
              Contract Renewal
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {fullPartner.contractRenewalDate}
            </span>
          </div>
        </div>

        {/* Modal Navigation Subtabs */}
        <div className="flex flex-wrap gap-2 border-b-2 border-stone-200 dark:border-stone-800 pb-2">
          {[
            { id: 'terms', label: '📋 Contract Terms', icon: FileCheck },
            { id: 'history', label: `💬 Contact History (${contactLogs.length})`, icon: History },
            { id: 'notes', label: '📝 Dedicated Notes', icon: FileText },
            { id: 'specs', label: '⚡ Specs & Referral Link', icon: ExternalLink }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1A1A1A] text-white dark:bg-[#F0ECE6] dark:text-[#1A1A1A] shadow-[2px_2px_0_#FF6B4A]'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: CONTRACT TERMS */}
        {activeTab === 'terms' && (
          <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-sm font-black uppercase flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#FF6B4A]" />
                Specific Contract Terms & SLA Guarantees
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingTerms(!isEditingTerms)}
                className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-amber-500/20 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-600" />
                <span>{isEditingTerms ? 'Cancel Editing' : 'Edit Contract Terms'}</span>
              </button>
            </div>

            {isEditingTerms ? (
              <form onSubmit={handleSaveTerms} className="p-4 bg-stone-50 dark:bg-stone-900 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl space-y-3 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase text-[0.62rem] text-stone-500 mb-1">
                      Term Duration (Years)
                    </label>
                    <input
                      type="number"
                      value={terms.termYears}
                      onChange={(e) => setTerms({ ...terms, termYears: Number(e.target.value) })}
                      className="w-full bg-white dark:bg-stone-800 border p-2 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-[0.62rem] text-stone-500 mb-1">
                      Termination Notice (Days)
                    </label>
                    <input
                      type="number"
                      value={terms.terminationNoticeDays}
                      onChange={(e) => setTerms({ ...terms, terminationNoticeDays: Number(e.target.value) })}
                      className="w-full bg-white dark:bg-stone-800 border p-2 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-[0.62rem] text-stone-500 mb-1">
                      Payment Schedule
                    </label>
                    <select
                      value={terms.paymentSchedule}
                      onChange={(e) => setTerms({ ...terms, paymentSchedule: e.target.value as any })}
                      className="w-full bg-white dark:bg-stone-800 border p-2 rounded-lg font-mono font-bold"
                    >
                      <option value="Monthly Net 30">Monthly Net 30</option>
                      <option value="Bi-Weekly Net 15">Bi-Weekly Net 15</option>
                      <option value="Quarterly Net 45">Quarterly Net 45</option>
                      <option value="Custom">Custom Schedule</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-[0.62rem] text-stone-500 mb-1">
                      Minimum Payout Threshold ($)
                    </label>
                    <input
                      type="number"
                      value={terms.minimumPayoutThreshold}
                      onChange={(e) => setTerms({ ...terms, minimumPayoutThreshold: Number(e.target.value) })}
                      className="w-full bg-white dark:bg-stone-800 border p-2 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-[0.62rem] text-stone-500 mb-1">
                      Primary Contact Representative Name
                    </label>
                    <input
                      type="text"
                      value={terms.primaryContactName || ''}
                      onChange={(e) => setTerms({ ...terms, primaryContactName: e.target.value })}
                      className="w-full bg-white dark:bg-stone-800 border p-2 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-[0.62rem] text-stone-500 mb-1">
                      Primary Contact Email
                    </label>
                    <input
                      type="email"
                      value={terms.primaryContactEmail || ''}
                      onChange={(e) => setTerms({ ...terms, primaryContactEmail: e.target.value })}
                      className="w-full bg-white dark:bg-stone-800 border p-2 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={terms.autoRenew}
                      onChange={(e) => setTerms({ ...terms, autoRenew: e.target.checked })}
                      className="w-4 h-4 rounded border-[#1A1A1A] text-[#FF6B4A]"
                    />
                    <span>Auto-Renew Agreement at End of Term</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={terms.exclusivity}
                      onChange={(e) => setTerms({ ...terms, exclusivity: e.target.checked })}
                      className="w-4 h-4 rounded border-[#1A1A1A] text-[#FF6B4A]"
                    />
                    <span>Category Exclusivity Clause</span>
                  </label>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase rounded-lg shadow-sm cursor-pointer"
                  >
                    Save Contract Terms
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-4 bg-stone-50 dark:bg-[#141210] border border-stone-200 dark:border-stone-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold border-b pb-2 border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500 uppercase">Contract Duration & Renewal</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-xs font-mono space-y-1.5 pt-1">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Term Length:</span>
                      <strong className="text-stone-900 dark:text-stone-100">{terms.termYears} Years</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Auto-Renewal Clause:</span>
                      <span className={`font-bold px-1.5 py-0.2 rounded text-[0.62rem] uppercase ${
                        terms.autoRenew ? 'bg-emerald-500/15 text-emerald-700' : 'bg-stone-200 text-stone-600'
                      }`}>
                        {terms.autoRenew ? 'Enabled (Automatic)' : 'Manual Review Required'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Termination Notice:</span>
                      <strong className="text-stone-900 dark:text-stone-100">{terms.terminationNoticeDays} Days Notice</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-[#141210] border border-stone-200 dark:border-stone-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold border-b pb-2 border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500 uppercase">Payout Terms & Cadence</span>
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-xs font-mono space-y-1.5 pt-1">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Payment Schedule:</span>
                      <strong className="text-stone-900 dark:text-stone-100">{terms.paymentSchedule}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Minimum Threshold:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">${terms.minimumPayoutThreshold}.00 USD</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Exclusivity Status:</span>
                      <span className={`font-bold px-1.5 py-0.2 rounded text-[0.62rem] uppercase ${
                        terms.exclusivity ? 'bg-purple-500/15 text-purple-700' : 'bg-stone-200 text-stone-600'
                      }`}>
                        {terms.exclusivity ? 'Category Exclusive' : 'Non-Exclusive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-[#141210] border border-stone-200 dark:border-stone-800 rounded-xl space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold border-b pb-2 border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500 uppercase">Performance Bonus Tier & Compliance Audit</span>
                    <Award className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-1">
                    <div>
                      <span className="text-stone-500 block mb-0.5 text-[0.62rem] uppercase font-bold">Special Incentive Tier:</span>
                      <p className="font-bold text-purple-700 dark:text-purple-300">
                        {terms.specialIncentiveTier || 'Standard Partner Tier'}
                      </p>
                    </div>
                    <div>
                      <span className="text-stone-500 block mb-0.5 text-[0.62rem] uppercase font-bold">Primary Partner Representative:</span>
                      <p className="font-bold text-stone-900 dark:text-stone-100">
                        {terms.primaryContactName} — <a href={`mailto:${terms.primaryContactEmail}`} className="text-blue-500 underline">{terms.primaryContactEmail}</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CONTACT HISTORY LOGS */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-mono text-sm font-black uppercase flex items-center gap-1.5">
                  <History className="w-4 h-4 text-blue-500" />
                  Full Partner Communication & Audit Log
                </h3>
                <p className="text-[0.68rem] text-stone-500 font-sans mt-0.5">
                  Chronological record of emails, phone syncs, contract amendments, and quarterly payout reviews.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingLog(!isAddingLog)}
                className="px-3 py-1.5 bg-[#FF6B4A] hover:bg-[#ff5a36] text-white font-mono text-xs font-bold uppercase rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingLog ? 'Cancel Log' : 'Add Communication Log'}</span>
              </button>
            </div>

            {isAddingLog && (
              <form onSubmit={handleAddLog} className="p-4 bg-stone-50 dark:bg-stone-900 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl space-y-3 font-mono text-xs animate-[fadeIn_0.15s_ease-out]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold uppercase text-[0.62rem] text-stone-500 mb-1">
                      Log Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newLog.date}
                      onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                      className="w-full bg-white dark:bg-stone-800 border p-2 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-[0.62rem] text-stone-500 mb-1">
                      Interaction Type *
                    </label>
                    <select
                      value={newLog.type}
                      onChange={(e) => setNewLog({ ...newLog, type: e.target.value as any })}
                      className="w-full bg-white dark:bg-stone-800 border p-2 rounded-lg font-mono font-bold"
                    >
                      <option value="email">📧 Email Communication</option>
                      <option value="call">📞 Phone Sync / Call</option>
                      <option value="meeting">👥 Meeting / Conference</option>
                      <option value="contract_update">📝 Contract Revision</option>
                      <option value="payout_review">💰 Payout & Revenue Audit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-[0.62rem] text-stone-500 mb-1">
                      Author / Admin Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Anthony T. (Admin)"
                      value={newLog.author}
                      onChange={(e) => setNewLog({ ...newLog, author: e.target.value })}
                      className="w-full bg-white dark:bg-stone-800 border p-2 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[0.62rem] text-stone-500 mb-1">
                    Summary Headline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Approved Q3 bonus tier increase or Reviewed monthly conversion report"
                    value={newLog.summary}
                    onChange={(e) => setNewLog({ ...newLog, summary: e.target.value })}
                    className="w-full bg-white dark:bg-stone-800 border p-2 rounded-lg font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[0.62rem] text-stone-500 mb-1">
                    Detailed Notes / Record
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter detailed meeting points, agreed terms, or audit takeaways..."
                    value={newLog.details}
                    onChange={(e) => setNewLog({ ...newLog, details: e.target.value })}
                    className="w-full bg-white dark:bg-stone-800 border p-2 rounded-lg font-mono text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase rounded-lg shadow-sm cursor-pointer"
                  >
                    Save Communication Log Entry
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3 pt-1">
              {contactLogs.map((log) => {
                const typeMap = {
                  email: { label: 'Email', icon: Mail, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
                  call: { label: 'Phone Call', icon: Phone, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
                  meeting: { label: 'Meeting', icon: Users, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
                  contract_update: { label: 'Contract Revision', icon: FileCheck, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
                  payout_review: { label: 'Payout Audit', icon: DollarSign, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' }
                };
                const config = typeMap[log.type] || typeMap.email;
                const Icon = config.icon;

                return (
                  <div
                    key={log.id}
                    className="p-3.5 bg-stone-50 dark:bg-[#141210] border border-stone-200 dark:border-stone-800 rounded-xl space-y-1 font-mono text-xs transition-all hover:border-stone-400"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded border text-[0.62rem] font-bold uppercase tracking-wider flex items-center gap-1 ${config.color}`}>
                          <Icon className="w-3 h-3" />
                          <span>{config.label}</span>
                        </span>
                        <strong className="text-stone-900 dark:text-stone-100 font-black text-sm">
                          {log.summary}
                        </strong>
                      </div>

                      <div className="flex items-center gap-3 text-[0.65rem] text-stone-400">
                        <span>{log.date}</span>
                        <span>•</span>
                        <span>{log.author}</span>
                      </div>
                    </div>

                    {log.details && (
                      <p className="text-stone-600 dark:text-stone-300 font-sans text-xs leading-relaxed pt-1 pl-1">
                        {log.details}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: DEDICATED NOTES FIELD */}
        {activeTab === 'notes' && (
          <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-mono text-sm font-black uppercase flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  Dedicated Account Administrator Notes
                </h3>
                <p className="text-[0.68rem] text-stone-500 font-sans mt-0.5">
                  Use this dedicated notes field to record partnership strategy, negotiation history, key executive contacts, or special payout arrangements.
                </p>
              </div>

              {notesSavedToast && (
                <span className="px-3 py-1 bg-emerald-500 text-white font-mono text-xs font-bold rounded-lg animate-bounce flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
            </div>

            <div className="space-y-2">
              <textarea
                rows={10}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter internal partner notes, contact history summaries, account executive contact numbers, or contract negotiation details..."
                className="w-full p-4 bg-stone-50 dark:bg-stone-900 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl font-mono text-xs leading-relaxed focus:outline-none focus:border-[#FF6B4A]"
              />

              <div className="flex items-center justify-between text-[0.65rem] font-mono text-stone-400 pt-1">
                <span>{notes.length} characters logged</span>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-black uppercase rounded-xl shadow-[2px_2px_0_#1A1A1A] flex items-center gap-2 cursor-pointer transition-all active:translate-y-[1px]"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Partner Notes</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SPECS & REFERRAL LINK */}
        {activeTab === 'specs' && (
          <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="p-4 bg-stone-50 dark:bg-[#141210] border border-stone-200 dark:border-stone-800 rounded-xl space-y-2 font-mono text-xs">
              <span className="text-stone-500 uppercase tracking-wider block text-[0.62rem] font-bold">
                Assigned Referral Tracking URL
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={fullPartner.referralUrl}
                  className="flex-1 bg-white dark:bg-stone-800 border p-2 rounded-lg font-mono text-xs font-bold text-stone-800 dark:text-stone-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(fullPartner.referralUrl);
                  }}
                  className="px-3.5 py-2 bg-[#FF6B4A] hover:bg-[#ff5a36] text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
                <a
                  href={fullPartner.referralUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 rounded-lg shrink-0"
                  title="Test Referral Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1 text-xs font-mono">
              <span className="font-bold text-emerald-800 dark:text-emerald-400 block uppercase text-[0.65rem]">
                Animal Reference Body Certification Standard
              </span>
              <p className="font-bold text-stone-900 dark:text-stone-100">
                {fullPartner.certifiedBody}
              </p>
              <p className="text-[#8A8680] dark:text-[#9A9590] text-[0.68rem]">
                {fullPartner.certDetails}
              </p>
            </div>

            <div className="p-4 bg-stone-50 dark:bg-[#141210] border border-stone-200 dark:border-stone-800 rounded-xl space-y-2 text-xs font-mono">
              <span className="text-stone-500 uppercase tracking-wider block text-[0.62rem] font-bold">
                Highlight Terms & Medical Coverage Specs
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-stone-800 dark:text-stone-200">
                {fullPartner.highlightSpecs.map((spec, i) => (
                  <li key={i}>{spec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

interface AffiliateManagementProps {
  externalSearchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function AffiliateManagement({ externalSearchQuery, onSearchChange }: AffiliateManagementProps = {}) {
  const [affiliates, setAffiliates] = useState<AffiliatePartner[]>(() => {
    const saved = localStorage.getItem('doghealthos_affiliates_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_AFFILIATES;
      }
    }
    return INITIAL_AFFILIATES;
  });

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'insurance' | 'certified_food'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | AffiliateStatus>('all');
  const [internalSearchQuery, setInternalSearchQuery] = useState<string>('');

  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;

  const handleSearchChange = (val: string) => {
    setInternalSearchQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingPartner, setEditingPartner] = useState<AffiliatePartner | null>(null);
  const [selectedPartnerForDossier, setSelectedPartnerForDossier] = useState<AffiliatePartner | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // New partner draft form
  const [newPartner, setNewPartner] = useState<Partial<AffiliatePartner>>({
    category: 'insurance',
    status: 'active',
    feeType: 'flat_payout',
    clicks: 0,
    conversions: 0,
    earnedRevenue: 0,
    highlightSpecs: ['']
  });

  const saveAffiliates = (updated: AffiliatePartner[]) => {
    setAffiliates(updated);
    localStorage.setItem('doghealthos_affiliates_v2', JSON.stringify(updated));
  };

  const handleQuickStatusChange = (id: string, newStatus: AffiliateStatus) => {
    const updated = affiliates.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
    saveAffiliates(updated);
  };

  const handleCopyLink = (partner: AffiliatePartner) => {
    navigator.clipboard.writeText(partner.referralUrl);
    setCopiedId(partner.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeletePartner = (id: string) => {
    if (window.confirm('Are you sure you want to remove this affiliate partner?')) {
      const updated = affiliates.filter((a) => a.id !== id);
      saveAffiliates(updated);
    }
  };

  const handleSavePartnerModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.affiliateNumber || !newPartner.feeStructure) {
      triggerToast('Please fill in partner name, affiliate number, and fee structure.');
      return;
    }

    if (editingPartner) {
      const updated = affiliates.map((a) => 
        a.id === editingPartner.id ? { ...a, ...newPartner } as AffiliatePartner : a
      );
      saveAffiliates(updated);
    } else {
      const created: AffiliatePartner = {
        id: `aff-custom-${Date.now()}`,
        name: newPartner.name || 'New Affiliate',
        category: newPartner.category || 'insurance',
        tagline: newPartner.tagline || 'Certified canine health & care partner',
        affiliateNumber: newPartner.affiliateNumber || `AFF-GEN-${Math.floor(10000 + Math.random() * 90000)}`,
        affiliationStartDate: newPartner.affiliationStartDate || new Date().toISOString().split('T')[0],
        contractRenewalDate: newPartner.contractRenewalDate || '2027-12-31',
        feeStructure: newPartner.feeStructure || '$40.00 CPA',
        feeType: newPartner.feeType || 'flat_payout',
        averagePayout: Number(newPartner.averagePayout) || 40,
        status: newPartner.status || 'active',
        certifiedBody: newPartner.certifiedBody || 'WSAVA / AAFCO / State Insurance Certified',
        certDetails: newPartner.certDetails || 'Verified compliance with national veterinary reference body standards',
        referralUrl: newPartner.referralUrl || 'https://partner.com/doghealthos',
        clicks: Number(newPartner.clicks) || 0,
        conversions: Number(newPartner.conversions) || 0,
        earnedRevenue: Number(newPartner.earnedRevenue) || 0,
        highlightSpecs: (newPartner.highlightSpecs || []).filter(Boolean)
      };
      saveAffiliates([...affiliates, created]);
    }

    setIsAddModalOpen(false);
    setEditingPartner(null);
    setNewPartner({
      category: 'insurance',
      status: 'active',
      feeType: 'flat_payout',
      clicks: 0,
      conversions: 0,
      earnedRevenue: 0,
      highlightSpecs: ['']
    });
  };

  const openEditModal = (partner: AffiliatePartner) => {
    setEditingPartner(partner);
    setNewPartner({ ...partner });
    setIsAddModalOpen(true);
  };

  // Filtered dataset
  const filteredAffiliates = useMemo(() => {
    const list = affiliates.filter((a) => {
      const matchCat = categoryFilter === 'all' || a.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = 
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.affiliateNumber.toLowerCase().includes(q) ||
        a.certifiedBody.toLowerCase().includes(q) ||
        a.feeStructure.toLowerCase().includes(q) ||
        a.tagline.toLowerCase().includes(q);

      return matchCat && matchStatus && matchSearch;
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return [...list].sort((a, b) => {
        const aNameMatch = a.name.toLowerCase().includes(q);
        const bNameMatch = b.name.toLowerCase().includes(q);
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        return 0;
      });
    }

    return list;
  }, [affiliates, categoryFilter, statusFilter, searchQuery]);

  // Aggregate KPI Calculations
  const stats = useMemo(() => {
    const total = affiliates.length;
    const insuranceCount = affiliates.filter((a) => a.category === 'insurance').length;
    const foodCount = affiliates.filter((a) => a.category === 'certified_food').length;
    const activeCount = affiliates.filter((a) => a.status === 'active').length;
    const pendingCount = affiliates.filter((a) => a.status === 'pending').length;
    const pendingRenewalCount = affiliates.filter((a) => a.status === 'pending_renewal').length;
    const reviewCount = affiliates.filter((a) => a.status === 'review').length;
    const inactiveCount = affiliates.filter((a) => a.status === 'inactive').length;
    const totalClicks = affiliates.reduce((acc, a) => acc + (a.clicks || 0), 0);
    const totalConversions = affiliates.reduce((acc, a) => acc + (a.conversions || 0), 0);
    const totalRevenue = affiliates.reduce((acc, a) => acc + (a.earnedRevenue || 0), 0);
    const avgConversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : '0.0';

    return {
      total,
      insuranceCount,
      foodCount,
      activeCount,
      pendingCount,
      pendingRenewalCount,
      reviewCount,
      inactiveCount,
      totalClicks,
      totalConversions,
      totalRevenue,
      avgConversionRate
    };
  }, [affiliates]);

  const handleExportCSV = (exportAll = false) => {
    const listToExport = exportAll ? affiliates : filteredAffiliates;
    if (listToExport.length === 0) {
      triggerToast('No affiliate partners found matching the current criteria.');
      return;
    }

    const headers = [
      'Affiliate ID',
      'Partner Name',
      'Category',
      'Partnership Status',
      'Affiliate Identifier',
      'Affiliation Start Date',
      'Contract Renewal Date',
      'Fee Structure',
      'Fee Model',
      'Average Payout ($)',
      'Animal Reference Body Certification',
      'Certification Details & Standards',
      'Total Clicks',
      'Total Conversions',
      'Conversion Rate (%)',
      'Earned Revenue ($)',
      'Highlight Specs',
      'Referral URL',
      'Notes',
      'Export Timestamp'
    ];

    const escapeCell = (val: unknown) => {
      if (val === undefined || val === null) return '""';
      const str = String(val);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = listToExport.map((a) => {
      const categoryLabel = a.category === 'insurance' ? 'Dog Insurance Carrier' : 'Animal Reference Certified Food';
      const statusLabel = a.status.replace('_', ' ').toUpperCase();
      const cr = a.clicks > 0 ? ((a.conversions / a.clicks) * 100).toFixed(1) + '%' : '0.0%';
      const highlights = (a.highlightSpecs || []).join('; ');
      const exportTimestamp = new Date().toISOString();

      return [
        escapeCell(a.id),
        escapeCell(a.name),
        escapeCell(categoryLabel),
        escapeCell(statusLabel),
        escapeCell(a.affiliateNumber),
        escapeCell(a.affiliationStartDate),
        escapeCell(a.contractRenewalDate),
        escapeCell(a.feeStructure),
        escapeCell(a.feeType),
        escapeCell(a.averagePayout),
        escapeCell(a.certifiedBody),
        escapeCell(a.certDetails),
        escapeCell(a.clicks),
        escapeCell(a.conversions),
        escapeCell(cr),
        escapeCell(a.earnedRevenue),
        escapeCell(highlights),
        escapeCell(a.referralUrl),
        escapeCell(a.notes || ''),
        escapeCell(exportTimestamp)
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const filterTag = categoryFilter !== 'all' ? `_${categoryFilter}` : '';
    const statusTag = statusFilter !== 'all' ? `_${statusFilter}` : '';
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `DogHealthOS_Affiliates${filterTag}${statusTag}_${dateStr}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerToast(`Exported ${listToExport.length} affiliate records to ${filename}`);
  };

  return (
    <div className="flex flex-col gap-6 text-[#1A1A1A] dark:text-[#F0ECE6]">
      
      {/* 1. Header Banner & Animal Reference Certification Guarantee */}
      <div className="p-6 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-blue-500/10 border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-stone-950 font-mono text-[0.65rem] font-black uppercase tracking-wider">
              GOD MODE COMMERCE
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Animal Reference Body Certified
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            Canine Insurance & Certified Food Affiliate Hub
          </h2>
          <p className="text-xs text-[#8A8680] dark:text-[#9A9590] max-w-2xl leading-relaxed">
            Manage authorized commercial partnerships with premier dog health insurers (<span className="text-[#1A1A1A] dark:text-white font-bold">Lily & Lee, FetchPet, Trupanion, Lemonade</span>) and <strong className="text-emerald-600 dark:text-emerald-400">only WSAVA & AAFCO veterinary reference body certified</strong> healthy canine foods.
          </p>
          {/* Quick status summary chip bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[0.62rem]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {stats.activeCount} Active
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {stats.pendingCount} Pending
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-yellow-500/15 text-yellow-800 dark:text-yellow-300 border border-yellow-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              {stats.pendingRenewalCount} Renewal Due
            </span>
            {stats.reviewCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-sky-500/15 text-sky-800 dark:text-sky-300 border border-sky-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                {stats.reviewCount} In Review
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => handleExportCSV(false)}
            title="Download CSV file of the currently displayed affiliate records for record-keeping"
            className="px-3.5 py-2.5 text-xs font-bold font-mono uppercase bg-white dark:bg-[#1E1C18] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl shadow-[2px_2px_0_#1A1A1A] dark:shadow-[2px_2px_0_#F0ECE6] hover:translate-y-[-1px] transition-all cursor-pointer flex items-center gap-2 text-stone-900 dark:text-stone-100"
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Export CSV</span>
            <span className="px-1.5 py-0.5 rounded text-[0.62rem] bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono border border-stone-200 dark:border-stone-700">
              {filteredAffiliates.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingPartner(null);
              setNewPartner({
                category: 'insurance',
                status: 'active',
                feeType: 'flat_payout',
                clicks: 0,
                conversions: 0,
                earnedRevenue: 0,
                highlightSpecs: ['']
              });
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 text-xs font-black uppercase tracking-wider bg-[#FF6B4A] hover:bg-[#ff5a36] text-white border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-xl shadow-[3px_3px_0_#1A1A1A] hover:translate-y-[-1px] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Affiliate Partner
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Earned Revenue */}
        <div className="bg-white dark:bg-[#1E1C18] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] p-4 rounded-xl shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[0.68rem] font-bold uppercase font-mono tracking-wider">Total Affiliate Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            ${stats.totalRevenue.toLocaleString()}
          </p>
          <span className="text-[0.62rem] font-mono text-stone-400 mt-1">
            Across {stats.totalConversions} validated referrals
          </span>
        </div>

        {/* Insurance Partners */}
        <div className="bg-white dark:bg-[#1E1C18] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] p-4 rounded-xl shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[0.68rem] font-bold uppercase font-mono tracking-wider">🛡️ Dog Insurance Lines</span>
            <Shield className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-blue-600 dark:text-blue-400">
            {stats.insuranceCount} <span className="text-xs font-normal text-stone-400">Providers</span>
          </p>
          <span className="text-[0.62rem] font-mono text-stone-400 mt-1">
            Lily & Lee, FetchPet, Trupanion, Lemonade, Spot
          </span>
        </div>

        {/* Certified Food Partners */}
        <div className="bg-white dark:bg-[#1E1C18] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] p-4 rounded-xl shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[0.68rem] font-bold uppercase font-mono tracking-wider">🥩 Certified Canine Nutrition</span>
            <Utensils className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-amber-600 dark:text-amber-400">
            {stats.foodCount} <span className="text-xs font-normal text-stone-400">Brands</span>
          </p>
          <span className="text-[0.62rem] font-mono text-stone-400 mt-1">
            WSAVA, AAFCO & FEDIAF certified diets only
          </span>
        </div>

        {/* Conversion Velocity */}
        <div className="bg-white dark:bg-[#1E1C18] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] p-4 rounded-xl shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[0.68rem] font-bold uppercase font-mono tracking-wider">Avg Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-purple-600 dark:text-purple-400">
            {stats.avgConversionRate}%
          </p>
          <span className="text-[0.62rem] font-mono text-stone-400 mt-1">
            {stats.totalClicks.toLocaleString()} verified outbound redirects
          </span>
        </div>

      </div>

      {/* 3. Strict Compliance Policy Guarantee Banner */}
      <div className="bg-emerald-500/10 border-2 border-dashed border-emerald-500/40 p-4 rounded-xl flex items-start gap-3 text-xs leading-relaxed text-emerald-950 dark:text-emerald-200">
        <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-sm block mb-0.5">
            Strict Veterinary Reference Body Certification Policy:
          </strong>
          <span>
            Under DogHealthOS™ clinical guidelines, commercial food affiliations are exclusively restricted to manufacturers that adhere to the <strong>World Small Animal Veterinary Association (WSAVA) Global Nutrition Committee guidelines</strong>, conduct certified <strong>AAFCO humane feeding trials</strong>, or employ full-time board-certified veterinary nutritionists (ACVN/DACVIM). Zero unverified boutique brands are permitted.
          </span>
        </div>
      </div>

      {/* 4. Sub-Navigation Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-stone-50 dark:bg-[#151311] border-2 border-[#1A1A1A]/10 dark:border-white/10 p-3.5 rounded-xl">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-[#1A1A1A] text-white dark:bg-[#F0ECE6] dark:text-[#1A1A1A]'
                : 'bg-white dark:bg-[#1E1C18] text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
            }`}
          >
            All Partners ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('insurance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
              categoryFilter === 'insurance'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-[#1E1C18] text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Dog Insurance ({stats.insuranceCount})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('certified_food')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
              categoryFilter === 'certified_food'
                ? 'bg-amber-600 text-white'
                : 'bg-white dark:bg-[#1E1C18] text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            Certified Healthy Foods ({stats.foodCount})
          </button>
        </div>

        {/* Search, Status Filter & Direct Export CSV Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-72 min-w-[220px]">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search by company name (e.g. Fetch, Trupanion)..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 text-xs font-mono bg-white dark:bg-[#1E1C18] border-2 border-[#1A1A1A]/20 dark:border-white/20 rounded-lg text-[#1A1A1A] dark:text-[#F0ECE6] focus:outline-none focus:border-[#FF6B4A]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                title="Clear company search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs font-mono font-bold bg-white dark:bg-[#1E1C18] border-2 border-[#1A1A1A]/20 dark:border-white/20 rounded-lg text-[#1A1A1A] dark:text-[#F0ECE6] focus:outline-none"
          >
            <option value="all">All Statuses ({stats.total})</option>
            <option value="active">🟢 Active ({stats.activeCount})</option>
            <option value="pending">🟡 Pending ({stats.pendingCount})</option>
            <option value="pending_renewal">🟠 Pending Renewal ({stats.pendingRenewalCount})</option>
            <option value="review">🔵 In Review ({stats.reviewCount})</option>
            <option value="inactive">⚪ Inactive ({stats.inactiveCount})</option>
          </select>

          <button
            type="button"
            onClick={() => handleExportCSV(false)}
            title="Export the currently displayed list of affiliates to a CSV file for record-keeping"
            className="px-3 py-1.5 text-xs font-mono font-bold uppercase bg-stone-900 text-white dark:bg-[#F0ECE6] dark:text-[#1A1A1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-lg shadow-[2px_2px_0_#1A1A1A] hover:translate-y-[-1px] transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
            <span>Export CSV</span>
            <span className="opacity-80 text-[0.62rem]">({filteredAffiliates.length})</span>
          </button>
        </div>

      </div>

      {/* Active Search Filter Pill */}
      {searchQuery.trim() && (
        <div className="flex flex-wrap items-center gap-2 px-3.5 py-2 bg-amber-500/10 border-2 border-amber-500/30 rounded-xl text-xs font-mono">
          <Search className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="font-bold text-amber-800 dark:text-amber-300">Filtered by Company Name:</span>
          <span className="bg-amber-500 text-stone-950 px-2 py-0.5 rounded-md font-black text-[0.68rem]">
            "{searchQuery}"
          </span>
          <span className="text-stone-500 text-[0.68rem] font-bold">
            ({filteredAffiliates.length} partner{filteredAffiliates.length === 1 ? '' : 's'} matched)
          </span>
          <button
            type="button"
            onClick={() => handleSearchChange('')}
            className="ml-auto text-amber-700 dark:text-amber-400 hover:underline text-[0.68rem] font-black uppercase cursor-pointer flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear Company Search
          </button>
        </div>
      )}

      {/* 5. Affiliate Partners Bento Grid / Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredAffiliates.map((partner) => {
          const isInsurance = partner.category === 'insurance';
          return (
            <div
              key={partner.id}
              onClick={() => setSelectedPartnerForDossier(partner)}
              className="bg-white dark:bg-[#1E1C18] border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden transition-all hover:translate-y-[-1px] cursor-pointer hover:border-[#FF6B4A]"
            >
              
              {/* Category Top Banner Pill & Partnership Status Chip */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full font-mono text-[0.62rem] font-black uppercase tracking-wider flex items-center gap-1 ${
                      isInsurance 
                        ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                    }`}>
                      {isInsurance ? <Shield className="w-3 h-3" /> : <Utensils className="w-3 h-3" />}
                      {isInsurance ? 'Canine Insurance Carrier' : 'Animal Reference Certified Food'}
                    </span>
                    
                    <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-mono text-[0.6rem] font-bold">
                      {partner.affiliateNumber}
                    </span>

                    {/* Color-Coded Partnership Status Badge Chip */}
                    <AffiliateStatusBadge 
                      status={partner.status} 
                      onStatusChange={(newStatus) => handleQuickStatusChange(partner.id, newStatus)} 
                    />
                  </div>

                  <h3 className="text-lg font-black text-[#1A1A1A] dark:text-[#F0ECE6] leading-tight">
                    {partner.name}
                  </h3>
                  <p className="text-xs text-[#8A8680] dark:text-[#9A9590] mt-0.5 leading-snug">
                    {partner.tagline}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(partner);
                    }}
                    className="p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
                    title="Edit Partner Parameters"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePartner(partner.id);
                    }}
                    className="p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete Partner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Affiliation Dates & Commercial Fee Terms */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-[#141210] border border-[#1A1A1A]/10 dark:border-white/10 font-mono text-xs">
                
                <div>
                  <span className="text-[0.6rem] uppercase tracking-wider text-stone-400 block mb-0.5 font-bold">
                    Start Date
                  </span>
                  <div className="flex items-center gap-1 font-bold text-stone-700 dark:text-stone-300">
                    <Calendar className="w-3 h-3 text-[#FF6B4A]" />
                    <span>{partner.affiliationStartDate}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[0.6rem] uppercase tracking-wider text-stone-400 block mb-0.5 font-bold">
                    Renewal
                  </span>
                  <div className="flex items-center gap-1 font-bold text-stone-700 dark:text-stone-300">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    <span>{partner.contractRenewalDate}</span>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[0.6rem] uppercase tracking-wider text-stone-400 block mb-0.5 font-bold">
                    Fee Terms
                  </span>
                  <div className="flex items-center gap-1 font-black text-emerald-600 dark:text-emerald-400">
                    <BadgePercent className="w-3 h-3" />
                    <span className="truncate">{partner.feeStructure}</span>
                  </div>
                </div>

              </div>

              {/* Reference Body Certification Badge */}
              <div className="p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold">
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-mono uppercase tracking-wide text-[0.68rem]">{partner.certifiedBody}</span>
                </div>
                <p className="text-[0.68rem] text-stone-600 dark:text-stone-400 leading-snug">
                  {partner.certDetails}
                </p>
              </div>

              {/* Clinical Specs Highlights */}
              <div className="space-y-1">
                <span className="text-[0.62rem] font-mono font-bold uppercase tracking-wider text-stone-400">
                  Key Coverage & Clinical Highlights:
                </span>
                <ul className="space-y-1 text-[0.7rem] text-stone-700 dark:text-stone-300">
                  {partner.highlightSpecs.map((spec, sIdx) => (
                    <li key={sIdx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Performance Metrics & Action CTAs */}
              <div className="pt-3 border-t border-[#1A1A1A]/10 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                
                {/* Micro Ledger */}
                <div className="flex items-center gap-3 font-mono text-[0.68rem] text-stone-500">
                  <div>
                    <span className="text-stone-400">Clicks: </span>
                    <strong className="text-[#1A1A1A] dark:text-[#F0ECE6]">{partner.clicks.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400">Leads: </span>
                    <strong className="text-blue-600 dark:text-blue-400">{partner.conversions}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400">Earned: </span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">${partner.earnedRevenue.toLocaleString()}</strong>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPartnerForDossier(partner);
                    }}
                    className="px-2.5 py-1.5 rounded-lg border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-[#1A1A1A] text-white dark:bg-[#F0ECE6] dark:text-[#1A1A1A] hover:bg-[#FF6B4A] dark:hover:bg-[#FF6B4A] dark:hover:text-white font-mono text-[0.65rem] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-[1.5px_1.5px_0_#1A1A1A] active:scale-95"
                    title="View full contact history, specific contract terms, and dedicated notes"
                  >
                    <FileText className="w-3 h-3 text-amber-400" />
                    <span>Dossier & History</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyLink(partner);
                    }}
                    className="px-2.5 py-1.5 rounded-lg border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-[#1A1A1A] dark:text-[#F0ECE6] font-mono text-[0.65rem] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    title="Copy unique tracking referral link"
                  >
                    {copiedId === partner.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={partner.referralUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1.5 rounded-lg border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-[#FF6B4A] hover:bg-[#ff5d38] text-white font-mono text-[0.65rem] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-[1.5px_1.5px_0_#1A1A1A] active:scale-95"
                  >
                    <span>Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAffiliates.length === 0 && (
        <div className="p-8 text-center border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl bg-white dark:bg-[#1E1C18] shadow-[2px_2px_0_#1A1A1A] space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
          <h4 className="font-mono text-sm font-bold uppercase">No Affiliate Partners Match Filter Criteria</h4>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try resetting your search query or status filter to view all authorized dog insurance and certified healthy food partners.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('all');
                setStatusFilter('all');
                handleSearchChange('');
              }}
              className="px-3.5 py-1.5 text-xs font-mono font-bold uppercase bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
            <button
              type="button"
              onClick={() => handleExportCSV(true)}
              className="px-3.5 py-1.5 text-xs font-mono font-bold uppercase bg-emerald-600 text-white rounded-lg flex items-center gap-1.5 hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All Partners ({affiliates.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. Add/Edit Affiliate Partner Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#1A1A1A]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1E1C18] border-[3px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[8px_8px_0_#FF6B4A] rounded-2xl max-w-2xl w-full p-6 my-8 flex flex-col gap-4">
            
            <div className="flex items-center justify-between border-b pb-3 border-[#1A1A1A]/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-[#FF6B4A]" />
                <h3 className="text-lg font-black uppercase tracking-wide">
                  {editingPartner ? 'Edit Affiliate Partner' : 'Register New Certified Affiliate'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePartnerModal} className="space-y-4 text-xs font-mono">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Partner Name */}
                <div>
                  <label className="block font-bold uppercase text-[0.65rem] text-stone-500 mb-1">
                    Partner / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FetchPet / Lily & Lee / Royal Canin"
                    value={newPartner.name || ''}
                    onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-[#1A1A1A]/20 dark:border-white/20 rounded-lg p-2 font-mono"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block font-bold uppercase text-[0.65rem] text-stone-500 mb-1">
                    Partner Classification *
                  </label>
                  <select
                    value={newPartner.category}
                    onChange={(e) => setNewPartner({ ...newPartner, category: e.target.value as any })}
                    className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-[#1A1A1A]/20 dark:border-white/20 rounded-lg p-2 font-mono font-bold"
                  >
                    <option value="insurance">🛡️ Dogs Insurance Company</option>
                    <option value="certified_food">🥩 Certified Healthy Dog Food</option>
                  </select>
                </div>

                {/* Partnership Status */}
                <div>
                  <label className="block font-bold uppercase text-[0.65rem] text-stone-500 mb-1">
                    Partnership Status *
                  </label>
                  <select
                    value={newPartner.status || 'active'}
                    onChange={(e) => setNewPartner({ ...newPartner, status: e.target.value as any })}
                    className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-[#1A1A1A]/20 dark:border-white/20 rounded-lg p-2 font-mono font-bold"
                  >
                    <option value="active">🟢 Active (Verified & Commissioning)</option>
                    <option value="pending">🟡 Pending (Onboarding / Verification)</option>
                    <option value="pending_renewal">🟠 Pending Renewal (Contract Due)</option>
                    <option value="review">🔵 Under Review (Clinical Audit)</option>
                    <option value="inactive">⚪ Inactive (Paused)</option>
                  </select>
                </div>

                {/* Affiliate Number */}
                <div>
                  <label className="block font-bold uppercase text-[0.65rem] text-stone-500 mb-1">
                    Affiliate ID / Partner Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AFF-INS-99014"
                    value={newPartner.affiliateNumber || ''}
                    onChange={(e) => setNewPartner({ ...newPartner, affiliateNumber: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-[#1A1A1A]/20 dark:border-white/20 rounded-lg p-2 font-mono"
                  />
                </div>

                {/* Fee Structure */}
                <div>
                  <label className="block font-bold uppercase text-[0.65rem] text-stone-500 mb-1">
                    Fee Structure / Payout Terms *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $45.00 CPA / 14% RevShare"
                    value={newPartner.feeStructure || ''}
                    onChange={(e) => setNewPartner({ ...newPartner, feeStructure: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-[#1A1A1A]/20 dark:border-white/20 rounded-lg p-2 font-mono"
                  />
                </div>

                {/* Affiliation Start Date */}
                <div>
                  <label className="block font-bold uppercase text-[0.65rem] text-stone-500 mb-1">
                    Affiliation Start Date
                  </label>
                  <input
                    type="date"
                    value={newPartner.affiliationStartDate || ''}
                    onChange={(e) => setNewPartner({ ...newPartner, affiliationStartDate: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-[#1A1A1A]/20 dark:border-white/20 rounded-lg p-2 font-mono"
                  />
                </div>

                {/* Contract Renewal Date */}
                <div>
                  <label className="block font-bold uppercase text-[0.65rem] text-stone-500 mb-1">
                    Contract Renewal Date
                  </label>
                  <input
                    type="date"
                    value={newPartner.contractRenewalDate || ''}
                    onChange={(e) => setNewPartner({ ...newPartner, contractRenewalDate: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-[#1A1A1A]/20 dark:border-white/20 rounded-lg p-2 font-mono"
                  />
                </div>

              </div>

              {/* Tagline / Subtitle */}
              <div>
                <label className="block font-bold uppercase text-[0.65rem] text-stone-500 mb-1">
                  Tagline & Value Proposition
                </label>
                <input
                  type="text"
                  placeholder="e.g. Direct-pay veterinary claims and hereditary coverage"
                  value={newPartner.tagline || ''}
                  onChange={(e) => setNewPartner({ ...newPartner, tagline: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-[#1A1A1A]/20 dark:border-white/20 rounded-lg p-2 font-mono"
                />
              </div>

              {/* Certified Reference Body */}
              <div>
                <label className="block font-bold uppercase text-[0.65rem] text-stone-500 mb-1">
                  Animal Reference Body / Regulatory Certification *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WSAVA Global Nutrition Committee / AAFCO Feeding Trials / NAIC Licensed"
                  value={newPartner.certifiedBody || ''}
                  onChange={(e) => setNewPartner({ ...newPartner, certifiedBody: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-[#1A1A1A]/20 dark:border-white/20 rounded-lg p-2 font-mono"
                />
              </div>

              {/* Certification Details */}
              <div>
                <label className="block font-bold uppercase text-[0.65rem] text-stone-500 mb-1">
                  Compliance / Scientific Clinical Details
                </label>
                <input
                  type="text"
                  placeholder="e.g. Formulated by Board-Certified DACVIM Nutritionists; AAFCO feeding trial verified"
                  value={newPartner.certDetails || ''}
                  onChange={(e) => setNewPartner({ ...newPartner, certDetails: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-[#1A1A1A]/20 dark:border-white/20 rounded-lg p-2 font-mono"
                />
              </div>

              {/* Referral Tracking URL */}
              <div>
                <label className="block font-bold uppercase text-[0.65rem] text-stone-500 mb-1">
                  Referral URL with Affiliate Tracking Query *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://partner.com/doghealthos?aff_id=AFF-..."
                  value={newPartner.referralUrl || ''}
                  onChange={(e) => setNewPartner({ ...newPartner, referralUrl: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-[#1A1A1A]/20 dark:border-white/20 rounded-lg p-2 font-mono"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#1A1A1A]/10 dark:border-white/10 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border-2 border-stone-300 dark:border-stone-700 rounded-xl font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase rounded-xl border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[2px_2px_0_#1A1A1A] cursor-pointer"
                >
                  {editingPartner ? 'Update Partner' : 'Save & Authorize Partner'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white dark:bg-[#F0ECE6] dark:text-[#1A1A1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] px-4 py-3 rounded-xl shadow-[4px_4px_0_#FF6B4A] font-mono text-xs font-bold flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Interactive Affiliate Dossier Modal (Contact History, Terms, Notes) */}
      {selectedPartnerForDossier && (
        <AffiliateDetailModal
          partner={selectedPartnerForDossier}
          onClose={() => setSelectedPartnerForDossier(null)}
          onUpdatePartner={(updated) => {
            const newAffiliates = affiliates.map((a) => (a.id === updated.id ? updated : a));
            saveAffiliates(newAffiliates);
            setSelectedPartnerForDossier(updated);
          }}
        />
      )}

    </div>
  );
}
