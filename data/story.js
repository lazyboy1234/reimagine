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
    thesis: {
      beat: "The question",
      headline: "Congestion pricing cleaned Manhattan's air. Did the Bronx get the leftovers?",
      takeaway: "Since January 2025, drivers pay $9 to enter lower Manhattan, and the air inside the zone got about 22% cleaner at rush hour. A few miles north, one air sensor beside the Major Deegan Expressway went the other way. It posted the biggest rise of any sensor in the South Bronx.",
      lookat: "The photo looks north up the Deegan from the East 138th Street overpass. The sensor sits a few blocks south, where the highway meets the Third Avenue Bridge.",
      blocks: [
        {
          text: "Mott Haven is the corner of the Bronx where the Deegan, the Bruckner and the bridges into Manhattan all come together. Trucks and cars pass within a block of apartment windows all day. Adults here land in the ER for asthma at 193.5 per 10,000, almost three times the city rate of 66.4."
        },
        {
          text: "So when the fee started, people here asked a fair question: if drivers stop going into Manhattan, where do they go instead? South Bronx Unite, a neighborhood group, had 19 low-cost air sensors running with researchers from Columbia, Brown and CU Boulder. From 2024 to 2025, 12 to 14 of them read a little dirtier. On average the rise was small, +0.22. The Deegan sensor rose +1.29, about six times that."
        },
        {
          sub: "What we set out to answer",
          bullets: [
            "Did drivers dodge the fee by cutting through the Bronx?",
            "If not, why did the air get worse right here?",
            "What can the city do about it, now and later?"
          ]
        }
      ],
      methods_expandable: {
        summary: "Sources",
        bullets: [
          "PM2.5 is soot and dust small enough to get deep into your lungs. It is counted in micrograms per cubic meter of air (µg/m³). Higher is dirtier. EPA's yearly limit is 9.",
          "22%: Fraser's paper, Figure 1, inside the paid zone only.",
          "+0.22 and +1.29: South Bronx Unite sensors, 2024 vs 2025. 12 to 14 of 19 sensors went up."
        ]
      },
      captions: [
        "Fraser's paper, Figure 1. The 22% is inside the paid zone only."
      ],
      table: {
        caption: "The paid zone went down. The Deegan went up.",
        rows: [
          ["Paid zone", "About 22% lower"],
          ["South Bronx, 19 sensors", "+0.22 on average"],
          ["Deegan / Third Ave Bridge", "+1.29"]
        ]
      },
      plan: []
    },
    sections: {
      spill: {
        beat: "The test",
        headline: "Did drivers cut through the Bronx to dodge the fee? No sign of it.",
        takeaway: "If drivers were detouring around the fee, Bronx bridges would have gotten busier than bridges far away. They didn't.",
        blocks: [
          {
            text: "The first worry was simple. Charge drivers to enter Manhattan, and some will look for another way around. The Bronx has no fee gates at all, so a detour would show up the only place it can: on the bridges in and out of the borough."
          },
          {
            text: "We compared traffic growth on Bronx bridges with bridges far from the fee zone, 2024 against 2025. If the Bronx were soaking up detours, its bridges should have grown faster. They grew 1.04 points slower, and the honest range runs from 3.6 slower to 1.6 faster. That range crosses zero, so there is no sign of a spill."
          },
          {
            text: "Could the test just be blind? We ran it on the tunnels into the paid zone, where drivers really did change their habits. It caught a 2.29 point drop. So the test can see a real change when one happens. It saw none in the Bronx."
          },
          {
            sub: "Data",
            text: "MTA Bridges and Tunnels crossing counts, 2024 and 2025."
          }
        ],
        methods_expandable: {
          summary: "Methods",
          bullets: [
            "Difference-in-differences on MTA Bridges and Tunnels counts, year over year.",
            "Null: same growth. Estimate -1.04 points, 95% range -3.6 to +1.6, p about 0.49. The range crosses zero, so no spill. That is not proof of exactly zero.",
            "A label-shuffle check agreed (p 0.77)."
          ]
        },
        plan: []
      },
      controls: {
        beat: "The check",
        headline: "Not the fee. Not the climate. Something local.",
        takeaway: "Places away from heavy traffic got cleaner, even Houston, which has no fee. The rises showed up right beside busy roads: the Cross Bronx, the Williamsburg Bridge, and the Deegan. So the problem sits at the roadside, not in the sky.",
        blocks: [
          {
            text: "A rise at one sensor can mean one of three things. The fee pushed traffic north. The year was worse for air everywhere, from heat, smoke or weather. Or something changed on that one stretch of road. The last slide ruled out the first. This one tests the second."
          },
          {
            sub: "Start with the sky",
            text: "Houston has no congestion fee. At an EPA monitor beside its truck and rail yards, yearly PM2.5 fell from 13.10 to 12.17. Downtown Manhattan fell from 8.70 to 7.56. The Van Wyck in Queens, the highway the city uses as its own comparison, showed no change big enough to blame on the fee. If 2025 were simply a bad year for air, these would have gone up. They didn't."
          },
          {
            sub: "Now the roadsides",
            text: "A team led by Goldberg checked six of the city's official real-time monitors, before and after the fee. Only one got clearly cleaner: the Queensboro Bridge, down 9.1%. Three got clearly dirtier: the Williamsburg Bridge up 6.3%, the Cross Bronx Expressway up 3.7%, Broadway at 35th up 2.5%. So the Deegan isn't a one-off. Air right beside busy roads can get worse even while the city as a whole gets better."
          },
          {
            sub: "What local means",
            text: "On the Deegan, the sensor rose about six times as much as its neighbors a few blocks away. Our best lead is trucks: nearly a third of truck crossings (31.8%) happen overnight, against a fifth of car crossings (19.7%), and the Deegan is a truck route. That is a lead, not proof. The Deegan reading comes from one low-cost community sensor over one year, so treat it as a warning light, not a verdict."
          },
          {
            sub: "Data",
            text: "EPA Air Quality System (Houston), NYC Health (Van Wyck), Barber's thesis (downtown), South Bronx Unite sensors, Goldberg et al. 2025 (city roadside monitors, preprint), MTA Bridges and Tunnels."
          }
        ],
        methods_expandable: {
          summary: "Methods",
          bullets: [
            "Houston North Wayside, EPA site 48-201-0046, sits by truck and rail yards. Yearly PM2.5 went 13.10 to 12.17. The 2025 file is 84% complete and not yet certified.",
            "Downtown: Barber's thesis, Table A.8, 8.70 to 7.56.",
            "Roadsides: Goldberg et al., Variable Short-Term Air Quality Impacts of NYC Congestion Pricing, Research Square preprint, Dec 2025, doi 10.21203/rs.3.rs-8158429/v1. Difference-in-differences on 6 NYCCAS real-time sites. Significant: Queensboro Br -9.08%, Williamsburg Br +6.3%, Cross Bronx +3.74%, Broadway/W 35th +2.46%. Not yet peer reviewed.",
            "Traffic is about 14% of city PM2.5 (NYC Health). Overnight share of crossings: trucks 31.8%, cars 19.7%. Trucks are our best lead for the Deegan, not a proven cause.",
            "What would have proved us wrong: a Deegan rise near +0.22, a fee-sized Van Wyck change, or downtown rising too."
          ]
        },
        plan: []
      },
      scores: {
        beat: "The problem",
        headline: "Out of 33,785 stretches of city street, East 138th ranks near the very worst.",
        takeaway: "We asked three questions of every stretch of street in the city. Is the air bad? Are people already sick? Will trees work here? East 138th came out #3 on need and #4 once we counted the people who live there. Jerome Ave is #1.",
        blocks: [
          {
            text: "Mott Haven adults go to the emergency room for asthma at 193.5 visits per 10,000 people. The city average is 66.4, so that is almost three times as often. Median household income is $15,510, second lowest of the city's 55 neighborhood areas. About 14,525 people live within 400 meters of our stretch, a five-minute walk."
          },
          {
            text: "Need alone isn't enough. A road through the Bronx Zoo scores high on need, but nobody lives there to breathe the cleaner air. So we multiplied need by the number of people living along each kilometer. Jerome Ave wins that race: it is just as sick and far more crowded, 43,861 people per km against 25,910 here. It should go next."
          },
          {
            sub: "Why start at East 138th",
            text: "It sits right at the sensor that rose, so any change can be measured. And the pick doesn't hang on our choice of weights: across 10,000 random ways to weigh the factors, East 138th stays in the top 5 in 92% of them."
          }
        ],
        methods_expandable: {
          summary: "Methods",
          bullets: [
            "About 99,357 street pieces joined into 33,785 stretches.",
            "Need: eight factors, grouped into three questions with a third each. Is the air bad? Are people already sick? Will trees work here? Asthma counts most (20%).",
            "A blank factor counts as the city middle (0.5), not as the street's own average.",
            "Pick: need times people per km within 400 m (2020 Census). Per km, so a street does not win just by being long.",
            "10,000 random weight mixes: East 138th stays top 5 in 92%. Jerome Ave is #1 in 99%.",
            "Re-scored: the 47 finalists from the full scan, one stretch per street. The full scan used 1/8 each.",
            "The table's 186.6 mostly comes from the next health district over (184.4). Mott Haven's own rate is 193.5.",
            "Photos: East Coast Roads; Jim Henderson (public domain); Google Street View; Flickr imjustwalkin; DanTD (CC BY-SA 4.0)."
          ]
        },
        captions: [
          "Top: how much each factor counts, old (gray) and new (color). Bottom: need across, people up. Start top right.",
          "Every stretch in the city, old equal weights. Darker means more need. East 138th is outlined."
        ],
        rankCaption: "Where to plant first. Need: 0 to 1, higher is worse. People per km: residents within 400 m.",
        plan: []
      },
      location: {
        beat: "The idea",
        headline: "Not every block needs trees. Six of them badly do.",
        takeaway: "We cut East 138th into ten blocks of about 120 meters and counted every living street tree. Six blocks are short on trees and open enough to plant. Start there.",
        blocks: [
          {
            text: "Trees on East 138th are bunched up. Block 8 has 21. Block 4 has none. The average is 7. Planting the same number everywhere would waste trees where there are already plenty and leave the bare blocks bare."
          },
          {
            text: "Shape matters too. On a narrow block with tall buildings, a thick row of trees can act like a lid and trap exhaust at street level. One block is narrow enough for that, so it gets green walls instead. Three blocks already have enough trees and are left alone."
          },
          {
            sub: "The plan",
            bullets: [
              "Blocks 4, 3, 9, 5, 12 and 11 get trees and rain gardens.",
              "Three blocks already have enough trees.",
              "One narrow block gets green walls, since a full tree row there would trap the air."
            ]
          }
        ],
        methods_expandable: {
          summary: "Methods",
          bullets: [
            "We cut East 138th into ten 120 m blocks and counted living street trees.",
            "Trees are not spread evenly: chi-square 58.86 against 7 per block. Block 8 has 21, block 4 has 0.",
            "Street shape (height to width) has a median of 0.38. One block is 0.58, past the 0.5 line where air gets trapped. Grubbs test says that is a real block, not bad data (G 1.75, cutoff 2.29).",
            "Tree count and street shape are unrelated (Spearman -0.07, p 0.84), so each block gets its own call."
          ]
        },
        captions: [
          "How much building zoning allows (FAR). Context only."
        ],
        blockCaption: "Ten 120 m blocks on East 138th. Gap is living trees minus 7, the street average.",
        plan: []
      },
      counters: {
        items: [
          {
            claim: "\"It's just the climate.\"",
            refute: "Places away from traffic got cleaner, even Houston with no fee. The rises showed up beside busy roads."
          },
          {
            claim: "\"Cars spilled into the Bronx.\"",
            refute: "Bronx bridges grew no faster than far ones. The range was -3.6 to +1.6."
          },
          {
            claim: "\"Trees fix the highway.\"",
            refute: "They don't. 10.6 lb a year can't cancel +1.29. That is why a garden on top of the Deegan matters."
          },
          {
            claim: "\"A highway park costs billions.\"",
            refute: "Dallas paid about $110M for about 5 acres. Our range is $250M to $1.2B."
          }
        ]
      },
      close: {
        beat: "Reimagining NYC",
        headline: "Trees now. Later, reimagine the Deegan with a garden on top.",
        takeaway: "Dallas put a park on top of a sunken freeway: Klyde Warren Park. Traffic still runs underneath, and people picnic on top. The Deegan between East 138th and 149th sits in the same kind of trench, with room for about 12.9 acres of garden.",
        blocks: [
          {
            sub: "Now",
            bullets: [
              "180 trees and rain gardens on the six open blocks, about $3,110 a tree.",
              "They catch about 10.6 lb of PM2.5 and 7.2 million gallons of stormwater a year.",
              "Parks and DEP already fund this work."
            ]
          },
          {
            text: "Be honest about trees. 10.6 lb of soot a year is small next to a highway. What trees do well is clean the air at breathing height, on the sidewalk where people walk, and cool the street in summer. They are the part we can start this year."
          },
          {
            sub: "Later: a garden on top of the Deegan",
            bullets: [
              "Deck over the sunken Deegan from East 138th to 149th: about 12.9 acres of trees, lawn and paths, with cars still running below.",
              "Dallas did this. Klyde Warren Park cost about $110M for about 5.2 acres and joined Uptown and Downtown again.",
              "A deck covers the source instead of filtering it. But exhaust still leaves at the two ends, so the design needs vents or filters there, away from homes.",
              "The Deegan is a state highway, so this takes years of approvals."
            ]
          }
        ],
        methods_expandable: {
          summary: "Methods",
          bullets: [
            "i-Tree estimates for 180 trees. The greenway trees add about 25 lb of PM2.5 removal a year.",
            "Klyde Warren Phase I: $110M to $112M for 5.2 to 5.4 acres. Paid with $20M city bonds, $20M TxDOT, $16.7M federal, private for the rest.",
            "Tree money: DEP green infrastructure ($3.5B program), Bronx Tree Fund ($2,800 a tree), CDBG, since 94 to 100% of nearby residents are low or moderate income.",
            "The greenway sits on a deck over the trench. Cars keep running underneath, like the Woodall Rodgers Freeway under Klyde Warren.",
            "Greenway approvals: NYSDOT, NEPA, CEQR, ULURP.",
            "We did not model removing the Deegan or the BQE."
          ]
        },
        captions: [
          "The Deegan sits in a trench, so a garden deck can sit on top of it.",
          "East 135th beside the Deegan wall.",
          "I-87 toward The Motto. The stretch the garden would cover."
        ],
        options: {
          caption: "Three options.",
          rows: [
            { name: "Street trees", estimate: "$2,500 to $4,000 each", call: "Now", id: "est-trees" },
            { name: "Rain gardens", estimate: "$40,000 to $50,000 each", call: "Now", id: "est-gi" },
            { name: "Deegan garden deck", estimate: "$250M to $1.2B", call: "Later", id: "est-lid" }
          ]
        },
        plan: []
      }
    }
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
