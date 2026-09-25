#!/usr/bin/env python3
"""Final pick: fairer weights, then people. Re-scores the citywide finalists.

corridors.py ranks 33,785 stretches with equal weights (1/8 each). Three problems:
  1. Asthma, the harm we want to cut, gets 1/8, the same as the Du Bois share.
  2. Some factors count one thing twice: exposure and Du Bois both mean "near a
     highway"; the city's heat index (HVI) already contains income and green space.
  3. A blank factor is filled with the stretch's own average, and nobody lives
     there is never asked, so a Bronx Zoo road and airport ramps rank high.

Fix, three questions with one third each:
  Is the air bad?        exposure .15  monitor .10  dubois .08
  Are people sick?       health   .20  econ    .08  heat   .05
  Will trees work?       canopy   .17  hw      .17
A blank factor counts as 0.5 (the city middle). Then
  impact = need x residents within 400 m per km of street (2020 Census blocks).
Per km, because planting cost grows with length, so this is people per dollar.

ponytail: re-scores the 47 finalists (top 25 under each old weight set, plus the
East 138th windows), not all 33,785. A full rerun needs corridors.py on the Dell
with these weights and people as an input.

Output: data/derived/citywide/people_by_window.json, and `people` + `pick`
patched into data/derived/citywide_web.json (then refresh data/bundle.js).
"""
import io, json, re, struct, sys, urllib.request, zipfile
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
D = ROOT / "data" / "derived"
BLOCKS = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "data" / "raw" / "nyc_blocks_pop.json"
URL = "https://www2.census.gov/geo/tiger/TIGER2020/TABBLOCK20/tl_2020_36_tabblock20.zip"
NYC = ("005", "047", "061", "081", "085")
R = 400.0
KX, KY = 111320 * np.cos(np.radians(40.75)), 110574
W = {"exposure": .15, "monitor": .10, "dubois": .08,
     "health": .20, "econ": .08, "heat": .05,
     "canopy_gap": .17, "hw": .17}
GROUPS = {"Is the air bad?": ["exposure", "monitor", "dubois"],
          "Are people already sick?": ["health", "econ", "heat"],
          "Will trees work here?": ["canopy_gap", "hw"]}
BLANK = 0.5
assert abs(sum(W.values()) - 1) < 1e-9


class RangeFile(io.RawIOBase):
    def __init__(s, url):
        s.url, s.pos = url, 0
        s.size = int(urllib.request.urlopen(urllib.request.Request(url, method="HEAD")).headers["Content-Length"])
    def seekable(s): return True
    def readable(s): return True
    def tell(s): return s.pos
    def seek(s, off, wh=0):
        s.pos = off if wh == 0 else s.pos + off if wh == 1 else s.size + off
        return s.pos
    def readinto(s, b):
        if s.pos >= s.size: return 0
        end = min(s.pos + len(b), s.size) - 1
        d = urllib.request.urlopen(urllib.request.Request(s.url, headers={"Range": f"bytes={s.pos}-{end}"})).read()
        b[:len(d)] = d; s.pos += len(d); return len(d)


def fetch_blocks():
    z = zipfile.ZipFile(io.BufferedReader(RangeFile(URL), buffer_size=1 << 20))
    raw = z.read(next(n for n in z.namelist() if n.endswith(".dbf")))
    nrec, hlen, rlen = struct.unpack("<IHH", raw[4:12])
    F, off = {}, 1
    for i in range(32, hlen - 1, 32):
        F[raw[i:i + 11].split(b"\0")[0].decode()] = (off, raw[i + 16]); off += raw[i + 16]
    g = lambda rec, k: rec[F[k][0]:F[k][0] + F[k][1]].decode().strip()
    out = []
    for r in range(nrec):
        rec = raw[hlen + r * rlen: hlen + (r + 1) * rlen]
        if g(rec, "COUNTYFP20") in NYC and int(g(rec, "POP20") or 0):
            out.append([float(g(rec, "INTPTLON20")), float(g(rec, "INTPTLAT20")), int(g(rec, "POP20")), g(rec, "GEOID20")])
    BLOCKS.write_text(json.dumps(out))


def line(wkt):
    xy = np.array([[float(v) for v in p.split()] for p in re.findall(r"-?[\d.]+ -?[\d.]+", wkt)])
    return xy[:, 0] * KX, xy[:, 1] * KY


def dist(px, py, x, y):
    d = np.full(len(px), np.inf)
    for i in range(len(x) - 1):
        dx, dy = x[i + 1] - x[i], y[i + 1] - y[i]
        t = np.clip(((px - x[i]) * dx + (py - y[i]) * dy) / max(dx * dx + dy * dy, 1e-9), 0, 1)
        d = np.minimum(d, np.hypot(px - x[i] - t * dx, py - y[i] - t * dy))
    return d


def people(wkt):
    x, y = line(wkt)
    box = (bx > x.min() - R) & (bx < x.max() + R) & (by > y.min() - R) & (by < y.max() + R)
    return int(bp[box][dist(bx[box], by[box], x, y) <= R].sum())


def need(n, w=W):
    return sum(w[k] * (BLANK if n.get(k) is None else n[k]) for k in w)


if not BLOCKS.exists():
    fetch_blocks()
blk = np.array([b[:3] for b in json.loads(BLOCKS.read_text())])
assert int(blk[:, 2].sum()) == 8_804_190, "NYC 2020 census total should be 8,804,190"
bx, by, bp = blk[:, 0] * KX, blk[:, 1] * KY, blk[:, 2]

top = json.load(open(D / "citywide" / "corridors_top25.json"))["top25"]
e138 = json.load(open(D / "citywide" / "e138_position.json"))["by_weights"]
design = e138["equal"]["best_window"]["window_id"]
fin = {}
for r in [r for rs in top.values() for r in rs] + [v["best_window"] for v in e138.values()]:
    fin.setdefault(r["window_id"], r)
rows = []
for r in fin.values():
    p = people(r["geometry_wkt"])
    n, raw = r["normalized"], r["raw"]
    rows.append(dict(window_id=r["window_id"], street=r["street"], borough=r["borough"], uhf=r["uhf_name"],
                     km=r["length_km"], need_equal=r["total"], need=round(need(n), 4), people=p,
                     people_per_km=round(p / r["length_km"]), impact=round(need(n) * p / r["length_km"]),
                     blank=[k for k in W if n.get(k) is None], factors=n,
                     asthma_adult=raw["asthma_adult_ed_ageadj_per10k"], hvi=raw["hvi"],
                     trees_per_100m=raw["trees_per_100m"], median_income=raw["median_income"],
                     monitor=r.get("monitor") if isinstance(r.get("monitor"), str) else None,
                     lon=r["mid_lon"], lat=r["mid_lat"], e138_design=r["window_id"] == design,
                     _wkt=r["geometry_wkt"]))

# one stretch per street: the best one stays, so one long avenue can't fill the list
rows.sort(key=lambda o: -o["impact"])
kept, seen = [], {}
for o in rows:
    o["same_as"] = seen.setdefault((o["street"], o["borough"]), o["window_id"])
    if o["same_as"] == o["window_id"]:
        o["same_as"] = None
        kept.append(o)
for i, o in enumerate(kept, 1):
    o["rank"] = i
by_need = sorted(kept, key=lambda o: -o["need"])
for i, o in enumerate(by_need, 1):
    o["need_rank"] = i
e = next(o for o in kept if o["e138_design"])
jer = kept[0]
zoo = next(o for o in kept if o["street"] == "JUNGLE WORLD RD")

# stress test: 10,000 random weight sets (Dirichlet, every mix equally likely)
rng = np.random.default_rng(138)
ks = list(W)
F = np.array([[BLANK if o["factors"].get(k) is None else o["factors"][k] for k in ks] for o in kept])
ppk = np.array([o["people_per_km"] for o in kept])
Wr = rng.dirichlet(np.ones(len(ks)), 10_000)
needs = Wr @ F.T
ie, ij = kept.index(e), kept.index(jer)
rank_need = (needs > needs[:, [ie]]).sum(1) + 1
imp = needs * ppk
rank_imp_e = (imp > imp[:, [ie]]).sum(1) + 1
rank_imp_j = (imp > imp[:, [ij]]).sum(1) + 1
robust = dict(draws=10_000, n_streets=len(kept),
              e138_need_top5_pct=round(100 * (rank_need <= 5).mean(), 1),
              e138_need_top10_pct=round(100 * (rank_need <= 10).mean(), 1),
              e138_need_median_rank=int(np.median(rank_need)),
              e138_impact_top5_pct=round(100 * (rank_imp_e <= 5).mean(), 1),
              e138_impact_median_rank=int(np.median(rank_imp_e)),
              jerome_impact_first_pct=round(100 * (rank_imp_j == 1).mean(), 1))

out = [{k: v for k, v in o.items() if k != "_wkt"} for o in rows]
(D / "citywide" / "people_by_window.json").write_text(json.dumps(out, indent=1))

web = json.load(open(D / "citywide_web.json"))
by_key = {(o["street"], round(o["need_equal"], 3)): o["people"] for o in rows}
for r in web["rankings"]["equal"]:
    r["people"] = by_key.get((r["street"], round(r["total"], 3)))
slim = lambda o: {k: v for k, v in o.items() if k not in ("_wkt", "factors", "same_as")} | {"factors": o["factors"]}
web.pop("people_check", None)
web["pick"] = dict(weights=W, groups=GROUPS, blank=BLANK, radius_m=R, source="2020 Census blocks (TIGER tabblock20 POP20)",
                   n_finalists=len(rows), n_streets=len(kept), rows=[slim(o) for o in kept[:12]],
                   e138=slim(e), jerome=slim(jer), zoo=slim(zoo), robust=robust)
(D / "citywide_web.json").write_text(json.dumps(web, indent=1))
print(f"{len(rows)} finalists -> {len(kept)} streets. #1 {jer['street']} {jer['people_per_km']:,}/km. "
      f"E138 impact #{e['rank']}, need #{e['need_rank']}. Zoo impact #{zoo['rank']}, need #{zoo['need_rank']}.")
print(json.dumps(robust))
for o in kept[:12]:
    print(o["rank"], o["street"], o["need"], o["people_per_km"], o["impact"], o["blank"])
