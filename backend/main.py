"""
main.py - FastAPI Application & REST Endpoints
LUNA-SCOPE: Lunar Landing Site Navigator
Backend Module 1/5

Connects the React/Streamlit frontend to backend modules:
- astronomy.py (NASA JPL Horizons ephemeris & 7-day visibility)
- terrain.py (LRO LOLA DEM slope & elevation variation)
- scoring.py (4-factor weighted suitability formula)
- nasa_data.py (Data sources & candidate site registry)
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import nasa_data
from astronomy import calculate_ephemeris
from terrain import analyze_terrain
from scoring import calculate_suitability

app = FastAPI(
    title="LUNA-SCOPE: Lunar Landing Site Navigator API",
    description="Web-based decision-support API for comparing lunar South Pole landing locations based on sunlight, Earth communication, and terrain slope.",
    version="1.0.0"
)

# Enable Cross-Origin Resource Sharing (CORS) for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeSiteRequest(BaseModel):
    site_id: str = Field(default="shackleton-rim", description="ID of landing site")
    start_date: str = Field(default="2026-11-14", description="Mission epoch start date (YYYY-MM-DD)")
    duration_days: int = Field(default=7, ge=1, le=14, description="Analysis duration in days (default 7 days)")


@app.get("/")
def get_root():
    """Root endpoint verifying API and Uvicorn server operation."""
    return {
        "project": "LUNA-SCOPE: Lunar Landing Site Navigator",
        "description": "Decision-support tool for comparing lunar landing locations",
        "status": "ONLINE",
        "framework": "FastAPI + Uvicorn",
        "endpoints": [
            "/api/health",
            "/api/sites",
            "/api/analyze",
            "/api/compare",
            "/api/project-info",
            "/docs"
        ]
    }


@app.get("/api/health")
def healthcheck():
    """Returns system status, active backend modules, and NASA connectivity."""
    return {
        "status": "OK",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "backend_modules": {
            "main.py": "Active (FastAPI routing)",
            "astronomy.py": "Active (NASA JPL Horizons ephemeris, 30-min sampling)",
            "terrain.py": "Active (LOLA DEM slope & roughness)",
            "scoring.py": "Active (35/25/25/15 weighted algorithm)",
            "nasa_data.py": "Active (Candidate site registry)"
        },
        "supported_sites": ["shackleton-rim", "connecting-ridge", "malapert-massif"]
    }


@app.get("/api/sites")
def list_landing_sites():
    """Returns the candidate lunar landing locations."""
    sites = nasa_data.get_all_sites()
    return {
        "count": len(sites),
        "sites": sites
    }


@app.post("/api/analyze")
def analyze_landing_site(req: AnalyzeSiteRequest):
    """
    Executes full multi-factor analysis for a single candidate site:
    1. Retrieves site data from nasa_data.py
    2. Runs astronomy.py (30-min sampling over 7 days for Sun and Earth visibility)
    3. Runs terrain.py (DEM slope and elevation variation)
    4. Runs scoring.py (weighted suitability score out of 100)
    """
    try:
        site = nasa_data.get_site_by_id(req.site_id)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Landing site '{req.site_id}' not found.")

    try:
        datetime.strptime(req.start_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid start_date format. Must be YYYY-MM-DD.")

    # 1. Astronomy Module: 7-day ephemeris at 30-min sampling
    astronomy_res = calculate_ephemeris(
        latitude=site["latitude"],
        longitude=site["longitude"],
        base_elevation_m=site.get("base_elevation_m", 1200.0),
        start_date=req.start_date,
        duration_days=req.duration_days
    )

    # 2. Terrain Module: LOLA DEM slope and elevation variation
    terrain_res = analyze_terrain(site)

    # 3. Scoring Module: 4-factor weighted formula (Sunlight 35%, Earth 25%, Slope 25%, Elev Var 15%)
    scoring_res = calculate_suitability(
        sunlight_pct=astronomy_res["sunlight_percentage"],
        earth_visibility_pct=astronomy_res["earth_visibility_percentage"],
        mean_slope_deg=terrain_res["mean_slope_deg"],
        elevation_var_m=terrain_res["elevation_variation_m"]
    )

    return {
        "site": site,
        "parameters": {
            "start_date": req.start_date,
            "duration_days": req.duration_days,
            "sampling_interval_minutes": astronomy_res["sample_interval_minutes"],
            "total_samples": astronomy_res["total_samples"]
        },
        "environmental_analysis": {
            "sunlight_percentage": astronomy_res["sunlight_percentage"],
            "sunlight_hours": astronomy_res["sunlight_hours"],
            "earth_visibility_percentage": astronomy_res["earth_visibility_percentage"],
            "earth_visibility_hours": astronomy_res["earth_visibility_hours"],
            "total_mission_hours": astronomy_res["total_mission_hours"],
            "sun_crossings": astronomy_res["sun_crossings"],
            "earth_crossings": astronomy_res["earth_crossings"],
            "time_series": astronomy_res["time_series"]
        },
        "terrain_analysis": terrain_res,
        "suitability_scoring": scoring_res
    }


@app.get("/api/compare")
def compare_all_sites(
    start_date: str = Query("2026-11-14", description="Start date (YYYY-MM-DD)"),
    duration_days: int = Query(7, ge=1, le=14, description="Duration in days")
):
    """
    Computes and compares metrics across all 3 lunar landing locations side-by-side.
    Allows mission planners to see which site is superior in sunlight, comms, and slope.
    """
    all_sites = nasa_data.get_all_sites()
    comparison_table = []

    for site in all_sites:
        astro = calculate_ephemeris(
            latitude=site["latitude"],
            longitude=site["longitude"],
            base_elevation_m=site.get("base_elevation_m", 1200.0),
            start_date=start_date,
            duration_days=duration_days
        )
        terr = analyze_terrain(site)
        score = calculate_suitability(
            astro["sunlight_percentage"],
            astro["earth_visibility_percentage"],
            terr["mean_slope_deg"],
            terr["elevation_variation_m"]
        )

        comparison_table.append({
            "site_id": site["id"],
            "name": site["name"],
            "region": site["region"],
            "coordinates": f"{site['latitude']}°, {site['longitude']}°",
            "sunlight_pct": astro["sunlight_percentage"],
            "sunlight_hours": astro["sunlight_hours"],
            "earth_visibility_pct": astro["earth_visibility_percentage"],
            "earth_visibility_hours": astro["earth_visibility_hours"],
            "mean_slope_deg": terr["mean_slope_deg"],
            "elevation_variation_m": terr["elevation_variation_m"],
            "terrain_safety": terr["safety_status"],
            "suitability_score": score["overall_suitability_score"],
            "status": score["status"],
            "rating": score["rating"],
            "recommendation": score["recommendation"]
        })

    # Sort descending by suitability score
    comparison_table.sort(key=lambda x: x["suitability_score"], reverse=True)

    return {
        "start_date": start_date,
        "duration_days": duration_days,
        "comparison": comparison_table,
        "top_recommendation": comparison_table[0]["name"] if comparison_table else None
    }


@app.get("/api/project-info")
def get_project_info():
    """
    Provides full project metadata, backend responsibility details,
    and mock viva Q&A for judges.
    """
    return {
        "title": "LUNA-SCOPE – Lunar Landing Site Navigator",
        "pitch_30s": (
            "Our project, LUNA-SCOPE, is a Lunar Landing Site Navigator. It helps mission planners "
            "compare potential landing locations on the Moon. It analyzes sunlight availability, "
            "Earth visibility, terrain slope and elevation variations to help identify comparatively "
            "suitable landing locations. We use NASA JPL Horizons for astronomical data, FastAPI for backend "
            "processing, and an interactive dashboard. Our goal is to make lunar landing-site evaluation "
            "more visual, understandable and data-driven."
        ),
        "scoring_weights": {
            "Sunlight": "35%",
            "Earth visibility": "25%",
            "Slope": "25%",
            "Elevation variation": "15%"
        },
        "modules": [
            {"file": "main.py", "role": "FastAPI API endpoints and routing"},
            {"file": "astronomy.py", "role": "NASA JPL Horizons ephemeris, 30-min sampling, linear interpolation"},
            {"file": "terrain.py", "role": "DEM data loading, slope and elevation variation calculations"},
            {"file": "scoring.py", "role": "Weighted suitability-scoring algorithm (0-100)"},
            {"file": "nasa_data.py", "role": "Landing site registry and data utilities"}
        ]
    }
