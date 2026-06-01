import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Dumbbell, AlertTriangle, ToggleLeft, ToggleRight, Settings, Sliders, PlayCircle, Lock, ShieldX } from 'lucide-react';
import { VirtualCard, Transaction } from '../types';

interface CardsViewProps {
  card: VirtualCard;
  balance: number;
  transactions: Transaction[];
  onToggleCardActive: () => void;
  onUpdateDailyLimit: (limit: number) => void;
}

export default function CardsView({
  card,
  balance,
  transactions,
  onToggleCardActive,
  onUpdateDailyLimit
}: CardsViewProps) {
  const [showCardSecret, setShowCardSecret] = useState(false);
  const [editingLimit, setEditingLimit] = useState(false);
  const [limitSliderVal, setLimitSliderVal] = useState(card.dailyLimit);

  // Filter transaction payments specifically processed through this debit card
  const cardTransactions = transactions.filter(t => t.type === 'bill');

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setLimitSliderVal(val);
  };

  const handleSaveLimit = () => {
    onUpdateDailyLimit(limitSliderVal);
    setEditingLimit(false);
  };

  const formattedCardNumber = (num: string) => {
    if (!showCardSecret) {
      return `••••  ••••  ••••  ${num.slice(-4)}`;
    }
    return num.match(/.{1,4}/g)?.join('  ') || num;
  };

  return (
    <div id="cards-view-wrapper" class="space-y-6">
      
      {/* Header */}
      <div>
        <h2 class="font-display text-xl font-bold tracking-tight text-white">Virtual Security Card</h2>
        <p class="text-[11px] text-gray-400">Manage instant credentials and transaction budget barriers safely</p>
      </div>

      {/* Styled Physical Visa Card */}
      <div 
        id="physical-card"
        class={`relative h-52 w-full rounded-2xl p-6 text-white overflow-hidden/ border transition-all duration-300 ${
          card.isActive 
            ? 'bg-gradient-to-tr from-[#14151C] via-[#2F334A] to-[#141F3C] border-gray-800 shadow-[0_12px_24px_rgba(20,31,60,0.4)]' 
            : 'bg-gradient-to-tr from-[#0F0F12] via-[#1A1A24] to-[#0A0A0F] border-red-900/20 opacity-80 shadow-none'
        }`}
      >
        {/* Glow corner elements */}
        {card.isActive && (
          <div class="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
        )}

        {/* Top Header Card */}
        <div class="flex justify-between items-start mb-6">
          <div class="space-y-0.5">
            <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Virtual Debit Card</span>
            <div class="flex items-center gap-1.5">
              <span class={`h-2 w-2 rounded-full ${card.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span class="text-xs font-semibold text-[#F3F4F6]">{card.isActive ? 'Active' : 'Frozen / Inactive'}</span>
            </div>
          </div>
          {/* Card Issuer Chip */}
          <div class="h-8 w-11 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center font-mono font-bold text-yellow-600">
            CHIP
          </div>
        </div>

        {/* Card Number */}
        <div class="mb-6">
          <p class="text-lg md:text-xl font-mono tracking-widest text-[#E2E8F0]">
            {formattedCardNumber(card.number)}
          </p>
        </div>

        {/* Expiry, CVV and Visa branding */}
        <div class="flex justify-between items-end">
          <div class="flex gap-6 text-xs">
            <div>
              <span class="text-[9px] uppercase text-gray-500 block">Valid Thru</span>
              <span class="font-mono font-bold text-gray-300">{card.expiryDate}</span>
            </div>
            <div>
              <span class="text-[9px] uppercase text-gray-500 block">CVV</span>
              <span class="font-mono font-bold text-gray-300">
                {showCardSecret ? card.cvv : '•••'}
              </span>
            </div>
            <div>
              <span class="text-[9px] uppercase text-gray-500 block">Cardholder</span>
              <span class="font-display font-medium text-gray-300 text-[11px] uppercase tracking-wide">{card.cardholderName}</span>
            </div>
          </div>
          
          <div class="flex flex-col items-end">
            <span class="text-xl font-display font-medium italic text-white/90">VISA</span>
          </div>
        </div>
      </div>

      {/* Control Actions Panel */}
      <div id="controls-pnl" class="grid grid-cols-2 gap-3">
        
        {/* Toggle Freeze */}
        <button
          id="toggle-freeze-card-btn"
          onClick={onToggleCardActive}
          class={`p-4 rounded-2xl border flex flex-col gap-2 items-start text-left cursor-pointer transition-all ${
            card.isActive 
              ? 'bg-[#0E1231]/55 border-gray-800 hover:bg-white/5' 
              : 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15'
          }`}
        >
          {card.isActive ? (
            <>
              <Lock className="h-5 w-5 text-amber-400" />
              <div>
                <span class="text-xs font-bold text-[#F3F4F6] block">Freeze Card</span>
                <span class="text-[10px] text-gray-400 leading-normal">Temporarily prevent online transactions</span>
              </div>
            </>
          ) : (
            <>
              <PlayCircle className="h-5 w-5 text-emerald-400" />
              <div>
                <span class="text-xs font-bold text-[#F3F4F6] block">Activate Card</span>
                <span class="text-[10px] text-emerald-400 leading-normal">Instantly unfreeze for secure payments</span>
              </div>
            </>
          )}
        </button>

        {/* Toggle details eye */}
        <button
          id="toggle-details-[id]"
          onClick={() => setShowCardSecret(!showCardSecret)}
          class="p-4 rounded-2xl bg-[#0E1231]/55 border border-gray-800 flex flex-col gap-2 items-start text-left hover:bg-white/5 active:scale-[0.98] cursor-pointer transition-all"
        >
          {showCardSecret ? (
            <>
              <EyeOff className="h-5 w-5 text-blue-400" />
              <div>
                <span class="text-xs font-bold text-[#F3F4F6] block">Hide Details</span>
                <span class="text-[10px] text-gray-400 leading-normal">Disguise card numbers on dashboard</span>
              </div>
            </>
          ) : (
            <>
              <Eye className="h-5 w-5 text-blue-400" />
              <div>
                <span class="text-xs font-bold text-[#F3F4F6] block">Show Secret Details</span>
                <span class="text-[10px] text-gray-400 leading-normal">Reveal full Visa and CVV details</span>
              </div>
          </>
          )}
        </button>

      </div>

      {/* Adjust daily budget boundary */}
      <section id="limit-slider-panel" class="p-5 bg-[#0E1231]/55 border border-gray-800 rounded-2xl space-y-4">
        
        <div class="flex justify-between items-center">
          <div class="space-y-0.5">
            <span class="text-xs text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Sliders className="h-3.5 w-3.5" /> Card Spend Threshold
            </span>
            <span class="text-[11px] text-gray-500 block font-medium">Cap daily limits to protect in case of leakages</span>
          </div>
          {editingLimit ? (
            <button
              id="save-limits-btn"
              onClick={handleSaveLimit}
              class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs text-white font-semibold flex items-center gap-1 active:scale-95 transition-all"
            >
              <ShieldCheck className="h-4 w-4" /> Save Limit
            </button>
          ) : (
            <button
              id="edit-limits-btn"
              onClick={() => setEditingLimit(true)}
              class="px-3 py-1 bg-white/5 border border-gray-800 hover:bg-white/10 text-[10px] text-gray-300 font-semibold rounded-lg"
            >
              Adjust Limit
            </button>
          )}
        </div>

        {/* Slider input */}
        <div class="space-y-2">
          <div class="flex justify-between text-xs font-mono font-medium">
            <span class="text-gray-400">Min ₦10k</span>
            <span class="text-blue-400 font-bold text-sm">₦{limitSliderVal.toLocaleString()}</span>
            <span class="text-gray-400">Max ₦500k</span>
          </div>

          <input
            id="limits-range-input"
            type="range"
            min="10000"
            max="500000"
            step="10000"
            value={limitSliderVal}
            onChange={handleSliderChange}
            disabled={!editingLimit}
            class="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-30 disabled:cursor-not-allowed"
          />

          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800/40 text-[11px]">
            <span class="text-gray-500 font-medium">Spent today: <strong class="text-gray-400 font-bold font-mono">₦{card.spent.toLocaleString()}</strong></span>
            <span class="text-gray-500 font-medium text-right">Remaining: <strong class="text-[#10B981] font-bold font-mono">₦{(card.dailyLimit - card.spent).toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Warning Indicator */}
        <div class="flex gap-2.5 p-3.5 bg-amber-500/5 rounded-xl border border-amber-500/10 text-[11px] leading-relaxed text-amber-400 font-medium">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>If card spends ever reach your daily Cap, further settlement transactions are blacklisted for security until next reset cycle (12:00AM GMT).</span>
        </div>

      </section>

      {/* Card Specific Ledger Registry */}
      <section id="card-tx-history" class="space-y-3">
        <h3 class="text-xs uppercase tracking-wider font-semibold text-gray-400">Card Payment Log</h3>
        
        {cardTransactions.length === 0 ? (
          <div class="p-6 text-center text-sm text-gray-500 bg-[#0E1231]/30 rounded-xl border border-gray-800/60 font-medium">
            No active Visa payments recorded today.
          </div>
        ) : (
          <div class="space-y-2">
            {cardTransactions.map(tx => (
              <div key={tx.id} class="p-3.5 bg-[#0C102C]/50 border border-gray-800 rounded-2xl flex items-center justify-between">
                <div class="space-y-1">
                  <p class="text-xs font-semibold text-[#F3F4F6]">{tx.title}</p>
                  <p class="text-[9px] text-gray-500 font-mono">Card Auth #303 | {tx.date}</p>
                </div>
                <div class="text-right">
                  <span class="text-xs font-bold font-mono text-gray-300">-₦{tx.amount.toLocaleString()}</span>
                  <span class="block text-[8px] uppercase tracking-wider font-semibold text-emerald-400">SUCCESS</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
