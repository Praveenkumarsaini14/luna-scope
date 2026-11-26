<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=30&pause=1200&color=A78BFA&center=true&vCenter=true&width=760&lines=%F0%9F%8C%99+LUNA+SCOPE;Lunar+Landing+Site+Navigator;NASA+Ephemeris+%2B+3D+Mission+Control" alt="Luna Scope Hero" />

<br/>

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Three.js](https://img.shields.io/badge/Three.js-0.187-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![NASA Data](https://img.shields.io/badge/Data-NASA_LROC_%2F_JPL-FC3D21?style=for-the-badge&logo=nasa&logoColor=white)](https://www.nasa.gov)
[![License: MIT](https://img.shields.io/badge/License-MIT-F7A800?style=for-the-badge)](LICENSE)

**An AI-powered mission planning & decision-support platform for evaluating, visualizing, and comparing Lunar South Pole landing sites using real NASA ephemeris and terrain data.**

[Quick Start](#-quick-start) · [Architecture](#-architecture) · [Features](#-features) · [Tech Stack](#-tech-stack) · [API Reference](#-api-reference) · [Roadmap](#-future-roadmap)

</div>

---

## 🌌 Overview

Selecting a lunar landing site requires balancing **continuous solar illumination** for power, **direct-to-Earth line-of-sight** for communications, **low terrain slope/roughness** for safe touchdown, and **proximity to permanently shadowed regions (PSRs)** for water-ice science.

**Luna Scope** unifies a **Python FastAPI orbital & terrain computation engine** with an **interactive React + Three.js 3D mission control dashboard** to score candidate sites side-by-side across configurable mission windows.

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────────────────────────────┐
│                         LUNA SCOPE UNIFIED MONOREPO                       │
├─────────────────────────────────────┬─────────────────────────────────────┤
│   Frontend (React + Vite + Three)   │     Backend (Python + FastAPI)      │
│   Port: 5173                        │     Port: 8000                      │
│                                     │                                     │
│   • CelestialDome3D (Three.js)      │     • main.py (REST API + CORS)     │
│   • PolarMapView & HorizonChart     │     • astronomy.py (Sun/Earth LOS)  │
│   • Terrain & Environmental Panels  │     • ephemeris.py (Astropy/JPL)    │
│   • MissionScrubber & Comparison    │     • terrain.py (DEM Slope/Elev)   │
│   • ExportReport & JudgeVivaModal   │     • nasa_data.py & sites_data     │
│                                     │     • scoring.py (0–100 Suitability)│
└──────────────────┬──────────────────┴──────────────────┬──────────────────┘
                   │          HTTP / JSON REST           │
                   └──────────────────►──────────────────┘
                                      │
                                      ▼
                     ┌─────────────────────────────────┐
                     │   NASA LROC DEM & JPL Ephemeris │
                     └─────────────────────────────────┘
```

1. **Frontend (`frontend/`)**: Renders the 3D celestial dome, polar landing-site map, horizon visibility charts, and mission timeline scrubber, communicating with the backend over REST.
2. **Backend (`backend/`)**: Computes 30-minute-resolution Sun/Earth elevation and azimuth profiles over 1–14 day mission windows using `astropy` and JPL ephemeris models, evaluates DEM terrain slope/roughness, and produces weighted suitability scores.

---

## ✨ Features

| Feature | Category | Description |
|---------|----------|-------------|
| 🌐 **3D Celestial Dome** | Visualization | Interactive Three.js sky dome showing real-time Sun & Earth trajectories from any lunar site |
| 🗺️ **Polar Map View** | Visualization | South Pole coordinate view for inspecting candidate and custom landing sites |
| 📈 **Horizon Visibility Chart** | Astronomy | 30-minute resolution Sun & Earth elevation/azimuth plots across the mission window |
| 🏔️ **Terrain & Slope Analysis** | Topography | DEM-derived slope, elevation variance, and landing hazard assessment |
| 🌡️ **Environmental Metrics** | Environment | Surface temperature bounds, solar flux, and communication window percentages |
| ⭐ **Weighted Suitability Scoring** | Decision Engine | Transparent 0–100 composite score combining solar exposure, terrain, comms, temperature, and ice proximity |
| 🏆 **Side-by-Side Comparison** | Decision Engine | Compare all candidate landing sites simultaneously for any start date and duration |
| ⏱️ **Mission Scrubber** | Planning | Interactive timeline scrubber to step through illumination and comms state hour-by-hour |
| 📄 **Export & Viva Mode** | Reporting | Exportable mission briefings and built-in Judge Viva Q&A modal |

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite 6
- **Styling:** Tailwind CSS 3 + PostCSS
- **3D Graphics:** Three.js (`CelestialDome3D`)
- **Charts & Icons:** Recharts, Lucide React

### Backend
- **Framework:** FastAPI + Uvicorn
- **Astronomy & Ephemeris:** Astropy, NumPy
- **Validation & Data:** Pydantic v2, Requests, `sites_data.json`
- **Containerization:** Docker & Docker Compose

---

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# 1. Clone the unified repository
git clone https://github.com/Praveenkumarsaini14/luna-scope.git
cd luna-scope

# 2. Copy environment template
cp .env.example .env

# 3. Build and start both backend and frontend
docker compose up --build
```

- **Frontend Dashboard:** `http://localhost:5173`
- **Backend API & Swagger Docs:** `http://localhost:8000/docs`

### Option 2: Manual Local Setup

#### 1. Start the Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### 2. Start the Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

---

## 🛸 API Reference

Interactive OpenAPI documentation is available at `http://localhost:8000/docs` when the backend is running.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Root status check confirming FastAPI & Uvicorn operation |
| `GET` | `/api/health` | Health check returning active backend modules and NASA connectivity status |
| `GET` | `/api/sites` | Lists all candidate lunar landing sites with coordinates and metadata |
| `POST` | `/api/analyze` | Runs full astronomy, terrain, environmental, and suitability scoring for a site |
| `GET` | `/api/compare` | Side-by-side comparison across all sites (`?start_date=YYYY-MM-DD&duration_days=7`) |
| `GET` | `/api/project-info` | Project metadata, module responsibilities, and presentation Q&A |

---

## 📁 Project Structure

```text
luna-scope/
├── .env.example                 # Root environment variables template
├── .gitignore                   # Git ignore rules
├── LICENSE                      # MIT License
├── README.md                    # Unified monorepo documentation
├── docker-compose.yml           # Multi-container orchestration (frontend + backend)
├── docs/                        # Architecture & reference documentation
├── backend/
│   ├── Dockerfile               # Backend container image
│   ├── README.md                # Backend-specific notes
│   ├── requirements.txt         # Python dependencies
│   ├── main.py                  # FastAPI application & REST endpoints
│   ├── astronomy.py             # Sun & Earth visibility and horizon calculations
│   ├── ephemeris.py             # Astropy / JPL lunar ephemeris engine
│   ├── terrain.py               # DEM slope & roughness analysis
│   ├── nasa_data.py             # NASA LROC / Diviner data access layer
│   ├── scoring.py               # Multi-criteria suitability scoring model
│   └── sites_data.json          # Candidate South Pole landing site dataset
└── frontend/
    ├── Dockerfile               # Frontend container image
    ├── README.md                # Frontend-specific notes
    ├── .env.example             # Frontend Vite environment variables
    ├── index.html               # HTML entry point
    ├── package.json             # Node dependencies & scripts
    ├── postcss.config.js        # PostCSS configuration
    ├── tailwind.config.js       # Tailwind CSS theme & configuration
    ├── vite.config.js           # Vite bundler configuration
    └── src/
        ├── App.jsx              # Root dashboard layout & state
        ├── main.jsx             # React DOM mount
        ├── index.css            # Global Tailwind styles
        └── components/          # 18 modular visualization & analysis components
            ├── CelestialDome3D.jsx
            ├── PolarMapView.jsx
            ├── HorizonChart.jsx
            ├── TerrainAnalysis.jsx
            ├── EnvironmentalAnalysis.jsx
            ├── ComparisonCards.jsx
            ├── ComparisonTable.jsx
            ├── SuitabilityCard.jsx
            ├── MissionScrubber.jsx
            ├── TimelineChart.jsx
            ├── BriefingPanel.jsx
            ├── ControlBar.jsx
            ├── Header.jsx
            ├── Sidebar.jsx
            ├── SiteDetailsModal.jsx
            ├── CustomSiteModal.jsx
            ├── ExportReportModal.jsx
            └── JudgeVivaModal.jsx
```

---

## 📸 Screenshots

> *Dashboard previews (3D Celestial Dome, South Pole Map, Horizon Visibility Charts, and Site Comparison Matrix) can be captured from `http://localhost:5173` once running locally or via Docker Compose and placed in `docs/`.*

---

## 🗺️ Future Roadmap

- [ ] **Live LROC GeoTIFF Ingestion:** Stream high-resolution Lunar Reconnaissance Orbiter elevation tiles on demand
- [ ] **Multi-Rover Traverse Planning:** A* pathfinding between landing ellipses and nearby PSR ice targets
- [ ] **Thermal & Radiation Simulation:** Time-series regolith thermal inertia and solar particle event alerts
- [ ] **Automated CI/CD:** GitHub Actions test & Docker image publishing pipeline

---

## 🤝 Contributing

Contributions are welcome! To contribute:
1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m "feat: add your feature"`)
4. Push to your branch and open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
