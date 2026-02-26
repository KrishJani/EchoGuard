import { query, internalQuery } from "./_generated/server";
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Public query for frontend
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("calls")
      .order("desc")
      .take(args.limit ?? 50);
  },
});

export const fetchCallRecord = internalQuery({
  args: { call_id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("calls")
      .filter((q) => q.eq(q.field("call_id"), args.call_id))
      .first();
  },
});

export const createCallRecord = internalMutation({
  args: {
    call_id: v.any(),
    phone_number: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("calls", {
          call_id: args.call_id,
          phone_number: args.phone_number,
          status: "active",
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});

export const updateCallRisk = internalMutation({
  args: {
    id: v.id("calls"),
    risk_score: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.patch(args.id, {
          risk_score: args.risk_score,
          status: "completed",
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});