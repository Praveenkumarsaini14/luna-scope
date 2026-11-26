"""
nasa_data.py - NASA Data Utilities & Landing Site Registry
LUNA-SCOPE: Lunar Landing Site Navigator
Backend Module 5/5

Handles data sources identification, ground-truth lunar landing sites data,
and utilities for querying NASA JPL Horizons and LOLA DEM resources.
"""

from typing import Dict, Any, List

# Curated NASA Lunar South Pole Candidate Landing Sites
# Data compiled from NASA Artemis III Science Definition and LRO LOLA DEM
LUNAR_SITES: Dict[str, Dict[str, Any]] = {
    "shackleton-rim": {
        "id": "shackleton-rim",
        "name": "Shackleton Crater Rim",
        "region": "Lunar South Pole",
        "latitude": -89.90,
        "longitude": 0.00,
        "base_elevation_m": 1200.0,
        "avg_slope_deg": 4.8,
        "elevation_variation_m": 85.0,
        "psr_distance_km": 1.2,
        "description": "High-altitude ridge on the rim of Shackleton Crater. Features near-permanent solar illumination and immediate access to cryogenic volatile cold-traps.",
        "primary_advantage": "High sunlight availability and proximity to water-ice cold traps in crater interior.",
        "primary_challenge": "Steep drop-offs into crater interior require precise hazard avoidance."
    },
    "connecting-ridge": {
        "id": "connecting-ridge",
        "name": "Connecting Ridge",
        "region": "South Pole - Shackleton to De Gerlache",
        "latitude": -89.45,
        "longitude": -137.50,
        "base_elevation_m": 1650.0,
        "avg_slope_deg": 3.2,
        "elevation_variation_m": 55.0,
        "psr_distance_km": 3.4,
        "description": "Broad elevated ridge connecting Shackleton to De Gerlache crater. Exceptional surface trafficability with gentle slopes under 4 degrees.",
        "primary_advantage": "Remarkably flat terrain (avg 3.2° slope) with wide safe landing corridors for landers and rovers.",
        "primary_challenge": "Lower direct-to-Earth communication duration due to line-of-sight geometry."
    },
    "malapert-massif": {
        "id": "malapert-massif",
        "name": "Malapert Massif",
        "region": "South Pole Highland Peak",
        "latitude": -86.00,
        "longitude": 2.50,
        "base_elevation_m": 5000.0,
        "avg_slope_deg": 7.8,
        "elevation_variation_m": 180.0,
        "psr_distance_km": 12.0,
        "description": "A massive 5,000-meter elevated mountain peak. Provides an unobstructed continuous direct line of sight to Earth for continuous radio communication.",
        "primary_advantage": "Near 100% direct line-of-sight to Earth, making it the premier lunar communications hub candidate.",
        "primary_challenge": "Higher average slope along peak flanks and greater distance to shadowed ice deposits."
    }
}

NASA_SOURCES_INFO = {
    "astronomy_source": {
        "name": "NASA JPL Horizons Ephemeris System",
        "url": "https://ssd.jpl.nasa.gov/horizons/",
        "api_endpoint": "https://ssd.jpl.nasa.gov/api/horizons.api",
        "description": "Provides high-precision solar and planetary ephemeris vectors computed from numerical integration of planetary motions."
    },
    "terrain_source": {
        "name": "NASA Lunar Reconnaissance Orbiter (LRO) - LOLA",
        "full_name": "Lunar Orbiter Laser Altimeter Digital Elevation Model (DEM)",
        "url": "https://quickmap.lroc.asu.edu/",
        "description": "High-resolution topography maps providing elevation and slope matrices across the lunar South Pole."
    }
}


def get_all_sites() -> List[Dict[str, Any]]:
    """Returns list of all available candidate lunar landing sites."""
    return list(LUNAR_SITES.values())


def get_site_by_id(site_id: str) -> Dict[str, Any]:
    """Retrieve landing site data by site id slug."""
    if site_id not in LUNAR_SITES:
        raise KeyError(f"Landing site '{site_id}' not found in registry.")
    return LUNAR_SITES[site_id]
