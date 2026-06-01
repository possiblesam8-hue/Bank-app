import React, { useState, useEffect } from 'react';
import { Home as HomeIcon, CreditCard, Send, Smartphone, User, Sparkles, LogOut, Check, Lock, ShieldCheck, KeyRound } from 'lucide-react';

// Import our secure modular sub-panels
import BiometricLockScreen from './components/BiometricLockScreen';
import DashboardHome from './components/DashboardHome';
import CardsView from './components/CardsView';
import TransferView from './components/TransferView';
import PaymentsView from './components/PaymentsView';
import ProfileView from './components/ProfileView';
import WithdrawalView from './components/WithdrawalView';
import AiAdvisorDrawer from './components/AiAdvisorDrawer';
import FlashTransferView from './components/FlashTransferView';

// Shared type structures
import { Transaction, VirtualCard, BankAccount } from './types';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'cards' | 'transfer' | 'payments' | 'profile' | 'withdraw' | 'flash'>('home');
  const [advisorDrawerOpen, setAdvisorDrawerOpen] = useState(false);

  // Core financial ledger state
  const [balance, setBalance] = useState<number>(850250.50);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [card, setCard] = useState<VirtualCard>({
    number: '4567890123454567',
    cardholderName: 'JOHN ANDERSON',
    expiryDate: '12/28',
    cvv: '532',
    isActive: true,
    dailyLimit: 200000,
    spent: 50000
  });
  const [account, setAccount] = useState<BankAccount>({
    accountName: 'John Anderson',
    accountNumber: '2089457161',
    balance: 850250.50,
    kycLevel: 'Tier 2',
    email: 'johnanderson@gmail.com',
    phoneNumber: '07038164832',
    passcode: '1234',
    biometricEnabled: true
  });

  // Load state from secure localStorage cache at boot time
  useEffect(() => {
    const cachedBalance = localStorage.getItem('swifttrust_ledger_balance');
    const cachedTransactions = localStorage.getItem('swifttrust_ledger_transactions');
    const cachedCard = localStorage.getItem('swifttrust_ledger_card');
    const cachedAccount = localStorage.getItem('swifttrust_ledger_account');

    if (cachedBalance) {
      setBalance(parseFloat(cachedBalance));
    }
    
    if (cachedCard) {
      try { setCard(JSON.parse(cachedCard)); } catch (e) { console.error(e); }
    }

    if (cachedAccount) {
      try {
        const acc = JSON.parse(cachedAccount);
        if (acc.accountNumber === '0123456789') {
          acc.accountNumber = '2089457161';
          localStorage.setItem('swifttrust_ledger_account', JSON.stringify(acc));
        }
        setAccount(acc);
      } catch (e) { console.error(e); }
    }

    if (cachedTransactions) {
      try {
        setTransactions(JSON.parse(cachedTransactions));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Mockup seed database matching John's screenshots
      const seedTx: Transaction[] = [
        {
          id: 'tx1',
          type: 'transfer',
          title: 'Transfer to Michael',
          amount: 50000,
          date: 'Today',
          time: '10:30 AM',
          category: 'Transfers',
          status: 'Successful',
          reference: 'TXR' + Math.floor(100000 + Math.random() * 900000)
        },
        {
          id: 'tx2',
          type: 'bill',
          title: 'Airtime Purchase',
          amount: 1000,
          date: 'Today',
          time: '09:15 AM',
          category: 'Utilities',
          status: 'Successful',
          reference: 'TXR' + Math.floor(100000 + Math.random() * 900000)
        },
        {
          id: 'tx3',
          type: 'receive',
          title: 'Payment from Sarah',
          amount: 20000,
          date: 'Yesterday',
          time: '08:45 PM',
          category: 'Deposits',
          status: 'Successful',
          reference: 'TXR' + Math.floor(100000 + Math.random() * 900000)
        },
        {
          id: 'tx4',
          type: 'bill',
          title: 'Electricity Bill',
          amount: 15000,
          date: 'Yesterday',
          time: '06:30 PM',
          category: 'Utilities',
          status: 'Successful',
          reference: 'TXR' + Math.floor(100000 + Math.random() * 900000)
        }
      ];
      setTransactions(seedTx);
      localStorage.setItem('swifttrust_ledger_transactions', JSON.stringify(seedTx));
    }
  }, []);

  // Update storage whenever balance, card or transactions mutate
  const updateBalance = (newBal: number) => {
    setBalance(newBal);
    localStorage.setItem('swifttrust_ledger_balance', newBal.toString());
  };

  const updateCardState = (newCard: VirtualCard) => {
    setCard(newCard);
    localStorage.setItem('swifttrust_ledger_card', JSON.stringify(newCard));
  };

  const updateAccountState = (newAcc: BankAccount) => {
    setAccount(newAcc);
    localStorage.setItem('swifttrust_ledger_account', JSON.stringify(newAcc));
  };

  // Execute a secure transfer transaction
  const executeTransfer = (
    amt: number, 
    fee: number, 
    title: string, 
    recipient: string, 
    bank: string, 
    route: string, 
    narrations: string
  ) => {
    const totalDeduction = amt + fee;
    updateBalance(balance - totalDeduction);

    const newTx: Transaction = {
      id: Date.now().toString(),
      type: 'transfer',
      title,
      amount: amt,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'Transfers',
      status: 'Successful',
      reference: 'TXR' + Math.floor(100000 + Math.random() * 900000),
      narration: narrations,
      recipient,
      bankName: bank
    };

    const nextTransactions = [newTx, ...transactions];
    setTransactions(nextTransactions);
    localStorage.setItem('swifttrust_ledger_transactions', JSON.stringify(nextTransactions));
  };

  // Execute utility payments with integrated cashback reward payouts
  const executeBillPayment = (cat: string, provider: string, amt: number) => {
    // Deduct bill amount
    const nextBalance = balance - amt;
    
    // Settle 1.5% cashback promotion instantly
    const commissionRefund = amt * 0.015;
    const finalBalance = nextBalance + commissionRefund;
    updateBalance(finalBalance);

    const billTx: Transaction = {
      id: Date.now().toString() + '-bill',
      type: 'bill',
      title: `${provider}`,
      amount: amt,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'Utilities',
      status: 'Successful',
      reference: 'TXR-BILL-' + Math.floor(100000 + Math.random() * 900000)
    };

    const cashbackTx: Transaction = {
      id: Date.now().toString() + '-claim',
      type: 'receive',
      title: `MTN Utilities Cashback Claim`,
      amount: commissionRefund,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'Promotions',
      status: 'Successful',
      reference: 'TXR-CASH-' + Math.floor(100000 + Math.random() * 900000)
    };

    const nextTransactions = [billTx, cashbackTx, ...transactions];
    setTransactions(nextTransactions);
    localStorage.setItem('swifttrust_ledger_transactions', JSON.stringify(nextTransactions));

    // Update Virtual Card consumption levels if user opted to pay bills using the virtual card
    const nextSpent = card.spent + amt;
    updateCardState({
      ...card,
      spent: nextSpent
    });
  };

  // Execute cardless ATM withdrawal token allocations
  const executeWithdrawal = (amt: number) => {
    // Lock balance
    updateBalance(balance - amt);

    const cashTx: Transaction = {
      id: Date.now().toString() + '-cash',
      type: 'withdraw',
      title: 'Cardless ATM CashOut',
      amount: amt,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'Withdrawals',
      status: 'Successful',
      reference: 'TXR-ATM-' + Math.floor(100000 + Math.random() * 900000)
    };

    const nextTransactions = [cashTx, ...transactions];
    setTransactions(nextTransactions);
    localStorage.setItem('swifttrust_ledger_transactions', JSON.stringify(nextTransactions));
  };


  const handleCardActiveToggle = () => {
    updateCardState({
      ...card,
      isActive: !card.isActive
    });
  };

  const handleUpdateLimit = (limit: number) => {
    updateCardState({
      ...card,
      dailyLimit: limit
    });
  };

  const handleBiometricToggle = (enabled: boolean) => {
    updateAccountState({
      ...account,
      biometricEnabled: enabled
    });
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    setActiveTab('home');
    setAdvisorDrawerOpen(false);
  };

  return (
    <div id="main-banking-container" class="min-h-screen bg-[#080A16] text-[#F3F4F6] selection:bg-blue-500/30 selection:text-white">
      
      {!isUnlocked ? (
        /* Lock module prevents loading dashboard unless passcode matches */
        <BiometricLockScreen 
          onUnlock={() => setIsUnlocked(true)} 
          correctPasscode={account.passcode} 
        />
      ) : (
        /* Dynamic full-width layout with neobanking interface context cards */
        <div class="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-8 pb-32">
          
          {/* Quick AI Floating Widget for quick accessibility */}
          <div class="fixed bottom-24 right-4 md:right-8 z-30">
            <button
              id="ai-quick-floating-widget"
              onClick={() => setAdvisorDrawerOpen(true)}
              class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_30px_rgba(37,99,235,0.4)] active:scale-95 transition-all duration-300 border border-blue-500/20 group relative"
              title="Access Advisor Intelligence"
            >
              <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
              <span class="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-[#080A16] animate-none" />
              
              {/* Tooltip */}
              <span class="absolute right-16 top-3 text-[11px] font-bold text-white uppercase bg-[#0C102C] border border-gray-800 px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                TrustAI Advisor
              </span>
            </button>
          </div>

          {/* Large display mockup layout */}
          <main id="app-viewport" class="w-full max-w-xl mx-auto rounded-3xl border border-gray-800 bg-[#0C0E28]/50 backdrop-blur-xl p-5 md:p-6 shadow-[0_12px_45px_rgba(0,0,0,0.5)]">
            
            {/* View Switching */}
            {activeTab === 'home' && (
              <DashboardHome
                balance={balance}
                accountNumber={account.accountNumber}
                accountName={account.accountName}
                transactions={transactions}
                onNavigate={(tab) => {
                  if (tab === 'withdraw') {
                    setActiveTab('withdraw');
                  } else if (tab === 'flash') {
                    setActiveTab('flash');
                  } else {
                    setActiveTab(tab);
                  }
                }}
                onOpenAdvisor={() => setAdvisorDrawerOpen(true)}
              />
            )}

            {activeTab === 'flash' && (
              <FlashTransferView
                balance={balance}
                onExecuteTransfer={executeTransfer}
                onBack={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'cards' && (
              <CardsView
                card={card}
                balance={balance}
                transactions={transactions}
                onToggleCardActive={handleCardActiveToggle}
                onUpdateDailyLimit={handleUpdateLimit}
              />
            )}

            {activeTab === 'transfer' && (
              <TransferView
                balance={balance}
                transactions={transactions}
                onExecuteTransfer={executeTransfer}
                onBack={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'payments' && (
              <PaymentsView
                balance={balance}
                onExecuteBillPayment={executeBillPayment}
                onBack={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'withdraw' && (
              <WithdrawalView
                balance={balance}
                onExecuteWithdrawal={executeWithdrawal}
                onBack={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                account={account}
                onUpdateBiometrics={handleBiometricToggle}
                onLogout={handleLogout}
              />
            )}

          </main>

          {/* Floating Sticky Bottom Navigation Bar precisely styled to match the mock-up images */}
          <nav id="sticky-tabs-navigation" class="fixed bottom-0 inset-x-0 bg-[#0C0E28]/90 border-t border-gray-800/80 backdrop-blur-xl py-3 px-4 z-30">
            <div class="max-w-md mx-auto flex justify-between items-center text-gray-400">
              
              <button
                id="link-home"
                onClick={() => setActiveTab('home')}
                class={`flex flex-col items-center gap-1 cursor-pointer transition-all ${activeTab === 'home' ? 'text-blue-500 bg-blue-500/5 px-3 py-1.5 rounded-xl' : 'hover:text-white'}`}
              >
                <HomeIcon className="h-5.5 w-5.5" />
                <span class="text-[9px] font-bold">Home</span>
              </button>

              <button
                id="link-cards"
                onClick={() => setActiveTab('cards')}
                class={`flex flex-col items-center gap-1 cursor-pointer transition-all ${activeTab === 'cards' ? 'text-blue-500 bg-blue-500/5 px-3 py-1.5 rounded-xl' : 'hover:text-white'}`}
              >
                <CreditCard className="h-5.5 w-5.5" />
                <span class="text-[9px] font-bold">Cards</span>
              </button>

              <button
                id="link-transfer"
                onClick={() => setActiveTab('transfer')}
                class={`flex flex-col items-center gap-1 cursor-pointer transition-all ${activeTab === 'transfer' ? 'text-blue-500 bg-blue-500/5 px-3 py-1.5 rounded-xl' : 'hover:text-white'}`}
              >
                <Send className="h-5.5 w-5.5" />
                <span class="text-[9px] font-bold">Transfer</span>
              </button>

              <button
                id="link-payments"
                onClick={() => setActiveTab('payments')}
                class={`flex flex-col items-center gap-1 cursor-pointer transition-all ${activeTab === 'payments' ? 'text-blue-500 bg-blue-500/5 px-3 py-1.5 rounded-xl' : 'hover:text-white'}`}
              >
                <Smartphone className="h-5.5 w-5.5" />
                <span class="text-[9px] font-bold">Payments</span>
              </button>

              <button
                id="link-profile"
                onClick={() => setActiveTab('profile')}
                class={`flex flex-col items-center gap-1 cursor-pointer transition-all ${activeTab === 'profile' ? 'text-blue-500 bg-blue-500/5 px-3 py-1.5 rounded-xl' : 'hover:text-white'}`}
              >
                <User className="h-5.5 w-5.5" />
                <span class="text-[9px] font-bold">Profile</span>
              </button>

            </div>
          </nav>

          {/* AI Advisor Side Panel Drawer overlay element */}
          <AiAdvisorDrawer
            isOpen={advisorDrawerOpen}
            onClose={() => setAdvisorDrawerOpen(false)}
            balance={balance}
            transactions={transactions}
            card={card}
            accountName={account.accountName}
          />

        </div>
      )}

    </div>
  );
}
