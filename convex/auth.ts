import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"

const SESSION_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

/**
 * Admin login. Credentials live in Convex environment variables, set with:
 *   npx convex env set ADMIN_EMAIL <email>
 *   npx convex env set ADMIN_PASSWORD <password>
 */
export const login = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }) => {
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminEmail || !adminPassword) {
      throw new ConvexError("Admin login is not configured (ADMIN_EMAIL / ADMIN_PASSWORD).")
    }
    if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase() || password !== adminPassword) {
      throw new ConvexError("Invalid email or password.")
    }

    // Drop expired sessions while we're here.
    const now = Date.now()
    for (const s of await ctx.db.query("admin_sessions").collect()) {
      if (s.expires_at < now) await ctx.db.delete(s._id)
    }

    const token = `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, "")
    await ctx.db.insert("admin_sessions", { token, email: adminEmail, expires_at: now + SESSION_MS })
    return { token, email: adminEmail }
  },
})

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query("admin_sessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique()
    if (session) await ctx.db.delete(session._id)
  },
})

/** Returns `{ email }` for a valid session token, otherwise null. */
export const me = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query("admin_sessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique()
    if (!session || session.expires_at < Date.now()) return null
    return { email: session.email }
  },
})
