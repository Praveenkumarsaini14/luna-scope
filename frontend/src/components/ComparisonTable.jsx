import React from 'react';
import { Award, Sun, Radio, Mountain, CheckCircle2, AlertTriangle, ArrowRight, Check } from 'lucide-react';

export default function ComparisonTable({ comparisonData, onSelectSite }) {
  if (!comparisonData || !comparisonData.comparison) return null;

  const { comparison, top_recommendation, start_date, duration_days } = comparisonData;

  return (
    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl space-y-6">
      {/* Title & Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Award className="w-4 h-4" />
            </span>
            <span>4. Candidate Landing Sites Comparison Matrix</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Side-by-side trade-off evaluation over {duration_days} days starting {start_date}
          </p>
        </div>

        {/* Top Site Callout */}
        {top_recommendation && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-700/80 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Top Ranked: {top_recommendation}</span>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold font-mono text-[11px]">
              <th className="py-3 px-4">Landing Site</th>
              <th className="py-3 px-3 text-center">Sunlight (35%)</th>
              <th className="py-3 px-3 text-center">Earth Comms (25%)</th>
              <th className="py-3 px-3 text-center">Mean Slope (25%)</th>
              <th className="py-3 px-3 text-center">Elevation Var (15%)</th>
              <th className="py-3 px-4 text-center">Suitability Score</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300 font-medium">
            {comparison.map((site, idx) => {
              const isTop = idx === 0;
              return (
                <tr
                  key={site.site_id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    isTop ? 'bg-cyan-950/20' : ''
                  }`}
                >
                  {/* Site Name & Region */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {isTop && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
                      )}
                      <div>
                        <span className="font-bold text-white text-sm block">
                          {site.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {site.coordinates} • {site.region}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Sunlight */}
                  <td className="py-3 px-3 text-center font-mono">
                    <span className="font-bold text-amber-400">{site.sunlight_pct}%</span>
                    <span className="text-[10px] text-slate-400 block">{site.sunlight_hours}h</span>
                  </td>

                  {/* Earth Comms */}
                  <td className="py-3 px-3 text-center font-mono">
                    <span className="font-bold text-cyan-400">{site.earth_visibility_pct}%</span>
                    <span className="text-[10px] text-slate-400 block">{site.earth_hours || site.earth_visibility_hours}h</span>
                  </td>

                  {/* Slope */}
                  <td className="py-3 px-3 text-center font-mono">
                    <span className="font-bold text-white">{site.mean_slope_deg}°</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-semibold inline-block mt-0.5 ${
                        site.terrain_safety === 'SAFE'
                          ? 'bg-emerald-950/80 text-emerald-400'
                          : site.terrain_safety === 'MODERATE'
                          ? 'bg-amber-950/80 text-amber-400'
                          : 'bg-rose-950/80 text-rose-400'
                      }`}
                    >
                      {site.terrain_safety}
                    </span>
                  </td>

                  {/* Elevation Variation */}
                  <td className="py-3 px-3 text-center font-mono text-slate-300">
                    <span>{site.elevation_variation_m}m</span>
                  </td>

                  {/* Score */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-base font-black text-white font-mono">
                        {site.suitability_score}
                      </span>
                      <div className="w-12 bg-slate-800 rounded-full h-1.5 hidden sm:block">
                        <div
                          className={`h-1.5 rounded-full ${
                            site.suitability_score >= 80
                              ? 'bg-emerald-400'
                              : site.suitability_score >= 65
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                          }`}
                          style={{ width: `${Math.min(100, site.suitability_score)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        site.status === 'GO'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : site.status === 'CAUTION'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {site.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectSite(site.site_id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-white text-cyan-300 font-medium text-[11px] border border-slate-700 hover:border-cyan-500 transition-all inline-flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Trade-off Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 space-y-1.5 text-xs">
          <span className="font-bold text-amber-400 flex items-center gap-1 font-mono">
            <Sun className="w-3.5 h-3.5" /> Connecting Ridge Advantage
          </span>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            High sunlight uptime with the flattest terrain in the south pole region (3.2° average slope).
            Ideal for robotic rovers and landers with modest landing leg margins.
          </p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 space-y-1.5 text-xs">
          <span className="font-bold text-cyan-400 flex items-center gap-1 font-mono">
            <Radio className="w-3.5 h-3.5" /> Shackleton Rim Advantage
          </span>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Higher Earth visibility (85.1%) and immediate proximity to water-ice volatiles trapped
            inside the permanently shadowed crater floor (1.2 km).
          </p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 space-y-1.5 text-xs">
          <span className="font-bold text-emerald-400 flex items-center gap-1 font-mono">
            <Mountain className="w-3.5 h-3.5" /> Malapert Massif Advantage
          </span>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Towering 5,000m peak facing Earth provides near-uninterrupted line-of-sight communication
            (100%), but features higher slope (7.8°) on approach.
          </p>
        </div>
      </div>
    </section>
  );
}
