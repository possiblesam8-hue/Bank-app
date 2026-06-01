export interface Transaction {
  id: string;
  type: 'transfer' | 'withdraw' | 'deposit' | 'bill' | 'receive';
  title: string;
  amount: number;
  date: string;
  time: string;
  category: string;
  status: 'Successful' | 'Pending' | 'Failed';
  reference: string;
  narration?: string;
  recipient?: string;
  bankName?: string;
  accountNumber?: string;
}

export interface VirtualCard {
  number: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  isActive: boolean;
  dailyLimit: number;
  spent: number;
}

export interface BankAccount {
  accountName: string;
  accountNumber: string;
  balance: number;
  kycLevel: 'Tier 1' | 'Tier 2' | 'Tier 3 (Fully Verified)';
  email: string;
  phoneNumber: string;
  passcode: string;
  biometricEnabled: boolean;
}

export interface BillPayment {
  id: string;
  category: 'Airtime' | 'Data' | 'Electricity' | 'TV Subscription' | 'Water' | 'Internet' | 'Education' | 'More';
  provider: string;
  amount: number;
  date: string;
  status: 'Successful' | 'Pending' | 'Failed';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
