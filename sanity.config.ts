import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId, studioBasePath } from "./sanity/env";
import { schemaTypes, singletonTypes } from "./sanity/schemas";

if (!projectId) {
  throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set (see .env.example)");
}

// Embedded Studio config, mounted by app/studio/[[...tool]]/page.tsx.
export default defineConfig({
  name: "upthrust",
  title: "Upthrust",
  projectId,
  dataset,
  basePath: studioBasePath,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Landing page")
              .id("landingPage")
              .child(S.document().schemaType("landingPage").documentId("landingPage")),
            S.listItem()
              .title("Site settings")
              .id("siteSettings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.divider(),
            S.documentTypeListItem("service").title("Services"),
            S.documentTypeListItem("submission").title("Form submissions"),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    // Keep singletons out of the "Create new document" menu.
    templates: (templates) => templates.filter((t) => !singletonTypes.has(t.schemaType)),
  },
  document: {
    // No duplicate/delete/unpublish on singletons.
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? actions.filter(({ action }) => action === "publish" || action === "discardChanges")
        : actions,
  },
  apiVersion,
});
