import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { z } from "zod/v3";
import { fraudAnalysisAgent } from "./agents/fraudAnalysisAgent";
import { internal } from "./_generated/api";
import { __vfTrack, __vfTrackSync } from "./_vibeflowTracking";

/**
 * Required Environment Variables:
 * - API_ELEVENLABS_KEY: Set this in your Convex deployment
 */
/**
 * HTTP Request: POST
 * Generated from HTTP Request node: node_1772062308325_j1shjcl
 */
export const getApi_node_1772062308325_j1shjcl = action({
  args: {
    base64Audio: v.optional(v.any()),
    cloud_storage_url: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const method = 'POST';
    const url = 'https://integration.vibeflow.ai/api/actions/elevenlabs/speech-to-text';
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const apiKey = process.env.API_ELEVENLABS_KEY;
    if (!apiKey) {
      throw new Error('API_ELEVENLABS_KEY environment variable is required');
    }
    headers.Authorization = `Bearer ${apiKey}`;
    
    const bodyObj: Record<string, any> = {
      mimeType: "audio/mpeg",
      modelId: "scribe_v2",
      diarize: "false"
    };
    if (args.cloud_storage_url) {
      bodyObj['cloud_storage_url'] = args.cloud_storage_url;
    } else {
      bodyObj['base64Audio'] = args.base64Audio ?? '';
    }
    // Build body
    const body = bodyObj;
    
    try {
      console.log(`🌐 Making ${method} request to ${url}`);
    
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    
      const contentType = response.headers.get('content-type');
      let result;
    
      if (contentType?.includes('application/json')) {
        result = await response.json();
      } else if (contentType?.includes('audio/') || contentType?.includes('image/') || contentType?.includes('video/') || contentType?.includes('application/pdf') || contentType?.includes('application/octet-stream')) {
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        let binaryString = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binaryString += String.fromCharCode(uint8Array[i]);
        }
        const base64 = btoa(binaryString);
        result = base64;
      } else {
        result = await response.text();
      }
    
      // Extract specific path if specified
      return result;
    } catch (error) {
      console.error(`❌ HTTP request failed:`, error);
      throw error;
    }
  },
});

export const processRequest_fraudAnalysisAgent = internalAction({
  args: { input: v.any() },
  handler: async (ctx, args) => {
    // Convert input to string if needed
    const inputString = typeof args?.input === 'string' ? args.input : args?.input?.text || JSON.stringify(args?.input);
    
    const content: Array<{ type: "text"; text: string }> = [{ type: "text" as const, text: inputString }];

    // Call AI agent
    const { thread } = await fraudAnalysisAgent.createThread(ctx);

    const result = await thread.generateObject({
      messages: [{ role: "user" as const, content: inputString }],
      schema: z.object({ confidence: z.number().describe("Confidence score from 0 to 100"), matched_patterns: z.array(z.string()).describe("List of fraud pattern names matched in the transcript"), risk_level: z.enum(["LOW","MEDIUM","HIGH"]).describe("Risk level: LOW (0-40), MEDIUM (41-70), HIGH (71-100)"), summary: z.string().describe("Brief human-readable explanation of the risk assessment") }),
      
    });
    
    const response = result.object
    
    return response;
  },
});

/**
 * Required Environment Variables:
 * - API_TWILIO_KEY: Set this in your Convex deployment
 */
/**
 * HTTP Request: POST
 * Generated from HTTP Request node: node_1772062308325_gzqz697
 */
export const getApi_node_1772062308325_gzqz697 = action({
  args: {
    // Arguments expected by this HTTP request
    body: v.optional(v.any()),
    to: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const method = 'POST';
    const url = 'https://integration.vibeflow.ai/api/actions/twilio/send-message';
    
    // Build headers
    const headers: Record<string, string> = {
          'Content-Type': 'application/json',
    };
        // Add Bearer token authentication from environment
        const apiKey = process.env.API_TWILIO_KEY;
        if (!apiKey) {
          throw new Error('API_TWILIO_KEY environment variable is required');
        }
        headers.Authorization = `Bearer ${apiKey}`;
    
        // Build body (fields mode)
        const bodyObj: Record<string, any> = {
        "from": process.env.TWILIO_PHONE_NUMBER ?? process.env.API_TWILIO_FROM ?? "[YOUR_TWILIO_PHONE_NUMBER]"
    };
        bodyObj['to'] = args.to ?? '';
        bodyObj['body'] = args.body;
    // Build body
    const body = bodyObj;
    
    try {
      console.log(`🌐 Making ${method} request to ${url}`);
    
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    
      const contentType = response.headers.get('content-type');
      let result;
    
      if (contentType?.includes('application/json')) {
        result = await response.json();
      } else if (contentType?.includes('audio/') || contentType?.includes('image/') || contentType?.includes('video/') || contentType?.includes('application/pdf') || contentType?.includes('application/octet-stream')) {
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        let binaryString = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binaryString += String.fromCharCode(uint8Array[i]);
        }
        const base64 = btoa(binaryString);
        result = base64;
      } else {
        result = await response.text();
      }
    
      // Extract specific path if specified
      return result;
    } catch (error) {
      console.error(`❌ HTTP request failed:`, error);
      throw error;
    }
  },
});

/**
 * Required Environment Variables:
 * - API_ELEVENLABS_KEY: Set this in your Convex deployment
 */
/**
 * HTTP Request: POST
 * Generated from HTTP Request node: node_1772062308325_hgy9gbr
 */
export const getApi_node_1772062308325_hgy9gbr = action({
  args: {
    // Arguments expected by this HTTP request
    // No specific parameters detected
  },
  handler: async (ctx, args) => {
    const method = 'POST';
    const url = 'https://integration.vibeflow.ai/api/actions/elevenlabs/text-to-speech';
    
    // Build headers
    const headers: Record<string, string> = {
          'Content-Type': 'application/json',
    };
        // Add Bearer token authentication from environment
        const apiKey = process.env.API_ELEVENLABS_KEY;
        if (!apiKey) {
          throw new Error('API_ELEVENLABS_KEY environment variable is required');
        }
        headers.Authorization = `Bearer ${apiKey}`;
    
        // Build body (fields mode)
        const bodyObj: Record<string, any> = {
        "text": "This is EchoGuard. This call may be a scam. Please hang up and call your family member directly. Do not send any money or share personal information.",
        "voiceId": "EXAVITQu4vr4xnSDxMaL",
        "modelId": "eleven_multilingual_v2"
    };
    // Build body
    const body = bodyObj;
    
    try {
      console.log(`🌐 Making ${method} request to ${url}`);
    
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    
      const contentType = response.headers.get('content-type');
      let result;
    
      if (contentType?.includes('application/json')) {
        result = await response.json();
      } else if (contentType?.includes('audio/') || contentType?.includes('image/') || contentType?.includes('video/') || contentType?.includes('application/pdf') || contentType?.includes('application/octet-stream')) {
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        let binaryString = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binaryString += String.fromCharCode(uint8Array[i]);
        }
        const base64 = btoa(binaryString);
        result = base64;
      } else {
        result = await response.text();
      }
    
      // Extract specific path if specified
      return result;
    } catch (error) {
      console.error(`❌ HTTP request failed:`, error);
      throw error;
    }
  },
});

export const processFlow_node_1772062308325_xcjw1lt = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    const output_node_1772062308325_k9yzdbx = await __vfTrack(__vibeflowTracking, 'node_1772062308325_k9yzdbx', 'Extract Call Data', args.input, async () => {
      

    // EDIT FIELDS node node_1772062308325_k9yzdbx - Twilio body is in args.input.body
    const body = args.input?.body ?? args.input;
    
    const setByPath_node_1772062308325_k9yzdbx = (obj: any, path: string, value: any) => {
      const keys = path.split('.');
      let ref = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (typeof ref[k] !== 'object' || ref[k] === null) ref[k] = {};
        ref = ref[k];
      }
      ref[keys[keys.length - 1]] = value;
    };

    const out = {};
    setByPath_node_1772062308325_k9yzdbx(out, "call_id", body?.CallSid);
    setByPath_node_1772062308325_k9yzdbx(out, "phone_number", body?.From);
    setByPath_node_1772062308325_k9yzdbx(out, "called_number", body?.To);
    setByPath_node_1772062308325_k9yzdbx(out, "recording_url", body?.RecordingUrl);
    return out;
    });
    let mutationResult_node_1772062308325_zwwuzm3: { _id: any } | null;
    if (!output_node_1772062308325_k9yzdbx?.recording_url) {
      mutationResult_node_1772062308325_zwwuzm3 = await __vfTrack(__vibeflowTracking, 'node_1772062308325_zwwuzm3', 'Create Call Record', output_node_1772062308325_k9yzdbx, async () => {
        return await ctx.runMutation(internal.calls.createCallRecord, {
          call_id: output_node_1772062308325_k9yzdbx?.call_id,
          phone_number: output_node_1772062308325_k9yzdbx?.phone_number,
        });
      });
      const streamUrl = process.env.STREAM_SERVER_URL;
      if (streamUrl) {
        const esc = (s: string) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        const callSid = esc(output_node_1772062308325_k9yzdbx?.call_id ?? '');
        const from = esc(output_node_1772062308325_k9yzdbx?.phone_number ?? '');
        const to = esc(output_node_1772062308325_k9yzdbx?.called_number ?? '');
        const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Say>Please hold while we verify your call.</Say><Start><Stream url="${streamUrl}"><Parameter name="CallSid" value="${callSid}"/><Parameter name="From" value="${from}"/><Parameter name="To" value="${to}"/></Stream></Start><Pause length="300"/></Response>`;
        return { __result: twiml, __vibeflowTracking, __isTwiml: true };
      }
      const siteUrl = process.env.CONVEX_SITE_URL || 'https://bright-goose-102.convex.site';
      const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Say>Please hold while we verify your call.</Say><Record maxLength="300" playBeep="false" recordingStatusCallback="${siteUrl}/twilio/recording-complete" recordingStatusCallbackMethod="POST"/></Response>`;
      return { __result: twiml, __vibeflowTracking, __isTwiml: true };
    }

    const existingCall = await ctx.runQuery(internal.calls.fetchCallRecord, { call_id: output_node_1772062308325_k9yzdbx?.call_id ?? '' });
    mutationResult_node_1772062308325_zwwuzm3 = existingCall ?? await __vfTrack(__vibeflowTracking, 'node_1772062308325_zwwuzm3', 'Create Call Record', output_node_1772062308325_k9yzdbx, async () => {
      return await ctx.runMutation(internal.calls.createCallRecord, {
        call_id: output_node_1772062308325_k9yzdbx?.call_id,
        phone_number: output_node_1772062308325_k9yzdbx?.phone_number,
      });
    });

    const queryResult_node_1772062308325_0jslths = await __vfTrack(__vibeflowTracking, 'node_1772062308325_0jslths', 'Fetch User Profile', mutationResult_node_1772062308325_zwwuzm3, async () => {
      
    // Call query: fetchUserProfile (from node: node_1772062308325_0jslths)
    return  await ctx.runQuery(internal.profiles.fetchUserProfile, {
      elderly_phone: output_node_1772062308325_k9yzdbx?.called_number ?? output_node_1772062308325_k9yzdbx?.phone_number,
    });
    });
    const httpResult_node_1772062308325_j1shjcl = await __vfTrack(__vibeflowTracking, 'node_1772062308325_j1shjcl', 'ElevenLabs STT', queryResult_node_1772062308325_0jslths, async () => {
      
    // Call HTTP request: getApi_node_1772062308325_j1shjcl (from node: node_1772062308325_j1shjcl)
    return  await ctx.runAction(api.actions.getApi_node_1772062308325_j1shjcl, {
      cloud_storage_url: output_node_1772062308325_k9yzdbx?.recording_url,
    });
    });
    const mutationResult_node_1772062308325_ytrmcux = await __vfTrack(__vibeflowTracking, 'node_1772062308325_ytrmcux', 'Save Transcript', httpResult_node_1772062308325_j1shjcl, async () => {
      
    return  await ctx.runMutation(internal.transcripts.saveTranscript, {
      call_id: output_node_1772062308325_k9yzdbx?.call_id,
      text: httpResult_node_1772062308325_j1shjcl?.text ?? httpResult_node_1772062308325_j1shjcl?.transcript ?? String(httpResult_node_1772062308325_j1shjcl ?? ''),
    });
    });
    const queryResult_node_1772062308325_ra2w2mo = await __vfTrack(__vibeflowTracking, 'node_1772062308325_ra2w2mo', 'Fetch Knowledge Base', mutationResult_node_1772062308325_ytrmcux, async () => {
      
    // Call query: fetchKnowledgeBase (from node: node_1772062308325_ra2w2mo)
    return  await ctx.runQuery(internal.knowledge_base.fetchKnowledgeBase, {
      user_id: queryResult_node_1772062308325_0jslths?.[0]?.user_id,
    });
    });
    const agentResult_node_1772062308325_q7f7xqq = await __vfTrack(__vibeflowTracking, 'node_1772062308325_q7f7xqq', 'Fraud Analysis Agent', queryResult_node_1772062308325_ra2w2mo, async () => {
      
    return  await ctx.runAction(internal.actions.processRequest_fraudAnalysisAgent, {
    input: "Transcript: " + (httpResult_node_1772062308325_j1shjcl?.text ?? httpResult_node_1772062308325_j1shjcl?.transcript ?? JSON.stringify(httpResult_node_1772062308325_j1shjcl)) + " --- Knowledge Base entries: " + JSON.stringify(queryResult_node_1772062308325_ra2w2mo)
    });
    });
    const output_node_1772062308325_kzg991v = await __vfTrack(__vibeflowTracking, 'node_1772062308325_kzg991v', 'Map Risk Score', agentResult_node_1772062308325_q7f7xqq, async () => {
    const input_node_1772062308325_kzg991v = agentResult_node_1772062308325_q7f7xqq;
    
    const setByPath_node_1772062308325_kzg991v = (obj: any, path: string, value: any) => {
      const keys = path.split('.');
      let ref = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (typeof ref[k] !== 'object' || ref[k] === null) ref[k] = {};
        ref = ref[k];
      }
      ref[keys[keys.length - 1]] = value;
    };

    const out = {};
    setByPath_node_1772062308325_kzg991v(out, "risk_score", input_node_1772062308325_kzg991v.risk_level);
    setByPath_node_1772062308325_kzg991v(out, "call_id", output_node_1772062308325_k9yzdbx?.call_id);
    setByPath_node_1772062308325_kzg991v(out, "confidence", input_node_1772062308325_kzg991v.confidence);
    setByPath_node_1772062308325_kzg991v(out, "matched_patterns", input_node_1772062308325_kzg991v.matched_patterns);
    setByPath_node_1772062308325_kzg991v(out, "summary", input_node_1772062308325_kzg991v.summary);
    return out;
    });
    const mutationResult_node_1772062308325_t8in9qx = await __vfTrack(__vibeflowTracking, 'node_1772062308325_t8in9qx', 'Update Call Risk', output_node_1772062308325_kzg991v, async () => {
      
    return  await ctx.runMutation(internal.calls.updateCallRisk, {
      id: mutationResult_node_1772062308325_zwwuzm3?._id,
      risk_score: output_node_1772062308325_kzg991v?.risk_score,
    });
    });
    // IF node node_1772062308325_gzyjcfb
    const left_node_1772062308325_gzyjcfb_0 = output_node_1772062308325_kzg991v?.risk_score;
    const right_node_1772062308325_gzyjcfb_0 = "HIGH";
    const cond_node_1772062308325_gzyjcfb_0 = left_node_1772062308325_gzyjcfb_0 === right_node_1772062308325_gzyjcfb_0;
    const cond_node_1772062308325_gzyjcfb = cond_node_1772062308325_gzyjcfb_0;
    __vfTrackSync(__vibeflowTracking, 'node_1772062308325_gzyjcfb', 'Is High Risk?', mutationResult_node_1772062308325_t8in9qx, { conditionResult: cond_node_1772062308325_gzyjcfb });

    let branchResult_node_1772062308325_gzyjcfb = mutationResult_node_1772062308325_t8in9qx;
    if (cond_node_1772062308325_gzyjcfb) {
      
    const httpResult_node_1772062308325_gzqz697 = await __vfTrack(__vibeflowTracking, 'node_1772062308325_gzqz697', 'Send Family SMS Alert', mutationResult_node_1772062308325_t8in9qx, async () => {
      
    // Call HTTP request: getApi_node_1772062308325_gzqz697 (from node: node_1772062308325_gzqz697)
    return  await ctx.runAction(api.actions.getApi_node_1772062308325_gzqz697, {
      to: queryResult_node_1772062308325_0jslths?.[0]?.family_phone,
      body: "⚠️ EchoGuard Alert: High-risk fraud call detected! Patterns found: " + output_node_1772062308325_kzg991v?.matched_patterns.join(", ") + ". Confidence: " + output_node_1772062308325_kzg991v?.confidence + "%. Summary: " + output_node_1772062308325_kzg991v?.summary + ". Please check in with your loved one immediately.",
    });
    });
      branchResult_node_1772062308325_gzyjcfb = httpResult_node_1772062308325_gzqz697;
      
    const httpResult_node_1772062308325_hgy9gbr = await __vfTrack(__vibeflowTracking, 'node_1772062308325_hgy9gbr', 'ElevenLabs TTS Intervention', httpResult_node_1772062308325_gzqz697, async () => {
      
    // Call HTTP request: getApi_node_1772062308325_hgy9gbr (from node: node_1772062308325_hgy9gbr)
    return  await ctx.runAction(api.actions.getApi_node_1772062308325_hgy9gbr, {

    });
    });
      branchResult_node_1772062308325_gzyjcfb = httpResult_node_1772062308325_hgy9gbr;
      
    const mutationResult_node_1772062308325_5nan74n = await __vfTrack(__vibeflowTracking, 'node_1772062308325_5nan74n', 'Log Alert', httpResult_node_1772062308325_hgy9gbr, async () => {
      
    return  await ctx.runMutation(internal.alerts.logAlert, {
      call_id: output_node_1772062308325_k9yzdbx?.call_id,
      family_phone: queryResult_node_1772062308325_0jslths?.[0]?.family_phone,
      sent_at: Date.now(),
    });
    });
      branchResult_node_1772062308325_gzyjcfb = mutationResult_node_1772062308325_5nan74n;
      
    const returnValue_node_1772062308325_rvo50ae = await __vfTrack(__vibeflowTracking, 'node_1772062308325_rvo50ae', 'Return OK', { ...mutationResult_node_1772062308325_5nan74n, ...mutationResult_node_1772062308325_t8in9qx }, async () => {
      
    return  "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response><Say>Thank you for calling. Goodbye.</Say></Response>";

    });
      branchResult_node_1772062308325_gzyjcfb = returnValue_node_1772062308325_rvo50ae;
    } else {
    }

    const __finalResult = branchResult_node_1772062308325_gzyjcfb;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

export const processFlow_node_1772062308325_ijvljhn = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    __vfTrackSync(__vibeflowTracking, 'node_1772062308325_ijvljhn', 'Onboarding Form', args.input, args.input);
    const output_node_1772062308325_qh2sc2x = await __vfTrack(__vibeflowTracking, 'node_1772062308325_qh2sc2x', 'Format Profile Data', args.input, async () => {
      

    // EDIT FIELDS node node_1772062308325_qh2sc2x
    const input_node_1772062308325_qh2sc2x = args.input;
    
    
    const setByPath_node_1772062308325_qh2sc2x = (obj: any, path: string, value: any) => {
      const keys = path.split('.');
      let ref = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (typeof ref[k] !== 'object' || ref[k] === null) ref[k] = {};
        ref = ref[k];
      }
      ref[keys[keys.length - 1]] = value;
    };

    const out = {};
    setByPath_node_1772062308325_qh2sc2x(out, "user_id", input_node_1772062308325_qh2sc2x.user_id);
    setByPath_node_1772062308325_qh2sc2x(out, "elderly_phone", input_node_1772062308325_qh2sc2x.elderly_phone);
    setByPath_node_1772062308325_qh2sc2x(out, "family_phone", input_node_1772062308325_qh2sc2x.family_phone);
    setByPath_node_1772062308325_qh2sc2x(out, "verification_qa", [{ question: args.input?.qa_1_question, answer: args.input?.qa_1_answer }, { question: args.input?.qa_2_question, answer: args.input?.qa_2_answer }]);
    return out;
    });
    const mutationResult_node_1772062308325_m91d0xn = await __vfTrack(__vibeflowTracking, 'node_1772062308325_m91d0xn', 'Save Profile', output_node_1772062308325_qh2sc2x, async () => {
      
    return  await ctx.runMutation(internal.profiles.saveProfile, {
      user_id: output_node_1772062308325_qh2sc2x?.user_id,
      elderly_phone: output_node_1772062308325_qh2sc2x?.elderly_phone,
      family_phone: output_node_1772062308325_qh2sc2x?.family_phone,
      verification_qa: output_node_1772062308325_qh2sc2x?.verification_qa,
    });
    });
    const mutationResult_node_1772062308325_w33z7nq = await __vfTrack(__vibeflowTracking, 'node_1772062308325_w33z7nq', 'Seed Knowledge Base', mutationResult_node_1772062308325_m91d0xn, async () => {
      
    return  await ctx.runMutation(internal.knowledge_base.seedKnowledgeBase, {
      entry_id: args.input?.user_id + "_ftc_patterns",
      user_id: args.input?.user_id,
    });
    });
    const mutationResult_node_1772062308325_mk67qvh = await __vfTrack(__vibeflowTracking, 'node_1772062308325_mk67qvh', 'Save Verification QA', mutationResult_node_1772062308325_w33z7nq, async () => {
      
    return  await ctx.runMutation(internal.knowledge_base.saveVerificationQA, {
      entry_id: args.input?.user_id + "_verification_qa",
      content: "Verification Q&A for user: Q1: " + args.input?.qa_1_question + " A1: " + args.input?.qa_1_answer + " Q2: " + args.input?.qa_2_question + " A2: " + args.input?.qa_2_answer,
      user_id: args.input?.user_id,
    });
    });
    const returnValue_node_1772062308325_vetb2b9 = await __vfTrack(__vibeflowTracking, 'node_1772062308325_vetb2b9', 'Return Success', mutationResult_node_1772062308325_mk67qvh, async () => {
      
    return  "Onboarding complete";

    });

    const __finalResult = returnValue_node_1772062308325_vetb2b9;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

/**
 * Real-time fraud analysis: called by the WebSocket stream server
 * when it receives committed transcripts from ElevenLabs STT.
 */
export const realtimeFraudCheck = internalAction({
  args: {
    transcript: v.string(),
    call_id: v.string(),
    from: v.optional(v.string()),
    to: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ ok: boolean; risk_level?: string; reason?: string }> => {
    const called_number = args.to ?? args.from;
    const profile: { user_id: string; family_phone: string }[] = await ctx.runQuery(internal.profiles.fetchUserProfile, {
      elderly_phone: called_number,
    });
    const hasProfile = profile?.length > 0;
    if (!hasProfile) {
      console.log("[Realtime] No profile for", called_number, "- running analysis anyway, no SMS");
    }

    let callRecord: { _id: import("./_generated/dataModel").Id<"calls"> } | null = await ctx.runQuery(internal.calls.fetchCallRecord, {
      call_id: args.call_id,
    });
    if (!callRecord) {
      const created = await ctx.runMutation(internal.calls.createCallRecord, {
        call_id: args.call_id,
        phone_number: args.from ?? "",
      });
      callRecord = { _id: created._id };
    }

    await ctx.runMutation(internal.transcripts.upsertTranscriptForCall, {
      call_id: args.call_id,
      text: args.transcript,
    });

    const defaultKb = [{ content: "FTC Fraud Patterns: Grandparent scam, IRS impersonation, Medicare scam, gift card requests, wire transfer demands, lottery/prize scams, romance scams, tech support scam." }];
    const kb: { content: string }[] = hasProfile
      ? await ctx.runQuery(internal.knowledge_base.fetchKnowledgeBase, { user_id: profile[0].user_id })
      : defaultKb;

    const fraudResult: { risk_level: string; matched_patterns?: string[]; confidence?: number; summary?: string } = await ctx.runAction(internal.actions.processRequest_fraudAnalysisAgent, {
      input: "Transcript: " + args.transcript + " --- Knowledge Base entries: " + JSON.stringify(kb),
    });

    if (!callRecord) return { ok: false, reason: "no_call_record" };

    await ctx.runMutation(internal.calls.updateCallRisk, {
      id: callRecord._id,
      risk_score: fraudResult.risk_level,
    });

    if (fraudResult.risk_level === "HIGH") {
      if (hasProfile) {
        try {
          await ctx.runAction(api.actions.getApi_node_1772062308325_gzqz697, {
            to: profile[0].family_phone,
            body: "⚠️ EchoGuard Alert: High-risk fraud call detected! Patterns found: " +
              (fraudResult.matched_patterns?.join(", ") ?? "unknown") +
              ". Confidence: " + fraudResult.confidence + "%. Summary: " + fraudResult.summary +
              ". Please check in with your loved one immediately.",
          });
        } catch (e) {
          console.warn("[Realtime] SMS failed (trial account?):", e);
        }
      }
      await ctx.runMutation(internal.alerts.logAlert, {
        call_id: args.call_id,
        family_phone: hasProfile ? profile[0].family_phone : "Dashboard",
        sent_at: Date.now(),
      });
    }

    return { ok: true, risk_level: fraudResult.risk_level };
  },
});

export const processFlow_frontend_1772064175086_d3nwoq4 = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    __vfTrackSync(__vibeflowTracking, 'frontend_1772064175086_d3nwoq4', 'UI for List Calls', args.input, args.input);
    const queryResult_node_1772064175085_ae63nyf = await __vfTrack(__vibeflowTracking, 'node_1772064175085_ae63nyf', 'List Calls', args.input, async () => {
      
    // Call query: list (from node: node_1772064175085_ae63nyf)
    return  await ctx.runQuery(api.calls.list, {

    });
    });
    const returnValue_node_return_1772064175086_881xuhu = await __vfTrack(__vibeflowTracking, 'node_return_1772064175086_881xuhu', 'Return List Calls', queryResult_node_1772064175085_ae63nyf, async () => {
      
    return  queryResult_node_1772064175085_ae63nyf;

    });

    const __finalResult = returnValue_node_return_1772064175086_881xuhu;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

export const processFlow_frontend_1772064175086_dsl2waf = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    __vfTrackSync(__vibeflowTracking, 'frontend_1772064175086_dsl2waf', 'UI for List Unacknowledged Alerts', args.input, args.input);
    const queryResult_node_1772064175085_odcwwtx = await __vfTrack(__vibeflowTracking, 'node_1772064175085_odcwwtx', 'List Unacknowledged Alerts', args.input, async () => {
      
    // Call query: listUnacknowledged (from node: node_1772064175085_odcwwtx)
    return  await ctx.runQuery(api.alerts.listUnacknowledged, {
    });
    });
    const returnValue_node_return_1772064175086_sx8ixqa = await __vfTrack(__vibeflowTracking, 'node_return_1772064175086_sx8ixqa', 'Return List Unacknowledged Alerts', queryResult_node_1772064175085_odcwwtx, async () => {
      
    return  queryResult_node_1772064175085_odcwwtx;

    });

    const __finalResult = returnValue_node_return_1772064175086_sx8ixqa;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});

export const processFlow_frontend_1772064175086_lled0hp = action({
  args: {
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {

  function getFieldOrStringify(obj: any, fieldName: string): any {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (fieldName in obj) {
      return obj[fieldName];
    }

    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error in getFieldOrStringify:', error);
    return undefined;
  }
}

  // Initialize tracking data storage
  const __vibeflowTracking: Record<string, { input?: any; output?: any }> = {};

  try {
    
    __vfTrackSync(__vibeflowTracking, 'frontend_1772064175086_lled0hp', 'UI for Get Transcript By Call ID', args.input, args.input);
    const queryResult_node_1772064175085_rslz8vl = await __vfTrack(__vibeflowTracking, 'node_1772064175085_rslz8vl', 'Get Transcript By Call ID', args.input, async () => {
      
    // Call query: getByCallId (from node: node_1772064175085_rslz8vl)
    return  await ctx.runQuery(api.transcripts.getByCallId, {
      callId: args.input?.callId ?? args.input?.call_id,
    });
    });
    const returnValue_node_return_1772064175086_xgcufgt = await __vfTrack(__vibeflowTracking, 'node_return_1772064175086_xgcufgt', 'Return Get Transcript By Call ID', queryResult_node_1772064175085_rslz8vl, async () => {
      
    return  queryResult_node_1772064175085_rslz8vl;

    });

    const __finalResult = returnValue_node_return_1772064175086_xgcufgt;
    return { __result: __finalResult, __vibeflowTracking };
  } catch (error) {
    // Always return tracking data even on error, so we can see what happened up to the failure point
    return {
      __result: undefined,
      __vibeflowTracking,
      __error: error instanceof Error ? error.message : String(error)
    };
  }
  },
});