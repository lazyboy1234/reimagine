/* Story dictionary. index.html renders page copy from STORY only. */
(function (factory) {
  const STORY = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = STORY;
  if (typeof window !== "undefined") window.STORY = STORY;
})(function () {
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
    "lookat": "The photo shows why we focus here: highway traffic runs right next to homes. The chart puts the three starting numbers side by side: cleaner air in the paid zone, slightly dirtier air across the South Bronx sensor network, and a bigger rise at one highway-side sensor.",
    "blocks": [
      {
        "sub": "What the units mean",
        "text": "PM2.5 means airborne particles generally 2.5 micrometers or smaller, small enough to reach deep into the lungs. We measure their concentration in micrograms per cubic meter, written µg/m³. A microgram is one millionth of a gram; a cubic meter is a cube of air one meter on each side. Higher µg/m³ means more particle mass in the same volume of air. The 2.5 describes particle size; µg/m³ describes how much is in the air."
      },
      {
        "sub": "Where was PM2.5 22% lower?",
        "text": "The study is A first look into congestion pricing in the United States: PM2.5 impacts after six months of New York City cordon pricing, by Timothy Fraser and colleagues (npj Clean Air, 2025). Inside Manhattan's Congestion Relief Zone, at or below 60th Street, it estimated a 3.05 µg/m³ reduction from a modeled no-fee concentration of 13.8 µg/m³: 3.05 µg/m³ ÷ 13.8 µg/m³ × 100 ≈ 22%. This is lower than a prediction of what would have happened without pricing, not a simple 2024-to-2025 drop. The paper also analyzed the five boroughs and metro area; it wasn't limited to the zone."
      },
      {
        "sub": "Which source covers the South Bronx?",
        "text": "We use published results from South Bronx Unite's community-managed air sensor network, analyzed in Impacts of New York City's Congestion Pricing Policy on PM2.5 in the South Bronx: Evidence from a Community-Managed Air Sensor Network, led by Alexander De Jesus with Columbia, Brown and CU Boulder. Its public 2026 abstract compares hourly readings from 19 monitors across January 2024–December 2025. The models adjust for seasonality, temperature, humidity, wind and residential heating. The estimated network-wide step increase was +0.22 µg/m³; the largest highway-adjacent estimate was +1.29 µg/m³. The study was undergoing peer review when these results were released."
      },
      {
        "sub": "Why does +1.29 µg/m³ matter?",
        "text": "+1.29 means 1.29 more micrograms of particles in every cubic meter of air, not a 1.29% rise. It is about 5.9 times the network's estimated +0.22 µg/m³ increase, and its 95% uncertainty interval, +0.85 to +1.70 µg/m³, stays above zero, so the authors call it statistically significant. To compare it with the 22% drop, we turned it into a percentage, which needs a starting level. The study does not publish that sensor's own starting level, so we use the closest official one: NYC Health's Community Air Survey put the 2024 yearly average for Hunts Point–Mott Haven at 6.89 µg/m³. Against that, +1.29 µg/m³ is about a 19% increase (1.29 µg/m³ ÷ 6.89 µg/m³ × 100), and the network's +0.22 µg/m³ is about a 3% increase (0.22 µg/m³ ÷ 6.89 µg/m³ × 100). The sensor sits beside a highway, where the air usually starts dirtier than the neighborhood average, so its true percentage is probably below 19%. For scale, +1.29 µg/m³ is also about 14% of 9.0 µg/m³, the yearly limit the EPA set in 2024. We show them side by side but never subtract one from the other: the 22% compares the zone's daily peak with a modeled no-fee level of 13.8 µg/m³, while the 19% and 3% compare hourly step changes with the 2024 neighborhood average of 6.89 µg/m³. That makes +1.29 a local warning worth investigating, not proof that diverted traffic caused it."
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
      "Our chart of the three published numbers this story starts from. Bars left of zero mean cleaner air; bars right of zero mean dirtier air. The two studies used different monitors, time periods and models, so compare direction and rough size, not exact amounts."
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
    "plan": [],
    "stats": [
      "we did not rerun these models; we copied three published estimates. Paid zone: Fraser et al. compared daily-peak PM2.5 at 6 monitors inside the zone (of 42 across the metro area), January–June 2025, with a model of what the air would have been without the fee. South Bronx: De Jesus et al. fit statistical models (GAMMs) to hourly PM2.5 from 19 of South Bronx Unite's 65 low-cost sensors, January 2024–December 2025; the highway sensor's 95% interval is +0.85 to +1.70 µg/m³. Percentages: 3.05 µg/m³ ÷ 13.8 µg/m³; 0.22 or 1.29 µg/m³ ÷ 6.89 µg/m³, NYC Health's 2024 average for Hunts Point–Mott Haven."
    ]
  },
  "sections": {
    "spill": {
      "beat": "The test",
      "headline": "Did drivers dodge the fee through the Bronx? The MTA bridge test found no clear increase.",
      "takeaway": "The map suggested drivers might detour through the Bronx. Our four-crossing MTA test found no clear increase compared with other bridges. The city's own highway counts also show Deegan traffic down about 1% in 2025. Neither explains the community sensors' result.",
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
          "text": "We used MTA Bridges and Tunnels Hourly Crossings: Beginning 2019 to compare January 1–December 31, 2024 with the same dates in 2025. Bronx–Whitestone rose from 49,893,667 to 50,700,608 vehicle-crossing events: (50,700,608 crossings − 49,893,667 crossings) ÷ 49,893,667 crossings × 100 = +1.62%, meaning 1.62% more crossings in 2025 than in 2024. Crossings at RFK Bronx rose 0.13%, Throgs Neck 0.14% and Henry Hudson 0.28%. Small annual increases alone do not establish fee-related diversion; we need a comparison with other crossings."
        },
        {
          "text": "The monthly test compared 2024 growth against the same months in 2023, then 2025 growth against the same months in 2024. Its adjusted relative-change estimate for the Bronx group's year-over-year growth in crossings was −1.04%, with a 95% range from −3.63% to +1.61%. That range includes zero, so the test found no clear increase relative to the comparison bridges. It cannot rule out a smaller increase or diversion onto roads outside this dataset."
        },
        {
          "sub": "Was Bronx traffic already falling before the fee?",
          "text": "No. If Bronx traffic had already been dropping, a flat 2025 could hide a detour, so we added up MTA crossings back to 2019 (the trend chart below). Bronx-route crossings fell in 2020 with COVID, then rose every year, and in 2025 they reached 173,834,357 crossings, above the 172,357,342 of 2019. The growth was slowing before the fee, not reversing, and 2025 continued that path. Over the same two years the comparison bridges grew 0.29% (2024) and 0.34% (2025), and the zone-serving tunnels fell 0.41% (2024) and 1.99% (2025). Before the fee, the model's month-by-month gaps between the Bronx routes and the comparison bridges averaged 1.24% in either direction, so the two groups were moving together. From January to August 2026, all three groups fell together compared with the same months of 2025 (Bronx −1.51%, comparison bridges −2.01%, tunnels −2.90%), which points to something citywide, not a Bronx detour.",
          "bullets": [
            "Bronx-route crossings per year, and the change from the year before: 2019: 172,357,342. 2020: 131,293,904 (−23.82%). 2021: 158,250,882 (+20.53%). 2022: 165,933,775 (+4.85%). 2023: 170,967,313 (+3.03%). 2024: 172,825,419 (+1.09%). 2025: 173,834,357 (+0.58%)."
          ]
        },
        {
          "sub": "What the other traffic files could tell us",
          "text": "MTA Congestion Relief Zone Vehicle Entries: Beginning 2025 described entry gates and traffic from January 5, 2025 through our September 5, 2026 pull, but supplied no 2024 baseline. NYC DOT's Automated Traffic Volume Counts supplied 15-minute road studies, but no usable matching before-and-after counts on our South Bronx roads. We also checked Vehicle Classification Counts (2011–2025) and Traffic Volume Counts (Historical); neither supported that local comparison. We have not yet used NYC DOT's Bridges & Crossings Traffic Volumes Dashboard, Port Authority monthly traffic reports or MTA's daily and older hourly files."
        },
        {
          "sub": "Read the bottom graph",
          "bullets": [
            "Bronx routes means four MTA crossing records: Bronx–Whitestone, Henry Hudson, Throgs Neck and the RFK Bronx arm. It is a group of crossings, not all traffic inside the borough.",
            "Comparison bridges means Cross Bay, Marine Parkway and Verrazzano–Narrows. We use them as a comparison, without assuming they were completely unaffected.",
            "Zone-serving tunnels means Hugh L. Carey and Queens Midtown. These are the two MTA tunnels in this test, not every tunnel entering Manhattan. On the map, red dots are the Bronx routes, gray dots the comparison bridges and green dots the zone-serving tunnels; click a dot for its 2024 and 2025 crossings.",
            "All of 2025 combined means one adjusted model estimate across the group's crossings and all 12 months. The underlying unit is vehicle crossings per month; the plotted unit is percent difference in the year-over-year growth factor relative to the comparison bridges.",
            "A dot is the estimate; its line is a 95% uncertainty interval. Zero means no adjusted relative difference. The Bronx interval crosses zero, so there is no clear increase. The tunnel dot is lower, but a separate check for the small number of crossings gives p = 0.0625, so we don't treat it as definitive at the 5% threshold."
          ]
        },
        {
          "sub": "The city's own Deegan count",
          "text": "We also checked NYC Health's August 2026 report, Air Quality Impacts of Congestion Relief Zone Tolling, and its Detailed Traffic Analysis Methodology appendix. Table A-1 reports Major Deegan annual-average daily traffic of 129,955 vehicles/day in 2024 and 128,727 vehicles/day in 2025: (128,727 − 129,955 vehicles/day) ÷ 129,955 vehicles/day × 100 = −0.94%, meaning 0.94% fewer vehicles per day. Table A-2 reports trucks declining from 10,326 to 10,296/day, or −0.29%. These are the agencies' seasonally adjusted estimates from periodic highway counts, not a rerun of our bridge model. They do not measure every street or explain a particular air sensor."
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
          "Scope gap: free East River and Harlem River bridges, Port Authority crossings, the Deegan and local streets aren't covered by our MTA bridge comparison. NYC DOT's Bridges & Crossings dashboard and Port Authority's monthly traffic reports are sources we have not used yet.",
          "Deegan counts: NYC Health's 2026 Detailed Traffic Analysis Methodology appendix, Tables A-1 and A-2. NYSDOT/NYC DOT short counts generally last about 50 hours on weekdays and were collected in several seasons. Seasonal factors use continuous counters. Deegan station: MTA Site C / NYSDOT 010021 (01S000001), I-87 from Willis Avenue overpass to East 138th access. Annual daily averages are estimated vehicle passages, not unique vehicles or a continuous local emissions series."
        ]
      },
      "captions": [
        "Count of named entry-detection groups, not vehicle counts or physical gantries. The Bronx has no region in this Manhattan entry dataset. Source: MTA Congestion Relief Zone Vehicle Entries: Beginning 2025.",
        "All of 2025 combined. Dots show adjusted relative differences in year-over-year crossing growth; lines show 95% intervals. The Bronx interval includes zero. This test does not measure the Deegan or prove where drivers went.",
        "Yearly vehicle crossings at MTA bridges and tunnels, 2019 to 2025, each group shown as a share of its own 2022 total (2022 = 100). Bronx routes kept rising every year after the 2020 COVID drop, including 2025; they were not already falling before the fee."
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
          "title": "Traffic datasets: used, checked and missing",
          "url": "docs/TRAFFIC-STORY-AUDIT.md"
        },
        {
          "title": "NYC Health: highway traffic methods and 2023–2025 tables",
          "url": "https://a816-dohbesp.nyc.gov/IndicatorPublic/data-features/congestion-pricing-report/embeds/CRZ_Report_Appendix.pdf"
        },
        {
          "title": "MTA: Verrazzano-Narrows Bridge two-way (split) tolling",
          "url": "https://www.mta.info/vnb-split-tolling"
        }
      ],
      "plan": [],
      "stats": [
        "we counted the named detection groups in the MTA's congestion-zone entries file (data.ny.gov dataset t6yz-b64h, January 5, 2025 to September 5, 2026): 12 groups in 7 regions, 0 in the Bronx. Those groups logged 178,203,234 vehicle entries in 2025; that counts entries, not unique vehicles. The file starts when the fee started, so it has no before-fee data.",
        "7 MTA crossings (4 Bronx routes, 3 comparison bridges), monthly vehicle crossings, January 2024 to December 2025: 7 crossings × 24 months = 168 crossing-months (data.ny.gov dataset ebfx-2m7v). Outcome: each month's crossings compared with the same month a year earlier (log growth). The model adds crossing and month effects; uncertainty is clustered by crossing (7 clusters), and a wild cluster bootstrap with 128 draws gives p = 0.49 for the Bronx difference, so it is not statistically clear. The tunnel estimate uses 2 tunnels + the same 3 comparison bridges (120 crossing-months, 5 clusters, 32 bootstrap draws).",
        "yearly sums of monthly vehicle crossings at 9 MTA bridges and tunnels (RFK Manhattan arm left out), January 2019 to December 2025, data.ny.gov dataset ebfx-2m7v. Index = each group's yearly total ÷ its 2022 total × 100. The comparison group starts in 2021 because the Verrazzano was counted in one direction only until two-way tolling began in December 2020. Descriptive totals, no model."
      ]
    },
    "controls": {
      "beat": "The check",
      "headline": "Why can an air study find an increase when traffic counts do not?",
      "takeaway": "We don't know yet why some community sensors rose. Bridge traffic did not clearly increase, and the city's Deegan count fell slightly. But a vehicle count doesn't measure all the exhaust, and the two air studies disagree about the South Bronx.",
      "blocks": [
        {
          "sub": "Short answer: why could the air get worse if traffic did not?",
          "text": "First, it did not get worse everywhere. In the community study, 4 of 19 sensors showed a clear rise, and all four sit near expressways; 2 showed a clear drop and 13 showed no clear change. The city's own monitor study found no clear change tied to the fee at the environmental-justice sites it checked, and NYC Health's yearly air survey even puts the Hunts Point–Mott Haven average slightly lower in 2025 (6.80 µg/m³) than in 2024 (6.89 µg/m³). Second, a traffic count tells you how many vehicles passed, not how much exhaust they made. The same count can pollute more if more of the vehicles are diesel trucks, if traffic crawls or idles, or if trips move to night hours, when air stays low and mixes less. We have not tested that timing idea; it needs hourly counts. Third, other sources add particles too, such as construction, building heat, cooking and wildfire smoke. So nobody has proven the cause yet. The rest of this page shows what we checked."
        },
        {
          "sub": "Traffic counts and air sensors measure different things",
          "text": "The community study estimated an adjusted +0.22 µg/m³ change across 19 monitors, with clear increases at four sensors near expressways; the address of the sensor with the largest rise is unpublished. Our MTA test counted vehicles crossing bridges, not exhaust near those sensors, and NYC Health's highway tables show Deegan traffic down 0.94% and trucks down 0.29% from 2024 to 2025. The same number of vehicles can still make more pollution if the mix shifts toward diesel trucks, if traffic idles or crawls, or if speeds and routes change. Smoke, building heat, cooking, construction and the way air moves between buildings also change what a sensor reads. The community model adjusted for seasonality, temperature, humidity, wind and residential heating, which removes some of those effects but does not name the source of what is left. NYC Health's own monitors found no significant pricing-related change at the environmental-justice sites it checked, so the two air studies disagree; they use different monitor locations, sampling methods and statistical models. To settle it, we need calibrated air readings placed side by side with local vehicle types, speeds, idling and weather over the same dates."
        },
        {
          "sub": "Could global warming explain the air-quality change?",
          "text": "Global warming can affect air pollution through wildfire smoke and changing weather. To check whether worsening air also appeared elsewhere, we used EPA Air Quality System annual records for Houston North Wayside (site 48-201-0046). Annual PM2.5 fell from 13.10 to 12.17 µg/m³, a 7.1% decrease. Thomas J. Barber’s May 2026 Cornell thesis, The New York City Congestion Charge: Air Quality, Traffic, and Crime, reports CBD before/after means of 8.70 and 7.56 µg/m³ (Table A.8); its monthly air panel spans May 2024–June 2025. That is a 13.1% decrease from the rounded means, not a calendar-year comparison. In Houston, the fall is 0.93 µg/m³; 0.93 µg/m³ ÷ 13.10 µg/m³ × 100 ≈ 7.1%. One monitor in Houston cannot rule out global warming or New York's local weather. The 2025 Houston record is only 84% complete and is not certified."
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
        }
      ],
      "methods_expandable": {
        "summary": "Methods",
        "bullets": [
          "Houston North Wayside, EPA site 48-201-0046, sits by truck and rail yards. Annual PM2.5 fell from 13.10 to 12.17 µg/m³ (−7.1%). The 2025 file is 84% complete and not yet certified.",
          "Downtown: Thomas J. Barber, The New York City Congestion Charge: Air Quality, Traffic, and Crime (Cornell MS thesis, May 2026), Table A.8, before/after CBD means 8.70 → 7.56 µg/m³. Monthly panel May 2024–June 2025; the displayed −13.1% uses rounded means, while the thesis table reports −13.15%.",
          "Roadsides: Goldberg et al., Variable Short-Term Air Quality Impacts of NYC Congestion Pricing, Research Square preprint, Dec 2025, doi 10.21203/rs.3.rs-8158429/v1. Difference-in-differences on 6 NYCCAS real-time sites. Reported significant estimates: Queensboro −9.08 µg/m³, Williamsburg +6.30 µg/m³, Cross Bronx +3.74 µg/m³, Broadway / W 35th +2.46 µg/m³. These coefficients are in concentration units, not percent. Not yet peer reviewed.",
          "NYC Health estimates vehicles contribute roughly 14% of NYC PM2.5 emissions; this is an emissions share, not a claim that 14% of every sensor reading comes from traffic. Its highway appendix reports Deegan annual-average daily traffic 129,955 → 128,727 vehicles/day (−0.94%) and trucks 10,326 → 10,296/day (−0.29%), 2024–2025. Our bridge comparison remains a separate analysis.",
          "Top graph: Houston shows a calendar-year difference; downtown shows the thesis’s before/after mean difference; South Bronx bars are published adjusted hourly step estimates. Bottom graph: daily PM2.5 difference-in-differences across two July–June seasons, pre/post split January 5. Values use µg/m³ throughout, but their different metrics and models should not be combined.",
          "Data: EPA Air Quality System (Houston), NYC Health (Van Wyck), Barber's thesis (downtown), South Bronx Unite sensors, Goldberg et al. 2025 (city roadside monitors, preprint), MTA Bridges and Tunnels."
        ]
      },
      "captions": [
        "Top: separate changes in PM2.5 concentration, µg/m³. Houston annual means, downtown before/after means and adjusted hourly estimates differ. Bottom: published daily-average model estimates, also µg/m³, across two July–June seasons. Positive means higher than the study's estimate of what the air would have been without the fee, even when raw readings fell."
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
          "title": "Goldberg preprint: units and model",
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
      "plan": [],
      "stats": [
        "top panel: Houston North Wayside is 1 EPA monitor (AQS site 48-201-0046, Texas), yearly means; its 2025 file is 84% complete. Downtown: Barber thesis Table A.8, monthly CBD means May 2024–June 2025, 8.70 → 7.56 µg/m³. South Bronx: 19 sensors, hourly. Bottom panel: Goldberg et al. 2025 preprint, a difference-in-differences on daily PM2.5 at 6 city real-time monitors, two July–June seasons split at January 5, 2025; 4 significant sites shown, 2 of 6 not shown. All are published estimates in µg/m³, not rerun by us."
      ]
    },
    "scores": {
      "beat": "Where to act",
      "headline": "Why East 138th? How we scored every stretch of street, then ranked them.",
      "takeaway": "We wanted a fair, open way to compare places to plant. We scored every stretch of street on bad air, health and room for trees. The result is a planning index, not a measured pollution ranking or a forecast of health benefits.",
      "blocks": [
        {
          "sub": "1. What did we compare, and when?",
          "text": "In September 2026 we joined 99,357 NYC Street Centerline road segments into 33,785 overlapping candidate corridor windows. Each window is 0.8–2.0 km long, targeting 1.6 km. These are analysis units, not 33,785 different streets or blocks. The scan used historical sources: 2015 Street Tree Census, 2020 Census population, the NFH dataset marked published 2020, and 2023 asthma rates. They describe different years."
        },
        {
          "sub": "2. Why choose these factors?",
          "text": "Our aim is to identify places where residents face environmental burdens and where planting may be feasible. Exposure proxies address possible sources; asthma, financial vulnerability and heat address the people affected; tree gaps and street shape address whether planting is appropriate. These choices express our planning priorities. They are not scientifically fitted causal weights."
        },
        {
          "sub": "3. Why the percentages are split this way",
          "text": "Think of the score as 100 points split among three questions. Is the air likely bad here? 33 points. Are people already sick or struggling? 33 points. Will street trees work here? 34 points. 33 points + 33 points + 34 points = 100 points. Each question gets about a third because a street needs all three to be worth planting: bad air on a street with no room for trees, or room for trees where few people are sick or struggling, is a weaker case. Inside each question, a factor gets more points when it is measured on every street and points straight at the problem, and fewer when it is patchy or repeats another factor. Each bullet below gives the factor's points and the reason. To check that these choices don't decide the answer, we also scored every street with all eight factors equal, 12.5 points (12.5% of the score) each, the gray bars: East 138th ranked #22 of 33,785. Across 10,000 random weight mixes among the 35 finalists it stayed in the top five on need × residents/km 92.4% of the time."
        },
        {
          "bullets": [
            "15 points (15% of the score) · Road proximity: distances in meters to bridges, ramps and highways, converted to a distance-decay proxy. Nearer roads raise the grade; this is not a traffic count. Why 15: it is the one air factor we can measure on every street, and traffic pollution drops off with distance from big roads, so it carries most of the 33 air points.",
            "10 points (10% of the score) · Published air-monitor signal: the sign of a published PM2.5 change, weakened with distance up to 1,500 m. A monitor measures air at one spot, not on every listed street. Why only 10: just 6,740 of 99,357 street segments are within 1,500 m of a published monitor, and the South Bronx monitor's exact location is not published, so this is the least certain factor.",
            "8 points (8% of the score) · Highway adjacency: share of the street window within 400 m of a raised or below-grade highway, from 0 to 1. Why only 8: it flags highway exposure but partly repeats road proximity, so a bigger weight would count the same highway twice.",
            "20 points (20% of the score) · Asthma: adult and child emergency-department visit rates per 10,000 residents, from NYC Health neighborhood data. This measures existing health burden, not cases caused by congestion pricing. Why 20, the largest: asthma is the illness fine particles make worse, so it is the most direct sign that dirty air is hurting people here.",
            "8 points (8% of the score) · Financial vulnerability: NFH median income in US dollars, poverty as a percentage, and financial-health rank by PUMA, a Census area of at least 100,000 people. Why 8: it helps decide where limited public money goes first, but one value covers a whole PUMA, so it can't tell one street from the next. We don't claim each resident has that income.",
            "5 points (5% of the score) · Heat: NYC Heat Vulnerability Index, a score from 1 to 5 by ZIP-code area. It measures vulnerability, not degrees of temperature. Why only 5: it already includes income and other social factors counted above, so a small weight avoids counting them twice.",
            "17 points (17% of the score) · Tree gap: living street trees per 100 m in the 2015 census. Fewer street trees raise the grade; park trees and planting changes since 2015 can be missed. Why 17: half of the 34 planting points, because a gap is where a new tree can go.",
            "17 points (17% of the score) · Street shape: building height divided by facade-to-facade street width, both in meters, so the ratio has no units. More open streets raise the grade; elevated trains and site obstacles are not fully modeled. Why 17: the other half, because in a deep, narrow street tree crowns can trap exhaust instead of helping, so the street has to be open enough."
          ]
        },
        {
          "sub": "4. How do those factors become “need”?",
          "text": "We orient each factor so a larger grade means a stronger planting case and convert it to a grade from 0 to 1, usually a citywide percentile; highway adjacency is already a length share. Missing data are handled two ways. In the first, citywide pass, a missing factor is left out and the other weights are scaled up so they still total 100%. In the finalist score, a missing grade counts as 0.5, the middle. Need = sum(weight × grade), so need is an index from 0 to 1 with no units. A value of 0.8725 does not mean 87.25% pollution, poverty or illness. Counting a missing grade as the middle is an assumption, not evidence that the missing data are average."
        }
      ],
      "blocks_mid": [
        {
          "sub": "Worked example: how East 138th earns about 87 of 100 points",
          "text": "Each grade, from 0 to 1, is multiplied by the factor's points. For the 1.249 km East 138th window:",
          "bullets": [
            "Air (33 points): road proximity 0.8905 × 15 = 13.36, monitor signal 0.9419 × 10 = 9.42, highway adjacency 1.0000 × 8 = 8.00. Subtotal: 30.78 of 33 points.",
            "Sick or struggling (33 points): asthma 0.9781 × 20 = 19.56, financial vulnerability 0.9593 × 8 = 7.67, heat 0.9758 × 5 = 4.88. Subtotal: 32.11 of 33 points.",
            "Trees will work (34 points): tree gap 0.8372 × 17 = 14.23, street shape 0.5954 × 17 = 10.12. Subtotal: 24.35 of 34 points.",
            "Total: 30.78 + 32.11 + 24.35 = 87.24 points (87.25 when the unrounded parts are added), so need = 87.25 ÷ 100 = 0.8725. Street shape is the weakest part, which is why the next slide checks each bay's H/W."
          ]
        },
        {
          "sub": "5. Then count residents; only then show the ranking",
          "text": "Using 2020 Census block population, we count residents whose block center lies within 400 m of each corridor, then divide by corridor length in km. Priority = need × residents per km. This estimates residents near a planting corridor weighted by the index; it does not estimate people cured or benefits per dollar. For the selected 1.249 km East 138th window: 32,362 residents ÷ 1.249 km ≈ 25,910 residents/km. Its need score is 0.8725; 0.8725 × 25,910 ≈ 22,606 index-weighted residents/km. Why count people at all? Jungle World Road inside the Bronx Zoo has the highest need of all 35 finalists, 0.8998: it has zero street trees, it is very open, and it has no air-monitor reading, so that factor counts as 0.5. But only about 6,492 residents/km live within 400 m of it, so it drops to #26. Jerome Avenue, with 43,861 residents/km, is #1; East 138th, with 25,910 residents/km, is #4."
        },
        {
          "sub": "6. Why East 138th, and how sure are we?",
          "text": "East 138th was #22 of 33,785 overlapping windows when every factor counted equally (12.5% of the score each). With the weights above we re-scored the finalists: the top 25 windows under each first-pass weight set plus East 138th's windows, 47 windows on 35 streets. East 138th is #3 on need and #4 on need × residents/km; Jerome Avenue is #1 on the latter. Those are different rankings with different denominators. We chose East 138th as a corridor to investigate because it combines residential exposure, high neighborhood vulnerability and specific planting gaps, not because it is proven to have the worst air."
        },
        {
          "text": "What does 92.4% mean? We drew 10,000 random sets of weights for the same eight factors and re-ranked the 35 finalists each time. East 138th landed in the top five on need × residents/km in 92.4% of those runs (9,240 of 10,000) and in the top five on need alone in 72.2%; its median rank was #4. Jerome Avenue was #1 in 99.4% of runs. That tests sensitivity to the weights, not whether the source data are true. It does not fix the unlocated South Bronx monitor, the 2015 tree census, the block-center population approximation, neighborhood-level health data or streets left out of the finalists. So treat these ranks as a guide to where to look first, not a final answer, until the monitor location is confirmed and the citywide scan is rerun."
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
          "Equal-weight citywide scan: equal weights 12.5% per factor; missing factors omitted and remaining weights renormalized. Weighted finalist score (35 streets): the weights shown above; missing grades fixed at 0.5.",
          "Asthma table values are length-weighted neighborhood rates, not measured street-level disease. East 138th’s corridor average is 186.6 adult asthma ED visits per 10,000, while Hunts Point–Mott Haven alone is 193.5 per 10,000. Geography joins need checking; neither value is an individual risk.",
          "The citywide red map shows the equal-weight planning index. It is not a measured PM2.5 map or a map of the weighted finalist score."
        ]
      },
      "captions": [
        "A: weights are score shares, totaling 100%. B: horizontal axis is dimensionless need; vertical axis is thousands of residents per km within 400 m. Dots are 35 finalists. Both rankings use an air factor whose monitor location is unverified.",
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
      "plan": [],
      "stats": [
        "we split the city's streets into 99,357 segments and grouped them into 33,785 overlapping windows 0.8 to 2.0 km long, scored first with equal weights. We then re-scored 47 finalist windows with the weights shown: the top 25 under each first-pass weight set plus East 138th's windows, kept as the best window on each of 35 streets. Residents = 2020 Census block population within 400 m, divided by window length in km. To test the weights, we drew 10,000 random weight mixes; East 138th stayed in the top 5 on need × residents/km in 92.4% of them (top 5 on need alone in 72.2%).",
        "all 55 New York City PUMAs (2010 Census areas of at least 100,000 people each). Median income in US dollars and poverty as a percentage of residents, from the NYC Neighborhood Financial Health dataset (r3dx-pew9, published 2020). One value per PUMA, so every street inside a PUMA gets the same value.",
        "living street trees from the 2015 NYC Street Tree Census, counted in 10 bays of about 120 m along East 138th: 70 trees in all, a mean of 7 trees per bay (5.83 trees per 100 m). A chi-square test (58.86, 9 degrees of freedom, p < 0.001) says the counts are too uneven to be chance. A low count shows a gap; it does not prove a new tree fits there."
      ]
    },
    "location": {
      "beat": "From the map to the sidewalk",
      "headline": "Six tree gaps on East 138th give us places to inspect first.",
      "takeaway": "The 2015 census shows uneven tree coverage in ten roughly 120 m analysis bays on East 138th. Six low-count bays pass our simple street-geometry screen. They are candidates for a current site visit before any planting decision.",
      "blocks": [
        {
          "text": "After comparing corridors, we asked a smaller question: where on East 138th might planting fit? We divided the modeled centerline into ten roughly 120 m analysis bays, with IDs 2, 3, 4, 5, 7, 8, 9, 10, 11 and 12, and counted living trees from the NYC 2015 Street Tree Census. These bay IDs are project labels, not addresses or whole city blocks. Four of fourteen possible bins were omitted because they had fewer than three fronting building footprints. The ten retained bays contain 70 of the corridor band’s 81 living trees recorded in 2015. Bay 4 had zero trees, bay 8 had 21, and the average was seven trees per retained bay."
        },
        {
          "sub": "How the shortlist works",
          "text": "First read the map: dots are trees recorded alive in 2015; numbered colored lines are analysis bays. Green means a survey candidate, gold means an airflow review, and gray means at or above the local mean. These colors describe our screen, not approved planting. The table then shows the counts behind each color. We compare each 2015 count with seven, then check building height divided by street width, H/W. Both height and width use the same length unit, so H/W has no units. Below 0.5 passes our initial geometry screen; bay 10 is 0.58 and needs an airflow review. H/W comes from NYC Building Footprints (5zhs-2jue): median roof height, converted from feet to meters, divided by inferred facade-to-facade width in meters. The centerline was fitted to 83 tree positions from the 2015 census; widths are inferred from nearby footprint offsets, not surveyed curb space. H/W = 0.5 means buildings are half as tall as the street is wide. We use it to flag relatively enclosed geometry for airflow review; it is a screening assumption, not a measured pollutant threshold. It does not prescribe tree spacing."
        },
        {
          "text": "Bays 3, 4, 5, 9, 11 and 12 have fewer than seven living trees in 2015 and H/W below 0.5. Bays 2, 7 and 8 meet or exceed the mean. We list the six candidates by bay ID; we cannot rank them against each other yet, because the South Bronx peak monitor's location is unpublished."
        },
        {
          "sub": "Why the zoning map cannot choose the site",
          "text": "FAR means floor area ratio: building floor area divided by lot area. A FAR of 2 permits floor area equal to twice the lot area, subject to other zoning rules. A wide low building and a narrow taller building can have the same FAR. Yellow is not inherently a better garden site than red. This historical zoning image provides development context; it does not measure sidewalk width, tree pits, airflow or whether a highway deck can be built. We choose inspection locations from 2015 counts and measured site conditions, not FAR colors."
        },
        {
          "sub": "What could change the plan",
          "text": "Trees may have been planted or removed since 2015. Underground utilities, sidewalk access, ownership, soil depth and wind could make an apparent gap unsuitable. A current tree inventory, measured street geometry and airflow assessment are needed before choosing species, tree numbers or alternatives such as wall planting. We are confident that the 2015 counts are uneven; we are less certain they describe today’s planting space. We also have no confirmed funding for this site; a named funding source, an eligibility decision and a site budget are still needed."
        }
      ],
      "methods_expandable": {
        "summary": "Calculation and limits",
        "bullets": [
          "2015 living-tree counts in bay-ID order 2, 3, 4, 5, 7, 8, 9, 10, 11, 12: 15, 4, 0, 4, 12, 21, 2, 2, 6, 4. Their sum is 70 trees, so mean = 70 trees ÷ 10 bays = 7 trees per roughly 120 m bay (5.83 trees per 100 m).",
          "Gap in the table = 2015 tree count − 7 trees; for bay 4, 0 trees − 7 trees = −7 trees. It is a count difference, not a percent. The mean is a local comparison, not an official tree-density target.",
          "The six-bay shortlist does not follow from the corridor need score alone: need chose a corridor for inspection; the tree-count and geometry rules chose bays within it. Candidate rule: 2015 count < 7 and modeled H/W < 0.5. The chi-square statistic 58.86 describes uneven counts under a flat-rate assumption. Spatial dependence and unequal planting capacity limit that inference; it does not prove that more trees fit.",
          "A Grubbs test can flag an outlier but cannot prove a measurement is right, so bay 10 needs a site measurement.",
          "We do not rank the six bays against each other: that needs the peak monitor's coordinates, which are unpublished."
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
      "plan": [],
      "stats": [
        "allowed floor area ÷ lot area (FAR, no units) from the city's 2020 zoning rules, mapped around East 138th. Context only: FAR is not used in the score and does not measure building height, pollution or planting space."
      ]
    },
    "close": {
      "beat": "Reimagining NYC",
      "headline": "Inspect planting gaps now. Study a garden above the Deegan next.",
      "takeaway": "Klyde Warren Park in Dallas shows how a garden can sit above a busy freeway. Space beside the Deegan is tight, so this concept puts a narrow park over the lanes. The road's changing grades, ramps and nearby buildings still need a site survey before we can say where a deck would fit.",
      "blocks": [
        {
          "sub": "Why street trees, and why here?",
          "text": "Trees are the step the city can take now, and East 138th has the conditions where they help most.",
          "bullets": [
            "Cheapest and fastest: about $3,110 per street tree in fiscal 2025, against roughly $20 million to $90 million per acre for a deck over a highway.",
            "Shade and cooling: the EPA says trees and other plants can lower peak summer air temperatures by 2 to 9°F; Klyde Warren Park measured 1 to 9°F cooler than its ZIP code's average during one summer week.",
            "A buffer, if planted right: EPA's 2016 guidance on roadside vegetation barriers says thick planting that fills the space from the ground to the treetops can cut pollution downwind of a road; gaps let it through.",
            "Only where air can move: in deep, narrow street canyons, wind-tunnel tests found tree crowns can trap exhaust (Gromke and Ruck, 2009). That is why street shape gets 17 points and why we screen for H/W below 0.5.",
            "Health link: in a New York City study (Lovasi et al., 2008), areas with more street trees had fewer young children with asthma: 343 more trees per square kilometer (one standard deviation) went with about 29% lower asthma prevalence among 4- and 5-year-olds. That is an association, not proof that trees cause it, and the study found no link with asthma hospitalizations.",
            "Heat risk: the Mott Haven and Hunts Point ZIP codes score 5 of 5, the highest, on the NYC Heat Vulnerability Index.",
            "A visible gap: the 2015 census shows bays with 0 to 6 trees next to bays with up to 21, so we know where to look first.",
            "The honest limit: trees alone remove only about 3.7 pounds of PM2.5 a year here, so the case is shade, cooling, buffering and health, not cleaning the air by themselves."
          ]
        },
        {
          "sub": "Near term: survey first, then size and price the planting",
          "bullets": [
            "We use 180 trees as a planning number, not a count of open tree pits in the ten bays. The six green bays are places to inspect; a current tree, sidewalk and utility survey must establish how many trees fit.",
            "Why about $3,000 per tree? Parks Commissioner Susan Donoghue reported a FY2025 citywide average of $3,110 at the March 20, 2025 Council hearing. At that historical rate, 180 trees × $3,110 per tree = $559,800 for an illustrative tree-planting component. This is not a quote for East 138th and does not price the walls, roofs, rain gardens or full street works.",
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
          "text": "A longer deck from East 138th to East 149th would cover about 12.9 acres (not 129 acres), and nobody has surveyed that as usable deck space. At $20M–$90M per acre, a range from other U.S. deck parks, that gives 12.9 acres × $20M per acre = $258M and 12.9 acres × $90M per acre = $1.161B, or about $250M–$1.2B. Dallas's 2012 $110M ÷ 5.2 acres is about $21.2M per acre, which helps explain the low end. It does not validate the high end or transfer Dallas costs to New York. Our compact model is 240 m × 34 m = 8,160 m², or 2.02 acres, and has not been priced."
        }
      ],
      "methods_expandable": {
        "summary": "Assumptions, confidence and next evidence",
        "bullets": [
          "What we can support now: published model estimates, a limited bridge comparison and 2015 planting-gap evidence. What remains unresolved: the local cause of the air changes, current planting capacity and engineering feasibility of a deck. Missing observations can change which site looks best; weight simulations cannot fill in missing data.",
          "The 180-tree, 40,000 ft² wall, 8-acre roof and 36-rain-garden quantities are scenario inputs. The 10.6 lb/year PM2.5 and 7.2 million US gallons/year stormwater figures are unvalidated model outputs. The 7 m crowns assume maturity. Literature tree removal rates do not validate wall/roof weights, site capacity or local concentration changes.",
          "Klyde Warren original phase: 5.2 acres, $110M, opened 2012 (Landscape Architecture Foundation; FHWA). Historical costs are not adjusted to 2026 New York conditions. No comparative PM2.5 percentage measurement is supplied.",
          "Potential programs: DEP green infrastructure, street-tree funding and CDBG. Historical CDBG values cover four nearby tracts, not the 400 m corridor buffer; site eligibility and current funding require verification.",
          "The 12.9-acre corridor estimate is not surveyed usable deck area. This representative model is 240 m × 34 m, or about 2.02 acres. Its six lanes, 30 m road width and 6.6 m clearance are design assumptions.",
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
        },
        {
          "title": "EPA (2016): Recommendations for constructing roadside vegetation barriers to improve near-road air quality",
          "url": "https://19january2017snapshot.epa.gov/sites/production/files/2016-08/documents/recommendations_for_constructing_roadside_vegetation_barriers_to_improve_near-road_air_quality.pdf"
        },
        {
          "title": "Gromke and Ruck (2009): trees and traffic exhaust in street canyons",
          "url": "https://doi.org/10.1007/s10546-008-9301-2"
        },
        {
          "title": "Lovasi et al. (2008): street trees and childhood asthma in New York City",
          "url": "https://pubmed.ncbi.nlm.nih.gov/18450765/"
        },
        {
          "title": "EPA: trees and heat islands (2021 copy)",
          "url": "https://19january2021snapshot.epa.gov/heatislands/using-trees-and-vegetation-reduce-heat-islands_.html"
        }
      ],
      "options": {
        "caption": "Three options: what each costs and when",
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
    "close"
  ]
};

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
    derive(section);
    if (section.plan) materialize(section, STORY);
  });
  materialize(STORY.thesis, STORY);

  return STORY;
});
