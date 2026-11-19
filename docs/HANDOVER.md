# Handover: read this first (last updated 19 November 2026)

This file is the memory of every session so far. A new session should be able
to carry on as if it were the same conversation. Read it fully, then
`CLAUDE.md`, `docs/DECISIONS.md`, `docs/LEAD_RULES.md`, `docs/BUILD_PLAN.md`
and `docs/SCRIPT.md`.

## 0. First thing to check

- **Which branch has the work.** Everything below lives on branch
  `ccr-9b35ccd8-fso3n4`. Until the owner merges it, `main` only holds the
  original `quote-recovery.zip`. If your checkout has no `src/` or
  `public/index.html`, run `git fetch origin ccr-9b35ccd8-fso3n4` and work from
  that branch. Never push to `main` unless the owner says so in that message.
- **Deploys.** `.github/workflows/deploy.yml` deploys on every push to
  `ccr-9b35ccd8-fso3n4` or `main`, and can be run by hand (workflow_dispatch).
  If you develop on a new branch name, add it to `on.push.branches` or run the
  workflow by hand on it.
- **The owner moved to a new Claude account** because the old one ran out of
  weekly usage. Claude artifacts made on the old account (the old demo and
  the old Lead Desk with the 29 Kent leads) may not be readable from the new
  one. The owner has the Kent leads as a file (`kent-leads.tsv`, see section 3).

## 1. Who the owner is and how to work with them

- Runs this alone, from **Nigeria**, selling to **UK** installers. Also builds
  Amara (a separate Nigerian hospitality product, its own repo). Never mix the
  two: no Amara code, accounts or WhatsApp numbers in this project.
- Writes by voice, long and loose. Pull out the real questions and answer each.
- Wants: plain words, short replies, an honest recommendation (not a survey of
  options), real costs in pounds, and to be told when an idea is risky or
  breaks a rule. They respond well to being told "your instinct is right" or
  "no, because" with the reason.
- Standing rules are in `CLAUDE.md`. The big ones: echo back and wait for
  "go ahead" before code; screenshot every visual change (phone and desktop,
  light and dark); click every button you add; no em dashes in any copy;
  British English; secrets never in the repo or chat; the repo is **public**
  so lead data never goes into git, workflow inputs or logs.
- Budget is tight. No Google Cloud card, so no Google Places. Prefer free
  tiers that are lawful for UK use.

## 2. What is live (Cloudflare, account set in GitHub secrets)

| Thing | Where |
|---|---|
| Lead Desk | https://quote-recovery.billiondollarprof.workers.dev/ |
| Sales demo | https://quote-recovery.billiondollarprof.workers.dev/demo/ |
| Health check | `/api/health` (public, returns `{"ok":true}`, no data) |
| Leads API | `/api/leads` GET, POST (one or a list), `/api/leads/:id` PATCH, DELETE. Needs `Authorization: Bearer <DESK_TOKEN>`. Returns 503 until `DESK_TOKEN` is set. |
| Database | Cloudflare D1 `quote-recovery`, tables `leads` and `runs` (`db/schema.sql`). Currently **0 leads**. |
| Weekly cron | Monday 06:00 UTC, a no-op until the finder exists |

How it is built:
- `src/index.ts`: one Worker. Static files in `public/` are served first
  (desk at `/`, demo at `/demo/`). The API maps the desk's camelCase fields to
  snake_case columns (`trade` is stored as `trades`). Empty company number or
  place id is stored as NULL so they never clash on the UNIQUE index. POST uses
  INSERT OR IGNORE, so a repeated company number is skipped and counted.
  Password check hashes both sides and uses `crypto.subtle.timingSafeEqual`.
- `public/index.html`: the Lead Desk, ported from
  `reference/lead-desk-artifact.html`. Only the storage changed (fetch to the
  API, a password box, reload after each write and when the tab regains
  focus). The password is kept in the browser's localStorage.
- `.github/workflows/deploy.yml`: type check, find or create D1 and write its
  id into `wrangler.toml` at deploy time (the repo keeps `REPLACE_ME`), apply
  the schema, deploy, copy `COMPANIES_HOUSE_KEY` and `DESK_TOKEN` into the
  Worker, then smoke test: live demo and desk must match the repo byte for
  byte, `/api/leads` must refuse a missing password, and the lead count is
  printed in the run summary.
- Pinned versions: wrangler 4.140.0, workers-types 5.20260924.1, TypeScript
  5.9.3. That wrangler only runs compatibility dates up to 2026-09-30, so
  `compatibility_date` is 2026-09-24. Pick versions at least two weeks old.
- The cloud session's network **blocks `*.workers.dev`**. You cannot open the
  live site from the session. Test locally with `npx wrangler dev` (put
  `DESK_TOKEN=...` in `.dev.vars`, which is git ignored, and apply the schema
  with `npx wrangler d1 execute quote-recovery --local --file db/schema.sql`),
  drive it with Playwright (preinstalled), and rely on the workflow's smoke
  test for the live check. Read workflow results with the GitHub MCP tools
  (`actions_list`, `get_job_logs`).

GitHub secrets set by the owner: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`,
`COMPANIES_HOUSE_KEY`. **Not set yet: `DESK_TOKEN`** (last checked 18 Nov).

## 3. Waiting on the owner

1. **Add `DESK_TOKEN`** as a GitHub Actions secret (Settings, Secrets and
   variables, Actions). It is a password they make up. Then re-run the deploy
   (push, or run the Deploy workflow by hand) and check the run log says
   `/api/leads with the desk password -> 200`.
2. **Paste the 29 Kent leads** into the desk: open the desk, enter the
   password, "Paste a list", paste the whole `kent-leads.tsv` (tab separated:
   business, contact, trade, town, phone, email, website, company type,
   company number, source, notes), "Add these leads". Expect "29 leads added".
   Paste once only: 11 of them have no company number, so a second paste
   would add those 11 again. Only 9 have a phone, 3 an email, 4 a website. The
   next deploy summary should show `Leads in D1: 29`.
3. **Caller ID test before calling from Nigeria** (see DECISIONS, Outreach).
4. Optional: make the GitHub repo private (Settings, General).
5. Merge `ccr-9b35ccd8-fso3n4` into `main` when happy, or tell the session to.

## 4. What was decided in these sessions (details in DECISIONS.md)

- Stay with **quote recovery** for UK window, door, conservatory and roofline
  installers. Re-checked twice against YouTube ideas (an AI receptionist for
  dentists; "build a free website first, then sell automation"). Both
  confirmed quote recovery as the quickest route to cash. The AI receptionist
  idea is our £199 monthly care (instant reply to new quotes), not a new offer.
- **No free websites.** Our targets must already have a website with a quote
  form (LEAD_RULES). A free site is slow, solves a problem they do not have,
  and trains buyers not to pay.
- **Payment plan:** £100 to book the build, £400 on go live day after they
  approve test messages, £1,000 balance only when the system has booked 5
  calls (3 for smaller lists). No refunds, so no escrow. Monthly care is
  raised only after the balance is paid.
- **What counts as a booking:** a customer who replies and confirms a time
  for a call, or asks to be called, logged by our system. Never measure jobs
  won.
- **WhatsApp structure:** each client gets their own WhatsApp Business
  account, in their name, through a provider that bills our card (Twilio or
  similar). Never Amara's account, never the owner's own number. Our server
  holds the logic, so it can be switched off if the balance is unpaid.
- **Cost per client campaign:** about £25 to £40 (300 old quotes, two
  messages each at most, Meta's UK marketing rate about 4.6p).
- **Calling funnel to plan against:** per 100 dials, about 25 to 35 reach the
  owner, 8 to 12 accept the video, 3 to 5 real follow ups, 1 to 2 pay £100.
  Aim for 20 dials a day. Judge the opener and offer after the first 100 dials
  using the desk's pipeline counts.
- **Legal findings:** Ofcom's rule on UK mobile numbers calling from abroad is
  final; WhatsApp needs opt in, so it is not a cold channel; Gemini's free API
  tier is not allowed for apps used in the UK; Tencent Hunyuan3D's licence
  excludes the UK.
- **Honesty:** never pretend (for example "I'm working on your demo" when
  not). The honest version is to actually build it first.

## 5. Next steps, in order (each needs the owner's "go ahead")

1. **Bring the script in line with the new payment plan.** DECISIONS.md now has
   £100 / £400 / £1,000 on 5 bookings. `docs/SCRIPT.md` and the desk's Script
   and How it works tabs (`SCRIPT` array and the `#tab-how` list in
   `public/index.html`) still say "£500 to start, £1,000 if it books the
   agreed number of calls in 30 days". Update both together, screenshot
   phone and desktop in light and dark, deploy.
2. **Draft the one page client agreement** (payment plan, what counts as a
   booking, list size rule, switch off if unpaid 7 days after the 5th
   booking, who pays WhatsApp fees, opt out on every message, the client
   confirms customers were given an opt out when they asked for a quote).
   Tell the owner to have it checked by someone qualified in UK contract law.
3. **Free lead source research** (replaces Google Places). Candidates, in
   order: Companies House advanced search (official, free key already set:
   SIC 43342, 43320, 43390, 43910 plus name words, `company_status=active`,
   location Kent), then phone and email from OpenStreetMap (Overpass, ODbL,
   measure Kent coverage) and from the firm's own website contact page
   (respect robots.txt, one request per second). Never Google Maps scrapers.
   Prove it on Kent: how many qualified leads with a phone and an email.
   Present the numbers and wait for "go ahead".
4. **Build the finder** on that source (BUILD_PLAN steps 6 to 10, with step 5
   swapped for the chosen source). Weekly cron, cap per run, `runs` row with
   skip reasons, `POST /api/run` protected by `DESK_TOKEN`.
5. **Live AI replies in the demo.** Typed messages in the demo get a real AI
   answer through the Worker (never a key in the page), using Cloudflare
   Workers AI's free daily allowance (10,000 neurons, about 80 replies), with
   the current scripted answers as fallback. Rules for the prompt:
   acknowledge what the customer said first, then the next question; keep the
   opening messages as fixed templates. The Cloudflare token may need the
   Workers AI permission.
6. **Prospect research for each lead:** read the lead's own website once
   (the finder's email step already does) and save: how they take enquiries
   (form, phone, WhatsApp), services, areas covered, guarantees, finance,
   accreditations (FENSA, Certass). Use it to fill the personalised demo and
   a short call brief on the lead card.
7. **WhatsApp provider choice for the first client:** compare Twilio and one
   or two others (per message mark up, sign up flow, billing on our card,
   whether the client can keep their WhatsApp Business app number). Check
   Meta's live UK price page.

## 6. Ideas parked (not now)

- **Booked demo calls with reminders** (from a YouTube video): book a short
  call, call the day before, remind 2 hours before, send a new link if they
  miss it. Would change our "call, then send video" outreach, so it needs the
  owner's yes. The reminder and no show steps also belong in the client
  system later.
- **3D websites** as a second offer: three.js or React Three Fiber, GSAP,
  Spline, Blender, Poly Haven, TRELLIS (MIT), gaussian splats for hotels. Best
  fit: product brands and hotels; weakest: restaurants. Owner was offered a
  one day showcase in its own repo; no answer yet. Not part of this repo.

## 7. Known gaps and gotchas

- Duplicate check on paste is by company number only.
- `/api/leads` loads every lead at once; fine for hundreds, page it before
  thousands.
- The desk still mentions "send the list to Claude" in How it works step 1
  and the empty state; harmless, left as the original copy.
- `reference/lead-desk-artifact.html` is kept for reference only; never serve
  it.
