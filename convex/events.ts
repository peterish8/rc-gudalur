import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { blankToUndefined, requireAdmin, toRow } from "./lib"

// ---- public (website) ----

export const listUpcoming = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const docs = await ctx.db
      .query("events")
      .withIndex("by_upcoming_date", (q) => q.eq("is_upcoming", true))
      .order("asc")
      .take(limit ?? 50)
    return docs.map(toRow)
  },
})

export const listPast = query({
  args: { order: v.optional(v.union(v.literal("asc"), v.literal("desc"))) },
  handler: async (ctx, { order }) => {
    const docs = await ctx.db
      .query("events")
      .withIndex("by_upcoming_date", (q) => q.eq("is_upcoming", false))
      .order(order ?? "desc")
      .collect()
    return docs.map(toRow)
  },
})

// ---- admin ----

const eventFields = {
  title: v.string(),
  description: v.optional(v.union(v.string(), v.null())),
  event_date: v.string(),
  image_url: v.optional(v.union(v.string(), v.null())),
  extra_images: v.optional(v.union(v.array(v.string()), v.null())),
  is_upcoming: v.boolean(),
}

function clean(fields: {
  title: string
  description?: string | null
  event_date: string
  image_url?: string | null
  extra_images?: string[] | null
  is_upcoming: boolean
}) {
  return {
    title: fields.title.trim(),
    description: blankToUndefined(fields.description),
    event_date: fields.event_date,
    image_url: blankToUndefined(fields.image_url),
    extra_images: fields.extra_images && fields.extra_images.length > 0 ? fields.extra_images : undefined,
    is_upcoming: fields.is_upcoming,
  }
}

export const listAll = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token)
    const docs = await ctx.db.query("events").withIndex("by_date").order("desc").collect()
    return docs.map(toRow)
  },
})

export const create = mutation({
  args: { token: v.string(), ...eventFields },
  handler: async (ctx, { token, ...fields }) => {
    await requireAdmin(ctx, token)
    const id = await ctx.db.insert("events", clean(fields))
    return toRow((await ctx.db.get(id))!)
  },
})

export const update = mutation({
  args: { token: v.string(), id: v.id("events"), ...eventFields },
  handler: async (ctx, { token, id, ...fields }) => {
    await requireAdmin(ctx, token)
    await ctx.db.replace(id, clean(fields))
  },
})

export const remove = mutation({
  args: { token: v.string(), id: v.id("events") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token)
    await ctx.db.delete(id)
  },
})
