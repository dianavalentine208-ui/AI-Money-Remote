import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function LaunchpadProgressBar() {
  const { user } = useAuth();

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
  const pct = Math.round((completedCount / 30) * 100);

  return (
    <div className="border-b border-border/30 bg-card/40 backdrop-blur-sm">
      <div className="px-4 sm:px-6 py-3 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-1.5 text-xs">
          <span className="font-medium text-foreground/80">
            Launchpad Progress: <span className="text-primary font-semibold">Day {currentDay} of 30</span>
          </span>
          <span className="text-muted-foreground tabular-nums">{pct}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-gradient-gold transition-all duration-500 shadow-gold"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
