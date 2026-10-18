/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo } from 'react';
import { X, Globe, Heart, Activity, Shield, Sparkles, Zap, Flame, Snowflake, Award, CheckCircle2, ChevronRight, Scale } from 'lucide-react';
import { Breed } from '../types';
import { getBreedImagePath } from '../utils/breedImages';

interface BreedProfileModalProps {
  breed: Breed | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectBreedForCalculation?: (breed: Breed) => void;
}

export default function BreedProfileModal({
  breed,
  isOpen,
  onClose,
  onSelectBreedForCalculation
}: BreedProfileModalProps) {
  // Handle ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const attributes = useMemo(() => {
    if (!breed) return null;
    const size = breed.size;
    const group = breed.group || 'Companion';

    // Estimate trait ratings based on size & group
    let energyRating = 3;
    let exerciseMins = '45-60 min/day';
    let sheddingRating = 3;
    let trainability = 4;
    let heatTolerance = 3;
    let coldTolerance = 3;

    if (group.toLowerCase().includes('working') || group.toLowerCase().includes('herding') || group.toLowerCase().includes('sporting')) {
      energyRating = 5;
      exerciseMins = '90-120 min/day';
      trainability = 5;
    } else if (size === 'toy') {
      energyRating = 2;
      exerciseMins = '20-35 min/day';
      coldTolerance = 2;
      heatTolerance = 3;
    }

    if (breed.name.toLowerCase().includes('husky') || breed.name.toLowerCase().includes('malamute') || breed.name.toLowerCase().includes('bernese') || breed.name.toLowerCase().includes('samoyed') || breed.name.toLowerCase().includes('akita')) {
      coldTolerance = 5;
      heatTolerance = 1;
      sheddingRating = 5;
    }

    if (breed.name.toLowerCase().includes('poodle') || breed.name.toLowerCase().includes('bichon') || breed.name.toLowerCase().includes('maltese') || breed.name.toLowerCase().includes('schnauzer')) {
      sheddingRating = 1; // Hypoallergenic low shed
    }

    if (breed.name.toLowerCase().includes('pug') || breed.name.toLowerCase().includes('bulldog') || breed.name.toLowerCase().includes('boxer')) {
      heatTolerance = 1; // Brachycephalic
      energyRating = 2;
      exerciseMins = '25-40 min/day';
    }

    return {
      energyRating,
      exerciseMins,
      sheddingRating,
      trainability,
      heatTolerance,
      coldTolerance
    };
  }, [breed]);

  if (!isOpen || !breed) return null;

  const imagePath = getBreedImagePath(breed.name);
  const avgLife = ((breed.min + breed.max) / 2).toFixed(1);

  const renderMeter = (value: number, max: number = 5, colorClass: string = 'bg-[#FF6B4A]') => {
    return (
      <div className="flex gap-1 items-center">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`h-2 w-4 rounded-full transition-all ${
              i < value ? colorClass : 'bg-stone-200 dark:bg-stone-700'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1E1C18] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-2xl shadow-[8px_8px_0_#1A1A1A] dark:shadow-[8px_8px_0_#F0ECE6] overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Top Header Banner */}
        <div className="bg-stone-900 text-white p-5 flex items-start justify-between relative">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl border-2 border-white overflow-hidden bg-stone-800 shrink-0 shadow-md">
              <img
                src={imagePath}
                alt={breed.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[0.62rem] font-bold uppercase tracking-wider bg-[#FF6B4A] text-white">
                  {breed.group || 'Pedigree'}
                </span>
                <span className="px-2 py-0.5 rounded text-[0.62rem] font-mono font-bold uppercase tracking-wider bg-white/20 text-white">
                  {breed.size.toUpperCase()} Size
                </span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-white mt-1">
                {breed.name}
              </h2>
              <div className="flex items-center gap-3 text-xs text-stone-300 font-mono mt-0.5">
                {breed.origin && (
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-amber-400" />
                    <span>Origin: {breed.origin}</span>
                  </span>
                )}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Scale className="w-3 h-3 text-emerald-400" />
                  <span>Standard: {breed.weight}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-left text-[#1A1A1A] dark:text-[#F0ECE6]">
          {/* Key Stat Highlights */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-center">
              <div className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider">
                Life Expectancy
              </div>
              <div className="text-base font-black text-[#FF6B4A] font-mono mt-0.5">
                {breed.min} – {breed.max} yrs
              </div>
              <div className="text-[0.6rem] text-stone-400">Avg {avgLife} years</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-center">
              <div className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider">
                Daily Activity Need
              </div>
              <div className="text-base font-black text-[#1A1A1A] dark:text-[#F0ECE6] font-mono mt-0.5">
                {attributes?.exerciseMins}
              </div>
              <div className="text-[0.6rem] text-stone-400">Cardio requirement</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-center">
              <div className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider">
                Shedding Level
              </div>
              <div className="text-base font-black text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                {attributes?.sheddingRating === 1 ? 'Hypoallergenic' : attributes?.sheddingRating === 5 ? 'High Double Coat' : 'Moderate'}
              </div>
              <div className="text-[0.6rem] text-stone-400">Grooming index</div>
            </div>
          </div>

          {/* Core Temperament & Trait Radar / Meters */}
          {attributes && (
            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#FF6B4A]" />
                <span>Behavioral & Physical Characteristics</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-600 dark:text-stone-400 font-medium">Energy & Play Drive:</span>
                  {renderMeter(attributes.energyRating, 5, 'bg-[#FF6B4A]')}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-600 dark:text-stone-400 font-medium">Trainability & Focus:</span>
                  {renderMeter(attributes.trainability, 5, 'bg-emerald-500')}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-600 dark:text-stone-400 font-medium">Heat & Warmth Tolerance:</span>
                  {renderMeter(attributes.heatTolerance, 5, 'bg-amber-500')}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-600 dark:text-stone-400 font-medium">Cold Weather Resistance:</span>
                  {renderMeter(attributes.coldTolerance, 5, 'bg-cyan-500')}
                </div>
              </div>
            </div>
          )}

          {/* Known Hereditary Conditions & Clinical Screening */}
          <div className="space-y-2">
            <div className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Primary Hereditary Conditions & Screening Focus</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {breed.health.map((h) => (
                <span
                  key={h}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" />
                  <span>{h}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-transparent hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>

          {onSelectBreedForCalculation && (
            <button
              type="button"
              onClick={() => {
                onSelectBreedForCalculation(breed);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#FF6B4A] hover:bg-[#ff552e] text-white text-xs font-black uppercase tracking-wider shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <span>Calculate Longevity for {breed.name}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
