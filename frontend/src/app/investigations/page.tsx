'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ContradictionDiff from '../../components/ContradictionDiff';
import { ContradictionResult, RegulationEvaluation } from '../../lib/types';
import { fetchContradictions, evaluateMineRegulations, fetchInvestigations } from '../../lib/api';
import { 
  Scale, 
  ShieldAlert, 
  FileCheck, 
  FileX, 
  AlertCircle, 
  Radio, 
  FileText, 
  Search,
  ExternalLink,
  Lock
} from 'lucide-react';

function InvestigationsContent() {
  const searchParams = useSearchParams();
  const activeMineId = searchParams.get('mine') || 'mine-jh-001';

  const [contradictions, setContradictions] = useState<ContradictionResult | null>(null);
  const [evaluations, setEvaluations] = useState<RegulationEvaluation[]>([]);
  const [investigations, setInvestigations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchContradictions(activeMineId),
      evaluateMineRegulations(activeMineId),
      fetchInvestigations(activeMineId)
    ])
      .then(([cntrData, evalData, invData]) => {
        setContradictions(cntrData);
        setEvaluations(evalData);
        setInvestigations(invData);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeMineId]);

  return (
    <div className="space-y-8">
      {/* Contradiction Engine (SIH Flagship Feature) */}
      <ContradictionDiff data={contradictions} />

      {/* DGMS & CPCB Machine-Readable Rule Evaluator (PASS / FAIL / UNKNOWN) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              Machine-Readable DGMS Regulation Engine Evaluator
            </h3>
            <p className="text-xs text-slate-400">
              Evaluates live continuous telemetry streams against codified Coal Mines Regulations 2017 & CPCB statutes
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">Status: PASS / FAIL / UNKNOWN</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evaluations.map((ev) => (
            <div
              key={ev.regulation_id}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                ev.status === 'FAIL'
                  ? 'bg-red-950/20 border-red-500/30'
                  : ev.status === 'PASS'
                  ? 'bg-slate-950 border-slate-800'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono font-bold bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                    {ev.code}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    ev.status === 'FAIL'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : ev.status === 'PASS'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {ev.status}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white">{ev.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{ev.description}</p>
              </div>

              {/* Status and Margin */}
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Standard Rule Limit:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {ev.operator} {ev.standard_limit} {ev.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Current Value:</span>
                  <span className={`font-mono font-bold ${ev.status === 'FAIL' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {ev.actual_value !== null ? `${ev.actual_value} ${ev.unit}` : 'N/A'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  {ev.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Investigation Dossiers & Evidence Bundles */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" />
            Assembled Compliance Investigation Dossiers
          </h3>
          <p className="text-xs text-slate-400">
            Automated anomaly detection packages with historical baseline comparison and cryptographic evidence
          </p>
        </div>

        <div className="space-y-4">
          {investigations.map((inv) => (
            <div
              key={inv.case_id}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                    {inv.case_id}
                  </span>
                  <h4 className="font-bold text-sm text-white">{inv.violation.title}</h4>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-mono">
                    Baseline Deviation: <strong className="text-red-400">{inv.historical_baseline_comparison.deviation_percentage}</strong>
                  </span>
                </div>
              </div>

              {/* Evidence Payload */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  Sealed Evidence Records ({inv.evidence_count})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {inv.evidences.map((ev: any) => (
                    <div key={ev.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-400">{ev.evidence_type}</span>
                        <span className="font-mono text-[10px] text-slate-500">{ev.source}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono bg-slate-950 p-2 rounded truncate">
                        Hash: {ev.hash}
                      </div>
                      <pre className="text-[10px] text-slate-300 font-mono bg-slate-950 p-2 rounded overflow-x-auto">
                        {JSON.stringify(ev.data_payload, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function InvestigationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Investigations...</div>}>
      <InvestigationsContent />
    </Suspense>
  );
}
