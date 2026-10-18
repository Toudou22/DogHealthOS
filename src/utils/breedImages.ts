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
  return `/dog-images/${encodeURIComponent(breedName.trim())}.8.png`;
}

