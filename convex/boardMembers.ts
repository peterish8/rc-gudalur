import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { blankToUndefined, requireAdmin, toRow } from "./lib"

/** Public: all members, oldest first (the website groups them by `section`). */
export const list = query({
  args: {},
  handler: async (ctx) => (await ctx.db.query("board_members").order("asc").collect()).map(toRow),
})

const memberFields = {
  name: v.string(),
  designation: v.string(),
  section: v.optional(v.union(v.string(), v.null())),
}

const clean = (m: { name: string; designation: string; section?: string | null }) => ({
  name: m.name.trim(),
  designation: m.designation.trim(),
  section: blankToUndefined(m.section),
})

export const listAll = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token)
    return (await ctx.db.query("board_members").order("desc").collect()).map(toRow)
  },
})

export const create = mutation({
  args: { token: v.string(), ...memberFields },
  handler: async (ctx, { token, ...fields }) => {
    await requireAdmin(ctx, token)
    await ctx.db.insert("board_members", clean(fields))
  },
})

export const createMany = mutation({
  args: { token: v.string(), members: v.array(v.object(memberFields)) },
  handler: async (ctx, { token, members }) => {
    await requireAdmin(ctx, token)
    for (const m of members) await ctx.db.insert("board_members", clean(m))
    return members.length
  },
})

export const update = mutation({
  args: { token: v.string(), id: v.id("board_members"), ...memberFields },
  handler: async (ctx, { token, id, ...fields }) => {
    await requireAdmin(ctx, token)
    await ctx.db.replace(id, clean(fields))
  },
})

export const remove = mutation({
  args: { token: v.string(), id: v.id("board_members") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token)
    await ctx.db.delete(id)
  },
})
