import { sendGAEvent } from "@next/third-parties/google";

// Custom GA4 events for interactions enhanced measurement can't see:
// project modals, mailto:/tel: links and the copy-email button.
export type ContactMethod = "email" | "call" | "whatsapp";
export type ContactLocation = "contact_section" | "contact_dock";

export function trackProjectOpen(slug: string, name: string) {
  sendGAEvent("event", "project_open", { project_slug: slug, project_name: name });
}

export function trackContactClick(method: ContactMethod, location: ContactLocation) {
  sendGAEvent("event", "contact_click", { method, location });
}

export function trackEmailCopy() {
  sendGAEvent("event", "email_copy", { location: "contact_section" });
}
