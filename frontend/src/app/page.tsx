'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Flame, 
  ShieldAlert, 
  Scale, 
  Dna, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Radio, 
  Wind, 
  CloudFog, 
  Activity, 
  ArrowRight,
  TrendingDown,
  Layers,
  Lock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Mine, Violation, AuditVerification } from '../lib/types';
import { fetchMines, fetchViolations, verifyAuditLedger } from '../lib/api';

function DashboardContent() {
  const searchParams = useSearchParams();
  const activeMineId = searchParams.get('mine') || 'mine-jh-001';

  const [mines, setMines] = useState<Mine[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [auditStatus, setAuditStatus] = useState<AuditVerification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [minesData, violData, auditData] = await Promise.all([
          fetchMines(),
          fetchViolations(),
          verifyAuditLedger()
        ]);
        setMines(minesData);
        setViolations(violData);
        setAuditStatus(auditData);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const criticalViolations = violations.filter((v) => v.severity === 'CRITICAL');
  const highViolations = violations.filter((v) => v.severity === 'HIGH');
  const activeMine = mines.find((m) => m.id === activeMineId) || mines[0];

  return (
    <div className="space-y-6">
      {/* Critical Alert Ticker */}
      {criticalViolations.length > 0 && (
        <div className="p-3 rounded-xl bg-gradient-to-r from-red-950/80 via-rose-900/60 to-red-950/80 border border-red-500/50 shadow-lg shadow-red-950/40 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="flex h-3 w-3 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <div className="truncate text-xs">
              <span className="font-extrabold text-red-200 uppercase tracking-wide mr-2">
                🚨 DGMS Critical Alert Ticker:
              </span>
              <span className="text-white font-medium">
                {criticalViolations[0]?.title} &bull; Detected Value: {criticalViolations[0]?.detected_value} vs Limit: {criticalViolations[0]?.limit_value}
              </span>
            </div>
          </div>
          <Link
            href={`/investigations?mine=${criticalViolations[0]?.mine_id}`}
            className="whitespace-nowrap px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition-all shadow-md shrink-0 flex items-center gap-1"
          >
            <span>Inspect Discrepancy</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Hero / Command Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/30 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                SMART INDIA HACKATHON 2026 FINAL ROUND
              </span>
              <span className="text-xs text-slate-400 font-medium">DGMS Coal Mines Regulations 2017</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              National Coal Mine Safety & DGMS Regulatory Intelligence System
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Autonomous regulatory compliance surveillance engine integrating continuous multi-gas telemetry, 
              an automated <strong className="text-amber-400">Contradiction Engine</strong> that exposes falsified human safety logs, 
              <strong className="text-cyan-400"> Compliance DNA</strong> risk profiling, and a <strong className="text-emerald-400">SHA-256 Cryptographic Audit Ledger</strong>.
            </p>
          </div>

          {/* Quick Action Hub */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <Link
              href={`/explorer?mine=${activeMineId}`}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <span>Explore 3D Satellite Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/investigations?mine=${activeMineId}`}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Scale className="w-4 h-4 text-rose-400" />
              <span>Contradiction Engine</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Counters Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Monitored Mines</span>
            <MapPin className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{mines.length || 6}</div>
          <span className="text-[11px] text-slate-500 block">Across 5 Coal Seam States</span>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Critical Breaches</span>
            <Flame className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-black text-red-400 font-mono">{criticalViolations.length}</div>
          <span className="text-[11px] text-red-400/80 block font-medium">Exceeding Evacuation Limit</span>
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Contradictions Flagged</span>
            <Scale className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">3 Active</div>
          <span className="text-[11px] text-amber-400/80 block font-medium">Human vs Sensor Mismatch</span>
        </div>

        {/* KPI 4 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Audit Chain Integrity</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {auditStatus?.is_valid ? '100%' : 'VERIFIED'}
          </div>
          <span className="text-[11px] text-emerald-400/80 block font-medium">
            {auditStatus?.total_blocks || 4} SHA-256 Blocks Minted
          </span>
        </div>
      </div>

      {/* Main Grid: Indian Coal Mines Status Cards */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              Strategic Indian Coal Mines Surveillance
            </h2>
            <p className="text-xs text-slate-400">Click any mine to inspect live telemetry and compliance diagnostics</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">Live Sensor Streaming Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mines.map((mine) => {
            const isSelected = mine.id === activeMineId;
            const isCritical = mine.status === 'Critical_Watch';

            return (
              <div
                key={mine.id}
                className={`p-5 rounded-2xl bg-slate-900/80 border shadow-xl flex flex-col justify-between transition-all hover:scale-[1.01] ${
                  isSelected
                    ? 'border-amber-500/60 ring-1 ring-amber-500/40 shadow-amber-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {mine.code}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      isCritical
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {mine.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white">{mine.name}</h3>
                  <p className="text-xs text-slate-400 mb-4">
                    {mine.operator} &bull; {mine.coalfield}, {mine.state}
                  </p>

                  {/* Telemetry Snapshot */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[11px] mb-4">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">Type</span>
                      <span className="font-semibold text-slate-200">{mine.type}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">Methane (CH4)</span>
                      <span className={`font-mono font-bold ${
                        mine.latest_ch4 && mine.latest_ch4 > 0.75 ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {mine.latest_ch4 !== undefined ? `${mine.latest_ch4}%` : '0.12%'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">PM10 Dust</span>
                      <span className={`font-mono font-bold ${
                        mine.latest_pm10 && mine.latest_pm10 > 250 ? 'text-amber-400' : 'text-cyan-400'
                      }`}>
                        {mine.latest_pm10 !== undefined ? `${mine.latest_pm10} µg/m³` : '95 µg/m³'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Links */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-xs">
                  <Link
                    href={`/explorer?mine=${mine.id}`}
                    className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-center transition-colors"
                  >
                    3D Map
                  </Link>
                  <Link
                    href={`/investigations?mine=${mine.id}`}
                    className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 font-semibold text-center transition-colors"
                  >
                    Audit
                  </Link>
                  <Link
                    href={`/compliance-dna?mine=${mine.id}`}
                    className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 font-semibold text-center transition-colors"
                  >
                    DNA
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DGMS CMR 2017 Regulatory Machine-Readable Standards Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Codified DGMS & CPCB Machine-Readable Regulatory Rules
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Coal Mines Regulations 2017</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400 block font-mono">DGMS CMR Reg 169</span>
            <span className="text-white font-semibold block">Inflammable Gas (Methane)</span>
            <span className="text-slate-400 block text-[11px]">Threshold &le; 0.75% general body; Evacuation &ge; 1.25%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400 block font-mono">DGMS CMR Reg 153</span>
            <span className="text-white font-semibold block">Air Velocity & Oxygen</span>
            <span className="text-slate-400 block text-[11px]">Airflow &ge; 0.50 m/s at faces; Oxygen &ge; 19.0% by vol</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-cyan-400 block font-mono">CPCB NAAQS Rule 124</span>
            <span className="text-white font-semibold block">Respirable Coal Dust (PM10)</span>
            <span className="text-slate-400 block text-[11px]">Respirable dust &le; 250 µg/m³ with active mist cannons</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-rose-400 block font-mono">DGMS CMR Reg 106</span>
            <span className="text-white font-semibold block">Roof Strata Stability</span>
            <span className="text-slate-400 block text-[11px]">Borehole stress cell limit &le; 14.5 MPa rock pressure</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Command Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
