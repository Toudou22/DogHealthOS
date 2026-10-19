/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 * 
 * Dog Breed Image Locator.
 * Directly routes to /dog-images/<breed>.8.png.
 * If the user has uploaded the image, it renders cleanly.
 * If no image is present, UI components handle it gracefully and remain blank.
 */

export function getBreedImagePath(breedName: string): string | null {
  if (!breedName) return null;
  // Replace slashes with dashes to ensure clean URL resolution for breeds like Rough/Smooth Collie
  const cleanName = breedName.trim().replace(/\//g, '-');
  return `/dog-images/${encodeURIComponent(cleanName)}.8.png`;
}

