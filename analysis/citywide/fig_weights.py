#!/usr/bin/env python3
"""story-art/fig-weights.svg: A) old vs new weights, B) need vs people per km. Run after people.py."""
import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[2]
INK, GRAY, RULE = "#221d1a", "#8a857c", "#d9d9d9"
CRIMSON, GOLD, TEAL = "#a4122f", "#bd7f1f", "#416f4e"
plt.rcParams.update({"svg.fonttype": "none", "font.family": "sans-serif",
                     "font.sans-serif": ["Arial", "DejaVu Sans"], "font.size": 9,
                     "axes.edgecolor": INK, "text.color": INK, "axes.labelcolor": INK,
                     "xtick.color": INK, "ytick.color": INK})

pick = json.load(open(ROOT / "data" / "derived" / "citywide_web.json"))["pick"]
rows = [o for o in json.load(open(ROOT / "data" / "derived" / "citywide" / "people_by_window.json")) if o["same_as"] is None]
W = pick["weights"]
NAME = {"exposure": "Near heavy traffic", "monitor": "Air monitor reading", "dubois": "Beside a highway",
        "health": "Asthma ER visits", "econ": "Low income", "heat": "Heat risk",
        "canopy_gap": "Few trees now", "hw": "Open street, not a canyon"}
COLOR = dict(zip(pick["groups"], (GRAY, CRIMSON, TEAL)))
COLOR["Is the air bad?"] = GOLD

fig, (a, b) = plt.subplots(2, 1, figsize=(6.4, 8.2), gridspec_kw={"height_ratios": [1, 1.15], "hspace": .42})

# A: weights
y, ticks, labels = .4, [], []
for g, ks in pick["groups"].items():
    a.text(-.005, y - .75, f"{g}  ({round(100 * sum(W[k] for k in ks))}%)", fontsize=9.5, weight="bold", color=COLOR[g], ha="left")
    for k in ks:
        a.barh(y, 1 / 8, height=.36, color=RULE, align="edge")
        a.barh(y - .38, W[k], height=.36, color=COLOR[g], align="edge")
        a.text(W[k] + .004, y - .2, f"{round(100 * W[k])}%", va="center", fontsize=8.5)
        ticks.append(y); labels.append(NAME[k]); y += 1
    y += 1.2
a.set_yticks(ticks, labels); a.invert_yaxis()
a.set_xlim(0, .24); a.set_xticks([0, .05, .1, .15, .2], ["0", "5%", "10%", "15%", "20%"])
a.axvline(1 / 8, color=GRAY, lw=.8, ls=":")
a.text(.99, .99, "gray = old, 12.5% each\ncolor = new", transform=a.transAxes, ha="right", va="top", color=GRAY, fontsize=8.5)
a.set_title("A. How much each factor counts", loc="left", fontsize=11, weight="bold")
for s in ("top", "right"): a.spines[s].set_visible(False)

# B: need vs people
b.scatter([o["need"] for o in rows], [o["people_per_km"] / 1000 for o in rows], s=22, color=GRAY, alpha=.6, lw=0)
lab = {"JEROME AVE": ("Jerome Ave, #1", CRIMSON, (8, 4)),
       "E 138 ST": ("East 138th, our site, #4", CRIMSON, (8, -12)),
       "JUNGLE WORLD RD": ("Bronx Zoo road:\nmost need, few people", INK, (-8, 22)),
       "CARGO SERVICE RD": ("JFK cargo road:\nnobody lives here", INK, (8, 6))}
for o in rows:
    if o["street"] in lab and not (o["street"] == "E 138 ST" and not o["e138_design"]):
        t, c, off = lab[o["street"]]
        b.scatter(o["need"], o["people_per_km"] / 1000, s=46, color=c, zorder=3)
        b.annotate(t, (o["need"], o["people_per_km"] / 1000), xytext=off, textcoords="offset points",
                   fontsize=8.5, color=c, ha="right" if off[0] < 0 else "left")
b.text(.02, .97, "Higher and further right = sicker and more crowded.\nStart there.", transform=b.transAxes, ha="left", va="top", fontsize=8.5, color=CRIMSON)
b.set_xlabel("Need score (0 to 1, from panel A)"); b.set_ylabel("People per km within 400 m (thousands)")
b.set_title("B. Then count the people who would breathe it", loc="left", fontsize=11, weight="bold")
for s in ("top", "right"): b.spines[s].set_visible(False)

out = ROOT / "story-art" / "fig-weights"
fig.savefig(f"{out}.svg", bbox_inches="tight", facecolor="white")
fig.savefig(f"{out}.png", dpi=160, bbox_inches="tight", facecolor="white")
print(out)
