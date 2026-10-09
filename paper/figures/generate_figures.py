#!/usr/bin/env python3
"""Journal SVG figures for Outside the Line. Writes paper/figures/fig1–fig5.svg."""

from __future__ import annotations

import json
import re
import textwrap
from collections import defaultdict
from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
from matplotlib.patches import FancyBboxPatch
from matplotlib.ticker import MaxNLocator

ROOT = Path("/Volumes/Spiral/projects/datathon-outside-the-line")
DERIVED = ROOT / "data" / "derived"
OUT = ROOT / "paper" / "figures"

CREAM = "#ffffff"
BOARD = "#ffffff"
INK = "#221d1a"
GRAY = "#5b5145"
CRIMSON = "#a4122f"
CRIMSON_LT = "#e0594a"
GOLD = "#bd7f1f"
GOLD_LT = "#e0a93f"
TEAL = "#416f4e"
TEAL_LT = "#8fb896"
RULE = "#d9d9d9"
PAPER = "#ffffff"

REGION_COLORS = {
    "Brooklyn": "#2c4a72",
    "Queens": TEAL,
    "New Jersey": GOLD,
    "East 60th St": CRIMSON,
    "West 60th St": CRIMSON_LT,
    "FDR Drive": "#6b4b30",
    "West Side Highway": "#6b4b30",
    "Bronx": CRIMSON,
}


def load(name: str) -> dict:
    return json.loads((DERIVED / name).read_text())


def style() -> None:
    plt.style.use("default")
    plt.rcParams.update(
        {
            "svg.fonttype": "none",
            "font.family": "sans-serif",
            "font.sans-serif": ["Arial", "DejaVu Sans"],
            "font.size": 8.5,
            "axes.edgecolor": INK,
            "axes.labelcolor": INK,
            "axes.linewidth": 0.6,
            "axes.titlesize": 10.5,
            "axes.titleweight": "semibold",
            "axes.titlecolor": INK,
            "xtick.color": INK,
            "ytick.color": INK,
            "xtick.major.width": 0.5,
            "ytick.major.width": 0.5,
            "xtick.major.size": 3,
            "ytick.major.size": 3,
            "legend.frameon": False,
            "legend.fontsize": 7.5,
            "figure.facecolor": CREAM,
            "savefig.facecolor": CREAM,
            "text.color": INK,
            "pdf.fonttype": 42,
        }
    )


def new_fig(w: float, h: float):
    fig = plt.figure(figsize=(w, h), facecolor=CREAM)
    fig.patch.set_facecolor(CREAM)
    return fig


def caption_block(fig, title: str, source: str | None = None) -> None:
    fig.text(
        0.012,
        0.975,
        title,
        fontsize=11,
        fontweight="semibold",
        color=INK,
        va="top",
        ha="left",
    )
    fig.add_artist(
        plt.Line2D(
            [0.012, 0.988],
            [0.932, 0.932],
            transform=fig.transFigure,
            color=GOLD,
            lw=1.15,
            clip_on=False,
            solid_capstyle="butt",
        )
    )
    if source:
        fig.text(
            0.012,
            0.012,
            textwrap.fill(source, 150),
            fontsize=6.2,
            color=GRAY,
            va="bottom",
            ha="left",
        )


def fix_svg_spaces(path: Path) -> None:
    """Keep word spaces visible. Helvetica Neue / some SVG viewers drop them."""
    text = path.read_text(encoding="utf-8")
    text = text.replace("Helvetica Neue", "Arial")
    text = text.replace("'Helvetica', ", "")
    text = text.replace("Helvetica, ", "")
    text = text.replace(
        "*{stroke-linejoin: round; stroke-linecap: butt}",
        "*{stroke-linejoin:round;stroke-linecap:butt;letter-spacing:normal}",
    )

    def repl(m: re.Match[str]) -> str:
        tag, inner, end = m.group(1), m.group(2), m.group(3)
        if "letter-spacing" not in tag:
            if 'style="' in tag:
                tag = tag.replace('style="', 'style="letter-spacing:normal; ', 1)
            else:
                tag = tag[:-1] + ' style="letter-spacing:normal">'
        if "xml:space" not in tag:
            tag = tag[:-1] + ' xml:space="preserve">'
        inner = inner.replace("&#160;", "\u00a0").replace(" ", "\u00a0")
        return tag + inner + end

    text = re.sub(r"(<text\b[^>]*>)(.*?)(</text>)", repl, text, flags=re.DOTALL)
    path.write_text(text, encoding="utf-8")


def save(fig, name: str) -> None:
    path = OUT / name
    fig.savefig(
        path,
        format="svg",
        bbox_inches="tight",
        pad_inches=0.12,
        facecolor=CREAM,
        edgecolor="none",
        metadata={
            "Title": name,
            "Creator": "Outside the Line / generate_figures.py",
        },
    )
    plt.close(fig)
    fix_svg_spaces(path)
    print(f"wrote {path} ({path.stat().st_size} bytes)")


def fig1_gates(crz: dict) -> None:
    fig = new_fig(5.2, 3.6)
    caption_block(fig, "Figure 1. Twelve named entry-detection groups")
    gs = fig.add_gridspec(1, 1, left=0.28, right=0.96, top=0.88, bottom=0.12)
    ax_bar = fig.add_subplot(gs[0, 0])
    ax_bar.set_facecolor(BOARD)

    counts: dict[str, int] = defaultdict(int)
    for g in crz["gates"]:
        counts[g["region"]] += 1
    counts["Bronx"] = 0
    order = [
        "Brooklyn",
        "Queens",
        "New Jersey",
        "East 60th St",
        "West 60th St",
        "FDR Drive",
        "West Side Highway",
        "Bronx",
    ]
    y = list(range(len(order)))[::-1]
    vals = [counts[r] for r in order]
    colors = [REGION_COLORS[r] for r in order]
    ax_bar.barh(y, vals, color=colors, edgecolor=INK, linewidth=0.35, height=0.68, zorder=2)
    ax_bar.set_yticks(y)
    ax_bar.set_yticklabels(order)
    ax_bar.set_xlabel("Entry-detection groups (count)")
    ax_bar.set_xlim(0, 5)
    ax_bar.xaxis.set_major_locator(MaxNLocator(integer=True))
    ax_bar.axvline(0, color=INK, lw=0.6)
    ax_bar.spines[["top", "right"]].set_visible(False)
    for yi, v in zip(y, vals):
        ax_bar.text(
            v + 0.08,
            yi,
            str(v),
            va="center",
            ha="left",
            fontsize=7.4,
            color=CRIMSON if v == 0 else INK,
            fontweight="semibold" if v == 0 else "regular",
        )
    save(fig, "fig1-gates.svg")


def fig2_trucks(crz: dict) -> None:
    fig = new_fig(7.0, 4.0)
    caption_block(fig, "Figure 2. Trucks go more at night than cars")
    gs = fig.add_gridspec(1, 2, left=0.08, right=0.98, top=0.88, bottom=0.14, wspace=0.32, width_ratios=[1.05, 1.15])
    ax_bar = fig.add_subplot(gs[0, 0])
    ax_hr = fig.add_subplot(gs[0, 1])
    for ax in (ax_bar, ax_hr):
        ax.set_facecolor(BOARD)

    import pandas as pd
    overnight = crz["overnight_share_by_class"]
    labels = [
        ("Multi-unit trucks", "3 - Multi-Unit Trucks", CRIMSON),
        ("TLC taxi / FHV", "TLC Taxi/FHV", GOLD),
        ("Cars, pickups, vans", "1 - Cars, Pickups and Vans", TEAL),
        ("Motorcycles", "5 - Motorcycles", TEAL_LT),
        ("Single-unit trucks", "2 - Single-Unit Trucks", "#6b4b30"),
        ("Buses", "4 - Buses", "#2c4a72"),
    ]
    df = pd.DataFrame({
        "class": [a for a, _, _ in labels],
        "share": [overnight[k] * 100 for _, k, _ in labels],
        "color": [c for _, _, c in labels],
    })
    sns.barplot(data=df, y="class", x="share", hue="class", palette=df.set_index("class")["color"].to_dict(),
                ax=ax_bar, legend=False, edgecolor=INK, linewidth=0.35, orient="h")
    ax_bar.set_xlabel("Overnight share (%)")
    ax_bar.set_ylabel("")
    ax_bar.set_title("Overnight share by class", loc="left", fontsize=8.4, pad=6)
    ax_bar.set_xlim(0, 42)
    ax_bar.spines[["top", "right"]].set_visible(False)
    cars_pct = overnight["1 - Cars, Pickups and Vans"] * 100
    mu_pct = overnight["3 - Multi-Unit Trucks"] * 100
    for i, row in df.iterrows():
        ax_bar.text(row["share"] + 0.6, i, f"{row['share']:.1f}%", va="center", fontsize=7.2, color=INK)
    hours = list(range(24))
    cars = [v * 100 for v in crz["hour_profile_by_class"]["1 - Cars, Pickups and Vans"]["share"]]
    mu = [v * 100 for v in crz["hour_profile_by_class"]["3 - Multi-Unit Trucks"]["share"]]
    ax_hr.axvspan(-0.5, 4.5, color="#e6e6e6", alpha=1, zorder=0)
    ax_hr.axvspan(19.5, 23.5, color="#e6e6e6", alpha=1, zorder=0)
    ax_hr.plot(hours, cars, color=TEAL, lw=1.6, marker="o", ms=3.2, label="Cars")
    ax_hr.plot(hours, mu, color=CRIMSON, lw=1.6, marker="s", ms=3.2, label="Multi-unit trucks")
    ax_hr.set_xlim(-0.4, 23.4)
    ax_hr.set_xticks([0, 4, 8, 12, 16, 20, 23])
    ax_hr.set_xlabel("Hour of day")
    ax_hr.set_ylabel("Share of class entries (%)")
    ax_hr.set_title("Hour of day", loc="left", fontsize=8.4, pad=6)
    ax_hr.legend(loc="upper right", handlelength=1.4)
    ax_hr.spines[["top", "right"]].set_visible(False)
    save(fig, "fig2-trucks.svg")


def fig3_did(bt: dict) -> None:
    fig = new_fig(7.2, 4.4)
    caption_block(fig, "Figure 3. Crossing growth: no clear Bronx increase")
    gs = fig.add_gridspec(1, 2, left=0.08, right=0.98, top=0.88, bottom=0.12, wspace=0.28, width_ratios=[1.7, 1])
    ax_es = fig.add_subplot(gs[0, 0])
    ax_pool = fig.add_subplot(gs[0, 1])
    for ax in (ax_es, ax_pool):
        ax.set_facecolor(BOARD)

    bronx = bt["did"]["bronx"]["event_study"]
    cordon = bt["did"]["cordon"]["event_study"]
    bx_p = bt["did"]["bronx"]["pooled_did"]
    cd_p = bt["did"]["cordon"]["pooled_did"]

    def draw_series(ax, rows, color, marker, label):
        x = [r["rel_month"] for r in rows]
        y = [r["pct"] for r in rows]
        lo = [r["pct"] - r["lo95_pct"] for r in rows]
        hi = [r["hi95_pct"] - r["pct"] for r in rows]
        ax.errorbar(
            x,
            y,
            yerr=[lo, hi],
            fmt=marker,
            color=color,
            ecolor=color,
            elinewidth=0.7,
            capsize=1.6,
            ms=4.2,
            lw=1.15,
            label=label,
            zorder=3,
        )

    ax_es.axvspan(-0.5, 11.6, color="#ececec", alpha=1, zorder=0)
    ax_es.axhline(0, color=INK, lw=0.6, zorder=1)
    ax_es.axvline(-0.5, color=CRIMSON, lw=0.9, ls="--", zorder=1)
    draw_series(ax_es, bronx, TEAL, "o-", "Bronx routes vs comparison bridges")
    draw_series(ax_es, cordon, CRIMSON, "s-", "Zone tunnels vs comparison bridges")
    ax_es.text(0.2, 8.6, "toll starts\nJan 2025", color=CRIMSON, fontsize=6.4, fontweight="semibold")
    ax_es.set_xlim(-12.6, 11.8)
    ax_es.set_ylim(-13.5, 10.5)
    ax_es.set_xlabel("Month relative to January 2025")
    ax_es.set_ylabel("Relative change in YoY growth factor (%)")
    ax_es.set_title("A. Event study (95% CI)", loc="left", fontsize=8.4, pad=6)
    ax_es.legend(loc="lower right", handlelength=1.6)
    ax_es.spines[["top", "right"]].set_visible(False)
    ax_es.text(
        -12.2,
        -12.7,
        "Dec 2024 omitted at 0  ·  grey band = post",
        fontsize=6.2,
        color=GRAY,
    )

    names = ["Bronx\nroutes", "Zone\ntunnels"]
    pcts = [bx_p["pct"], cd_p["pct"]]
    lo = [bx_p["pct"] - bx_p["lo95_pct"], cd_p["pct"] - cd_p["lo95_pct"]]
    hi = [bx_p["hi95_pct"] - bx_p["pct"], cd_p["hi95_pct"] - cd_p["pct"]]
    xs = [0, 1]
    ax_pool.axhline(0, color=INK, lw=0.6, zorder=1)
    ax_pool.bar(
        xs,
        pcts,
        color=[TEAL, CRIMSON],
        edgecolor=INK,
        linewidth=0.4,
        width=0.55,
        zorder=2,
    )
    ax_pool.errorbar(
        xs,
        pcts,
        yerr=[lo, hi],
        fmt="none",
        ecolor=INK,
        elinewidth=0.9,
        capsize=3.5,
        zorder=3,
    )
    ax_pool.set_xticks(xs)
    ax_pool.set_xticklabels(names)
    ax_pool.set_ylabel("Relative growth-factor change (%)")
    ax_pool.set_title("B. All 2025 combined", loc="left", fontsize=8.4, pad=6)
    # Keep 3-line stats clear of whisker caps (was colliding at y=1.55 vs hi CI ~1.6).
    annot_gap = 0.48
    ax_pool.set_ylim(
        min(-4.85, cd_p["lo95_pct"] - annot_gap - 1.15),
        max(3.15, bx_p["hi95_pct"] + annot_gap + 1.15),
    )
    ax_pool.spines[["top", "right"]].set_visible(False)
    ax_pool.text(
        0,
        bx_p["hi95_pct"] + annot_gap,
        f"{bx_p['pct']:+.2f} pp\nCI [{bx_p['lo95_pct']:+.1f}, {bx_p['hi95_pct']:+.1f}]\n"
        f"wild p = {bx_p['p_wild_bootstrap']:.2f}",
        ha="center",
        va="bottom",
        fontsize=6.3,
        color=TEAL,
        clip_on=False,
    )
    ax_pool.text(
        1,
        cd_p["lo95_pct"] - annot_gap,
        f"{cd_p['pct']:+.2f} pp\nCI [{cd_p['lo95_pct']:+.1f}, {cd_p['hi95_pct']:+.1f}]\n"
        f"wild p = {cd_p['p_wild_bootstrap']:.2f}",
        ha="center",
        va="top",
        fontsize=6.3,
        color=CRIMSON,
        clip_on=False,
    )
    save(fig, "fig3-did.svg")


def fig4_canyon(canyon: dict) -> None:
    fig = new_fig(7.0, 3.8)
    caption_block(fig, "Figure 4. East 138th: modeled street geometry")
    ax = fig.add_axes([0.09, 0.16, 0.88, 0.68])
    ax.set_facecolor(BOARD)

    segs = canyon["segments"]
    xs = list(range(len(segs)))
    hws = [s["hw"] for s in segs]
    colors = [CRIMSON if s["trap_risk"] else TEAL for s in segs]
    ax.axhline(0.5, color=GOLD, lw=1.25, ls="--", zorder=1)
    ax.text(
        len(segs) - 0.05,
        0.515,
        "threshold 0.5",
        color=GOLD,
        fontsize=7,
        ha="right",
        va="bottom",
        fontweight="semibold",
    )
    ax.axhline(canyon["hw_median"], color=TEAL, lw=0.8, ls=":", zorder=1)
    ax.text(
        0.02,
        canyon["hw_median"] + 0.012,
        f"median {canyon['hw_median']:.2f}",
        color=TEAL,
        fontsize=6.6,
    )
    bars = ax.bar(xs, hws, color=colors, edgecolor=INK, linewidth=0.35, width=0.72, zorder=2)
    for x, s in zip(xs, segs):
        ax.text(
            x,
            s["hw"] + 0.012,
            f"{s['hw']:.2f}",
            ha="center",
            fontsize=6.6,
            color=CRIMSON if s["trap_risk"] else INK,
            fontweight="semibold" if s["trap_risk"] else "regular",
        )
    ax.set_xticks(xs)
    ax.set_xticklabels([str(s["i"]) for s in segs])
    ax.set_xlabel("Analysis bay ID (west → east; about 120 m)")
    ax.set_ylabel("Height / width (dimensionless)")
    ax.set_ylim(0, 0.72)
    ax.spines[["top", "right"]].set_visible(False)
    n_over = canyon["segments_over_threshold"]
    n_tot = canyon["segments_total"]
    ax.legend(
        handles=[
            Line2D([0], [0], color=TEAL, lw=6, label=f"H/W < 0.5  ({n_tot - n_over})"),
            Line2D([0], [0], color=CRIMSON, lw=6, label=f"H/W > 0.5  ({n_over})"),
            Line2D([0], [0], color=GOLD, lw=1.2, ls="--", label="0.5 cutoff"),
        ],
        loc="upper left",
        bbox_to_anchor=(0.0, 1.02),
        ncol=3,
        handlelength=1.3,
    )
    trap = next(s for s in segs if s["trap_risk"])
    ax.annotate(
        f"seg. {trap['i']}: H/W = {trap['hw']:.2f}\nairflow review",
        xy=(xs[segs.index(trap)], trap["hw"]),
        xytext=(xs[segs.index(trap)] - 2.35, 0.64),
        fontsize=7,
        color=CRIMSON,
        fontweight="semibold",
        arrowprops=dict(arrowstyle="->", color=CRIMSON, lw=0.7),
    )
    save(fig, "fig4-canyon.svg")


def fig5_econ(econ: dict) -> None:
    fig = new_fig(7.0, 3.8)
    caption_block(fig, "Figure 5. Mott Haven income and poverty vs the city")
    gs = fig.add_gridspec(1, 2, left=0.08, right=0.98, top=0.84, bottom=0.20, wspace=0.32)
    ax_inc = fig.add_subplot(gs[0, 0])
    ax_pov = fig.add_subplot(gs[0, 1])
    for ax in (ax_inc, ax_pov):
        ax.set_facecolor(BOARD)

    site = econ["site_puma"]
    city = econ["citywide"]
    crz = econ["crz_contrast"]
    names = ["Mott Haven", "City average", "Midtown CRZ"]
    income = [site["median_income"], city["median_income_avg"], crz["median_income"]]
    poverty = [site["poverty_rate"] * 100, city["poverty_rate_avg"] * 100, crz["poverty_rate"] * 100]
    colors = [CRIMSON, GOLD, TEAL]
    xs = [0, 1, 2]

    ax_inc.bar(xs, income, color=colors, edgecolor=INK, linewidth=0.4, width=0.62)
    ax_inc.set_xticks(xs)
    ax_inc.set_xticklabels(names, fontsize=6.6)
    ax_inc.set_ylabel("Median income ($)")
    ax_inc.set_title("Median income", loc="left", fontsize=8.4, pad=6)
    ax_inc.set_ylim(0, 78000)
    ax_inc.spines[["top", "right"]].set_visible(False)
    ax_inc.yaxis.set_major_formatter(plt.FuncFormatter(lambda v, _: f"${v/1000:.0f}k"))
    for x, v in zip(xs, income):
        ax_inc.text(x, v + 1400, f"${v:,.0f}", ha="center", fontsize=7.2, fontweight="semibold", color=INK)

    ax_pov.bar(xs, poverty, color=colors, edgecolor=INK, linewidth=0.4, width=0.62)
    ax_pov.set_xticks(xs)
    ax_pov.set_xticklabels(names, fontsize=6.6)
    ax_pov.set_ylabel("Poverty rate (%)")
    ax_pov.set_title("Poverty rate", loc="left", fontsize=8.4, pad=6)
    ax_pov.set_ylim(0, 36)
    ax_pov.spines[["top", "right"]].set_visible(False)
    for x, v in zip(xs, poverty):
        ax_pov.text(x, v + 0.6, f"{v:.1f}%", ha="center", fontsize=7.2, fontweight="semibold", color=INK)

    save(fig, "fig5-econ.svg")


def main() -> None:
    style()
    OUT.mkdir(parents=True, exist_ok=True)
    crz = load("crz.json")
    bt = load("bt.json")
    canyon = load("canyon.json")
    econ = load("economics.json")
    _ = load("itree.json")  # H/W typology context; numbers live on fig4
    fig1_gates(crz)
    fig2_trucks(crz)
    fig3_did(bt)
    fig4_canyon(canyon)
    fig5_econ(econ)


if __name__ == "__main__":
    main()
