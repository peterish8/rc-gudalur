import { ConvexHttpClient } from "convex/browser"

const url = process.env.NEXT_PUBLIC_CONVEX_URL

if (!url) {
  console.warn("NEXT_PUBLIC_CONVEX_URL is not set. The site will show sample content and the contact form is disabled.")
}

/** Shared Convex client for the public site, or null when not configured. */
export const convex: ConvexHttpClient | null = url ? new ConvexHttpClient(url) : null
