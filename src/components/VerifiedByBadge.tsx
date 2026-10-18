import * as React from 'react';
import { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, ExternalLink, BookOpen, Award, CheckCircle2 } from 'lucide-react';
import { resolveDatabase, VeterinaryDatabaseKey, VeterinaryDatabaseEntry } from '../utils/citationLibrary';

export interface VerifiedByBadgeProps {
  databaseKey?: VeterinaryDatabaseKey | string;
  sourceText?: string;
  customCitation?: string;
  customCohort?: string;
  customEvidenceLevel?: string;
  layout?: 'compact' | 'pill' | 'banner' | 'card';
  showDetailsByDefault?: boolean;
  className?: string;
  align?: 'left' | 'right' | 'center';
}

export default function VerifiedByBadge({
  databaseKey,
  sourceText,
  customCitation,
  customCohort,
  customEvidenceLevel,
  layout = 'pill',
  showDetailsByDefault = false,
  className = '',
  align = 'left'
}: VerifiedByBadgeProps) {
  const [isOpen, setIsOpen] = useState(showDetailsByDefault);

  // Resolve database entry from key or fuzzy sourceText
  const dbEntry: VeterinaryDatabaseEntry = resolveDatabase(
    databaseKey || sourceText,
    'rvc'
  );

  const colors = dbEntry.badgeColor;
  const citationToDisplay = customCitation || dbEntry.primaryCitation;
  const cohortToDisplay = customCohort || dbEntry.cohortDetails;
  const evidenceLevelToDisplay = customEvidenceLevel || dbEntry.evidenceLevel;

  if (layout === 'banner') {
    return (
      <div className={`rounded-xl border-2 ${colors.border} ${colors.bg} p-3.5 flex flex-col gap-2 transition-all ${className}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${colors.dot} animate-pulse shrink-0`} />
            <ShieldCheck className="w-4 h-4 text-[#2D8C6F] shrink-0" />
            <span className="font-mono text-xs font-black uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6]">
              {dbEntry.verifiedByText}
            </span>
          </div>
          <span className={`text-[0.6rem] font-mono font-bold px-2 py-0.5 rounded border border-[#1A1A1A]/10 dark:border-white/10 ${colors.chip} uppercase`}>
            {evidenceLevelToDisplay}
          </span>
        </div>

        <div className="text-[0.72rem] text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
          <strong className="text-[#1A1A1A] dark:text-[#F0ECE6]">{dbEntry.institution}</strong> — {cohortToDisplay}
        </div>

        <div className="text-[0.66rem] font-mono text-stone-600 dark:text-stone-400 italic pt-1 border-t border-stone-200 dark:border-stone-800">
          "{citationToDisplay}"
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col ${align === 'right' ? 'items-end' : align === 'center' ? 'items-center' : 'items-start'} ${className}`}>
      {/* Clickable Badge Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[0.65rem] font-mono font-bold transition-all duration-150 cursor-pointer shadow-sm select-none ${colors.bg} ${colors.border} ${colors.text} hover:scale-[1.02] active:scale-[0.98]`}
        title={`Click to inspect registered veterinary cohort verification from ${dbEntry.name}`}
        aria-expanded={isOpen}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} shrink-0`} />
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
        <span className="tracking-wide">
          {dbEntry.verifiedByText}
        </span>
        <span className="ml-0.5 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-200 transition-colors">
          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </span>
      </button>

      {/* Expandable Citation Drawer */}
      {isOpen && (
        <div className={`mt-1.5 p-3 rounded-xl bg-white dark:bg-[#1C1A18] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] text-[0.68rem] leading-relaxed max-w-md w-full animate-[fadeIn_0.2s_ease-out] z-10 flex flex-col gap-1.5`}>
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-1.5">
            <span className="font-mono font-black uppercase text-[#2D8C6F] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2D8C6F]" />
              Accredited Veterinary Registry
            </span>
            <span className="text-[0.58rem] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
              {evidenceLevelToDisplay}
            </span>
          </div>

          <div className="font-bold text-[#1A1A1A] dark:text-[#F0ECE6] flex items-center gap-1.5">
            <span>🏛️</span>
            <span>{dbEntry.name}</span>
          </div>

          <div className="text-stone-600 dark:text-stone-300 text-[0.65rem]">
            <strong>Institution:</strong> {dbEntry.institution}
          </div>

          <div className="text-stone-600 dark:text-stone-300 text-[0.65rem]">
            <strong>Clinical Cohort:</strong> {cohortToDisplay}
          </div>

          <div className="p-2 rounded bg-stone-100 dark:bg-[#141210] border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 italic text-[0.63rem]">
            "{citationToDisplay}"
          </div>

          <div className="flex items-center justify-between pt-1 text-[0.6rem] font-mono text-stone-500 dark:text-stone-400">
            <span>Scope: {dbEntry.governingScope}</span>
            {dbEntry.doiOrUrl && (
              <a
                href={dbEntry.doiOrUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#2D8C6F] font-bold hover:underline flex items-center gap-0.5"
                onClick={(e) => e.stopPropagation()}
              >
                DOI Link <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
