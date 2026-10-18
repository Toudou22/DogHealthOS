/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Lock, Unlock, ShieldCheck, Fingerprint, KeyRound, AlertCircle, X, Check, Trash2 } from 'lucide-react';
import {
  isVaultConfigured,
  isVaultUnlocked,
  setupVaultPin,
  verifyVaultPin,
  lockVault,
  removeVaultProtection,
  isBiometricsConfigured,
  authenticateWithBiometrics
} from '../utils/vaultCrypto';

interface MedicalVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVaultStateChange?: () => void;
}

export default function MedicalVaultModal({ isOpen, onClose, onVaultStateChange }: MedicalVaultModalProps) {
  const [mode, setMode] = useState<'unlock' | 'setup' | 'manage'>('unlock');
  const [pin, setPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [enableBiometrics, setEnableBiometrics] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isShake, setIsShake] = useState<boolean>(false);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const configured = isVaultConfigured();
      const unlocked = isVaultUnlocked();
      setIsConfigured(configured);
      setIsUnlocked(unlocked);
      setPin('');
      setConfirmPin('');
      setErrorMsg(null);
      setSuccessMsg(null);

      if (!configured) {
        setMode('setup');
      } else if (!unlocked) {
        setMode('unlock');
      } else {
        setMode('manage');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerShake = () => {
    setIsShake(true);
    setTimeout(() => setIsShake(false), 500);
  };

  const handleKeypadPress = async (digit: string) => {
    setErrorMsg(null);
    if (mode === 'unlock') {
      if (pin.length < 4) {
        const nextPin = pin + digit;
        setPin(nextPin);
        if (nextPin.length === 4) {
          const success = await verifyVaultPin(nextPin);
          if (success) {
            setIsUnlocked(true);
            setSuccessMsg('Vault Unlocked Successfully');
            onVaultStateChange?.();
            setTimeout(() => {
              onClose();
            }, 600);
          } else {
            setErrorMsg('Incorrect PIN. Please try again.');
            triggerShake();
            setPin('');
          }
        }
      }
    } else if (mode === 'setup') {
      if (pin.length < 4) {
        setPin((prev) => prev + digit);
      } else if (confirmPin.length < 4) {
        const nextConfirm = confirmPin + digit;
        setConfirmPin(nextConfirm);
        if (nextConfirm.length === 4) {
          if (pin === nextConfirm) {
            const success = await setupVaultPin(pin, enableBiometrics);
            if (success) {
              setIsConfigured(true);
              setIsUnlocked(true);
              setSuccessMsg('PIN & Vault Security Activated!');
              onVaultStateChange?.();
              setTimeout(() => {
                onClose();
              }, 700);
            } else {
              setErrorMsg('Failed to save security PIN.');
            }
          } else {
            setErrorMsg('PINs do not match. Please start over.');
            triggerShake();
            setPin('');
            setConfirmPin('');
          }
        }
      }
    }
  };

  const handleBackspace = () => {
    if (mode === 'unlock') {
      setPin((prev) => prev.slice(0, -1));
    } else if (mode === 'setup') {
      if (confirmPin.length > 0) {
        setConfirmPin((prev) => prev.slice(0, -1));
      } else {
        setPin((prev) => prev.slice(0, -1));
      }
    }
  };

  const handleBiometricClick = async () => {
    setErrorMsg(null);
    const success = await authenticateWithBiometrics();
    if (success) {
      setIsUnlocked(true);
      setSuccessMsg('Biometric Authentication Verified');
      onVaultStateChange?.();
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      setErrorMsg('Biometrics failed or cancelled.');
    }
  };

  const handleLockNow = () => {
    lockVault();
    setIsUnlocked(false);
    setMode('unlock');
    setPin('');
    setSuccessMsg('Vault has been locked.');
    onVaultStateChange?.();
  };

  const handleRemoveProtection = () => {
    if (window.confirm('Are you sure you want to disable PIN protection for your pet medical records?')) {
      removeVaultProtection();
      setIsConfigured(false);
      setIsUnlocked(true);
      setSuccessMsg('PIN protection disabled.');
      onVaultStateChange?.();
      setTimeout(() => {
        onClose();
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div
        className={`relative w-full max-w-sm bg-white dark:bg-[#1E1C18] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] rounded-2xl shadow-[6px_6px_0_#1A1A1A] dark:shadow-[6px_6px_0_#F0ECE6] p-6 text-center transition-all ${
          isShake ? 'animate-[shake_0.4s_ease-in-out]' : ''
        }`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-500 hover:text-black dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center mb-3">
          {isUnlocked ? (
            <Unlock className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Lock className="w-7 h-7 text-[#FF6B4A]" />
          )}
        </div>

        <h3 className="text-lg font-black text-[#1A1A1A] dark:text-[#F0ECE6] tracking-tight">
          {mode === 'unlock' && 'Medical Vault Protection'}
          {mode === 'setup' && (pin.length < 4 ? 'Set 4-Digit Security PIN' : 'Confirm Your 4-Digit PIN')}
          {mode === 'manage' && 'Vault Security Settings'}
        </h3>

        <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 max-w-xs mx-auto">
          {mode === 'unlock' && 'Enter your PIN or use biometrics to access private weight logs & medical dossiers.'}
          {mode === 'setup' && (pin.length < 4 ? 'Create a 4-digit code to encrypt local canine biometric records.' : 'Re-enter your PIN to confirm activation.')}
          {mode === 'manage' && 'Your local pet health records are protected with client-side SHA-256 encryption.'}
        </p>

        {errorMsg && (
          <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-center gap-1.5 animate-[fadeIn_0.2s_ease-out]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 animate-[fadeIn_0.2s_ease-out]">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* PIN Indicators */}
        {(mode === 'unlock' || mode === 'setup') && (
          <div className="my-5 flex items-center justify-center gap-3">
            {[0, 1, 2, 3].map((idx) => {
              const currentActiveLength = mode === 'setup' && pin.length === 4 ? confirmPin.length : pin.length;
              const isFilled = idx < currentActiveLength;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                    isFilled
                      ? 'bg-[#FF6B4A] border-[#FF6B4A] scale-110 shadow-sm'
                      : 'bg-transparent border-stone-400 dark:border-stone-600'
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* Setup Biometric Checkbox */}
        {mode === 'setup' && pin.length < 4 && (
          <label className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={enableBiometrics}
              onChange={(e) => setEnableBiometrics(e.target.checked)}
              className="rounded accent-[#FF6B4A]"
            />
            <span>Enable Touch ID / Biometric Quick Unlock</span>
          </label>
        )}

        {/* Keypad */}
        {(mode === 'unlock' || mode === 'setup') && (
          <div className="grid grid-cols-3 gap-2 max-w-[220px] mx-auto mt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeypadPress(digit)}
                className="h-11 rounded-xl bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700 text-[#1A1A1A] dark:text-[#F0ECE6] font-bold text-base border border-stone-300 dark:border-stone-700 active:scale-95 transition-all cursor-pointer"
              >
                {digit}
              </button>
            ))}
            
            {/* Biometrics or Empty */}
            {mode === 'unlock' && isBiometricsConfigured() ? (
              <button
                type="button"
                onClick={handleBiometricClick}
                className="h-11 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                title="Unlock with Biometrics / Touch ID"
              >
                <Fingerprint className="w-5 h-5" />
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="h-11 rounded-xl bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700 text-[#1A1A1A] dark:text-[#F0ECE6] font-bold text-base border border-stone-300 dark:border-stone-700 active:scale-95 transition-all cursor-pointer"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleBackspace}
              className="h-11 rounded-xl bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-400 font-bold text-xs border border-stone-300 dark:border-stone-700 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
              title="Delete digit"
            >
              ⌫
            </button>
          </div>
        )}

        {/* Manage Mode Options */}
        {mode === 'manage' && (
          <div className="space-y-3 mt-4 text-left">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-black text-emerald-800 dark:text-emerald-300">Vault Currently Unlocked</div>
                <div className="text-[0.65rem] text-stone-600 dark:text-stone-300">Private health logs are active for this browsing session.</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLockNow}
              className="w-full py-2.5 px-3 rounded-xl bg-[#1A1A1A] dark:bg-[#F0ECE6] text-white dark:text-[#1A1A1A] font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Lock Vault Now</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('setup');
                setPin('');
                setConfirmPin('');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-2 border border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-95 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Change 4-Digit PIN</span>
            </button>

            <button
              type="button"
              onClick={handleRemoveProtection}
              className="w-full py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center gap-2 border border-red-500/30 active:scale-95 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove PIN Protection</span>
            </button>
          </div>
        )}

        {/* Bottom Footer Details */}
        <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 text-[0.65rem] text-stone-500 dark:text-stone-400 font-mono">
          <span>🔒 256-Bit Cryptographic Medical Privacy</span>
        </div>
      </div>
    </div>
  );
}
