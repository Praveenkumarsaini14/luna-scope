import React from 'react';
import { Mountain, ShieldCheck, AlertTriangle, AlertOctagon, TrendingUp, Layers } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function TerrainAnalysis({ terrain }) {
  if (!terrain) return null;

  const {
    mean_slope_deg,
    max_slope_deg,
    min_elevation_m,
    max_elevation_m,
    elevation_variation_m,
    roughness_std_m,
    safety_status,
    safety_description,
    profile
  } = terrain;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SAFE':
        return {
          bg: 'bg-emerald-950/70 border-emerald-800/80 text-emerald-300',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-950/70 border-amber-800/80 text-amber-300',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />
        };
      default:
        return {
          bg: 'bg-rose-950/70 border-rose-800/80 text-rose-300',
          icon: <AlertOctagon className="w-4 h-4 text-rose-400" />
        };
    }
  };

  const badge = getStatusBadge(safety_status);

  return (
    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Mountain className="w-4 h-4" />
            </span>
            <span>3. Terrain Analysis (LOLA DEM Topography)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            LRO Lunar Orbiter Laser Altimeter digital elevation model slope & surface roughness evaluation
          </p>
        </div>

        {/* Safety Badge */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold ${badge.bg}`}>
          {badge.icon}
          <span>{safety_status} LANDING TERRAIN</span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Mean Slope */}
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 space-y-1">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Average Slope
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-white font-mono">{mean_slope_deg}°</span>
            <span className="text-[11px] text-emerald-400">nominal</span>
          </div>
          <span className="text-[10px] text-slate-400 block">NASA limit: &lt; 8° safe</span>
        </div>

        {/* Max Slope */}
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 space-y-1">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Max Slope Peak
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-amber-300 font-mono">{max_slope_deg}°</span>
            <span className="text-[11px] text-slate-400">in ellipse</span>
          </div>
          <span className="text-[10px] text-slate-400 block">Critical abort: &gt; 15°</span>
        </div>

        {/* Elevation Variation */}
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 space-y-1">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Elevation Variation (Δh)
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-cyan-300 font-mono">{elevation_variation_m}m</span>
          </div>
          <span className="text-[10px] text-slate-400 block">Range: {min_elevation_m}m to {max_elevation_m}m</span>
        </div>

        {/* Roughness */}
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 space-y-1">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Roughness Index (σ)
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-200 font-mono">±{roughness_std_m}m</span>
          </div>
          <span className="text-[10px] text-slate-400 block">Standard dev of elevation</span>
        </div>
      </div>

      {/* Safety Summary Banner */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-3.5 flex items-start gap-3">
        <TrendingUp className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="text-slate-200 font-medium">{safety_description}</p>
          <p className="text-slate-400 leading-relaxed">
            Lunar landing gear is designed with strict tip-over stability angles (typically 12° to 15°).
            Low slope zones minimize leg compression stress and prevent roll hazard during descent engine cutoff.
          </p>
        </div>
      </div>

      {/* Cross-section Transect Elevation Profile */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">
            Landing Ellipse Cross-Section Profile (400m Transect)
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Derived from 20m LOLA DEM Grid
          </span>
        </div>

        <div className="h-44 sm:h-52 w-full bg-slate-950/60 rounded-xl p-3 border border-slate-800">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={profile} margin={{ top: 10, right: 15, left: -5, bottom: 0 }}>
              <defs>
                <linearGradient id="terrainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="distance_m"
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                unit="m"
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                domain={['auto', 'auto']}
                unit="m"
              />
              <Tooltip
                formatter={(val) => [`${val} m`, 'Elevation']}
                labelFormatter={(label) => `Distance: ${label}m from center`}
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
              />
              <Area
                type="monotone"
                dataKey="elevation_m"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#terrainGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
