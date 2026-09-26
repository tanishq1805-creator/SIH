'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DnaRadarChart from '../../components/DnaRadarChart';
import { ComplianceDna } from '../../lib/types';
import { fetchComplianceDna } from '../../lib/api';
import { Dna, ShieldAlert, Sparkles, Download, Layers } from 'lucide-react';

function ComplianceDnaContent() {
  const searchParams = useSearchParams();
  const activeMineId = searchParams.get('mine') || 'mine-jh-001';

  const [dna, setDna] = useState<ComplianceDna | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchComplianceDna(activeMineId)
      .then((data) => {
        setDna(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeMineId]);

  return (
    <div className="space-y-6">
      <DnaRadarChart dna={dna} />
    </div>
  );
}

export default function ComplianceDnaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Compliance DNA...</div>}>
      <ComplianceDnaContent />
    </Suspense>
  );
}
