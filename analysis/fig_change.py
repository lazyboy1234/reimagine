#!/usr/bin/env python3
"""story-art/fig-change.svg: A) separate published PM2.5 changes,
B) official city roadside monitors after the fee (Goldberg 2025 preprint)."""
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
INK, GRAY, CRIMSON, TEAL = "#221d1a", "#8a857c", "#a4122f", "#416f4e"
plt.rcParams.update({"svg.fonttype": "none", "font.family": "sans-serif",
                     "font.sans-serif": ["Arial", "DejaVu Sans"], "font.size": 10,
                     "text.color": INK, "axes.edgecolor": INK, "xtick.color": INK, "ytick.color": INK})
MINUS = lambda s: s.replace("-", "−")

# (label, detail, value, color); sources in data/story.js controls.methods
A = [("Downtown Manhattan", "reported pre/post means, 8.70 to 7.56 µg/m³", 7.56 - 8.70, TEAL),
     ("Houston, Texas", "annual mean, 13.10 to 12.17 µg/m³", 12.17 - 13.10, TEAL),
     ("South Bronx network", "adjusted hourly step estimate", 0.22, GRAY),
     ("South Bronx highway maximum", "address not given in abstract", 1.29, CRIMSON)]
B = [("Queensboro Bridge", "Manhattan side", -9.08, TEAL),
     ("Broadway at W 35th", "Midtown street", 2.46, GRAY),
     ("Cross Bronx Expressway", "Bronx highway", 3.74, CRIMSON),
     ("Williamsburg Bridge", "Manhattan side", 6.3, CRIMSON)]


def panel(lab_ax, ax, rows, fmt, pad, lim, ticks):
    for i, (lab, det, v, c) in enumerate(rows):
        ax.barh(i, v, height=.56, color=c)
        ax.text(v + (pad if v > 0 else -pad), i, MINUS(fmt.format(v)), va="center",
                ha="left" if v > 0 else "right", fontsize=11, weight="bold", color=c)
        lab_ax.text(0, i - .1, lab, va="center", ha="left", fontsize=10.5, weight="bold")
        lab_ax.text(0, i + .24, det, va="center", ha="left", fontsize=8.5, color=GRAY)
    lab_ax.set_xlim(0, 1); lab_ax.axis("off")
    for a in (lab_ax, ax): a.set_ylim(len(rows) - .5, -.5)
    ax.axvline(0, color=INK, lw=1); ax.set_xlim(*lim); ax.set_yticks([])
    ax.set_xticks(*ticks, fontsize=9)
    for s_ in ("top", "right", "left"): ax.spines[s_].set_visible(False)


fig, axs = plt.subplots(2, 2, figsize=(7.6, 8.4),
                        gridspec_kw={"width_ratios": [1, 1.6], "wspace": 0, "hspace": .5})
panel(axs[0, 0], axs[0, 1], A, "{:+.2f}", .05, (-1.75, 2.0),
      ([-1, 0, 1], ["−1 cleaner", "0", "+1 dirtier"]))
panel(axs[1, 0], axs[1, 1], B, "{:+.2f}", .3, (-13, 10),
      ([-10, 0, 5], ["−10", "0", "+5"]))
for ax, t, s in ((axs[0, 0], "A. Separate air studies give different estimates",
                  "PM2.5 change, µg/m³. Annual, pre/post and adjusted hourly estimates differ."),
                 (axs[1, 0], "B. Six-site preprint: four reported changes",
                  "Daily-average PM2.5 model estimates, µg/m³; positive means above the counterfactual.")):
    ax.text(0, -.95, t, fontsize=11.5, weight="bold", va="bottom", transform=ax.transData)
    ax.text(0, -.62, s, fontsize=8.5, color=GRAY, va="bottom", transform=ax.transData)
fig.text(.125, .965, "Local variation deserves a closer look.", fontsize=14, weight="bold", va="bottom")
fig.text(.125, .03, "Sources: A) Barber thesis; EPA site 48-201-0046; De Jesus et al., South Bronx Unite public abstract (2026).\n"
         "B) Goldberg et al. 2025, Research Square preprint, not yet peer reviewed. Difference-in-differences on 6 city\n"
         "real-time monitors; all four shown are statistically significant. 2 of 6 showed no clear change and are not shown.\n"
         "Different metrics and methods. Houston alone cannot rule out global warming or New York weather.",
         fontsize=7.5, color=GRAY, va="top")
out = ROOT / "story-art" / "fig-change"
fig.savefig(f"{out}.svg", bbox_inches="tight", facecolor="white")
fig.savefig(f"{out}.png", dpi=200, bbox_inches="tight", facecolor="white")
print(out)
