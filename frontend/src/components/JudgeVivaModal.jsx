import React, { useState } from 'react';
import { X, BookOpen, Terminal, CheckCircle2, ShieldCheck, Code, HelpCircle, Layers, Play } from 'lucide-react';

export default function JudgeVivaModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('pitch');
  const [testEndpointOutput, setTestEndpointOutput] = useState(null);
  const [testing, setTesting] = useState(false);

  if (!isOpen) return null;

  const testApi = async (endpoint) => {
    setTesting(true);
    try {
      const res = await fetch(`http://localhost:8000${endpoint}`);
      const json = await res.json();
      setTestEndpointOutput({ endpoint, data: json });
    } catch (err) {
      setTestEndpointOutput({ endpoint, error: err.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Judge Viva & Backend Architecture Guide
              </h2>
              <p className="text-xs text-slate-400">
                Prepared by LUNA-SCOPE Backend Developer (36-Hour Hackathon)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/40 text-xs overflow-x-auto">
          {[
            { id: 'pitch', label: '30s Pitch' },
            { id: 'backend', label: 'Backend Modules (5 Files)' },
            { id: 'viva', label: 'Important Viva Q&A' },
            { id: 'formula', label: 'Scoring & Interpolation Math' },
            { id: 'status', label: 'Project Status & Honesty' },
            { id: 'live-test', label: 'Live API Inspector' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* TAB 1: 30-Second Elevator Pitch */}
          {activeTab === 'pitch' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-cyan-950/60 to-blue-950/40 border border-cyan-800/60 rounded-xl p-5 space-y-3">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                  30-Second Explanation for Judges (Read Out Loud)
                </span>
                <p className="text-base font-medium text-white leading-relaxed">
                  "Our project, <strong className="text-cyan-300">LUNA-SCOPE</strong>, is a Lunar
                  Landing Site Navigator. It helps mission planners compare potential landing locations
                  on the Moon.
                </p>
                <p className="text-sm text-slate-200 leading-relaxed">
                  It analyzes sunlight availability, Earth visibility, terrain slope and elevation
                  variations to help identify comparatively suitable landing locations.
                </p>
                <p className="text-sm text-slate-200 leading-relaxed">
                  We use <strong className="text-amber-300">NASA JPL Horizons</strong> for astronomical
                  data, <strong className="text-cyan-300">FastAPI</strong> for backend processing, and an
                  interactive dashboard for mission planners.
                </p>
                <p className="text-sm text-slate-200 leading-relaxed">
                  Our goal is to make lunar landing-site evaluation more visual, understandable and
                  data-driven."
                </p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-2 text-xs">
                <span className="font-semibold text-slate-200 block">
                  How to explain your personal contribution as Backend Developer:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  "I was responsible for the backend development of LUNA-SCOPE. I developed the
                  FastAPI backend and created separate modules for astronomical calculations, terrain
                  analysis, NASA data utilities, and suitability scoring. My main contribution was
                  integrating NASA JPL Horizons ephemeris to calculate azimuth, elevation, and 7-day
                  visibility windows sampled at 30-minute intervals, using linear interpolation for
                  horizon crossings."
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Backend Modules Breakdown */}
          {activeTab === 'backend' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                The backend is organized into 5 independent Python modules for modularity, clean
                separation of concerns, and isolated unit testing:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 font-mono text-xs font-bold">
                      1. main.py
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">FastAPI Framework</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Exposes REST API endpoints (<code className="text-cyan-300">/api/sites</code>,{' '}
                    <code className="text-cyan-300">/api/analyze</code>,{' '}
                    <code className="text-cyan-300">/api/compare</code>) connecting frontend requests
                    with backend computation.
                  </p>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 font-mono text-xs font-bold">
                      2. astronomy.py
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">Ephemeris Engine</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Integrates NASA JPL Horizons ephemeris. Calculates Sun and Earth azimuth and elevation
                    angles every 30 minutes over 7 days (336 points) and uses linear interpolation for
                    horizon crossing events.
                  </p>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-mono text-xs font-bold">
                      3. terrain.py
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">LOLA DEM Topography</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Loads digital elevation model (DEM) data grids, computes 2D gradients with NumPy,
                    and evaluates average slope, max slope, elevation variation (Δh), and landing safety.
                  </p>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 font-mono text-xs font-bold">
                      4. scoring.py
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">Suitability Heuristics</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Implements the 4-factor weighted scoring formula: Sunlight 35%, Earth visibility 25%,
                    Slope 25%, and Elevation variation 15%, normalized to a 0–100 score.
                  </p>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-1.5 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono text-xs font-bold">
                      5. nasa_data.py
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">Data Utilities & Registry</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Contains candidate landing site ground truth coordinates, LRO LOLA DEM references,
                    and NASA data sources documentation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Viva Questions & Answers */}
          {activeTab === 'viva' && (
            <div className="space-y-3.5">
              {[
                {
                  q: 'Q1. How does your astronomy module work?',
                  a: 'It sends a request to NASA JPL Horizons with lunar coordinates and time. It receives Sun and Earth position data, processes azimuth and elevation, and calculates 7-day visibility windows.'
                },
                {
                  q: 'Q2. Why did you use 30-minute intervals?',
                  a: 'We sample positions every 30 minutes over seven days (yielding 336 data points) to estimate visibility windows accurately without overloading calculations every second.'
                },
                {
                  q: 'Q3. How do you calculate visibility?',
                  a: 'We check whether elevation is positive or negative. Positive (> 0°) = above geometric horizon. Negative (< 0°) = below geometric horizon. We use linear interpolation between samples to estimate exact crossing times.'
                },
                {
                  q: 'Q4. What is linear interpolation?',
                  a: 'It estimates an intermediate value between two known data points, assuming a linear change between them: t_cross = t1 + ((0 - E1)/(E2 - E1)) * (t2 - t1).'
                },
                {
                  q: 'Q5. Does geometric visibility guarantee communication?',
                  a: 'No. Geometric visibility only indicates whether Earth is above the theoretical horizon. Real-world communication also depends on surrounding terrain obstruction, antenna orientation, and RF hardware.'
                },
                {
                  q: 'Q6. Does your suitability score use trained AI / ML?',
                  a: 'No, and we are honest about this with judges. It is a physics-based multi-criteria weighted heuristic (MCDA) combining the 4 essential engineering constraints.'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 space-y-1">
                  <span className="font-bold text-cyan-300 text-xs block">{item.q}</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Scoring & Math Details */}
          {activeTab === 'formula' && (
            <div className="space-y-4">
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Suitability Scoring Formula (0 to 100)
                </span>
                <div className="bg-slate-950 p-3 rounded-lg font-mono text-cyan-300 text-xs overflow-x-auto">
                  Score = (0.35 × S_sun) + (0.25 × S_earth) + (0.25 × S_slope) + (0.15 × S_elevation)
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <p>• <strong>Sunlight (35%):</strong> Solar array energy yield & thermal survival.</p>
                  <p>• <strong>Earth Visibility (25%):</strong> Direct-To-Earth line-of-sight communication window.</p>
                  <p>• <strong>Terrain Slope (25%):</strong> max(0, 100 - (slope / 15°) × 100). &lt; 6° is optimal.</p>
                  <p>• <strong>Elevation Variation (15%):</strong> max(0, 100 - (Δh / 300m) × 100). Flat terrain is safer.</p>
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Linear Interpolation Formula for Horizon Crossing
                </span>
                <p className="text-xs text-slate-300">
                  When two consecutive samples E1 at t1 and E2 at t2 have opposite signs (E1 ≤ 0 &lt; E2 or E1 ≥ 0 &gt; E2),
                  the exact timestamp of horizon crossing is calculated by:
                </p>
                <div className="bg-slate-950 p-3 rounded-lg font-mono text-amber-300 text-xs">
                  Δt = t1 + [(0 - E1) / (E2 - E1)] × (t2 - t1)
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Current Project Status */}
          {activeTab === 'status' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Transparent summary of current implementation status to present with confidence:
              </p>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-700">
                      <th className="py-2.5 px-4">Component</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-white">Interactive Dashboard</td>
                      <td className="py-2.5 px-4"><span className="text-emerald-400 font-bold">Working</span></td>
                      <td className="py-2.5 px-4 text-slate-400">React + Vite + Recharts + Tailwind UI</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-white">FastAPI Backend</td>
                      <td className="py-2.5 px-4"><span className="text-emerald-400 font-bold">Working</span></td>
                      <td className="py-2.5 px-4 text-slate-400">Uvicorn server at port 8000 with CORS</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-white">NASA JPL Astronomy API</td>
                      <td className="py-2.5 px-4"><span className="text-emerald-400 font-bold">Tested & Active</span></td>
                      <td className="py-2.5 px-4 text-slate-400">Topocentric elevation & azimuth calculation</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-white">7-Day Visibility Calculation</td>
                      <td className="py-2.5 px-4"><span className="text-emerald-400 font-bold">Implemented</span></td>
                      <td className="py-2.5 px-4 text-slate-400">30-min sampling with linear interpolation</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-white">Terrain Slope & Roughness</td>
                      <td className="py-2.5 px-4"><span className="text-emerald-400 font-bold">Implemented</span></td>
                      <td className="py-2.5 px-4 text-slate-400">LOLA DEM matrix gradients & elevation variation</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-white">Suitability Scoring</td>
                      <td className="py-2.5 px-4"><span className="text-emerald-400 font-bold">Implemented</span></td>
                      <td className="py-2.5 px-4 text-slate-400">35/25/25/15 weighted algorithm out of 100</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-white">AI / Machine Learning</td>
                      <td className="py-2.5 px-4"><span className="text-slate-400 font-semibold">Not Implemented</span></td>
                      <td className="py-2.5 px-4 text-slate-400">Transparently heuristic; future roadmap item</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: Live API Inspector */}
          {activeTab === 'live-test' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Click to ping the live FastAPI backend server on <code className="text-cyan-300">http://localhost:8000</code> in
                real-time:
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => testApi('/api/health')}
                  disabled={testing}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3" />
                  <span>GET /api/health</span>
                </button>
                <button
                  onClick={() => testApi('/api/sites')}
                  disabled={testing}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3" />
                  <span>GET /api/sites</span>
                </button>
                <button
                  onClick={() => testApi('/api/project-info')}
                  disabled={testing}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3" />
                  <span>GET /api/project-info</span>
                </button>
              </div>

              {testEndpointOutput && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5">
                    <span>Endpoint: {testEndpointOutput.endpoint}</span>
                    <span className="text-emerald-400">200 OK</span>
                  </div>
                  <pre className="text-cyan-300 overflow-x-auto max-h-56 p-2 bg-slate-900/60 rounded-lg">
                    {JSON.stringify(testEndpointOutput.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-400">
          <span>LUNA-SCOPE • Lunar Landing Site Navigator</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
