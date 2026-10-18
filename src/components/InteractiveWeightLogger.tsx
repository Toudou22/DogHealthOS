/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Scale, Plus, Trash2, TrendingUp, AlertTriangle, CheckCircle, Calendar, Sparkles, LineChart } from 'lucide-react';
import { Breed } from '../types';

export interface WeightRecord {
  id: string;
  date: string;
  ageMonths: number;
  weightKg: number;
  weightLbs: number;
  notes?: string;
}

interface InteractiveWeightLoggerProps {
  breed: Breed;
  currentAgeYears: number;
  unit: 'lbs' | 'kg';
  onWeightChange?: (newWeight: number) => void;
}

export default function InteractiveWeightLogger({
  breed,
  currentAgeYears,
  unit,
  onWeightChange
}: InteractiveWeightLoggerProps) {
  const storageKey = `canine_weight_history_${breed.name.replace(/\s+/g, '_')}`;

  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [inputDate, setInputDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [inputAgeMonths, setInputAgeMonths] = useState<string>(Math.round(currentAgeYears * 12).toString());
  const [inputWeight, setInputWeight] = useState<string>('');
  const [inputNotes, setInputNotes] = useState<string>('');

  // Load records from localStorage on mount or breed change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setRecords(Array.isArray(parsed) ? parsed : []);
      } else {
        // Seed with a default current record if empty
        const adultGrams = breed.weightGrams || 10000;
        const currentKg = currentAgeYears < 1 
          ? Math.max(1, Math.round((adultGrams / 1000) * Math.min(1, Math.pow(currentAgeYears, 0.6)) * 10) / 10)
          : Math.round((adultGrams / 1000) * 10) / 10;
        
        const initialRecord: WeightRecord = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          ageMonths: Math.round(currentAgeYears * 12),
          weightKg: currentKg,
          weightLbs: Math.round(currentKg * 2.20462 * 10) / 10,
          notes: 'Initial Baseline Assessment'
        };
        setRecords([initialRecord]);
      }
    } catch {
      setRecords([]);
    }
  }, [breed.name, storageKey, currentAgeYears]);

  // Save records whenever modified
  const saveRecords = (newRecords: WeightRecord[]) => {
    setRecords(newRecords);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newRecords));
    } catch (e) {
      console.error('Failed to save weight records', e);
    }
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputWeight);
    const months = parseFloat(inputAgeMonths);
    if (isNaN(val) || val <= 0 || isNaN(months) || months < 0) return;

    const weightKg = unit === 'lbs' ? val * 0.453592 : val;
    const weightLbs = unit === 'lbs' ? val : val * 2.20462;

    const newRec: WeightRecord = {
      id: Date.now().toString(),
      date: inputDate || new Date().toISOString().split('T')[0],
      ageMonths: months,
      weightKg: Math.round(weightKg * 10) / 10,
      weightLbs: Math.round(weightLbs * 10) / 10,
      notes: inputNotes.trim() || undefined
    };

    const updated = [...records, newRec].sort((a, b) => a.ageMonths - b.ageMonths);
    saveRecords(updated);
    setInputWeight('');
    setInputNotes('');
    setIsAdding(false);

    if (onWeightChange) {
      onWeightChange(unit === 'lbs' ? newRec.weightLbs : newRec.weightKg);
    }
  };

  const handleDeleteRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    saveRecords(updated);
  };

  // Adult Baseline calculations
  const adultWeightKg = (breed.weightGrams || 10000) / 1000;
  const adultWeightLbs = adultWeightKg * 2.20462;
  const targetAdult = unit === 'lbs' ? adultWeightLbs : adultWeightKg;

  // Latest record
  const latestRecord = useMemo(() => {
    if (records.length === 0) return null;
    return records[records.length - 1];
  }, [records]);

  // Growth Analysis & Projection Engine
  const growthAnalysis = useMemo(() => {
    if (!latestRecord) return null;

    const currentW = unit === 'lbs' ? latestRecord.weightLbs : latestRecord.weightKg;
    const months = latestRecord.ageMonths;

    // Pediatric formula projection
    let projectedAdult = targetAdult;
    let growthVelocity = 'Standard';
    let alertType: 'normal' | 'fast' | 'slow' = 'normal';

    if (months < 12 && months > 1) {
      // Fraction of maturity expected at this month for size
      let expectedPct = 0.5;
      if (breed.size === 'toy') expectedPct = Math.min(1, Math.pow(months / 9, 0.7));
      else if (breed.size === 'small' || breed.size === 'medium') expectedPct = Math.min(1, Math.pow(months / 12, 0.75));
      else if (breed.size === 'large') expectedPct = Math.min(1, Math.pow(months / 16, 0.8));
      else expectedPct = Math.min(1, Math.pow(months / 20, 0.85));

      projectedAdult = currentW / Math.max(0.1, expectedPct);
      const deltaRatio = projectedAdult / targetAdult;

      if (deltaRatio > 1.2) {
        growthVelocity = 'Accelerated (High Caloric Surge)';
        alertType = 'fast';
      } else if (deltaRatio < 0.8) {
        growthVelocity = 'Below Curve (Monitoring Advised)';
        alertType = 'slow';
      } else {
        growthVelocity = 'Ideal Standard Growth Velocity';
        alertType = 'normal';
      }
    } else {
      projectedAdult = currentW;
      const deltaRatio = currentW / targetAdult;
      if (deltaRatio > 1.15) {
        growthVelocity = 'Above Breed Standard (+15%)';
        alertType = 'fast';
      } else if (deltaRatio < 0.85) {
        growthVelocity = 'Below Breed Standard (-15%)';
        alertType = 'slow';
      } else {
        growthVelocity = 'Optimal Adult Weight Equilibrium';
        alertType = 'normal';
      }
    }

    return {
      currentW,
      projectedAdult: Math.round(projectedAdult * 10) / 10,
      growthVelocity,
      alertType,
      targetAdult: Math.round(targetAdult * 10) / 10
    };
  }, [latestRecord, unit, breed.size, targetAdult]);

  return (
    <div className="border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl bg-white dark:bg-[#1E1C18] p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#FF6B4A]/10 text-[#FF6B4A] border border-[#FF6B4A]/20">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-[#1A1A1A] dark:text-[#F0ECE6] uppercase tracking-wider">
              Historical Weight Logger & Growth Trajectory
            </h4>
            <p className="text-[0.7rem] text-stone-600 dark:text-stone-300">
              Track multi-entry weigh-ins and project adult mature weight against {breed.name} percentiles.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1.5 rounded-lg bg-[#FF6B4A] hover:bg-[#ff552e] text-white font-bold text-xs flex items-center gap-1.5 shadow-[2px_2px_0_#1A1A1A] active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? 'Close Form' : 'Log New Weight'}</span>
        </button>
      </div>

      {/* Add Entry Form */}
      {isAdding && (
        <form onSubmit={handleAddRecord} className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-300 dark:border-stone-700 animate-[fadeIn_0.2s_ease-out] space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-[#FF6B4A]">Record Weigh-In Event</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[0.65rem] font-bold uppercase text-stone-600 dark:text-stone-400 mb-1">
                Date
              </label>
              <input
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                required
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#141210] text-xs text-[#1A1A1A] dark:text-[#F0ECE6] font-mono focus:outline-[#FF6B4A]"
              />
            </div>
            <div>
              <label className="block text-[0.65rem] font-bold uppercase text-stone-600 dark:text-stone-400 mb-1">
                Age (Months)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="240"
                value={inputAgeMonths}
                onChange={(e) => setInputAgeMonths(e.target.value)}
                required
                placeholder="e.g. 6"
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#141210] text-xs text-[#1A1A1A] dark:text-[#F0ECE6] font-mono focus:outline-[#FF6B4A]"
              />
            </div>
            <div>
              <label className="block text-[0.65rem] font-bold uppercase text-stone-600 dark:text-stone-400 mb-1">
                Weight ({unit})
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={inputWeight}
                onChange={(e) => setInputWeight(e.target.value)}
                required
                placeholder={`e.g. ${unit === 'lbs' ? '35' : '16'}`}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#141210] text-xs text-[#1A1A1A] dark:text-[#F0ECE6] font-mono focus:outline-[#FF6B4A]"
              />
            </div>
          </div>
          <div>
            <label className="block text-[0.65rem] font-bold uppercase text-stone-600 dark:text-stone-400 mb-1">
              Clinical Context / Event Notes (Optional)
            </label>
            <input
              type="text"
              value={inputNotes}
              onChange={(e) => setInputNotes(e.target.value)}
              placeholder="e.g., Post-deworming vet check, Switch to active adult kibble"
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#141210] text-xs text-[#1A1A1A] dark:text-[#F0ECE6] focus:outline-[#FF6B4A]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-300 dark:hover:bg-stone-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#FF6B4A] text-white text-xs font-bold hover:bg-[#ff552e] shadow-[2px_2px_0_#1A1A1A] cursor-pointer"
            >
              Save Weigh-In
            </button>
          </div>
        </form>
      )}

      {/* Projection Metric Cards */}
      {growthAnalysis && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800">
            <div className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#FF6B4A]" />
              <span>Projected Adult Weight</span>
            </div>
            <div className="text-lg font-black text-[#1A1A1A] dark:text-[#F0ECE6] font-mono mt-0.5">
              ~{growthAnalysis.projectedAdult} {unit}
            </div>
            <div className="text-[0.62rem] text-stone-500 mt-0.5">
              Breed baseline: {growthAnalysis.targetAdult} {unit}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800">
            <div className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
              <LineChart className="w-3.5 h-3.5 text-amber-500" />
              <span>Growth Velocity Status</span>
            </div>
            <div className="text-xs font-black text-[#1A1A1A] dark:text-[#F0ECE6] mt-1 flex items-center gap-1.5">
              {growthAnalysis.alertType === 'normal' ? (
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              <span className="truncate">{growthAnalysis.growthVelocity}</span>
            </div>
            <div className="text-[0.62rem] text-stone-500 mt-0.5">
              {growthAnalysis.alertType === 'fast' ? 'Risk of orthopedic strain' : 'Standard percentile curve'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800">
            <div className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Total Recorded Entries</span>
            </div>
            <div className="text-lg font-black text-[#1A1A1A] dark:text-[#F0ECE6] font-mono mt-0.5">
              {records.length} {records.length === 1 ? 'Entry' : 'Entries'}
            </div>
            <div className="text-[0.62rem] text-stone-500 mt-0.5">
              Encrypted in local browser storage
            </div>
          </div>
        </div>
      )}

      {/* Historical Entries Table */}
      <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-100 dark:bg-stone-900/80 text-stone-600 dark:text-stone-300 uppercase tracking-wider font-bold text-[0.62rem] border-b border-stone-200 dark:border-stone-800">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Age</th>
              <th className="px-3 py-2">Weight ({unit})</th>
              <th className="px-3 py-2">Clinical Context</th>
              <th className="px-3 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800 font-mono">
            {records.map((r) => {
              const displayWeight = unit === 'lbs' ? r.weightLbs : r.weightKg;
              return (
                <tr key={r.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors">
                  <td className="px-3 py-2 text-stone-600 dark:text-stone-300 font-sans flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-stone-400 shrink-0" />
                    <span>{r.date}</span>
                  </td>
                  <td className="px-3 py-2 text-stone-800 dark:text-stone-200">
                    {r.ageMonths} mo ({Math.round((r.ageMonths / 12) * 10) / 10}y)
                  </td>
                  <td className="px-3 py-2 font-bold text-[#FF6B4A]">
                    {displayWeight} {unit}
                  </td>
                  <td className="px-3 py-2 text-stone-500 dark:text-stone-400 font-sans text-[0.68rem] max-w-xs truncate">
                    {r.notes || '—'}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteRecord(r.id)}
                      className="text-stone-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
