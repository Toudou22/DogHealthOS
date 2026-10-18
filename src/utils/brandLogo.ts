/**
 * Brand Logo Utility for High-Resolution PDF Document Generation
 * Loads the brand logo from /brand/logo.png and caches it as a base64 Data URL.
 */

let cachedLogoDataUrl: string | null = null;
let logoFetchPromise: Promise<string | null> | null = null;

export async function getBrandLogoDataUrl(): Promise<string | null> {
  if (cachedLogoDataUrl) {
    return cachedLogoDataUrl;
  }

  if (logoFetchPromise) {
    return logoFetchPromise;
  }

  logoFetchPromise = (async () => {
    try {
      if (typeof window === 'undefined') return null;

      const response = await fetch('/brand/logo.png');
      if (!response.ok) {
        console.warn('Brand logo file /brand/logo.png not found or could not be fetched:', response.status);
        return null;
      }

      const blob = await response.blob();
      return new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          cachedLogoDataUrl = result;
          resolve(result);
        };
        reader.onerror = () => {
          console.warn('Failed to read logo blob as Data URL');
          resolve(null);
        };
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.warn('Error loading brand logo for PDF export:', err);
      return null;
    }
  })();

  return logoFetchPromise;
}

export function getCachedBrandLogo(): string | null {
  return cachedLogoDataUrl;
}

// Immediately initiate preload so the high-DPI logo is ready for instant document generation
if (typeof window !== 'undefined') {
  getBrandLogoDataUrl().catch(() => {});
}
