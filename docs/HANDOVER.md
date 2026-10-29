# Handover: where the last session stopped (29 October 2026)

## Done
- Research and decisions: `docs/DECISIONS.md`, `docs/RESEARCH.md`.
- The sales demo: `public/demo/index.html` (also live as a Claude artifact,
  https://claude.ai/artifact/5GBWF6v5GTZN2yZFPopNk1).
- The Lead Desk, live as a Claude artifact with its own database:
  https://claude.ai/artifact/SqaNjLJCdvTSDSHUGX7BGD
  Source in `reference/lead-desk-artifact.html`. It holds **29 hand found Kent
  leads** (collection `leads`, ids starting `kent-`). Ten have a phone number;
  the rest need contact details. Read them with the ArtifactData tool and move
  them into D1 when the desk is ported.
- Lead rules, build plan, schema and Worker config drafts.

## Set by the owner in this repo's GitHub secrets
- `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- `COMPANIES_HOUSE_KEY` (free)
- Not set: `GOOGLE_PLACES_KEY`. See "Changed" below.

## Changed since BUILD_PLAN.md was written
**There is no budget for Google Places.** The owner cannot add a card for
Google Cloud billing right now. Before building step 5 (the find step),
research free, lawful sources and present the options with evidence:

1. **Companies House advanced search** (free, official): active companies by
   SIC code (43342 glazing, 43320 joinery installation, 43390, 43910 roofing)
   and location. Gives name, company number, registered address, age,
   directors. No phone or email, so it needs a second step.
2. **OpenStreetMap** via the Overpass API (free, open data under ODbL):
   businesses tagged with crafts and shops such as window construction or
   glaziery, often with phone and website. Coverage in the UK is patchy;
   measure it for Kent before relying on it.
3. **The business's own website** (find it by company name, then read the
   contact page for phone and email, respecting robots.txt).
4. **Free tiers:** Google Maps Platform has offered a free monthly allowance
   per call type, but still needs a card on file. Check the current terms;
   only an option if the owner later adds a card.
5. **Open source scrapers on GitHub:** many scrape Google Maps pages directly.
   That breaks Google's terms (see DECISIONS.md, Legal), so do not use or copy
   them. Open source code is fine to learn from or reuse only if its licence
   allows it and the data source it reads permits automated access. Say which
   is which.

Recommend one route, prove it on Kent (how many qualified leads with a phone
and an email it finds), and wait for "go ahead".

## Next steps, in order
1. Read `CLAUDE.md`, `docs/DECISIONS.md`, `docs/LEAD_RULES.md`,
   `docs/BUILD_PLAN.md`, and this file.
2. Echo back the plan in a few lines and wait for "go ahead".
3. Build BUILD_PLAN steps 0 to 4: repo skeleton, deploy workflow, D1, demo
   served from Cloudflare, leads API, Lead Desk ported to D1, the 29 Kent leads
   moved across.
4. Research the free lead source (above), then build the finder on it.
5. Record the live URLs in `CLAUDE.md`.
