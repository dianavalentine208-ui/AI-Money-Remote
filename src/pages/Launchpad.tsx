import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Lock, Quote } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { UpgradeModal } from "@/components/UpgradeModal";
import { MilestoneCelebration } from "@/components/MilestoneCelebration";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { phases, tasks } from "./launchpad/taskData";
import { DayCard } from "./launchpad/DayCard";

const Launchpad = () => {
  const { user } = useAuth();
  const { hasLaunchpadAccess } = useSubscription();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [milestoneDays, setMilestoneDays] = useState<number | null>(null);
  const isLocked = !hasLaunchpadAccess;
  const queryClient = useQueryClient();

  // Load checkbox progress
  const { data: savedProgress } = useQuery({
    queryKey: ["launchpad_progress", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from("launchpad_progress").select("day").eq("user_id", user.id);
      return data?.map((r: any) => r.day) || [];
    },
    enabled: !!user && hasLaunchpadAccess,
  });

  // Load journal entries
  const { data: journalEntries } = useQuery({
    queryKey: ["launchpad_journal", user?.id],
    queryFn: async () => {
      if (!user) return {};
      const { data } = await supabase.from("launchpad_journal").select("day, notes, field_data").eq("user_id", user.id);
      const map: Record<number, { notes: string; field_data: Record<string, string> }> = {};
      data?.forEach((r: any) => { map[r.day] = { notes: r.notes, field_data: r.field_data }; });
      return map;
    },
    enabled: !!user && hasLaunchpadAccess,
  });

  const completed = new Set(savedProgress || []);

  const toggle = useCallback(async (day: number) => {
    if (isLocked) { setUpgradeOpen(true); return; }
    if (!user) return;
    const wasCompleted = completed.has(day);
    if (wasCompleted) {
      await supabase.from("launchpad_progress").delete().eq("user_id", user.id).eq("day", day);
    } else {
      await supabase.from("launchpad_progress").insert({ user_id: user.id, day });
      // Fire milestone celebration when crossing a 5-day mark
      const newCount = completed.size + 1;
      if (newCount > 0 && newCount % 5 === 0) {
        setMilestoneDays(newCount);
      }
    }
    queryClient.invalidateQueries({ queryKey: ["launchpad_progress", user.id] });
  }, [isLocked, user, completed, queryClient]);

  const onJournalSaved = useCallback(() => {
    if (user) queryClient.invalidateQueries({ queryKey: ["launchpad_journal", user.id] });
  }, [user, queryClient]);

  const progress = Math.round((completed.size / tasks.length) * 100);

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Your 30-Day Roadmap</h1>
        <p className="text-muted-foreground text-sm mb-6">Expand each day for pro tips, journal notes, and action steps.</p>

        {/* Founder note */}
        <div className="relative mb-8 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-muted/30 p-5">
          <Quote className="absolute left-4 top-4 h-5 w-5 text-primary/40" />
          <p className="pl-8 text-sm italic text-foreground/80 leading-relaxed">
            "Welcome. You're not just building a channel; you're building a legacy. Let's take this one step at a time."
          </p>
          <p className="pl-8 mt-2 text-xs text-muted-foreground">— The Founder</p>
        </div>

        {isLocked && (
          <div className="glass-card rounded-xl p-6 mb-8 text-center border-primary/20">
            <Lock className="h-10 w-10 text-primary mx-auto mb-3" />
            <h2 className="font-bold text-lg mb-1">Launchpad is Locked</h2>
            <p className="text-muted-foreground text-sm mb-4">Purchase the 30-Day Launchpad plan to unlock your full roadmap and start tracking progress.</p>
            <Link to="/pricing"><Button variant="hero">Unlock for $97</Button></Link>
          </div>
        )}

        {/* Progress bar */}
        <div className="glass-card rounded-xl p-5 mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{completed.size} of {tasks.length} days complete</span>
            <span className="text-xs text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-secondary [&>div]:bg-gradient-gold" />
        </div>

        {/* Phases */}
        <div className={`relative ${isLocked ? "opacity-50 pointer-events-none select-none" : ""}`}>
          {phases.map((phase) => {
            const phaseTasks = tasks.filter((t) => t.day >= phase.days[0] && t.day <= phase.days[1]);
            return (
              <div key={phase.name} className="mb-10 last:mb-0">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">{phase.label}</span>
                  <span className="text-xs font-semibold text-foreground">{phase.name}</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="relative pl-8">
                  <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-3">
                    {phaseTasks.map((t) => (
                      <DayCard
                        key={t.day}
                        task={t}
                        done={completed.has(t.day)}
                        onToggle={toggle}
                        userId={user?.id}
                        isLocked={isLocked}
                        journalData={journalEntries?.[t.day]}
                        onJournalSaved={onJournalSaved}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} feature="30-Day Launchpad" requiredTier="launchpad" />
      <MilestoneCelebration
        open={milestoneDays !== null}
        onOpenChange={(o) => !o && setMilestoneDays(null)}
        daysCompleted={milestoneDays ?? 0}
      />
    </div>
  );
};

export default Launchpad;
