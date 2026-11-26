import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { Mountain, Sun, Radio, Compass, Info } from 'lucide-react';

export default function HorizonChart({
  activeSite,
  allSitesData,
  activeChartSiteId,
  setActiveChartSiteId,
  currentStep,
  mode
}) {
  if (!activeSite) return null;

  const chartData = useMemo(() => {
    const horizon = activeSite.horizon_profile || [];
    const timeline = activeSite.timeline || [];

    const azimuthBins = [];

    for (let az = 0; az <= 360; az += 10) {
      const azMod = az % 360;
      const idx = Math.floor(azMod / 10);
      const frac = (azMod % 10) / 10;
      const nextIdx = (idx + 1) % 36;
      const horizonElev = Number(((1 - frac) * horizon[idx] + frac * horizon[nextIdx]).toFixed(2));

      const sunSamples = timeline.filter((t) => {
        const diff = Math.abs(t.sun_azimuth - azMod);
        return diff <= 5 || diff >= 355;
      });

      const earthSamples = timeline.filter((t) => {
        const diff = Math.abs(t.earth_azimuth - azMod);
        return diff <= 5 || diff >= 355;
      });

      let sunElev = null;
      if (sunSamples.length > 0) {
        const avg = sunSamples.reduce((acc, cur) => acc + cur.sun_elevation, 0) / sunSamples.length;
        sunElev = Number(avg.toFixed(2));
      }

      let earthElev = null;
      if (earthSamples.length > 0) {
        const avg = earthSamples.reduce((acc, cur) => acc + cur.earth_elevation, 0) / earthSamples.length;
        earthElev = Number(avg.toFixed(2));
      }

      let label = `${az}°`;
      if (az === 0 || az === 360) label = `${az}° (N)`;
      else if (az === 90) label = '90° (E)';
      else if (az === 180) label = '180° (S)';
      else if (az === 270) label = '270° (W)';

      azimuthBins.push({
        azimuth: az,
        azimuthLabel: label,
        crater_skyline: horizonElev,
        sun_path: sunElev,
        earth_path: earthElev,
      });
    }

    return azimuthBins;
  }, [activeSite]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const h = data.crater_skyline;
      const s = data.sun_path;
      const e = data.earth_path;

      const isSunBlocked = s !== null && s <= h;
      const isEarthBlocked = e !== null && e <= h;

      return (
        <div className="bg-space-950/95 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs font-mono backdrop-blur-md">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-2 flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Compass className="w-3.5 h-3.5" />
              Azimuth: {data.azimuthLabel}
            </span>
            <span className="text-slate-400 font-normal">360° Polar Scan</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400 flex items-center gap-1">
                <Mountain className="w-3 h-3 text-slate-400" />
                Crater Rim Obstacle:
              </span>
              <span className="font-bold text-slate-300">+{h}°</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-amber-400 flex items-center gap-1">
                <Sun className="w-3 h-3" />
                Sun Elevation:
              </span>
              <span className="font-bold">
                {s !== null ? (
                  <span className={isSunBlocked ? 'text-rose-400' : 'text-emerald-400'}>
                    {s > 0 ? `+${s}` : s}° ({isSunBlocked ? 'BLOCKED' : 'CLEAR'})
                  </span>
                ) : (
                  <span className="text-slate-600 font-normal">No transit in window</span>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-cyan-400 flex items-center gap-1">
                <Radio className="w-3 h-3" />
                Earth Elevation:
              </span>
              <span className="font-bold">
                {e !== null ? (
                  <span className={isEarthBlocked ? 'text-rose-400' : 'text-cyan-300'}>
                    {e > 0 ? `+${e}` : e}° ({isEarthBlocked ? 'OCCULTED' : 'DTE VISIBLE'})
                  </span>
                ) : (
                  <span className="text-slate-600 font-normal">Libration out of sector</span>
                )}
              </span>
            </div>
          </div>
        </div>
      );
    };
    return null;
  };

  return (
    <div className="bg-space-900 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl mb-6">
      {/* Header and site selector tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Mountain className="w-4 h-4 text-cyan-400" />
              360° Crater Horizon & Celestial Path Skyline
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/70 border border-blue-500/30 text-blue-300">
              LOLA 3D Horizon Mask
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'planner'
              ? `Topographic horizon obstacle profile for ${activeSite.name} with Sun and Earth trajectories overlaid.`
              : `The shaded grey area is the crater mountain skyline. Yellow and blue vertical lines indicate the current real-time Sun and Earth azimuths.`}
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

      {/* Recharts Skyline Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="terrainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#475569" stopOpacity={0.65} />
                <stop offset="100%" stopColor="#1e293b" stopOpacity={0.9} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

            <XAxis
              dataKey="azimuth"
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickFormatter={(az) => {
                if (az === 0) return '0° N';
                if (az === 90) return '90° E';
                if (az === 180) return '180° S';
                if (az === 270) return '270° W';
                if (az === 360) return '360° N';
                return `${az}°`;
              }}
              ticks={[0, 45, 90, 135, 180, 225, 270, 315, 360]}
            />

            <YAxis
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              domain={[-6, 12]}
              tickFormatter={(val) => `${val}°`}
            />

            <ReferenceLine y={0} stroke="#475569" strokeDasharray="4 4" label={{ value: '0° Flat Horizon', fill: '#64748b', fontSize: 10, position: 'right' }} />

            {/* Current Scrubbed Sun & Earth Azimuth Vertical Lines */}
            {currentStep && (
              <>
                <ReferenceLine
                  x={currentStep.sun_azimuth}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{ value: '☀️ Sun Azimuth', fill: '#fbbf24', fontSize: 10, position: 'top' }}
                />
                <ReferenceLine
                  x={currentStep.earth_azimuth}
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{ value: '🌍 Earth Azimuth', fill: '#38bdf8', fontSize: 10, position: 'top' }}
                />
              </>
            )}

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontFamily: 'monospace' }}
            />

            <Area
              type="monotone"
              dataKey="crater_skyline"
              name="Crater Rim Obstacle Skyline"
              stroke="#94a3b8"
              strokeWidth={2}
              fill="url(#terrainGrad)"
            />

            <Line
              type="monotone"
              dataKey="sun_path"
              name="Sun Trajectory (° El)"
              stroke="#fbbf24"
              strokeWidth={3}
              dot={{ r: 3, fill: '#f59e0b', strokeWidth: 1 }}
              connectNulls
            />

            <Line
              type="monotone"
              dataKey="earth_path"
              name="Earth DTE Path (° El)"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={{ r: 4, fill: '#0284c7', strokeWidth: 2, stroke: '#e0f2fe' }}
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          <strong className="text-slate-300">Physical Insight:</strong> As you drag the Mission Scrubber above, watch the vertical dashed lines move across azimuths. Notice where the Sun line (yellow) or Earth line (blue) intersects peaks in the grey shaded obstacle profile!
        </span>
      </div>
    </div>
  );
}
