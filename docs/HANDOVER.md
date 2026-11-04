# Handover: where the last session stopped (4 November 2026)

## Live on Cloudflare (branch `ccr-9b35ccd8-fso3n4`, deployed by `.github/workflows/deploy.yml`)
- Lead Desk at `/`, demo at `/demo/`, leads API at `/api/leads` (needs the
  `DESK_TOKEN` GitHub secret as a Bearer token). URLs are in `CLAUDE.md`.
- D1 database `quote-recovery` created and the schema applied by the workflow.
  The workflow fills `database_id` in at deploy time; the repo keeps `REPLACE_ME`.
- `COMPANIES_HOUSE_KEY` is in the Worker. The weekly cron runs a no-op until
  the finder exists.
- The cloud session's network blocks `*.workers.dev`, so live checks run in the
  workflow's smoke test (live files match the repo byte for byte, API refuses
  a missing password, prints the lead count).
- Pinned to wrangler 4.140.0; its runtime only supports compatibility dates up
  to 2026-09-30, so `compatibility_date` is 2026-09-24.

## The 29 Kent leads
Read from the old artifact desk (collection `leads`, all status `new`, no
dates or CTPS results). The repo is **public**, so they are not committed: the
owner pastes them into the desk's "Paste a list" box. Check the lead count in
the latest deploy summary. Duplicates are caught by company number only, so
pasting twice re-adds the 11 leads without one.

## Decided or found this session (see DECISIONS.md)
- Ofcom's rule on UK mobiles calling from abroad is final; Wi-Fi Calling is the
  route to test.
- WhatsApp needs opt in; use it after the first call, not cold.
- Gemini's free tier is not allowed for apps used in the UK.
- Stay with quote recovery. The YouTube "AI receptionist" idea is our monthly
  retainer (instant reply to new quotes); borrow its live AI demo and
  per prospect research.

## Next steps, in order (each needs the owner's "go ahead")
1. Live AI replies to typed messages in the demo, through the Worker, on
   Cloudflare Workers AI's free daily allowance, scripted answers as fallback.
   The token may need the Workers AI permission.
2. Research the free lead source (Companies House advanced search, then
   OpenStreetMap and the firm's own contact page), prove it on Kent, then
   build the finder (BUILD_PLAN steps 5 to 10).
3. Prospect research from the lead's website: fill the demo and a call brief
   (how they take enquiries, likely pain points, opening line).
