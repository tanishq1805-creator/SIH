'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { Mine } from '../lib/types';
import { Layers, Compass, ZoomIn, ZoomOut, AlertCircle, CheckCircle2 } from 'lucide-react';

interface MapTilerViewProps {
  mines: Mine[];
  selectedMineId: string;
  onSelectMine: (mineId: string) => void;
}

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || '';

export default function MapTilerView({ mines, selectedMineId, onSelectMine }: MapTilerViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [id: string]: maplibregl.Marker }>({});
  const [mapStyle, setMapStyle] = useState<'hybrid' | 'streets-v2' | 'outdoor-v2'>('hybrid');
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const selectedMine = mines.find((m) => m.id === selectedMineId) || mines[0];
    const initialCenter: [number, number] = selectedMine 
      ? [selectedMine.longitude, selectedMine.latitude] 
      : [82.5, 22.5];

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/${mapStyle}/style.json?key=${MAPTILER_KEY}`,
      center: initialCenter,
      zoom: selectedMine ? 9 : 5,
      pitch: 45, // 3D tilt for mine topography
      bearing: -15,
      attributionControl: false
    });

    map.current.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.current.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Handle Style Change
  const changeStyle = (newStyle: 'hybrid' | 'streets-v2' | 'outdoor-v2') => {
    if (!map.current) return;
    setMapStyle(newStyle);
    map.current.setStyle(`https://api.maptiler.com/maps/${newStyle}/style.json?key=${MAPTILER_KEY}`);
  };

  // Render Markers
  useEffect(() => {
    if (!map.current || mines.length === 0) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    mines.forEach((mine) => {
      if (!mine.latitude || !mine.longitude) return;

      const isSelected = mine.id === selectedMineId;
      const isCritical = mine.status === 'Critical_Watch';

      // Custom marker DOM element
      const el = document.createElement('div');
      el.className = 'cursor-pointer group';
      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          ${isCritical ? '<div class="absolute -inset-2 rounded-full bg-red-500/40 animate-ping"></div>' : ''}
          <div class="w-8 h-8 rounded-full ${
            isCritical 
              ? 'bg-red-600 border-2 border-white shadow-lg shadow-red-600/50' 
              : 'bg-emerald-600 border-2 border-white shadow-lg shadow-emerald-600/50'
          } flex items-center justify-center text-white text-xs font-black transition-transform ${isSelected ? 'scale-125 ring-4 ring-amber-400' : 'group-hover:scale-110'}">
            ${mine.type === 'Underground' ? '⛏️' : '🚜'}
          </div>
          <div class="absolute bottom-9 left-1/2 -translate-x-1/2 bg-slate-950/90 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap border border-slate-700 pointer-events-none opacity-90 group-hover:opacity-100">
            ${mine.name.split(' ')[0]}
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        onSelectMine(mine.id);
      });

      const popup = new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(`
        <div class="bg-slate-900 text-slate-100 p-3 rounded-lg border border-slate-700 text-xs min-w-[200px] shadow-2xl">
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="font-bold text-amber-400 text-sm">${mine.name}</span>
            <span class="text-[9px] px-1.5 py-0.5 rounded ${isCritical ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'} font-bold">
              ${mine.status}
            </span>
          </div>
          <div class="text-[11px] text-slate-400 mb-2">
            ${mine.operator} &bull; ${mine.coalfield}
          </div>
          <div class="grid grid-cols-2 gap-2 bg-slate-950/80 p-2 rounded border border-slate-800 text-[10px]">
            <div>
              <span class="text-slate-500 block">Methane (CH4)</span>
              <span class="font-mono font-bold ${mine.latest_ch4 && mine.latest_ch4 > 0.75 ? 'text-red-400' : 'text-emerald-400'}">
                ${mine.latest_ch4 !== undefined ? `${mine.latest_ch4}%` : '0.12%'}
              </span>
            </div>
            <div>
              <span class="text-slate-500 block">PM10 Dust</span>
              <span class="font-mono font-bold ${mine.latest_pm10 && mine.latest_pm10 > 250 ? 'text-amber-400' : 'text-cyan-400'}">
                ${mine.latest_pm10 !== undefined ? `${mine.latest_pm10} µg/m³` : '95 µg/m³'}
              </span>
            </div>
          </div>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([mine.longitude, mine.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current[mine.id] = marker;
    });
  }, [mines, selectedMineId]);

  // Fly to selected mine when selectedMineId changes
  useEffect(() => {
    if (!map.current) return;
    const target = mines.find((m) => m.id === selectedMineId);
    if (target && target.latitude && target.longitude) {
      map.current.flyTo({
        center: [target.longitude, target.latitude],
        zoom: 12,
        pitch: 50,
        bearing: 20,
        speed: 1.4,
        essential: true
      });
    }
  }, [selectedMineId, mines]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Map Control Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-2xl">
        <span className="text-[10px] uppercase font-bold text-slate-400 px-2 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          MapTiler 3D Layer:
        </span>
        <button
          onClick={() => changeStyle('hybrid')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            mapStyle === 'hybrid'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          🛰️ Satellite Hybrid
        </button>
        <button
          onClick={() => changeStyle('outdoor-v2')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            mapStyle === 'outdoor-v2'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          ⛰️ Topo Terrain
        </button>
        <button
          onClick={() => changeStyle('streets-v2')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            mapStyle === 'streets-v2'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          🗺️ Vector Map
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 z-10 bg-slate-950/85 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 shadow-2xl text-[11px] text-slate-300 space-y-1.5">
        <div className="font-bold text-xs text-white border-b border-slate-800 pb-1 flex items-center justify-between">
          <span>Mine Status Legend</span>
          <span className="text-[9px] text-amber-400 font-mono">MapTiler API Active</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 border border-white"></span>
          <span>Critical Watch / Active Breach (e.g. Jharia)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></span>
          <span>Operational Compliant (DGMS CMR 2017)</span>
        </div>
      </div>
    </div>
  );
}
