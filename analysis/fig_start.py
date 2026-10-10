#!/usr/bin/env python3
"""story-art/fig-start.svg: slide 1, the three published PM2.5 changes the story starts from."""
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
INK, GRAY, CRIMSON, TEAL = "#221d1a", "#8a857c", "#a4122f", "#416f4e"
plt.rcParams.update({"svg.fonttype": "none", "font.family": "sans-serif",
                     "font.sans-serif": ["Arial", "DejaVu Sans"], "font.size": 10,
                     "text.color": INK, "axes.edgecolor": INK, "xtick.color": INK, "ytick.color": INK})

# (label, value µg/m³, note, color); sources in data/story.js thesis.methods_expandable
ROWS = [("Paid zone, Manhattan\n6 monitors, daily peak", -3.05, "−3.05 µg/m³\n22% below the 13.8 µg/m³\nno-fee prediction", TEAL),
        ("South Bronx network\n19 sensors, hourly", 0.22, "+0.22 µg/m³\nabout 3% above the 2024\naverage, 6.89 µg/m³", GRAY),
        ("South Bronx, one sensor\nbeside a highway", 1.29, "+1.29 µg/m³\nabout 19% above the 2024\naverage, 6.89 µg/m³", CRIMSON)]

fig, ax = plt.subplots(figsize=(7.4, 3.9))
fig.subplots_adjust(left=.27, right=.97, top=.8, bottom=.2)
for i, (lab, v, note, c) in enumerate(ROWS):
    ax.barh(i, v, height=.55, color=c)
    ax.text(v + (.12 if v > 0 else -.12), i, note, va="center", ha="left" if v > 0 else "right", fontsize=8.5, color=c)
ax.set_yticks(range(len(ROWS)), [r[0] for r in ROWS], fontsize=9.5)
ax.invert_yaxis()
ax.axvline(0, color=INK, lw=.9)
ax.set_xlim(-6.4, 5.6)
ax.set_xticks([-6, -4, -2, 0, 2, 4], ["−6", "−4", "−2", "0", "+2", "+4"])
ax.set_xlabel("Estimated change in PM2.5 after the fee began (µg/m³)")
ax.text(-.15, -.62, "← cleaner air", ha="right", fontsize=8.5, color=TEAL)
ax.text(.15, -.62, "dirtier air →", ha="left", fontsize=8.5, color=CRIMSON)
for s in ("top", "right", "left"):
    ax.spines[s].set_visible(False)
ax.tick_params(axis="y", length=0)
fig.text(.02, .95, "Cleaner air downtown, dirtier air at a South Bronx highway", fontsize=13, weight="bold", va="bottom")
fig.text(.02, .89, "Two published studies with different monitors, dates and models: compare direction and rough size only.",
         fontsize=8.5, color=GRAY, va="bottom")
fig.text(.02, .03, "Sources: Fraser et al., npj Clean Air (2025); De Jesus et al., South Bronx Unite public abstract (2026);\n"
         "NYC Health NYCCAS 2024 yearly average for Hunts Point–Mott Haven.", fontsize=7.5, color=GRAY, va="bottom")
fig.savefig(ROOT / "story-art" / "fig-start.svg", metadata={"Date": None})
