import React from 'react';
import { Compass, Calendar, Clock, Play, MapPin, AlertTriangle, CheckCircle2, Layers } from 'lucide-react';

export default function Sidebar({
  sites,
  selectedSiteId,
  onSelectSite,
  startDate,
  onChangeStartDate,
  durationDays,
  onChangeDuration,
  onRunAnalysis,
  loading,
  activeTab,
  onSelectTab
}) {
  const currentSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  return (
    <aside className="w-full lg:w-80 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col gap-5 shadow-xl">
      {/* Sidebar Header */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
        <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
            1. Mission Control
          </h2>
          <p className="text-xs text-slate-400">Select Lunar Candidate Site</p>
        </div>
      </div>

      {/* Landing Site Selector */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
          <span>Target Landing Location</span>
          <span className="text-[10px] text-cyan-400 font-mono">3 South Pole Sites</span>
        </label>
        <select
          value={selectedSiteId}
          onChange={(e) => onSelectSite(e.target.value)}
          className="w-full bg-slate-800/90 border border-slate-700 hover:border-slate-600 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer"
        >
          {sites.map((site) => (
            <option key={site.id} value={site.id} className="bg-slate-900 text-white">
              {site.name} ({site.latitude}°, {site.longitude}°)
            </option>
          ))}
        </select>
      </div>

      {/* Mission Epoch (Date Picker) */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span>Mission Start Date (Epoch)</span>
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onChangeStartDate(e.target.value)}
          className="w-full bg-slate-800/90 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
        />
      </div>

      {/* Duration & 30-min sampling info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-slate-300">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mission Window</span>
          </span>
          <span className="font-semibold text-cyan-400 font-mono">{durationDays} Days (168h)</span>
        </div>
        <input
          type="range"
          min="3"
          max="14"
          step="1"
          value={durationDays}
          onChange={(e) => onChangeDuration(Number(e.target.value))}
          className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>3 Days</span>
          <span className="text-cyan-400">30-min intervals (336 steps)</span>
          <span>14 Days</span>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        onClick={onRunAnalysis}
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98]"
      >
        <Play className={`w-4 h-4 fill-current ${loading ? 'animate-spin' : ''}`} />
        <span>{loading ? 'Processing Ephemeris...' : 'Run LUNA-SCOPE Analysis'}</span>
      </button>

      {/* Selected Site Quick Card */}
      {currentSite && (
        <div className="mt-2 bg-slate-800/50 border border-slate-700/60 rounded-xl p-3.5 space-y-2.5 text-xs">
          <div className="flex items-center justify-between font-medium">
            <span className="text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentSite.name}</span>
            </span>
            <span className="text-slate-400 font-mono">{currentSite.latitude}°S</span>
          </div>

          <div className="grid grid-cols-2 gap-2 py-1 border-y border-slate-700/50 font-mono text-[11px]">
            <div>
              <span className="text-slate-400 block">Base Elev:</span>
              <span className="text-slate-200 font-medium">+{currentSite.base_elevation_m}m</span>
            </div>
            <div>
              <span className="text-slate-400 block">Mean Slope:</span>
              <span className="text-slate-200 font-medium">{currentSite.avg_slope_deg}°</span>
            </div>
          </div>

          <div className="space-y-1 text-[11px]">
            <p className="text-emerald-400 flex items-start gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{currentSite.primary_advantage}</span>
            </p>
            <p className="text-amber-400 flex items-start gap-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{currentSite.primary_challenge}</span>
            </p>
          </div>
        </div>
      )}

      {/* Navigation View Switcher */}
      <div className="pt-2 border-t border-slate-800 space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Dashboard View
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onSelectTab('overview')}
            className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-all ${
              activeTab === 'overview'
                ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-800/60 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            Site Details
          </button>
          <button
            onClick={() => onSelectTab('comparison')}
            className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-all ${
              activeTab === 'comparison'
                ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-800/60 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            Compare All 3 Sites
          </button>
        </div>
      </div>
    </aside>
  );
}
