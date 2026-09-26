'use client';

import React from 'react';
import { ContradictionResult } from '../lib/types';
import { 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Radio, 
  Scale, 
  ShieldAlert, 
  TrendingDown, 
  UserCheck, 
  Cpu,
  ArrowRight
} from 'lucide-react';

interface ContradictionDiffProps {
  data: ContradictionResult | null;
  onRefresh?: () => void;
}

export default function ContradictionDiff({ data, onRefresh }: ContradictionDiffProps) {
  if (!data) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900/60 rounded-2xl border border-slate-800">
        Loading Contradiction Engine analysis...
      </div>
    );
  }

  const { trust_index, status, inspector_name, inspection_date, declared_summary, contradictions } = data;

  const isCritical = trust_index < 50;
  const isWarning = trust_index >= 50 && trust_index < 80;

  return (
    <div className="space-y-6">
      {/* Top Banner: Trust Score & Status */}
      <div className={`p-6 rounded-2xl border backdrop-blur-md shadow-2xl ${
        isCritical
          ? 'bg-red-950/30 border-red-500/40'
          : isWarning
          ? 'bg-amber-950/30 border-amber-500/40'
          : 'bg-emerald-950/30 border-emerald-500/40'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                isCritical
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : isWarning
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {status.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-slate-400">&bull; Last Verified: Just Now</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Scale className="w-6 h-6 text-amber-400" />
              Contradiction & Falsification Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Cross-examines official shift inspection logs signed by mine personnel against continuous gas telemetry, ultrasonic anemometers, and CPCB particulate monitoring stations.
            </p>
          </div>

          {/* Trust Meter Gauge */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex items-center gap-5 min-w-[220px]">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={isCritical ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-emerald-500'}
                  strokeDasharray={`${trust_index}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-black text-lg text-white font-mono">{trust_index}%</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Human-Sensor</span>
              <span className="font-extrabold text-sm text-white">Trust Index</span>
              <span className="block text-[10px] text-slate-400">
                {contradictions.length} discrepancy flag{contradictions.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Discrepancy Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Detected Contradiction Cases ({contradictions.length})
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Shift Inspector: <span className="text-white font-semibold">{inspector_name}</span> ({inspection_date})
          </span>
        </div>

        {contradictions.length === 0 ? (
          <div className="p-8 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-white text-sm">Perfect Human-Sensor Alignment</h4>
            <p className="text-xs text-slate-300">
              Human supervisor logs are 100% consistent with continuous telemetry data. Zero falsifications detected.
            </p>
          </div>
        ) : (
          contradictions.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-colors"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    item.severity === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {item.severity} DISCREPANCY
                  </span>
                  <h4 className="font-bold text-sm text-white">{item.parameter}</h4>
                  <span className="text-xs text-slate-500 font-mono">[{item.category}]</span>
                </div>
                <div className="text-xs font-mono font-bold text-red-400 bg-red-950/60 border border-red-500/30 px-2.5 py-1 rounded-lg">
                  Delta: +{item.discrepancy_delta} {item.unit}
                </div>
              </div>

              {/* Side-by-side Visual Diff */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Human Report */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
                    <span className="flex items-center gap-1.5 font-bold text-amber-300">
                      <FileText className="w-3.5 h-3.5" />
                      Human Inspection Report (Paper/Portal)
                    </span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Declared</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-2xl font-black font-mono text-white">
                      {item.inspector_declared} {item.unit}
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-1">
                      Signed by: <span className="text-slate-300 font-medium">{item.inspector_name}</span>
                    </span>
                  </div>
                </div>

                {/* Right: Telemetry Truth */}
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs text-red-400 border-b border-red-500/20 pb-2">
                    <span className="flex items-center gap-1.5 font-bold text-red-300">
                      <Radio className="w-3.5 h-3.5 animate-pulse text-red-400" />
                      Continuous Mine Telemetry (Ground Truth)
                    </span>
                    <span className="text-[10px] bg-red-500/20 px-1.5 py-0.5 rounded text-red-300 font-bold font-mono">
                      ACTUAL
                    </span>
                  </div>
                  <div className="pt-1">
                    <span className="text-2xl font-black font-mono text-red-400">
                      {item.sensor_actual} {item.unit}
                    </span>
                    <span className="block text-[11px] text-red-300/80 mt-1">
                      Calibrated Optical/Ultrasonic Sensor Telemetry Stream
                    </span>
                  </div>
                </div>
              </div>

              {/* Finding & Enforcement Action */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-2">
                <div className="text-slate-300 leading-relaxed">
                  <span className="font-bold text-amber-400">Contradiction Analysis: </span>
                  {item.finding}
                </div>
                <div className="text-slate-400 flex items-start gap-1.5 pt-1 border-t border-slate-800/60">
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-cyan-300">Automated Regulatory Remedy: </strong>
                    {item.recommendation}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
