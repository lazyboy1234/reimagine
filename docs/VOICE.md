# Site voice

All narrative on this datathon site must match Cody Wong's writing bible.

Canonical rules live in `docs/Cody-Writing-Bible.md`. Full source dump (bible + style + IDC samples) is `docs/Cody-Writing-Sources.md`.

## Quick test before ship

Would Cody type this? Would he remember this? Would he be too lazy to type this?

If no, cut it. Do not upgrade him into a professor. Do not leave speech fillers (`like`, `hey`) on the page. Do not write "explain it to a kid" baby talk.

## Hard constraints

- Subject first. Never open on a verb.
- Contractions (`wouldn't`, `I'm`, `that's`, `don't`).
- No em dash. Period, comma, semicolon, or a new sentence.
- Ranges: `25-30` or `25–30`.
- Keep `data-v` bindings when rewriting.
- Thin unused facts; keep takes.
- Neighborhood names over cold acronyms when you can (Hunts Point / Longwood / Melrose, not cold "PUMA" alone).

## Data storytelling, requested October 9, 2026

The story should explain how we reached the result, with enough detail to reconstruct the comparison.

1. The map or observation gave us a specific hypothesis. Say what we thought might happen without presenting that thought as a finding.
2. The next sentence names the exact datasets, their agencies and their role. Separate files we used from files we checked and rejected.
3. The comparison states exact years or dates, places, comparison groups and units. A reader shouldn't have to guess what “before,” “after,” “traffic” or “growth” means.
4. The result gives a concrete number, denominator and uncertainty where available. One named bridge with its two annual counts is better than “traffic changed.”
5. The interpretation says what the result supports and what the coverage leaves open. Counts at a bridge don't trace people's routes or destinations.
6. The next step follows from that limit. Don't invent a completed analysis or call a source audit exhaustive.

The user calls this hyperspecificity. Keep the voice conversational: “The map made us wonder whether drivers would go through the Bronx. We used [full dataset name] to compare [places] from [dates]...” Every bracket must be filled from evidence before publication. Avoid “smart drivers” because the data doesn't observe their reasoning. Never write “all bridges” or “all available datasets” without a defined inventory and a coverage audit.

For each slide, tell the story in this order: observation → why it matters → named source and date window → geography and unit → calculation → result → uncertainty → what missing data could change → next action. Explain weights before showing the score, then the score before the rank. Percentages must identify the denominator. Separate policy hypotheses from supported results. Label every image with the actual street, view, source date and purpose.
