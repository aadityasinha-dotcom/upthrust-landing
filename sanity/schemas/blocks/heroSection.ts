import { defineField, defineType } from "sanity";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "headlineLines",
      title: "Headline (3 lines)",
      type: "array",
      of: [{ type: "string" }],
      validation: (r) => r.required().length(3),
    }),
    defineField({ name: "strategy", title: "Annotation: strategy", type: "string" }),
    defineField({ name: "comfortable", title: "Annotation: comfortable", type: "string" }),
    defineField({
      name: "identity",
      title: "Annotation: identity (3 words)",
      type: "array",
      of: [{ type: "string" }],
      validation: (r) => r.length(3),
    }),
    defineField({ name: "bust", title: "Bust image", type: "imageWithAlt" }),
  ],
  preview: {
    select: { lines: "headlineLines" },
    prepare: ({ lines }) => ({ title: "Hero", subtitle: (lines ?? []).join(" ") }),
  },
});
