import React from 'react';
import { Award, Sun, Radio, Mountain, Activity, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

export default function SuitabilityCard({ scoring, siteName }) {
  if (!scoring) return null;

  const {
    overall_suitability_score,
    rating,
    status,
    recommendation,
    weights
  } = scoring;

  const getStatusColor = (s) => {
    switch (s) {
      case 'GO':
        return {
          ring: 'text-emerald-400',
          bg: 'bg-emerald-950/70 border-emerald-700/80',
          text: 'text-emerald-300',
          badge: 'bg-emerald-500 text-slate-950'
        };
      case 'CAUTION':
        return {
          ring: 'text-amber-400',
          bg: 'bg-amber-950/70 border-amber-700/80',
          text: 'text-amber-300',
          badge: 'bg-amber-400 text-slate-950'
        };
      default:
        return {
          ring: 'text-rose-400',
          bg: 'bg-rose-950/70 border-rose-700/80',
          text: 'text-rose-300',
          badge: 'bg-rose-500 text-white'
        };
    }
  };

  const statusStyle = getStatusColor(status);

  return (
    <div className={`rounded-2xl border p-5 lg:p-6 shadow-xl ${statusStyle.bg} transition-all`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Score Block */}
        <div className="flex items-center gap-5">
          {/* Big Score Circle */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="7"
                fill="transparent"
                className="text-slate-800"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="7"
                fill="transparent"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * overall_suitability_score) / 100}
                strokeLinecap="round"
                className={`${statusStyle.ring} transition-all duration-1000`}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black text-white font-mono">
                {overall_suitability_score}
              </span>
              <span className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">
                / 100
              </span>
            </div>
          </div>

          {/* Decision Summary */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${statusStyle.badge}`}>
                MISSION STATUS: {status}
              </span>
              <span className="text-xs font-semibold text-slate-300">{rating}</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {siteName} Suitability Evaluation
            </h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {recommendation}
            </p>
          </div>
        </div>

        {/* Right 4-Factor Weighted Breakdown */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex-1 max-w-md space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Multi-Factor Weighted Formula</span>
            </span>
            <span className="text-[11px] font-mono text-cyan-400">Sum = 100%</span>
          </div>

          {/* 1. Sunlight 35% */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-300 flex items-center gap-1">
                <Sun className="w-3 h-3 text-amber-400" /> Sunlight Availability (35%)
              </span>
              <span className="font-mono text-white font-semibold">
                {weights.sunlight.subscore} pts → +{weights.sunlight.weighted_contribution}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div
                className="bg-amber-400 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, weights.sunlight.subscore)}%` }}
              />
            </div>
          </div>

          {/* 2. Earth Visibility 25% */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-300 flex items-center gap-1">
                <Radio className="w-3 h-3 text-cyan-400" /> Earth Visibility / Comms (25%)
              </span>
              <span className="font-mono text-white font-semibold">
                {weights.earth_visibility.subscore} pts → +{weights.earth_visibility.weighted_contribution}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div
                className="bg-cyan-400 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, weights.earth_visibility.subscore)}%` }}
              />
            </div>
          </div>

          {/* 3. Slope 25% */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-300 flex items-center gap-1">
                <Mountain className="w-3 h-3 text-emerald-400" /> Terrain Slope Safety (25%)
              </span>
              <span className="font-mono text-white font-semibold">
                {weights.terrain_slope.subscore} pts → +{weights.terrain_slope.weighted_contribution}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div
                className="bg-emerald-400 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, weights.terrain_slope.subscore)}%` }}
              />
            </div>
          </div>

          {/* 4. Elevation Variation 15% */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-300 flex items-center gap-1">
                <Activity className="w-3 h-3 text-purple-400" /> Elevation Smoothness (15%)
              </span>
              <span className="font-mono text-white font-semibold">
                {weights.elevation_variation.subscore} pts → +{weights.elevation_variation.weighted_contribution}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div
                className="bg-purple-400 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, weights.elevation_variation.subscore)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
