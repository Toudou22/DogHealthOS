import * as React from 'react';
import { useState } from 'react';
import { 
  FileText, Download, CheckCircle2, Shield, Sparkles, X, BookOpen, 
  CheckSquare, DollarSign, Activity, Users, Award, ExternalLink, ArrowRight
} from 'lucide-react';
import { 
  generateUserManualPDF, 
  generateProductionChecklistPDF, 
  generateMonetizationPlanPDF, 
  generateTestingPlanPDF, 
  generateOnboardingPlanPDF,
  generateFrenchieHandoffPacketPDF
} from '../utils/pdfDocumentGenerator';

interface DocumentationHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentationHubModal({ isOpen, onClose }: DocumentationHubModalProps) {
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);
  const [lastDownloaded, setLastDownloaded] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = (docName: string, generatorFn: () => void) => {
    setDownloadingDoc(docName);
    try {
      generatorFn();
      setLastDownloaded(docName);
      setTimeout(() => {
        setDownloadingDoc(null);
      }, 800);
    } catch (err) {
      console.error(`Error downloading ${docName}:`, err);
      setDownloadingDoc(null);
    }
  };

  const handleDownloadAll = () => {
    setDownloadingDoc('ALL');
    setTimeout(() => {
      generateUserManualPDF();
      generateProductionChecklistPDF();
      generateMonetizationPlanPDF();
      generateTestingPlanPDF();
      generateOnboardingPlanPDF();
      generateFrenchieHandoffPacketPDF();
      setDownloadingDoc(null);
      setLastDownloaded('All 6 Official Documents Batch Download');
    }, 500);
  };

  const documents = [
    {
      id: 'user-manual',
      title: '01. Detailed User Manual & Operating Guide',
      filename: 'User_Manual_DogHealthOS.pdf',
      icon: BookOpen,
      color: 'bg-emerald-500',
      badge: 'Core System Guide',
      description: 'Comprehensive 360-degree operating manual covering pet owner workflows, Dr. Barnes AI Chat grounding, Breeder Pro telemetry, NutriChef RER calorie math, and AES-256 Medical Vault key management.',
      bullets: [
        'Pet Owner, Breeder, Vet, & Admin role walkthroughs',
        'Interactive Lifespan & Condition Heatmaps',
        'RER/MER Caloric Math & D3 Weight Logger SOP',
        'HTTP 429 Gemini rate-limit fallback protocols'
      ],
      action: generateUserManualPDF
    },
    {
      id: 'production-checklist',
      title: '02. Step-By-Step Production Checklist',
      filename: 'Production_Deployment_Checklist.pdf',
      icon: CheckSquare,
      color: 'bg-sky-500',
      badge: 'Deployment SOP',
      description: 'Production readiness verification matrix covering environment variables, strict TypeScript compilation, Firestore security rules hardening, esbuild bundling, and zero-downtime rollback protocols.',
      bullets: [
        'Pre-flight code & env audit checklists',
        'Firestore security rules & CORS verification',
        'esbuild server bundling & healthcheck endpoints',
        'Live incident SOP & automated rollback guidelines'
      ],
      action: generateProductionChecklistPDF
    },
    {
      id: 'monetization-plan',
      title: '03. Detailed Monetization & Revenue Plan',
      filename: 'Platform_Monetization_Plan.pdf',
      icon: DollarSign,
      color: 'bg-amber-500',
      badge: 'Commercial Strategy',
      description: 'Commercial monetization playbook outlining the 4-tier subscription model (Free Forever, Healthspan Pro $4.99/mo, Pack & Breeder Pro $9.99/mo, Vet Suite $49/mo), high-margin affiliate insurance commissions, and 36-month financial forecasts.',
      bullets: [
        'Tiered pricing ($4.99/mo to $49.00/mo) matrix',
        'B2B affiliate commissions (Trupanion, Hill\'s, Embark)',
        'Unit economics (CAC: $6.20, LTV: $139.50, 22.5x ratio)',
        '3-Year ARR projection model ($251K Y1 -> $3.2M Y3)'
      ],
      action: generateMonetizationPlanPDF
    },
    {
      id: 'testing-plan',
      title: '04. Practical Testing Plan & QA Verification Suite',
      filename: 'Comprehensive_Platform_Testing_Plan.pdf',
      icon: Activity,
      color: 'bg-indigo-500',
      badge: 'QA Matrix',
      description: 'Production testing suite with 8+ end-to-end practical test cases containing explicit verification questions, expected numerical outputs, rate-limit edge tests, and bug defect SLAs.',
      bullets: [
        'Test questions & expected mathematical results',
        'BOAS risk curves, RER calorie math, & AI 429 tests',
        'Affiliate search & dossier modal interactive checks',
        'Defect severity triaging (P0 Blocker to P3 Minor)'
      ],
      action: generateTestingPlanPDF
    },
    {
      id: 'onboarding-plan',
      title: '05. Elite Breeder & Veterinary Suite Onboarding Plan',
      filename: 'Elite_Breeder_and_Vet_Onboarding_Plan.pdf',
      icon: Users,
      color: 'bg-rose-500',
      badge: 'Specialized Memberships',
      description: 'Step-by-step onboarding roadmaps for Elite Pro Breeders (USDA/AKC verification, genetic clearance matrix, puppy telemetry, health passports) and Veterinary Clinical Suites (EHR sync, RER profiles).',
      bullets: [
        'Kennel identity & genetic clearance uploads (OFA/PennHIP)',
        'ISO 11784 microchip tagging & puppy weight tracking',
        'Veterinary EHR practice management software sync',
        'Clinical NutriChef prescriptive formulation profiles'
      ],
      action: generateOnboardingPlanPDF
    },
    {
      id: 'frenchie-handoff-packet',
      title: '06. French Bulldog Puppy Adoption Hand-Off Packet Sample',
      filename: 'French_Bulldog_Puppy_Handoff_Packet_Sample.pdf',
      icon: Award,
      color: 'bg-emerald-600',
      badge: 'Sample Breeder Showcase',
      description: 'Official co-branded 8-week puppy adoption dossier for French Bulldogs ("Elysian Frenchies"). Features OFA parental health clearances, Nobivac DHPP vaccination history, WALTHAM growth curves, brachycephalic care, and Puppy Audio Passport transcript.',
      bullets: [
        'AKC & Microchip metadata block + verification seal',
        'OFA Patellar, Cardiac, Eye, JHC, DM & Cystinuria matrix',
        '8-Week WALTHAM growth weight velocity & 380 kcal feeding plan',
        'Dr. Emma Foster DVM Puppy Audio Passport transcript'
      ],
      action: generateFrenchieHandoffPacketPDF
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-[#F0ECE6] dark:bg-[#181614] border-[3px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[8px_8px_0_#1A1A1A] dark:shadow-[8px_8px_0_#F0ECE6] rounded-3xl max-w-5xl w-full my-8 overflow-hidden flex flex-col">
        
        {/* Header Banner */}
        <div className="p-6 bg-[#1A1A1A] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-[3px] border-[#1A1A1A]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 border-2 border-white flex items-center justify-center text-black font-black shadow-[3px_3px_0_#FFF] shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500 text-black font-mono text-[0.62rem] font-black uppercase rounded">
                  Official Release 2026
                </span>
                <span className="text-xs font-mono text-stone-300">5 High-Detail PDFs</span>
              </div>
              <h2 className="text-xl font-black uppercase tracking-wider font-mono text-white mt-0.5">
                DogHealthOS Operations & Documentation Hub
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleDownloadAll}
              disabled={downloadingDoc === 'ALL'}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black border-2 border-white font-mono font-black text-xs uppercase tracking-wider rounded-xl shadow-[3px_3px_0_#FFF] flex items-center gap-2 cursor-pointer transition-all active:translate-y-0.5 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingDoc === 'ALL' ? 'Generating 5 PDFs...' : 'Download All 5 PDFs'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2.5 bg-stone-800 hover:bg-rose-600 text-white border-2 border-white rounded-xl transition-all cursor-pointer"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Banner if downloaded */}
        {lastDownloaded && (
          <div className="bg-emerald-500/15 border-b-2 border-emerald-500/30 px-6 py-2.5 flex items-center justify-between text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Downloaded: <strong>{lastDownloaded}</strong></span>
            </div>
            <span className="text-[0.68rem] text-emerald-600 dark:text-emerald-400">PDF successfully saved to downloads folder.</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          <div className="p-4 bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] rounded-2xl flex items-start gap-3">
            <Shield className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
              <strong>Verified Enterprise Operational Artifacts:</strong> The documentation suite below has been compiled to provide full operational transparency, complete deployment instructions, commercial monetization schedules, end-to-end practical QA testing questions and results, and dedicated onboarding roadmaps for Elite Breeders and Veterinary Suites.
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {documents.map((docItem) => {
              const IconComp = docItem.icon;
              const isDownloading = downloadingDoc === docItem.title;

              return (
                <div
                  key={docItem.id}
                  className="bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-2xl p-5 flex flex-col justify-between hover:translate-y-[-2px] transition-all"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 ${docItem.color} text-white rounded-xl border-2 border-black flex items-center justify-center font-bold shadow-[2px_2px_0_#000]`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[0.62rem] font-mono font-black uppercase rounded border border-stone-200 dark:border-stone-700">
                            {docItem.badge}
                          </span>
                          <h3 className="text-sm font-black font-mono text-[#1A1A1A] dark:text-[#F0ECE6] mt-1 leading-snug">
                            {docItem.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400 font-medium leading-relaxed mb-4">
                      {docItem.description}
                    </p>

                    {/* Bullets */}
                    <div className="space-y-1.5 mb-5 bg-stone-50 dark:bg-[#181614] p-3 rounded-xl border border-stone-200 dark:border-stone-800">
                      <span className="text-[0.6rem] font-mono font-bold text-stone-400 uppercase block mb-1">
                        Key Section Deliverables:
                      </span>
                      {docItem.bullets.map((b, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[0.68rem] font-mono font-semibold text-stone-700 dark:text-stone-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="truncate">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Download Action */}
                  <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
                    <span className="text-[0.62rem] font-mono text-stone-400 font-bold truncate">
                      📄 {docItem.filename}
                    </span>

                    <button
                      onClick={() => handleDownload(docItem.title, docItem.action)}
                      disabled={isDownloading}
                      className="px-3.5 py-2 bg-[#1A1A1A] dark:bg-[#F0ECE6] text-white dark:text-[#1A1A1A] hover:bg-emerald-600 dark:hover:bg-emerald-400 border-2 border-black text-xs font-mono font-black uppercase rounded-xl shadow-[2px_2px_0_#FF6B4A] flex items-center gap-1.5 cursor-pointer transition-all active:translate-y-0.5 shrink-0 disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isDownloading ? 'Generating...' : 'Download PDF'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 dark:bg-stone-900 border-t-[3px] border-[#1A1A1A] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-stone-500 gap-2">
          <span>🔒 DogHealthOS Enterprise Documentation Protocol • All PDFs ISO/A4 Formatted</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-2 border-black font-bold text-xs uppercase rounded-lg cursor-pointer hover:bg-stone-300"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
