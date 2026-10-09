# Traffic story and source audit

Verified October 9, 2026 against the project's saved analysis, raw/derived provenance and official source metadata. This audit didn't rerun the MTA model. It added a separately published official highway-count check, including the Deegan.

## Can we say we used all available bridge traffic datasets?

**No.** The project used three traffic datasets and checked two alternatives for its local before/after design. Additional official sources exist. The main map covers MTA crossings, not all NYC bridges. A defensible statement is: “We used MTA crossing counts and checked two NYC DOT alternatives for a local before/after comparison.”

## Exact source inventory

| Official name and ID | Project status | What it contributes or why it wasn't used |
|---|---|---|
| [MTA Bridges and Tunnels Hourly Crossings: Beginning 2019](https://data.ny.gov/d/ebfx-2m7v), `ebfx-2m7v` | Used | Hourly vehicle counts by facility, direction, class and payment method. Our aggregation sums those categories. Annual 2024/2025 map and monthly bridge test. |
| [MTA Congestion Relief Zone Vehicle Entries: Beginning 2025](https://data.ny.gov/d/t6yz-b64h), `t6yz-b64h` | Used descriptively | Entry-gate and vehicle-class profiles. Saved pull January 5, 2025–September 5, 2026. No 2024 baseline and no Bronx detection region. It cannot supply the pre/post bridge test. |
| [Automated Traffic Volume Counts](https://data.cityofnewyork.us/d/7ym2-wayt), `7ym2-wayt` | Used for coverage and road-study checks | NYC DOT's rotating studies, counts per 15-minute interval. No usable same-segment, same-direction pre/post pair for the South Bronx roads in the project. |
| [Vehicle Classification Counts (2011 - 2025)](https://data.cityofnewyork.us/d/96ay-ea4r), `96ay-ea4r` | Checked; rejected for the local paired test | Saved analysis found 117 segments in 2024 and 308 in 2025+, with zero segment-ID overlap. No borough column. |
| [Traffic Volume Counts (Historical)](https://data.cityofnewyork.us/d/btm5-ppia), `btm5-ppia` | Checked; rejected for the local paired test | Saved coverage ends May 9, 2021, before congestion pricing. |
| [MTA Bridges & Tunnels Hourly Traffic Rates: 2010 - 2025](https://data.ny.gov/d/qzve-kjga), `qzve-kjga` | Additional source; metadata checked in this audit | Deprecated predecessor. Official metadata directs users to `ebfx-2m7v`. It isn't additional independent bridge coverage. |
| [Daily Traffic on MTA Bridges & Tunnels](https://data.ny.gov/d/fcbp-umit), `fcbp-umit` | Additional source; metadata checked in this audit | Another MTA aggregation, with date, plaza, direction and E-ZPass/video-toll fields. Not an input to the saved results; potentially useful as a cross-check. |
| [NYC Bridges & Crossings Traffic Volumes Dashboard](https://www.nyc.gov/html/dot/html/about/datafeeds.shtml) | Identified; not integrated | NYC DOT lists yearly/hourly average traffic for bridges and roadways and says it incorporates the former Bridge Volumes, Manhattan Crossings and Screenline reports. Its available years and station-level comparability still need checking. |
| [Port Authority 2025 Monthly Traffic and Percent of E-ZPass Usage](https://www.panynj.gov/content/dam/bridges-tunnels/pdfs/traffic-e-zpass-usage-2025.pdf) | Verified; not integrated | Official monthly eastbound counts for George Washington, Lincoln, Holland, Goethals, Outerbridge and Bayonne, separated into cars, buses and trucks. These crossings are outside the current MTA map. Counts are marked preliminary. |

The four additional dataset rows were identified in this audit. The official highway appendix below was also checked separately. Their existence disproves an “all available datasets used” claim. This list isn't a claim that no other traffic source exists.

## What we mapped

The map contains ten facility records representing nine physical MTA crossings. The RFK Bridge's Bronx and Manhattan arms appear separately. We compared complete calendar years January 1–December 31, 2024 and January 1–December 31, 2025.

| Facility record | 2024 crossings | 2025 crossings | Annual change |
|---|---:|---:|---:|
| RFK Bronx | 52,506,343 | 52,574,751 | +0.13% |
| Bronx–Whitestone | 49,893,667 | 50,700,608 | +1.62% |
| Throgs Neck | 45,182,230 | 45,245,619 | +0.14% |
| Henry Hudson | 25,243,179 | 25,313,379 | +0.28% |
| RFK Manhattan | 17,118,954 | 17,415,357 | +1.73% |
| Queens Midtown | 30,433,062 | 30,024,381 | −1.34% |
| Hugh L. Carey | 22,626,078 | 21,981,320 | −2.85% |
| Verrazzano–Narrows | 81,000,607 | 81,160,067 | +0.20% |
| Cross Bay | 7,774,075 | 7,823,341 | +0.63% |
| Marine Parkway | 7,994,115 | 8,113,733 | +1.50% |

Counts are vehicle-crossing events, not unique vehicles, people, journeys, origins or destinations. Every Bronx-group crossing had a small annual increase. “They didn't get busier” would misstate the descriptive data.

## What the monthly test does

The analysis window is January 2024–December 2025. For each facility-month, it computes `log(current monthly crossings) - log(crossings 12 months earlier)`. Consequently, 2023 supplies the baseline for 2024, and 2024 supplies the baseline for 2025. The pooled model compares the change in that year-over-year growth between the four Bronx crossings and three controls, with facility and month fixed effects. The event plot omits December 2024. January 2025 contains four pre-toll days; tolling began January 5.

- Bronx group: Bronx–Whitestone, Henry Hudson, Throgs Neck and RFK Bronx.
- Comparison group: Cross Bay, Marine Parkway and Verrazzano–Narrows.
- Bronx result: 168 facility-months, seven facility clusters; coefficient −0.0105; displayed estimate −1.04%; 95% interval −3.63% to +1.61%; wild cluster bootstrap p = 0.4922 from 128 sign draws.
- Tunnel comparison: Hugh L. Carey and Queens Midtown versus the same controls; 120 facility-months, five clusters; displayed estimate −2.29%; 95% interval −3.39% to −1.18%; bootstrap p = 0.0625 from 32 draws. It isn't a decisive positive control at a 5% bootstrap threshold.

The percentage fields use `100 × (exp(coefficient) − 1)`. This is a relative change in the growth factor, not exactly a percentage-point gap between ordinary growth rates. The plot and copy now use percent consistently. The interval is the normal approximation using clustered standard errors, not a bootstrap confidence interval. Small cluster counts limit inference.

The main comparison found no clear Bronx increase. It doesn't demonstrate zero diversion, measure traffic on the Deegan, or establish drivers' motives. Free East River/Harlem River crossings and Port Authority facilities are outside this map. The separate daily permutation result (p = 0.77) comes from a different design; the rewritten slide doesn't conflate it with the monthly test.

## Why the road-count check couldn't settle the local question

The saved DOT audit reports 104 counted segments citywide in 2024 and 101 in 2025; the Bronx has 12 and 16. The location samples rotate. Across all years, the two eligible Bronx repeat pairs don't bracket January 5, 2025. An apparent Pelham Parkway 2024/2025 repeat is a duplicated study with flipped direction labels. A Bruckner 2018/2025 repeat compares complete weekend days with weekdays and was excluded. These checks are documented in `data/derived/dot.json`, `analysis/analyze_dot.py` and `data/SOURCES.md`.

## Suggested spoken story

“The map made us wonder whether drivers would avoid the Manhattan fee by choosing a route through the Bronx. We used MTA Bridges and Tunnels Hourly Crossings: Beginning 2019 to map the change from calendar 2024 to calendar 2025 at nine MTA crossings, with the RFK Bridge's two arms shown separately.

“Bronx–Whitestone rose from 49,893,667 crossings to 50,700,608, an increase of 1.62%. But an increase alone doesn't show that the fee sent drivers there. We compared Bronx–Whitestone, Henry Hudson, Throgs Neck and RFK Bronx with Cross Bay, Marine Parkway and Verrazzano–Narrows. Our monthly test used 2024 against 2023 as its pre-period, then 2025 against 2024 as its post-period. The adjusted estimate was −1.04%, with a range from −3.63% to +1.61%, so it didn't establish a Bronx increase.

“We also used MTA Congestion Relief Zone Vehicle Entries: Beginning 2025 and Automated Traffic Volume Counts, and checked Vehicle Classification Counts (2011 - 2025) and Traffic Volume Counts (Historical). The gate file had no 2024 baseline; the road files had no usable local before/after pair. That leaves the Deegan and local streets unresolved. Our next traffic check needs comparable counts there and coverage beyond the MTA crossings.”

## Verification files

- Exact saved bridge values: `data/derived/bt.json`; browser data: `data/bundle.js`.
- Model and percent transform: `analysis/run_analysis.py`.
- Saved source provenance: `data/SOURCES.md`.
- Official source names/descriptions/columns checked October 9: `docs/traffic-source-metadata-2026-10-09.json`.
- Story wording: `data/story.js`; storytelling preference: `docs/VOICE.md`.

## Additional official Deegan evidence, checked October 9

NYC Health published *Air Quality Impacts of Congestion Relief Zone Tolling* on August 14, 2026. Its [Detailed Traffic Analysis Methodology appendix](https://a816-dohbesp.nyc.gov/IndicatorPublic/data-features/congestion-pricing-report/embeds/CRZ_Report_Appendix.pdf), Tables A-1 and A-2, reports seasonally adjusted annual-average daily traffic:

| Major Deegan, Site C | 2024 estimate (passages/day) | 2025 estimate (passages/day) | Change |
|---|---:|---:|---:|
| All vehicles | 129,955 | 128,727 | −0.94% |
| Trucks | 10,326 | 10,296 | −0.29% |

Formula: (2025 − 2024) / 2024 × 100. Site C / NYSDOT 010021 (01S000001) is I-87 from Willis Avenue overpass to East 138th access. Periodic counts generally span about 50 weekday hours, with several seasonal rounds and regional adjustment factors from 11 continuous stations. This is a separate highway estimate, not a rerun of the crossing model or continuous local emissions data. The [NYSDOT Traffic Dataviewer](https://nysdottrafficdata.drakewell.com/publicmultinodemap.asp) is another official source identified here; its underlying records were not integrated.

**Updated spoken conclusion:** “Our crossing model found no clear relative increase. The official Deegan estimate also fell slightly in 2025, for all vehicles and for trucks. Yet the community air study estimated increases at four highway-adjacent monitors. Vehicle counts are not particle emissions, the maximum monitor is unlocated, and the city’s separate air study did not find a significant pricing-related PM2.5 change. We do not yet know the cause. The next test must match calibrated air readings with local vehicle classes, speeds, idling, weather and other sources over the same dates and places.”

The prior saved DOT-pull gap remains true for that dataset and pairing rule. It should not be expanded into “no agency counted the Deegan” or “local traffic data do not exist.”
