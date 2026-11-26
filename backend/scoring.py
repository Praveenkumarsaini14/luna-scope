"""
scoring.py - Multi-Criteria Suitability Scoring Module
LUNA-SCOPE: Lunar Landing Site Navigator
Backend Module 4/5

Implements a weighted suitability-scoring algorithm combining 4 key mission factors:
1. Sunlight availability (35%)
2. Earth visibility (25%)
3. Terrain slope (25%)
4. Elevation variation (15%)

Produces a normalized 0-100 Suitability Score and mission recommendation.
"""

from typing import Dict, Any


class SuitabilityScorer:
    """
    Evaluates multi-factor lunar landing site suitability using
    transparent, physics-based weighted heuristics.
    """

    def __init__(self):
        # Mission Planner Weightings (Sum to 1.0 / 100%)
        self.WEIGHT_SUNLIGHT = 0.35      # 35%
        self.WEIGHT_EARTH_COMMS = 0.25   # 25%
        self.WEIGHT_SLOPE = 0.25         # 25%
        self.WEIGHT_ELEVATION_VAR = 0.15 # 15%

    def compute_sunlight_subscore(self, sunlight_percentage: float) -> float:
        """
        Sunlight Subscore (0 to 100).
        Directly proportional to solar illumination uptime.
        """
        return max(0.0, min(100.0, float(sunlight_percentage)))

    def compute_earth_comms_subscore(self, earth_visibility_percentage: float) -> float:
        """
        Earth Visibility / Comms Subscore (0 to 100).
        Directly proportional to line-of-sight window duration.
        """
        return max(0.0, min(100.0, float(earth_visibility_percentage)))

    def compute_slope_subscore(self, mean_slope_deg: float) -> float:
        """
        Slope Subscore (0 to 100).
        Lower slope is safer. 0 deg slope = 100 pts.
        15 deg or higher slope = 0 pts (critical tipping hazard limit).
        Formula: max(0, 100 - (slope / 15.0) * 100)
        """
        normalized = 100.0 - (mean_slope_deg / 15.0) * 100.0
        return max(0.0, min(100.0, float(round(normalized, 1))))

    def compute_elevation_var_subscore(self, elev_variation_m: float) -> float:
        """
        Elevation Variation Subscore (0 to 100).
        Flatter local terrain with lower roughness is safer.
        0m variation = 100 pts.
        300m or higher variation = 0 pts.
        Formula: max(0, 100 - (variation / 300.0) * 100)
        """
        normalized = 100.0 - (elev_variation_m / 300.0) * 100.0
        return max(0.0, min(100.0, float(round(normalized, 1))))

    def evaluate_suitability(
        self,
        sunlight_percentage: float,
        earth_visibility_percentage: float,
        mean_slope_deg: float,
        elevation_variation_m: float
    ) -> Dict[str, Any]:
        """
        Calculates the comprehensive suitability score:
        Final Score = (0.35 * S_sun) + (0.25 * S_earth) + (0.25 * S_slope) + (0.15 * S_elev)
        """
        sub_sun = self.compute_sunlight_subscore(sunlight_percentage)
        sub_earth = self.compute_earth_comms_subscore(earth_visibility_percentage)
        sub_slope = self.compute_slope_subscore(mean_slope_deg)
        sub_elev = self.compute_elevation_var_subscore(elevation_variation_m)

        final_score = (
            (self.WEIGHT_SUNLIGHT * sub_sun)
            + (self.WEIGHT_EARTH_COMMS * sub_earth)
            + (self.WEIGHT_SLOPE * sub_slope)
            + (self.WEIGHT_ELEVATION_VAR * sub_elev)
        )
        final_score = round(final_score, 1)

        # Categorize mission recommendation
        if final_score >= 80.0:
            rating = "HIGHLY SUITABLE"
            recommendation = "PRIMARY CANDIDATE: Excellent balance of persistent solar power, Earth communication, and safe landing slopes."
            status = "GO"
            badge_color = "emerald"
        elif final_score >= 65.0:
            rating = "VIABLE"
            recommendation = "SECONDARY CANDIDATE: Feasible mission profile, but requires targeted battery storage or hazard detection."
            status = "CAUTION"
            badge_color = "amber"
        else:
            rating = "HIGH RISK"
            recommendation = "CHALLENGING SITE: Constrained by severe terrain slope or frequent communication / solar blackouts."
            status = "NO-GO"
            badge_color = "rose"

        return {
            "overall_suitability_score": final_score,
            "rating": rating,
            "status": status,
            "badge_color": badge_color,
            "recommendation": recommendation,
            "weights": {
                "sunlight": {"weight_pct": 35, "subscore": sub_sun, "weighted_contribution": round(self.WEIGHT_SUNLIGHT * sub_sun, 1)},
                "earth_visibility": {"weight_pct": 25, "subscore": sub_earth, "weighted_contribution": round(self.WEIGHT_EARTH_COMMS * sub_earth, 1)},
                "terrain_slope": {"weight_pct": 25, "subscore": sub_slope, "weighted_contribution": round(self.WEIGHT_SLOPE * sub_slope, 1)},
                "elevation_variation": {"weight_pct": 15, "subscore": sub_elev, "weighted_contribution": round(self.WEIGHT_ELEVATION_VAR * sub_elev, 1)}
            }
        }


# Module singleton instance
suitability_scorer = SuitabilityScorer()


def calculate_suitability(
    sunlight_pct: float,
    earth_visibility_pct: float,
    mean_slope_deg: float,
    elevation_var_m: float
) -> Dict[str, Any]:
    """Helper wrapper to calculate landing site suitability."""
    return suitability_scorer.evaluate_suitability(
        sunlight_percentage=sunlight_pct,
        earth_visibility_percentage=earth_visibility_pct,
        mean_slope_deg=mean_slope_deg,
        elevation_variation_m=elevation_var_m
    )
