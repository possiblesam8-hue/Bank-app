import React, { useState } from 'react';
import { Phone, Zap, Network, HelpCircle, Gift, Sparkles, Check, Siren, ArrowLeft, Send } from 'lucide-react';
import { BillPayment, Transaction } from '../types';

interface PaymentsViewProps {
  balance: number;
  onExecuteBillPayment: (category: string, provider: string, amount: number) => void;
  onBack: () => void;
}

export default function PaymentsView({
  balance,
  onExecuteBillPayment,
  onBack
}: PaymentsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<'Airtime' | 'Data' | 'Electricity' | 'TV Subscription' | null>(null);
  
  // Mobile Top Up states
  const [provider, setProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  
  // Power Electricity states
  const [meterNumber, setMeterNumber] = useState('');
  const [electricityProvider, setElectricityProvider] = useState('');
  const [electricityAmount, setElectricityAmount] = useState('');

  // Settle States
  const [settled, setSettled] = useState(false);
  const [lastPaymentRef, setLastPaymentRef] = useState('');
  const [earnedCashback, setEarnedCashback] = useState(0);

  const categories = [
    { id: 'Airtime', label: 'Airtime Topup', icon: Phone, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { id: 'Data', label: 'Mobile Data', icon: Network, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { id: 'Electricity', label: 'Power/Electricity', icon: Zap, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
    { id: 'TV Subscription', label: 'TV Subscription', icon: HelpCircle, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' }
  ];

  const handleMobilePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    if (!provider) {
      alert("Please select a telecom network provider.");
      return;
    }
    if (phoneNumber.length < 10) {
      alert("Invalid Phone number pattern.");
      return;
    }
    if (parsedAmount > balance) {
      alert("Limit Error: Insufficient funds in wallet balance.");
      return;
    }

    onExecuteBillPayment('bill', `${provider} Airtime Topup`, parsedAmount);
    
    // Simulate real bank settlement and cashback
    const cashback = parseFloat((parsedAmount * 0.015).toFixed(2));
    const ref = "BILL-TELCO-" + Math.floor(100000 + Math.random() * 900000);
    
    setEarnedCashback(cashback);
    setLastPaymentRef(ref);
    setSettled(true);
  };

  const handlePowerPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(electricityAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    if (!electricityProvider) {
      alert("Please choose your power disco distributor.");
      return;
    }
    if (meterNumber.length < 11) {
      alert("Invalid 11-digit Meter account ID sequence.");
      return;
    }
    if (parsedAmount > balance) {
      alert("Limit Error: Insufficient funds in wallet balance.");
      return;
    }

    onExecuteBillPayment('bill', `${electricityProvider} Electricity Hub`, parsedAmount);

    const cashback = parseFloat((parsedAmount * 0.01).toFixed(2));
    const ref = "BILL-POWER-" + Math.floor(100000 + Math.random() * 900000);

    setEarnedCashback(cashback);
    setLastPaymentRef(ref);
    setSettled(true);
  };

  const handleReset = () => {
    setProvider('');
    setPhoneNumber('');
    setAmount('');
    setMeterNumber('');
    setElectricityProvider('');
    setElectricityAmount('');
    setSettled(false);
    setSelectedCategory(null);
  };

  return (
    <div id="payments-screen-wrapper" class="space-y-6">
      
      {/* Header */}
      <div class="flex items-center gap-2">
        <button 
          id="payments-back-btn"
          onClick={onBack} 
          class="p-2 bg-[#0E1231] hover:bg-white/5 border border-gray-800 rounded-xl text-gray-400 hover:text-white transition-all"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div>
          <h2 class="font-display text-xl font-bold tracking-tight text-white">Utility Payments Center</h2>
          <p class="text-[11px] text-gray-400">Instantly settle utilities directly with automatic 1.5% cashback options</p>
        </div>
      </div>

      {!selectedCategory ? (
        <div class="space-y-6 animate-none">
          
          {/* Main options buttons */}
          <section id="payment-cat-grid" class="grid grid-cols-2 gap-3">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <button
                  id={`payment-cat-btn-${cat.id}`}
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  class="p-5 rounded-2xl bg-[#0E1231]/60 border border-gray-800 flex flex-col gap-3 items-start text-left hover:border-blue-500/30 active:scale-95 transition-all cursor-pointer hover:bg-blue-500/5"
                >
                  <div class={`h-11 w-11 rounded-xl flex items-center justify-center border ${cat.color}`}>
                    <IconComp className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span class="text-xs font-semibold text-[#F3F4F6] block">{cat.label}</span>
                    <span class="text-[10px] text-gray-500 leading-normal">Fast automatic clearing settlements</span>
                  </div>
                </button>
              );
            })}
          </section>

          {/* Cashback reward card */}
          <section id="cashback-hero-card" class="relative overflow-hidden p-5 rounded-2xl border border-dashed border-blue-500/40 bg-gradient-to-r from-blue-950/20 to-[#0A0D23]">
            <div class="flex gap-4 items-center">
              <div class="h-11 w-11 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shrink-0">
                <Gift className="h-6 w-6 animate-bounce" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-bold text-white flex items-center gap-1">
                  SwiftTrust Cashback Program <span class="text-[10px] bg-blue-500/15 border border-blue-500/20 px-1.5 py-0.5 rounded-full text-blue-400">ACTIVE</span>
                </p>
                <p class="text-[11px] text-gray-400 leading-normal">Settle any eligible telecom topup or electricity token through our payments engine and earn up to <strong class="text-emerald-400">1.5% commission directly refunded</strong> back into your primary wallet balance.</p>
              </div>
            </div>
          </section>

        </div>
      ) : settled ? (
        /* Settlement Receipt Card */
        <div id="payment-settled-box" class="p-6 bg-[#0E1231]/70 border border-gray-800 rounded-2xl text-center space-y-6">
          <div class="flex flex-col items-center gap-2">
            <div class="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Check className="h-8 w-8 text-emerald-400 animate-pulse" />
            </div>
            <h3 class="font-display text-lg font-bold text-white tracking-tight">Utility Settle Successful</h3>
            <p class="text-xs text-gray-400">Processing Node: CLEARING_SETTLEMENT_SUCCESSFUL</p>
          </div>

          {/* Bonus commission indicators */}
          <div class="bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-4 flex gap-3.5 items-center justify-center max-w-sm mx-auto">
            <Sparkles className="h-5 w-5 text-indigo-400 shrink-0 animate-pulse" />
            <div class="text-left">
              <span class="text-[10px] uppercase text-indigo-300 block font-bold">Commission Refund Claimed</span>
              <span class="text-sm font-bold font-mono text-emerald-400">+₦{earnedCashback.toLocaleString()} Cashback Credited</span>
            </div>
          </div>

          <table class="w-full text-xs space-y-4">
            <tbody>
              <tr class="flex justify-between items-center py-2 border-b border-gray-800/60">
                <td class="text-gray-400 font-medium">Utilities Category</td>
                <td class="text-white font-bold">{selectedCategory}</td>
              </tr>
              <tr class="flex justify-between items-center py-2 border-b border-gray-800/60">
                <td class="text-gray-400 font-medium">Settlement ID Token</td>
                <td class="font-mono text-blue-400 text-[10px] tracking-wide select-all">{lastPaymentRef}</td>
              </tr>
              <tr class="flex justify-between items-center py-2 border-b border-gray-800/60">
                <td class="text-gray-400 font-medium">Clearance Network Status</td>
                <td class="text-emerald-400 font-semibold uppercase">Closed & Verified</td>
              </tr>
            </tbody>
          </table>

          <button
            id="payment-ok"
            onClick={handleReset}
            class="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs text-white transition-all active:scale-95 shadow-[0_4px_15px_rgba(29,78,216,0.25)]"
          >
            Settle Another Bill
          </button>
        </div>
      ) : selectedCategory === 'Airtime' || selectedCategory === 'Data' ? (
        /* Mobile Topup Form */
        <form id="mobile-topup-form" onSubmit={handleMobilePurchase} class="space-y-4">
          
          <div class="p-3.5 bg-blue-950/20 rounded-2xl border border-blue-500/20 flex justify-between items-center text-xs">
            <span class="text-gray-400">Step: Complete mobile parameter config</span>
            <button
              id="back-to-bills-btn"
              type="button"
              onClick={() => setSelectedCategory(null)}
              class="text-blue-400 font-semibold hover:underline"
            >
              Cancel
            </button>
          </div>

          {/* Network Provider Selector */}
          <div class="space-y-1.5">
            <label class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Telecom Provider Network</label>
            <select
              id="telecom-provider-select"
              required
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              class="w-full bg-[#12163A]/80 border border-gray-800 rounded-2xl px-4 py-3.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none placeholder-gray-500"
            >
              <option value="" disabled>Choose Network</option>
              <option value="MTN">MTN Nigeria (1.5% Cashback)</option>
              <option value="Airtel">Airtel Nigeria (1.5% Cashback)</option>
              <option value="Airtel Data Bundle">Airtel Data Bundle Series</option>
              <option value="Glo">Globacom (Glo Nigeria)</option>
              <option value="9mobile">9mobile Network</option>
            </select>
          </div>

          {/* Receiver Phone number */}
          <div class="space-y-1.5">
            <label class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Receiver Mobile Telephone</label>
            <input
              id="telco-phone-input"
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
              placeholder="e.g. 08031234567"
              class="w-full bg-[#12163A]/40 border border-gray-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 tracking-widest font-mono placeholder-gray-500"
            />
          </div>

          {/* Fund amounts */}
          <div class="space-y-1.5">
            <label class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Recharge Amount (₦)</label>
            <input
              id="telco-amount-input"
              type="number"
              required
              min="50"
              max="50000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="₦500"
              class="w-full bg-[#12163A]/40 border border-gray-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono placeholder-gray-500"
            />
          </div>

          <button
            id="mobile-submit-btn"
            type="submit"
            class="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] font-semibold text-xs text-white transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(37,99,235,0.25)]"
          >
            <Send className="h-4 w-4" />
            <span>Settle Telecom Top Up</span>
          </button>

        </form>
      ) : (
        /* Electricity tokens Form */
        <form id="electricity-token-form" onSubmit={handlePowerPurchase} class="space-y-4">
          
          <div class="p-3.5 bg-blue-950/20 rounded-2xl border border-blue-500/20 flex justify-between items-center text-xs">
            <span class="text-gray-400">Step: Power tokens configuration grid</span>
            <button
              id="cancel-power-btn"
              type="button"
              onClick={() => setSelectedCategory(null)}
              class="text-blue-400 font-semibold hover:underline"
            >
              Cancel
            </button>
          </div>

          {/* Disco Provider Selector */}
          <div class="space-y-1.5">
            <label class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Electricity Distribution Disco</label>
            <select
              id="disco-provider-select"
              required
              value={electricityProvider}
              onChange={(e) => setElectricityProvider(e.target.value)}
              class="w-full bg-[#12163A]/80 border border-gray-800 rounded-2xl px-4 py-3.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none placeholder-gray-500"
            >
              <option value="" disabled>Select Disco Operator</option>
              <option value="IKEDC (Ikeja Power)">Ikeja Electricity (IKEDC Prepaid/Postpaid)</option>
              <option value="EKEDC (Eko Power)">Eko Electricity (EKEDC prepaid)</option>
              <option value="AEDC (Abuja Power)">Abuja Electricity (AEDC prepaid)</option>
              <option value="KEDCO (Kano Power)">Kano Distribution Disco (KEDCO)</option>
            </select>
          </div>

          {/* Meter identifier */}
          <div class="space-y-1.5">
            <label class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Meter Account ID Number / Sequence</label>
            <input
              id="power-meter-input"
              type="text"
              required
              pattern="[0-9]{11,13}"
              value={meterNumber}
              onChange={(e) => setMeterNumber(e.target.value.replace(/\D/g, '').slice(0, 13))}
              placeholder="e.g. 04231234567"
              class="w-full bg-[#12163A]/40 border border-gray-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 tracking-widest font-mono placeholder-gray-500"
            />
          </div>

          {/* Settle amount */}
          <div class="space-y-1.5">
            <label class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Token Amount (₦)</label>
            <input
              id="power-amount-input"
              type="number"
              required
              min="1000"
              max="200000"
              value={electricityAmount}
              onChange={(e) => setElectricityAmount(e.target.value)}
              placeholder="Min ₦1,000"
              class="w-full bg-[#12163A]/40 border border-gray-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono placeholder-gray-500"
            />
          </div>

          <button
            id="power-submit-btn"
            type="submit"
            class="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] font-semibold text-xs text-white transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(29,78,216,0.25)]"
          >
            <Send className="h-4 w-4" />
            <span>Generate Power Token</span>
          </button>

        </form>
      )}

    </div>
  );
}
