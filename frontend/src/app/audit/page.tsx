'use client';

import React, { useState, useEffect, Suspense } from 'react';
import AuditBlockChain from '../../components/AuditBlockChain';
import { AuditBlock } from '../../lib/types';
import { fetchAuditBlocks } from '../../lib/api';

function AuditContent() {
  const [blocks, setBlocks] = useState<AuditBlock[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBlocks = () => {
    setLoading(true);
    fetchAuditBlocks()
      .then((data) => setBlocks(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBlocks();
  }, []);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="p-8 text-center text-slate-400 bg-slate-900/60 rounded-2xl border border-slate-800">
          Loading Cryptographic Blockchain Ledger...
        </div>
      ) : (
        <AuditBlockChain blocks={blocks} onRefresh={loadBlocks} />
      )}
    </div>
  );
}

export default function AuditPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Audit Ledger...</div>}>
      <AuditContent />
    </Suspense>
  );
}
