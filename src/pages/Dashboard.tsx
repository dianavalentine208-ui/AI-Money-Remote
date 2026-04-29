import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Film, Target, PenTool, Crown, HelpCircle, BarChart3, Rocket } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { UpgradeModal } from "@/components/UpgradeModal";
import { supabase } from "@/integrations/supabase/client";

const tools = [
  { icon: Shield, title: "Persona Clone", desc: "Upload video & build your AI twin", to: "/persona-clone", color: "from-blue-500/20 to-blue-600/5", requiresPro: true },
  { icon: Film, title: "Cinematic Vibes", desc: "Browse & generate AI B-roll", to: "/cinematic-vibes", color: "from-purple-500/20 to-purple-600/5", requiresPro: false },
  { icon: Target, title: "Affiliate Matchmaker", desc: "Find niche-relevant products", to: "/affiliate-matchmaker", color: "from-green-500/20 to-green-600/5", requiresPro: true },
  { icon: PenTool, title: "Auto-Hook Scripts", desc: "Generate viral hook scripts", to: "/auto-hooks", color: "from-orange-500/20 to-orange-600/5", requiresPro: false },
];

const jargon = [
  { term: "CTR", definition: "Click-Through Rate — the percentage of people who click your video after seeing the thumbnail. Higher CTR = more views." },
  { term: "Thumbnails", definition: "The cover image viewers see before they click your video. Bold faces, big text, and high contrast win clicks." },
  { term: "Repurposing", definition: "Taking one long video and chopping it into several short clips you can post across TikTok, Reels, and Shorts." },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { hasProAccess, cancelAtPeriodEnd, periodEnd } = useSubscription();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState("");

  const { data: completedDays } = useQuery({
    queryKey: ["launchpad_progress", user?.id],
    queryFn: async () => {
      if (!user) return [] as number[];
      const { data } = await supabase.from("launchpad_progress").select("day").eq("user_id", user.id);
      return (data?.map((r: any) => r.day) || []) as number[];
    },
    enabled: !!user,
  });

  const completedCount = completedDays?.length ?? 0;
  const currentDay = Math.min(completedCount + 1, 30);
  const journeyPct = Math.round((completedCount / 30) * 100);

  const handleToolClick = (tool: typeof tools[0], e: React.MouseEvent) => {
    if (tool.requiresPro && !hasProAccess) {
      e.preventDefault();
      setUpgradeFeature(tool.title);
      setUpgradeOpen(true);
    }
  };

  const displayName = user?.email?.split("@")[0] || "Creator";

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Welcome back, {displayName}</h1>
          <p className="text-muted-foreground text-sm">Pick a tool and start creating.</p>
          {cancelAtPeriodEnd && periodEnd && (
            <p className="text-sm text-destructive mt-2">
              Your Pro access ends on {new Date(periodEnd).toLocaleDateString()}. Resubscribe anytime from Settings.
            </p>
          )}
        </div>
        <Link to="/launchpad" className="shrink-0">
          <Button variant="hero" className="gap-2">
            <Rocket className="h-4 w-4" />
            Continue Day {currentDay}
          </Button>
        </Link>
      </div>

      {/* Premium gold journey progress bar */}
      <div className="glass-card rounded-xl p-5 mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Your 30-Day Launchpad Journey</span>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            <span className="text-primary font-bold">{completedCount}</span> / 30 days · {journeyPct}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-gradient-gold shadow-gold transition-all duration-700"
            style={{ width: `${journeyPct}%` }}
          />
        </div>
      </div>

      {/* Tools grid — clean 4-col on desktop */}
      <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Quick Create</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
        {tools.map((t) => (
          <Link key={t.title} to={t.to} onClick={(e) => handleToolClick(t, e)}>
            <div className={`glass-card rounded-xl p-5 hover:border-primary/40 transition-all group cursor-pointer bg-gradient-to-br ${t.color} relative h-full`}>
              {t.requiresPro && !hasProAccess && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <Crown className="h-3 w-3" /> Pro
                </div>
              )}
              <t.icon className="h-7 w-7 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-base mb-0.5">{t.title}</h3>
              <p className="text-muted-foreground text-xs">{t.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats + Creator Tips grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Your Progress</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <Stat value="0" label="Videos Created" />
            <Stat value="0" label="Hooks Generated" />
            <Stat value={`Day ${currentDay}`} label="Launchpad" />
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Creator Jargon Buster</h2>
          <p className="text-xs text-muted-foreground mb-4">Hover the <span className="text-primary">?</span> next to each term to learn what it means.</p>
          <div className="flex flex-wrap gap-2">
            {jargon.map((j) => (
              <Tooltip key={j.term}>
                <TooltipTrigger asChild>
                  <button className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-border/60 bg-secondary/50 hover:bg-secondary hover:border-primary/40 transition-colors">
                    {j.term}
                    <HelpCircle className="h-3.5 w-3.5 text-primary/80" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs text-xs">
                  {j.definition}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} feature={upgradeFeature} />
    </div>
  );
};

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div>
    <p className="text-2xl font-bold text-primary">{value}</p>
    <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{label}</p>
  </div>
);

export default Dashboard;
