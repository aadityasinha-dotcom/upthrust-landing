// The single place analytics events are pushed from. GTM reads window.dataLayer;
// @next/third-parties creates it when NEXT_PUBLIC_GTM_ID is set. If GTM isn't
// loaded (no ID, blocked, local dev) the push is a harmless no-op.

export const FORM_SUBMIT_EVENT = "form_submit";

type GtmEvent = {
  event: typeof FORM_SUBMIT_EVENT;
  form_name: string;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function pushEvent(event: GtmEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(event);
}
