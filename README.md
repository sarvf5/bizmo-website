# bizmousa.com

The Bizmo launch website: a cinematic scroll film of the device, the approved apps, the speed story, specifications, comparison and the launch sign-up.

Next.js 16, React 19, Tailwind CSS v4, Lenis for smooth scrolling. No other runtime dependencies.

```bash
npm install
npm run dev        # http://localhost:3000
```

## How the page works

| Section | File | What it does |
|---|---|---|
| Film A, "How it works" | `components/film/films.tsx` → `DeviceFilm` | Hero loop, turn to the back, hardware explode with spec callouts, software layers |
| Apps | `components/sections/Apps.tsx` | About 190 apps by category (keyboard-accessible tabs), plus "Not on Bizmo" |
| Speed | `components/sections/Speed.tsx` | Scroll-driven diagram: filter-server detour versus direct |
| Film B, "Specifications" | `films.tsx` → `DetailFilm` | Camera lens close-up, edge reveal, confirmed specs |
| Compare | `components/sections/Compare.tsx` | Real `<table>` on desktop, stacked list on phones |
| Film C, certification | `films.tsx` → `TrustFilm` | Engraved logo macro with Vaad HaKehilos / Safe Telecom |
| Who it's for | `components/sections/Audience.tsx` | Replacement wording, roles, front/back render |
| Sign-up | `components/sections/Notify.tsx` + `app/api/notify/route.ts` | Name, email, city |

**All copy is in `lib/content.ts`.** The facts rule from Joel's handover is at the top of that file: only publish what is on the handover's Publish list.

### The scroll films

`lib/film/engine.ts` and `components/film/ScrollFilm.tsx`.

- Each film is a pinned section. Its scroll length is a list of **beats** (`timeline([...])` in `films.tsx`), measured in screen heights.
- A beat plays part of a clip (`t0` → `t1`), can crossfade two clips (`a0`/`a1` opacity), and moves a **virtual camera** (`cam0` → `cam1`: `x`/`y` shift, `s` scale, where 1 = cover).
- Copy blocks fade in and out at scroll positions (`in`/`out`). Callouts are pinned to points on the frame (`u`/`v`, 0–1), so they follow the camera.
- Frames load in order: first/last frame of each clip, then every 4th, then the rest, with frames near the playhead first.
- Phones get a lighter frame set (`sm`, 960 px) and a portrait layout with the device at the top and copy below. Callouts are hidden on phones.
- **Reduced motion** (system setting, or `?motion=off`): the films become still images with the same copy in normal flow, and smooth scrolling is off.

### Replacing or adding footage

1. Put the clips in `media-src/` with these names: `hero`, `turn`, `explode`, `layers`, `camera`, `edge`, `logo` (`.mp4`, 16:9).
2. Run `npm run frames`. It writes `public/film/{lg,sm}/<clip>/0000.webp…`, stills and `manifest.json`. It uses the `ffmpeg-static` package if it installed, otherwise `ffmpeg` on your PATH.
3. If a clip's composition changes, re-check the callout positions (`u`, `v`) in `films.tsx`.

The current clips are concept footage generated with Nano Banana Pro (end frames) and Kling 3.0 Pro (motion), starting from the studio renders. The prompts and the generator script are in the handover kit's `05-ai-animation` folder.

## Sign-up storage

- **Development** (`npm run dev`) without settings: sign-ups are appended to `.data/signups.jsonl`.
- **Production:** create the table with `supabase/schema.sql`, then set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (see `.env.example`). Without them, the production API answers 503 so nothing is silently lost.
- Duplicate emails are merged. A hidden "company" field catches simple spam bots.

## Before launch

- The site is `noindex` until `ALLOW_INDEXING=1` is set in the production environment.
- RTL: the layout uses logical properties. For the Yiddish/Hebrew version set `<html lang="yi" dir="rtl">` in `app/layout.tsx`. IBM Plex Sans Hebrew is already loaded; the display face Frank Ruhl Libre has Hebrew too.
- Deploys to Vercel as-is (the sign-up route needs a server, so don't use a static export).

## Open items for Joel

- The film footage is AI-generated concept footage. The exploded view invents internal parts, and some frames have small flickers. It needs approval, or a studio render, before launch.
- The engraved logo in the AI shots is close to the real logo but not pixel-exact. The logo files in `public/brand` are the supplied originals.
- The app list in `lib/content.ts` shows a selection of names per category. Category counts add up to 190, per the approved list of 2 July 2025.
