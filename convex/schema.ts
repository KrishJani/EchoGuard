import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  // Keep existing tables and add:
  calls: defineTable({
       call_id: v.string(),
       phone_number: v.string(),
       duration: v.optional(v.number()),
       risk_score: v.optional(v.string()),
       status: v.string(),
  }),
  transcripts: defineTable({
       call_id: v.string(),
       chunk_index: v.number(),
       text: v.string(),
  }),
  alerts: defineTable({
       call_id: v.string(),
       family_phone: v.string(),
       alert_type: v.string(),
       sent_at: v.number(),
       acknowledged: v.boolean(),
  }),
  knowledge_base: defineTable({
       entry_id: v.string(),
       category: v.string(),
       content: v.string(),
       source: v.string(),
       user_id: v.string(),
  }),
  profiles: defineTable({
       user_id: v.string(),
       elderly_phone: v.string(),
       family_phone: v.string(),
       verification_qa: v.array(v.any()),
  }),
});