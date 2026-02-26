import { internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const fetchKnowledgeBase = internalQuery({
  args: { user_id: v.any() },
  handler: async (ctx, args) => {
    return await ctx.db.query("knowledge_base")
       
          .filter((q) => q.eq(q.field("user_id"), args.user_id))
       .collect();
  },
});

export const seedKnowledgeBase = internalMutation({
  args: {
    entry_id: v.any(),
    user_id: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("knowledge_base", {
          entry_id: args.entry_id,
          category: "fraud_patterns",
          content: "FTC Fraud Patterns: 1) Grandparent Scam - Caller pretends to be grandchild needing bail money or emergency funds. Key phrases: \"Grandma/Grandpa, it's me\", \"Please don't tell Mom/Dad\", \"I need money urgently\". 2) IRS Impersonation - Threatens arrest for unpaid taxes. Key phrases: \"You owe back taxes\", \"Police are on their way\", \"Pay immediately to avoid arrest\". 3) Medicare Scam - Requests Medicare/SSN for \"new card\" or threatens benefit loss. 4) Lottery/Prize Scam - Claims prize won but requires upfront fee. 5) Romance Scam - Builds trust over time then requests wire transfer or gift cards. 6) Tech Support Scam - Claims computer is infected, requests remote access or payment. Always remember: Government agencies never call demanding immediate payment. Legitimate organizations never request gift cards as payment.",
          source: "FTC Consumer Information",
          user_id: args.user_id,
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});

export const saveVerificationQA = internalMutation({
  args: {
    entry_id: v.any(),
    content: v.any(),
    user_id: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("knowledge_base", {
          entry_id: args.entry_id,
          category: "verification",
          content: args.content,
          source: "user_provided",
          user_id: args.user_id,
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});