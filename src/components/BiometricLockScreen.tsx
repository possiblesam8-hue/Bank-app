import React, { useState } from 'react';
import { ShieldCheck, Fingerprint, Lock, ShieldAlert, KeyRound } from 'lucide-react';

interface BiometricLockScreenProps {
  onUnlock: () => void;
  correctPasscode: string;
}

export default function BiometricLockScreen({ onUnlock, correctPasscode }: BiometricLockScreenProps) {
  const [pin, setPin] = useState<string>('');
  const [errorCount, setErrorCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');

  const handleKeyPress = (num: string) => {
    setErrorMessage('');
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin === correctPasscode) {
        setStatus('success');
        setTimeout(() => {
          onUnlock();
        }, 800);
      } else if (nextPin.length === 4) {
        // Incorrect Pin
        setTimeout(() => {
          setErrorCount(prev => prev + 1);
          setErrorMessage('Security Warning: Invalid Passcode Match.');
          setPin('');
        }, 300);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const triggerBiometricScan = () => {
    setStatus('scanning');
    setErrorMessage('');
    setTimeout(() => {
      // Simulate high-security scan
      setStatus('success');
      setTimeout(() => {
        onUnlock();
      }, 600);
    }, 1500);
  };

  return (
    <div id="lock-screen-container" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-radial from-[#0F1335] via-[#080A16] to-[#03040C] p-6 text-white select-none">
      
      {/* Upper Security Header */}
      <div id="lock-header" class="mb-8 flex flex-col items-center text-center max-w-sm">
        <div class="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Lock className="h-8 w-8 animate-pulse" />
          <div class="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <h1 class="font-display text-2xl font-bold tracking-tight text-white">SwiftTrust Vault</h1>
        <p class="mt-2 text-sm text-gray-400">Secure AES-256 Multi-Factor Auth System</p>
      </div>

      {/* Main Authentication Box */}
      <div id="auth-panel" class="w-full max-w-sm rounded-3xl border border-gray-800 bg-[#0E1129]/60 p-6 backdrop-blur-xl transition-all duration-300">
        
        {/* Passcode Indicator */}
        <div class="mb-6 text-center">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Enter secure 4-Digit PIN</p>
          <div class="mt-4 flex justify-center gap-4">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                class={`h-4.5 w-4.5 rounded-full border-2 transition-all duration-200 ${
                  pin.length > index
                    ? 'bg-blue-500 border-blue-500 scale-110 shadow-[0_0_12px_rgba(59,130,246,0.5)]'
                    : 'border-gray-600 bg-transparent'
                }`}
              />
            ))}
          </div>
          {errorMessage && (
            <div class="mt-4 flex items-center justify-center gap-1 text-xs text-red-400">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {status === 'scanning' && (
            <div class="mt-4 text-xs text-blue-400 animate-pulse flex items-center justify-center gap-1">
              <Fingerprint className="h-4 w-4 animate-spin text-blue-400" />
              <span>Scanning biometric signature...</span>
            </div>
          )}
          {status === 'success' && (
            <div class="mt-4 text-xs text-emerald-400 font-medium flex items-center justify-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Security verified. Accessing Ledger...</span>
            </div>
          )}
        </div>

        {/* PIN Keypad Grid */}
        <div class="grid grid-cols-3 gap-y-3 gap-x-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              id={`pin-btn-${num}`}
              key={num}
              onClick={() => handleKeyPress(num)}
              disabled={status === 'scanning' || status === 'success'}
              class="flex h-16 w-full items-center justify-center rounded-2xl bg-white/[0.03] text-xl font-medium text-white border border-transparent active:scale-95 hover:border-gray-800 hover:bg-white/[0.06] transition-all"
            >
              {num}
            </button>
          ))}
          <button
            id="biometric-trigger-btn"
            onClick={triggerBiometricScan}
            disabled={status === 'scanning' || status === 'success'}
            class="flex h-16 w-full items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 active:scale-95 hover:bg-blue-500/20 transition-all"
            title="Simulate Fingerprint Biometrics"
          >
            <Fingerprint className="h-6 w-6" />
          </button>
          <button
            id="pin-btn-0"
            onClick={() => handleKeyPress('0')}
            disabled={status === 'scanning' || status === 'success'}
            class="flex h-16 w-full items-center justify-center rounded-2xl bg-white/[0.03] text-xl font-medium text-white border border-transparent active:scale-95 hover:border-gray-800 hover:bg-white/[0.06] transition-all"
          >
            0
          </button>
          <button
            id="pin-btn-backspace"
            onClick={handleBackspace}
            disabled={status === 'scanning' || status === 'success'}
            class="flex h-16 w-full items-center justify-center rounded-2xl text-sm font-medium text-gray-400 active:scale-95 hover:text-white transition-all"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Security Tip Footer */}
      <footer id="security-footer" class="mt-8 text-center text-xs text-gray-500 max-w-xs leading-relaxed">
        <div class="flex justify-center gap-1.5 mb-2 items-center text-gray-400">
          <KeyRound className="h-3.5 w-3.5" />
          <span>Demo PIN is <strong class="text-semibold text-blue-400">1234</strong></span>
        </div>
        Protected by hardware-level secure enclave elements. Unauthorized tampering attempts are strictly logged in audit server.
      </footer>
    </div>
  );
}
