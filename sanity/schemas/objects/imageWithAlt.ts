import { defineField, defineType } from "sanity";

// Every content image carries its own alt text so editors own accessibility.
export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the image for screen readers. Leave empty only if purely decorative.",
    }),
  ],
});
