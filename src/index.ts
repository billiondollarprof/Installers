export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  COMPANIES_HOUSE_KEY?: string;
  DESK_TOKEN?: string;
}

export default {
  // Static files in public/ (the demo) are served before this runs.
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      // Proves the D1 binding and schema are in place without revealing any data.
      await env.DB.prepare("SELECT 1 FROM leads LIMIT 1").all();
      return Response.json({ ok: true });
    }

    // The Lead Desk will live at / once it is ported. Until then, send people to the demo.
    if (url.pathname === "/") {
      return Response.redirect(new URL("/demo/", url).toString(), 302);
    }

    return env.ASSETS.fetch(request);
  },

  // The lead finder is not built yet; the weekly cron is a no-op until it is.
  async scheduled(_event: ScheduledController, _env: Env): Promise<void> {
    console.log("finder not built yet");
  },
} satisfies ExportedHandler<Env>;
