import { heroSection } from "./blocks/heroSection";
import { logoStripSection } from "./blocks/logoStripSection";
import { servicesSection } from "./blocks/servicesSection";
import { landingPage } from "./documents/landingPage";
import { service } from "./documents/service";
import { siteSettings } from "./documents/siteSettings";
import { submission } from "./documents/submission";
import { imageWithAlt } from "./objects/imageWithAlt";
import { link } from "./objects/link";

export const schemaTypes = [
  // objects
  link,
  imageWithAlt,
  // blocks (section types inside landingPage.sections)
  heroSection,
  logoStripSection,
  servicesSection,
  // documents
  siteSettings,
  landingPage,
  service,
  submission,
];

// Documents that exist exactly once. Hidden from "create new" and pinned in the sidebar.
export const singletonTypes = new Set(["siteSettings", "landingPage"]);
