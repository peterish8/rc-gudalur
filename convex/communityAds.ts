import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { blankToUndefined, requireAdmin, toRow } from "./lib"

/** Public: active ads in display order. */
export const listActive = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const docs = await ctx.db
      .query("community_ads")
      .withIndex("by_active_order", (q) => q.eq("is_active", true))
      .order("asc")
      .take(limit ?? 50)
    return docs.map(toRow)
  },
})

const adFields = {
  title: v.string(),
  image_url: v.string(),
  link_url: v.optional(v.union(v.string(), v.null())),
  is_active: v.boolean(),
  duration_seconds: v.number(),
  display_order: v.number(),
}

const clean = (a: {
  title: string
  image_url: string
  link_url?: string | null
  is_active: boolean
  duration_seconds: number
  display_order: number
}) => ({
  title: a.title.trim(),
  image_url: a.image_url,
  link_url: blankToUndefined(a.link_url),
  is_active: a.is_active,
  duration_seconds: a.duration_seconds || 10,
  display_order: a.display_order,
  updated_at: new Date().toISOString(),
})

export const listAll = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token)
    return (await ctx.db.query("community_ads").withIndex("by_order").order("asc").collect()).map(toRow)
  },
})

export const create = mutation({
  args: { token: v.string(), ...adFields },
  handler: async (ctx, { token, ...fields }) => {
    await requireAdmin(ctx, token)
    await ctx.db.insert("community_ads", clean(fields))
  },
})

export const update = mutation({
  args: { token: v.string(), id: v.id("community_ads"), ...adFields },
  handler: async (ctx, { token, id, ...fields }) => {
    await requireAdmin(ctx, token)
    await ctx.db.replace(id, clean(fields))
  },
})

/** Sets display_order for many ads at once (drag-and-drop reorder). */
export const reorder = mutation({
  args: { token: v.string(), items: v.array(v.object({ id: v.id("community_ads"), display_order: v.number() })) },
  handler: async (ctx, { token, items }) => {
    await requireAdmin(ctx, token)
    const updated_at = new Date().toISOString()
    for (const { id, display_order } of items) await ctx.db.patch(id, { display_order, updated_at })
  },
})

export const remove = mutation({
  args: { token: v.string(), id: v.id("community_ads") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token)
    await ctx.db.delete(id)
  },
})
