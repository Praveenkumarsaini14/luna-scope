import React from 'react';
import { X, Printer, Download, ShieldCheck, Calendar, MapPin, Award } from 'lucide-react';

export default function ExportReportModal({ isOpen, onClose, briefing, simResults, startDate, durationDays }) {
  if (!isOpen || !briefing) return null;

  const planner = briefing.mission_planner_briefing;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        className="bg-space-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto print:bg-white print:text-black print:border-none print:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-slate-800 print:border-black pb-4 mb-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-1">
                NASA Space Apps Challenge 2026
              </span>
              <h2 className="text-xl font-bold text-white print:text-black">
                Lunar Landing Site Feasibility Assessment
              </h2>
              <div className="text-xs font-mono text-slate-400 print:text-slate-600 mt-1">
                Mission Epoch: {startDate} • Duration: {durationDays} Days ({durationDays * 24} Hours)
              </div>
            </div>
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-4 rounded-xl bg-space-850 print:bg-slate-100 border border-slate-800 print:border-slate-300 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white print:text-black font-mono uppercase">
              Executive Recommendation
            </h3>
          </div>
          <div className="text-xs font-mono mb-2">
            <strong>Selected Primary Site:</strong> <span className="text-cyan-400 print:text-blue-700 font-bold">{planner?.primary_recommendation}</span> ({planner?.primary_status} - Score: {planner?.primary_score}/100)
          </div>
          <p className="text-xs text-slate-300 print:text-slate-800 leading-relaxed font-mono">
            {planner?.rationale}
          </p>
        </div>

        {/* Sensitivity Slip Analysis */}
        {planner?.launch_slip_impact && (
          <div className="p-4 rounded-xl bg-space-850 print:bg-slate-100 border border-slate-800 print:border-slate-300 mb-5 text-xs font-mono">
            <h4 className="font-bold text-amber-400 print:text-amber-800 uppercase mb-2">
              Launch Window Sensitivity: {planner.launch_slip_impact.scenario}
            </h4>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <span className="text-slate-400 print:text-slate-600 block text-[10px]">Solar Uptime Delta:</span>
                <span className="font-bold text-white print:text-black">
                  {planner.launch_slip_impact.sunlight_change_pct > 0 ? '+' : ''}{planner.launch_slip_impact.sunlight_change_pct}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 print:text-slate-600 block text-[10px]">Earth Comms Delta:</span>
                <span className="font-bold text-white print:text-black">
                  {planner.launch_slip_impact.comms_change_pct > 0 ? '+' : ''}{planner.launch_slip_impact.comms_change_pct}%
                </span>
              </div>
            </div>
            <p className="text-slate-300 print:text-slate-800 text-[11px] leading-relaxed">
              {planner.launch_slip_impact.assessment}
            </p>
          </div>
        )}

        {/* Site Comparison Table */}
        <div className="mb-6">
          <h4 className="text-xs font-mono font-bold uppercase text-slate-400 print:text-black mb-2">
            Evaluated Landing Sites Telemetry Matrix
          </h4>
          <div className="overflow-x-auto border border-slate-800 print:border-black rounded-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-space-950 print:bg-slate-200 text-slate-400 print:text-black text-[10px] uppercase border-b border-slate-800 print:border-black">
                <tr>
                  <th className="p-2.5">Site Name</th>
                  <th className="p-2.5">Sunlight</th>
                  <th className="p-2.5">Earth DTE</th>
                  <th className="p-2.5">Max Blackout</th>
                  <th className="p-2.5">Slope</th>
                  <th className="p-2.5">PSR Ice Dist</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                {planner?.site_tradeoffs?.map((s) => (
                  <tr key={s.site_id}>
                    <td className="p-2.5 font-bold text-white print:text-black">{s.name}</td>
                    <td className="p-2.5 text-amber-300 print:text-amber-800">{s.sunlight_pct}%</td>
                    <td className="p-2.5 text-cyan-300 print:text-blue-800">{s.comms_pct}%</td>
                    <td className="p-2.5 text-rose-300 print:text-red-800">{s.longest_blackout_hours}h</td>
                    <td className="p-2.5">{s.slope_deg}°</td>
                    <td className="p-2.5">{s.psr_dist_km} km</td>
                    <td className="p-2.5 font-bold">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 print:border-black text-[11px] font-mono text-slate-500 print:text-slate-700 flex items-center justify-between">
          <span>Generated by NASA Space Apps Challenge 2026: Lunar Landing Site Navigator</span>
          <span className="print:hidden">Ready for Mission Operations Review</span>
        </div>
      </div>
    </div>
  );
}
