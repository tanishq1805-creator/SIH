'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Violation } from '../../lib/types';
import { fetchViolations } from '../../lib/api';
import { 
  FileWarning, 
  Flame, 
  ShieldAlert, 
  Search, 
  Filter, 
  Lock, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

function ViolationsContent() {
  const searchParams = useSearchParams();
  const activeMineId = searchParams.get('mine');

  const [violations, setViolations] = useState<Violation[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchViolations(activeMineId || undefined)
      .then((data) => {
        setViolations(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeMineId]);

  const filteredViolations = violations.filter((v) => {
    const matchesSeverity = filterSeverity === 'ALL' || v.severity === filterSeverity;
    const matchesQuery = 
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.mine_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.reg_code?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-red-950/20 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3 text-red-400" />
              REGULATORY BREACH TRACKER
            </span>
            <span className="text-xs text-slate-400">&bull; DGMS CMR 2017 & CPCB</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Violations & Cryptographic Evidence Room
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time feed of detected statutory breaches, threshold exceedances, and tamper-evident evidence packets.
          </p>
        </div>

        {/* Severity Stats Pill */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
          <span className="px-2.5 py-1 rounded bg-red-950 text-red-400 font-bold font-mono">
            {violations.filter((v) => v.severity === 'CRITICAL').length} Critical
          </span>
          <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-400 font-bold font-mono">
            {violations.filter((v) => v.severity === 'HIGH').length} High
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by mine, regulation, or keyword..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs">
          <span className="text-slate-400 text-[11px] font-bold uppercase mr-1">Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterSeverity === sev
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Violations List */}
      <div className="space-y-4">
        {filteredViolations.map((v) => {
          const isCritical = v.severity === 'CRITICAL';
          const isHigh = v.severity === 'HIGH';

          return (
            <div
              key={v.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-colors"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    isCritical
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                      : isHigh
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  }`}>
                    {v.severity}
                  </span>
                  <h3 className="font-bold text-base text-white">{v.title}</h3>
                  <span className="text-xs font-mono text-cyan-400">[{v.reg_code}]</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{new Date(v.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* Body */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {v.description}
              </p>

              {/* Data & Regulatory Threshold */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Affected Mine</span>
                  <span className="font-bold text-white">{v.mine_name || 'Jharia Pit #4'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Statutory Threshold</span>
                  <span className="font-mono font-bold text-slate-300">{v.limit_value} {v.reg_unit || ''}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Detected Sensor Reading</span>
                  <span className={`font-mono font-black ${isCritical ? 'text-red-400' : 'text-amber-400'}`}>
                    {v.detected_value} {v.reg_unit || ''}
                  </span>
                </div>
              </div>

              {/* Cryptographic Sealed Badge */}
              <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Sealed in SHA-256 Ledger Block
                </span>
                <span className="text-slate-500 font-mono">Status: {v.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ViolationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Violations...</div>}>
      <ViolationsContent />
    </Suspense>
  );
}
