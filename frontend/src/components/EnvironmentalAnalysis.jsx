import React from 'react';
import { Sun, Radio, Eye, Compass, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';

export default function EnvironmentalAnalysis({ analysis }) {
  if (!analysis) return null;

  const { environmental_analysis, site, parameters } = analysis;
  const {
    sunlight_percentage,
    sunlight_hours,
    earth_visibility_percentage,
    earth_visibility_hours,
    total_mission_hours,
    sun_crossings,
    earth_crossings,
    time_series
  } = environmental_analysis;

  // Custom chart tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1.5 font-mono">
          <p className="font-semibold text-slate-200 border-b border-slate-800 pb-1">
            {dataPoint.timestamp} ({dataPoint.hours}h elapsed)
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-amber-400 flex items-center gap-1">
              <Sun className="w-3 h-3" /> Sun Elevation:
            </span>
            <span className="font-bold text-white">
              {dataPoint.sun_elevation_deg}°{' '}
              <span className={`text-[10px] px-1 py-0.2 rounded ${dataPoint.is_sunlit ? 'bg-emerald-900/80 text-emerald-300' : 'bg-rose-900/80 text-rose-300'}`}>
                {dataPoint.is_sunlit ? 'SUNLIT' : 'SHADOW'}
              </span>
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-cyan-400 flex items-center gap-1">
              <Radio className="w-3 h-3" /> Earth Elevation:
            </span>
            <span className="font-bold text-white">
              {dataPoint.earth_elevation_deg}°{' '}
              <span className={`text-[10px] px-1 py-0.2 rounded ${dataPoint.is_earth_visible ? 'bg-emerald-900/80 text-emerald-300' : 'bg-rose-900/80 text-rose-300'}`}>
                {dataPoint.is_earth_visible ? 'VISIBLE' : 'OCCULTED'}
              </span>
            </span>
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
            Azimuth: Sun {dataPoint.sun_azimuth_deg}° | Earth {dataPoint.earth_azimuth_deg}°
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl space-y-6">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sun className="w-4 h-4" />
            </span>
            <span>2. Environmental Analysis (Sun & Earth Ephemeris)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            NASA JPL Horizons 7-day orbital analysis sampled every 30 minutes (336 time steps)
          </p>
        </div>

        {/* Interpolation Tag */}
        <div className="flex items-center gap-1.5 text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-3 py-1.5 rounded-lg font-mono">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Linear Interpolation for 0° Crossing</span>
        </div>
      </div>

      {/* KPI Cards: Sunlight vs Earth Visibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sunlight Card */}
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Sun className="w-4 h-4" />
              <span>Sunlight Availability</span>
            </span>
            <span className="text-xs font-mono text-slate-400">
              {sunlight_hours}h / {total_mission_hours}h
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {sunlight_percentage}%
            </span>
            <span className="text-xs text-slate-400">total mission daylight</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-2.5 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, sunlight_percentage)}%` }}
            />
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Powers solar panels and prevents deep cryogenic freezing. At this site, solar power is
            active for <strong className="text-amber-300 font-mono">{sunlight_percentage}%</strong> of
            the 7-day period.
          </p>
        </div>

        {/* Earth Visibility Card */}
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Radio className="w-4 h-4" />
              <span>Earth Visibility (Comms Window)</span>
            </span>
            <span className="text-xs font-mono text-slate-400">
              {earth_visibility_hours}h / {total_mission_hours}h
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {earth_visibility_percentage}%
            </span>
            <span className="text-xs text-slate-400">Direct-To-Earth line of sight</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-400 h-2.5 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, earth_visibility_percentage)}%` }}
            />
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Enables direct radio communication with NASA Deep Space Network without relay satellites.
            Earth is above the geometric horizon for{' '}
            <strong className="text-cyan-300 font-mono">{earth_visibility_percentage}%</strong> of the window.
          </p>
        </div>
      </div>

      {/* 7-Day Sun & Earth Elevation Line Chart */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
          <span className="font-semibold text-slate-300">
            7-Day Angular Elevation Timeline (Relative to Horizon)
          </span>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-400 inline-block" /> Sun Elevation (deg)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-cyan-400 inline-block" /> Earth Elevation (deg)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-b border-dashed border-rose-400 inline-block" /> 0° Horizon
            </span>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full bg-slate-950/60 rounded-xl p-3 border border-slate-800">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={time_series} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="timestamp"
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                interval={47} // roughly every 24 hours
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                domain={['auto', 'auto']}
                unit="°"
              />
              <Tooltip content={<CustomTooltip />} />
              {/* 0° Geometric Horizon Line */}
              <ReferenceLine
                y={0}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                label={{
                  value: '0° Horizon (Above = Visible, Below = Occluded)',
                  position: 'insideBottomRight',
                  fill: '#fb7185',
                  fontSize: 10
                }}
              />
              <Line
                type="monotone"
                dataKey="sun_elevation_deg"
                name="Sun Elevation"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="earth_elevation_deg"
                name="Earth Elevation"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Horizon Crossing Events (Linear Interpolation in Action) */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-2">
          <span>Detected Horizon Crossing Events (Estimated via Linear Interpolation)</span>
          <span className="text-[10px] text-slate-400 font-mono">
            {sun_crossings.length + earth_crossings.length} total events
          </span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {sun_crossings.length === 0 && earth_crossings.length === 0 && (
            <p className="text-xs text-slate-400 col-span-4 bg-slate-800/30 p-2.5 rounded-lg">
              No horizon crossings detected during this 7-day window; the celestial bodies remain
              continuously above or below the local horizon.
            </p>
          )}

          {sun_crossings.map((sc, idx) => (
            <div
              key={`sun-${idx}`}
              className="bg-slate-800/50 border border-amber-500/30 rounded-lg p-2.5 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 flex items-center gap-1 font-mono">
                  <Sun className="w-3 h-3" />
                  {sc.event}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">+{sc.hours_elapsed}h</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">{sc.timestamp}</p>
            </div>
          ))}

          {earth_crossings.map((ec, idx) => (
            <div
              key={`earth-${idx}`}
              className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-2.5 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-400 flex items-center gap-1 font-mono">
                  <Radio className="w-3 h-3" />
                  {ec.event}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">+{ec.hours_elapsed}h</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">{ec.timestamp}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
