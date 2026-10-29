# Build plan: lead finder and Lead Desk on Cloudflare

Status: planned, nothing built. Echo back and get "go ahead" before each step.

## Architecture

One Cloudflare Worker, one D1 database, static assets served by the same
Worker.

```
Cron (weekly) ──> Worker scheduled() ──> Places API (find)
                                     ├─> Companies House API (check)
                                     ├─> business website (email)
                                     └─> D1: leads, runs

Owner's browser ──> Worker fetch() ──> /           Lead Desk UI
                                    ├─> /demo/      sales demo
                                    └─> /api/...    leads read and write (D1)
```

## Secrets and settings

| Name | Where | Use |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | GitHub Actions secret | deploy with wrangler |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub Actions secret or variable | deploy target |
| `GOOGLE_PLACES_KEY` | GitHub Actions secret; the deploy workflow copies it into the Worker with `wrangler secret put` | Places API (New) |
| `COMPANIES_HOUSE_KEY` | GitHub Actions secret, copied into the Worker the same way | Companies House API, basic auth with the key as username |
| `DESK_TOKEN` | Worker secret | protects `/api/*`; or put the whole Worker behind Cloudflare Access instead (preferred) |

The Cloudflare API token needs, at minimum: Workers Scripts edit, D1 edit,
and Account read. Scope it to the one account.

## Steps

0. **The session does the Cloudflare work itself.** The owner only adds the GitHub secrets. Create the D1 database, apply the schema, set Worker secrets and deploy, all through the GitHub Actions workflow using `CLOUDFLARE_API_TOKEN`, because a cloud session's network may block api.cloudflare.com directly.
1. **Repo skeleton.** `wrangler.toml`, `src/index.ts`, `db/schema.sql`,
   GitHub Actions workflow that runs `wrangler deploy` on push to the deploy
   branch. Create the D1 database and apply the schema.
2. **Serve the demo** from `public/demo/` as static assets. Confirm it works on
   a phone over the live URL.
3. **Leads API.** `GET /api/leads`, `POST /api/leads` (one or many, for paste
   import), `PATCH /api/leads/:id`, `DELETE /api/leads/:id`. Protected.
4. **Port the Lead Desk.** Take `reference/lead-desk-artifact.html` and replace
   the `window.claude.use("db")` calls with `fetch` to the API. Keep the UI,
   the script and the rules exactly as they are. Poll or refresh after each
   write; real time is not needed.
5. **Finder, find step.** Places API (New) Text Search:
   `POST https://places.googleapis.com/v1/places:searchText` with a field mask
   limited to what we use (`places.id`, `places.displayName`,
   `places.formattedAddress`, `places.nationalPhoneNumber`,
   `places.websiteUri`, `places.rating`, `places.userRatingCount`,
   `places.businessStatus`). The field mask decides the price tier, so keep it
   tight. Queries per town: "double glazing installers in X", "window and door
   company in X", "conservatory installers in X", "fascias and soffits in X".
   Follow `nextPageToken`.
6. **Finder, check step.** Match each place to Companies House: search by name,
   confirm by postcode district, then read status, incorporation date, company
   type, SIC codes and the first active director. Advanced search
   (`/advanced-search/companies` with `sic_codes`, `location`,
   `company_status=active`) is the second route, and counts installers per
   county for the region choice. Confirm exact parameter names against the
   official spec before coding.
7. **Finder, email step.** Fetch the homepage and the contact page, respect
   robots.txt, extract `mailto:` and visible addresses, prefer generic sales
   addresses, one request per second per site.
8. **Qualify and score** using `docs/LEAD_RULES.md`. Upsert by place id and
   company number so nothing is added twice. Write a `runs` row with counts and
   skip reasons.
9. **Schedule.** Cron trigger weekly (for example Monday 07:00 UK time; cron is
   UTC, so mind British Summer Time). A protected `POST /api/run` lets the owner
   run it by hand. Cap each run (for example 40 new leads) to control API cost.
10. **Region research run.** Count active installers per county in the chosen
    region and report the ranking before the first full run.

## Not in scope yet

- Sending emails or WhatsApp from the system. Outreach stays manual and owner
  led for now.
- CTPS checking. Paid service; the owner records the result on the desk.
- The client side recovery system itself (the product we build for each
  installer who pays). That is a separate build per client.
