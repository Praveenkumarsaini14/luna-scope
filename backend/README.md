<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=28&pause=1000&color=4F9CF9&center=true&vCenter=true&width=700&lines=🌙+Luna+Scope+Backend;NASA+Data+%2B+Python+FastAPI;Lunar+Landing+Site+Analyzer" alt="Luna Scope Backend" />

<br/>

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![NASA](https://img.shields.io/badge/Data-NASA_API-E03C31?style=for-the-badge&logo=nasa&logoColor=white)
![Space](https://img.shields.io/badge/Domain-Lunar_Science-6E40C9?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A Python-powered backend that uses real NASA data to analyze and score potential lunar landing sites — evaluating terrain, solar exposure, and mission feasibility.**

[🚀 Quick Start](#-quick-start) · [🛸 API Reference](#-api-reference) · [🌙 Scoring Model](#-scoring-model) · [🗺️ Site Data](#%EF%B8%8F-lunar-sites)

</div>

---

## 🌙 What is Luna Scope?

**Luna Scope** is an intelligent lunar site selection system developed for the **Trivonix Space Challenge**. The backend processes real NASA ephemeris data to:

| Module | Description |
|--------|-------------|
| `astronomy.py` | Celestial mechanics & sun angle calculations |
| `ephemeris.py` | NASA JPL ephemeris data processing |
| `terrain.py` | Lunar terrain roughness & slope analysis |
| `nasa_data.py` | NASA API integration (LROC, Diviner data) |
| `scoring.py` | Multi-criteria site suitability scoring |
| `main.py` | FastAPI server & REST endpoint definitions |

---

## 🏗️ Architecture

```
                    ┌──────────────────┐
                    │   React Frontend  │
                    └────────┬─────────┘
                             │ HTTP REST
                    ┌────────▼─────────┐
                    │   FastAPI Server  │
                    │    (main.py)      │
                    └────────┬─────────┘
            ┌────────────────┼────────────────┐
            │                │                │
   ┌────────▼──────┐ ┌───────▼──────┐ ┌──────▼──────┐
   │  NASA Data    │ │  Ephemeris   │ │  Terrain    │
   │  (nasa_data)  │ │  (JPL Data)  │ │  Analysis   │
   └───────────────┘ └──────────────┘ └─────────────┘
            │                │                │
            └────────────────▼────────────────┘
                      Scoring Engine
                      (scoring.py)
```

---

## 🌙 Scoring Model

Each lunar site is evaluated on **5 weighted criteria**:

| Criterion | Weight | Description |
|-----------|--------|-------------|
| ☀️ Solar Exposure | 35% | Hours of sunlight per lunar day |
| 🏔️ Terrain Stability | 25% | Slope & roughness index |
| 🌡️ Temperature Range | 20% | Min/Max surface temperature |
| 📡 Earth Visibility | 10% | Line-of-sight communication windows |
| 💧 Water Ice Proximity | 10% | Distance to polar ice deposits |

**Final Score** = Σ (criterion_score × weight)

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/Praveenkumarsaini14/luna-scope-backend.git
cd luna-scope-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

---

## 📡 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sites` | GET | List all lunar candidate sites |
| `/sites/{id}/score` | GET | Get suitability score for a site |
| `/ephemeris` | GET | Current lunar ephemeris data |
| `/terrain/{lat}/{lon}` | GET | Terrain analysis at coordinates |
| `/mission/window` | POST | Calculate optimal mission window |

---

## 🗺️ Lunar Sites Database

Pre-loaded with **12 candidate sites** including:
- 🏔️ Shackleton Crater Rim (South Pole)
- 🌑 Malapert Mountain
- ⛰️ Leibnitz Beta Plateau
- 🌙 Nobile Crater Region

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Web Framework | FastAPI + Uvicorn |
| Astronomy | Astropy, Skyfield |
| NASA Data | NASA LROC API, JPL Horizons |
| Numerical | NumPy, SciPy |
| Data | JSON / GeoJSON |

---

## 📄 License

MIT License © 2024 [Praveen Kumar Saini](https://github.com/Praveenkumarsaini14)

<div align="center">
<br/>
🌙 <b>Built for the Trivonix Space Challenge</b> 🚀
</div>
