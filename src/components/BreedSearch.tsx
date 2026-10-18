/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, Scale, Target, Activity, Tag, BookOpen, Info } from 'lucide-react';
import { Breed, DogSize } from '../types.ts';
import { BREEDS } from '../breeds.ts';
import { getBreedImagePath } from '../utils/breedImages.ts';

interface BreedSearchProps {
  selectedBreed: Breed | null;
  onSelectBreed: (breed: Breed | null) => void;
  onOpenProfileModal?: (breed: Breed) => void;
}

export default function BreedSearch({ selectedBreed, onSelectBreed, onOpenProfileModal }: BreedSearchProps) {
  const [query, setQuery] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<DogSize | 'all'>('all');
  const [hoveredBreed, setHoveredBreed] = useState<Breed | null>(null);
  const [keyboardIndex, setKeyboardIndex] = useState<number>(-1);
  const listRef = useRef<HTMLDivElement>(null);

  // Calculate counts per size class
  const sizeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: BREEDS.length };
    BREEDS.forEach((b) => {
      counts[b.size] = (counts[b.size] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter list based on size pill & search input
  const filteredBreeds = useMemo(() => {
    const cleanQuery = query.toLowerCase().trim();
    const list = BREEDS.filter((b) => {
      const matchSize = selectedSize === 'all' || b.size === selectedSize;
      
      if (!cleanQuery) return matchSize;

      // Check name, aliases, group, origin, weight, size, and size synonyms
      const matchText =
        b.name.toLowerCase().includes(cleanQuery) ||
        (b.aliases && b.aliases.some((a) => a.toLowerCase().includes(cleanQuery))) ||
        b.group.toLowerCase().includes(cleanQuery) ||
        b.size.toLowerCase().includes(cleanQuery) ||
        (b.origin && b.origin.toLowerCase().includes(cleanQuery)) ||
        (b.weight && b.weight.toLowerCase().includes(cleanQuery)) ||
        (cleanQuery === 'giant' && b.size === 'giant') ||
        (cleanQuery === 'toy' && b.size === 'toy') ||
        (cleanQuery === 'small' && b.size === 'small') ||
        (cleanQuery === 'medium' && b.size === 'medium') ||
        (cleanQuery === 'large' && b.size === 'large') ||
        (cleanQuery === 'xl' && b.size === 'giant') ||
        (cleanQuery === 'mini' && (b.size === 'toy' || b.size === 'small'));

      return matchSize && matchText;
    });

    if (!cleanQuery) return list;

    // Rank matching results by relevance (exact alias or name match appears first)
    return list.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      const getScore = (item: Breed, name: string) => {
        if (name === cleanQuery) return 100;
        if (item.aliases?.some((al) => al.toLowerCase() === cleanQuery)) return 95;
        if (name.startsWith(cleanQuery)) return 85;
        if (item.aliases?.some((al) => al.toLowerCase().startsWith(cleanQuery))) return 80;
        if (name.includes(cleanQuery)) return 70;
        if (item.aliases?.some((al) => al.toLowerCase().includes(cleanQuery))) return 65;
        return 10;
      };

      const scoreA = getScore(a, aName);
      const scoreB = getScore(b, bName);

      if (scoreA !== scoreB) return scoreB - scoreA;
      return aName.localeCompare(bName);
    });
  }, [query, selectedSize]);

  // Handle keyboard arrow keys
  useEffect(() => {
    setKeyboardIndex(-1);
  }, [query, selectedSize]);

  // Clean query when selectedBreed becomes null
  useEffect(() => {
    if (!selectedBreed) {
      setQuery('');
    }
  }, [selectedBreed]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredBreeds.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setKeyboardIndex((prev) => {
        const next = Math.min(prev + 1, filteredBreeds.length - 1);
        scrollToIndex(next);
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setKeyboardIndex((prev) => {
        const next = Math.max(prev - 1, 0);
        scrollToIndex(next);
        return next;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (keyboardIndex >= 0 && keyboardIndex < filteredBreeds.length) {
        onSelectBreed(filteredBreeds[keyboardIndex]);
        setQuery('');
      } else if (filteredBreeds.length === 1) {
        onSelectBreed(filteredBreeds[0]);
        setQuery('');
      }
    }
  };

  const scrollToIndex = (index: number) => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll('.breed-item-btn');
    const target = items[index] as HTMLElement;
    if (target) {
      target.scrollIntoView({ block: 'nearest' });
      // Set hovered temporarily to show tooltip info
      const breedName = target.getAttribute('data-breed');
      const bObj = BREEDS.find((b) => b.name === breedName);
      if (bObj) setHoveredBreed(bObj);
    }
  };

  // Helper to render matched highlights & matched aliases
  const renderHighlightedName = (breed: Breed) => {
    const fullName = breed.name;
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return <span>{fullName}</span>;

    const index = fullName.toLowerCase().indexOf(trimmedQuery.toLowerCase());
    if (index !== -1) {
      const before = fullName.slice(0, index);
      const match = fullName.slice(index, index + trimmedQuery.length);
      const after = fullName.slice(index + trimmedQuery.length);

      return (
        <span className="truncate">
          {before}
          <mark className="bg-[#FF6B4A] text-white px-0.5 rounded-[3px] font-bold">
            {match}
          </mark>
          {after}
        </span>
      );
    }

    // If query matched an alias, display breed name plus matched alias badge
    const matchedAlias = breed.aliases?.find((a) =>
      a.toLowerCase().includes(trimmedQuery.toLowerCase())
    );

    if (matchedAlias) {
      return (
        <span className="flex items-center gap-1.5 min-w-0">
          <span className="truncate">{fullName}</span>
          <span className="text-[0.62rem] font-mono px-1.5 py-0.2 bg-[#FF6B4A]/15 text-[#FF6B4A] dark:text-[#FF8A65] rounded border border-[#FF6B4A]/30 font-bold shrink-0">
            aka "{matchedAlias}"
          </span>
        </span>
      );
    }

    return <span>{fullName}</span>;
  };

  return (
    <div className="bg-white/50 dark:bg-[#282420]/65 backdrop-blur-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-5 relative flex flex-col gap-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#1A1A1A] dark:text-[#F0ECE6]">
          1. Select Dog Breed
        </label>
        
        {selectedBreed ? (
          /* Locked selected state view */
          <div className="border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] rounded-lg p-3 bg-[#FF6B4A]/10 dark:bg-[#FF6B4A]/5 flex items-center justify-between shadow-[2px_2px_0_#1A1A1A] dark:shadow-[2px_2px_0_#F0ECE6]">
            <div className="flex items-center gap-3">
              {getBreedImagePath(selectedBreed.name) && (
                <div className="w-12 h-12 rounded-lg border-2 border-[#1A1A1A] dark:border-[#F0ECE6] overflow-hidden bg-stone-100 dark:bg-stone-900 shrink-0 shadow-sm">
                  <img
                    src={getBreedImagePath(selectedBreed.name)!}
                    alt={selectedBreed.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget.parentElement as HTMLElement)?.style.setProperty('display', 'none');
                    }}
                  />
                </div>
              )}
              <div>
                <p className="font-bold text-[#1A1A1A] dark:text-[#F0ECE6] text-base">
                  {selectedBreed.name}
                </p>
                <div className="flex gap-2 items-center text-xs text-[#8A8680] dark:text-[#9A9590] mt-0.5 font-mono">
                  <span className="capitalize px-1.5 py-0.5 rounded bg-[#1A1A1A]/5 dark:bg-white/5 font-bold">
                    {selectedBreed.size} size
                  </span>
                  <span>•</span>
                  <span>{selectedBreed.weight}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onOpenProfileModal && (
                <button
                  type="button"
                  onClick={() => onOpenProfileModal(selectedBreed)}
                  className="px-2.5 py-1.5 rounded-lg border-[2px] border-[#1A1A1A] dark:border-[#F0ECE6] bg-amber-500/15 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 font-mono text-[0.65rem] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  title="View full encyclopedic dossier"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Dossier</span>
                </button>
              )}
              <button
                onClick={() => {
                  onSelectBreed(null);
                  setQuery('');
                }}
                className="w-8 h-8 rounded-full border-[2px] border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1E1C18] flex items-center justify-center text-[#1A1A1A] dark:text-[#F0ECE6] hover:bg-[#FF6B4A] hover:text-white dark:hover:bg-[#FF6B4A] transition-all cursor-pointer shadow-[1px_1px_0_#1A1A1A] dark:shadow-[1px_1px_0_#F0ECE6]"
                title="Change breed selection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Filter & Search state */
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8680] dark:text-[#9A9590]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type breed name (e.g. Golden Retriever, Yorkie)..."
                className="w-full bg-white dark:bg-[#1E1C18] border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] rounded-xl pl-10 pr-9 py-2.5 text-sm outline-none text-[#1A1A1A] dark:text-[#F0ECE6] placeholder-[#8A8680] dark:placeholder-[#9A9590] focus:shadow-[1px_1px_0_#1A1A1A] dark:focus:shadow-[1px_1px_0_#F0ECE6] focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
                aria-label="Search breed input"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8680] dark:text-[#9A9590] hover:text-[#1A1A1A] dark:hover:text-[#F0ECE6]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Size pills with live count indicators */}
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter breeds by size group">
              {(['all', 'toy', 'small', 'medium', 'large', 'giant'] as const).map((sz) => {
                const count = sizeCounts[sz] || 0;
                const isSelected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full border-[2px] cursor-pointer transition-all uppercase tracking-wider flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#1A1A1A] dark:bg-[#F0ECE6] text-[#F5F0E8] dark:text-[#141210] border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[1px_1px_0_#1A1A1A] dark:shadow-[1px_1px_0_#F0ECE6]'
                        : 'bg-white dark:bg-[#1E1C18] text-[#8A8680] dark:text-[#9A9590] border-gray-300 dark:border-[#4E4A42] hover:border-[#1A1A1A] dark:hover:border-[#F0ECE6]'
                    }`}
                  >
                    <span>{sz}</span>
                    <span className={`text-[0.62rem] px-1 py-0.2 rounded-full font-mono font-bold ${
                      isSelected
                        ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black'
                        : 'bg-black/5 dark:bg-white/5 text-[#8A8680] dark:text-[#9A9590]'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[0.68rem] font-mono text-[#8A8680] dark:text-[#9A9590] pt-1">
              <span>
                <strong className="text-[#1A1A1A] dark:text-[#F0ECE6]">{filteredBreeds.length}</strong> {filteredBreeds.length === 1 ? 'breed' : 'breeds'} match filter
                {selectedSize !== 'all' && ` in ${selectedSize.toUpperCase()} class`}
              </span>
              <span>Use Arrow Keys / Hover</span>
            </div>

            {/* Results selection window */}
            <div
              ref={listRef}
              className="max-h-56 overflow-y-auto border-[2px] border-[#1A1A1A] dark:border-[#F0ECE6] rounded-lg bg-white/30 dark:bg-black/20 p-1 divide-y divide-[#1A1A1A]/10 dark:divide-[#F0ECE6]/10 scrollbar-thin overflow-x-hidden"
              role="listbox"
            >
              {filteredBreeds.length > 0 ? (
                filteredBreeds.map((breed, idx) => (
                  <div
                    key={breed.name}
                    data-breed={breed.name}
                    role="option"
                    aria-selected={keyboardIndex === idx}
                    tabIndex={0}
                    onClick={() => {
                      onSelectBreed(breed);
                      setQuery('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectBreed(breed);
                        setQuery('');
                      }
                    }}
                    onMouseEnter={() => setHoveredBreed(breed)}
                    onMouseLeave={() => setHoveredBreed(null)}
                    className={`breed-item-btn w-full px-3 py-2 text-left rounded-md flex items-center justify-between transition-all cursor-pointer text-[#1A1A1A] dark:text-[#F0ECE6] ${
                      keyboardIndex === idx
                        ? 'bg-[#FF6B4A]/10 dark:bg-[#FF6B4A]/25 border-l-[3px] border-[#FF6B4A]'
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {getBreedImagePath(breed.name) && (
                        <div className="w-8 h-8 rounded-md border border-[#1A1A1A]/30 dark:border-white/30 overflow-hidden bg-stone-100 dark:bg-stone-900 shrink-0">
                          <img
                            src={getBreedImagePath(breed.name)!}
                            alt={breed.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.currentTarget.parentElement as HTMLElement)?.style.setProperty('display', 'none');
                            }}
                          />
                        </div>
                      )}
                      <span className="font-semibold text-sm truncate">
                        {renderHighlightedName(breed)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {onOpenProfileModal && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenProfileModal(breed);
                          }}
                          className="p-1 rounded text-stone-400 hover:text-amber-600 hover:bg-amber-500/10 cursor-pointer"
                          title="View Breed Dossier"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <span className="text-[0.65rem] font-mono text-stone-400 hidden sm:inline">
                        {breed.weight}
                      </span>
                      <span className={`text-[0.65rem] font-bold uppercase py-0.5 px-1.5 rounded font-mono ${
                        breed.size === 'giant'
                          ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/20'
                          : breed.size === 'large'
                          ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/20'
                          : breed.size === 'medium'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                          : breed.size === 'small'
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                          : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                      }`}>
                        {breed.size}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 px-4 text-center text-xs text-[#8A8680] dark:text-[#9A9590] flex flex-col items-center gap-2">
                  <p>
                    No breeds found matching <strong className="text-[#FF6B4A]">"{query}"</strong>
                    {selectedSize !== 'all' && ` in the ${selectedSize.toUpperCase()} size category`}.
                  </p>
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="px-3 py-1 bg-[#1A1A1A] text-white dark:bg-[#F0ECE6] dark:text-[#1A1A1A] rounded-md font-mono text-[0.7rem] font-bold uppercase hover:bg-[#FF6B4A] dark:hover:bg-[#FF6B4A] transition-colors cursor-pointer"
                    >
                      Clear search to show all {sizeCounts[selectedSize]} {selectedSize !== 'all' ? selectedSize : ''} breeds
                    </button>
                  )}
                  {selectedSize !== 'all' && (
                    <button
                      onClick={() => setSelectedSize('all')}
                      className="text-[0.7rem] font-mono text-blue-500 underline hover:text-blue-600 cursor-pointer"
                    >
                      Switch to "ALL" size groups ({sizeCounts.all} breeds)
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hover display popup */}
      {!selectedBreed && hoveredBreed && (
        <div className="border-[2px] border-[#1A1A1A] dark:border-[#F0ECE6] bg-white dark:bg-[#1E1C18] rounded-xl p-3 shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] text-xs transition-opacity mt-1">
          <div className="flex items-center justify-between border-b pb-1.5 mb-1.5 border-[#1A1A1A]/10 dark:border-white/10">
            <span className="font-bold text-sm text-[#FF6B4A]">
              {hoveredBreed.name}
            </span>
            {hoveredBreed.origin && (
              <span className="font-mono text-[0.65rem] text-[#8A8680] dark:text-[#9A9590]">
                Origin: {hoveredBreed.origin}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-[#1A1A1A] dark:text-[#F0ECE6] font-mono">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#2D8C6F]" />
              <span>Lifespan: <strong>{hoveredBreed.min}–{hoveredBreed.max} yrs</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#E5A836]" />
              <span>Weight: <strong>{hoveredBreed.weight}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <Tag className="w-3.5 h-3.5 text-[#B87333]" />
              <span>Category: <strong>{hoveredBreed.group} Dog Group</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
