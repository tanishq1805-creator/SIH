'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { triggerSimulationScenario } from '../../lib/api';
import { 
  Sliders, 
  Upload, 
  FileCode, 
  Flame, 
  CloudFog, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle,
  Sparkles,
  Download
} from 'lucide-react';

function DataEngineContent() {
  const searchParams = useSearchParams();
  const activeMineId = searchParams.get('mine') || 'mine-jh-001';

  const [simulating, setSimulating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [jsonInput, setJsonInput] = useState<string>('');

  const sampleJson = {
    mine: {
      id: "mine-custom-01",
      name: "Bhilwara Lignite Open Pit",
      code: "RSMM-BW-01",
      state: "Rajasthan",
      district: "Bhilwara",
      coalfield: "Rajasthan Lignite Basin",
      type: "Opencast",
      operator: "RSMML",
      depth_m: 85.0,
      capacity_mtpa: 3.5,
      latitude: 25.3463,
      longitude: 74.6364,
      status: "Operational"
    },
    telemetry: {
      mine_id: "mine-custom-01",
      ch4_percent: 0.08,
      co_ppm: 4.5,
      o2_percent: 20.8,
      air_velocity_mps: 1.6,
      temp_c: 32.0,
      humidity_pct: 45.0,
      strata_stress_mpa: 3.2
    }
  };

  const handleSimulate = async (scenario: string) => {
    setSimulating(true);
    setStatusMsg(null);
    try {
      const res = await triggerSimulationScenario(activeMineId, scenario);
      setStatusMsg(`Scenario '${scenario}' successfully executed on mine ${activeMineId} and minted to Audit Ledger!`);
    } catch (err) {
      setStatusMsg('Failed to trigger simulation scenario.');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sliders className="w-3 h-3 text-amber-400" />
              MINE DATA ENGINE & SIMULATOR
            </span>
            <span className="text-xs text-slate-400">&bull; Live Ingestion & Scenario Testing</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Mine Data Ingestion & Presentation Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Import new coal mine datasets or trigger live emergency scenarios to demonstrate the Contradiction Engine and DGMS Evaluator in action.
          </p>
        </div>
      </div>

      {/* Notification Banner */}
      {statusMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Presentation Emergency Scenarios Grid */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Interactive Hackathon Demo Scenarios
          </h3>
          <p className="text-xs text-slate-400">
            Click to inject dynamic hazards into the active mine and observe how the Contradiction Engine and Copilot react in real time!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Scenario 1 */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-red-400">
                <Flame className="w-4 h-4" />
                <h4 className="font-bold text-sm text-white">Methane Gas Surge</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Spikes CH4 to 1.85% (exceeding evacuation limit 1.25%). Triggers critical DGMS CMR 169 violation and flags human inspection falsification.
              </p>
            </div>
            <button
              onClick={() => handleSimulate('methane_surge')}
              disabled={simulating}
              className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all"
            >
              Trigger Methane Surge
            </button>
          </div>

          {/* Scenario 2 */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400">
                <CloudFog className="w-4 h-4" />
                <h4 className="font-bold text-sm text-white">Dust Cannon Outage</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Spikes PM10 dust levels to 560 µg/m³. Exposes discrepancy against shift report declaring 100% dust suppression active.
              </p>
            </div>
            <button
              onClick={() => handleSimulate('dust_storm_failure')}
              disabled={simulating}
              className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              Simulate Dust Failure
            </button>
          </div>

          {/* Scenario 3 */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400">
                <RotateCcw className="w-4 h-4" />
                <h4 className="font-bold text-sm text-white">Restore Normal Baseline</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Restores optimal ventilation flow (&ge;1.2 m/s), nominal methane levels (0.22%), and compliant environmental parameters.
              </p>
            </div>
            <button
              onClick={() => handleSimulate('reset_normal')}
              disabled={simulating}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
            >
              Reset to Normal
            </button>
          </div>
        </div>
      </div>

      {/* CSV / JSON Dataset Ingestion */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-white">Custom Coal Mine JSON / CSV Ingestion</h3>
          </div>
          <button
            onClick={() => setJsonInput(JSON.stringify(sampleJson, null, 2))}
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Load Sample Payload</span>
          </button>
        </div>

        <div className="space-y-3">
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={7}
            placeholder="Paste JSON or CSV mine data payload here..."
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700/80 font-mono text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />

          <button
            onClick={() => {
              try {
                const parsed = JSON.parse(jsonInput || JSON.stringify(sampleJson));
                importMineData(parsed).then(() => {
                  setStatusMsg('Custom mine successfully ingested into national database!');
                });
              } catch (e) {
                alert('Invalid JSON format');
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Ingest Mine Dataset</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DataEnginePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Data Engine...</div>}>
      <DataEngineContent />
    </Suspense>
  );
}
