export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  COMPANIES_HOUSE_KEY?: string;
  DESK_TOKEN?: string;
}

// The desk speaks camelCase; D1 columns are snake_case. Only these fields can be written.
const COLUMNS: Record<string, string> = {
  id: "id", placeId: "place_id", companyNo: "company_no", biz: "biz", contact: "contact",
  trade: "trades", town: "town", region: "region", phone: "phone", email: "email",
  website: "website", companyType: "company_type", incorporated: "incorporated",
  reviews: "reviews", rating: "rating", score: "score", source: "source", ctps: "ctps",
  status: "status", nextDate: "next_date", lastContact: "last_contact", notes: "notes",
  created: "created", updated: "updated",
};
const FIELD_OF: Record<string, string> = Object.fromEntries(Object.entries(COLUMNS).map(([f, c]) => [c, f]));
const NUMERIC = new Set(["reviews", "rating", "score"]);
const UNIQUE = new Set(["placeId", "companyNo"]); // empty means unknown, stored as NULL so it never collides
const STATUSES = new Set(["new", "called", "interested", "video", "followup", "pilot", "won", "no", "dnc"]);
const CTPS = new Set(["", "clear", "registered"]);
const DATE = /^(\d{4}-\d{2}-\d{2})?$/;
const MAX_TEXT = 4000;
const MAX_BATCH = 500;

class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export default {
  // Static files in public/ (the desk at /, the demo at /demo/) are served before this runs.
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    try {
      if (url.pathname === "/api/health") {
        // Proves the D1 binding and schema are in place without revealing any data.
        await env.DB.prepare("SELECT 1 FROM leads LIMIT 1").all();
        return Response.json({ ok: true });
      }
      if (url.pathname === "/api/leads" || url.pathname.startsWith("/api/leads/")) {
        await authorise(request, env);
        return await leads(request, env, url.pathname.slice("/api/leads".length).replace(/^\//, ""));
      }
      if (url.pathname.startsWith("/api/")) throw new HttpError(404, "Not found");
      return env.ASSETS.fetch(request);
    } catch (e) {
      if (e instanceof HttpError) return Response.json({ error: e.message }, { status: e.status });
      console.error(e);
      return Response.json({ error: "Something went wrong" }, { status: 500 });
    }
  },

  // The lead finder is not built yet; the weekly cron is a no-op until it is.
  async scheduled(_event: ScheduledController, _env: Env): Promise<void> {
    console.log("finder not built yet");
  },
} satisfies ExportedHandler<Env>;

async function authorise(request: Request, env: Env): Promise<void> {
  if (!env.DESK_TOKEN) throw new HttpError(503, "The desk password has not been set up yet");
  const given = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  const enc = new TextEncoder();
  // Hash both sides so the comparison is constant time and length independent.
  const [a, b] = await Promise.all([given, env.DESK_TOKEN].map((s) => crypto.subtle.digest("SHA-256", enc.encode(s))));
  if (!given || !crypto.subtle.timingSafeEqual(a, b)) throw new HttpError(401, "Wrong desk password");
}

async function leads(request: Request, env: Env, id: string): Promise<Response> {
  const method = request.method;
  if (!id && method === "GET") {
    const { results } = await env.DB.prepare("SELECT * FROM leads ORDER BY created").all<Record<string, unknown>>();
    return Response.json({ leads: results.map(toLead) });
  }
  if (!id && method === "POST") {
    const body = await readJson(request);
    const items = Array.isArray(body) ? body : [body];
    if (!items.length || items.length > MAX_BATCH) throw new HttpError(400, `Send between 1 and ${MAX_BATCH} leads`);
    const now = new Date().toISOString();
    const rows = items.map((item) => {
      const row = clean(item, true);
      if (!row.biz) throw new HttpError(400, "Every lead needs a business name");
      row.id = typeof row.id === "string" && row.id ? row.id : crypto.randomUUID();
      row.status ??= "new";
      row.created = now;
      row.updated = now;
      return row;
    });
    // INSERT OR IGNORE skips a lead whose id or company number is already on the desk.
    const results = await env.DB.batch(rows.map((row) => {
      const cols = Object.keys(row);
      return env.DB.prepare(`INSERT OR IGNORE INTO leads (${cols.map((c) => COLUMNS[c]).join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`)
        .bind(...cols.map((c) => row[c]));
    }));
    const added = results.filter((r) => r.meta.changes > 0).length;
    if (!Array.isArray(body) && !added) throw new HttpError(409, "That company number is already on the desk");
    return Response.json({ added, skipped: rows.length - added }, { status: 201 });
  }
  if (id && method === "PATCH") {
    const patch = clean(await readJson(request), false);
    delete patch.id;
    delete patch.created;
    if ("biz" in patch && !patch.biz) throw new HttpError(400, "A lead needs a business name");
    patch.updated = new Date().toISOString();
    const cols = Object.keys(patch);
    let res: D1Result;
    try {
      res = await env.DB.prepare(`UPDATE leads SET ${cols.map((c) => `${COLUMNS[c]} = ?`).join(", ")} WHERE id = ?`)
        .bind(...cols.map((c) => patch[c]), id).run();
    } catch (e) {
      if (String(e).includes("UNIQUE")) throw new HttpError(409, "Another lead already has that company number");
      throw e;
    }
    if (!res.meta.changes) throw new HttpError(404, "That lead is no longer on the desk");
    return Response.json({ ok: true });
  }
  if (id && method === "DELETE") {
    await env.DB.prepare("DELETE FROM leads WHERE id = ?").bind(id).run();
    return Response.json({ ok: true });
  }
  throw new HttpError(405, "Method not allowed");
}

async function readJson(request: Request): Promise<unknown> {
  try { return await request.json(); } catch { throw new HttpError(400, "Send the lead as JSON"); }
}

// Keeps known fields only, trims text, and rejects values the desk could never produce.
function clean(input: unknown, isNew: boolean): Record<string, string | number | null> {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new HttpError(400, "Each lead must be an object");
  const out: Record<string, string | number | null> = {};
  for (const [field, raw] of Object.entries(input as Record<string, unknown>)) {
    if (!(field in COLUMNS) || raw === undefined) continue;
    if (NUMERIC.has(field)) {
      const n = raw === "" || raw === null ? null : Number(raw);
      if (n !== null && !Number.isFinite(n)) throw new HttpError(400, `${field} must be a number`);
      out[field] = n;
      continue;
    }
    const v = raw === null ? "" : String(raw).trim().slice(0, MAX_TEXT);
    if (field === "status" && !STATUSES.has(v)) throw new HttpError(400, "Unknown status");
    if (field === "ctps" && !CTPS.has(v)) throw new HttpError(400, "Unknown CTPS value");
    if ((field === "nextDate" || field === "lastContact" || field === "incorporated") && !DATE.test(v)) throw new HttpError(400, `${field} must be a date`);
    out[field] = UNIQUE.has(field) && !v ? null : v;
  }
  if (!isNew && !Object.keys(out).length) throw new HttpError(400, "Nothing to change");
  return out;
}

function toLead(row: Record<string, unknown>): Record<string, unknown> {
  const lead: Record<string, unknown> = {};
  for (const [col, v] of Object.entries(row)) {
    const field = FIELD_OF[col];
    if (field) lead[field] = v === null && !NUMERIC.has(field) ? "" : v;
  }
  return lead;
}
