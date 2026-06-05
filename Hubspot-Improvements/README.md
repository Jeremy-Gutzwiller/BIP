# G2 in HubSpot, Custom Fields Prototype

Interactive prototype that simulates HubSpot's Companies list view, populated with **G2 Marketing Solutions buyer-intent data**. The picker lets you add or remove any of the ~66 candidate custom fields G2 could expose to a customer's HubSpot account.

The goal is to make a stakeholder conversation concrete: "if G2 wrote these fields to your HubSpot Companies tab, here's what your list-builder, lead-scoring, and workflow-trigger views would look like."

## Data

The data is sanitized for shareability. **All company names and domains are synthetic** (Apex Logistics, Nimbus Health, Beacon Analytics, etc.). Every other value is real: intent scores, pageview counts, industries, signal types, geographic data, dates, competitor product names. The story stays accurate; only the customer identities are masked.

## How the picker categorizes fields

Each field is tagged with one of four availability chips so it's clear what would be required to ship each one.

| Chip | Meaning | Count |
|---|---|---|
| Green **8** | Already exposed (G2 writes these to HubSpot today) | 8 |
| Green **Now** | Synced today, universal (returned by current sync query; ships next week with one PR) | 20 |
| Yellow **PA** | Available to Performance Analytics customers (ships in the same release; populates for customers who have connected HubSpot via Integration Hub with deals scope) | 20 |
| Purple **Query** | Needs a query call we don't run today (ships in a few weeks with dev work) | 18 |

The headline pitch: **48 fields ship in one Wave 1 release** (8 already + 20 universal + 20 Performance Analytics customers). **+18 in Wave 2** with a few weeks of dev. **Zero fields require new data infrastructure.**

There is no Wave 3. The Performance Analytics fields aren't a separate later wave; they ship at the same time as the universal Wave 1 set. They're separated only by which customer cohort they populate for.

## What the picker shows by default

- The 8 fields currently written to HubSpot
- The 2 pinned identity columns (Company Name, Domain) which are always visible

## Buttons

- **Show all 28 we have today** flips on every field tagged "Already exposed" or "Synced today" (the universal-Wave-1 set), so you can see the no-new-code baseline at a glance
- **Reset to 8** returns to the current production state
- **Edit columns** opens the picker drawer with all 66 fields organized by section

## State

Column selections persist in the URL hash (`#cols=...`). Paste the URL into Slack or a doc and the recipient sees the same column set you saw.

## Files in this prototype

| File | What it is |
|---|---|
| `index.html` | Page shell |
| `app.js` | Table render, picker drawer, URL-hash state |
| `fields_catalog.js` | All 66 catalog fields with availability tagging |
| `sample_data.json` | Sanitized data, 25 records |
| `README.md` | This file |

## Companion docs (in the BIP repo or related G2 internal docs)

- Catalog of every candidate field, with sources verified against the production code
- Engineering tracker for Wave 2 (effort estimates by tier, files to modify)
- Per-field data dictionary (field name, availability, value to customers, next step)

## Notes for the team

Open `index.html` in a browser to play with it. No build step, no server required for most browsers (Safari / Chrome both work from `file://`). If your browser blocks the local `fetch('sample_data.json')`, run `python3 -m http.server` from this folder and visit `http://localhost:8000`.

The picker is the artifact; the data is illustrative. The exercise is "which of these fields would you actually use in HubSpot workflows?" The answers drive Wave 1 default selection and Wave 2 sequencing.
