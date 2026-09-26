'use client';

import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { ComplianceDna } from '../lib/types';
import { Dna, ShieldCheck, AlertOctagon, TrendingUp, Calendar, Zap } from 'lucide-react';

interface DnaRadarChartProps {
  dna: ComplianceDna | null;
}

export default function DnaRadarChart({ dna }: DnaRadarChartProps) {
  if (!dna) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900/60 rounded-2xl border border-slate-800">
        Loading Compliance DNA Profile...
      </div>
    );
  }

  const { composite_score, risk_grade, color, radar_metrics, recurring_patterns, history_weeks, mine_name } = dna;

  const getHeatmapColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-emerald-500/80 hover:bg-emerald-400';
      case 1: return 'bg-emerald-600/40 hover:bg-emerald-500';
      case 2: return 'bg-amber-500/80 hover:bg-amber-400';
      case 3: return 'bg-red-500/90 hover:bg-red-400 animate-pulse';
      default: return 'bg-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Composite DNA Score */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs uppercase font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
              MINE GENOME RATING
            </span>
            <span className="text-xs text-slate-400">&bull; {mine_name}</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Dna className="w-6 h-6 text-amber-400" />
            Compliance DNA Intelligence Profile
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mt-1">
            Synthesizes multi-stream telemetry, historical violation recurrence, and inspection authenticity into a unified 5-axis safety genome.
          </p>
        </div>

        {/* Genome Score Badge */}
        <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 px-5 py-3.5 rounded-2xl">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Composite DNA</span>
            <span className="text-xs font-bold" style={{ color }}>{risk_grade}</span>
          </div>
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl font-mono shadow-xl border-2"
            style={{ borderColor: color, backgroundColor: `${color}20` }}
          >
            {composite_score}
          </div>
        </div>
      </div>

      {/* Main Grid: Radar Chart + 5-Pillar Score Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              5-Pillar Safety Genome Radar
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Benchmark: DGMS CMR 2017</span>
          </div>

          <div className="w-full h-[320px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar_metrics} outerRadius="75%">
                <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fill: '#64748b', fontSize: 9 }} />
                <Radar
                  name="Mine Score"
                  dataKey="score"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.4}
                />
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-700 text-xs shadow-xl">
                          <span className="font-bold text-amber-400 block">{data.subject}</span>
                          <span className="text-white font-mono font-bold text-sm">{data.score} / 100</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5-Pillar Score Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="border-b border-slate-800 pb-3 mb-4">
            <h3 className="font-bold text-sm text-white">Dimension Diagnostics</h3>
            <p className="text-[11px] text-slate-400">Detailed performance against safe thresholds</p>
          </div>

          <div className="space-y-3.5">
            {radar_metrics.map((m, idx) => {
              const isLow = m.score < 60;
              const isMid = m.score >= 60 && m.score < 80;
              const barColor = isLow ? 'bg-red-500' : isMid ? 'bg-amber-500' : 'bg-emerald-500';

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{m.subject}</span>
                    <span className="font-mono font-bold text-white">{m.score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${m.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400">
            💡 <strong className="text-slate-300">Quick Tip:</strong> Lowest pillar defines highest catastrophe risk profile. Focus corrective action workflows on sub-70% indices.
          </div>
        </div>
      </div>

      {/* 365-Day Historical Compliance Heatmap Grid */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">365-Day Compliance Activity Calendar</h3>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span>Compliant</span>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600/40"></span>
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500/90"></span>
            </div>
            <span>Critical Breach</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="flex gap-1 min-w-[720px]">
            {history_weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map((dayLevel, dIdx) => (
                  <div
                    key={dIdx}
                    title={`Week ${wIdx + 1}, Day ${dIdx + 1}: ${dayLevel === 3 ? 'Critical Breach' : dayLevel === 2 ? 'Minor Deviation' : 'Compliant'}`}
                    className={`w-3 h-3 rounded-sm transition-transform cursor-pointer ${getHeatmapColor(dayLevel)}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recurring Risk Patterns */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <AlertOctagon className="w-4 h-4 text-red-400" />
          <h3 className="font-bold text-sm text-white">Recurring Risk Patterns & Predictive Anomalies</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recurring_patterns.map((p, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400">{p.category}</span>
                <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full font-mono font-semibold">
                  {p.impact}
                </span>
              </div>
              <div className="text-slate-400">
                <span className="text-slate-500">Frequency:</span> {p.frequency}
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-slate-300">
                <span className="font-semibold text-cyan-400">Prescribed Intervention: </span>
                {p.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
