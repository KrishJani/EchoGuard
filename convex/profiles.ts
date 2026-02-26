import { internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const fetchUserProfile = internalQuery({
  args: { elderly_phone: v.any() },
  handler: async (ctx, args) => {
    return await ctx.db.query("profiles")
       
          .filter((q) => q.eq(q.field("elderly_phone"), args.elderly_phone))
       .collect();
  },
});

export const saveProfile = internalMutation({
  args: {
    user_id: v.any(),
    elderly_phone: v.any(),
    family_phone: v.any(),
    verification_qa: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("profiles", {
          user_id: args.user_id,
          elderly_phone: args.elderly_phone,
          family_phone: args.family_phone,
          verification_qa: args.verification_qa,
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});