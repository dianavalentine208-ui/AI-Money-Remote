import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Zap, ArrowLeft, Sparkles, Copy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const getHookErrorMessage = async (err: unknown): Promise<string> => {
  const fallback = "Failed to generate hooks";
  if (!err || typeof err !== "object") return fallback;

  const maybeMessage = "message" in err ? (err as { message?: unknown }).message : undefined;
  const message = typeof maybeMessage === "string" ? maybeMessage : "";
  if (message && !message.includes("non-2xx status code")) return message;

  const maybeContext = "context" in err ? (err as { context?: unknown }).context : undefined;
  if (maybeContext && typeof maybeContext === "object" && "status" in maybeContext) {
    const status = (maybeContext as { status?: unknown }).status;
    if (status === 402) return "AI credits exhausted. Please add billing/credits, then try again.";
    if (status === 429) return "Too many requests right now. Please wait a moment and retry.";

    if ("json" in maybeContext && typeof (maybeContext as { json?: unknown }).json === "function") {
      try {
        const payload = await (maybeContext as { json: () => Promise<unknown> }).json();
        if (payload && typeof payload === "object" && "error" in payload) {
          const apiError = (payload as { error?: unknown }).error;
          if (typeof apiError === "string" && apiError.trim()) return apiError;
        }
      } catch {
        // Ignore response parsing failures and use fallback text.
      }
    }
  }

  return message || fallback;
};

const AutoHooks = () => {
  const [idea, setIdea] = useState("");
  const [hooks, setHooks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-hooks", {
        body: { idea: idea.trim() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setHooks(data.hooks || []);
    } catch (err: unknown) {
      toast.error(await getHookErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const copyHook = (hook: string) => {
    navigator.clipboard.writeText(hook);
    toast.success("Hook copied!");
  };

  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Generate Viral Hooks</h1>
        <p className="text-muted-foreground mb-8">Enter your content idea and get three scroll-stopping hooks.</p>

        <div className="space-y-4 mb-8">
          <Textarea
            placeholder="e.g. A faceless YouTube channel about passive income with AI tools…"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="min-h-[120px] bg-card border-border/50 resize-none"
          />
          <Button variant="hero" className="gap-2 w-full sm:w-auto" onClick={generate} disabled={loading || !idea.trim()}>
            <Sparkles className="h-4 w-4" />
            {loading ? "Generating…" : "Generate Hooks"}
          </Button>
        </div>

        {hooks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">Your Hooks</h2>
            {hooks.map((hook, i) => (
              <div key={i} className="glass-card rounded-lg p-5 flex items-start justify-between gap-4 hover:border-primary/30 transition-colors">
                <div className="flex gap-3 items-start">
                  <span className="text-primary font-bold text-sm mt-0.5">{i + 1}</span>
                  <p className="text-sm leading-relaxed">{hook}</p>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => copyHook(hook)}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default AutoHooks;
