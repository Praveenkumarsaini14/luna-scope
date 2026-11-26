import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { Clock, Sun, Radio, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function TimelineChart({
  activeSite,
  allSitesData,
  activeChartSiteId,
  setActiveChartSiteId,
  currentStep,
  mode
}) {
  if (!activeSite || !activeSite.timeline) return null;

  const timeline = activeSite.timeline;
  const metrics = activeSite.metrics;

  const CustomTimelineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-space-950/95 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs font-mono backdrop-blur-md">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-2 flex items-center justify-between gap-4">
            <span className="text-cyan-400">Hour {data.hour} ({data.timestamp.replace('T', ' ')})</span>
            <span className="text-slate-400 text-[10px]">T+{Math.floor(data.hour / 24)}d {data.hour % 24}h</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-2">
            <div>
              <span className="text-slate-400 block text-[10px]">SUN POSITION</span>
              <span className="font-bold text-amber-300">
                El: {data.sun_elevation > 0 ? `+${data.sun_elevation}` : data.sun_elevation}°
              </span>
              <span className="text-slate-500 text-[10px] block">Az: {data.sun_azimuth}° (Mask: +{data.horizon_at_sun_az}°)</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">EARTH POSITION</span>
              <span className="font-bold text-cyan-300">
                El: {data.earth_elevation > 0 ? `+${data.earth_elevation}` : data.earth_elevation}°
              </span>
              <span className="text-slate-500 text-[10px] block">Az: {data.earth_azimuth}° (Mask: +{data.horizon_at_earth_az}°)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400">Power:</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  data.is_sunlit
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                }`}
              >
                {data.power_status}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400">Comms:</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  data.is_dte_active
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                    : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                }`}
              >
                {data.comms_status}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-space-900 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl mb-6">
      {/* Title & Site Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Hourly Power & Comms Telemetry Timeline
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/30 text-amber-300">
              {timeline.length} Hourly Epochs
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'planner'
              ? 'Dynamic elevation curves compared against terrain rim thresholds. Values above the zero/threshold lines enable solar charging and Direct-To-Earth downlink.'
              : 'Watch the yellow line (Sun) and blue line (Earth) as time progresses. Any time a line is high, the lander has electricity or radio reception!'}
          </p>
        </div>

        {/* Site Switcher Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {allSitesData.map((s) => (
            <button
              key={s.site_id}
              onClick={() => setActiveChartSiteId(s.site_id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition ${
                activeChartSiteId === s.site_id
                  ? 'bg-cyan-500 text-black font-bold shadow-md'
                  : 'bg-space-850 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {s.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Telemetry Summary Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 p-3 rounded-xl bg-space-950/70 border border-slate-800/80 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400" />
          <div>
            <span className="text-slate-400 block text-[10px]">SOLAR HARVEST</span>
            <span className="font-bold text-amber-300">
              {metrics.sunlight_percentage}% ({Math.round((metrics.sunlight_percentage / 100) * timeline.length)}h)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          <div>
            <span className="text-slate-400 block text-[10px]">DTE COMMS UPTIME</span>
            <span className="font-bold text-cyan-300">
              {metrics.comms_percentage}% ({Math.round((metrics.comms_percentage / 100) * timeline.length)}h)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <div>
            <span className="text-slate-400 block text-[10px]">MAX COMMS BLACKOUT</span>
            <span className="font-bold text-rose-300">{metrics.longest_blackout_hours}h continuous</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-slate-400 block text-[10px]">MAX SOLAR WINDOW</span>
            <span className="font-bold text-emerald-300">{metrics.longest_sunlight_window_hours}h continuous</span>
          </div>
        </div>
      </div>

      {/* Hourly Timeline Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={timeline} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

            <XAxis
              dataKey="hour"
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickFormatter={(hour) => `T+${Math.floor(hour / 24)}d`}
              interval={Math.max(1, Math.floor(timeline.length / 8))}
            />

            <YAxis
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              domain={[-6, 12]}
              tickFormatter={(val) => `${val}°`}
            />

            <ReferenceLine y={0} stroke="#475569" strokeDasharray="4 4" label={{ value: '0° Horizon', fill: '#64748b', fontSize: 10, position: 'right' }} />

            {/* Current Playback Cursor */}
            {currentStep && (
              <ReferenceLine
                x={currentStep.hour}
                stroke="#38bdf8"
                strokeWidth={2}
                label={{ value: `T+${currentStep.hour}h`, fill: '#38bdf8', fontSize: 10, position: 'insideTopLeft' }}
              />
            )}

            <Tooltip content={<CustomTimelineTooltip />} />

            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontFamily: 'monospace' }}
            />

            <Line
              type="monotone"
              dataKey="sun_elevation"
              name="Sun Elevation (°)"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="earth_elevation"
              name="Earth Elevation (°)"
              stroke="#38bdf8"
              strokeWidth={2.5}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="horizon_at_sun_az"
              name="Crater Mask at Sun Azimuth"
              stroke="#64748b"
              strokeDasharray="3 3"
              strokeWidth={1.5}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
