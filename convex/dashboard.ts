import { v } from "convex/values"
import { query } from "./_generated/server"
import { requireAdmin, toRow } from "./lib"

/** Admin dashboard counts and previews in one round trip. */
export const overview = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token)
    const events = await ctx.db.query("events").collect()
    const ads = await ctx.db.query("community_ads").collect()
    const members = await ctx.db.query("board_members").collect()
    const unread = await ctx.db
      .query("contact_submissions")
      .withIndex("by_read", (q) => q.eq("is_read", false))
      .collect()

    const recentMessages = await ctx.db.query("contact_submissions").order("desc").take(5)
    const nextEvents = await ctx.db
      .query("events")
      .withIndex("by_upcoming_date", (q) => q.eq("is_upcoming", true))
      .order("asc")
      .take(3)
    const activeAds = await ctx.db
      .query("community_ads")
      .withIndex("by_active_order", (q) => q.eq("is_active", true))
      .order("asc")
      .take(4)

    return {
      counts: {
        eventsTotal: events.length,
        eventsUpcoming: events.filter((e) => e.is_upcoming).length,
        adsTotal: ads.length,
        adsActive: ads.filter((a) => a.is_active).length,
        membersTotal: members.length,
        messagesUnread: unread.length,
      },
      recentMessages: recentMessages.map(toRow),
      nextEvents: nextEvents.map(toRow),
      activeAds: activeAds.map(toRow),
    }
  },
})
