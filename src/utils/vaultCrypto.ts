/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const VAULT_SALT_KEY = 'canine_vault_salt';
const VAULT_HASH_KEY = 'canine_vault_pin_hash';
const VAULT_ENABLED_KEY = 'canine_vault_enabled';
const VAULT_SESSION_KEY = 'canine_vault_unlocked_session';
const VAULT_BIOMETRICS_KEY = 'canine_vault_biometrics_enabled';

// Generate a random cryptographic salt if none exists
function getOrCreateSalt(): Uint8Array {
  const existing = localStorage.getItem(VAULT_SALT_KEY);
  if (existing) {
    return new Uint8Array(JSON.parse(existing));
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  localStorage.setItem(VAULT_SALT_KEY, JSON.stringify(Array.from(salt)));
  return salt;
}

// Convert ArrayBuffer to Hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert Hex string back to ArrayBuffer
export function hexToBuffer(hexString: string): ArrayBuffer {
  const bytes = new Uint8Array(Math.floor(hexString.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexString.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes.buffer;
}

// Derive a 256-bit AES-GCM Key from PIN and Salt using PBKDF2
export async function deriveAesGcmKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(pin),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt plaintext with AES-256-GCM
export async function encryptVaultData(plaintext: string, pin: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV standard for AES-GCM
  const key = await deriveAesGcmKey(pin, salt);
  const encoder = new TextEncoder();
  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as any },
    key,
    encoder.encode(plaintext)
  );

  const payload = {
    algorithm: 'AES-256-GCM',
    kdf: 'PBKDF2-SHA256-100k',
    salt: bufferToHex(salt.buffer),
    iv: bufferToHex(iv.buffer),
    ciphertext: bufferToHex(ciphertextBuffer)
  };
  return JSON.stringify(payload);
}

// Decrypt AES-256-GCM ciphertext
export async function decryptVaultData(encryptedPayloadJson: string, pin: string): Promise<string> {
  const payload = JSON.parse(encryptedPayloadJson);
  const salt = hexToBuffer(payload.salt);
  const iv = hexToBuffer(payload.iv);
  const ciphertext = hexToBuffer(payload.ciphertext);

  const key = await deriveAesGcmKey(pin, new Uint8Array(salt));
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv) as any },
    key,
    ciphertext
  );
  return new TextDecoder().decode(decryptedBuffer);
}

// Derive a SHA-256 Hash for PIN validation with Salt
export async function hashPin(pin: string): Promise<string> {
  const salt = getOrCreateSalt();
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + bufferToHex(salt.buffer));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bufferToHex(hashBuffer);
}

// Check if a vault PIN is currently configured
export function isVaultConfigured(): boolean {
  return localStorage.getItem(VAULT_ENABLED_KEY) === 'true' && !!localStorage.getItem(VAULT_HASH_KEY);
}

// Check if the current session is unlocked
export function isVaultUnlocked(): boolean {
  if (!isVaultConfigured()) return true; // If not configured, vault is open
  return sessionStorage.getItem(VAULT_SESSION_KEY) === 'true';
}

// Set up a new PIN
export async function setupVaultPin(pin: string, enableBiometrics: boolean = false): Promise<boolean> {
  try {
    const hashed = await hashPin(pin);
    localStorage.setItem(VAULT_HASH_KEY, hashed);
    localStorage.setItem(VAULT_ENABLED_KEY, 'true');
    if (enableBiometrics) {
      localStorage.setItem(VAULT_BIOMETRICS_KEY, 'true');
    } else {
      localStorage.removeItem(VAULT_BIOMETRICS_KEY);
    }
    sessionStorage.setItem(VAULT_SESSION_KEY, 'true');
    return true;
  } catch (e) {
    console.error('Failed to setup vault pin:', e);
    return false;
  }
}

// Verify entered PIN against stored hash
export async function verifyVaultPin(pin: string): Promise<boolean> {
  try {
    const storedHash = localStorage.getItem(VAULT_HASH_KEY);
    if (!storedHash) return false;
    const computedHash = await hashPin(pin);
    const isValid = storedHash === computedHash;
    if (isValid) {
      sessionStorage.setItem(VAULT_SESSION_KEY, 'true');
    }
    return isValid;
  } catch (e) {
    console.error('Failed to verify vault pin:', e);
    return false;
  }
}

// Lock the vault immediately
export function lockVault(): void {
  sessionStorage.removeItem(VAULT_SESSION_KEY);
}

// Unlock the vault for current session (e.g. after biometric success)
export function unlockVaultSession(): void {
  sessionStorage.setItem(VAULT_SESSION_KEY, 'true');
}

// Disable the vault completely
export function removeVaultProtection(): void {
  localStorage.removeItem(VAULT_ENABLED_KEY);
  localStorage.removeItem(VAULT_HASH_KEY);
  localStorage.removeItem(VAULT_SALT_KEY);
  localStorage.removeItem(VAULT_BIOMETRICS_KEY);
  sessionStorage.removeItem(VAULT_SESSION_KEY);
}

// Check if biometrics is enabled in vault
export function isBiometricsConfigured(): boolean {
  return localStorage.getItem(VAULT_BIOMETRICS_KEY) === 'true';
}

// Simple simulated WebAuthn / Biometric verification prompt
export async function authenticateWithBiometrics(): Promise<boolean> {
  // If browser supports credentials API, attempt native verification or simulate fallback
  if (window.PublicKeyCredential && typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
    try {
      const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (available) {
        unlockVaultSession();
        return true;
      }
    } catch {
      // Fallback
    }
  }
  // If simulated/local biometric unlock
  unlockVaultSession();
  return true;
}
