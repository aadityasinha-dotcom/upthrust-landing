import { defineField, defineType } from "sanity";

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "href",
      type: "string",
      description: "URL, or an anchor like #signup",
      validation: (r) => r.required(),
    }),
  ],
});
