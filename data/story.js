/* Story dictionary. index.html renders page copy from STORY only. */
(function (factory) {
  const STORY = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = STORY;
  if (typeof window !== "undefined") window.STORY = STORY;
})(function () {
  function P(parts, extra) {
    const spec = { parts: parts };
    if (extra) {
      if (extra.note) spec.note = true;
      if (extra.id) spec.id = extra.id;
      if (extra.slot) spec.slot = extra.slot;
    }
    return spec;
  }

  function resolve(section, part) {
    const bits = String(part).split(":");
    const key = bits[0];
    const idx = bits.length > 1 ? Number(bits[1]) : null;
    const val = section[key];
    if (val == null || (idx != null && val[idx] == null)) {
      throw new Error("story missing " + part);
    }
    if (idx != null) return val[idx];
    if (Array.isArray(val)) return val.join(" ");
    return val;
  }

  function materialize(section, story) {
    const out = [];
    (section.plan || []).forEach(function (spec) {
      if (spec.counters) {
        story.sections.counters.items.forEach(function (item) {
          out.push({
            text: item.claim + " " + item.refute,
            note: false,
            id: "",
            slot: spec.slot || "lead"
          });
        });
        return;
      }
      out.push({
        text: spec.parts.map(function (part) { return resolve(section, part); }).join(" "),
        note: !!spec.note,
        id: spec.id || "",
        slot: spec.slot || "lead"
      });
    });
    section.render = out;
  }

  const STORY = {
  "thesis": {
    "beat": "The question",
    "headline": "A study estimated cleaner air in the paid zone. What happened in the South Bronx?",
    "takeaway": "Congestion pricing began on January 5, 2025, with cleaner air among its expected benefits. Fraser and colleagues estimated 22% lower daily-maximum PM2.5 inside the paid zone than under their no-fee model during the first six months. A separate South Bronx study estimated increases in hourly PM2.5, reaching +1.29 µg/m³ near an expressway.",
    "lookat": "The Deegan photo shows why we focus on this neighborhood: highway traffic runs close to homes. It does not measure pollution or identify the monitor with the +1.29 estimate.",
    "blocks": [
      {
        "sub": "What the units mean",
        "text": "PM2.5 means airborne particles generally 2.5 micrometers or smaller, small enough to reach deep into the lungs. We measure their concentration in micrograms per cubic meter, written µg/m³. A microgram is one millionth of a gram; a cubic meter is a cube of air one meter on each side. Higher µg/m³ means more particle mass in the same volume of air. The 2.5 describes particle size; µg/m³ describes how much is in the air."
      },
      {
        "sub": "Where was PM2.5 22% lower?",
        "text": "The study is A first look into congestion pricing in the United States: PM2.5 impacts after six months of New York City cordon pricing, by Timothy Fraser and colleagues (npj Clean Air, 2025). Inside Manhattan's Congestion Relief Zone, at or below 60th Street, it estimated a 3.05 µg/m³ reduction from a modeled no-fee concentration of 13.8 µg/m³: 3.05 ÷ 13.8 × 100 ≈ 22%. This is lower than a prediction of what would have happened without pricing, not a simple 2024-to-2025 drop. The paper also analyzed the five boroughs and metro area; it wasn't limited to the zone."
      },
      {
        "sub": "Which source covers the South Bronx?",
        "text": "We use published results from South Bronx Unite's community-managed air sensor network, analyzed in Impacts of New York City's Congestion Pricing Policy on PM2.5 in the South Bronx: Evidence from a Community-Managed Air Sensor Network, led by Alexander De Jesus with Columbia, Brown and CU Boulder. Its public 2026 abstract compares hourly readings from 19 monitors across January 2024–December 2025. The models adjust for seasonality, temperature, humidity, wind and residential heating. The estimated network-wide step increase was +0.22 µg/m³; the largest highway-adjacent estimate was +1.29 µg/m³. The study was undergoing peer review when these results were released."
      },
      {
        "sub": "Why does +1.29 matter?",
        "text": "+1.29 means 1.29 more micrograms of particles in every cubic meter of air, not a 1.29% rise. It is about 5.9 times the network's estimated +0.22 µg/m³ increase, and its 95% uncertainty interval, +0.85 to +1.70 µg/m³, stays above zero, so the authors call it statistically significant. To compare it with the 22% drop, we turned it into a percentage, which needs a starting level. The study does not publish that sensor's own starting level, so we use the closest official one: NYC Health's Community Air Survey put the 2024 yearly average for Hunts Point–Mott Haven at 6.89 µg/m³. Against that, +1.29 is about a 19% increase (1.29 ÷ 6.89 × 100), and the network's +0.22 is about 3%. The sensor sits beside a highway, where the air usually starts dirtier than the neighborhood average, so its true percentage is probably below 19%. For scale, +1.29 is also about 14% of 9.0 µg/m³, the yearly limit the EPA set in 2024. The 22% and the 19% come from different studies and models, so they compare size, not an exact match. That makes +1.29 a local warning worth investigating, not proof that diverted traffic caused it."
      },
      {
        "sub": "What we set out to answer",
        "bullets": [
          "Did drivers dodge the fee by cutting through the Bronx?",
          "What could explain the South Bronx increases?",
          "What can the city do about it, now and later?"
        ]
      }
    ],
    "methods_expandable": {
      "summary": "Sources",
      "bullets": [
        "Fraser et al. (2025), npj Clean Air 1:39, doi 10.1038/s44407-025-00037-2. Daily-maximum PM2.5, modeled no-fee comparison, first six months of 2025. The 22% applies to six monitors inside the zone; the full study includes 42 monitors across the metro area.",
        "De Jesus et al. (2026), public abstract hosted by South Bronx Unite. Generalized additive mixed models of hourly PM2.5, January 2024–December 2025; 19 of a 65-monitor network analyzed. Overall step estimate +0.22 µg/m³, 95% interval +0.12 to +0.32; maximum +1.29, interval +0.85 to +1.70. Four monitors had significant increases, two significant decreases, and 13 intervals crossed zero.",
        "These are transcribed published estimates. We did not obtain or recompute the community's hourly sensor dataset. The abstract and press release do not identify the maximum monitor's address or supply its reference concentration. We do not pin that value to East 138th Street.",
        "A percentage needs a stated denominator: concentration change ÷ the relevant reference concentration × 100. The 13.8 µg/m³ no-fee prediction belongs to Fraser's zone analysis and cannot be used as the South Bronx denominator. Instead we use the New York City Community Air Survey (NYCCAS) 2024 annual mean for Hunts Point–Mott Haven (UHF 107), 6.89 µg/m³, from NYC Health's Environment & Health Data Portal; its 2025 value is 6.80 µg/m³. A highway-side sensor likely starts higher, so 19% is an upper-end estimate. The EPA's 2024 annual PM2.5 standard is 9.0 µg/m³."
      ]
    },
    "captions": [
      "Fraser et al., Figure 1: estimates from several models for the metro area, city and paid zone. The purpose is to show where and how the modeled reduction was estimated. The headline 22% refers to the paid-zone daily maximum, not every neighborhood."
    ],
    "sources": [
      {
        "title": "Fraser et al.: full paper (2025)",
        "url": "https://www.nature.com/articles/s44407-025-00037-2"
      },
      {
        "title": "De Jesus et al.: South Bronx study abstract (2026)",
        "url": "https://www.southbronxunite.org/s/DeJesus-Congestion-Pricing-Abstract.pdf"
      },
      {
        "title": "South Bronx Unite: primary findings and study status",
        "url": "https://www.southbronxunite.org/congestion-pricing"
      },
      {
        "title": "EPA: what PM2.5 means",
        "url": "https://www.epa.gov/pm-pollution/particulate-matter-pm-basics"
      },
      {
        "title": "NYC Health: neighborhood PM2.5 yearly averages (NYCCAS)",
        "url": "https://a816-dohbesp.nyc.gov/IndicatorPublic/data-explorer/air-quality/?id=2023"
      },
      {
        "title": "EPA: 2024 annual PM2.5 standard, 9.0 µg/m³",
        "url": "https://www.epa.gov/pm-pollution/final-reconsideration-national-ambient-air-quality-standards-particulate-matter-pm"
      }
    ],
    "table": {
      "caption": "PM2.5 estimates with units. Zone: daily maximum versus a no-fee prediction. South Bronx: adjusted step change in hourly concentration; its percentages use NYC Health's 2024 Hunts Point–Mott Haven average, 6.89 µg/m³, as the starting level. These are different comparisons.",
      "rows": [
        [
          "Manhattan paid zone",
          "−3.05 µg/m³ (about −22% vs no-fee prediction)"
        ],
        [
          "South Bronx, 19 monitors",
          "+0.22 µg/m³ estimated network increase, about +3% against the 2024 neighborhood average"
        ],
        [
          "Largest highway-adjacent estimate",
          "+1.29 µg/m³, about +19% against the 2024 neighborhood average of 6.89 µg/m³"
        ]
      ]
    },
    "plan": []
  },
  "sections": {
    "spill": {
      "beat": "The test",
      "headline": "Did drivers dodge the fee through the Bronx? The MTA bridge test found no clear increase.",
      "takeaway": "The map suggested a possible detour through the Bronx. Our four-crossing MTA test found no clear relative increase. A newer official highway count report also estimates a slight Deegan decrease; neither identifies the cause of the community air-sensor result.",
      "blocks": [
        {
          "text": "The map gave us our first hypothesis: drivers might avoid entering the paid zone by choosing a route through the Bronx. We mapped ten facility records representing nine MTA bridges and tunnels, with the RFK Bridge's Bronx and Manhattan arms counted separately. These records count vehicles crossing each facility. They don't identify people's destinations or trace individual routes."
        },
        {
          "sub": "Why does the gate chart show zero in the Bronx?",
          "text": "The congestion fee is charged for entering Manhattan's zone at or below 60th Street. The gate dataset groups detections at the zone's entry points; it has no Bronx detection region because the Bronx is outside that boundary. Its 12 named detection groups aren't 12 individual toll gantries. A driver arriving from the Bronx can still be charged upon entering the Manhattan zone. Zero here means no Bronx category in this entry dataset, not zero Bronx traffic or zero bridge tolls."
        },
        {
          "sub": "What changed in the annual bridge counts?",
          "text": "We used MTA Bridges and Tunnels Hourly Crossings: Beginning 2019 to compare January 1–December 31, 2024 with the same dates in 2025. Bronx–Whitestone rose from 49,893,667 to 50,700,608 vehicle-crossing events: (50,700,608 − 49,893,667) ÷ 49,893,667 × 100 = +1.62%. RFK Bronx rose 0.13%, Throgs Neck 0.14% and Henry Hudson 0.28%. Small annual increases alone do not establish fee-related diversion; we need a comparison with other crossings."
        },
        {
          "text": "The monthly test compared 2024 growth against the same months in 2023, then 2025 growth against the same months in 2024. Its adjusted relative-change estimate for the Bronx group was −1.04%, with a 95% range from −3.63% to +1.61%. That range includes zero, so the test found no clear increase relative to the comparison bridges. It cannot rule out a smaller increase or diversion onto roads outside this dataset."
        },
        {
          "sub": "What the other traffic files could tell us",
          "text": "MTA Congestion Relief Zone Vehicle Entries: Beginning 2025 described entry gates and traffic from January 5, 2025 through our September 5, 2026 pull, but supplied no 2024 baseline. NYC DOT's Automated Traffic Volume Counts supplied 15-minute road studies, but no usable matching before-and-after counts on our South Bronx roads. We also checked Vehicle Classification Counts (2011–2025) and Traffic Volume Counts (Historical); neither supported that local comparison. We haven't used every available bridge dataset: NYC DOT's Bridges & Crossings Traffic Volumes Dashboard, Port Authority monthly traffic reports and MTA's daily and older hourly files are additional sources identified in the audit."
        },
        {
          "sub": "Read the bottom graph",
          "bullets": [
            "Bronx routes means four MTA crossing records: Bronx–Whitestone, Henry Hudson, Throgs Neck and the RFK Bronx arm. It is a group of crossings, not all traffic inside the borough.",
            "Comparison bridges means Cross Bay, Marine Parkway and Verrazzano–Narrows. The old label far controls meant these bridges farther from the paid-zone boundary. We use them as a comparison, without assuming they were completely unaffected.",
            "Zone-serving tunnels means Hugh L. Carey and Queens Midtown. The old label cordon tunnels referred to the boundary of the priced area. These are the two MTA tunnels in this test, not every tunnel entering Manhattan.",
            "All of 2025 combined replaces pooled: one adjusted model estimate across the group's crossings and all 12 months. The underlying unit is vehicle crossings per month; the plotted unit is percent difference in the year-over-year growth factor relative to the comparison bridges.",
            "A dot is the estimate; its line is a 95% uncertainty interval. Zero means no adjusted relative difference. The Bronx interval crosses zero, so there is no clear increase. The tunnel dot is lower, but a separate check for the small number of crossings gives p = 0.0625, so we don't treat it as definitive at the 5% threshold."
          ]
        },
        {
          "sub": "A newer official check reaches the Deegan",
          "text": "During this source audit, we also checked NYC Health's August 2026 report, Air Quality Impacts of Congestion Relief Zone Tolling, and its Detailed Traffic Analysis Methodology appendix. Table A-1 reports Major Deegan annual-average daily traffic of 129,955 vehicles/day in 2024 and 128,727 in 2025: (128,727 − 129,955) ÷ 129,955 × 100 = −0.94%. Table A-2 reports trucks declining from 10,326 to 10,296/day, or −0.29%. These are the agencies' seasonally adjusted estimates from periodic highway counts, not a rerun of our bridge model. They do not measure every street or explain a particular air sensor."
        }
      ],
      "methods_expandable": {
        "summary": "Methods",
        "bullets": [
          "The bridge map sums vehicle counts across directions, vehicle classes and payment methods for January 1–December 31 in 2024 and 2025. Crossings are not unique vehicles, people or trips.",
          "The monthly model uses January 2024–December 2025, with 2023 counts providing the 12-month lag. The outcome is log(monthly crossings) minus log(crossings in the same month a year earlier). Facility and month fixed effects compare changes in growth between groups. January 2025 includes four days before tolling began.",
          "Bronx group: Bronx–Whitestone, Henry Hudson, Throgs Neck and RFK Bronx. Comparison group: Cross Bay, Marine Parkway and Verrazzano–Narrows. The Bronx test has 168 facility-month observations and seven facility clusters.",
          "Estimate −1.04%, 95% range −3.63% to +1.61%, wild cluster bootstrap p = 0.4922. The plotted unit is 100 × (exp(coefficient) − 1), a relative change in the year-over-year growth factor, not an exact percentage-point difference between annual growth rates. The 95% range uses clustered standard errors and a normal approximation; it is not a bootstrap interval.",
          "The same comparison for Hugh L. Carey and Queens Midtown tunnels gives −2.29%, range −3.39% to −1.18%. Its five-cluster bootstrap p = 0.0625, so we don't treat it as a definitive positive control at the 5% threshold.",
          "Used: MTA Bridges and Tunnels Hourly Crossings: Beginning 2019 (ebfx-2m7v); MTA Congestion Relief Zone Vehicle Entries: Beginning 2025 (t6yz-b64h); Automated Traffic Volume Counts (7ym2-wayt). Checked and rejected for the local paired test: Vehicle Classification Counts (2011–2025) (96ay-ea4r); Traffic Volume Counts (Historical) (btm5-ppia).",
          "The automated count file contains 104 counted segments citywide in 2024 and 101 in 2025, including 12 and 16 in the Bronx. Coverage in both years doesn't mean the same roads were counted. The classification file has no segment-ID overlap between its 2024 and 2025 samples; the historical file ends May 9, 2021.",
          "Scope gap: free East River and Harlem River bridges, Port Authority crossings, the Deegan and local streets aren't covered by our MTA bridge comparison. NYC DOT's Bridges & Crossings dashboard and Port Authority's monthly traffic reports are additional sources identified in our audit, not inputs to this result.",
          "Additional official source checked in this repair: NYC Health's 2026 Detailed Traffic Analysis Methodology appendix, Tables A-1 and A-2. NYSDOT/NYC DOT short counts generally last about 50 hours on weekdays and were collected in several seasons. Seasonal factors use continuous counters. Deegan station: MTA Site C / NYSDOT 010021 (01S000001), I-87 from Willis Avenue overpass to East 138th access. Annual daily averages are estimated vehicle passages, not unique vehicles or a continuous local emissions series."
        ]
      },
      "captions": [
        "Count of named entry-detection groups, not vehicle counts or physical gantries. The Bronx has no region in this Manhattan entry dataset. Source: MTA Congestion Relief Zone Vehicle Entries: Beginning 2025.",
        "All of 2025 combined. Dots show adjusted relative differences in year-over-year crossing growth; lines show 95% intervals. The Bronx interval includes zero. This test does not measure the Deegan or prove where drivers went."
      ],
      "sources": [
        {
          "title": "MTA hourly crossings: source of the bridge map and test",
          "url": "https://data.ny.gov/d/ebfx-2m7v"
        },
        {
          "title": "MTA congestion-zone vehicle entries: source of gate groups",
          "url": "https://data.ny.gov/d/t6yz-b64h"
        },
        {
          "title": "NYC DOT automated traffic counts",
          "url": "https://data.cityofnewyork.us/d/7ym2-wayt"
        },
        {
          "title": "NYC DOT vehicle classification counts",
          "url": "https://data.cityofnewyork.us/d/96ay-ea4r"
        },
        {
          "title": "NYC DOT historical traffic counts",
          "url": "https://data.cityofnewyork.us/d/btm5-ppia"
        },
        {
          "title": "Full monthly comparison and uncertainty",
          "url": "story-art/fig3-did.svg"
        },
        {
          "title": "Traffic dataset audit: used, checked and missing",
          "url": "docs/TRAFFIC-STORY-AUDIT.md"
        },
        {
          "title": "NYC Health: highway traffic methods and 2023–2025 tables",
          "url": "https://a816-dohbesp.nyc.gov/IndicatorPublic/data-features/congestion-pricing-report/embeds/CRZ_Report_Appendix.pdf"
        }
      ],
      "plan": []
    },
    "controls": {
      "beat": "The check",
      "headline": "Why can an air study find an increase when traffic counts do not?",
      "takeaway": "We do not yet know the cause of the community sensors' increases. Our bridge test found no clear relative increase at four Bronx-adjacent crossings; NYC Health's separate Deegan count estimate also fell slightly. Total vehicle counts do not measure all emissions, and the air studies do not agree on a single South Bronx effect.",
      "blocks": [
        {
          "sub": "Short answer: why could the air get worse if traffic did not?",
          "text": "First, it did not get worse everywhere. In the community study, 4 of 19 sensors showed a clear rise, and all four sit near expressways; 2 showed a clear drop and 13 showed no clear change. The city's own monitor study found no clear change tied to the fee at the environmental-justice sites it checked, and NYC Health's yearly air survey even puts the Hunts Point–Mott Haven average slightly lower in 2025 (6.80 µg/m³) than in 2024 (6.89 µg/m³). Second, a traffic count tells you how many vehicles passed, not how much exhaust they made. The same count can pollute more if more of the vehicles are diesel trucks, if traffic crawls or idles, or if trips move to night hours, when air stays low and mixes less. We have not tested that timing idea; it needs hourly counts. Third, other sources add particles too, such as construction, building heat, cooking and wildfire smoke. So nobody has proven the cause yet. The rest of this page shows what we checked."
        },
        {
          "sub": "The traffic finding and the air finding measure different things",
          "text": "The community-managed study estimated an adjusted +0.22 µg/m³ network change across 19 monitors, with increases at four highway-adjacent sites. Our MTA test measured vehicle crossings, not emissions near those monitors. NYC Health's separate highway appendix reports Deegan traffic down 0.94% and trucks down 0.29% between 2024 and 2025. Neither establishes why the community network's estimate rose, especially because the maximum monitor's address is unpublished."
        },
        {
          "sub": "What could explain the difference, and what we have not established",
          "text": "The same number of vehicles can produce different emissions if vehicle types, idling, speeds or routes change. Pollution concentration can also change with regional smoke, local heating, cooking, construction and how air moves around buildings. These are possible explanations, not findings from this project. The community model adjusted for seasonality, temperature, humidity, wind speed and residential heating; adjustment reduces selected confounding but does not identify the source of the remaining increase."
        },
        {
          "sub": "First check whether the increase is consistent across studies",
          "text": "NYC Health's August 2026 analysis of integrated monitors found no statistically significant pricing-related PM2.5 change at the evaluated environmental-justice sites. That differs from the community hourly-sensor result. The monitoring locations, sampling methods and statistical models differ, so neither a universal South Bronx increase nor a traffic-diversion cause is established. To resolve this, compare co-located, calibrated air readings with local vehicle classes, speeds, idling, weather and other emissions over the same dates."
        },
        {
          "sub": "Could global warming explain the air-quality change?",
          "text": "Global warming can affect air pollution through wildfire smoke and changing weather. To check whether worsening air also appeared elsewhere, we used EPA Air Quality System annual records for Houston North Wayside (site 48-201-0046). Annual PM2.5 fell from 13.10 to 12.17 µg/m³, a 7.1% decrease. Thomas J. Barber’s May 2026 Cornell thesis, The New York City Congestion Charge: Air Quality, Traffic, and Crime, reports CBD before/after means of 8.70 and 7.56 µg/m³ (Table A.8); its monthly air panel spans May 2024–June 2025. That is a 13.1% decrease from the rounded means, not a calendar-year comparison. In Houston, the fall is 0.93 µg/m³; 0.93 ÷ 13.10 × 100 ≈ 7.1%. One monitor in Houston cannot rule out global warming or New York's local weather. The 2025 Houston record is only 84% complete and is not certified."
        },
        {
          "sub": "Why use the Van Wyck in Queens?",
          "text": "The Van Wyck Expressway in Queens was the comparison site in NYC Health's August 2026 report, Air Quality Impacts of Congestion Relief Zone Tolling. A comparison site is a place the fee should barely affect, so its readings show what weather and citywide trends did on their own. The city used the Van Wyck readings, plus weather and time trends, to predict what each other site would have measured without the fee. The gap between that prediction and the real reading is the part that could come from pricing. At the environmental-justice sites it evaluated, the city found no clear pricing-related PM2.5 change. This is a different study from the Queensboro chart."
        },
        {
          "sub": "How the bottom graph was calculated",
          "text": "The bottom graph transcribes Goldberg and colleagues' preprint, Variable Short-Term Air Quality Impacts of New York City's Congestion Pricing Policy. It compares each site's July–January versus January–June change in 2024–25 with the corresponding change in 2023–24. The difference between those two changes is the plotted estimate: Queensboro −9.08 µg/m³, Williamsburg +6.30 µg/m³, Cross Bronx +3.74 µg/m³ and Broadway / West 35th +2.46 µg/m³. Those are adjusted differences, not raw annual changes or percentages. All six sites' raw January–June averages fell; a positive adjusted estimate means less improvement than the model expected. Two sites had no clear adjusted change and are omitted from this four-site panel."
        },
        {
          "sub": "Where did 5.9 times come from?",
          "text": "The largest South Bronx estimate, +1.29 µg/m³, is 5.9 times the network estimate of +0.22. That compares changes; it does not say pollution was six times higher or that neighboring blocks were measured. The public abstract does not identify the maximum monitor's address. Separately, 31.8% of multi-unit truck entries into the paid zone were overnight, versus 19.7% of car entries. Those zone-entry counts cannot establish truck traffic on the Deegan."
        },
        {
          "sub": "Data",
          "text": "EPA Air Quality System (Houston), NYC Health (Van Wyck), Barber's thesis (downtown), South Bronx Unite sensors, Goldberg et al. 2025 (city roadside monitors, preprint), MTA Bridges and Tunnels."
        }
      ],
      "methods_expandable": {
        "summary": "Methods",
        "bullets": [
          "Houston North Wayside, EPA site 48-201-0046, sits by truck and rail yards. Annual PM2.5 fell from 13.10 to 12.17 µg/m³ (−7.1%). The 2025 file is 84% complete and not yet certified.",
          "Downtown: Thomas J. Barber, The New York City Congestion Charge: Air Quality, Traffic, and Crime (Cornell MS thesis, May 2026), Table A.8, before/after CBD means 8.70 → 7.56 µg/m³. Monthly panel May 2024–June 2025; the displayed −13.1% uses rounded means, while the original table reports −13.15%.",
          "Roadsides: Goldberg et al., Variable Short-Term Air Quality Impacts of NYC Congestion Pricing, Research Square preprint, Dec 2025, doi 10.21203/rs.3.rs-8158429/v1. Difference-in-differences on 6 NYCCAS real-time sites. Reported significant estimates: Queensboro −9.08 µg/m³, Williamsburg +6.30 µg/m³, Cross Bronx +3.74 µg/m³, Broadway / W 35th +2.46 µg/m³. These coefficients are in concentration units, not percent. Not yet peer reviewed.",
          "NYC Health estimates vehicles contribute roughly 14% of NYC PM2.5 emissions; this is an emissions share, not a claim that 14% of every sensor reading comes from traffic. Its highway appendix reports Deegan annual-average daily traffic 129,955 → 128,727 vehicles/day (−0.94%) and trucks 10,326 → 10,296/day (−0.29%), 2024–2025. Our bridge comparison remains a separate analysis.",
          "Top graph: Houston shows a calendar-year difference; downtown shows the thesis’s before/after mean difference; South Bronx bars are published adjusted hourly step estimates. Bottom graph: daily PM2.5 difference-in-differences across two July–June seasons, pre/post split January 5. Values use µg/m³ throughout, but their different metrics and models should not be combined."
        ]
      },
      "captions": [
        "Top: separate changes in PM2.5 concentration, µg/m³. Houston annual means, downtown before/after means and adjusted hourly estimates differ. Bottom: published daily-average model estimates, also µg/m³, across two July–June seasons. Positive means higher than the study's counterfactual, even when raw readings fell."
      ],
      "sources": [
        {
          "title": "EPA annual monitor files: Houston North Wayside",
          "url": "https://aqs.epa.gov/aqsweb/airdata/download_files.html"
        },
        {
          "title": "NYC Health report: Van Wyck comparison and weather adjustment",
          "url": "https://a816-dohbesp.nyc.gov/IndicatorPublic/data-features/congestion-pricing-report/"
        },
        {
          "title": "Goldberg preprint: original units and model",
          "url": "https://doi.org/10.21203/rs.3.rs-8158429/v1"
        },
        {
          "title": "EPA: hotter, drier conditions and wildfire pollution",
          "url": "https://www.epa.gov/wildfires/wildland-fires-and-public-health-effects"
        },
        {
          "title": "NYC Health: highway traffic tables and sampling limits",
          "url": "https://a816-dohbesp.nyc.gov/IndicatorPublic/data-features/congestion-pricing-report/embeds/CRZ_Report_Appendix.pdf"
        }
      ],
      "plan": []
    },
    "scores": {
      "beat": "Where to act",
      "headline": "Why investigate East 138th? Start with the method, then the rank.",
      "takeaway": "We wanted a transparent way to compare planting locations. We combined exposure, health and vulnerability, and planting suitability. The result is a planning index, not a measured pollution ranking or a prediction of health benefits.",
      "blocks": [
        {
          "sub": "1. What did we compare, and when?",
          "text": "The original September 2026 scan joined 99,357 NYC Street Centerline road segments into 33,785 overlapping candidate corridor windows. Each window is 0.8–2.0 km long, targeting 1.6 km. These are analysis units, not 33,785 different streets or blocks. The scan used historical sources: 2015 Street Tree Census, 2020 Census population, the NFH dataset marked published 2020, and 2023 asthma rates. They describe different years."
        },
        {
          "sub": "2. Why choose these factors?",
          "text": "Our aim is to identify places where residents face environmental burdens and where planting may be feasible. Exposure proxies address possible sources; asthma, financial vulnerability and heat address the people affected; tree gaps and street shape address whether planting is appropriate. These choices express our planning priorities. They are not scientifically fitted causal weights."
        },
        {
          "sub": "3. What do the weights mean?",
          "text": "The percentages below are shares of the score and sum to 100%. They are not percentages of pollution removed or people helped. We give exposure factors 33%, health and vulnerability 33%, and planting suitability 34%. Asthma carries 20% because health is central to the question; income and heat stay smaller because they overlap with other vulnerability measures."
        },
        {
          "bullets": [
            "15% · Road proximity: distances in meters to bridges, ramps and highways, converted to a distance-decay proxy. Nearer roads raise the grade; this is not a traffic count.",
            "10% · Published air-monitor signal: the sign of a published PM2.5 change, weakened with distance up to 1,500 m. A monitor is an instrument measuring air at one location, not an instrument on every listed street. The old South Bronx coordinate is unverified; this factor needs correction before a new ranking can be defended.",
            "8% · Highway adjacency: share of corridor length within 400 m of a raised or below-grade highway, from 0 to 1. This flags infrastructure exposure but partly overlaps with road proximity.",
            "20% · Asthma: adult and child emergency-department visit rates per 10,000 residents, from NYC Health neighborhood data. This measures existing health burden, not cases caused by congestion pricing.",
            "8% · Financial vulnerability: NFH median income in US dollars, poverty as a percentage, and financial-health rank by PUMA. A PUMA is a large Census statistical area. We use these to prioritize limited public investment, not to claim each resident has that income.",
            "5% · Heat: NYC Heat Vulnerability Index, a score from 1 to 5 by ZIP-code area. It is vulnerability, not degrees of temperature, and already includes overlapping social factors.",
            "17% · Tree gap: living street trees per 100 m in the 2015 census. Fewer street trees raise the grade; park trees and planting changes since 2015 can be missed.",
            "17% · Street shape: building height divided by facade-to-facade street width, both measured in meters. The ratio is dimensionless. More open streets raise the suitability grade; elevated trains and site obstacles are not fully modeled."
          ]
        },
        {
          "sub": "4. How do those factors become “need”?",
          "text": "We orient each factor so a larger grade means a stronger planting case and usually convert it to a citywide percentile grade between 0 and 1; highway adjacency is already a length share. In the revised finalist score, a missing grade is assumed to be 0.5. Need = sum(weight × grade), so need is a dimensionless index from 0 to 1. A value of 0.8725 does not mean 87.25% pollution, poverty or illness. Missing-as-middle is an assumption, not evidence that the missing data are average."
        }
      ],
      "blocks_mid": [
        {
          "sub": "5. Then count residents; only then show the ranking",
          "text": "Using 2020 Census block population, we count residents whose block center lies within 400 m of each corridor, then divide by corridor length in km. Priority = need × residents per km. This estimates residents near a planting corridor weighted by the index; it does not estimate people cured or benefits per dollar. For the selected 1.249 km East 138th window: 32,362 residents ÷ 1.249 km ≈ 25,910 residents/km. Its saved need score is 0.8725; 0.8725 × 25,910 ≈ 22,606 index-weighted residents/km."
        },
        {
          "sub": "6. Why East 138th, and how sure are we?",
          "text": "East 138th was #22 of 33,785 overlapping windows under the original equal-weight model. The revised model re-scores 47 finalist windows and keeps 35 different street names: East 138th is #3 on need and #4 on need × residents/km; Jerome Avenue is #1 on the latter. Those are different rankings with different denominators. We chose East 138th as a corridor to investigate because it combines residential exposure, high neighborhood vulnerability and specific planting gaps, not because it is proven to have the worst air."
        },
        {
          "text": "Across 10,000 random weight mixes among those same 35 finalists, East 138th remained in the top five on the population-weighted index in 92.4% of runs. That tests sensitivity to weights, not whether the source data are true. It does not fix the unlocated South Bronx monitor, stale tree census, block-center population approximation, neighborhood-level health data or streets excluded from the finalists. Treat the displayed ranks as provisional legacy outputs until the air proxy is corrected and the full citywide scan is rerun."
        },
        {
          "sub": "7. Why add the economic map?",
          "text": "NYC DCWP’s Neighborhood Financial Health dataset (r3dx-pew9) reports median income of $15,510 and poverty of 29.3% for PUMA 3710, Hunts Point, Longwood and Melrose. Its $31,238 comparison is the unweighted average of 55 PUMA median incomes, not NYC’s household median. Four nearby CDBG tracts contain 14,525 residents; that is a separate geography from the 32,362 Census residents within the East 138th window’s 400 m buffer. The map shows where these neighborhood indicators apply and why financial vulnerability enters the score."
        }
      ],
      "blocks_tail": [
        {
          "sub": "What could missing data change?",
          "text": "A quiet road near a highway could score high despite low traffic. A neighborhood asthma average could hide a healthier block. Missing local monitors could hide either an increase or a decrease. A 2015 tree count may miss trees planted or removed since then. Wrong monitor coordinates can change the air proxy and ranking. Before selecting an investment, verify sensor locations, recount trees, obtain matched street traffic counts and check utilities, access and planting space on site."
        }
      ],
      "methods_expandable": {
        "summary": "Calculation and source limits",
        "bullets": [
          "Original full scan: equal weights 12.5% per factor; missing factors omitted and remaining weights renormalized. Revised 35-street finalist calculation: policy weights shown above; missing grades fixed at 0.5.",
          "Asthma table values are length-weighted neighborhood rates, not measured street-level disease. East 138th’s corridor average is 186.6 adult asthma ED visits per 10,000, while Hunts Point–Mott Haven alone is 193.5 per 10,000. Geography joins need checking; neither value is an individual risk.",
          "The old citywide red map shows the original equal-weight planning index. It is not a measured PM2.5 map or a map of the revised finalist score."
        ]
      },
      "captions": [
        "A: weights are score shares, totaling 100%. B: horizontal axis is dimensionless need; vertical axis is thousands of residents per km within 400 m. Dots are 35 finalists. Both rankings retain an unverified legacy air proxy.",
        "Economic context by 2010 PUMA boundary: NFH median income (US dollars) and poverty (%), dataset marked published 2020. Outlined: PUMA 3710. These are area statistics, not household readings or block-level values.",
        "Tree-gap evidence: 2015 census counts in ten 120 m analysis bays on East 138th. Bay numbers are project IDs, not street addresses. Six bays have fewer than seven living street trees and modeled open geometry; current planting space needs verification."
      ],
      "rankCaption": "Provisional priority among 35 finalist streets, not all NYC streets. Need: dimensionless 0–1. Residents/km: 2020 residents within 400 m divided by corridor length. Asthma ED: adult visits per 10,000 residents. Trees/100 m: 2015 living street trees.",
      "sources": [
        {
          "title": "NYC Street Centerline: corridor geometry",
          "url": "https://data.cityofnewyork.us/d/inkn-q76z"
        },
        {
          "title": "DCWP Neighborhood Financial Health: income and poverty",
          "url": "https://data.cityofnewyork.us/d/r3dx-pew9"
        },
        {
          "title": "NYC Health: asthma data",
          "url": "https://a816-dohbesp.nyc.gov/IndicatorPublic/"
        },
        {
          "title": "2015 Street Tree Census",
          "url": "https://data.cityofnewyork.us/d/uvpi-gqnh"
        },
        {
          "title": "2020 Census blocks: population input",
          "url": "https://www2.census.gov/geo/tiger/TIGER2020/TABBLOCK20/"
        },
        {
          "title": "NYC Heat Vulnerability Index",
          "url": "https://data.cityofnewyork.us/d/4mhf-duep"
        }
      ],
      "plan": []
    },
    "location": {
      "beat": "From the map to the sidewalk",
      "headline": "Six archived tree gaps give us places to inspect first.",
      "takeaway": "The 2015 census shows uneven tree coverage in ten roughly 120 m analysis bays on East 138th. Six low-count bays pass our simple street-geometry screen. They are candidates for a current site visit before any planting decision.",
      "blocks": [
        {
          "text": "After comparing corridors, we asked a smaller question: where on East 138th might planting fit? We divided the modeled centerline into ten roughly 120 m analysis bays, with IDs 2, 3, 4, 5, 7, 8, 9, 10, 11 and 12, and counted living trees from the NYC 2015 Street Tree Census. These bay IDs are project labels, not addresses or whole city blocks. Four of fourteen possible bins were omitted because they had fewer than three fronting building footprints. The ten retained bays contain 70 of the corridor band’s 81 archived living trees. Bay 4 had zero trees, bay 8 had 21, and the average was seven trees per retained bay."
        },
        {
          "sub": "How the shortlist works",
          "text": "First read the map: dots are trees recorded alive in 2015; numbered colored lines are analysis bays. Green means a survey candidate, gold means an airflow review, and gray means at or above the archived local mean. These colors describe our screen, not approved planting. The table then shows the counts behind each color. We compare each archived count with seven, then check building height divided by street width, H/W. Both height and width use the same length unit, so H/W has no units. Below 0.5 passes our initial geometry screen; bay 10 is 0.58 and needs an airflow review. H/W comes from NYC Building Footprints (5zhs-2jue): median roof height, converted from feet to meters, divided by inferred facade-to-facade width in meters. The centerline was fitted to 83 archived tree positions; widths are inferred from nearby footprint offsets, not surveyed curb space. H/W = 0.5 means buildings are half as tall as the street is wide. We use it to flag relatively enclosed geometry for airflow review; it is a screening assumption, not a measured pollutant threshold. It does not prescribe tree spacing."
        },
        {
          "text": "Bays 3, 4, 5, 9, 11 and 12 have fewer than seven archived living trees and H/W below 0.5. Bays 2, 7 and 8 meet or exceed the mean. We list the six candidates by bay ID rather than claiming a validated planting priority: the old priority score used distance to an unverified South Bronx peak-monitor location."
        },
        {
          "sub": "Why the zoning map cannot choose the site",
          "text": "FAR means floor area ratio: building floor area divided by lot area. A FAR of 2 permits floor area equal to twice the lot area, subject to other zoning rules. A wide low building and a narrow taller building can have the same FAR. Yellow is not inherently a better garden site than red. This historical zoning image provides development context; it does not measure sidewalk width, tree pits, airflow or whether a highway deck can be built. We choose inspection locations from archived counts and measured site conditions, not FAR colors."
        },
        {
          "sub": "What ‘walls and spaced trees’ meant",
          "text": "The earlier label proposed vegetation on building walls and trees far enough apart to avoid a continuous canopy. We have not calculated a safe spacing in meters or proved that walls improve air here, so bay 10 now says ‘airflow review.’ We also have no verified crash-project award or cost for this site. A nearby road project would not by itself pay for greenery; a named funding source, eligibility decision and site budget are still needed."
        },
        {
          "sub": "What could change the plan",
          "text": "Trees may have been planted or removed since 2015. Underground utilities, sidewalk access, ownership, soil depth and wind could make an apparent gap unsuitable. A current tree inventory, measured street geometry and airflow assessment are needed before choosing species, tree numbers or alternatives such as wall planting. We are confident that the saved census counts are uneven; we are less certain they describe today’s planting space."
        }
      ],
      "methods_expandable": {
        "summary": "Calculation and limits",
        "bullets": [
          "2015 archived living-tree counts in bay-ID order 2, 3, 4, 5, 7, 8, 9, 10, 11, 12: 15, 4, 0, 4, 12, 21, 2, 2, 6, 4. Their sum is 70, so mean = 70 ÷ 10 = 7 trees per roughly 120 m bay (5.83 trees per 100 m).",
          "Gap in the table = archived tree count − 7 trees; for bay 4, 0 − 7 = −7 trees. It is a count difference, not a percent. The mean is a local comparison, not an official tree-density target.",
          "The six-bay shortlist does not follow from the corridor need score alone: need chose a corridor for inspection; the tree-count and geometry rules chose bays within it. Candidate rule: archived count < 7 and modeled H/W < 0.5. The chi-square statistic 58.86 describes uneven counts under a flat-rate assumption. Spatial dependence and unequal planting capacity limit that inference; it does not prove that more trees fit.",
          "A Grubbs test below its outlier cutoff cannot validate a measurement. The previous claim that it proved bay 10 was real has been withdrawn. We need a site measurement.",
          "The previous tree-count correlation and planting order relied on a peak-monitor location not identified in the primary abstract. Those conclusions are withdrawn pending source coordinates and a rerun."
        ]
      },
      "captions": [
        "2020 zoning context: FAR is allowed floor area divided by lot area, a dimensionless ratio. It does not measure current building height, pollution or planting capacity."
      ],
      "blockCaption": "Ten roughly 120 m analysis bays on East 138th. Tree counts: 2015 census. Gap: count minus seven trees. H/W: dimensionless building-height/street-width screen. Candidates require a current survey.",
      "sources": [
        {
          "title": "NYC 2015 Street Tree Census",
          "url": "https://data.cityofnewyork.us/d/uvpi-gqnh"
        },
        {
          "title": "NYC Building Footprints: modeled roof heights and geometry",
          "url": "https://data.cityofnewyork.us/d/5zhs-2jue"
        },
        {
          "title": "NYC Zoning Resolution: floor area ratio definition",
          "url": "https://zoningresolution.planning.nyc.gov/sites/default/files/2020-05/Zoning%20Resolution%20Complete_21May2020_0.pdf"
        }
      ],
      "plan": []
    },
    "counters": {
      "items": [
        {
          "claim": "\"Could global warming explain the change?\"",
          "refute": "The South Bronx model adjusted for several weather variables and still estimated increases at four highway-adjacent monitors. Houston's decline is separate context; it cannot rule out New York weather or identify the cause."
        },
        {
          "claim": "\"Cars spilled into the Bronx.\"",
          "refute": "Our MTA crossing comparison did not establish an increase; the newer official Deegan estimate fell 0.94% for all vehicles and 0.29% for trucks in 2025 versus 2024. These totals cannot explain emissions at an unlocated community monitor. Local traffic behavior and the disagreement between air studies remain unresolved."
        },
        {
          "claim": "\"Trees fix the highway.\"",
          "refute": "They don't. Estimated removal of 10.6 lb of particles per year does not tell us how much a sensor reading in µg/m³ would fall. A deck also needs a study of where its exhaust goes."
        },
        {
          "claim": "\"A highway park costs billions.\"",
          "refute": "Dallas's original park cost $110M for 5.2 acres in 2012. Our earlier $250M–$1.2B range was arithmetic applied to an unsurveyed 12.9-acre concept. It is not a contractor estimate or a price for the compact model."
        }
      ],
      "purpose": "These four questions test whether our recommendation survives the main alternative explanations and practical limits. They show what the evidence answers, what it cannot answer, and the next check needed before spending money."
    },
    "close": {
      "beat": "Reimagining NYC",
      "headline": "Inspect planting gaps now. Study a garden above the Deegan next.",
      "takeaway": "Klyde Warren Park in Dallas shows how a garden can sit above a busy freeway. Space beside the Deegan is tight, so this concept puts a narrow park over the lanes. The road's changing grades, ramps and nearby buildings still need a site survey before we can say where a deck would fit.",
      "blocks": [
        {
          "sub": "Near term: survey first, then size and price the planting",
          "bullets": [
            "The earlier analysis set 180 trees as a planning input. It did not calculate 180 available pits from the ten bays. The six green bays are places to inspect; a current tree, sidewalk and utility survey must establish how many trees fit.",
            "Why about $3,000 per tree? Parks Commissioner Susan Donoghue reported a FY2025 citywide average of $3,110 at the March 20, 2025 Council hearing. At that historical rate, 180 × $3,110 = $559,800 for an illustrative tree-planting component. This is not a quote for East 138th and does not price the walls, roofs, rain gardens or full street works.",
            "Existing Parks and DEP programs provide possible routes to investigate. No award, site allocation, future administration commitment or construction date has been secured."
          ]
        },
        {
          "sub": "How 10.6 pounds per year was calculated",
          "text": "PM2.5 is fine airborne particulate matter. Here, pounds/year measures modeled particle mass removed; µg/m³ measures concentration in air. The complete scenario assumes 180 mature 7 m tree crowns, 40,000 ft² of green wall and 8 acres of green roof. It weights wall area at 0.5 and roof area at 0.35, yielding about 20,116 m² of effective area. Multiply by the historical NYC tree-removal rate of 0.24 g/m²/year, then divide by 453.592 g/lb: about 10.6 lb/year. Those wall/roof weights and planting areas are unvalidated assumptions. The trees alone give about 3.7 lb/year under that arithmetic. Neither number predicts a sensor decrease or a near-term mature canopy."
        },
        {
          "sub": "Later: a garden on top of the Deegan",
          "bullets": [
            "Start with a compact deck above the highway footprint, keeping three lanes in each direction below. Put trees in engineered planting strips and use smaller lawns and gathering spaces.",
            "Dallas did this. Klyde Warren Park cost about $110M for about 5.2 acres and joined Uptown and Downtown again.",
            "A deck moves where exhaust comes out rather than removing it. Exhaust that collects under the deck pours out at its two ends and could make the air worse for homes there, so ventilation, emergency access and nearby homes need a site-specific study before any pollution benefit can be claimed.",
            "A site survey, road-owner coordination, structural and exhaust-dispersion assessments, environmental review and funding must come before construction. We have no approved schedule."
          ]
        },
        {
          "sub": "Klyde Warren: what changed",
          "bullets": [
            "The original 5.2-acre park opened in 2012 over the Woodall Rodgers Freeway and connected two Dallas neighborhoods.",
            "Its design award account reports less air pollution and noise, without giving a measured PM2.5 reduction.",
            "A 2013 landscape study estimated 18,500 lb of CO₂ sequestered by its trees each year. That is a carbon benefit, not a measurement of soot removal.",
            "During one week of summer observations, park temperatures were 1–9°F below the average for its ZIP code. The strongest quantified lesson here is cooling and shade."
          ]
        },
        {
          "sub": "What the deck could do, and how we would check it",
          "bullets": [
            "What it could do: people in the park and on the sidewalks beside it would no longer stand next to open traffic. The deck puts a roof between them and the exhaust and noise, adds shade, and makes it easier to walk across the highway.",
            "Before building: put calibrated low-cost PM2.5 sensors, like the ones in the South Bronx community network, at both ends of the planned deck, on the nearby sidewalks and along an uncovered stretch of the Deegan for comparison. Run them for at least a full year, and place one beside an official monitor to check its accuracy.",
            "After opening: compare the change at the deck sites with the change on the uncovered stretch over the same dates. This is the same before-and-after comparison behind the Queensboro chart. Take traffic for the same days from NYSDOT count station 010021 on the Deegan.",
            "Success means lower PM2.5 on the park and the nearby sidewalks with no rise at the deck's ends. We would log temperature and noise too, because cooling was the clearest measured benefit in Dallas."
          ]
        },
        {
          "sub": "What the acreage and price range mean",
          "text": "The earlier East 138th-to-East 149th scenario used 12.9 acres (not 129 acres), and that area was not surveyed as usable deck space. Its archived $20M–$90M per acre assumption produces 12.9 × $20M = $258M and 12.9 × $90M = $1.161B, rounded to about $250M–$1.2B. Dallas's 2012 $110M ÷ 5.2 acres is about $21.2M per acre, which helps explain the low-end precedent. It does not validate the high end or transfer Dallas costs to New York. Our new compact model is 240 m × 34 m = 8,160 m², or 2.02 acres, and has not been priced."
        }
      ],
      "methods_expandable": {
        "summary": "Assumptions, confidence and next evidence",
        "bullets": [
          "What we can support now: published model estimates, a limited bridge comparison and archived planting-gap evidence. What remains unresolved: the local cause of the air changes, current planting capacity and engineering feasibility of a deck. Missing observations can change which site looks best; weight simulations do not repair missing data.",
          "The 180-tree, 40,000 ft² wall, 8-acre roof and 36-rain-garden quantities are scenario inputs. The 10.6 lb/year PM2.5 and 7.2 million US gallons/year stormwater figures are unvalidated model outputs. The 7 m crowns assume maturity. Literature tree removal rates do not validate wall/roof weights, site capacity or local concentration changes. The previous 8–15% concentration-reduction claim has been withdrawn.",
          "Klyde Warren original phase: 5.2 acres, $110M, opened 2012 (Landscape Architecture Foundation; FHWA). Historical costs are not adjusted to 2026 New York conditions. No comparative PM2.5 percentage measurement is supplied.",
          "Potential programs: DEP green infrastructure, street-tree funding and CDBG. Historical CDBG values cover four nearby tracts, not the 400 m corridor buffer; site eligibility and current funding require verification.",
          "The earlier 12.9-acre corridor estimate is not surveyed usable deck area. This representative model is 240 m × 34 m, or about 2.02 acres. Its six lanes, 30 m road width and 6.6 m clearance are design assumptions.",
          "Klyde Warren sources: Landscape Architecture Foundation / UT Arlington, 2013; ASLA design award narrative, 2017. Neither source supplies a measured PM2.5 percentage reduction.",
          "Approvals depend on the eventual location, ownership and design. Coordinate with the road owner and determine applicable federal, state and city review; the concept does not establish an approval path.",
          "We did not model removing the Deegan or the BQE."
        ]
      },
      "captions": [
        "The Deegan corridor has little spare space. A survey must establish grades, highway clearance and possible access points.",
        "East 135th beside the Deegan wall.",
        "I-87 toward The Motto: highway context, not a surveyed deck boundary."
      ],
      "model": {
        "title": "A narrow garden above the road",
        "caption": "3D concept: a 240 m × 34 m example, with six lanes below. Dimensions are assumptions; the cutaway removes part of the deck to show the roadway.",
        "link": "Explore the 3D model"
      },
      "designs": [
        {
          "title": "Community garden",
          "file": "community-garden.png",
          "caption": "A slender lawn, shaded promenade and seating pavilion."
        },
        {
          "title": "Meadow garden",
          "file": "meadow-garden.png",
          "caption": "Native planting beds, a winding path and small gathering terraces."
        },
        {
          "title": "Play garden",
          "file": "play-garden.png",
          "caption": "A compact playground, shared lawn and small café terrace."
        }
      ],
      "sources": [
        {
          "title": "Klyde Warren landscape study (2013)",
          "url": "https://www.landscapeperformance.org/case-study-briefs/klyde-warren-park"
        },
        {
          "title": "ASLA design award account (2017)",
          "url": "https://www.asla.org/awards-events-main-landing/honors-awards/pro-student-awards/2017-professional-awards/327692"
        },
        {
          "title": "Parks Commissioner FY2025 tree cost, Council hearing transcript at 0:46:17",
          "url": "https://citymeetings.nyc/meetings/new-york-city-council/2025-03-20-0100-pm-committee-on-parks-and-recreation/chapter/discussion-on-street-tree-planting-costs-and-allocation/"
        },
        {
          "title": "US Forest Service: historical PM2.5 tree-removal rate, Table 1",
          "url": "https://www.fs.usda.gov/nrs/pubs/jrnl/2014/nrs_2014_nowak_002.pdf"
        },
        {
          "title": "FHWA: original Klyde Warren cost and funding",
          "url": "https://www.fhwa.dot.gov/ipd/project_profiles/tx_klyde_warren_park.aspx"
        }
      ],
      "options": {
        "caption": "Three options.",
        "rows": [
          {
            "name": "Street trees",
            "estimate": "$3,110/tree: FY2025 citywide average",
            "call": "Now",
            "id": "est-trees"
          },
          {
            "name": "Rain gardens",
            "estimate": "Site design and quote needed",
            "call": "Now",
            "id": "est-gi"
          },
          {
            "name": "Deegan garden deck",
            "estimate": "Site study needed",
            "call": "Later",
            "id": "est-lid"
          }
        ]
      },
      "plan": []
    }
  },
  "order": [
    "spill",
    "controls",
    "scores",
    "location",
    "counters",
    "close"
  ]
};

  STORY.order = ["spill", "controls", "scores", "location", "counters", "close"];

  STORY.fill = function (text, ctx) {
    ctx = ctx || {};
    return String(text)
      .split("{car_peak}").join(ctx.car_peak || "$9")
      .split("{car_overnight}").join(ctx.car_overnight || "$2.25")
      .split("{rank_all}").join(ctx.rank_all || "22")
      .split("{n_windows}").join(ctx.n_windows || "33,785")
      .split("{percentile}").join(ctx.percentile || "99.94")
      .split("{nonoverlap}").join(ctx.nonoverlap || "third")
      .split("{feas_rank}").join(ctx.feas_rank || "13");
  };

  function derive(section) {
    if (!section.takeaway) section.takeaway = section.headline || section.claim || "";
  }

  derive(STORY.thesis);
  STORY.order.forEach(function (key) {
    const section = STORY.sections[key];
    if (key !== "counters") derive(section);
    if (section.plan) materialize(section, STORY);
  });
  materialize(STORY.thesis, STORY);

  return STORY;
});
