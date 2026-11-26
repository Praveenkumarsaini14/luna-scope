import React from 'react';
import { Sun, Radio, Mountain, Droplets, ShieldAlert, Award, Clock, ArrowUpRight, ExternalLink } from 'lucide-react';

export default function ComparisonCards({
  results,
  mode,
  activeChartSiteId,
  setActiveChartSiteId,
  onOpenSiteDetails
}) {
  if (!results || results.length === 0) {
    return null;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'GO':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            GO (NOMINAL)
          </span>
        );
      case 'CAUTION':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-950/80 border border-amber-500/50 text-amber-400 flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            CAUTION
          </span>
        );
      case 'NO-GO':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-950/80 border border-rose-500/50 text-rose-400 flex items-center gap-1.5 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            NO-GO
          </span>
        );
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-emerald-400 border-emerald-500/60 bg-emerald-950/30';
    if (score >= 45) return 'text-amber-400 border-amber-500/60 bg-amber-950/30';
    return 'text-rose-400 border-rose-500/60 bg-rose-950/30';
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          Mission Readiness & Trade-Off Comparison
        </h2>
        <span className="text-xs font-mono text-slate-400">
          Comparing {results.length} site{results.length > 1 ? 's' : ''} • Click card to highlight on map & 3D dome
        </span>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(results.length, 3)} gap-4`}>
        {results.map((res) => {
          const isChartActive = activeChartSiteId === res.site_id;
          const { metrics } = res;

          return (
            <div
              key={res.site_id}
              onClick={() => setActiveChartSiteId(res.site_id)}
              className={`rounded-2xl border p-5 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isChartActive
                  ? 'bg-space-900 border-cyan-500/80 shadow-[0_0_20px_rgba(56,189,248,0.2)]'
                  : 'bg-space-900/80 border-slate-800 hover:border-slate-700 hover:bg-space-850'
              }`}
            >
              {isChartActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"></div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono tracking-wider uppercase text-cyan-400/90 font-medium">
                      {res.category_label || res.region}
                    </span>
                    <h3 className="text-base font-bold text-white leading-tight">
                      {res.name}
                    </h3>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {res.latitude.toFixed(2)}°{res.latitude < 0 ? 'S' : 'N'}, {res.longitude.toFixed(2)}°E • Elev: {res.elevation_m}m
                    </div>
                  </div>
                  <div>{getStatusBadge(metrics.status)}</div>
                </div>

                {/* Score & Summary sentence */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-space-950/70 border border-slate-800/80 mb-3">
                  <div
                    className={`flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 ${getScoreColor(
                      metrics.mission_readiness_score
                    )} shrink-0 shadow-inner`}
                  >
                    <span className="text-lg font-black font-mono leading-none">
                      {Math.round(metrics.mission_readiness_score)}
                    </span>
                    <span className="text-[8px] font-mono uppercase tracking-tighter text-slate-400">
                      SCORE
                    </span>
                  </div>

                  <div className="text-xs">
                    <div className="font-semibold text-slate-200">
                      {metrics.mission_readiness_score >= 70
                        ? 'High Mission Feasibility'
                        : metrics.mission_readiness_score >= 45
                        ? 'Constrained / Battery Reliant'
                        : 'Severe Power or DTE Deficit'}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                      {mode === 'planner'
                        ? `Blackout peak: ${metrics.longest_blackout_hours}h. Peak solar window: ${metrics.longest_sunlight_window_hours}h.`
                        : `Provides ${metrics.sunlight_percentage}% solar power availability and ${metrics.comms_percentage}% signal directly to Earth.`}
                    </div>
                  </div>
                </div>

                {/* Sunset & Earthset Countdown Pills */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3">
                  <div className="p-2 rounded-lg bg-space-850/80 border border-slate-800">
                    <span className="text-[9px] text-slate-400 block uppercase">Time to Sunset</span>
                    <span className="font-bold text-amber-300">
                      {metrics.current_time_to_sunset_hours !== null ? `${metrics.current_time_to_sunset_hours}h` : 'In Night / No Sun'}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-space-850/80 border border-slate-800">
                    <span className="text-[9px] text-slate-400 block uppercase">Time to Earthset</span>
                    <span className="font-bold text-cyan-300">
                      {metrics.current_time_to_earthset_hours !== null ? `${metrics.current_time_to_earthset_hours}h` : 'Occulted / Blackout'}
                    </span>
                  </div>
                </div>

                {/* 4 Core Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  {/* Sunlight */}
                  <div className="p-2.5 rounded-xl bg-space-850/80 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        Sunlight
                      </span>
                      <span className="font-mono text-amber-300 font-bold">
                        {metrics.sunlight_percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${metrics.sunlight_percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Earth Comms */}
                  <div className="p-2.5 rounded-xl bg-space-850/80 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Radio className="w-3.5 h-3.5 text-cyan-400" />
                        Earth DTE
                      </span>
                      <span className="font-mono text-cyan-300 font-bold">
                        {metrics.comms_percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${metrics.comms_percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Slope Risk */}
                  <div className="p-2.5 rounded-xl bg-space-850/80 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Mountain className="w-3.5 h-3.5 text-indigo-400" />
                        Slope
                      </span>
                      <span className="font-mono font-bold text-[10px] text-slate-300">
                        {res.avg_slope_deg}°
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {res.avg_slope_deg < 7 ? 'Safe terrain' : 'Requires Hazard Avoidance'}
                    </div>
                  </div>

                  {/* PSR Distance */}
                  <div className="p-2.5 rounded-xl bg-space-850/80 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Droplets className="w-3.5 h-3.5 text-blue-400" />
                        PSR Ice
                      </span>
                      <span className="font-mono text-blue-300 font-bold">
                        {res.psr_distance_km < 10 ? `${res.psr_distance_km} km` : '>100 km'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {res.psr_distance_km < 1.0 ? 'Direct rover reach' : 'Sortie distance'}
                    </div>
                  </div>
                </div>
              </div>

              {/* External NASA Resource Links & Modal Trigger */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <a
                    href={res.quickmap_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-0.5 text-[10px] text-slate-400 hover:text-cyan-400 transition"
                    title="Inspect in ASU LROC Quickmap"
                  >
                    <span>Quickmap</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <span className="text-slate-600">•</span>
                  <a
                    href={res.moon_trek_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-0.5 text-[10px] text-slate-400 hover:text-cyan-400 transition"
                    title="Inspect in NASA Moon Trek"
                  >
                    <span>Moon Trek</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenSiteDetails) onOpenSiteDetails(res);
                  }}
                  className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline"
                >
                  <span>LOLA Topo</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
