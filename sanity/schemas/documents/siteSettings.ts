import { defineField, defineType } from "sanity";

// Singleton: everything outside the page sections (header, footer, SEO defaults).
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "header", title: "Header" },
    { name: "footer", title: "Footer" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "siteName", type: "string", group: "header" }),
    defineField({ name: "logo", type: "imageWithAlt", group: "header" }),
    defineField({ name: "headerCta", type: "link", group: "header" }),

    defineField({
      name: "wordmark",
      title: "Footer wordmark (2 words)",
      type: "array",
      of: [{ type: "string" }],
      group: "footer",
      validation: (r) => r.length(2),
    }),
    defineField({
      name: "groups",
      title: "Contact groups",
      type: "array",
      group: "footer",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "link", type: "link" }),
            defineField({ name: "description", type: "string" }),
            defineField({ name: "email", type: "string" }),
          ],
          preview: { select: { title: "link.label", subtitle: "email" } },
        },
      ],
    }),
    defineField({ name: "tagline", type: "string", group: "footer" }),
    defineField({ name: "links", type: "array", of: [{ type: "link" }], group: "footer" }),
    defineField({ name: "socials", type: "array", of: [{ type: "link" }], group: "footer" }),
    defineField({ name: "legal", type: "array", of: [{ type: "link" }], group: "footer" }),
    defineField({ name: "copyright", type: "string", group: "footer" }),
    defineField({
      name: "newsletter",
      type: "object",
      group: "footer",
      fields: [
        defineField({ name: "heading", type: "string" }),
        defineField({ name: "consent", type: "text", rows: 3 }),
        defineField({ name: "placeholder", type: "string" }),
        defineField({ name: "submit", type: "string" }),
      ],
    }),

    defineField({ name: "seoTitle", title: "Default title", type: "string", group: "seo" }),
    defineField({
      name: "seoDescription",
      title: "Default description",
      type: "text",
      rows: 3,
      group: "seo",
    }),
    defineField({
      name: "ogImage",
      title: "Social share image (1200x630)",
      type: "image",
      group: "seo",
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
