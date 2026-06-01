import React, { useState } from 'react';
import { User, Shield, CheckCircle, Smartphone, AlertCircle, HelpCircle, LogOut } from 'lucide-react';
import { BankAccount } from '../types';

interface ProfileViewProps {
  account: BankAccount;
  onUpdateBiometrics: (enabled: boolean) => void;
  onLogout: () => void;
}

export default function ProfileView({
  account,
  onUpdateBiometrics,
  onLogout
}: ProfileViewProps) {
  const [kycProgress, setKycProgress] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState(false);

  const handleKycUpgrade = () => {
    setKycProgress(true);
    setTimeout(() => {
      setUploadedDoc(true);
      setKycProgress(false);
    }, 1500);
  };

  return (
    <div id="profile-view-wrapper" class="space-y-6">
      
      {/* User Card */}
      <div id="user-header" class="flex items-center gap-4 p-5 bg-[#0E1231]/60 border border-gray-800 rounded-2xl relative overflow-hidden">
        <div class="h-16 w-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-2xl uppercase">
          {account.accountName.split(' ').map(n => n[0]).join('')}
        </div>
        <div class="space-y-1">
          <h3 class="font-display font-bold text-white text-lg tracking-tight">{account.accountName}</h3>
          <p class="text-xs text-gray-500 font-mono">{account.email}</p>
          <span class="inline-block text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {uploadedDoc ? 'Tier 3 (Fully Verified)' : account.kycLevel}
          </span>
        </div>
      </div>

      {/* KYC Progress updates Card */}
      <div id="kyc-manager-box" class="p-5 bg-gradient-to-r from-blue-950/15 to-[#0E1231] border border-gray-800 rounded-2xl space-y-4">
        <div class="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-400" />
          <h4 class="text-xs uppercase tracking-wider font-semibold text-gray-300">Identity Clearance Levels (KYC)</h4>
        </div>

        {kycProgress ? (
          <p class="text-xs text-blue-400 animate-pulse italic">Scanning facial biometric algorithms. Commencing national ID verification database fetch...</p>
        ) : uploadedDoc ? (
          <div class="space-y-2">
            <p class="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle className="h-4.5 w-4.5" /> Identity Tier 3 Complete
            </p>
            <p class="text-[11px] text-gray-400 leading-normal">You have been granted high tier clearance boundaries. Full daily transfers up to ₦10,000,000 and comprehensive theft risk insurance are active on your debit credit logs.</p>
          </div>
        ) : (
          <div class="space-y-3">
            <p class="text-[11px] text-gray-400 leading-normal">Upgrade to **Tier 3 (Fully Verified)** by uploading a scan of your National Identity credentials. Tier 3 unlocks limits up to ₦10M daily and fully insures cards.</p>
            <button
              id="upgrade-kyc-btn"
              onClick={handleKycUpgrade}
              type="button"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-xs text-white font-semibold rounded-lg transition-all"
            >
              Scan Credentials & Upgrade Instantly
            </button>
          </div>
        )}
      </div>

      {/* Security settings */}
      <section id="security-switches" class="p-5 bg-[#0E1231]/60 border border-gray-800 rounded-2xl space-y-4">
        <h4 class="text-xs uppercase tracking-wider font-semibold text-gray-400 flex items-center gap-1.5">
          <Smartphone className="h-4 w-4 text-blue-400" /> Security Controls
        </h4>

        <div class="flex items-center justify-between py-2 border-b border-gray-800/50">
          <div class="space-y-0.5">
            <span class="text-xs font-semibold text-gray-200 block">Biometric Unlock Simulation</span>
            <span class="text-[10px] text-gray-500">Accelerate access using fingerprint simulation</span>
          </div>
          <button
            id="toggle-biometrics-btn"
            onClick={() => onUpdateBiometrics(!account.biometricEnabled)}
            class="text-blue-500 hover:text-blue-400 font-semibold text-xs active:scale-95 transition-all"
          >
            {account.biometricEnabled ? 'ENABLED (Click to Disable)' : 'DISABLED (Click to Enable)'}
          </button>
        </div>

        <div class="flex items-center justify-between py-2 border-b border-gray-800/50">
          <div class="space-y-0.5">
            <span class="text-xs font-semibold text-gray-200 block">Vault Pin Passcode</span>
            <span class="text-[10px] text-gray-500">Current lock code is configured</span>
          </div>
          <span class="font-mono text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg">****</span>
        </div>
      </section>

      {/* Help links */}
      <section id="help-grid" class="p-4 bg-[#0E1231]/60 border border-gray-800 rounded-2xl flex justify-between items-center text-xs">
        <div class="flex items-center gap-2">
          <HelpCircle className="h-4.5 w-4.5 text-gray-400" />
          <span class="text-gray-300 font-medium">Clearance Help & Security Rules</span>
        </div>
        <button
          id="help-btn"
          onClick={() => alert("SwiftTrust Bank operates an automated, real-time secure settlement backend with hardware secure elements. For security assistance contact possiblesam8@gmail.com.")}
          class="text-blue-400 font-semibold hover:underline"
        >
          View Docs
        </button>
      </section>

      {/* Logout red button */}
      <button
        id="logout-btn"
        onClick={onLogout}
        class="w-full py-4 bg-red-500/10 hover:bg-red-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 font-semibold text-xs rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-1.5"
      >
        <LogOut className="h-4.5 w-4.5" />
        <span>Terminate Session (Logout)</span>
      </button>

    </div>
  );
}
