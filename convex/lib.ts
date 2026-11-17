import { ConvexError } from "convex/values"
import type { Doc, TableNames } from "./_generated/dataModel"
import type { QueryCtx } from "./_generated/server"

/** Converts a Convex document to the `{ id, created_at, ...fields }` shape the apps use. */
export function toRow<T extends TableNames>(doc: Doc<T>) {
  const { _id, _creationTime, ...fields } = doc as Doc<T> & { _id: string; _creationTime: number }
  return { ...fields, id: _id as string, created_at: new Date(_creationTime).toISOString() }
}

/** Throws unless `token` belongs to a live admin session. */
export async function requireAdmin(ctx: QueryCtx, token: string) {
  const session = await ctx.db
    .query("admin_sessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .unique()
  if (!session || session.expires_at < Date.now()) {
    throw new ConvexError("Not signed in. Please log in again.")
  }
  return session
}

/** Empty strings become `undefined` so optional fields are cleared instead of stored as "". */
export function blankToUndefined(value: string | null | undefined) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}
