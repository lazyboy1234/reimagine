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
      headline: "Did congestion pricing push dirty air into the Bronx?",
      takeaway: "Manhattan's paid zone got about 22% cleaner. The Deegan sensor in the South Bronx went up 1.29.",
      lookat: "The photo is the Deegan from the East 138th overpass.",
      blocks: [
        {
          sub: "What we asked",
          bullets: [
            "Did cars dodge the fee by driving through the Bronx?",
            "If not, why did the air get worse here?",
            "What can the city do about it?"
          ]
        }
      ],
      methods_expandable: {
        summary: "Sources",
        bullets: [
          "µg/m³ is micrograms of fine particles (PM2.5) in a cubic meter of air. Higher is dirtier. EPA's yearly limit is 9.",
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
        headline: "Did cars dodge the fee through the Bronx? No.",
        takeaway: "Bronx bridges grew no faster than bridges far away.",
        blocks: [
          {
            sub: "How we tested",
            bullets: [
              "The Bronx has zero fee gates, so a spill would show up on its bridges.",
              "We compared Bronx bridges to far bridges, 2024 vs 2025. The Bronx came out 1.04 points slower.",
              "The same test caught tunnels into the paid zone dropping 2.29 points, so it can see a real change."
            ]
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
        takeaway: "Places with no fee got cleaner. Only the Deegan edge jumped.",
        blocks: [
          {
            sub: "Why",
            bullets: [
              "Climate would push air up everywhere. Houston has no fee, and its air fell 0.93.",
              "Downtown fell 13%. The Van Wyck, the city's highway control, showed no fee-sized change.",
              "The Deegan rose 1.29, about 6 times the South Bronx average of +0.22. That is a local hit."
            ]
          },
          {
            sub: "Data",
            text: "EPA Air Quality System (Houston), NYC Health (Van Wyck), Barber's thesis (downtown), South Bronx Unite sensors, MTA Bridges and Tunnels."
          }
        ],
        methods_expandable: {
          summary: "Methods",
          bullets: [
            "Houston North Wayside, EPA site 48-201-0046, sits by truck and rail yards. Yearly PM2.5 went 13.10 to 12.17. The 2025 file is 84% complete and not yet certified.",
            "Downtown: Barber's thesis, Table A.8, 8.70 to 7.56.",
            "Traffic is about 14% of city PM2.5 (NYC Health). Overnight share of crossings: trucks 31.8%, cars 19.7%. Trucks are our best lead for the Deegan, not a proven cause.",
            "What would have proved us wrong: a Deegan rise near +0.22, a fee-sized Van Wyck change, or downtown rising too."
          ]
        },
        plan: []
      },
      scores: {
        beat: "The problem",
        headline: "East 138th is one of the worst places in NYC to breathe.",
        takeaway: "We scored {n_windows} stretches of street. East 138th came in {rank_all}, the top 0.1%. Among separate streets, it is second.",
        blocks: [
          {
            sub: "Why it ranks",
            bullets: [
              "Adults here go to the ER for asthma at 193.5 per 10,000. NYC: 66.4.",
              "Median income is $15,510, second lowest of 55 areas. About 14,525 people live next to the site.",
              "Southern Blvd scored higher (.931) but has no air monitor, so it goes next."
            ]
          }
        ],
        methods_expandable: {
          summary: "Methods",
          bullets: [
            "About 99,357 street pieces joined into 33,785 stretches. Zoo and airport roads removed.",
            "Eight factors, 1/8 each: traffic exposure, air monitor, asthma ER, income, heat, height to width, tree gap, Du Bois share.",
            "East 138th stays near the top with health and income weighted up (rank 21).",
            "The table's 184.4 comes from the next health district over. Mott Haven's own rate is 193.5.",
            "Photos: East Coast Roads; Jim Henderson (public domain); Google Street View; Flickr imjustwalkin; DanTD (CC BY-SA 4.0)."
          ]
        },
        captions: [
          "Household income by district. Darker is lower. Context only, not a score input."
        ],
        rankCaption: "Top streets. Higher score means more reason to plant.",
        plan: []
      },
      location: {
        beat: "The idea",
        headline: "Plant trees on the blocks that have the fewest.",
        takeaway: "Six blocks are short on trees and open enough to plant. Start there.",
        blocks: [
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
            refute: "Houston has no fee and fell 0.93. Downtown fell. Only the Deegan edge jumped."
          },
          {
            claim: "\"Cars spilled into the Bronx.\"",
            refute: "Bronx bridges grew no faster than far ones. The range was -3.6 to +1.6."
          },
          {
            claim: "\"Trees fix the highway.\"",
            refute: "They don't. 10.6 lb a year can't cancel +1.29. That is why the greenway matters."
          },
          {
            claim: "\"A highway park costs billions.\"",
            refute: "Dallas paid about $110M for about 5 acres. Our range is $250M to $1.2B."
          }
        ]
      },
      close: {
        beat: "Reimagining NYC",
        headline: "Trees now. A Deegan Greenway later.",
        takeaway: "Trees can start this year. The long fix is a greenway over the Deegan, like Klyde Warren Park in Dallas.",
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
            sub: "Later",
            bullets: [
              "Build a park over the sunken Deegan from East 138th to 149th: about 12.9 acres of trees, lawn and paths.",
              "Dallas did this. Klyde Warren Park sits over a sunken freeway and joined Uptown and Downtown again.",
              "The highway edge becomes green space the neighborhood can use.",
              "The Deegan is a state road, so this takes years."
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
          "The Deegan sits in a trench, so the greenway builds over it.",
          "East 135th beside the Deegan wall.",
          "I-87 toward The Motto. The stretch the greenway would cover."
        ],
        options: {
          caption: "Three options.",
          rows: [
            { name: "Street trees", estimate: "$2,500 to $4,000 each", call: "Now", id: "est-trees" },
            { name: "Rain gardens", estimate: "$40,000 to $50,000 each", call: "Now", id: "est-gi" },
            { name: "Deegan Greenway", estimate: "$250M to $1.2B", call: "Later", id: "est-lid" }
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
