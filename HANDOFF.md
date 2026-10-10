# Reimagine / Outside the Line — October 9, 2026 handoff

Canonical source: `/Volumes/Spiral/projects/datathon-outside-the-line`. Deployment checkout: `/tmp/reimagine-deploy`, GitHub `lazyboy1234/reimagine`, branch `main`. Live target: https://reimagine-cu6b.onrender.com/ . Deploy with a normal fast-forward push from the deployment checkout; verify live file hashes. Do not force push or expose credentials. Render CLI authentication was expired; no API key was retrieved or generated.

## Delivered source

- `data/story.js`: six-slide narrative; `index.html` renders it. `counters` is inside slide 6.
- `explain.html`: source-backed explainer; `data/face-copy.md`: complete speaker script.
- `paper.html`, `data/SOURCES.md`, `docs/TRAFFIC-STORY-AUDIT.md`, `docs/TREE-SITING.md`, `docs/POLICY-COST.md`: aligned source definitions, methods and caveats.
- `story-art/fig-change.svg`: different air-study metrics, all µg/m³; `fig-economics-map.svg`: historical income/poverty geography; `fig-tree-availability.svg`: archived trees and matching bay IDs; `fig-weights.svg`: provisional score components and people/km.
- `model/deegan-garden-deck/`: editable Blender scene, full and cutaway GLB, rendered section, interactive viewer and dimension manifest.

## Central answer

We do not yet know why the community model estimated increases. De Jesus et al.’s 2026 public abstract: +0.22 µg/m³ network step, maximum +1.29 µg/m³ at an unnamed highway-adjacent monitor, 19 of 65 monitors, January 2024–December 2025. Four increases, two decreases, thirteen unclear. No maximum-monitor baseline/address: do not calculate its percentage or locate it at East 138th/Deegan.

Our four-crossing MTA monthly model: −1.04% adjusted relative growth, 95% range −3.63% to +1.61%, small-cluster bootstrap p=.4922. Raw annual counts at those crossings rose slightly. This does not prove no diversion or describe every Bronx road.

New separate official check: NYC Health August 2026 traffic appendix, Site C / NYSDOT 010021, Deegan all vehicles 129,955→128,727/day (−0.94%); trucks 10,326→10,296/day (−0.29%), 2024–2025. Seasonally adjusted periodic counts. NYC Health’s integrated-monitor air analysis found no significant pricing-related PM2.5 change at evaluated EJ sites, differing from community hourly sensors. Vehicle counts are not emissions; behavior, nontraffic sources and air movement are possible explanations, not established causes. Match calibrated readings, local vehicle classes/speed/idling and other sources in place/time to resolve the cause.

## Remaining evidence limits

Readiness: **Share with caveats**. We used three traffic datasets, checked two saved alternatives and added the separate official appendix; we did not use all bridge sources or map people’s destinations. The community raw hourly dataset and peak coordinates were not obtained; air models were not rerun. The citywide ranking was not rerun: East 138th is not “the worst”; #22/33,785 overlapping original windows, #3 need and #4 need×residents/km among 35 finalists, with an invalid legacy monitor proxy still requiring correction. Weight sensitivity does not establish data accuracy.

Tree bays are project IDs, not whole blocks. Six candidates use 2015 tree counts and a modeled H/W<.5 screen, pending a current inventory, sidewalk/utility survey and airflow review. The 180 trees are an input, not capacity. $3,110/tree is a FY25 citywide average; 180×$3,110=$559,800 is only an illustrative planting component. Complete greenery removal ≈10.6 lb/year includes walls/roofs and assumes mature canopy; trees alone ≈3.7 lb/year. Unvalidated area weights cannot predict concentration; 8–15% reduction is withdrawn.

The deck is 240×34 m, 2.02 acres, six assumed lanes, 6.6 m clearance. No engineering, surveyed footprint, site price, approved schedule or funded allocation. The old 12.9-acre/$250M–$1.2B scenario does not price this model. A lid relocates exhaust to portals; it does not remove emissions. Dallas’s 2012 5.2-acre/$110M park is precedent, not transferable benefit or funding.

## Validation

JavaScript/JSON syntax, local asset links, GLB headers and dimensions, source arithmetic, tree-table IDs/counts, and responsive browser controls should be checked before pushing. Final deployment evidence is the recorded Git commit and exact live asset hashes; a successful push alone is insufficient. Model build script is deterministic and requires Blender. Preserve other uncommitted research/analysis files in the canonical project; they were not all part of this deployment.
