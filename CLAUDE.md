# Quote Recovery: rules for every Claude session in this repo

Read this file in full before doing anything. Then read `docs/HANDOVER.md`
(where the last session stopped), `docs/DECISIONS.md`
(what has already been decided and why) and `docs/BUILD_PLAN.md` (what is
being built next). Do not re-open a decision recorded there unless the owner
asks.

## What this repo is

A done for you service sold to UK home improvement installers (windows,
doors, conservatories, roofline). We recover revenue from quotes that went
quiet: the system messages old quotes politely in the installer's name,
qualifies whoever replies, books them into a call, and alerts the owner. Then
it does the same for every new quote.

This repo holds three things:

1. **The sales demo** (`public/demo/`): a tap to play WhatsApp, SMS or email
   chat that shows the recovery process with the prospect's business name in
   it. The owner screen records it on a phone for personalised videos.
2. **The lead finder** (to build): a Cloudflare Worker that finds qualified
   installers, checks them, and stores them in Cloudflare D1, on a weekly
   schedule.
3. **The Lead Desk** (to port): the owner's calling desk with leads, call,
   WhatsApp and email buttons, follow up dates, and the call script. The
   working version lives today as a Claude artifact; `reference/` holds its
   source. It must be ported to read and write D1 through the Worker.

This is separate from Amara (the owner's Nigerian hospitality product) on
purpose. Do not import Amara code, and do not touch the Amara repo from here.

## Working rules (carried over from the owner's standing rules)

1. **Echo back before code.** Repeat the task in one or two sentences and wait
   for "go ahead". Every time.
2. **Read the actual code first.** Never work from memory or a summary. Trace
   what a change touches before making it.
3. **Plan, then present, then build.** For anything non trivial: problem, files
   affected, steps, what could break, how you will verify. Wait for approval.
4. **Only touch what you were asked to touch.** If a change would affect
   something else, stop and ask.
5. **Short replies.** What you did, what the owner has to do, anything risky.
   Plain words. No restating the request, no padding.
6. **Copy rules** (all user facing text: demo, desk, emails, scripts):
   - No em dashes. No hyphen used as a dash. Real compound words keep their
     hyphen ("follow-up" the noun, "follow up" the verb).
   - Polite, never an order, never overdone. British English, pounds.
7. **Look at what you build.** Screenshot every visual change at phone width
   and desktop, light and dark, and judge it before showing the owner. The
   demo must look like the real messaging app, not like a mockup.
8. **Click every button you add** in a real browser and confirm where it lands.
9. **Never claim a UI problem from reading source.** Render it and measure it.
10. **Secrets never go in the repo or the chat.** Keys live in Cloudflare
    secrets and GitHub Actions secrets only.
11. **Anything the owner must run or deploy is pasted whole** in one copyable
    block, with the order stated.
12. **Never push to `main` without the owner saying so in that message.** Each
    permission covers one push. Work on a branch.
13. **Map all causes before fixing a bug.** List every candidate, check each,
    then fix the confirmed one.
14. **Stay inside the law** (see `docs/DECISIONS.md`, Legal). If a feature would
    break UK PECR, UK GDPR, Google's or Companies House's terms, say so and
    propose the compliant version instead.

## Where things live

| Path | What |
|---|---|
| `public/demo/index.html` | The sales demo. Standalone, no build step. |
| `reference/lead-desk-artifact.html` | Lead Desk as built for the Claude artifact runtime (uses `window.claude` db). Port, do not serve as is. |
| `db/schema.sql` | Draft D1 schema for leads and finder runs. |
| `wrangler.toml` | Draft Worker config: D1 binding, cron, static assets. |
| `docs/DECISIONS.md` | Everything decided so far, with the evidence. |
| `docs/LEAD_RULES.md` | Exactly what makes a business a qualified lead. |
| `docs/BUILD_PLAN.md` | The finder and desk architecture, step by step. |
| `docs/SCRIPT.md` | The call script, follow up messages and video plan. |
| `docs/RESEARCH.md` | Sources behind the decisions. |

## Live links (Claude artifacts, private to the owner)

- Demo: https://claude.ai/artifact/5GBWF6v5GTZN2yZFPopNk1
- Lead Desk: https://claude.ai/artifact/SqaNjLJCdvTSDSHUGX7BGD (holds the first 29 hand found Kent leads; export them into D1 when the desk is ported)

Once the Cloudflare versions are live, record their URLs here.
