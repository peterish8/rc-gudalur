import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

// Field names stay snake_case so the site and admin components keep their existing shapes.
export default defineSchema({
  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    event_date: v.string(), // YYYY-MM-DD
    image_url: v.optional(v.string()),
    extra_images: v.optional(v.array(v.string())),
    is_upcoming: v.boolean(),
  })
    .index("by_date", ["event_date"])
    .index("by_upcoming_date", ["is_upcoming", "event_date"]),

  board_members: defineTable({
    name: v.string(),
    designation: v.string(),
    section: v.optional(v.string()), // "fixed" | "layer1" | "layer2" | "layer3"
  }),

  community_ads: defineTable({
    title: v.string(),
    image_url: v.string(),
    link_url: v.optional(v.string()),
    is_active: v.boolean(),
    duration_seconds: v.number(),
    display_order: v.number(),
    updated_at: v.string(),
  })
    .index("by_order", ["display_order"])
    .index("by_active_order", ["is_active", "display_order"]),

  contact_submissions: defineTable({
    name: v.string(),
    phone: v.string(),
    message: v.string(),
    is_read: v.boolean(),
  }).index("by_read", ["is_read"]),

  admin_sessions: defineTable({
    token: v.string(),
    email: v.string(),
    expires_at: v.number(),
  }).index("by_token", ["token"]),
})
