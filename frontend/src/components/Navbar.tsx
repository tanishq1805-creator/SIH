'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { 
  ShieldAlert, 
  Map, 
  Search, 
  Dna, 
  FileWarning, 
  CheckSquare, 
  Link2, 
  Sliders, 
  Flame, 
  ChevronDown,
  Activity,
  Layers
} from 'lucide-react';
import { Mine } from '../lib/types';
import { fetchMines } from '../lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeMineId = searchParams.get('mine') || 'mine-jh-001';

  const [mines, setMines] = useState<Mine[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    fetchMines().then((data) => {
      if (data && data.length > 0) {
        setMines(data);
      }
    });

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST');
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleMineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMineId = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('mine', newMineId);
    router.push(`${pathname}?${params.toString()}`);
  };

  const navLinks = [
    { name: 'Dashboard', href: '/', icon: Activity },
    { name: 'Mine Explorer', href: '/explorer', icon: Map },
    { name: 'Contradiction Engine', href: '/investigations', icon: Search, badge: 'SIH Flagship' },
    { name: 'Compliance DNA', href: '/compliance-dna', icon: Dna },
    { name: 'Violations & Evidence', href: '/violations', icon: FileWarning },
    { name: 'Corrective Actions', href: '/corrective', icon: CheckSquare },
    { name: 'Audit Trail', href: '/audit', icon: Link2, badge: 'SHA-256' },
    { name: 'Data Engine', href: '/data-engine', icon: Sliders },
  ];

  const selectedMine = mines.find((m) => m.id === activeMineId) || mines[0];

  return (
    <header className="sticky top-0 z-50 bg-[#0b1120]/95 backdrop-blur border-b border-slate-800 shadow-xl">
      {/* Top Banner */}
      <div className="px-4 py-2 border-b border-slate-800/60 bg-gradient-to-r from-amber-950/30 via-slate-900 to-cyan-950/30 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-300">MINISTRY OF COAL &bull; DGMS COMPLIANCE PORTAL</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-amber-400 font-mono">CMR 2017 REGULATORY ENGINE ACTIVE</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-500">System Time:</span>
            <span className="font-mono text-cyan-400 font-medium">{currentTime || 'LIVE'}</span>
          </div>
          <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-2.5 py-0.5 rounded-full font-mono font-medium flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span>LEDGER VERIFIED (SHA-256)</span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  CoalSentinel
                </span>
                <span className="text-[10px] uppercase font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1.5 py-0.5 rounded">
                  SIH 2026
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">National Mining Safety & Compliance Intelligence</p>
            </div>
          </Link>
        </div>

        {/* Global Mine Selector Dropdown */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 shadow-inner">
          <Layers className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="text-left">
            <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Selected Coal Mine</label>
            <select
              value={activeMineId}
              onChange={handleMineChange}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-2"
            >
              {mines.map((mine) => (
                <option key={mine.id} value={mine.id} className="bg-slate-900 text-white">
                  {mine.name} ({mine.type} &bull; {mine.state})
                </option>
              ))}
            </select>
          </div>
          {selectedMine?.status === 'Critical_Watch' ? (
            <span className="hidden md:inline-flex items-center gap-1 bg-red-950/80 text-red-400 border border-red-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
              CRITICAL WATCH
            </span>
          ) : (
            <span className="hidden md:inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              NORMAL
            </span>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            const linkHref = `${link.href}?mine=${activeMineId}`;

            return (
              <Link
                key={link.name}
                href={linkHref}
                className={`relative px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{link.name}</span>
                {link.badge && (
                  <span className={`text-[9px] px-1 rounded uppercase font-mono font-bold ${
                    link.badge === 'SIH Flagship'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile/Tablet Secondary Nav Scroll */}
      <div className="xl:hidden px-3 py-2 border-t border-slate-800/80 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          const linkHref = `${link.href}?mine=${activeMineId}`;
          return (
            <Link
              key={link.name}
              href={linkHref}
              className={`whitespace-nowrap px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                isActive
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
