import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      description: "Used as the section anchor (#slug)",
      validation: (r) => r.required(),
    }),
    defineField({ name: "eyebrow", type: "string", initialValue: "What can we do for you" }),
    defineField({ name: "lead", type: "text", rows: 3 }),
    defineField({ name: "bullets", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "note", title: "Italic note (optional)", type: "text", rows: 3 }),
    defineField({ name: "bento", title: "Bento image", type: "imageWithAlt" }),
    defineField({ name: "cta", type: "link" }),
  ],
  preview: { select: { title: "title", media: "bento" } },
});
