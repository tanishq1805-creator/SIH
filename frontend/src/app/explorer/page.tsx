'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MapTilerView from '../../components/MapTilerView';
import { Mine } from '../../lib/types';
import { fetchMines, fetchMineDetails } from '../../lib/api';
import { 
  Radio, 
  Wind, 
  CloudFog, 
  Activity, 
  Cpu, 
  MapPin, 
  Layers, 
  AlertTriangle, 
  CheckCircle,
  Sparkles,
  Maximize2
} from 'lucide-react';

function ExplorerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeMineId = searchParams.get('mine') || 'mine-jh-001';

  const [mines, setMines] = useState<Mine[]>([]);
  const [mineDetails, setMineDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchMines().then((data) => {
      setMines(data);
    });
  }, []);

  useEffect(() => {
    if (!activeMineId) return;
    setLoadingDetails(true);
    fetchMineDetails(activeMineId)
      .then((data) => {
        setMineDetails(data);
      })
      .finally(() => {
        setLoadingDetails(false);
      });
  }, [activeMineId]);

  const handleSelectMine = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('mine', id);
    router.push(`/explorer?${params.toString()}`);
  };

  const currentMine = mineDetails?.mine || mines.find((m) => m.id === activeMineId) || mines[0];
  const latestSafety = mineDetails?.safety?.[0] || {};
  const latestEnv = mineDetails?.environment?.[0] || {};
  const equipmentList = mineDetails?.equipment || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              MAPTILER SATELLITE 3D ENGINE
            </span>
            <span className="text-xs text-slate-400">&bull; Key Verified Active</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            National Coalfield 3D Satellite Explorer
          </h1>
        </div>

        {/* Selected Mine Pill */}
        {currentMine && (
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-xs">
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Active Target</span>
              <span className="font-extrabold text-white">{currentMine.name}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Map (7 cols) + Live Telemetry Drill-down (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
        {/* Map Container */}
        <div className="lg:col-span-7 h-full">
          <MapTilerView
            mines={mines}
            selectedMineId={activeMineId}
            onSelectMine={handleSelectMine}
          />
        </div>

        {/* Live Telemetry Drilldown Panel */}
        <div className="lg:col-span-5 h-full overflow-y-auto space-y-4 pr-1">
          {loadingDetails ? (
            <div className="p-8 text-center text-slate-400 bg-slate-900/60 rounded-2xl border border-slate-800">
              Loading mine telemetry...
            </div>
          ) : currentMine ? (
            <>
              {/* Mine Header Card */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold bg-slate-800 text-amber-400 px-2.5 py-1 rounded-lg border border-slate-700">
                    {currentMine.code}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    currentMine.status === 'Critical_Watch'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {currentMine.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white">{currentMine.name}</h2>
                  <p className="text-xs text-slate-400">{currentMine.operator}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  {currentMine.description}
                </p>

                {/* Specs Matrix */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Mining Type</span>
                    <span className="font-bold text-slate-200">{currentMine.type}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Seam Depth</span>
                    <span className="font-bold text-cyan-400 font-mono">{currentMine.depth_m}m</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Capacity</span>
                    <span className="font-bold text-amber-400 font-mono">{currentMine.capacity_mtpa} MTPA</span>
                  </div>
                </div>
              </div>

              {/* Safety & Underground Atmosphere Gauges */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                    Atmospheric & Ventilation Telemetry
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">CMR 2017 Reg 153/169</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  {/* CH4 */}
                  <div className={`p-3 rounded-xl border ${
                    latestSafety.ch4_percent > 0.75
                      ? 'bg-red-950/40 border-red-500/40 text-red-300'
                      : 'bg-slate-950 border-slate-800 text-slate-200'
                  }`}>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Methane (CH4)</span>
                    <span className="text-xl font-black font-mono block">
                      {latestSafety.ch4_percent !== undefined ? `${latestSafety.ch4_percent}%` : '--'}
                    </span>
                    <span className="text-[10px] text-slate-500">DGMS Limit: &le; 0.75%</span>
                  </div>

                  {/* Air Velocity */}
                  <div className={`p-3 rounded-xl border ${
                    latestSafety.air_velocity_mps < 0.50
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-200'
                  }`}>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Air Velocity</span>
                    <span className="text-xl font-black font-mono block">
                      {latestSafety.air_velocity_mps !== undefined ? `${latestSafety.air_velocity_mps} m/s` : '--'}
                    </span>
                    <span className="text-[10px] text-slate-500">Mandatory Min: &ge; 0.50 m/s</span>
                  </div>

                  {/* Carbon Monoxide */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Carbon Monoxide (CO)</span>
                    <span className="text-xl font-black font-mono block text-white">
                      {latestSafety.co_ppm !== undefined ? `${latestSafety.co_ppm} ppm` : '--'}
                    </span>
                    <span className="text-[10px] text-slate-500">Ceiling: &le; 25 ppm</span>
                  </div>

                  {/* Strata Stress */}
                  <div className={`p-3 rounded-xl border ${
                    latestSafety.strata_stress_mpa > 14.5
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                      : 'bg-slate-950 border-slate-800 text-slate-200'
                  }`}>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Strata Stress</span>
                    <span className="text-xl font-black font-mono block">
                      {latestSafety.strata_stress_mpa !== undefined ? `${latestSafety.strata_stress_mpa} MPa` : '--'}
                    </span>
                    <span className="text-[10px] text-slate-500">Roof Limit: &le; 14.5 MPa</span>
                  </div>
                </div>
              </div>

              {/* Environmental Quality (CPCB) */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <CloudFog className="w-3.5 h-3.5 text-cyan-400" />
                    CPCB Environmental Telemetry
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">Air & Water Acts</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">PM10 Dust</span>
                    <span className={`font-mono font-bold text-sm ${latestEnv.pm10 > 250 ? 'text-amber-400' : 'text-white'}`}>
                      {latestEnv.pm10 || '--'} µg/m³
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Effluent pH</span>
                    <span className={`font-mono font-bold text-sm ${latestEnv.water_ph < 6.5 || latestEnv.water_ph > 8.5 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {latestEnv.water_ph || '--'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Turbidity</span>
                    <span className="font-mono font-bold text-sm text-cyan-400">
                      {latestEnv.turbidity_ntu || '--'} NTU
                    </span>
                  </div>
                </div>
              </div>

              {/* Critical Mining Machinery & Fans */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-amber-400" />
                    Critical Machinery & Ventilation Equipment
                  </h3>
                  <span className="text-[10px] text-slate-500">{equipmentList.length} Units</span>
                </div>

                <div className="space-y-2">
                  {equipmentList.map((eq: any) => (
                    <div key={eq.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white">{eq.name}</span>
                          <span className="text-[9px] font-mono text-slate-500">[{eq.code}]</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Vib: {eq.vibration_mms} mm/s &bull; Due: {eq.maintenance_due}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          eq.status === 'Critical'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : eq.status === 'Warning'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {eq.status}
                        </span>
                        <span className="block text-[10px] text-slate-500 mt-1 font-mono">
                          Health: {eq.health_score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function ExplorerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading 3D Mine Explorer...</div>}>
      <ExplorerContent />
    </Suspense>
  );
}
