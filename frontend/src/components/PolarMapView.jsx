import React from 'react';
import { Compass, MapPin, Sun, Radio, Info } from 'lucide-react';

export default function PolarMapView({
  allSites,
  activeSite,
  setActiveChartSiteId,
  currentStep,
  onMapClickCoordinates,
  mode
}) {
  // Polar Stereographic projection centered at South Pole (-90°):
  // Let center = (250, 250), radius = 220 px for 80°S (10 degrees of latitude span)
  // Distance from pole: r = (90 - abs(lat)) * 22
  // Angle: theta = (lon - 90) * (PI / 180) (standard polar orientation: 0° lon at top / 12 o'clock)
  const mapCenter = 250;
  const scale = 22; // 22 pixels per degree of latitude from -90°

  const getXY = (lat, lon) => {
    // Clamp to south polar region for map display
    const clampedLat = Math.min(-75, Math.max(-90, lat));
    const r = (90 + clampedLat) * scale;
    // Standard Moon polar coordinate: 0° longitude points along +Y or North
    const rad = ((lon - 90) * Math.PI) / 180;
    const x = mapCenter + r * Math.cos(rad);
    const y = mapCenter + r * Math.sin(rad);
    return { x, y };
  };

  // Craters reference data near South Pole
  const polarCraters = [
    { name: 'Shackleton', lat: -89.9, lon: 0.0, r: 12 },
    { name: 'De Gerlache', lat: -88.5, lon: -87.0, r: 20 },
    { name: 'Sverdrup', lat: -88.5, lon: -152.0, r: 18 },
    { name: 'Shoemaker', lat: -88.1, lon: 45.0, r: 24 },
    { name: 'Faustini', lat: -87.3, lon: 77.0, r: 22 },
    { name: 'Haworth', lat: -87.4, lon: -5.0, r: 21 },
    { name: 'Nobile', lat: -85.2, lon: 53.5, r: 35 },
    { name: 'Malapert', lat: -84.9, lon: 12.9, r: 32 },
    { name: 'Amundsen', lat: -84.5, lon: 82.8, r: 40 },
  ];

  // Sun and Earth azimuth arrows from current active step
  const sunAzimuth = currentStep?.sun_azimuth ?? 0;
  const earthAzimuth = currentStep?.earth_azimuth ?? 0;

  // Azimuth measured clockwise from North (North points radially outwards from South Pole)
  // At the pole, azimuth 0 is along 0° longitude
  const sunAngleRad = ((sunAzimuth - 90) * Math.PI) / 180;
  const earthAngleRad = ((earthAzimuth - 90) * Math.PI) / 180;

  const sunArrowX = mapCenter + 210 * Math.cos(sunAngleRad);
  const sunArrowY = mapCenter + 210 * Math.sin(sunAngleRad);

  const earthArrowX = mapCenter + 190 * Math.cos(earthAngleRad);
  const earthArrowY = mapCenter + 190 * Math.sin(earthAngleRad);

  const handleSvgClick = (e) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - svgRect.left;
    const clickY = e.clientY - svgRect.top;

    // Convert pixel (clickX, clickY) back to (lat, lon)
    const dx = clickX - mapCenter;
    const dy = clickY - mapCenter;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const lat = -(90 - dist / scale);

    let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (angleDeg > 180) angleDeg -= 360;
    if (angleDeg < -180) angleDeg += 360;
    const lon = angleDeg;

    if (lat <= -78 && onMapClickCoordinates) {
      onMapClickCoordinates(parseFloat(lat.toFixed(2)), parseFloat(lon.toFixed(2)));
    }
  };

  return (
    <div className="bg-space-900 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
              Lunar South Pole 2D Cartographic Map (80°S – 90°S)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/70 border border-blue-500/30 text-blue-300">
              Stereographic Projection
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'planner'
              ? 'Click any site marker to focus telemetry. Click anywhere on the map to pin custom coordinates.'
              : 'This map looks straight down onto the Moon’s South Pole. The yellow arrow shows sunlight direction, and the blue arrow shows where Earth is in the sky.'}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-amber-300">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Sub-Solar Ray</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sub-Earth Vector</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
        {/* SVG Map Canvas */}
        <div className="relative w-full max-w-[500px] aspect-square bg-[#030611] rounded-2xl border border-slate-800 p-2 overflow-hidden shadow-inner cursor-crosshair">
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full select-none"
            onClick={handleSvgClick}
          >
            <defs>
              {/* Polar Gradient */}
              <radialGradient id="polarGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0B3D91" stopOpacity="0.25" />
                <stop offset="60%" stopColor="#030712" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#02040a" stopOpacity="1" />
              </radialGradient>
              <linearGradient id="sunBeamGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Background Disk */}
            <circle cx={mapCenter} cy={mapCenter} r="235" fill="url(#polarGlow)" stroke="#1e293b" strokeWidth="1" />

            {/* Latitude Rings */}
            {[89, 88, 86, 84, 82, 80].map((deg) => {
              const r = (90 - deg) * scale;
              return (
                <g key={deg}>
                  <circle
                    cx={mapCenter}
                    cy={mapCenter}
                    r={r}
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={mapCenter + 4}
                    y={mapCenter - r - 2}
                    fill="#475569"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    -{deg}°S
                  </text>
                </g>
              );
            })}

            {/* Longitude Spokes */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const rad = ((deg - 90) * Math.PI) / 180;
              const x2 = mapCenter + 225 * Math.cos(rad);
              const y2 = mapCenter + 225 * Math.sin(rad);
              return (
                <g key={deg}>
                  <line
                    x1={mapCenter}
                    y1={mapCenter}
                    x2={x2}
                    y2={y2}
                    stroke="#1e293b"
                    strokeWidth="0.8"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={mapCenter + 236 * Math.cos(rad)}
                    y={mapCenter + 236 * Math.sin(rad) + 3}
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {deg}°
                  </text>
                </g>
              );
            })}

            {/* Polar Craters Outlines */}
            {polarCraters.map((c) => {
              const { x, y } = getXY(c.lat, c.lon);
              return (
                <g key={c.name} className="pointer-events-none opacity-70">
                  <ellipse
                    cx={x}
                    cy={y}
                    rx={c.r}
                    ry={c.r * 0.9}
                    fill="#0f172a"
                    stroke="#334155"
                    strokeWidth="1.2"
                  />
                  <circle cx={x} cy={y} r={c.r * 0.5} fill="#020617" opacity="0.6" />
                  <text
                    x={x}
                    y={y + c.r + 9}
                    fill="#64748b"
                    fontSize="8"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {c.name}
                  </text>
                </g>
              );
            })}

            {/* Sub-Solar Arrow from edge */}
            <g className="transition-all duration-300">
              <line
                x1={sunArrowX}
                y1={sunArrowY}
                x2={mapCenter}
                y2={mapCenter}
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="6 3"
                opacity="0.85"
              />
              <circle cx={sunArrowX} cy={sunArrowY} r="7" fill="#fbbf24" stroke="#78350f" strokeWidth="2" />
            </g>

            {/* Sub-Earth Vector Arrow */}
            <g className="transition-all duration-300">
              <line
                x1={mapCenter}
                y1={mapCenter}
                x2={earthArrowX}
                y2={earthArrowY}
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="4 2"
                opacity="0.85"
              />
              <circle cx={earthArrowX} cy={earthArrowY} r="6" fill="#38bdf8" stroke="#075985" strokeWidth="2" />
            </g>

            {/* Candidate Landing Site Markers */}
            {allSites.map((site) => {
              const { x, y } = getXY(site.latitude, site.longitude);
              const isActive = activeSite?.site_id === site.id || activeSite?.id === site.id;

              return (
                <g
                  key={site.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveChartSiteId(site.id);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Glowing halo if active */}
                  {isActive && (
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      className="animate-ping"
                      opacity="0.5"
                    />
                  )}

                  <circle
                    cx={x}
                    cy={y}
                    r={isActive ? "7" : "5"}
                    fill={isActive ? "#38bdf8" : "#94a3b8"}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />

                  {/* Site Label Tag */}
                  <rect
                    x={x + 8}
                    y={y - 9}
                    width={site.name.length * 6 + 12}
                    height="16"
                    rx="4"
                    fill="#090d16"
                    stroke={isActive ? "#38bdf8" : "#334155"}
                    strokeWidth="1"
                    opacity="0.9"
                  />
                  <text
                    x={x + 14}
                    y={y + 3}
                    fill={isActive ? "#38bdf8" : "#cbd5e1"}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight={isActive ? "bold" : "normal"}
                  >
                    {site.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}

            {/* South Pole Center Pin */}
            <circle cx={mapCenter} cy={mapCenter} r="3" fill="#ef4444" />
            <text x={mapCenter} y={mapCenter + 12} fill="#ef4444" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              90°S POLE
            </text>
          </svg>
        </div>

        {/* Informational Side Column */}
        <div className="flex-1 space-y-3 text-xs font-mono max-w-sm">
          <div className="p-3.5 rounded-xl bg-space-850 border border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
              <MapPin className="w-4 h-4" />
              <span>Active Target: {activeSite?.name}</span>
            </div>
            <div className="text-slate-300 text-[11px] space-y-0.5">
              <div>Coordinates: {activeSite?.latitude.toFixed(2)}°S, {activeSite?.longitude.toFixed(2)}°E</div>
              <div>Elevation: {activeSite?.elevation_m}m above lunar mean radius</div>
              <div>Water Ice PSR Distance: {activeSite?.psr_distance_km} km</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-[11px] leading-relaxed">
            <span className="font-bold block text-amber-300 mb-1">Solar Vector Azimuth: {sunAzimuth.toFixed(1)}°</span>
            The Sun circulates 360° horizontally around this polar map once every 29.5 Earth days. Notice how crater rims on the sunward side create long cast shadows across neighboring basins.
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-[11px] leading-relaxed">
            <span className="font-bold block text-cyan-300 mb-1">Sub-Earth Libration: {earthAzimuth.toFixed(1)}°</span>
            Because the Moon is tidally locked with libration, the blue Earth vector stays confined to a narrow azimuth cone, wobbling up and down by ~6° to 8°.
          </div>
        </div>
      </div>
    </div>
  );
}
