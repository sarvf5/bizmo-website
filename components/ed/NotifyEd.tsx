"use client";

import { useState, type FormEvent } from "react";
import { ed, notify } from "@/lib/content";

type Field = "name" | "email" | "city";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function NotifyEd() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [first, setFirst] = useState("");

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
      setFirst(data.name.trim());
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <section id="notify" data-surface="light" aria-labelledby="notify-title" className="bg-white py-24 md:py-36">
      <div className="wrap text-center">
        <h2 id="notify-title" className="t-h1 mx-auto max-w-[44rem]" data-reveal>
          {notify.title}
        </h2>
        <p className="t-intro mx-auto mt-5 max-w-[34rem] text-ink-2" data-reveal style={{ ["--d" as string]: "0.08s" }}>
          {notify.body}
        </p>

        <div className="mx-auto mt-12 max-w-[30rem] text-start" data-reveal style={{ ["--d" as string]: "0.14s" }}>
          {state === "done" ? (
            <p role="status" className="tile bg-canvas p-8 text-center text-[21px] font-semibold tracking-[-0.02em]">
              {notify.done(first)}
            </p>
          ) : (
            <form noValidate onSubmit={onSubmit} className="grid gap-3">
              {(["name", "email", "city"] as Field[]).map((f) => (
                <div key={f}>
                  <div className="relative">
                    <input
                      id={`n-${f}`}
                      name={f}
                      type={f === "email" ? "email" : "text"}
                      placeholder=" "
                      autoComplete={f === "name" ? "name" : f === "email" ? "email" : "address-level2"}
                      maxLength={f === "email" ? 254 : 120}
                      aria-invalid={errors[f] ? true : undefined}
                      aria-describedby={errors[f] ? `ne-${f}` : undefined}
                      className="peer block h-14 w-full rounded-xl border border-ink-3/60 bg-white px-4 pt-5 text-[17px] text-ink outline-none transition-[border-color,box-shadow] focus:border-blue focus:shadow-[0_0_0_4px_rgb(4_99_239/0.15)] aria-[invalid=true]:border-[#e30000]"
                    />
                    <label
                      htmlFor={`n-${f}`}
                      className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[17px] text-ink-3 transition-all duration-200 peer-focus:top-[14px] peer-focus:text-[12px] peer-[:not(:placeholder-shown)]:top-[14px] peer-[:not(:placeholder-shown)]:text-[12px]"
                    >
                      {notify.fields[f]}
                    </label>
                  </div>
                  {errors[f] && (
                    <p id={`ne-${f}`} className="mt-1.5 ps-1 text-[13px] text-[#e30000]">
                      {errors[f]}
                    </p>
                  )}
                </div>
              ))}
              <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
                <label>
                  Company
                  <input name="company" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <button type="submit" disabled={state === "sending"} className="btn btn-blue mt-3 w-full">
                {state === "sending" ? notify.sending : ed.cta}
              </button>
              <p className="t-small mt-1 text-center text-ink-3">{notify.privacy}</p>
              {state === "error" && (
                <p role="alert" className="text-center text-[14px] text-[#e30000]">
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
