import React, { useState } from 'react';
import { ArrowLeft, Send, ShieldCheck, Download, AlertTriangle, Play } from 'lucide-react';

interface WithdrawalViewProps {
  balance: number;
  onExecuteWithdrawal: (amount: number) => void;
  onBack: () => void;
}

export default function WithdrawalView({
  balance,
  onExecuteWithdrawal,
  onBack
}: WithdrawalViewProps) {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [atmCode, setAtmCode] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [minutesLeft, setMinutesLeft] = useState(15);

  const handleGenerateWithdrawalCode = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(withdrawAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;
    if (amountVal > balance) {
      alert("Withdrawal Limit Breach: Insufficient funds in primary balance ledger.");
      return;
    }

    onExecuteWithdrawal(amountVal);

    // Generate random 10 digit secure ATM OTP code code
    const token = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    setAtmCode(token);
    setIsGenerated(true);

    // Dynamic timer ticker
    const interval = setInterval(() => {
      setMinutesLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 60000);
  };

  const handleReset = () => {
    setWithdrawAmount('');
    setAtmCode('');
    setIsGenerated(false);
    setMinutesLeft(15);
  };

  return (
    <div id="withdrawal-screen-wrapper" class="space-y-6">
      
      {/* Header */}
      <div class="flex items-center gap-2">
        <button 
          id="withdraw-back-btn"
          onClick={onBack} 
          class="p-2 bg-[#0E1231] hover:bg-white/5 border border-gray-800 rounded-xl text-gray-400 hover:text-white transition-all active:scale-95"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div>
          <h2 class="font-display text-xl font-bold tracking-tight text-white">Cardless ATM Withdrawal</h2>
          <p class="text-[11px] text-gray-400">Generate a secure 10-digit OTP valid at any ATM nationwide</p>
        </div>
      </div>

      {!isGenerated ? (
        <form id="withdrawal-form" onSubmit={handleGenerateWithdrawalCode} class="space-y-4">
          
          <div class="p-3.5 bg-blue-950/20 rounded-2xl border border-blue-500/20 flex justify-between items-center text-xs">
            <span class="text-gray-400">Step: Standard safety regulations</span>
          </div>

          {/* Amount field */}
          <div class="space-y-1.5">
            <label class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Withdrawal Amount (₦)</label>
            <input
              id="withdraw-amount-input"
              type="number"
              required
              min="1000"
              max="100000"
              step="1000"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="e.g. 5000"
              class="w-full bg-[#12163A]/40 border border-gray-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono placeholder-gray-500"
            />
            <span class="text-[10px] text-gray-500 block">Must be in multiples of ₦1,000 up to ₦100,000 maximum daily buffer limit.</span>
          </div>

          <button
            id="generate-withdraw-code-btn"
            type="submit"
            class="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] font-semibold text-xs text-white transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(29,78,216,0.25)]"
          >
            <Send className="h-4 w-4" />
            <span>Generate secure ATM Token Code</span>
          </button>

          {/* Safety disclaimer */}
          <div class="flex gap-2.5 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-[11px] leading-relaxed text-amber-500 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>ATM token codes are single-use credentials. Do NOT disclose this OTP code to third-party customer support desks, web forums, or email portals. Genuine swift bank associates will never solicit these parameters.</span>
          </div>

        </form>
      ) : (
        /* Generated secure cardless bank token view */
        <div id="withdrawn-success" class="p-6 bg-[#0E1231]/70 border border-gray-800 rounded-2xl text-center space-y-6">
          
          <div class="flex flex-col items-center gap-2">
            <div class="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="h-8 w-8 text-emerald-400 animate-pulse" />
            </div>
            <h3 class="font-display text-lg font-bold text-white tracking-tight">ATM OTP Generated</h3>
            <p class="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">Valid for {minutesLeft} minutes on clearings channel</p>
          </div>

          {/* Large display code */}
          <div class="bg-black/40 border border-gray-800 rounded-2xl p-6 max-w-xs mx-auto text-center space-y-2">
            <span class="text-[10px] uppercase font-bold text-gray-500 tracking-wider">ATM Terminal single-use cardless credentials</span>
            <p class="text-2xl font-mono font-bold text-blue-400 tracking-widest uppercase select-all">{atmCode}</p>
          </div>

          <table class="w-full text-xs space-y-4">
            <tbody>
              <tr class="flex justify-between items-center py-2 border-b border-gray-800/60">
                <td class="text-gray-400 font-medium">Authorized Amount</td>
                <td class="text-white font-mono font-bold">₦{parseFloat(withdrawAmount).toLocaleString()}</td>
              </tr>
              <tr class="flex justify-between items-center py-2 border-b border-gray-800/60">
                <td class="text-gray-400 font-medium">Validation Status</td>
                <td class="text-emerald-400 font-semibold uppercase">Pending Settlement...</td>
              </tr>
            </tbody>
          </table>

          <div class="flex gap-3">
            <button
              id="download-otp-ref"
              onClick={() => alert("Credentials token downloaded inside secure secure storage.")}
              class="flex-1 py-3 border border-gray-800 hover:bg-white/5 font-semibold text-xs text-gray-300 hover:text-white rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1"
            >
              <Download className="h-4 w-4" />
              <span>Copy Code</span>
            </button>
            <button
              id="reset-withdraw-btn"
              onClick={handleReset}
              class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 font-semibold text-xs text-white rounded-xl active:scale-95 transition-all"
            >
              Reset Session
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
