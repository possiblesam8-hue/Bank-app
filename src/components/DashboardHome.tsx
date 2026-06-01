import React, { useState } from 'react';
import { Eye, EyeOff, Copy, ArrowUpRight, ArrowDownLeft, Phone, Zap, Bell, Check, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';
import { Transaction } from '../types';

interface DashboardHomeProps {
  balance: number;
  accountNumber: string;
  accountName: string;
  transactions: Transaction[];
  onNavigate: (tab: 'home' | 'cards' | 'transfer' | 'payments' | 'profile' | 'withdraw' | 'flash') => void;
  onOpenAdvisor: () => void;
}

export default function DashboardHome({
  balance,
  accountNumber,
  accountName,
  transactions,
  onNavigate,
  onOpenAdvisor
}: DashboardHomeProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateRef = (ref: string) => {
    return ref.slice(0, 12) + "...";
  };

  return (
    <div id="home-dashboard-wrapper" class="space-y-6">
      
      {/* Top Banner Greetings & Notification bell */}
      <header id="dashboard-header" class="flex items-center justify-between">
        <div class="space-y-1">
          <p class="text-xs text-gray-400 font-medium tracking-wide">PORTAL SESSION ACTIVE</p>
          <h2 class="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
            Hello, {accountName.split(' ')[0]} <span class="animate-pulse">👋</span>
          </h2>
          <p class="text-xs text-[#2563EB] font-medium">Secured with Cryptographic Ledger Logs</p>
        </div>
        <div class="relative h-10 w-10 shrink-0 rounded-xl bg-[#0E1231] border border-gray-800 flex items-center justify-center hover:bg-white/5 cursor-pointer active:scale-95 transition-all">
          <Bell className="h-5 w-5 text-gray-300" />
          <span class="absolute top-2 right-2.5 h-2.5 w-2.5 rounded-full bg-[#3F66F4] ring-2 ring-[#080A16]" />
        </div>
      </header>

      {/* Primary Balance Display Card */}
      <div 
        id="balance-card" 
        class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#1D4ED8] to-[#1E3A8A] p-6 text-white shadow-[0_15px_30px_rgba(29,78,216,0.25)] border border-[#3B82F6]/20"
      >
        {/* Futuristic curved coordinate overlay line */}
        <div class="absolute inset-0 opacity-15 pointer-events-none">
          <svg class="h-full w-full" viewBox="0 0 400 200" fill="none">
            <path d="M0 120 C 120 180, 240 60, 400 140" stroke="white" strokeWidth="3" />
            <path d="M0 60 C 150 120, 200 20, 400 80" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Info indicators */}
        <div class="relative flex items-center justify-between mb-4">
          <span class="text-xs uppercase tracking-wider font-semibold text-blue-200">Personal Wealth Balance</span>
          <div class="flex gap-2">
            <button 
              id="toggle-balance-eye-btn"
              onClick={() => setShowBalance(!showBalance)} 
              class="p-1 rounded-lg hover:bg-white/10 active:scale-95 transition-all"
            >
              {showBalance ? <Eye className="h-4.5 w-4.5 text-blue-100" /> : <EyeOff className="h-4.5 w-4.5 text-blue-100" />}
            </button>
          </div>
        </div>

        {/* Currency text */}
        <div class="relative flex items-baseline gap-2 mb-6">
          <span class="font-display font-bold text-3xl md:text-4xl text-white">
            {showBalance ? `₦${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '₦ ••••••••'}
          </span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-0.5">
            +12.5%
          </span>
        </div>

        {/* Base Account Indicators */}
        <div class="relative flex items-center justify-between pt-4 border-t border-white/10 text-xs">
          <div>
            <span class="text-blue-200 block text-[10px] uppercase font-semibold">Account Number</span>
            <span class="font-mono text-sm tracking-widest text-[#E2E8F0]">{accountNumber}</span>
          </div>
          <button 
            id="copy-account-btn"
            onClick={handleCopy} 
            class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 transition-all text-[11px] font-semibold border border-white/5"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-300" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Fast Action Grids */}
      <section id="quick-actions-bar" class="space-y-3">
        <h3 class="text-xs uppercase tracking-wider font-semibold text-gray-400">Quick Operations</h3>
        <div class="grid grid-cols-4 gap-3">
          <button 
            id="action-send-btn"
            onClick={() => onNavigate('transfer')}
            class="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#0E1231] border border-gray-800 hover:bg-blue-500/10 hover:border-blue-500/30 active:scale-95 transition-all"
          >
            <div class="h-11 w-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <ArrowUpRight className="h-5.5 w-5.5 animate-pulse" />
            </div>
            <span class="text-[11px] font-semibold text-[#E2E8F0] text-center">Send Money</span>
          </button>

          <button 
            id="action-transfer-btn"
            onClick={() => onNavigate('transfer')}
            class="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#0E1231] border border-gray-800 hover:bg-blue-500/10 hover:border-blue-500/30 active:scale-95 transition-all"
          >
            <div class="h-11 w-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <ChevronRight className="h-5.5 w-5.5" />
            </div>
            <span class="text-[11px] font-semibold text-[#E2E8F0] text-center">Transfer</span>
          </button>

          <button 
            id="action-withdraw-btn"
            onClick={() => onNavigate('withdraw')}
            class="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#0E1231] border border-gray-800 hover:bg-blue-500/10 hover:border-blue-500/30 active:scale-95 transition-all"
          >
            <div class="h-11 w-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <ArrowDownLeft className="h-5.5 w-5.5" />
            </div>
            <span class="text-[11px] font-semibold text-[#E2E8F0] text-center">Withdraw</span>
          </button>

          <button 
            id="action-bills-btn"
            onClick={() => onNavigate('payments')}
            class="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#0E1231] border border-gray-800 hover:bg-blue-500/10 hover:border-blue-500/30 active:scale-95 transition-all"
          >
            <div class="h-11 w-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Phone className="h-5.5 w-5.5" />
            </div>
            <span class="text-[11px] font-semibold text-[#E2E8F0] text-center">Airtime & Bills</span>
          </button>
        </div>
      </section>

      {/* AI Flash Transfer Gateway Card */}
      <section id="ai-flash-transfer-banner-card" className="p-5 bg-gradient-to-r from-[#0E1231] via-[#1E1F3D]/40 to-[#0A0D23] border border-indigo-500/25 rounded-2xl relative overflow-hidden shadow-[0_8px_30px_rgba(79,70,229,0.15)] group">
        {/* Decorative glow gradients */}
        <div className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none group-hover:bg-indigo-500/25 transition-all duration-500" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

        <div className="flex gap-4 items-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center border border-indigo-400/20 shrink-0 shadow-[0_4px_12px_rgba(99,102,241,0.3)] animate-pulse">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">Automated NLP Engine</span>
              <span className="text-[9px] bg-indigo-500/15 text-indigo-300 px-1.5 py-0.5 rounded-full border border-indigo-500/20 font-bold">READY</span>
            </div>
            <h4 className="text-sm font-bold text-white tracking-tight">AI Flash Transfer App</h4>
            <p className="text-[11px] text-gray-400 leading-normal">
              Execute premium, high-speed settlements securely using simple conversational prompt orders instead of manual form fields.
            </p>
            <div className="pt-2">
              <button
                id="launch-flash-router-btn"
                onClick={() => onNavigate('flash')}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 font-bold text-xs text-white rounded-xl active:scale-95 transition-all outline-none flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5 text-amber-300 fill-amber-300/10" />
                <span>Launch Flash Portal</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Ledger Logs Section */}
      <section id="recent-transactions-panel" class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-xs uppercase tracking-wider font-semibold text-gray-400">Recent Ledger Registry</h3>
          <button 
            id="see-all-transactions-btn"
            onClick={() => onNavigate('transfer')} 
            class="text-xs text-blue-400 font-semibold hover:underline"
          >
            See all
          </button>
        </div>

        <div class="space-y-2">
          {transactions.slice(0, 4).map((tx) => {
            const isNegative = tx.type === 'transfer' || tx.type === 'withdraw' || tx.type === 'bill';
            return (
              <div 
                key={tx.id} 
                class="p-3.5 rounded-2xl bg-[#0C102C]/50 border border-gray-800 flex items-center justify-between active:bg-white/5 cursor-pointer transition-all hover:border-gray-700/80"
              >
                <div class="flex items-center gap-3">
                  {/* Categorized grey micro background round icon */}
                  <div class={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.type === 'receive' || tx.type === 'deposit'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : tx.type === 'bill'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {tx.type === 'receive' || tx.type === 'deposit' ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : tx.type === 'bill' ? (
                      <Zap className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>

                  {/* Descriptions */}
                  <div class="space-y-0.5">
                    <p class="text-xs font-semibold text-[#F3F4F6]">{tx.title}</p>
                    <p class="text-[10px] text-gray-500 font-mono">
                      {tx.date}, {tx.time} | Ref: <span class="text-blue-400">{truncateRef(tx.reference)}</span>
                    </p>
                  </div>
                </div>

                {/* Amount sign tag */}
                <span class={`text-xs font-bold font-mono ${
                  isNegative ? 'text-gray-300' : 'text-[#10B981]'
                }`}>
                  {isNegative ? '-' : '+'}{`₦${tx.amount.toLocaleString()}`}
                </span>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
