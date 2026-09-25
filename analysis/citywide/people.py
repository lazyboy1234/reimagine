#!/usr/bin/env python3
"""People check: how many residents live within 400 m of each top-need stretch.

Need score (corridors.py) says how bad a place is. It does not count people, so a
road inside the Bronx Zoo can top it. Here: impact = need score x residents within
400 m, from 2020 Census block populations (TIGER tabblock20 POP20, block internal
points). Only the .dbf is pulled out of the 326 MB state zip, via HTTP Range.

ponytail: scores the 25 top non-overlapping stretches plus the East 138th design
window, not all 33,785. A full citywide people rank needs corridors.py rerun on the
Dell with this as a 9th input.

Output: data/derived/citywide/people_by_window.json, and `people` + `people_check`
patched into data/derived/citywide_web.json (then run analysis/bundle.py).
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


if not BLOCKS.exists():
    fetch_blocks()
blk = np.array([b[:3] for b in json.loads(BLOCKS.read_text())])
assert int(blk[:, 2].sum()) == 8_804_190, "NYC 2020 census total should be 8,804,190"
bx, by, bp = blk[:, 0] * KX, blk[:, 1] * KY, blk[:, 2]


def people(wkt):
    xy = np.array([[float(v) for v in p.split()] for p in re.findall(r"-?[\d.]+ -?[\d.]+", wkt)])
    x, y = xy[:, 0] * KX, xy[:, 1] * KY
    box = (bx > x.min() - R) & (bx < x.max() + R) & (by > y.min() - R) & (by < y.max() + R)
    px, py, d = bx[box], by[box], np.full(box.sum(), np.inf)
    for i in range(len(x) - 1):
        dx, dy = x[i + 1] - x[i], y[i + 1] - y[i]
        t = np.clip(((px - x[i]) * dx + (py - y[i]) * dy) / max(dx * dx + dy * dy, 1e-9), 0, 1)
        d = np.minimum(d, np.hypot(px - x[i] - t * dx, py - y[i] - t * dy))
    return int(bp[box][d <= R].sum())


top = json.load(open(D / "citywide" / "corridors_top25.json"))["top25"]["equal"]
e138 = json.load(open(D / "citywide" / "e138_position.json"))["by_weights"]["equal"]["best_window"]
rows = []
for r in top + [e138]:
    p = people(r["geometry_wkt"])
    rows.append(dict(window_id=r["window_id"], street=r["street"], borough=r["borough"], km=r["length_km"],
                     need=r["total"], need_rank=r["rank_nonoverlap"], people=p, impact=round(r["total"] * p),
                     e138_design=r is e138))
rows.sort(key=lambda o: -o["impact"])
for i, o in enumerate(rows, 1):
    o["people_rank"] = i
(D / "citywide" / "people_by_window.json").write_text(json.dumps(rows, indent=1))

web = json.load(open(D / "citywide_web.json"))
by_key = {(o["street"], round(o["need"], 3)): o["people"] for o in rows}
for r in web["rankings"]["equal"]:
    r["people"] = by_key[(r["street"], round(r["total"], 3))]
e = next(o for o in rows if o["e138_design"])
zoo = next(o for o in rows if o["street"] == "JUNGLE WORLD RD")
web["people_check"] = dict(radius_m=R, source="2020 Census blocks (TIGER tabblock20 POP20)", n=len(rows),
                           top=rows[:5], e138=e, zoo=zoo)
(D / "citywide_web.json").write_text(json.dumps(web, indent=1))
print(f"{len(rows)} stretches. #1 {rows[0]['street']} {rows[0]['people']:,} people. "
      f"E138 design #{e['people_rank']} ({e['people']:,}). Zoo road #{zoo['people_rank']}.")
