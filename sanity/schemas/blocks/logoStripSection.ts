import { defineField, defineType } from "sanity";

export const logoStripSection = defineType({
  name: "logoStripSection",
  title: "Logo strip",
  type: "object",
  fields: [
    defineField({ name: "stat", type: "string", validation: (r) => r.required() }),
    defineField({ name: "caption", type: "text", rows: 2 }),
    defineField({
      name: "logos",
      type: "array",
      of: [{ type: "imageWithAlt" }],
    }),
  ],
  preview: {
    select: { stat: "stat", caption: "caption" },
    prepare: ({ stat, caption }) => ({ title: `Logo strip: ${stat ?? ""}`, subtitle: caption }),
  },
});
