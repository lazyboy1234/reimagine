# Deegan garden deck concept

This is an editable architectural concept, built October 9, 2026 in Blender 5.2.2 LTS. It responds to the user's observation that the road has little spare space. The park uses the space above an assumed highway bay. It isn't a surveyed site plan or a validated structure.

## Files

- `deegan-garden-deck.blend`: source with named highway, structure, landscape, furniture, people, context and presentation collections.
- `exports/deegan-garden-deck.glb`: full park, meters, glTF 2.0.
- `exports/deegan-garden-deck-cutaway.glb`: the same concept with one deck quadrant omitted for visibility. The highway stays continuous.
- `renders/park-overview.png`, `renders/deck-cutaway.png`, `renders/cross-section.png`: 1600 × 1100 rendered views. The section image isolates a short deck bay.
- `index.html`: interactive orbit viewer, full/cutaway controls and downloads. It uses a local copy of model-viewer 4.4.0; the rendered poster is available if the library fails to load.
- `vendor/`: model-viewer 4.4.0 from the official npm package, its Apache 2.0 license and tarball integrity provenance. The documented Google CDN URL returned 404 during verification, so the viewer serves the saved library locally.
- `manifest.json`: dimensions, units and limitations.
- `scripts/build_deck.py`: deterministic geometry builder, exports and camera renders.
- `../../story-art/deegan-designs/`: three built-in ImageGen explorations and the exact prompt set. These are atmosphere concepts, not renders of the mesh.

## Assumed dimensions

| Feature | Assumption |
|---|---|
| Deck | 240 m long × 34 m wide, 8,160 m² / 2.02 acres |
| Roadway envelope | 30 m wide |
| Lanes | Three each direction, 3.5 m per lane |
| Structure | Side abutments outside the roadway; no piers in vehicle lanes |
| Girder underside | 6.6 m above modeled pavement |
| Park surface | Approximately 9.6 m above modeled pavement |
| Landscape | Narrow tree strips, central lawns, two promenades, small play area and seating pavilion |

The user provided a Klyde Warren Park photograph as a precedent and the live Reimagine site as project context. Existing project reference photos show that the Deegan's grades, ramps and adjacent streets constrain a real design. The uniform straight bay and surrounding building blocks here are illustrative simplifications.

The earlier site map's 12.9-acre corridor polygon is a broad planning footprint. It isn't the area of this 2.02-acre model or proof of available land. Its earlier cost and particle-removal estimates must not be transferred to this smaller model.

## What a site study still needs

A survey must establish right of way, road elevation, bridge/ramp conflicts, utilities and access. Engineering must assess deck loads, foundations, vehicle clearance, fire safety, ventilation, drainage, soil depth and tree anchorage. A lid doesn't remove vehicle exhaust; an air-quality study must consider emissions at the portals and nearby homes. No pollution reduction or model-specific price is claimed.

## Klyde Warren precedent

The [Landscape Architecture Foundation / UT Arlington case study](https://www.landscapeperformance.org/case-study-briefs/klyde-warren-park) covers the original 5.2-acre Dallas park opened in 2012, costing about $110 million. Its annual tree-carbon estimate and short summer temperature comparison are separate from PM2.5 measurements. The [2017 ASLA design award account](https://www.asla.org/awards-events-main-landing/honors-awards/pro-student-awards/2017-professional-awards/327692) describes air/noise improvements qualitatively, without a measured PM2.5 reduction. Neither supplies a transferable Deegan air-quality effect.

## Preview and rebuild

From the project root, run `python3 -m http.server 8766 --bind 127.0.0.1` and open `http://127.0.0.1:8766/model/deegan-garden-deck/`. The viewer serves its library and uncompressed models locally. Blender and the downloaded models also work independently.

Run the builder with Blender's background mode and the saved script. It overwrites this directory's generated model, exports and renders. The project used the existing Blender slot runner to avoid competing with other Blender jobs.
