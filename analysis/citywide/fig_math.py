#!/usr/bin/env python3
"""story-art/fig-math-map + fig-math-corr: where people live, who is near each street, how the factors move together.

Map A: 2020 Census people per km2 (500 m cells) with the finalist streets on top.
Map B: Bronx zoom, every Census block within 400 m of Jerome, East 138th and the zoo road, colored by distance.
Corr A: Spearman correlation of the 8 grades, need and people per km across the finalist streets.
Corr B: people per km of street in each 100 m ring.
Corr C: need vs people per km, with pick = need x people curves.
Also writes data/derived/citywide/math.json (numbers the explain page quotes). Run after people.py.
"""
import json, re
from pathlib import Path

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import LogNorm

ROOT = Path(__file__).resolve().parents[2]
D = ROOT / "data" / "derived"
INK, GRAY, RULE = "#221d1a", "#8a857c", "#d9d9d9"
CRIMSON, GOLD, TEAL = "#a4122f", "#bd7f1f", "#416f4e"
plt.rcParams.update({"svg.fonttype": "none", "font.family": "sans-serif",
                     "font.sans-serif": ["Arial", "DejaVu Sans"], "font.size": 9,
                     "axes.edgecolor": INK, "text.color": INK, "axes.labelcolor": INK,
                     "xtick.color": INK, "ytick.color": INK})
KX, KY = 111320 * np.cos(np.radians(40.75)), 110574
HALF = 150  # ponytail: assumed fade, extra pollution halves every 150 m; a sensitivity test, not a measured curve
NYC_KM2 = 778.2

pick = json.load(open(D / "citywide_web.json"))["pick"]
W = pick["weights"]
rows = [o for o in json.load(open(D / "citywide" / "people_by_window.json")) if o["same_as"] is None]
top = json.load(open(D / "citywide" / "corridors_top25.json"))["top25"]
e138 = json.load(open(D / "citywide" / "e138_position.json"))["by_weights"]
geo = {r["window_id"]: r["geometry_wkt"] for r in [r for rs in top.values() for r in rs] + [v["best_window"] for v in e138.values()]}
blk = np.array([b[:3] for b in json.load(open(ROOT / "data" / "raw" / "nyc_blocks_pop.json"))])
bx, by, bp = blk[:, 0] * KX, blk[:, 1] * KY, blk[:, 2]


def line(wkt):
    xy = np.array([[float(v) for v in p.split()] for p in re.findall(r"-?[\d.]+ -?[\d.]+", wkt)])
    return xy[:, 0] * KX, xy[:, 1] * KY


def dist(x, y):
    d = np.full(len(bx), np.inf)
    for i in range(len(x) - 1):
        dx, dy = x[i + 1] - x[i], y[i + 1] - y[i]
        t = np.clip(((bx - x[i]) * dx + (by - y[i]) * dy) / max(dx * dx + dy * dy, 1e-9), 0, 1)
        d = np.minimum(d, np.hypot(bx - x[i] - t * dx, by - y[i] - t * dy))
    return d


RINGS = ((0, 100), (100, 200), (200, 300), (300, 400))
for o in rows:
    d = dist(*line(geo[o["window_id"]]))
    m = d <= 400
    o["_d"] = d
    o["rings_pk"] = [round(bp[(d > a if a else d >= 0) & (d <= b)].sum() / o["km"]) for a, b in RINGS]
    o["decay_pk"] = round(float((bp[m] * 0.5 ** (d[m] / HALF)).sum()) / o["km"])
    o["pick_decay"] = o["need"] * o["decay_pk"]
for i, o in enumerate(sorted(rows, key=lambda o: -o["pick_decay"]), 1):
    o["rank_decay"] = i
live = [o for o in rows if o["people_per_km"] > 0]
need = np.array([o["need"] for o in live]); ppk = np.array([o["people_per_km"] for o in live])
share = float(np.var(np.log(ppk)) / np.var(np.log(need * ppk)))
rank = lambda v: np.argsort(np.argsort(v)).astype(float)
spear = lambda a, b: float(np.corrcoef(rank(a), rank(b))[0, 1])
get = lambda s: next(o for o in rows if o["street"] == s and (s != "E 138 ST" or o["e138_design"]))
J, E, Z = get("JEROME AVE"), get("E 138 ST"), get("JUNGLE WORLD RD")

# ---------- map ----------
fig, (a, b) = plt.subplots(1, 2, figsize=(11, 6.2), gridspec_kw={"width_ratios": [1.15, 1], "wspace": .08})
cell = 500
H, xe, ye = np.histogram2d(bx, by, bins=[np.arange(bx.min(), bx.max() + cell, cell), np.arange(by.min(), by.max() + cell, cell)], weights=bp)
H = np.where(H > 0, H / (cell / 1000) ** 2, np.nan)
im = a.imshow(H.T, origin="lower", extent=(xe[0], xe[-1], ye[0], ye[-1]), cmap="Greys", norm=LogNorm(1000, 100000), alpha=.85)
sc = a.scatter([o["lon"] * KX for o in rows], [o["lat"] * KY for o in rows], s=[8 + o["people_per_km"] / 700 for o in rows],
               c=[o["need"] for o in rows], cmap="YlOrRd", vmin=.65, vmax=.9, edgecolor=INK, lw=.5, zorder=3)
for o, t, off in ((J, "Jerome #1", (-10, 8)), (E, "East 138th #4", (10, -12)), (Z, "Zoo road #26", (10, 6)),
                  (get("JFK ACCESS RD"), "JFK roads: 0 people", (-10, -14))):
    a.annotate(t, (o["lon"] * KX, o["lat"] * KY), xytext=off, textcoords="offset points", fontsize=8.5,
               color=CRIMSON if "#" in t and "26" not in t else INK, weight="bold", ha="right" if off[0] < 0 else "left")
a.set_aspect("equal"); a.set_xticks([]); a.set_yticks([])
for s in a.spines.values(): s.set_visible(False)
cb = fig.colorbar(im, ax=a, orientation="horizontal", fraction=.04, pad=.02)
cb.set_label("People per km² (2020 Census). NYC average: 11,300")
a.set_title("A. Where people live, and the finalist streets", loc="left", fontsize=11, weight="bold")
a.text(.02, .98, "Dot color = need (yellow low, red high)\nDot size = people per km of street", transform=a.transAxes, va="top", fontsize=8.5)

x0, x1, y0, y1 = -73.935 * KX, -73.862 * KX, 40.797 * KY, 40.862 * KY
v = (bx > x0) & (bx < x1) & (by > y0) & (by < y1)
b.scatter(bx[v], by[v], s=np.sqrt(bp[v]) / 3, color=RULE, lw=0)
RC = ("#a4122f", "#d9534f", "#e8a07a", "#f3d1b8")
for o, name in ((J, "Jerome Ave"), (E, "East 138th"), (Z, "Bronx Zoo road")):
    for (lo, hi), c in zip(RINGS, RC):
        m = v & (o["_d"] > lo if lo else o["_d"] >= 0) & (o["_d"] <= hi)
        b.scatter(bx[m], by[m], s=np.sqrt(bp[m]) / 3, color=c, lw=0)
    x, y = line(geo[o["window_id"]]); b.plot(x, y, color=INK, lw=2.2, solid_capstyle="round")
    b.annotate(f"{name}\n{o['people_per_km']:,} per km", (x.mean(), y.mean()), xytext=(12, 0), textcoords="offset points",
               fontsize=8.5, weight="bold", va="center", bbox=dict(fc="white", ec="none", alpha=.8, pad=1))
for (lo, hi), c in zip(RINGS, RC):
    b.scatter([], [], color=c, s=30, label=f"{lo} to {hi} m")
b.legend(title="Distance from the street", loc="lower right", fontsize=8, title_fontsize=8.5, frameon=True)
b.set_xlim(x0, x1); b.set_ylim(y0, y1); b.set_aspect("equal"); b.set_xticks([]); b.set_yticks([])
b.set_title("B. The Bronx up close: every dot is a Census block", loc="left", fontsize=11, weight="bold")
b.text(.02, .98, "Bigger dot = more people", transform=b.transAxes, va="top", fontsize=8.5)
out = ROOT / "story-art" / "fig-math-map"
fig.savefig(f"{out}.svg", bbox_inches="tight", facecolor="white"); fig.savefig(f"{out}.png", dpi=150, bbox_inches="tight", facecolor="white")
plt.close(fig)

# ---------- correlation, rings, need x people ----------
NAME = {"exposure": "Traffic", "monitor": "Air monitor", "dubois": "Highway", "health": "Asthma", "econ": "Low income",
        "heat": "Heat", "canopy_gap": "Few trees", "hw": "Open street", "need": "NEED", "people_per_km": "PEOPLE / km"}
cols = list(W) + ["need", "people_per_km"]
val = lambda o, k: o[k] if k in ("need", "people_per_km") else (.5 if o["factors"].get(k) is None else o["factors"][k])
M = np.array([[spear([val(o, i) for o in rows], [val(o, j) for o in rows]) for j in cols] for i in cols])

fig = plt.figure(figsize=(11, 8.6))
g = fig.add_gridspec(2, 2, height_ratios=[1.1, 1], hspace=.42, wspace=.3)
a = fig.add_subplot(g[0, 0])
im = a.imshow(M, cmap="RdBu_r", vmin=-1, vmax=1)
a.set_xticks(range(len(cols)), [NAME[c] for c in cols], rotation=55, ha="right"); a.set_yticks(range(len(cols)), [NAME[c] for c in cols])
for i in range(len(cols)):
    for j in range(len(cols)):
        a.text(j, i, f"{M[i, j]:.1f}".replace("-0.0", "0.0"), ha="center", va="center", fontsize=7, color="white" if abs(M[i, j]) > .6 else INK)
a.set_title(f"A. Which grades move together ({len(rows)} streets)", loc="left", fontsize=11, weight="bold")
fig.colorbar(im, ax=a, fraction=.046, pad=.03).set_label("Spearman r (-1 opposite, +1 together)")

b = fig.add_subplot(g[0, 1])
xs = np.arange(4)
for k, (o, name, c) in enumerate(((J, "Jerome Ave", CRIMSON), (E, "East 138th", GOLD), (Z, "Bronx Zoo road", GRAY))):
    b.bar(xs + (k - 1) * .27, [r / 1000 for r in o["rings_pk"]], width=.26, color=c, label=name)
b.set_xticks(xs, [f"{lo}–{hi} m" for lo, hi in RINGS]); b.set_ylabel("People per km of street (thousands)")
b.legend(frameon=False, fontsize=8.5); b.set_ylim(0, 18)
b.set_title("B. How far from the street people live", loc="left", fontsize=11, weight="bold")
b.text(.02, .80, "Zoo road: nobody\nin the first 100 m.", transform=b.transAxes, va="top", fontsize=8.5, color=INK)
for s in ("top", "right"): b.spines[s].set_visible(False)

c = fig.add_subplot(g[1, :])
xx = np.logspace(3, 4.8, 200)
for p in (5000, 10000, 20000, 30000):
    c.plot(xx, p / xx, color=RULE, lw=1, zorder=0)
    c.text(p / .655, .655, f"pick {p:,}", fontsize=7.5, color=GRAY, ha="left", va="bottom")
c.scatter(ppk, need, s=26, color=GRAY, alpha=.7, lw=0)
for o, t, col, off in ((J, "Jerome #1", CRIMSON, (6, 4)), (E, "East 138th #4", CRIMSON, (6, 4)), (Z, "Zoo road #26", INK, (6, 4))):
    c.scatter(o["people_per_km"], o["need"], s=50, color=col, zorder=3)
    c.annotate(t, (o["people_per_km"], o["need"]), xytext=off, textcoords="offset points", fontsize=8.5, color=col, weight="bold")
c.set_xscale("log"); c.set_xlim(1500, 60000)  # ponytail: 4 empty roads (0-1 per km) sit off the left edge
c.set_ylim(.64, .93)
c.set_xlabel("People per km within 400 m (log scale)"); c.set_ylabel("Need (0 to 1)")
c.set_title("C. Need barely moves, people swing a lot: people decide the pick", loc="left", fontsize=11, weight="bold")
c.text(.01, .02, f"Need spread: {need.min():.2f} to {need.max():.2f}.  People spread: about 0 to {ppk.max():,}.\n"
       f"People explain {round(100 * share)}% of the gap in pick.  Gray curves: same pick score.\n4 airport and service roads with ~0 people are off the left edge.",
       transform=c.transAxes, ha="left", va="bottom", fontsize=8)
for s in ("top", "right"): c.spines[s].set_visible(False)
out = ROOT / "story-art" / "fig-math-corr"
fig.savefig(f"{out}.svg", bbox_inches="tight", facecolor="white"); fig.savefig(f"{out}.png", dpi=150, bbox_inches="tight", facecolor="white")

r = lambda i, j: round(float(M[cols.index(i), cols.index(j)]), 2)
res = dict(n_streets=len(rows), n_live=len(live), half_m=HALF, nyc_density=round(8_804_190 / NYC_KM2),
           need_min=round(float(need.min()), 3), need_max=round(float(need.max()), 3), ppk_max=int(ppk.max()), ppk_min_live=int(ppk.min()),
           people_share_pct=round(100 * share), r_need_people=r("need", "people_per_km"), r_trees_open=r("canopy_gap", "hw"),
           r_traffic_highway=r("exposure", "dubois"), r_asthma_income=r("health", "econ"), r_asthma_need=r("health", "need"),
           r_open_people=r("hw", "people_per_km"), r_trees_people=r("canopy_gap", "people_per_km"),
           streets={s: dict(need=o["need"], ppk=o["people_per_km"], density=round(o["people_per_km"] / .8), rings_pk=o["rings_pk"],
                            decay_pk=o["decay_pk"], rank=o["rank"], rank_decay=o["rank_decay"])
                    for s, o in (("jerome", J), ("e138", E), ("zoo", Z))},
           decay_top8=[dict(street=o["street"], rank=o["rank"], rank_decay=o["rank_decay"]) for o in sorted(rows, key=lambda o: o["rank_decay"])[:8]])
(D / "citywide" / "math.json").write_text(json.dumps(res, indent=1))
print(json.dumps(res, indent=1))
