#!/usr/bin/env python3
"""story-art/fig-trend.svg: slide 2, yearly MTA crossings 2019-2025, so the before-fee trend is visible."""
import csv
from collections import defaultdict
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
INK, GRAY, CRIMSON, TEAL = "#221d1a", "#8a857c", "#a4122f", "#416f4e"
plt.rcParams.update({"svg.fonttype": "none", "font.family": "sans-serif",
                     "font.sans-serif": ["Arial", "DejaVu Sans"], "font.size": 10,
                     "text.color": INK, "axes.edgecolor": INK, "xtick.color": INK, "ytick.color": INK})

GROUPS = {  # label, color, facilities, first year with comparable counts
    "bronx": ("Bronx routes (4)", CRIMSON, {"Bronx - Whitestone Bridge", "Henry Hudson Bridge",
                                            "Robert F. Kennedy Bridge Bronx", "Throgs Neck Bridge"}, 2019),
    "comp": ("Comparison bridges (3)", GRAY, {"Cross Bay Bridge", "Marine Parkway Bridge",
                                              "Verrazzano - Narrows Bridge"}, 2021),
    "tun": ("Zone-serving tunnels (2)", TEAL, {"Hugh L. Carey Tunnel", "Queens Midtown Tunnel"}, 2019),
}
YEARS = range(2019, 2026)
LABEL_Y = {"bronx": 108, "comp": 101, "tun": 93}  # ponytail: hand-placed so the end labels never overlap

tot = defaultdict(int)
with open(ROOT / "data" / "raw" / "bt_monthly_2019_2026.csv") as f:
    for r in csv.DictReader(f):
        for g, (_, _, fac, _) in GROUPS.items():
            if r["facility"] in fac:
                tot[g, int(r["year"])] += int(r["crossings"])
assert tot["bronx", 2024] == 172_825_419 and tot["bronx", 2025] == 173_834_357, tot["bronx", 2025]

fig, ax = plt.subplots(figsize=(7.4, 4.1))
fig.subplots_adjust(left=.1, right=.72, top=.8, bottom=.2)
ax.axvspan(2024.5, 2025.4, color="#f1ece2", lw=0)
ax.text(2024.55, 61, "fee starts\nJan 5, 2025", fontsize=8, color=INK, va="bottom")
ax.axhline(100, color=GRAY, lw=.6, ls=":")
for g, (lab, c, _, y0) in GROUPS.items():
    ys = [y for y in YEARS if y >= y0]
    v = [100 * tot[g, y] / tot[g, 2022] for y in ys]
    ax.plot(ys, v, color=c, lw=2.2, marker="o", ms=4)
    ax.text(2025.5, LABEL_Y[g], f"{lab}\n{tot[g, 2025] / 1e6:.1f}M crossings in 2025", color=c, fontsize=8.5,
            va="center", clip_on=False, transform=ax.transData)
ax.text(2020, 64, "COVID-19", ha="center", fontsize=8, color=GRAY)
ax.set_xlim(2018.7, 2025.4)
ax.set_ylim(60, 110)
ax.set_xticks(list(YEARS))
ax.set_ylabel("Yearly vehicle crossings\n(2022 = 100)")
for s in ("top", "right"):
    ax.spines[s].set_visible(False)
fig.text(.02, .95, "Bronx crossings were still rising before the fee, not falling", fontsize=13, weight="bold", va="bottom")
fig.text(.02, .89, "Each line is its group's yearly total divided by its own 2022 total, × 100. Comparison bridges start in 2021:\n"
         "the Verrazzano was counted in one direction only until two-way tolling began in December 2020.",
         fontsize=8.5, color=GRAY, va="bottom")
fig.text(.02, .03, "Source: MTA Bridges and Tunnels Hourly Crossings: Beginning 2019 (data.ny.gov ebfx-2m7v), January 2019 to December 2025.",
         fontsize=7.5, color=GRAY, va="bottom")
fig.savefig(ROOT / "story-art" / "fig-trend.svg", metadata={"Date": None})
