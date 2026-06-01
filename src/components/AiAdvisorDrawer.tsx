import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, Bot, ShieldCheck, User, TrendingDown, HelpCircle, FileBarChart, Siren } from 'lucide-react';
import { Transaction, VirtualCard, ChatMessage } from '../types';

interface AiAdvisorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  transactions: Transaction[];
  card: VirtualCard;
  accountName: string;
}

export default function AiAdvisorDrawer({
  isOpen,
  onClose,
  balance,
  transactions,
  card,
  accountName
}: AiAdvisorDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${accountName.split(' ')[0]} 👋! I am your **TrustAI Elite Strategist**. I have synchronized your current balance of **₦${balance.toLocaleString()}** and analysed your recent transaction logs.\n\nHow can I optimize your financial security or budget allocations today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const prebakedPrompts = [
    { label: '📊 Analyze Budget Health', prompt: 'Please generate a comprehensive financial health and savings strategy report based on my current balance and subscription transactions.' },
    { label: '🛡️ Check Card Security', prompt: 'Check if my current daily virtual card limit of ₦' + card.dailyLimit.toLocaleString() + ' with spent amount ₦' + card.spent.toLocaleString() + ' is secure. Give safeguarding recommendations.' },
    { label: '💡 Subscription Optimizations', prompt: 'Optimize my subscriptions and bill expenses of Netflix and MTN Airtime to trigger cashback bonuses.' },
    { label: '🏦 Transfer Safeguards', prompt: 'What specific security protocols do you recommend to verify third party account transactions?' }
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build the server-side payload
      const controllerResponse = await fetch("/api/gemini/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
          context: {
            balance,
            transactions,
            card,
            accountName
          }
        })
      });

      const data = await controllerResponse.json();
      
      const assistantMsg: ChatMessage = {
        id: Date.now().toString() + '-ai',
        role: 'assistant',
        content: data.text || "Apologies, I encountered a connection issue. Let's try reviewing the transaction logs again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: Date.now().toString() + '-err',
        role: 'assistant',
        content: "I've logged a transient network delay. I suggest executing manual budget revisions, but you can retry typing your request to prompt me again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseMarkdown = (text: string) => {
    // Simple basic markdown parser for bullet lists and bold text
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let content = line;
      // Bold **
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#E2E8F0]">$1</strong>');
      // Lists
      if (line.trim().startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-sm text-gray-300 leading-relaxed mb-1" dangerouslySetInnerHTML={{ __html: content.replace('- ', '') }} />
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return <p key={idx} className="text-sm text-gray-300 leading-relaxed mb-1" dangerouslySetInnerHTML={{ __html: content }} />;
    });
  };

  if (!isOpen) return null;

  return (
    <div id="ai-drawer" class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300 flex justify-end">
      {/* Click outside backdrop close handler */}
      <div class="flex-1" onClick={onClose} />
      
      {/* Actual Drawer Body */}
      <div class="w-full max-w-lg bg-[#0C0F27] border-l border-gray-800 flex flex-col h-full shadow-[0_0_50px_rgba(37,99,235,0.15)] relative">
        
        {/* Connection status tag */}
        <div class="absolute top-0 inset-x-0 h-1 bg-[#2563EB]/40 animate-pulse" />

        {/* Header */}
        <div class="p-4 border-b border-gray-800 flex items-center justify-between bg-[#0E1231]">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
              <Sparkles className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p class="font-display font-bold text-white text-base flex items-center gap-1.5">
                TrustAI Financial Advisor
                <span class="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">SECURE</span>
              </p>
              <p class="text-[11px] text-gray-400">Powered by Gemini 3.5 LLM Service</p>
            </div>
          </div>
          <button
            id="close-ai-drawer-btn"
            onClick={onClose}
            class="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Message Log Canvas */}
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Wealth Header Card */}
          <div class="bg-[#12163A]/50 border border-gray-800 rounded-2xl p-4 mb-2">
            <p class="text-xs uppercase tracking-wider font-semibold text-blue-400 flex items-center gap-1.5">
              <FileBarChart className="h-3.5 w-3.5" /> Ledger Context Synchronized
            </p>
            <div class="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div class="bg-black/20 p-2.5 rounded-xl">
                <span class="text-gray-400 block mb-0.5">Liquid Ledger Balance</span>
                <strong class="text-[#F3F4F6] text-sm">₦{balance.toLocaleString()}</strong>
              </div>
              <div class="bg-black/20 p-2.5 rounded-xl">
                <span class="text-gray-400 block mb-0.5">Card Daily Budget</span>
                <strong class="text-[#F3F4F6] text-sm">₦{card.dailyLimit.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {messages.map((message) => (
            <div
              key={message.id}
              class={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar circle */}
              <div class={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-semibold ${
                message.role === 'user' 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
              }`}>
                {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div class="flex flex-col">
                <div class={`rounded-2xl p-3.5 text-xs ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-[#12163C] text-gray-200 border border-gray-800 rounded-tl-none'
                }`}>
                  {message.role === 'user' ? (
                    <p class="leading-relaxed">{message.content}</p>
                  ) : (
                    <div class="space-y-1">{parseMarkdown(message.content)}</div>
                  )}
                </div>
                <span class={`text-[10px] text-gray-500 mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div class="flex gap-3 max-w-[80%] mr-auto items-center">
              <div class="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <Bot className="h-4 w-4 animate-spin" />
              </div>
              <div class="bg-[#12163C] rounded-2xl p-3 text-xs text-gray-400 italic flex items-center gap-2 border border-gray-800">
                <div class="flex gap-1">
                  <span class="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span class="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span class="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>TrustAI Advisor is calculating budget insights...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input & Instant Pills */}
        <div class="p-4 bg-[#0E1231] border-t border-gray-800">
          
          {/* Quick Pillars */}
          <div class="mb-3">
            <p class="text-[10px] uppercase text-gray-400 font-semibold tracking-wide mb-1.5 flex items-center gap-1">
              <Bot className="h-3 w-3 text-blue-400" /> Secure Quick Queries
            </p>
            <div class="flex gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
              {prebakedPrompts.map((p, idx) => (
                <button
                  id={`promo-pill-${idx}`}
                  key={idx}
                  onClick={() => handleSendMessage(p.prompt)}
                  disabled={isLoading}
                  class="shrink-0 text-[11px] bg-white/[0.03] text-gray-300 border border-gray-800 rounded-lg px-2.5 py-1.5 hover:bg-blue-500/10 hover:border-blue-500/30 active:scale-95 transition-all text-left"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form
            id="chat-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            class="flex gap-2"
          >
            <input
              id="chat-input-text"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              placeholder="Ask Advisor about savings limits, risks, or security..."
              class="flex-1 bg-black/30 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              id="chat-submit-btn"
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              class="h-10 w-10 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center disabled:opacity-40 disabled:hover:bg-blue-600 transition-all duration-200"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
