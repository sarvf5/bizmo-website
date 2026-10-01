"use client";

import { useState, type FormEvent } from "react";
import { notify } from "@/lib/content";

type Field = "name" | "email" | "city";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Notify() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [firstName, setFirstName] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<Field | "company", string>;
    const next: Partial<Record<Field, string>> = {};
    if (!data.name?.trim()) next.name = notify.errors.name;
    if (!EMAIL.test(data.email?.trim() ?? "")) next.email = notify.errors.email;
    if (!data.city?.trim()) next.city = notify.errors.city;
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLInputElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    setState("sending");
    try {
      const r = await fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!r.ok) throw new Error(String(r.status));
      setFirstName(data.name.trim());
      setState("done");
    } catch {
      setState("error");
    }
  }

  const input =
    "mt-2 block w-full rounded-none border-0 border-b border-white/25 bg-transparent px-0 py-3 text-[1.15rem] text-white placeholder:text-white/30 transition-colors focus:border-cyan focus:ring-0 focus:outline-none aria-[invalid=true]:border-[#ff8a8a]";

  return (
    <section id="notify" aria-labelledby="notify-title" className="relative overflow-hidden bg-night">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -end-[10%] top-[10%] h-[70%] w-[60%] bg-[radial-gradient(closest-side,rgb(4_99_239/0.2),transparent)]" />
      </div>
      <div className="wrap relative grid gap-14 py-28 md:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] md:gap-20 md:py-44">
        <div className="max-w-[34rem]">
          <p className="act" data-reveal>
            Act VIII <span className="px-2 text-dim">/</span> Launch
          </p>
          <h2 id="notify-title" className="display display-lg mt-8 text-white" data-reveal-lines>
            <span className="line-mask">
              <span>Bizmo is entering</span>
            </span>
            <span className="line-mask">
              <span style={{ ["--d" as string]: "0.12s" }}>
                production now<span className="bizmo-dot" aria-hidden="true" />
                <span className="sr-only">.</span>
              </span>
            </span>
          </h2>
          <p className="lede mt-8 text-aluminium/70" data-reveal>
            {notify.body}
          </p>
        </div>

        <div className="max-w-[32rem] md:pt-3">
          {state === "done" ? (
            <div role="status" className="border-t border-white/15 pt-8">
              <span aria-hidden="true" className="mb-6 block h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-cobalt to-cyan" />
              <p className="font-display text-[1.75rem] leading-snug text-white">{notify.done(firstName)}</p>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="grid gap-7">
              {(["name", "email", "city"] as Field[]).map((f) => (
                <div key={f}>
                  <label htmlFor={`f-${f}`} className="text-[0.92rem] text-aluminium/75">
                    {notify.fields[f]}
                  </label>
                  <input
                    id={`f-${f}`}
                    name={f}
                    type={f === "email" ? "email" : "text"}
                    autoComplete={f === "name" ? "name" : f === "email" ? "email" : "address-level2"}
                    inputMode={f === "email" ? "email" : undefined}
                    maxLength={f === "email" ? 254 : 120}
                    aria-invalid={errors[f] ? true : undefined}
                    aria-describedby={errors[f] ? `e-${f}` : undefined}
                    className={input}
                  />
                  {errors[f] && (
                    <p id={`e-${f}`} className="mt-2 text-[0.88rem] text-[#ffb0b0]">
                      {errors[f]}
                    </p>
                  )}
                </div>
              ))}
              {/* spam trap: people never see or fill this */}
              <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
                <label>
                  Company
                  <input name="company" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
                <button type="submit" disabled={state === "sending"} className="btn btn-cobalt min-w-[10rem]">
                  {state === "sending" ? notify.sending : notify.button}
                </button>
                <p className="text-[0.85rem] text-mist">{notify.privacy}</p>
              </div>
              {state === "error" && (
                <p role="alert" className="text-[0.92rem] text-[#ffb0b0]">
                  {notify.errors.server}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
