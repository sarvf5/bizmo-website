import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

/**
 * Launch sign-ups.
 * Production: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see supabase/schema.sql).
 * Development without those: rows are appended to .data/signups.jsonl.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  // spam trap filled in: pretend it worked
  if (clean(body.company, 200)) return Response.json({ ok: true });

  const row = {
    name: clean(body.name, 120),
    email: clean(body.email, 254).toLowerCase(),
    city: clean(body.city, 120),
    user_agent: clean(req.headers.get("user-agent"), 300),
  };
  if (!row.name || !row.city || !EMAIL.test(row.email)) return Response.json({ error: "Missing or invalid fields" }, { status: 422 });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    const r = await fetch(`${url.replace(/\/$/, "")}/rest/v1/launch_signups?on_conflict=email`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(row),
    });
    if (!r.ok) {
      console.error("notify: supabase insert failed", r.status, await r.text());
      return Response.json({ error: "Could not save" }, { status: 502 });
    }
    return Response.json({ ok: true });
  }

  if (process.env.NODE_ENV === "production") {
    console.error("notify: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set");
    return Response.json({ error: "Sign-up storage is not configured" }, { status: 503 });
  }
  const dir = join(process.cwd(), ".data");
  await mkdir(dir, { recursive: true });
  await appendFile(join(dir, "signups.jsonl"), JSON.stringify({ ...row, created_at: new Date().toISOString() }) + "\n");
  return Response.json({ ok: true, stored: "local" });
}
