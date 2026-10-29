# Quote Recovery

A done for you service for UK home improvement installers: we bring back
quotes that went quiet, qualify the replies, and book them into calls with the
owner.

- `public/demo/` the sales demo (open `public/demo/index.html` in a browser)
- `reference/` the Lead Desk as first built, to be ported to Cloudflare D1
- `docs/` decisions, lead rules, build plan, call script, research
- `db/schema.sql` and `wrangler.toml` drafts for the Cloudflare build

Start with `CLAUDE.md`.

## Setting up the new repo

1. Create an empty GitHub repository and push this folder to it.
2. In the repo: Settings, Secrets and variables, Actions. Add
   `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
3. Get a Google Places API key and a free Companies House API key, and add
   them in the same place as `GOOGLE_PLACES_KEY` and `COMPANIES_HOUSE_KEY`.
   Never put them in the repo.
4. Start a new Claude session on the repo and ask it to follow
   `docs/BUILD_PLAN.md`.
