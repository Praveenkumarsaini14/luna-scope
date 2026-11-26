<div align="center">

# 🌙 LUNA-SCOPE: Lunar Landing Site Navigator

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![NASA](https://img.shields.io/badge/Data-NASA_LROC%2FJPL-FC3D21?style=for-the-badge&logo=nasa&logoColor=white)](https://www.nasa.gov)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**AI-powered decision support system for comparing lunar South Pole landing sites**

[🚀 Quick Start](#-quick-start) · [🏗️ Architecture](#-architecture) · [✨ Features](#-features) · [🛠️ Tech Stack](#-tech-stack) · [🏆 Trivonix Challenge](#-trivonix-space-challenge)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ☀️ **Solar Exposure Scoring** | Quantifies sunlight availability for power generation at each candidate site |
| 🏔️ **Terrain Analysis** | Slope, roughness, and hazard assessment using NASA LROC elevation data |
| 🌍 **NASA Ephemeris Integration** | Real-time lunar position data via JPL Horizons API |
| 🔭 **3D Visualization** | Interactive 3D mission dashboard with site comparison overlays |
| 📅 **Mission Timeline** | AI-recommended optimal landing windows based on environmental scoring |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│   React Frontend (Vite + Tailwind)  │
│   • 3D Mission Dashboard            │
│   • Site Comparison UI              │
│   • Real-time Score Charts          │
└──────────────┬──────────────────────┘
               │ HTTP REST API
┌──────────────▼──────────────────────┐
│   FastAPI Backend (Python)          │
│   • Scoring Engine                  │
│   • Terrain Processor               │
│   • Astronomy Calculator            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   NASA LROC / JPL Horizons Data     │
│   • Lunar Reconnaissance Orbiter    │
│   • Jet Propulsion Lab Ephemeris    │
└─────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- npm or yarn

### Run Locally

```bash
# Clone the monorepo
git clone https://github.com/Praveenkumarsaini14/luna-scope.git
cd luna-scope

# Backend
cd backend && pip install -r requirements.txt && uvicorn main:app --reload

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

### Run with Docker

```bash
docker-compose up --build
```

The app will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## 📁 Repository Structure

```
luna-scope/
├── backend/                # FastAPI Python backend
│   ├── main.py             # API entry point
│   ├── astronomy.py        # Lunar astronomy calculations
│   ├── ephemeris.py        # JPL Horizons ephemeris integration
│   ├── scoring.py          # Multi-criteria site scoring engine
│   ├── terrain.py          # LROC terrain analysis
│   ├── nasa_data.py        # NASA data fetching utilities
│   ├── sites_data.json     # Candidate landing sites dataset
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend container definition
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx         # Main application component
│   │   └── ...             # Components, hooks, styles
│   ├── package.json        # Node dependencies
│   └── Dockerfile          # Frontend container definition
├── docs/                   # Documentation & presentation assets
│   └── README.md
├── docker-compose.yml      # Multi-service orchestration
├── .gitignore
├── LICENSE
└── README.md               # This file
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | React 18 + Vite | UI rendering & fast HMR dev |
| **Styling** | Tailwind CSS | Utility-first responsive design |
| **Backend Framework** | FastAPI | High-performance REST API |
| **Language** | Python 3.11 | Backend logic & data processing |
| **Data Sources** | NASA LROC, JPL Horizons | Real lunar datasets |
| **3D Graphics** | Three.js / React Three Fiber | Interactive 3D visualization |
| **Containerization** | Docker + Compose | Reproducible deployments |
| **API Docs** | Swagger / OpenAPI | Auto-generated from FastAPI |

---

## 🏆 Trivonix Space Challenge

This project was developed for the **[Trivonix Space Tech Challenge 2024](https://trivonix.com)** — an innovation challenge focused on lunar exploration technologies.

Luna Scope provides mission planners with an AI-powered decision support tool to identify the safest and most resource-rich landing sites near the lunar South Pole, supporting future crewed and uncrewed missions including Artemis.

---

## 📄 License

MIT License © 2024 [Praveen Kumar Saini](https://github.com/Praveenkumarsaini14)

<div align="center">
<br/>
🌙 <b>LUNA-SCOPE — Trivonix Space Challenge 2024</b> 🚀
</div>
