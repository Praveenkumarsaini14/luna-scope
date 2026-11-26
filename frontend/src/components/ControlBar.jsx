import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, Check, RefreshCw, MapPin, PlusCircle, Filter } from 'lucide-react';

export default function ControlBar({
  allSites,
  selectedSiteIds,
  setSelectedSiteIds,
  startDate,
  setStartDate,
  durationDays,
  setDurationDays,
  validateWithJpl,
  setValidateWithJpl,
  onRunSimulation,
  onOpenCustomSiteModal,
  loading
}) {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Catalog' },
    { id: 'artemis_south_pole', label: 'Artemis Polar' },
    { id: 'clps_commercial', label: 'CLPS Commercial' },
    { id: 'apollo_historic', label: 'Apollo' },
    { id: 'international', label: 'International' },
  ];

  const filteredSites = activeCategory === 'all'
    ? allSites
    : allSites.filter(s => s.category === activeCategory);

  const toggleSite = (id) => {
    if (selectedSiteIds.includes(id)) {
      if (selectedSiteIds.length <= 1) return; // Keep at least 1 site
      setSelectedSiteIds(selectedSiteIds.filter(s => s !== id));
    } else {
      if (selectedSiteIds.length >= 4) {
        // limit to 4 for side-by-side comparison
        setSelectedSiteIds([...selectedSiteIds.slice(1), id]);
      } else {
        setSelectedSiteIds([...selectedSiteIds, id]);
      }
    }
  };

  const setPreset = (presetType) => {
    if (presetType === 'artemis') {
      setSelectedSiteIds(['shackleton-rim', 'connecting-ridge', 'nobile-rim-1']);
    } else if (presetType === 'ice') {
      setSelectedSiteIds(['shackleton-rim', 'haworth', 'im2-prime1']);
    } else if (presetType === 'clps') {
      setSelectedSiteIds(['im1-odysseus', 'im2-prime1', 'firefly-blueghost']);
    } else if (presetType === 'historic_vs_modern') {
      setSelectedSiteIds(['apollo11', 'chandrayaan3', 'shackleton-rim']);
    }
  };

  return (
    <div className="bg-space-900 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl mb-6">
      <div className="flex flex-col gap-5">
        {/* Top row: Site selection & Categories */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <label className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Landing Sites Catalog (Compare up to 4)
              </label>

              {/* Add Custom Site Button */}
              <button
                type="button"
                onClick={onOpenCustomSiteModal}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Custom Coordinates</span>
              </button>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <span className="text-slate-500">Presets:</span>
              <button
                onClick={() => setPreset('artemis')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 transition"
              >
                Artemis Prime
              </button>
              <button
                onClick={() => setPreset('ice')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 transition"
              >
                Ice Traps
              </button>
              <button
                onClick={() => setPreset('clps')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 transition"
              >
                CLPS Fleet
              </button>
              <button
                onClick={() => setPreset('historic_vs_modern')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-400 transition"
              >
                Apollo vs South Pole
              </button>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                  activeCategory === c.id
                    ? 'bg-slate-700 text-white font-bold border border-slate-600'
                    : 'bg-space-850 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Site Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1">
            {filteredSites.map((site) => {
              const isSelected = selectedSiteIds.includes(site.id);
              return (
                <button
                  key={site.id}
                  onClick={() => toggleSite(site.id)}
                  type="button"
                  className={`flex flex-col p-2.5 rounded-xl text-left border transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-br from-cyan-950/60 to-blue-900/40 border-cyan-500/70 shadow-[0_0_12px_rgba(56,189,248,0.25)] text-white'
                      : 'bg-space-850 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] font-mono text-cyan-400 truncate max-w-[80px]">
                      {site.latitude.toFixed(1)}°{site.latitude < 0 ? 'S' : 'N'}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] border transition ${
                        isSelected
                          ? 'bg-cyan-500 border-cyan-400 text-black font-bold'
                          : 'border-slate-600 bg-slate-800/50'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <div className="font-semibold text-xs leading-snug truncate w-full" title={site.name}>
                    {site.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {site.category_label || site.region}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom row: Parameters (Date, Duration Slider, JPL Checkbox, Run Button) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end pt-3 border-t border-slate-800/80">
          {/* Mission Start Date */}
          <div className="md:col-span-3">
            <label className="block text-xs font-mono font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              Epoch / Landing Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-space-850 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white font-mono text-sm rounded-xl px-3 py-2 outline-none transition"
            />
          </div>

          {/* Mission Duration Slider */}
          <div className="md:col-span-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono font-medium text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Duration (Days)
              </label>
              <div className="flex items-center gap-1.5">
                {[3, 7, 14, 28].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDurationDays(d)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      durationDays === d
                        ? 'bg-cyan-500 text-black font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
                <span className="font-mono text-cyan-400 font-bold text-xs ml-1">
                  {durationDays}d ({durationDays * 24}h)
                </span>
              </div>
            </div>
            <input
              type="range"
              min="3"
              max="28"
              step="1"
              value={durationDays}
              onChange={(e) => setDurationDays(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* JPL Horizons toggle & Run Button */}
          <div className="md:col-span-5 flex flex-col sm:flex-row items-center gap-3 justify-end">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300 bg-space-850 border border-slate-800 px-3 py-2 rounded-xl hover:border-slate-700 transition w-full sm:w-auto">
              <input
                type="checkbox"
                checked={validateWithJpl}
                onChange={(e) => setValidateWithJpl(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 bg-slate-900"
              />
              <span>JPL Horizons Sync</span>
            </label>

            <button
              type="button"
              onClick={onRunSimulation}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing Ephemeris...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Simulate Mission Trajectory</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
