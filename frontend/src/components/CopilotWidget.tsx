'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  BookOpen, 
  Cpu, 
  HelpCircle, 
  Minimize2, 
  Maximize2,
  CheckCircle,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { sendCopilotChat, fetchMineDetails } from '../lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  mode: 'eli5' | 'expert';
  timestamp: string;
}

export default function CopilotWidget() {
  const searchParams = useSearchParams();
  const activeMineId = searchParams.get('mine') || 'mine-jh-001';

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'eli5' | 'expert'>('eli5'); // Default to ELI5 as requested!
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mineName, setMineName] = useState('Active Mine');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `👋 **Welcome to CoalSentinel AI Copilot!**

I am your personal mining guide and SIH 2026 intelligence assistant. Whether you are a mining veteran or learning about coal mines for the very first time, I'm here to explain everything in plain, simple language!

**Try asking me anything or tap one of the suggested topics below:**`,
      mode: 'eli5',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMineDetails(activeMineId).then((res) => {
      if (res && res.mine) {
        setMineName(res.mine.name);
      }
    });
  }, [activeMineId]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      role: 'user',
      content: textToSend,
      mode: mode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await sendCopilotChat(textToSend, mode, activeMineId);
      const botMsg: Message = {
        role: 'assistant',
        content: res.answer,
        mode: mode,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ I had trouble connecting to the AI brain. Please ensure the backend is running.',
          mode: mode,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    { label: '⛏️ How does a coal mine work?', q: 'Explain simply how a coal mine works and how coal is extracted safely.' },
    { label: '🚨 What did Contradiction Engine find?', q: 'What discrepancies between human reports and telemetry stations were detected at this mine?' },
    { label: '💡 Explain Opencast vs Underground', q: 'What is the simple difference between Opencast and Underground coal mining?' },
    { label: '💨 Why is Methane so dangerous?', q: 'Why is Methane gas (CH4) so dangerous in coal mines and how does ventilation save lives?' },
    { label: '🔒 How does SHA-256 stop fraud?', q: 'How does the SHA-256 cryptographic audit chain prevent anyone from tampering with safety records?' }
  ];

  return (
    <>
      {/* Persistent Floating Copilot Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <div 
            onClick={() => setIsOpen(true)}
            className="cursor-pointer bg-slate-900/90 border border-amber-500/40 text-slate-200 text-xs px-3.5 py-2 rounded-full shadow-2xl backdrop-blur flex items-center gap-2 hover:border-amber-400 transition-all hover:scale-105"
          >
            <Lightbulb className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="font-semibold text-white">New to coal mining?</span>
            <span className="text-amber-400 font-bold">Ask AI Copilot &rarr;</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open AI Copilot"
          className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all group"
        >
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-slate-950"></span>
          </span>
          <Bot className="w-8 h-8 text-slate-950 group-hover:rotate-6 transition-transform" />
        </button>
      </div>

      {/* Floating Copilot Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[94vw] sm:w-[460px] h-[640px] max-h-[85vh] bg-[#0c1322] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/40 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white">CoalSentinel AI Copilot</h3>
                  <span className="text-[9px] bg-cyan-500/20 text-cyan-300 font-mono font-bold px-1.5 py-0.2 rounded border border-cyan-500/30">
                    Gemini Flash
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-[210px]">
                  Context: <span className="text-amber-400 font-medium">{mineName}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Banner (ELI5 vs Expert) */}
          <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Explanation Mode:
            </span>
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setMode('eli5')}
                className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all ${
                  mode === 'eli5'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Simple (ELI5)</span>
              </button>
              <button
                onClick={() => setMode('expert')}
                className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all ${
                  mode === 'expert'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>SIH Expert</span>
              </button>
            </div>
          </div>

          {/* Quick Context Tip */}
          <div className="px-4 py-1.5 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>
              {mode === 'eli5'
                ? '👶 Simple Mode: Explaining coal mining concepts simply for non-technical users & judges!'
                : '⚡ Expert Mode: Authoritative DGMS Coal Mines Regulations 2017 & engineering standards.'}
            </span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1 mb-1 text-[10px] text-slate-500">
                  <span>{m.role === 'user' ? 'You' : 'CoalSentinel Copilot'}</span>
                  <span>&bull;</span>
                  <span>{m.timestamp}</span>
                </div>
                <div
                  className={`p-3.5 rounded-2xl max-w-[92%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-sm shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2">
                    {m.content}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-2xl w-fit text-slate-400 text-xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span>Generating explanation via Gemini...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sample Prompts Tray */}
          <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800 overflow-x-auto flex gap-1.5 scrollbar-none">
            {sampleQuestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s.q)}
                disabled={loading}
                className="whitespace-nowrap bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={mode === 'eli5' ? 'Ask simply how this mine works...' : 'Query DGMS regulations, sensor anomalies...'}
              disabled={loading}
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 flex items-center justify-center transition-all shrink-0 font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
