# East 138th tree screening — reviewed 9 October 2026

The current story uses an archived screening rule, not the old proximity-based planting order. Green means survey candidate; gold means airflow review; gray means at or above the archived local mean. No color establishes current planting capacity.

Sources: NYC 2015 Street Tree Census (`uvpi-gqnh`), living trees within 35 m of the fitted axis; NYC Building Footprints (`5zhs-2jue`), modeled roof heights and facade offsets. The centerline was fitted to 83 archived tree positions. Four of fourteen possible approximately 120 m bins were omitted for fewer than three fronting footprints. Ten retained IDs are 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, containing 15, 4, 0, 4, 12, 21, 2, 2, 6, 4 trees. Sum 70; mean seven per bay. Eleven additional trees lie outside retained bins; the complete corridor band has 81.

Table gap = count − 7 trees. H/W = modeled median roof height converted from feet to meters ÷ inferred facade-to-facade width in meters. H/W is dimensionless, not curb clearance. Count < 7 and H/W < 0.5 identifies survey candidates 3, 4, 5, 9, 11, 12. Bay 10 is 0.58 and needs airflow review. Both thresholds are screens; seven is not an official target and 0.5 does not prove pollutant trapping or prescribe spacing.

The old `plant_score`, peak-distance correlation and planting rank are retained in the derived file for provenance and explicitly withdrawn from visible decisions. The primary South Bronx abstract does not identify the maximum monitor location. A non-significant Grubbs test cannot validate measured geometry. The chi-square result only describes uneven archived counts under a flat-rate assumption; spatial dependence and unequal planting capacity limit inference.

Current inventory, utilities, soil, ownership, pedestrian access and wind assessment must precede tree quantities, species, spacing or wall planting. No verified site funding, crash-project cost or construction schedule is established. FAR zoning describes permitted floor area relative to lot area; map colors cannot establish tree or deck feasibility.

Map generator: `python3 analysis/fig_tree_map.py`. Quantitative ranking must be rerun with corrected monitor data before an investment decision. This repair did not rerun the citywide analysis.
