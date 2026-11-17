/**
 * Seeds an EMPTY Convex deployment with the starter content from lib/mock-data.ts.
 * Images in public/ are uploaded to Convex storage so the admin panel can show them too.
 *
 * Usage (Node 23.6+ runs TypeScript directly):
 *   NEXT_PUBLIC_CONVEX_URL=... ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/seed-convex.mts
 *
 * Refuses to run if the deployment already has events, board members or ads.
 */
import { readFile } from "node:fs/promises"
import { extname, join } from "node:path"
import { ConvexHttpClient } from "convex/browser"
import { anyApi as api } from "convex/server"
import { getMockPastEvents, getMockUpcomingEvents, MOCK_BOARD_MEMBERS, MOCK_COMMUNITY_ADS } from "../lib/mock-data.ts"

const { NEXT_PUBLIC_CONVEX_URL: url, ADMIN_EMAIL: email, ADMIN_PASSWORD: password } = process.env
if (!url || !email || !password) {
  console.error("Set NEXT_PUBLIC_CONVEX_URL, ADMIN_EMAIL and ADMIN_PASSWORD.")
  process.exit(1)
}

const client = new ConvexHttpClient(url)
const { token } = await client.mutation(api.auth.login, { email, password })

const overview = await client.query(api.dashboard.overview, { token })
const c = overview.counts
if (c.eventsTotal + c.membersTotal + c.adsTotal > 0) {
  console.error(`Deployment already has data (${c.eventsTotal} events, ${c.membersTotal} members, ${c.adsTotal} ads). Not seeding.`)
  process.exit(1)
}

const MIME: Record<string, string> = { ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg" }
const uploaded = new Map<string, string>()

/** Uploads public/<path> once and returns its Convex storage URL. */
async function upload(publicPath: string): Promise<string> {
  const cached = uploaded.get(publicPath)
  if (cached) return cached
  const bytes = await readFile(join(process.cwd(), "public", publicPath))
  const uploadUrl: string = await client.mutation(api.files.generateUploadUrl, { token })
  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": MIME[extname(publicPath)] ?? "application/octet-stream" },
    body: bytes,
  })
  if (!res.ok) throw new Error(`Upload of ${publicPath} failed: ${res.status}`)
  const { storageId } = await res.json()
  const fileUrl: string = await client.mutation(api.files.getUrl, { token, storageId })
  uploaded.set(publicPath, fileUrl)
  console.log(`uploaded ${publicPath}`)
  return fileUrl
}

for (const e of [...getMockUpcomingEvents(), ...getMockPastEvents()]) {
  await client.mutation(api.events.create, {
    token,
    title: e.title,
    description: e.description,
    event_date: e.event_date,
    image_url: e.image_url ? await upload(e.image_url) : null,
    extra_images: e.extra_images ? await Promise.all(e.extra_images.map(upload)) : null,
    is_upcoming: e.is_upcoming,
  })
}
console.log("events seeded")

await client.mutation(api.boardMembers.createMany, {
  token,
  members: MOCK_BOARD_MEMBERS.map(({ name, designation, section }) => ({ name, designation, section })),
})
console.log("board members seeded")

for (const ad of MOCK_COMMUNITY_ADS) {
  await client.mutation(api.communityAds.create, {
    token,
    title: ad.title,
    image_url: await upload(ad.image_url),
    link_url: ad.link_url,
    is_active: ad.is_active,
    duration_seconds: ad.duration_seconds,
    display_order: ad.display_order,
  })
}
console.log("community ads seeded")

await client.mutation(api.auth.logout, { token })
console.log("done")
