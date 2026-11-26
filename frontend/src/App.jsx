import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SuitabilityCard from './components/SuitabilityCard';
import EnvironmentalAnalysis from './components/EnvironmentalAnalysis';
import TerrainAnalysis from './components/TerrainAnalysis';
import ComparisonTable from './components/ComparisonTable';
import JudgeVivaModal from './components/JudgeVivaModal';
import { Layers, Award, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

export default function App() {
  const [sites, setSites] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState('shackleton-rim');
  const [startDate, setStartDate] = useState('2026-11-14');
  const [durationDays, setDurationDays] = useState(7);

  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'comparison'
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Check backend health & fetch sites
  useEffect(() => {
    async function initApp() {
      try {
        const healthRes = await fetch(`${API_BASE}/api/health`);
        if (healthRes.ok) {
          setBackendOnline(true);
        }

        const sitesRes = await fetch(`${API_BASE}/api/sites`);
        const sitesData = await sitesRes.json();
        if (sitesData.sites && sitesData.sites.length > 0) {
          setSites(sitesData.sites);
          // Initial analysis
          runAnalysis(sitesData.sites[0].id, startDate, durationDays);
          fetchComparison(startDate, durationDays);
        }
      } catch (err) {
        console.warn('Backend not yet reachable on port 8000:', err);
        setBackendOnline(false);
      }
    }
    initApp();
  }, []);

  const runAnalysis = async (siteId, date, days) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_id: siteId,
          start_date: date,
          duration_days: days
        })
      });
      if (!res.ok) {
        throw new Error(`Analysis failed with status ${res.status}`);
      }
      const data = await res.json();
      setCurrentAnalysis(data);
      setBackendOnline(true);
    } catch (err) {
      console.error('Error analyzing site:', err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComparison = async (date, days) => {
    try {
      const res = await fetch(`${API_BASE}/api/compare?start_date=${date}&duration_days=${days}`);
      if (res.ok) {
        const data = await res.json();
        setComparisonData(data);
      }
    } catch (err) {
      console.error('Error fetching comparison:', err);
    }
  };

  const handleSelectSite = (siteId) => {
    setSelectedSiteId(siteId);
    runAnalysis(siteId, startDate, durationDays);
    if (activeTab === 'comparison') {
      setActiveTab('overview');
    }
  };

  const handleRunAnalysis = () => {
    runAnalysis(selectedSiteId, startDate, durationDays);
    fetchComparison(startDate, durationDays);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation & Status */}
      <Header
        onOpenJudgeModal={() => setIsJudgeModalOpen(true)}
        backendOnline={backendOnline}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 space-y-6">
        {/* Error Notification */}
        {errorMsg && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-300 p-4 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{errorMsg}. Make sure the FastAPI server is running on port 8000.</span>
            </div>
            <button
              onClick={handleRunAnalysis}
              className="px-2.5 py-1 rounded bg-rose-900 hover:bg-rose-800 text-white font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left Column: Sidebar / Mission Control */}
          <Sidebar
            sites={sites}
            selectedSiteId={selectedSiteId}
            onSelectSite={handleSelectSite}
            startDate={startDate}
            onChangeStartDate={setStartDate}
            durationDays={durationDays}
            onChangeDuration={setDurationDays}
            onRunAnalysis={handleRunAnalysis}
            loading={loading}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />

          {/* Right Column: Main Content Area */}
          <div className="flex-1 w-full space-y-6">
            {/* View Tab Switcher for Mobile / Top */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'overview'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Site Evaluation Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'comparison'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Compare All 3 Candidate Sites</span>
                </button>
              </div>

              {currentAnalysis && (
                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span>Selected:</span>
                  <span className="text-cyan-400 font-bold">{currentAnalysis.site.name}</span>
                </div>
              )}
            </div>

            {/* TAB 1: SITE OVERVIEW */}
            {activeTab === 'overview' && currentAnalysis && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* 1. Suitability Scoring Banner */}
                <SuitabilityCard
                  scoring={currentAnalysis.suitability_scoring}
                  siteName={currentAnalysis.site.name}
                />

                {/* 2. Environmental Analysis (Sunlight & Earth Ephemeris) */}
                <EnvironmentalAnalysis analysis={currentAnalysis} />

                {/* 3. Terrain Analysis (DEM Slope & Roughness) */}
                <TerrainAnalysis terrain={currentAnalysis.terrain_analysis} />

                {/* Mini Comparison Teaser */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Want to compare this against other lunar sites?
                    </h4>
                    <p className="text-xs text-slate-400">
                      Evaluate Shackleton Rim, Connecting Ridge, and Malapert Massif in a side-by-side trade-off matrix.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('comparison')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs border border-slate-700 transition-all shrink-0"
                  >
                    Open 3-Site Comparison Matrix →
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: 3-SITE COMPARISON MATRIX */}
            {activeTab === 'comparison' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <ComparisonTable
                  comparisonData={comparisonData}
                  onSelectSite={handleSelectSite}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 px-4 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">LUNA-SCOPE</span>
            <span>•</span>
            <span>Lunar Landing Site Navigator</span>
            <span>•</span>
            <span className="text-cyan-400">NASA Space Apps Challenge</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>FastAPI Backend (8000)</span>
            <span>React + Vite (5173)</span>
            <button
              onClick={() => setIsJudgeModalOpen(true)}
              className="text-cyan-400 hover:underline"
            >
              Open Judge Guide
            </button>
          </div>
        </div>
      </footer>

      {/* Judge Viva & Architecture Modal */}
      <JudgeVivaModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
      />
    </div>
  );
}
