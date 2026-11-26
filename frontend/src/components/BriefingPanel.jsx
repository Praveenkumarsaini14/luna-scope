import React from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Zap,
  Globe2,
  Compass
} from 'lucide-react';

export default function BriefingPanel({ briefing, mode }) {
  if (!briefing) return null;

  const planner = briefing.mission_planner_briefing;
  const educator = briefing.educator_student_briefing;
  const slip = planner?.launch_slip_impact;

  return (
    <div className="bg-space-900 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl mb-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white font-mono tracking-tight">
            {mode === 'planner'
              ? 'Mission Architecture Briefing & Sensitivity Analysis'
              : 'Educational Guide: The Science Behind Lunar Landing Sites'}
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Target Window: {briefing.epoch?.start_date} ({briefing.epoch?.days} Days)
        </span>
      </div>

      {mode === 'planner' ? (
        /* MISSION PLANNER MODE CONTENT */
        <div className="space-y-6">
          {/* Primary Recommendation Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-space-850 border border-cyan-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 uppercase font-semibold">
                  Primary Recommendation
                </span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {planner.primary_status} ({planner.primary_score}/100)
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {planner.primary_recommendation}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                {planner.rationale}
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Landing Risk</span>
                <span className="text-xs font-mono font-bold text-emerald-400">NOMINAL CORRIDOR</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-bold">
                ✓
              </div>
            </div>
          </div>

          {/* Launch Slip Sensitivity Analysis (+5 Days) */}
          {slip && (
            <div className="p-4 rounded-xl bg-space-850 border border-amber-500/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-amber-300 font-mono">
                    Launch Window Slip Analysis (+5 Day Delay)
                  </h4>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Simulated Epoch: {briefing.epoch?.slipped_date}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 pt-1">
                <div className="p-3 rounded-lg bg-space-900 border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 block mb-0.5">Sunlight Uptime Shift</span>
                  <div className="flex items-center gap-2">
                    {slip.sunlight_change_pct >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-rose-400" />
                    )}
                    <span className={`text-base font-bold font-mono ${slip.sunlight_change_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {slip.sunlight_change_pct >= 0 ? `+${slip.sunlight_change_pct}` : slip.sunlight_change_pct}%
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-space-900 border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 block mb-0.5">Earth Comms Line-of-Sight Shift</span>
                  <div className="flex items-center gap-2">
                    {slip.comms_change_pct >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-rose-400" />
                    )}
                    <span className={`text-base font-bold font-mono ${slip.comms_change_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {slip.comms_change_pct >= 0 ? `+${slip.comms_change_pct}` : slip.comms_change_pct}%
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-space-900 border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 block mb-0.5">Libration Phase Delta</span>
                  <span className="text-xs font-mono font-semibold text-cyan-300">
                    ΔSub-Earth: ~1.8° tilt shift
                  </span>
                  <span className="text-[10px] text-slate-500 block">Alters crater skyline clearance</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                <strong>Flight Dynamics Verdict:</strong> {slip.assessment}
              </p>
            </div>
          )}

          {/* Site-by-site Tradeoff Table */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Side-by-Side Trade-off Decision Matrix
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-space-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Landing Site</th>
                    <th className="py-2.5 px-3">Sunlight</th>
                    <th className="py-2.5 px-3">Earth Comms</th>
                    <th className="py-2.5 px-3">Max Blackout</th>
                    <th className="py-2.5 px-3">Slope</th>
                    <th className="py-2.5 px-3">PSR Ice Dist</th>
                    <th className="py-2.5 px-3">Readiness</th>
                    <th className="py-2.5 px-3">Planner Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-space-900/60">
                  {planner.site_tradeoffs?.map((site) => (
                    <tr key={site.site_id} className="hover:bg-space-850/60 transition">
                      <td className="py-2.5 px-3 font-bold text-white whitespace-nowrap">{site.name}</td>
                      <td className="py-2.5 px-3 text-amber-300 font-semibold">{site.sunlight_pct}%</td>
                      <td className="py-2.5 px-3 text-cyan-300 font-semibold">{site.comms_pct}%</td>
                      <td className="py-2.5 px-3 text-rose-300">{site.longest_blackout_hours}h</td>
                      <td className="py-2.5 px-3 text-slate-300">{site.slope_deg}°</td>
                      <td className="py-2.5 px-3 text-blue-300">{site.psr_dist_km} km</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            site.status === 'GO'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                              : site.status === 'CAUTION'
                              ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                              : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                          }`}
                        >
                          {site.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap font-semibold">
                        <span
                          className={
                            site.verdict === 'RECOMMENDED'
                              ? 'text-cyan-400 font-bold'
                              : site.verdict === 'VIABLE CONTENDER'
                              ? 'text-slate-300'
                              : 'text-rose-400'
                          }
                        >
                          {site.verdict}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* EDUCATOR & STUDENT MODE CONTENT */
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-space-850 border border-cyan-500/30 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-white font-mono">
                {educator.title}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Learn the celestial mechanics, physics, and lunar geology shaping the Artemis missions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {educator.key_concepts?.map((c, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-space-900 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold">
                    {idx + 1}
                  </div>
                  <h4 className="text-sm font-bold text-cyan-300">
                    {c.concept}
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {c.explanation}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-200">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-cyan-400" />
              <span>
                <strong>Did you know?</strong> Because the Moon is tidally locked to Earth, one hemisphere always faces us. At the Lunar South Pole, Earth hangs right on the horizon like a blue marble that never rises or sets!
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

