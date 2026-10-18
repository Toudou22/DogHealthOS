/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DogSize = 'toy' | 'small' | 'medium' | 'large' | 'giant';

export interface Breed {
  name: string;
  size: DogSize;
  min: number;
  max: number;
  weight: string;
  weightGrams: number;
  group: string;
  health: string[];
  origin?: string;
  aliases?: string[];
}

export interface LifeStage {
  name: string;
  color: string;
  textColor: string;
  icon: string;
  desc: string;
}

export interface Milestone {
  year: number;
  icon: string;
  label: string;
  color: string;
  achieved: boolean;
  desc?: string;
  targetPeriod?: string;
  physiologicalDetails?: string;
  clinicalAction?: string;
  isCurrent?: boolean;
  category?: string;
}

export interface TimelineStage {
  name: string;
  start: number;
  end: number;
  color: string;
  pct: number;
}
