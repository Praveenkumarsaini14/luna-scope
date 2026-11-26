<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=28&pause=1000&color=A78BFA&center=true&vCenter=true&width=700&lines=🌙+Luna+Scope+Frontend;React+%2B+Vite+%2B+Tailwind+CSS;3D+Lunar+Mission+Dashboard" alt="Luna Scope Frontend" />

<br/>

![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Space](https://img.shields.io/badge/Domain-Lunar_Mission-6E40C9?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A stunning React-based mission control dashboard for visualizing lunar landing site analysis — featuring 3D celestial dome, polar maps, terrain analysis, and real-time mission timeline.**

[🚀 Quick Start](#-quick-start) · [🎨 Components](#-components) · [📸 Screenshots](#-screenshots) · [🔧 Setup](#-setup)

</div>

---

## 🌙 Features

| Feature | Description |
|---------|-------------|
| 🌐 **3D Celestial Dome** | Interactive 3D visualization of the Moon's sky from any site |
| 🗺️ **Polar Map View** | South Pole interactive site selection map |
| 📊 **Horizon Chart** | Real-time sun/Earth visibility horizon plots |
| 🏔️ **Terrain Analysis** | Slope, roughness, and topography panels |
| 🌡️ **Environmental Analysis** | Temperature, radiation, and solar flux data |
| 🏆 **Comparison Cards** | Side-by-side site suitability comparison |
| ⏱️ **Mission Scrubber** | Timeline scrubber for mission window planning |
| 📄 **Export Report** | PDF/JSON mission briefing export |
| 🎓 **Judge Viva Modal** | Interactive Q&A mode for hackathon presentations |

---

## 🎨 Components

```
src/
├── App.jsx                    # Main app shell & routing
├── components/
│   ├── Header.jsx             # Top navigation bar
│   ├── Sidebar.jsx            # Site selection sidebar
│   ├── CelestialDome3D.jsx    # 🌐 3D sky visualization
│   ├── PolarMapView.jsx       # 🗺️ South Pole map
│   ├── HorizonChart.jsx       # 📈 Horizon visibility chart
│   ├── TerrainAnalysis.jsx    # 🏔️ Terrain data panels
│   ├── EnvironmentalAnalysis.jsx  # 🌡️ Environment metrics
│   ├── ComparisonCards.jsx    # 🏆 Site comparison
│   ├── ComparisonTable.jsx    # 📊 Detailed comparison table
│   ├── SuitabilityCard.jsx    # ⭐ Site score card
│   ├── MissionScrubber.jsx    # ⏱️ Mission timeline
│   ├── BriefingPanel.jsx      # 📋 Mission briefing
│   ├── ControlBar.jsx         # 🎛️ Dashboard controls
│   ├── SiteDetailsModal.jsx   # 📍 Site detail popup
│   ├── CustomSiteModal.jsx    # ➕ Add custom site
│   ├── ExportReportModal.jsx  # 📄 Export functionality
│   ├── JudgeVivaModal.jsx     # 🎓 Viva mode
│   └── TimelineChart.jsx      # 📅 Timeline visualization
└── index.css                  # Global styles
```

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/Praveenkumarsaini14/luna-scope-frontend.git
cd luna-scope-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# → http://localhost:5173
```

---

## 🔧 Setup

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file:
```env
VITE_API_URL=http://localhost:8000
VITE_NASA_API_KEY=your_nasa_api_key
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 18 | UI Framework |
| Vite 5 | Build Tool & Dev Server |
| Tailwind CSS 3 | Utility-first Styling |
| PostCSS | CSS Processing |
| Recharts / D3 | Data Visualization |

---

## 🔗 Related

- 🔧 **Backend**: [luna-scope-backend](https://github.com/Praveenkumarsaini14/luna-scope-backend) — Python + FastAPI + NASA Data
- 📊 **Presentation**: [luna-scope-presentation](https://github.com/Praveenkumarsaini14/luna-scope-presentation) — Trivonix Deck

---

## 📄 License

MIT License © 2024 [Praveen Kumar Saini](https://github.com/Praveenkumarsaini14)

<div align="center">
<br/>
🌙 <b>Built for the Trivonix Space Challenge</b> 🚀
<br/>
⭐ <b>Star this repo if you like it!</b> ⭐
</div>
