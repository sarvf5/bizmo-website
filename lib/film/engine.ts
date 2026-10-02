/**
 * Scroll film engine.
 *
 * A film is a list of beats laid end to end along the scroll. Each beat lasts `len` viewport
 * heights and describes up to two picture layers (for crossfades) plus a virtual camera move.
 * The canvas is redrawn every animation frame from the scroll position, so scrolling backwards
 * plays everything in reverse for free.
 */

export type ClipId = "hero" | "turn" | "explode" | "layers" | "camera" | "edge" | "logo";

export type Manifest = {
  version: number;
  fps: number;
  pattern: string;
  pad: number;
  sets: Record<"lg" | "sm", number>;
  clips: Record<ClipId, { count: number }>;
};

/** Virtual camera. x/y move the frame centre (fraction of viewport), s scales it (1 = cover). */
export type Cam = { x: number; y: number; s: number };

/** A picture layer inside a beat. `t` runs 0..1 through the clip; "loop" plays by wall-clock time. */
export type Layer = {
  clip: ClipId;
  t0: number | "loop" | "mouse";
  t1?: number;
  a0?: number; // opacity at beat start
  a1?: number; // opacity at beat end
};

export type Beat = {
  id: string;
  len: number;
  layers: Layer[];
  cam0: Cam;
  cam1?: Cam;
  ease?: (k: number) => number;
  /** the pointer steers the camera slightly (parallax) during this beat */
  parallax?: boolean;
};

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const smooth = (k: number) => {
  const x = clamp01(k);
  return x * x * (3 - 2 * x);
};
export const easeInOut = (k: number) => {
  const x = clamp01(k);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
export const easeOut = (k: number) => 1 - Math.pow(1 - clamp01(k), 3);

export function timeline(beats: Beat[]) {
  const starts: number[] = [];
  let acc = 0;
  for (const b of beats) {
    starts.push(acc);
    acc += b.len;
  }
  const total = acc;
  const start = (id: string) => starts[beats.findIndex((b) => b.id === id)] ?? 0;
  const end = (id: string) => {
    const i = beats.findIndex((b) => b.id === id);
    return i < 0 ? 0 : starts[i] + beats[i].len;
  };
  function at(pos: number) {
    const p = Math.min(Math.max(pos, 0), total - 1e-6);
    let i = beats.length - 1;
    while (i > 0 && p < starts[i]) i--;
    const b = beats[i];
    const raw = b.len ? (p - starts[i]) / b.len : 1;
    const k = (b.ease ?? easeInOut)(raw);
    const c1 = b.cam1 ?? b.cam0;
    const cam: Cam = { x: lerp(b.cam0.x, c1.x, k), y: lerp(b.cam0.y, c1.y, k), s: lerp(b.cam0.s, c1.s, k) };
    return { beat: b, raw: clamp01(raw), k, cam };
  }
  return { beats, total, start, end, at };
}

/* ------------------------------------------------------------------ pointer */

/** Shared pointer state (0..1 across the viewport). `moved` is the time of the last real movement. */
export const pointer = { x: 0.5, y: 0.5, moved: -1e9, installed: false };
export function trackPointer() {
  if (pointer.installed || typeof window === "undefined") return;
  pointer.installed = true;
  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType === "touch") return;
      pointer.x = e.clientX / Math.max(1, innerWidth);
      pointer.y = e.clientY / Math.max(1, innerHeight);
      pointer.moved = performance.now();
    },
    { passive: true },
  );
}

/* ------------------------------------------------------------------ manifest */

let manifestPromise: Promise<Manifest | null> | null = null;
export function loadManifest() {
  manifestPromise ??= fetch("/film/manifest.json")
    .then((r) => (r.ok ? (r.json() as Promise<Manifest>) : null))
    .catch(() => null);
  return manifestPromise;
}

/* ------------------------------------------------------------------ frame store */

/**
 * Loads frames as <img> elements (the browser keeps decoded copies around and evicts under
 * memory pressure, which is what we want for ~900 frames). Order: first and last frame of
 * every clip, then every 4th frame, then everything, nearest to the playhead first.
 */
export class FrameStore {
  private imgs = new Map<string, HTMLImageElement>();
  private ready = new Set<string>();
  private queue: string[] = [];
  private queued = new Set<string>();
  private active = 0;
  private dead = false;
  private focus: { clip: ClipId; i: number } | null = null;
  loaded = 0;
  total = 0;

  constructor(
    private m: Manifest,
    private set: "lg" | "sm",
    private clips: ClipId[],
    private concurrency = 6,
  ) {
    for (const c of clips) this.total += m.clips[c].count;
  }

  count(clip: ClipId) {
    return this.m.clips[clip].count;
  }

  private url(clip: ClipId, i: number) {
    return this.m.pattern
      .replace("{set}", this.set)
      .replace("{clip}", clip)
      .replace("{index}", String(i).padStart(this.m.pad, "0")) + `?v=${this.m.version}`;
  }

  start() {
    for (const c of this.clips) {
      this.enqueue(c, 0);
      this.enqueue(c, this.count(c) - 1);
    }
    for (const c of this.clips) for (let i = 4; i < this.count(c) - 1; i += 4) this.enqueue(c, i);
    for (const c of this.clips) for (let i = 1; i < this.count(c) - 1; i++) if (i % 4) this.enqueue(c, i);
    this.pump();
  }

  /** Move frames near the playhead to the front of the queue. */
  want(clip: ClipId, i: number) {
    if (this.focus && this.focus.clip === clip && Math.abs(this.focus.i - i) < 3) return;
    this.focus = { clip, i };
    const near: string[] = [];
    for (let d = -6; d <= 12; d++) {
      const j = i + d;
      if (j < 0 || j >= this.count(clip)) continue;
      const k = `${clip}:${j}`;
      if (!this.imgs.has(k)) near.push(k);
    }
    if (near.length) {
      this.queue = near.concat(this.queue.filter((k) => !near.includes(k)));
      near.forEach((k) => this.queued.add(k));
      this.pump();
    }
  }

  private enqueue(clip: ClipId, i: number) {
    const k = `${clip}:${i}`;
    if (this.queued.has(k) || this.imgs.has(k)) return;
    this.queued.add(k);
    this.queue.push(k);
  }

  private pump() {
    while (!this.dead && this.active < this.concurrency && this.queue.length) {
      const k = this.queue.shift()!;
      if (this.imgs.has(k)) continue;
      const [clip, idx] = k.split(":") as [ClipId, string];
      const img = new Image();
      img.decoding = "async";
      this.imgs.set(k, img);
      this.active++;
      const done = (ok: boolean) => {
        this.active--;
        if (ok) {
          this.ready.add(k);
          this.loaded++;
          window.dispatchEvent(new CustomEvent("film:progress", { detail: { key: this.clips[0], loaded: this.loaded, total: this.total } }));
        } else this.imgs.delete(k);
        this.pump();
      };
      img.onload = () => done(true);
      img.onerror = () => done(false);
      img.src = this.url(clip, Number(idx));
    }
  }

  /** Exact frame if loaded, otherwise the nearest loaded frame of the same clip. */
  get(clip: ClipId, i: number): HTMLImageElement | null {
    const exact = `${clip}:${i}`;
    if (this.ready.has(exact)) return this.imgs.get(exact)!;
    const n = this.count(clip);
    for (let d = 1; d < n; d++) {
      const a = `${clip}:${i - d}`;
      if (i - d >= 0 && this.ready.has(a)) return this.imgs.get(a)!;
      const b = `${clip}:${i + d}`;
      if (i + d < n && this.ready.has(b)) return this.imgs.get(b)!;
    }
    return null;
  }

  destroy() {
    this.dead = true;
    for (const img of this.imgs.values()) {
      img.onload = img.onerror = null;
      img.src = "";
    }
    this.imgs.clear();
    this.ready.clear();
  }
}

/* ------------------------------------------------------------------ drawing */

export const STAGE = "#000000"; // film frames are graded to pure black for this edition (scripts/frames.mjs GRADE=black)

export type View = { W: number; H: number; mobile: boolean };

/**
 * Where a 16:9 frame lands on screen for a given camera.
 * Desktop: s = 1 is "cover". Phones (portrait): the frame is fitted to the width and
 * zoomed so the device fills most of it, sitting in the upper part of the screen.
 */
export function placement(view: View, fw: number, fh: number, cam: Cam) {
  const { W, H, mobile } = view;
  let scale: number;
  let cx: number;
  let cy: number;
  if (mobile) {
    scale = (W / fw) * 1.42 * cam.s;
    cx = W / 2;
    cy = H * 0.36 + cam.y * H * 0.3;
  } else {
    scale = Math.max(W / fw, H / fh) * cam.s;
    cx = W / 2 + cam.x * W;
    cy = H / 2 + cam.y * H;
  }
  const dw = fw * scale;
  const dh = fh * scale;
  return { dx: cx - dw / 2, dy: cy - dh / 2, dw, dh };
}

/** Frame-space point (0..1) to screen pixels. */
export function project(p: ReturnType<typeof placement>, u: number, v: number) {
  return { x: p.dx + u * p.dw, y: p.dy + v * p.dh };
}

/** Draw a frame plus a soft feather so its edges melt into the stage colour. */
export function drawFrame(ctx: CanvasRenderingContext2D, img: HTMLImageElement, p: ReturnType<typeof placement>, alpha: number) {
  if (alpha <= 0.001) return;
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, p.dx, p.dy, p.dw, p.dh);
  ctx.globalAlpha = 1;
}

export function feather(ctx: CanvasRenderingContext2D, p: ReturnType<typeof placement>, W: number, H: number) {
  const f = Math.min(p.dw, p.dh) * 0.12;
  const edges: [number, number, number, number, number, number, number, number][] = [
    [p.dx, 0, p.dx + f, 0, p.dx - 1, p.dy, f + 1, p.dh], // left
    [p.dx + p.dw, 0, p.dx + p.dw - f, 0, p.dx + p.dw - f, p.dy, f + 1, p.dh], // right
    [0, p.dy, 0, p.dy + f, p.dx, p.dy - 1, p.dw, f + 1], // top
    [0, p.dy + p.dh, 0, p.dy + p.dh - f, p.dx, p.dy + p.dh - f, p.dw, f + 1], // bottom
  ];
  for (const [x0, y0, x1, y1, rx, ry, rw, rh] of edges) {
    if (rx > W || ry > H || rx + rw < 0 || ry + rh < 0) continue;
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, "rgba(0,0,0,1)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(rx, ry, rw, rh);
  }
  // fill anything outside the frame
  ctx.fillStyle = STAGE;
  if (p.dx > 0) ctx.fillRect(0, 0, Math.ceil(p.dx), H);
  if (p.dx + p.dw < W) ctx.fillRect(Math.floor(p.dx + p.dw), 0, W, H);
  if (p.dy > 0) ctx.fillRect(0, 0, W, Math.ceil(p.dy));
  if (p.dy + p.dh < H) ctx.fillRect(0, Math.floor(p.dy + p.dh), W, H);
}
