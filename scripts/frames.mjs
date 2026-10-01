/**
 * Turns the film clips in media-src/ into the scroll image sequences.
 *
 *   npm run frames
 *
 * media-src/<clip>.mp4  ->  public/film/<set>/<clip>/0000.webp  (+ public/film/manifest.json)
 *
 * Two sets: "lg" for screens wider than 900px, "sm" for phones.
 * Uses ffmpeg from the optional ffmpeg-static package if it installed, otherwise ffmpeg on PATH.
 * Frames are written to a staging folder first and only replace public/film when every clip succeeded.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(import.meta.url);
let FFMPEG = "ffmpeg";
try {
  const p = require("ffmpeg-static");
  if (p && existsSync(p)) FFMPEG = p;
} catch {}

const ROOT = process.cwd();
const SRC = join(ROOT, "media-src");
const OUT = join(ROOT, "public", "film");
const FPS = Number(process.env.FPS ?? 24);
const QUALITY = Number(process.env.QUALITY ?? 74);
const SETS = { lg: 1600, sm: 960 };
export const CLIPS = ["hero", "turn", "explode", "layers", "camera", "edge", "logo"];

const run = (args) => execFileSync(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });

const missing = CLIPS.filter((c) => !existsSync(join(SRC, `${c}.mp4`)));
if (missing.length) {
  console.error(`Missing clips in media-src/: ${missing.map((c) => `${c}.mp4`).join(", ")}`);
  process.exit(1);
}

const stage = join(ROOT, "public", `film-staging-${Date.now()}`);
const clips = {};
let total = 0;

for (const [set, width] of Object.entries(SETS)) {
  for (const clip of CLIPS) {
    const dir = join(stage, set, clip);
    mkdirSync(dir, { recursive: true });
    run(["-i", join(SRC, `${clip}.mp4`), "-an", "-vf", `fps=${FPS},scale=${width}:-2:flags=lanczos`, "-c:v", "libwebp", "-quality", String(QUALITY), "-compression_level", "5", "-start_number", "0", join(dir, "%04d.webp")]);
    const files = readdirSync(dir).filter((f) => f.endsWith(".webp"));
    const bytes = files.reduce((s, f) => s + statSync(join(dir, f)).size, 0);
    total += bytes;
    clips[clip] = { count: files.length };
    console.log(`${set}/${clip}: ${files.length} frames, ${(bytes / 1e6).toFixed(1)} MB`);
  }
}

// Stills for the reduced-motion layout and for the first paint: first and last frame of every clip.
mkdirSync(join(stage, "stills"), { recursive: true });
for (const clip of CLIPS) {
  const src = join(SRC, `${clip}.mp4`);
  run(["-i", src, "-frames:v", "1", "-vf", "scale=1600:-2:flags=lanczos", "-c:v", "libwebp", "-quality", "82", join(stage, "stills", `${clip}-first.webp`)]);
  run(["-sseof", "-0.08", "-i", src, "-update", "1", "-frames:v", "1", "-vf", "scale=1600:-2:flags=lanczos", "-c:v", "libwebp", "-quality", "82", join(stage, "stills", `${clip}-last.webp`)]);
}

writeFileSync(
  join(stage, "manifest.json"),
  JSON.stringify({ version: Date.now(), fps: FPS, pattern: "/film/{set}/{clip}/{index}.webp", pad: 4, sets: SETS, clips }, null, 2),
);

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
renameSync(stage, OUT);
console.log(`done: ${(total / 1e6).toFixed(1)} MB across both sets -> public/film`);
