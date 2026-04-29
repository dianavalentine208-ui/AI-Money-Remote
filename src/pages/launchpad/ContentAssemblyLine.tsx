import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Send, Play, Download, Copy, Check, Film, FileText, Zap, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ContentAssemblyLineProps {
  niche: string;
  fields: Record<string, string>;
  updateField: (key: string, value: string) => void;
  appendToNotes: (text: string) => void;
  userId: string | undefined;
}

const STEPS = [
  { num: 1, label: "The Hook", icon: Zap },
  { num: 2, label: "The Script", icon: FileText },
  { num: 3, label: "The Video", icon: Film },
  { num: 4, label: "The Post", icon: Download },
];

const getHookErrorMessage = async (err: unknown): Promise<string> => {
  if (!err || typeof err !== "object") return "Failed to generate hooks";

  const maybeMessage = "message" in err ? (err as { message?: unknown }).message : undefined;
  const message = typeof maybeMessage === "string" ? maybeMessage : "";

  const maybeContext = "context" in err ? (err as { context?: unknown }).context : undefined;
  if (maybeContext && typeof maybeContext === "object" && "status" in maybeContext) {
    const status = (maybeContext as { status?: unknown }).status;
    if (status === 402) return "AI credits exhausted. Add billing/credits to generate hooks.";
    if (status === 429) return "Rate limited right now. Please retry in a moment.";
  }

  if (message && !message.includes("non-2xx status code")) return message;
  return "Failed to generate hooks";
};

export const ContentAssemblyLine = ({ niche, fields, updateField, appendToNotes, userId }: ContentAssemblyLineProps) => {
  const STOCK_VIDEOS = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  ];
  const FALLBACK_POSTER = "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=450&fit=crop";
  const [activeStep, setActiveStep] = useState(1);
  const [generatingHooks, setGeneratingHooks] = useState(false);
  const [hooks, setHooks] = useState<string[]>([]);
  const [selectedHook, setSelectedHook] = useState("");
  const [script, setScript] = useState(fields["assembly_script"] || "");
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);
  const [generatedClip, setGeneratedClip] = useState<any>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const [previewSrc, setPreviewSrc] = useState(STOCK_VIDEOS[0]);

  const nicheLabel = niche || "your niche";

  const generateHooks = async () => {
    setGeneratingHooks(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-hooks", {
        body: { idea: `A faceless content creator in the "${nicheLabel}" niche making short-form viral videos.` },
      });
      if (error) throw error;
      const hookList = data?.hooks || [
        `Why nobody in ${nicheLabel} is talking about this…`,
        `I made my first $500 with ${nicheLabel} — here's exactly how.`,
        `Stop scrolling. This ${nicheLabel} secret changes everything.`,
      ];
      setHooks(hookList);
      toast.success("3 hooks generated!");
    } catch (err: unknown) {
      // Fallback hooks
      setHooks([
        `Why nobody in ${nicheLabel} is talking about this…`,
        `I made my first $500 with ${nicheLabel} — here's exactly how.`,
        `Stop scrolling. This ${nicheLabel} secret changes everything.`,
      ]);
      const errorMessage = await getHookErrorMessage(err);
      toast.warning(`${errorMessage} Using fallback hooks for now.`);
    } finally {
      setGeneratingHooks(false);
    }
  };

  const selectHook = (hook: string) => {
    setSelectedHook(hook);
    updateField("assembly_hook", hook);
    appendToNotes(`Selected hook: ${hook}`);
    toast.success("Hook selected!");
  };

  const handleScriptChange = (val: string) => {
    setScript(val);
    updateField("assembly_script", val);
  };

  const sendToVideoGenerator = async () => {
    if (!script.trim()) {
      toast.error("Write your script first");
      return;
    }
    updateField("assembly_script", script);
    setGeneratingVideo(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-clip", {
        body: { prompt: script.trim() },
      });
      if (error) throw error;
      if (!data?.clip) throw new Error("Clip generation returned no clip.");

      setGeneratedClip(data.clip);
      setVideoReady(true);
      toast.success("Video concept generated!");
      setActiveStep(3);
    } catch (err: any) {
      toast.error(err?.message || "Failed to generate video concept");
    } finally {
      setGeneratingVideo(false);
    }
  };

  const resolveClipVideo = () => {
    const filePath = generatedClip?.file_path as string | null | undefined;
    if (filePath && /^https?:\/\//i.test(filePath)) return filePath;
    return STOCK_VIDEOS[0];
  };

  const clipPoster = generatedClip?.thumbnail_url || FALLBACK_POSTER;

  useEffect(() => {
    if (!generatedClip) return;
    setPreviewSrc(resolveClipVideo());
    setPlaying(false);
  }, [generatedClip]);

  const generatedCaption = selectedHook
    ? `${selectedHook}\n\n🔗 Check the link in bio for more!\n\n✨ Created with AI Money Remote`
    : `🔥 New content dropping!\n\n🔗 Link in bio\n\n✨ Created with AI Money Remote`;

  const copyCaption = () => {
    navigator.clipboard.writeText(generatedCaption);
    setCaptionCopied(true);
    toast.success("Caption copied!");
    setTimeout(() => setCaptionCopied(false), 2000);
  };

  const handlePlayPreview = async () => {
    const video = previewVideoRef.current;
    if (!video) return;

    try {
      video.currentTime = 0;
      await video.play();
      setPlaying(true);
      video.onended = () => setPlaying(false);
    } catch {
      toast.error("Could not start preview playback.");
      setPlaying(false);
    }
  };

  return (
    <div className="rounded-xl border border-amber-500/20 bg-gradient-to-b from-amber-950/20 to-background overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-amber-500/10 to-transparent border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <Film className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-bold text-amber-200 tracking-wide">CONTENT ASSEMBLY LINE</span>
        </div>
        <p className="text-[11px] text-amber-300/60 mt-0.5">Build a complete post in 4 steps</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center px-4 py-3 gap-1 border-b border-border/20 overflow-x-auto">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = activeStep === step.num;
          const isDone = activeStep > step.num;
          return (
            <div key={step.num} className="flex items-center">
              <button
                onClick={() => setActiveStep(step.num)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-amber-500/20 text-amber-200 ring-1 ring-amber-500/30"
                    : isDone
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3 w-3" />
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.num}</span>
              </button>
              {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground/40 mx-0.5 shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="p-4 space-y-3">
        {/* ── STEP 1: The Hook ── */}
        {activeStep === 1 && (
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Step 1: Generate Your Viral Hook</h4>
              <p className="text-xs text-muted-foreground">Get 3 AI-powered hooks tailored to <span className="text-amber-300">{nicheLabel}</span>.</p>
            </div>
            {hooks.length === 0 ? (
              <Button
                size="sm"
                onClick={generateHooks}
                disabled={generatingHooks}
                className="gap-2 bg-amber-600 hover:bg-amber-500 text-white"
              >
                {generatingHooks ? (
                  <><Sparkles className="h-3.5 w-3.5 animate-spin" /> Generating…</>
                ) : (
                  <><Sparkles className="h-3.5 w-3.5" /> Generate 3 Hooks</>
                )}
              </Button>
            ) : (
              <div className="space-y-2">
                {hooks.map((hook, i) => (
                  <button
                    key={i}
                    onClick={() => selectHook(hook)}
                    className={`w-full text-left rounded-lg border p-3 transition-all text-sm ${
                      selectedHook === hook
                        ? "border-amber-400 bg-amber-500/10 ring-1 ring-amber-400/30"
                        : "border-border/40 bg-background/50 hover:border-amber-500/30"
                    }`}
                  >
                    <span className="text-amber-300/60 text-xs font-mono mr-2">#{i + 1}</span>
                    {hook}
                  </button>
                ))}
                {selectedHook && (
                  <Button size="sm" variant="outline" className="gap-2 border-amber-500/30 text-amber-200" onClick={() => setActiveStep(2)}>
                    Next: Write Script <ChevronRight className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: The Script ── */}
        {activeStep === 2 && (
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Step 2: Refine Your Script</h4>
              <p className="text-xs text-muted-foreground">Write or edit your video script. Your hook is at the top.</p>
            </div>
            {selectedHook && (
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-sm text-amber-200">
                🪝 <span className="font-medium">{selectedHook}</span>
              </div>
            )}
            <Label htmlFor="content-assembly-script" className="sr-only">
              Video script
            </Label>
            <Textarea
              id="content-assembly-script"
              name="content_assembly_script"
              autoComplete="off"
              value={script}
              onChange={(e) => handleScriptChange(e.target.value)}
              placeholder={`Start with your hook, then write 60-90 seconds of content about ${nicheLabel}…`}
              className="min-h-[120px] bg-background/50 text-sm border-border/40"
              maxLength={3000}
            />
            <Button
              size="sm"
              onClick={sendToVideoGenerator}
              disabled={generatingVideo || !script.trim()}
              className="gap-2 bg-amber-600 hover:bg-amber-500 text-white"
            >
              {generatingVideo ? (
                <><Sparkles className="h-3.5 w-3.5 animate-spin" /> Generating Video…</>
              ) : (
                <><Send className="h-3.5 w-3.5" /> Send to AI Video Generator</>
              )}
            </Button>
          </div>
        )}

        {/* ── STEP 3: The Video ── */}
        {activeStep === 3 && (
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Step 3: Preview Your Video</h4>
              <p className="text-xs text-muted-foreground">Your AI-generated video is ready for review.</p>
            </div>

            {/* Video preview */}
            <div className="relative aspect-video rounded-lg bg-gradient-to-br from-neutral-900 to-neutral-800 border border-border/30 overflow-hidden flex items-center justify-center">
              {videoReady ? (
                <>
                  <video
                    ref={previewVideoRef}
                    src={previewSrc}
                    poster={clipPoster}
                    controls
                    muted
                    loop
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onError={() => {
                      if (previewSrc !== STOCK_VIDEOS[0]) {
                        setPreviewSrc(STOCK_VIDEOS[0]);
                        toast.error("Primary video failed. Switched to fallback preview.");
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="text-center z-10">
                    {!playing ? (
                      <button
                        onClick={handlePlayPreview}
                        className="bg-white/10 backdrop-blur rounded-full p-4 hover:bg-white/20 transition-colors"
                      >
                        <Play className="h-8 w-8 text-white fill-white" />
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="bg-primary/20 text-primary text-xs px-3 py-1.5 rounded-full font-medium animate-pulse">
                          ▶ Playing preview…
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end z-10">
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">AI Clone Video</span>
                    <span className="text-[10px] text-white/40 italic">{generatedClip?.duration || "Preview"}</span>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Film className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">Send your script to generate the video</p>
                </div>
              )}
            </div>

            {/* Auto-generated caption */}
            {videoReady && (
              <div className="rounded-lg border border-border/30 bg-muted/20 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Auto-Generated Caption</span>
                  <button onClick={copyCaption} className="text-xs text-primary hover:underline flex items-center gap-1">
                    {captionCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {captionCopied ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">
                  {generatedCaption}
                </div>
              </div>
            )}

            {videoReady && (
              <Button size="sm" variant="outline" className="gap-2 border-amber-500/30 text-amber-200" onClick={() => setActiveStep(4)}>
                Next: Download & Post <ChevronRight className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}

        {/* ── STEP 4: The Post ── */}
        {activeStep === 4 && (
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Step 4: Download & Post</h4>
              <p className="text-xs text-muted-foreground">Grab your video and caption, then post to your faceless page.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => toast.info("Video download coming soon — full rendering pipeline in development!")}
                className="flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 hover:bg-amber-500/10 transition-all text-left"
              >
                <div className="rounded-full bg-amber-500/10 p-2">
                  <Download className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Download Video</p>
                  <p className="text-[11px] text-muted-foreground">MP4 ready for upload</p>
                </div>
              </button>

              <button
                onClick={copyCaption}
                className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 hover:bg-primary/10 transition-all text-left"
              >
                <div className="rounded-full bg-primary/10 p-2">
                  {captionCopied ? <Check className="h-5 w-5 text-primary" /> : <Copy className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{captionCopied ? "Caption Copied!" : "Copy Caption"}</p>
                  <p className="text-[11px] text-muted-foreground">Hook + CTA + watermark</p>
                </div>
              </button>
            </div>

            <div className="rounded-lg bg-muted/20 border border-border/20 p-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Your caption includes:</span><br />
                ✓ Your viral hook<br />
                ✓ A call to action for your affiliate link<br />
                ✓ A watermark: <span className="italic text-amber-300/70">'Created with AI Money Remote'</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
