import React, { useState } from 'react';
import { X, MapPin, Compass, Mountain, Droplets, PlusCircle } from 'lucide-react';

export default function CustomSiteModal({ isOpen, onClose, onAddCustomSite }) {
  const [name, setName] = useState('Custom Polar Outpost');
  const [lat, setLat] = useState(-88.75);
  const [lon, setLon] = useState(42.50);
  const [elevation, setElevation] = useState(1400);
  const [slope, setSlope] = useState(5.5);
  const [psrDist, setPsrDist] = useState(1.1);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const customSite = {
      id: `custom-${Date.now()}`,
      name: name.trim() || 'Custom Landing Site',
      category: 'custom',
      category_label: 'Custom Site',
      region: `Custom Selenographic (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      elevation_m: parseFloat(elevation),
      avg_slope_deg: parseFloat(slope),
      psr_distance_km: parseFloat(psrDist),
      description: `User-defined custom lunar site at ${lat}° latitude, ${lon}° longitude, elevation ${elevation}m.`,
      horizon_profile: [1.2, 1.4, 1.6, 1.8, 2.0, 1.9, 1.7, 1.5, 1.3, 1.1, 1.0, 1.2, 1.5, 1.8, 2.1, 2.2, 2.0, 1.7, 1.4, 1.2, 1.0, 0.9, 0.8, 0.9, 1.1, 1.2, 1.3, 1.2, 1.0, 0.9, 0.8, 0.8, 0.9, 1.0, 1.1, 1.1]
    };
    onAddCustomSite(customSite);
    onClose();
  };

  const applyPreset = (preset) => {
    if (preset === 'south_pole_ice') {
      setName('South Pole Cold Trap Apex');
      setLat(-89.65);
      setLon(-110.0);
      setElevation(950);
      setSlope(6.2);
      setPsrDist(0.4);
    } else if (preset === 'equatorial_highlands') {
      setName('Equatorial Solar Station');
      setLat(5.20);
      setLon(18.40);
      setElevation(-1500);
      setSlope(2.8);
      setPsrDist(2900.0);
    } else if (preset === 'far_side_spa') {
      setName('South Pole-Aitken Ridge');
      setLat(-52.30);
      setLon(165.0);
      setElevation(-4800);
      setSlope(7.1);
      setPsrDist(850.0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        className="bg-space-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
            Custom Lunar Coordinate Navigator
          </span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          Add Custom Landing Coordinates
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Enter any lunar latitude and longitude to evaluate solar power potential and direct-to-Earth communication line of sight.
        </p>

        {/* Presets */}
        <div className="flex items-center gap-2 mb-4 text-xs font-mono">
          <span className="text-slate-500">Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset('south_pole_ice')}
            className="px-2 py-0.5 rounded bg-space-850 hover:bg-slate-800 border border-slate-700 text-cyan-400"
          >
            Polar Ice
          </button>
          <button
            type="button"
            onClick={() => applyPreset('far_side_spa')}
            className="px-2 py-0.5 rounded bg-space-850 hover:bg-slate-800 border border-slate-700 text-amber-400"
          >
            Far Side SPA
          </button>
          <button
            type="button"
            onClick={() => applyPreset('equatorial_highlands')}
            className="px-2 py-0.5 rounded bg-space-850 hover:bg-slate-800 border border-slate-700 text-emerald-400"
          >
            Equatorial
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono">
          <div>
            <label className="block text-slate-400 mb-1">Site / Outpost Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-space-850 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Latitude (-90° to +90°)</label>
              <input
                type="number"
                step="0.001"
                min="-90"
                max="90"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                required
                className="w-full bg-space-850 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Negative = South Pole</span>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Longitude (-180° to +180°)</label>
              <input
                type="number"
                step="0.001"
                min="-180"
                max="180"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                required
                className="w-full bg-space-850 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">0° = Nearside Prime Meridian</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-slate-400 mb-1">Elevation (m)</label>
              <input
                type="number"
                value={elevation}
                onChange={(e) => setElevation(e.target.value)}
                className="w-full bg-space-850 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Avg Slope (°)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="45"
                value={slope}
                onChange={(e) => setSlope(e.target.value)}
                className="w-full bg-space-850 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">PSR Dist (km)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={psrDist}
                onChange={(e) => setPsrDist(e.target.value)}
                className="w-full bg-space-850 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition shadow-lg shadow-cyan-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simulate Custom Site</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
