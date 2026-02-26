import { query } from "./_generated/server";
import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

// Public query for frontend
export const getByCallId = query({
  args: {
    callId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transcripts")
      .filter((q) => q.eq(q.field("call_id"), args.callId))
      .order("asc")
      .collect();
  },
});

export const saveTranscript = internalMutation({
  args: {
    call_id: v.any(),
    text: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("transcripts", {
          call_id: args.call_id,
          chunk_index: 0,
          text: args.text,
        });
        return {
          ...args,
          id
    , _id: id    };
  },
});

export const upsertTranscriptForCall = internalMutation({
  args: {
    call_id: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("transcripts")
      .filter((q) => q.eq(q.field("call_id"), args.call_id))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { text: args.text });
      return existing._id;
    }
    return await ctx.db.insert("transcripts", {
      call_id: args.call_id,
      chunk_index: 0,
      text: args.text,
    });
  },
});