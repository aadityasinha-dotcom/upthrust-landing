import { z } from "zod";

// One schema, used by the form (client) and /api/submit (server). The server
// never trusts the client, so it re-runs the same validation.
export const newsletterSchema = z.object({
  email: z.string().trim().min(1, "Enter your email address").email("Enter a valid email address"),
  consent: z.literal(true, { message: "Please tick the box to subscribe" }),
  // Honeypot: a field humans never see or fill. Bots that auto-fill every input
  // put something here, and we silently drop the submission.
  website: z.string().max(0).optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

// Flattened field errors in a shape the form can render next to each input.
export type FieldErrors = Partial<Record<"email" | "consent", string>>;

export function fieldErrorsFrom(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if ((field === "email" || field === "consent") && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}
