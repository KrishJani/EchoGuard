import { query } from "./_generated/server";
import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

// Public query for frontend
export const listUnacknowledged = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("alerts")
      .filter((q) => q.eq(q.field("acknowledged"), false))
      .order("desc")
      .take(50);
  },
});

export const logAlert = internalMutation({
  args: {
    call_id: v.any(),
    family_phone: v.any(),
    sent_at: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("alerts", {
          call_id: args.call_id,
          family_phone: args.family_phone,
          alert_type: "HIGH_RISK",
          sent_at: args.sent_at,
          acknowledged: false,
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});