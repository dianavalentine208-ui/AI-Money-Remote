/// <reference path="./edge-runtime-shims.d.ts" />
/// <reference path="./deno-remote-imports.d.ts" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const STOCK_VIDEOS = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
];

const VIDEOS_BY_MOOD: Record<string, string[]> = {
  warm: [STOCK_VIDEOS[0], STOCK_VIDEOS[2]],
  serene: [STOCK_VIDEOS[1], STOCK_VIDEOS[5]],
  electric: [STOCK_VIDEOS[3], STOCK_VIDEOS[4]],
  dramatic: [STOCK_VIDEOS[4], STOCK_VIDEOS[5]],
  nostalgic: [STOCK_VIDEOS[0], STOCK_VIDEOS[5]],
  energetic: [STOCK_VIDEOS[2], STOCK_VIDEOS[3]],
  dreamy: [STOCK_VIDEOS[1], STOCK_VIDEOS[4]],
  cinematic: [STOCK_VIDEOS[3], STOCK_VIDEOS[5]],
  cozy: [STOCK_VIDEOS[0], STOCK_VIDEOS[1]],
  moody: [STOCK_VIDEOS[4], STOCK_VIDEOS[5]],
};

const hashStr = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) | 0;
  return Math.abs(hash);
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const openAiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openAiApiKey) {
      return new Response(JSON.stringify({ error: "AI not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Verify user
    const userClient = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json().catch(() => ({}));
    const userPrompt = body.prompt || "";

    // Step 1: Generate clip concept metadata
    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a creative director for cinematic B-roll clips. Generate a unique, evocative clip concept for content creators. Return a JSON object with these fields:
- title: short evocative name (2-3 words)
- description: one sentence describing the visual scene
- mood: single word mood (e.g., warm, electric, serene, dramatic, nostalgic)
- duration: realistic duration string like "0:08" to "0:15"
- gradient: a Tailwind CSS gradient string using the format "from-{color}-900/60 to-{color}-800/20" that matches the mood

Only return the JSON object, no markdown or code blocks.`,
          },
          {
            role: "user",
            content: userPrompt
              ? `Generate a cinematic B-roll clip concept inspired by: ${userPrompt}`
              : "Generate a unique cinematic B-roll clip concept. Be creative and unexpected.",
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "clip_concept",
            strict: true,
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                mood: { type: "string" },
                duration: { type: "string" },
                gradient: { type: "string" },
              },
              required: ["title", "description", "mood", "duration", "gradient"],
              additionalProperties: false,
            },
          },
        },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const errText = await aiResponse.text();
      console.error("AI error:", status, errText);
      return new Response(JSON.stringify({ error: "AI generation failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const aiData = await aiResponse.json();
    let clip;
    try {
      clip = JSON.parse(aiData.choices[0].message.content);
    } catch {
      return new Response(JSON.stringify({ error: "Failed to parse AI response" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Step 2: Generate a unique thumbnail image
    let thumbnailUrl: string | null = null;
    try {
      const imageResponse = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt: `Generate a cinematic still frame photograph: ${clip.description}. Mood: ${clip.mood}. Style: professional B-roll cinematography, shallow depth of field, cinematic color grading, 16:9 aspect ratio.`,
          size: "1536x1024",
          quality: "medium",
        }),
      });

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        const base64Data = imageData.data?.[0]?.b64_json;

        if (base64Data) {
          // Upload base64 image output to Supabase storage
          const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
          
          const adminClient = createClient(supabaseUrl, supabaseServiceKey);
          const fileName = `thumbnails/${user.id}/${crypto.randomUUID()}.png`;
          
          const { error: uploadError } = await adminClient.storage
            .from("cinematic-clips")
            .upload(fileName, binaryData, { contentType: "image/png", upsert: false });

          if (!uploadError) {
            const { data: publicUrlData } = adminClient.storage
              .from("cinematic-clips")
              .getPublicUrl(fileName);
            thumbnailUrl = publicUrlData.publicUrl;
          } else {
            console.error("Thumbnail upload error:", uploadError);
          }
        }
      } else {
        console.error("Image generation failed:", imageResponse.status);
      }
    } catch (imgErr) {
      console.error("Thumbnail generation error:", imgErr);
    }

    // Step 3: Attach a real playable video URL and save.
    const moodKey = String(clip.mood || "").toLowerCase().trim();
    const moodPool = VIDEOS_BY_MOOD[moodKey] || STOCK_VIDEOS;
    const clipSignature = `${clip.title || ""}|${clip.description || ""}|${clip.mood || ""}`;
    const filePath = moodPool[hashStr(clipSignature) % moodPool.length];

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: saved, error: saveError } = await adminClient
      .from("cinematic_clips")
      .insert({
        user_id: user.id,
        title: clip.title,
        description: clip.description,
        mood: clip.mood,
        gradient: clip.gradient,
        duration: clip.duration,
        file_path: filePath,
        thumbnail_url: thumbnailUrl,
        is_seed: false,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Save error:", saveError);
      return new Response(JSON.stringify({ error: "Failed to save clip" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ clip: saved }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-clip error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
