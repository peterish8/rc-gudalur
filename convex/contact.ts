import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAdmin, toRow } from "./lib"

/** Public: the website's contact form. */
export const submit = mutation({
  args: { name: v.string(), phone: v.string(), message: v.string() },
  handler: async (ctx, args) => {
    const name = args.name.trim()
    const phone = args.phone.trim()
    const message = args.message.trim()
    if (!name || !phone || !message) throw new ConvexError("Name, phone and message are required.")
    if (name.length > 120 || phone.length > 30 || message.length > 2000) {
      throw new ConvexError("One of the fields is too long.")
    }
    await ctx.db.insert("contact_submissions", { name, phone, message, is_read: false })
  },
})

// ---- admin ----

export const list = query({
  args: { token: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { token, limit }) => {
    await requireAdmin(ctx, token)
    const q = ctx.db.query("contact_submissions").order("desc")
    const docs = limit ? await q.take(limit) : await q.collect()
    return docs.map(toRow)
  },
})

export const setRead = mutation({
  args: { token: v.string(), id: v.id("contact_submissions"), is_read: v.boolean() },
  handler: async (ctx, { token, id, is_read }) => {
    await requireAdmin(ctx, token)
    await ctx.db.patch(id, { is_read })
  },
})

export const markAllRead = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token)
    const unread = await ctx.db
      .query("contact_submissions")
      .withIndex("by_read", (q) => q.eq("is_read", false))
      .collect()
    for (const s of unread) await ctx.db.patch(s._id, { is_read: true })
  },
})

export const remove = mutation({
  args: { token: v.string(), id: v.id("contact_submissions") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token)
    await ctx.db.delete(id)
  },
})
