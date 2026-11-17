import { convex } from "./convex"
import type { ConvexHttpClient } from "convex/browser"

const TIMEOUT_MS = 8000

/**
 * Runs a Convex read and returns its rows. Falls back to `fallback()` (see
 * lib/mock-data.ts) when Convex isn't configured, the request errors or
 * times out, or it returns no rows, so public sections never render empty.
 * Failures are logged with the section `label` instead of being swallowed.
 */
export async function loadWithFallback<T>(
  label: string,
  query: (client: ConvexHttpClient) => Promise<T[]>,
  fallback: () => T[],
): Promise<T[]> {
  if (!convex) {
    console.warn(`[${label}] NEXT_PUBLIC_CONVEX_URL is not set; showing sample content.`)
    return fallback()
  }

  try {
    let timer: ReturnType<typeof setTimeout> | undefined
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`timed out after ${TIMEOUT_MS}ms`)), TIMEOUT_MS)
    })
    const rows = await Promise.race([query(convex), timeout]).finally(() => clearTimeout(timer))

    if (!rows || rows.length === 0) {
      console.warn(`[${label}] Convex returned no rows; showing sample content.`)
      return fallback()
    }
    return rows
  } catch (err) {
    console.error(`[${label}] Convex request failed; showing sample content.`, err)
    return fallback()
  }
}
