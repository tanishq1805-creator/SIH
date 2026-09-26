'use client';

import React, { useState } from 'react';
import { AuditBlock, AuditVerification } from '../lib/types';
import { verifyAuditLedger } from '../lib/api';
import { 
  Link2, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Hash, 
  Clock, 
  User, 
  RefreshCw,
  Lock
} from 'lucide-react';

interface AuditBlockChainProps {
  blocks: AuditBlock[];
  onRefresh?: () => void;
}

export default function AuditBlockChain({ blocks, onRefresh }: AuditBlockChainProps) {
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<AuditVerification | null>(null);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const res = await verifyAuditLedger();
      setVerificationResult(res);
    } catch (err) {
      console.error('Verification error', err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/30 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs uppercase font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3" />
              IMMUTABLE HASH CHAIN LEDGER
            </span>
            <span className="text-xs text-slate-400">&bull; SHA-256 Cryptographic Standard</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Link2 className="w-6 h-6 text-cyan-400" />
            Tamper-Proof Regulatory Audit Trail
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mt-1">
            Every critical violation, contradiction finding, and corrective action is permanently sealed in an append-only cryptographic blockchain ledger.
          </p>
        </div>

        {/* Verification Trigger Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            {verifying ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>{verifying ? 'Recalculating Hashes...' : 'Verify Ledger Integrity'}</span>
          </button>
        </div>
      </div>

      {/* Verification Result Banner */}
      {verificationResult && (
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 animate-in fade-in ${
          verificationResult.is_valid
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            : 'bg-red-950/40 border-red-500/40 text-red-300'
        }`}>
          <div className="flex items-center gap-3">
            {verificationResult.is_valid ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
            )}
            <div>
              <h4 className="font-bold text-sm text-white">{verificationResult.status_message}</h4>
              <p className="text-xs text-slate-400">
                Verified {verificationResult.total_blocks} blocks &bull; Genesis: <span className="font-mono text-cyan-400">{verificationResult.genesis_hash}</span>
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-slate-300">
            {new Date(verificationResult.verified_at).toLocaleTimeString()}
          </span>
        </div>
      )}

      {/* Blockchain Blocks Sequence */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
          <Hash className="w-4 h-4 text-cyan-400" />
          Blocks Chain ({blocks.length} Minted Blocks)
        </h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-amber-500 before:to-emerald-500">
          {blocks.map((b, idx) => (
            <div
              key={b.block_index}
              className="relative p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3 hover:border-cyan-500/40 transition-colors"
            >
              {/* Chain Node Indicator */}
              <div className="absolute -left-[27px] top-6 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-md"></div>

              {/* Block Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded">
                    BLOCK #{b.block_index}
                  </span>
                  <span className="font-bold text-white text-sm">{b.event_type}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-amber-400" />
                    {b.actor}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {new Date(b.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Hashes Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Previous Block Hash (prev_hash)</span>
                  <span className="text-slate-400 truncate block select-all">{b.prev_hash}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-cyan-400 text-[10px] uppercase font-bold block">Current Block Hash (SHA-256)</span>
                  <span className="text-emerald-400 truncate block font-bold select-all">{b.current_hash}</span>
                </div>
              </div>

              {/* Payload Preview */}
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs">
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Payload Content</span>
                <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap">
                  {typeof b.payload === 'object' ? JSON.stringify(b.payload, null, 2) : b.payload_json}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
