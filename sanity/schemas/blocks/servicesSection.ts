import { defineField, defineType } from "sanity";

// The "repeated content" block: an ordered list of references to service documents.
export const servicesSection = defineType({
  name: "servicesSection",
  title: "Services",
  type: "object",
  fields: [
    defineField({
      name: "services",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: {
    select: { count: "services.length" },
    prepare: ({ count }) => ({ title: "Services", subtitle: `${count ?? 0} panels` }),
  },
});
