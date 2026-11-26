import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Sun, Radio, Clock, AlertTriangle, ShieldCheck, BatteryCharging } from 'lucide-react';

export default function MissionScrubber({
  timeline,
  activeHour,
  setActiveHour,
  siteName,
  mode
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 1 = 1h/sec, 6 = 6h/sec, 24 = 24h/sec

  if (!timeline || timeline.length === 0) return null;

  const totalHours = timeline.length;
  const currentStep = timeline[Math.min(activeHour, totalHours - 1)] || timeline[0];

  // Playback timer loop
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveHour((prev) => {
          if (prev >= totalHours - 1) {
            setIsPlaying(false);
            return totalHours - 1;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, totalHours, setActiveHour]);

  const daysOffset = Math.floor(currentStep.hour / 24);
  const hoursOffset = currentStep.hour % 24;

  const timeToSunset = currentStep.time_to_sunset_hours;
  const timeToSunrise = currentStep.time_to_sunrise_hours;
  const timeToEarthset = currentStep.time_to_earthset_hours;
  const timeToEarthrise = currentStep.time_to_earthrise_hours;

  return (
    <div className="bg-space-900 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl mb-6">
      {/* Header with Title and Current Epoch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Temporal Dynamics & Mission Scrubber
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
              {siteName}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'planner'
              ? 'Scrub through the mission timeline or click Play to animate Sun and Earth orbital trajectories across the local horizon in real time.'
              : 'Drag the slider below to see how day and night shift across the Moon. Notice how quickly solar power and radio signal to Earth cut out!'}
          </p>
        </div>

        {/* Live Mission Clock Badge */}
        <div className="flex items-center gap-2 bg-space-850 border border-slate-700/80 px-3 py-1.5 rounded-xl font-mono text-xs">
          <span className="text-slate-400">EPOCH:</span>
          <span className="text-white font-bold">{currentStep.timestamp?.replace('T', ' ')} UTC</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-950 text-cyan-400 text-[10px] font-bold">
            T+{daysOffset}d {hoursOffset}h
          </span>
        </div>
      </div>

      {/* Real-time Sunset & Earthset Countdown Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* 1. Sunset / Sunrise Countdown */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between ${
          currentStep.is_sunlit
            ? 'bg-amber-950/40 border-amber-500/40'
            : 'bg-rose-950/40 border-rose-500/40'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="flex items-center gap-1.5 font-bold text-amber-300">
              <Sun className="w-4 h-4" />
              {currentStep.is_sunlit ? 'POWER: SUNLIT' : 'POWER: SHADOW / NIGHT'}
            </span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
              currentStep.is_sunlit ? 'bg-amber-400 text-black' : 'bg-rose-500 text-white'
            }`}>
              {currentStep.is_sunlit ? 'GENERATING' : 'BATTERY ONLY'}
            </span>
          </div>
          <div className="mt-1">
            {currentStep.is_sunlit ? (
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Time to Sunset</span>
                <span className="text-lg font-bold font-mono text-amber-200">
                  {timeToSunset !== null ? `${timeToSunset} Hours` : '> Sim End'}
                </span>
              </div>
            ) : (
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Time to Sunrise</span>
                <span className="text-lg font-bold font-mono text-rose-300">
                  {timeToSunrise !== null ? `${timeToSunrise} Hours` : '> Sim End'}
                </span>
              </div>
            )}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Sun Elevation: {currentStep.sun_elevation > 0 ? `+${currentStep.sun_elevation}` : currentStep.sun_elevation}° (Az: {currentStep.sun_azimuth}°)
          </div>
        </div>

        {/* 2. Earthset / Earthrise Countdown */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between ${
          currentStep.is_dte_active
            ? 'bg-cyan-950/40 border-cyan-500/40'
            : 'bg-rose-950/40 border-rose-500/40'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="flex items-center gap-1.5 font-bold text-cyan-300">
              <Radio className="w-4 h-4" />
              {currentStep.is_dte_active ? 'COMMS: DTE ACTIVE' : 'COMMS: BLACKOUT'}
            </span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
              currentStep.is_dte_active ? 'bg-cyan-400 text-black' : 'bg-rose-500 text-white'
            }`}>
              {currentStep.is_dte_active ? 'ONLINE' : 'BLOCKED'}
            </span>
          </div>
          <div className="mt-1">
            {currentStep.is_dte_active ? (
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Time to Earthset</span>
                <span className="text-lg font-bold font-mono text-cyan-200">
                  {timeToEarthset !== null ? `${timeToEarthset} Hours` : '> Sim End'}
                </span>
              </div>
            ) : (
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Time to Earthrise</span>
                <span className="text-lg font-bold font-mono text-rose-300">
                  {timeToEarthrise !== null ? `${timeToEarthrise} Hours` : '> Sim End'}
                </span>
              </div>
            )}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Earth Elevation: {currentStep.earth_elevation > 0 ? `+${currentStep.earth_elevation}` : currentStep.earth_elevation}° (Az: {currentStep.earth_azimuth}°)
          </div>
        </div>

        {/* 3. Solar Array Incidence & Harvesting Efficiency */}
        <div className="p-3 rounded-xl bg-space-850 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono mb-1 text-slate-300">
            <span className="flex items-center gap-1.5">
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
              Solar Incident Factor
            </span>
            <span className="font-bold text-emerald-400">
              {Math.round((currentStep.solar_efficiency || 0) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 my-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.round((currentStep.solar_efficiency || 0) * 100)}%` }}
            ></div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Obstacle Mask at Sun: +{currentStep.horizon_at_sun_az}°
          </div>
        </div>

        {/* 4. Local Crater Terrain Clearance */}
        <div className="p-3 rounded-xl bg-space-850 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono mb-1 text-slate-300">
            <span>Terrain Clearance</span>
            <span className={`font-bold ${
              currentStep.sun_elevation - currentStep.horizon_at_sun_az > 0
                ? 'text-emerald-400'
                : 'text-rose-400'
            }`}>
              {(currentStep.sun_elevation - currentStep.horizon_at_sun_az).toFixed(1)}°
            </span>
          </div>
          <div className="text-xs text-slate-300 font-mono mt-1">
            {currentStep.sun_elevation > currentStep.horizon_at_sun_az
              ? '☀️ Sun rises above crater peaks.'
              : '⛰️ Sun occulted by surrounding rim.'}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            LOLA Crater Skyline Obstruction Profile
          </div>
        </div>
      </div>

      {/* Scrubbing Slider & Controls Bar */}
      <div className="p-3 bg-space-950/80 rounded-xl border border-slate-800/80 flex flex-col gap-3">
        {/* Slider */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-500 w-12 text-right">T+0h</span>
          <input
            type="range"
            min="0"
            max={totalHours - 1}
            value={activeHour}
            onChange={(e) => setActiveHour(parseInt(e.target.value, 10))}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-[11px] font-mono text-slate-500 w-12">T+{totalHours}h</span>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
          <div className="flex items-center gap-2">
            {/* Play / Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono transition shadow-md shadow-cyan-500/20"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Play Mission Orbit'}</span>
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                setIsPlaying(false);
                setActiveHour(0);
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Reset to T+0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Speed Presets */}
            <div className="flex items-center gap-1 text-[11px] font-mono ml-2">
              <span className="text-slate-500">Speed:</span>
              {[1, 6, 24].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-0.5 rounded ${
                    speed === s
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Simulated Hour: <strong className="text-cyan-400 font-bold">{activeHour}</strong> of {totalHours}
          </div>
        </div>
      </div>
    </div>
  );
}
