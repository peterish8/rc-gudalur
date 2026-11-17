import { ConvexError, v } from "convex/values"
import { mutation } from "./_generated/server"
import { requireAdmin } from "./lib"

/** Step 1 of an upload: a short-lived URL the admin browser POSTs the file to. */
export const generateUploadUrl = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token)
    return await ctx.storage.generateUploadUrl()
  },
})

/** Step 2: turn the returned storageId into a permanent public URL to save on the record. */
export const getUrl = mutation({
  args: { token: v.string(), storageId: v.id("_storage") },
  handler: async (ctx, { token, storageId }) => {
    await requireAdmin(ctx, token)
    const url = await ctx.storage.getUrl(storageId)
    if (!url) throw new ConvexError("Uploaded file not found.")
    return url
  },
})

/**
 * Deletes stored files given their public URLs (…/api/storage/<storageId>).
 * URLs that don't point at this deployment's storage are ignored.
 */
export const removeByUrls = mutation({
  args: { token: v.string(), urls: v.array(v.string()) },
  handler: async (ctx, { token, urls }) => {
    await requireAdmin(ctx, token)
    for (const url of urls) {
      const raw = url.match(/\/api\/storage\/([^/?#]+)/)?.[1]
      const id = raw ? ctx.db.system.normalizeId("_storage", raw) : null
      if (id) await ctx.storage.delete(id)
    }
  },
})
