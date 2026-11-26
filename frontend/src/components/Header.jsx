import React from 'react';
import { Moon, Radio, Award, BookOpen, CheckCircle, ExternalLink } from 'lucide-react';

export default function Header({ onOpenJudgeModal, backendOnline }) {
  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Project Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40">
            <Moon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>LUNA-SCOPE</span>
                <span className="text-cyan-400 text-sm font-normal px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/60">
                  Landing Site Navigator
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Decision-Support System for Lunar South Pole Mission Planning
            </p>
          </div>
        </div>

        {/* Backend & Judge Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-slate-300 font-mono">FastAPI Backend:</span>
            <span className={backendOnline ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
              {backendOnline ? 'Connected (Port 8000)' : 'Connecting...'}
            </span>
          </div>

          {/* NASA Data Sources */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-900/50 text-cyan-300 text-xs">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>NASA JPL Horizons & LOLA</span>
          </div>

          {/* Judge / Explainer Button */}
          <button
            onClick={onOpenJudgeModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-md shadow-cyan-600/20 border border-cyan-400/30 transition-all hover:scale-[1.02]"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Judge Viva & Architecture Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
}
