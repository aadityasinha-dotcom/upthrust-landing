"use client";

// Client component: it owns the form state (values, errors, submitting, success)
// and talks to /api/submit. Markup and classes match the Figma footer form.
import { useId, useState, type FormEvent } from "react";
import { FORM_SUBMIT_EVENT, pushEvent } from "@/lib/gtm";
import { type FieldErrors, fieldErrorsFrom, newsletterSchema } from "@/lib/validation";
import type { FooterContent } from "@/lib/types";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterForm({ content }: { content: FooterContent["newsletter"] }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Client-side validation: same schema as the server, instant feedback.
    const parsed = newsletterSchema.safeParse({ email, consent, website });
    if (!parsed.success) {
      setErrors(fieldErrorsFrom(parsed.error));
      return;
    }
    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json()) as { ok: boolean; errors?: FieldErrors; message?: string };

      if (!res.ok || !data.ok) {
        setErrors(data.errors ?? {});
        setMessage(data.message ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      // Success: clear the form, show the status, then (and only then) tell GTM.
      setEmail("");
      setConsent(false);
      setMessage("Thanks, you're on the list.");
      setStatus("success");
      pushEvent({ event: FORM_SUBMIT_EVENT, form_name: "newsletter" });
    } catch {
      setMessage("Network error. Please try again.");
      setStatus("error");
    }
  }

  const emailId = `${id}-email`;
  const consentId = `${id}-consent`;
  const emailErrorId = `${id}-email-error`;
  const consentErrorId = `${id}-consent-error`;

  return (
    <form
      id="signup"
      aria-labelledby={`${id}-heading`}
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-3.5"
    >
      <h2 id={`${id}-heading`} className="font-medium text-small">
        {content.heading}
      </h2>

      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-2">
          <input
            id={consentId}
            name="consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? consentErrorId : undefined}
            className={`mt-px size-2.5 shrink-0 appearance-none border border-white checked:bg-white ${focusRing}`}
          />
          <label htmlFor={consentId} className="text-fine">
            {content.consent}
          </label>
        </div>
        {errors.consent && (
          <p id={consentErrorId} className="text-fine text-primary">
            {errors.consent}
          </p>
        )}
      </div>

      <div className="flex flex-col items-start gap-2.5">
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={content.placeholder}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? emailErrorId : undefined}
          className={`w-full max-w-md bg-transparent text-small placeholder:text-muted ${focusRing}`}
        />
        {errors.email && (
          <p id={emailErrorId} className="text-fine text-primary">
            {errors.email}
          </p>
        )}

        {/* Honeypot: visually hidden, excluded from the tab order and from screen readers. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor={`${id}-website`}>Website</label>
          <input
            id={`${id}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className={`text-small disabled:opacity-60 ${focusRing}`}
        >
          {status === "submitting" ? "Submitting…" : content.submit}
        </button>
      </div>

      {/* Announced by screen readers when it changes. */}
      <p role="status" aria-live="polite" className="text-small">
        {status === "success" || status === "error" ? message : ""}
      </p>
    </form>
  );
}
