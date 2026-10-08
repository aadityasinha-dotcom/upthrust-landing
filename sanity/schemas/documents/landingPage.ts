import { defineField, defineType } from "sanity";

// Singleton. The sections array is what gets rendered by <SectionRenderer/>:
// adding a new section type = schema here + one component + one case there.
export const landingPage = defineType({
  name: "landingPage",
  title: "Landing page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", initialValue: "Home" }),
    defineField({
      name: "sections",
      type: "array",
      of: [{ type: "heroSection" }, { type: "logoStripSection" }, { type: "servicesSection" }],
    }),
    defineField({
      name: "seo",
      type: "object",
      fields: [
        defineField({ name: "title", type: "string" }),
        defineField({ name: "description", type: "text", rows: 3 }),
      ],
    }),
  ],
});
