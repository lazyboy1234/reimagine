#!/usr/bin/env python3
"""story-art/fig-change.svg: yearly PM2.5 change, places with no local hit vs the Deegan sensor."""
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
INK, GRAY, CRIMSON, TEAL = "#221d1a", "#8a857c", "#a4122f", "#416f4e"
plt.rcParams.update({"svg.fonttype": "none", "font.family": "sans-serif",
                     "font.sans-serif": ["Arial", "DejaVu Sans"], "font.size": 10,
                     "text.color": INK, "axes.edgecolor": INK, "xtick.color": INK, "ytick.color": INK})

# (label, detail, change in ug/m3, color); sources in data/story.js controls.methods
ROWS = [("Downtown Manhattan", "inside the fee zone, 8.70 to 7.56", 7.56 - 8.70, TEAL),
        ("Houston, Texas", "no fee at all, 13.10 to 12.17", 12.17 - 13.10, TEAL),
        ("South Bronx, 19 sensors", "the average one", 0.22, GRAY),
        ("Deegan at the Third Ave Bridge", "the one by East 138th", 1.29, CRIMSON)]

fig, (lab_ax, ax) = plt.subplots(1, 2, figsize=(7.6, 4.2), gridspec_kw={"width_ratios": [1, 1.6], "wspace": 0})
for i, (lab, det, v, c) in enumerate(ROWS):
    ax.barh(i, v, height=.56, color=c)
    ax.text(v + (.05 if v > 0 else -.05), i, f"{v:+.2f}".replace("-", "\u2212"), va="center",
            ha="left" if v > 0 else "right", fontsize=11, weight="bold", color=c)
    lab_ax.text(0, i - .1, lab, va="center", ha="left", fontsize=10.5, weight="bold")
    lab_ax.text(0, i + .24, det, va="center", ha="left", fontsize=8.5, color=GRAY)
lab_ax.set_xlim(0, 1); lab_ax.axis("off")
ax.axvline(0, color=INK, lw=1)
ax.set_xlim(-1.75, 2.0); ax.set_ylim(3.5, -.5); ax.set_yticks([])
lab_ax.set_ylim(3.5, -.5)
ax.set_xticks([-1, 0, 1], ["\u22121 cleaner", "0", "+1 dirtier"], fontsize=9)
for s_ in ("top", "right", "left"): ax.spines[s_].set_visible(False)
ax.annotate("about 6 times the\nSouth Bronx average", xy=(1.29, 2.75), xytext=(.55, 1.55),
            fontsize=9, color=CRIMSON, ha="left", arrowprops=dict(arrowstyle="-", color=CRIMSON, lw=.8))
fig.text(.125, 1.0, "Everywhere else got cleaner. The Deegan got dirtier.", fontsize=14, weight="bold", va="bottom")
fig.text(.125, .96, "Change in yearly fine soot (PM2.5), before vs after the fee, micrograms per cubic meter",
         fontsize=9, color=GRAY, va="bottom")
fig.text(.125, -.06, "Sources: Barber thesis (downtown), EPA site 48-201-0046 (Houston), South Bronx Unite sensors (Bronx).\n"
         "Different monitors, so read the direction, not the exact size. The Van Wyck, the city's control highway,\nshowed no fee-sized change.",
         fontsize=7.5, color=GRAY, va="top")
out = ROOT / "story-art" / "fig-change"
fig.savefig(f"{out}.svg", bbox_inches="tight", facecolor="white")
fig.savefig(f"{out}.png", dpi=200, bbox_inches="tight", facecolor="white")
print(out)
