import React, { useState } from 'react';
import { Search, AlertCircle, ArrowUpRight, Check, Loader2, ArrowLeft, ShieldCheck, Download, History, Send } from 'lucide-react';
import { Transaction } from '../types';

interface TransferViewProps {
  balance: number;
  transactions: Transaction[];
  onExecuteTransfer: (amount: number, fee: number, title: string, recipient: string, bank: string, route: string, narration: string) => void;
  onBack: () => void;
}

export default function TransferView({
  balance,
  transactions,
  onExecuteTransfer,
  onBack
}: TransferViewProps) {
  const [activeTab, setActiveTab] = useState<'swift' | 'other'>('swift');
  
  // SwiftTrust Transfer details Form
  const [searchText, setSearchText] = useState('');
  const [swiftAmount, setSwiftAmount] = useState('');
  const [swiftNarration, setSwiftNarration] = useState('');
  
  // Other Bank Transfer details Form
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [otherAmount, setOtherAmount] = useState('');
  const [otherNarration, setOtherNarration] = useState('');
  const [accountName, setAccountName] = useState('');
  const [loadingName, setLoadingName] = useState(false);

  // States for verification and receipts
  const [currentStep, setCurrentStep] = useState<'form' | 'receipt'>('form');
  const [transferReceipt, setTransferReceipt] = useState<any>(null);

  const frequentlyTransferred = [
    { name: 'Michael Anderson', tag: 'MA', account: '0123456789' },
    { name: 'Sophia Okafor', tag: 'SO', account: '0812345678' },
    { name: 'James Adeyemi', tag: 'JA', account: '0901234567' },
    { name: 'Emily Johnson', tag: 'EM', account: '0703876543' }
  ];

  const recentContacts = [
    { name: 'David Williams', account: '07123456789', desc: 'SwiftTrust' },
    { name: 'Blessing Mark', account: '08012345678', desc: 'Access Bank' },
    { name: 'Daniel Abraham', account: '07098765432', desc: 'SwiftTrust' },
    { name: 'Chiamaka Joy', account: '08123456789', desc: 'GTBank' }
  ];

  const handlerSelectContact = (contact: any) => {
    if (activeTab === 'swift') {
      setSearchText(`${contact.name} (${contact.account})`);
    } else {
      setAccountNumber(contact.account);
      // Automatically run a simulation name lookup
      setLoadingName(true);
      setTimeout(() => {
        setAccountName(contact.name);
        setLoadingName(false);
      }, 700);
    }
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBank(e.target.value);
    if (accountNumber.length === 10) {
      triggerNameInquiry(accountNumber);
    }
  };

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setAccountNumber(val);
    if (val.length === 10) {
      triggerNameInquiry(val);
    } else {
      setAccountName('');
    }
  };

  const triggerNameInquiry = (accNum: string) => {
    setLoadingName(true);
    setAccountName('');
    setTimeout(() => {
      // Direct lookup simulator based on mock data base or dynamic creation
      const names = [
        'Kola Shola', 'Chuka Obi', 'Farida Usman', 'Wale Adebayo', 'Musa Ibrahim',
        'Blessing Alao', 'Amarachi Uzor', 'Tunde Folawiyo', 'Halima Bawa'
      ];
      const randomName = names[parseInt(accNum.slice(-1)) % names.length];
      setAccountName(randomName);
      setLoadingName(false);
    }, 800);
  };

  const handleExecuteSwift = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(swiftAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;
    
    // Check balance inclusion
    const fee = 0; // Free inside SwiftTrust
    if (amountVal + fee > balance) {
      alert("Transfer limit breach: Insufficient liquid reserves inside wallet.");
      return;
    }

    const recipient = searchText || "SwiftTrust Client Member";
    const ref = "TXR-SWIFT-" + Math.floor(100000 + Math.random() * 900000);
    
    onExecuteTransfer(
      amountVal, 
      fee, 
      `Transfer to ${recipient.split(' ')[0]}`, 
      recipient, 
      'SwiftTrust Bank', 
      'Internal Instant Transfer', 
      swiftNarration
    );

    // Save for receipt
    setTransferReceipt({
      recipient,
      bank: 'SwiftTrust Bank',
      amount: amountVal,
      fee,
      narration: swiftNarration || "Fund Transfer",
      ref,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setCurrentStep('receipt');
  };

  const handleExecuteOther = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(otherAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;
    if (!selectedBank) {
      alert("Please choose a destination bank.");
      return;
    }
    if (accountNumber.length !== 10) {
      alert("Account number criteria mismatch: Please input exactly 10 digits.");
      return;
    }

    const fee = 10; // Extra charge for other bank
    if (amountVal + fee > balance) {
      alert("Transfer limit breach: Insufficient liquid reserves inside wallet.");
      return;
    }

    const recipient = accountName || "Beneficiary Client";
    const ref = "TXR-OUT-" + Math.floor(100000 + Math.random() * 900000);

    onExecuteTransfer(
      amountVal,
      fee,
      `Transfer to ${recipient.split(' ')[0]}`,
      recipient,
      selectedBank,
      'Other Bank Wire',
      otherNarration
    );

    setTransferReceipt({
      recipient,
      bank: selectedBank,
      amount: amountVal,
      fee,
      narration: otherNarration || "Inter-Bank Wire Transfer",
      ref,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setCurrentStep('receipt');
  };

  const handleReset = () => {
    setSwiftAmount('');
    setSwiftNarration('');
    setSearchText('');
    setSelectedBank('');
    setAccountNumber('');
    setOtherAmount('');
    setOtherNarration('');
    setAccountName('');
    setCurrentStep('form');
  };

  return (
    <div id="transfer-screen-wrapper" class="space-y-6">
      
      {/* Top Title Section */}
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button 
            id="transfer-back-btn"
            onClick={onBack} 
            class="p-2 bg-[#0E1231] hover:bg-white/5 border border-gray-800 rounded-xl text-gray-400 hover:text-white transition-all active:scale-95"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <h2 class="font-display text-xl font-bold text-white tracking-tight">Transfer Ledger</h2>
            <p class="text-[11px] text-gray-400">Execute instantaneous peer-to-peer or interbank transfers</p>
          </div>
        </div>
      </div>

      {currentStep === 'form' ? (
        <div class="space-y-6">
          
          {/* Tabs switch */}
          <div class="flex p-1 bg-[#0E1231] border border-gray-800/80 rounded-2xl">
            <button
              id="swift-member-tab-btn"
              onClick={() => setActiveTab('swift')}
              class={`flex-1 py-3 text-xs font-semibold rounded-xl text-center cursor-pointer transition-all ${
                activeTab === 'swift'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              To SwiftTrust User
            </button>
            <button
              id="other-bank-tab-btn"
              onClick={() => setActiveTab('other')}
              class={`flex-1 py-3 text-xs font-semibold rounded-xl text-center cursor-pointer transition-all ${
                activeTab === 'other'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              To Other Bank
            </button>
          </div>

          {/* Form switch contents */}
          {activeTab === 'swift' ? (
            <form id="swift-transfer-form" onSubmit={handleExecuteSwift} class="space-y-4">
              
              {/* Recipient details */}
              <div class="space-y-1.5">
                <label class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Recipient Name or Username</label>
                <div class="relative">
                  <input
                    id="swift-recipient-input"
                    type="text"
                    required
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search by name, account, or telephone..."
                    class="w-full bg-[#12163A]/40 border border-gray-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pl-10 placeholder-gray-500"
                  />
                  <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-500" />
                </div>
              </div>

              {/* Amount details */}
              <div class="space-y-1.5">
                <label class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Amount (₦)</label>
                <div class="relative">
                  <input
                    id="swift-amount-input"
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={swiftAmount}
                    onChange={(e) => setSwiftAmount(e.target.value)}
                    placeholder="₦0.00"
                    class="w-full bg-[#12163A]/40 border border-gray-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono placeholder-gray-500"
                  />
                  <span class="absolute right-4 top-3.5 text-xs text-gray-500">Free Transaction Fee</span>
                </div>
              </div>

              {/* Narrations */}
              <div class="space-y-1.5">
                <label class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Narration (Optional)</label>
                <input
                  id="swift-narration-input"
                  type="text"
                  value={swiftNarration}
                  onChange={(e) => setSwiftNarration(e.target.value)}
                  placeholder="What's this transfer for?"
                  class="w-full bg-[#12163A]/40 border border-gray-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                />
              </div>

              {/* Action */}
              <button
                id="swift-continue-btn"
                type="submit"
                class="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] font-semibold text-xs text-white transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(37,99,235,0.25)]"
              >
                <Send className="h-4 w-4" />
                <span>Execute Swift Transfer</span>
              </button>

            </form>
          ) : (
            <form id="other-bank-transfer-form" onSubmit={handleExecuteOther} class="space-y-4">
              
              {/* Destination Bank Select */}
              <div class="space-y-1.5">
                <label class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Destination Institution</label>
                <select
                  id="other-bank-select"
                  required
                  value={selectedBank}
                  onChange={handleBankChange}
                  class="w-full bg-[#12163A]/80 border border-gray-800 rounded-2xl px-4 py-3.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none placeholder-gray-500"
                >
                  <option value="" disabled>Select Bank</option>
                  <option value="GTBank">Guaranty Trust Bank (GTBank)</option>
                  <option value="Access Bank">Access Bank Plc</option>
                  <option value="Zenith Bank">Zenith Bank Plc</option>
                  <option value="United Bank for Africa (UBA)">United Bank for Africa (UBA)</option>
                  <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                  <option value="Standard Chartered">Standard Chartered Bank</option>
                  <option value="Sterling Bank">Sterling Bank</option>
                  <option value="Kuda MFB">Kuda Microfinance Bank</option>
                </select>
              </div>

              {/* Account Number input */}
              <div class="space-y-1.5">
                <label class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Account Number</label>
                <div class="relative">
                  <input
                    id="other-acc-input"
                    type="text"
                    required
                    pattern="[0-9]{10}"
                    value={accountNumber}
                    onChange={handleAccountNumberChange}
                    placeholder="Enter 10-digit number"
                    class="w-full bg-[#12163A]/40 border border-gray-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 tracking-widest font-mono pl-10 placeholder-gray-500"
                  />
                  <span class="absolute left-3.5 top-3.5 text-gray-500 text-xs">#</span>
                </div>
              </div>

              {/* Dynamic verified recipient display name */}
              {loadingName && (
                <div class="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 flex items-center gap-2 text-xs">
                  <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
                  <span class="text-blue-400 italic">Verifying recipient name inquiry on centralized database node...</span>
                </div>
              )}

              {accountName && (
                <div class="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-between text-xs transition-all animate-none">
                  <span class="text-gray-400 font-medium">Beneficiary Name</span>
                  <span class="text-emerald-400 font-semibold uppercase">{accountName}</span>
                </div>
              )}

              {/* Amount details */}
              <div class="space-y-1.5">
                <label class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Amount (₦)</label>
                <div class="relative">
                  <input
                    id="other-amount-input"
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={otherAmount}
                    onChange={(e) => setOtherAmount(e.target.value)}
                    placeholder="₦0.00"
                    class="w-full bg-[#12163A]/40 border border-gray-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono placeholder-gray-500"
                  />
                  <span class="absolute right-4 top-3.5 text-[10px] bg-white/5 border border-gray-800 px-2 py-0.5 rounded-full text-gray-400">
                    Plus ₦10.00 inter-bank clearance charge
                  </span>
                </div>
              </div>

              {/* Narrations */}
              <div class="space-y-1.5">
                <label class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Narration (Optional)</label>
                <input
                  id="other-narration-input"
                  type="text"
                  value={otherNarration}
                  onChange={(e) => setOtherNarration(e.target.value)}
                  placeholder="What's this transfer for?"
                  class="w-full bg-[#12163A]/40 border border-gray-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                />
              </div>

              {/* Action */}
              <button
                id="other-continue-btn"
                type="submit"
                disabled={!accountName}
                class="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-40 disabled:hover:bg-blue-600 font-semibold text-xs text-white transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(37,99,235,0.25)]"
              >
                <Send className="h-4 w-4" />
                <span>Confirm & Wire Funds</span>
              </button>

            </form>
          )}

          {/* Quick Frequent Contacts */}
          <section id="frequent-contacts" class="space-y-3 pt-2">
            <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Frequently Transferred</p>
            <div class="flex gap-3 overflow-x-auto pb-1 max-w-full no-scrollbar">
              {frequentlyTransferred.map((contact, idx) => (
                <button
                  id={`frequent-btn-${idx}`}
                  key={idx}
                  onClick={() => handlerSelectContact(contact)}
                  type="button"
                  class="shrink-0 flex flex-col items-center gap-1.5 p-2 bg-[#0E1231]/30 hover:bg-blue-500/10 rounded-xl border border-gray-800/80 cursor-pointer active:scale-95 transition-all w-20"
                >
                  <div class="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs font-bold border border-blue-500/20">
                    {contact.tag}
                  </div>
                  <span class="text-[9px] text-[#E2E8F0] tracking-tight font-medium text-center truncate w-full">{contact.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Recent lists */}
          <section id="recent-contacts-list" class="space-y-2">
            <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Recents</p>
            <div class="grid grid-cols-2 gap-2">
              {recentContacts.map((contact, idx) => (
                <div
                  id={`recent-contact-item-${idx}`}
                  key={idx}
                  onClick={() => handlerSelectContact(contact)}
                  class="p-2.5 bg-[#0C102C]/60 hover:bg-blue-500/5 rounded-xl border border-gray-800/80 flex items-center gap-2 cursor-pointer transition-all hover:border-gray-700/60"
                >
                  <div class="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center font-mono text-xs text-indigo-300 font-semibold border border-gray-800">
                    #
                  </div>
                  <div class="min-w-0 space-y-0.5">
                    <p class="text-xs font-semibold text-[#F3F4F6] truncate">{contact.name}</p>
                    <p class="text-[9px] text-gray-500 truncate">{contact.account} • {contact.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      ) : (
        /* Real Printable PDF Bank receipt UI output */
        <div id="receipt-details-panel" class="bg-[#0E1231]/60 border border-gray-800 rounded-3xl p-6 relative overflow-hidden">
          
          <div class="absolute -top-32 -left-32 h-64 w-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Secure transaction checkmark */}
          <div class="flex flex-col items-center text-center space-y-2 mb-6">
            <div class="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="h-8 w-8 animate-pulse" />
            </div>
            <h3 class="font-display text-lg font-bold text-white tracking-tight">Transaction Successful</h3>
            <p class="text-xs text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">Funds Released & Settled</p>
          </div>

          {/* Receipt Data Table */}
          <div class="space-y-3 divide-y divide-gray-800/60 text-xs">
            <div class="flex justify-between items-center py-2.5">
              <span class="text-gray-400 font-medium">Beneficiary Recipient</span>
              <span class="text-white font-bold">{transferReceipt.recipient}</span>
            </div>
            <div class="flex justify-between items-center py-2.5">
              <span class="text-gray-400 font-medium">Recipient Bank</span>
              <span class="text-white font-bold">{transferReceipt.bank}</span>
            </div>
            <div class="flex justify-between items-center py-2.5">
              <span class="text-gray-400 font-medium">Amount Wired</span>
              <span class="text-white font-bold font-mono">₦{transferReceipt.amount.toLocaleString()}</span>
            </div>
            <div class="flex justify-between items-center py-2.5">
              <span class="text-gray-400 font-medium">Processing Fee</span>
              <span class="text-white font-bold font-mono">₦{transferReceipt.fee.toLocaleString()}</span>
            </div>
            <div class="flex justify-between items-center py-2.5">
              <span class="text-gray-400 font-medium">Transaction Date / Time</span>
              <span class="text-gray-300 font-medium">{transferReceipt.date} | {transferReceipt.time}</span>
            </div>
            <div class="flex justify-between items-center py-2.5">
              <span class="text-gray-400 font-medium">Audit Reference Hash</span>
              <span class="text-blue-400 font-mono text-[10px] tracking-wide uppercase select-all">{transferReceipt.ref}</span>
            </div>
            <div class="flex justify-between items-center py-2.5">
              <span class="text-gray-400 font-medium">Clearance Network Route</span>
              <span class="text-indigo-300 font-medium text-[10px] font-mono">{transferReceipt.bank === 'SwiftTrust Bank' ? 'INTERNAL_CRYPT_CHANNEL' : 'CBN_NIP_INTERBANK_WIRE'}</span>
            </div>
            <div class="flex justify-between items-center py-2.5">
              <span class="text-gray-400 font-medium">Narration</span>
              <span class="text-white italic">{transferReceipt.narration}</span>
            </div>
          </div>

          <div class="mt-6 flex gap-3">
            <button
              id="download-receipt-pdf-btn"
              onClick={() => alert("Crypto receipt verification token compiled. PDF downloaded inside browser attachments.")}
              class="flex-1 py-3 border border-gray-800 hover:bg-white/5 font-semibold text-xs text-gray-300 hover:text-white rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
            <button
              id="new-transfer-reset-btn"
              onClick={handleReset}
              class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 font-semibold text-xs text-white rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1"
            >
              <History className="h-4 w-4" />
              <span>New Transfer</span>
            </button>
          </div>

          <p class="text-[10px] text-gray-500 text-center mt-5 leading-normal">
            This cryptographic ledger output acts as an irrevocable guarantee of settlement inside SwiftTrust and partner clearing routes.
          </p>

        </div>
      )}

    </div>
  );
}
