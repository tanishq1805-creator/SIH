'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CorrectiveAction } from '../../lib/types';
import { fetchCorrectiveActions, updateCorrectiveAction } from '../../lib/api';
import { 
  CheckSquare, 
  Clock, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck,
  RefreshCw,
  Lock
} from 'lucide-react';

function CorrectiveContent() {
  const searchParams = useSearchParams();
  const activeMineId = searchParams.get('mine');

  const [actions, setActions] = useState<CorrectiveAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadActions = () => {
    setLoading(true);
    fetchCorrectiveActions(activeMineId || undefined)
      .then((data) => setActions(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadActions();
  }, [activeMineId]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await updateCorrectiveAction(id, newStatus, `Status transitioned to ${newStatus} by Mine Safety Officer.`);
      loadActions();
    } catch (err) {
      console.error('Failed to update action', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/20 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-emerald-400" />
              SLA ENFORCEMENT WORKFLOW
            </span>
            <span className="text-xs text-slate-400">&bull; Statutory Remediation Lifecycle</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Corrective Actions & Remediation Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated statutory action dispatch, responsible engineer assignment, and cryptographic resolution closure.
          </p>
        </div>

        <button
          onClick={loadActions}
          className="self-start md:self-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Workflow</span>
        </button>
      </div>

      {/* Action Cards List */}
      <div className="space-y-4">
        {actions.map((act) => {
          const isPending = act.status === 'PENDING';
          const isInProgress = act.status === 'IN_PROGRESS';
          const isResolved = act.status === 'RESOLVED';

          return (
            <div
              key={act.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    isPending
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : isInProgress
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {act.status.replace(/_/g, ' ')}
                  </span>
                  <h3 className="font-bold text-base text-white">{act.title}</h3>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>SLA Deadline: <strong className="text-white">{act.deadline}</strong></span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {act.description}
              </p>

              {/* Assignment & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                    Assigned Mining Officer
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    <span>{act.assigned_to}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                    Remediation Log / Progress Notes
                  </span>
                  <span className="text-slate-300 text-[11px] block">
                    {act.resolution_notes || 'Action ticket dispatched. Awaiting on-site crew deployment.'}
                  </span>
                </div>
              </div>

              {/* Action Buttons & Blockchain Sync */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                  <Lock className="w-3 h-3" />
                  <span>Every status shift is recorded in the SHA-256 Audit Blockchain</span>
                </div>

                <div className="flex items-center gap-2">
                  {act.status !== 'IN_PROGRESS' && act.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleUpdateStatus(act.id, 'IN_PROGRESS')}
                      disabled={updatingId === act.id}
                      className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow transition-all"
                    >
                      {updatingId === act.id ? 'Updating...' : 'Start Execution'}
                    </button>
                  )}

                  {act.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleUpdateStatus(act.id, 'RESOLVED')}
                      disabled={updatingId === act.id}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify & Close Ticket</span>
                    </button>
                  )}

                  {act.status === 'RESOLVED' && (
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Closed & Cryptographically Sealed
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CorrectivePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Corrective Actions...</div>}>
      <CorrectiveContent />
    </Suspense>
  );
}
