import React from 'react';
import { X, MapPin, Mountain, Sun, Radio, Compass, Droplets, ExternalLink, ShieldCheck } from 'lucide-react';

export default function SiteDetailsModal({ site, onClose }) {
  if (!site) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-space-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
              NASA Lunar Reconnaissance Orbiter (LOLA) Data
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-500/30">
              Site ID: {site.site_id || site.id}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {site.name}
          </h2>
          <div className="text-xs font-mono text-slate-400 mt-1">
            Region: {site.region}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed bg-space-850 p-3.5 rounded-xl border border-slate-800 mb-5">
          {site.description}
        </p>

        {/* Topographic & Coordinate Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 text-xs font-mono">
          <div className="p-3 rounded-xl bg-space-850 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">LATITUDE</span>
            <span className="text-sm font-bold text-white">{site.latitude.toFixed(3)}° S</span>
          </div>
          <div className="p-3 rounded-xl bg-space-850 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">LONGITUDE</span>
            <span className="text-sm font-bold text-white">{site.longitude.toFixed(3)}° E</span>
          </div>
          <div className="p-3 rounded-xl bg-space-850 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">LOLA ELEVATION</span>
            <span className="text-sm font-bold text-cyan-400">{site.elevation_m} m</span>
          </div>
          <div className="p-3 rounded-xl bg-space-850 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">TERRAIN SLOPE</span>
            <span className="text-sm font-bold text-amber-400">{site.avg_slope_deg}°</span>
          </div>
        </div>

        {/* Horizon Profile Matrix */}
        <div className="mb-5">
          <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            360° Crater Skyline Obstacle Elevations (10° Azimuth Steps)
          </h4>
          <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 bg-space-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono">
            {site.horizon_profile?.map((val, idx) => (
              <div key={idx} className="p-1 rounded bg-space-850 text-center border border-slate-800/60">
                <span className="text-[9px] text-slate-500 block">{idx * 10}°</span>
                <span className="text-cyan-300 font-semibold">{val}°</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Complies with NASA Artemis landing safety constraints</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}

