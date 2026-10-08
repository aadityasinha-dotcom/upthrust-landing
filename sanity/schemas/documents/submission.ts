import { defineField, defineType } from "sanity";

// Written only by POST /api/submit (server-side token). Read-only in the Studio
// so editors can see entries but not forge or edit them.
export const submission = defineType({
  name: "submission",
  title: "Form submission",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "formName", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "consent", type: "boolean" }),
    defineField({ name: "submittedAt", type: "datetime" }),
  ],
  preview: {
    select: { title: "email", subtitle: "submittedAt" },
  },
  orderings: [
    { title: "Newest", name: "newest", by: [{ field: "submittedAt", direction: "desc" }] },
  ],
});
