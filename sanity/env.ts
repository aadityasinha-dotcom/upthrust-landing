// Public Sanity config. Safe in the browser (the embedded Studio needs it).
// The write token is NOT here: it is read only inside server code (api routes, seed).
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
// Pin the API version so query behaviour doesn't change under us.
export const apiVersion = "2025-10-01";
export const studioBasePath = "/studio";

export const isSanityConfigured = Boolean(projectId);
