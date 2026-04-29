import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCircle, Target, DollarSign, Film, Crown, CreditCard, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user } = useAuth();
  const { tier, hasProAccess } = useSubscription();

  const { data: journal } = useQuery({
    queryKey: ["launchpad_journal_snapshot", user?.id],
    queryFn: async () => {
      if (!user) return {} as Record<number, any>;
      const { data } = await supabase
        .from("launchpad_journal")
        .select("day, notes, field_data")
        .eq("user_id", user.id)
        .in("day", [1, 3]);
      const map: Record<number, any> = {};
      data?.forEach((r: any) => { map[r.day] = r; });
      return map;
    },
    enabled: !!user,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: clipCount } = useQuery({
    queryKey: ["clip_count", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count } = await supabase
        .from("cinematic_clips")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_seed", false);
      return count ?? 0;
    },
    enabled: !!user,
  });

  const day1 = journal?.[1];
  const day3 = journal?.[3];

  // Day 3 stores the chosen niche under field_data.selected_niche
  const niche =
    day3?.field_data?.selected_niche ||
    day3?.field_data?.niche ||
    "Not set yet — complete Day 3";

  // Day 1 collects the income goal in the free-form notes (sample answer prompt)
  const incomeGoal =
    day1?.field_data?.income_goal ||
    day1?.field_data?.goal ||
    (day1?.notes ? day1.notes.split("\n")[0].slice(0, 80) : "Not set yet — complete Day 1");

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Creator";
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "—";

  return (
    <div className="px-4 sm:px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-gradient-gold flex items-center justify-center text-2xl font-bold text-primary-foreground shrink-0">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            {displayName}
            {tier !== "free" && (
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                <Crown className="h-3 w-3" /> {tier}
              </span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Business Snapshot */}
      <section className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Business Snapshot</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SnapshotCard icon={Target} label="My Niche" value={niche} hint="From Day 3" link="/launchpad" />
          <SnapshotCard icon={DollarSign} label="Income Goal" value={incomeGoal} hint="From Day 1" link="/launchpad" />
          <SnapshotCard icon={Film} label="Total Clips Generated" value={String(clipCount ?? 0)} hint="Lifetime" link="/cinematic-vibes" />
        </div>
      </section>

      {/* Account info */}
      <section className="glass-card rounded-xl p-6 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Account</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <Row label="Email" value={user?.email || "—"} />
          <Row label="Member since" value={memberSince} />
          <Row label="Plan" value={tier === "free" ? "Free" : tier === "launchpad" ? "30-Day Launchpad" : "Pro"} />
          <Row label="Display name" value={displayName} />
        </div>
      </section>

      {/* Quick actions */}
      <section className="glass-card rounded-xl p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/settings"><Button variant="glass" size="sm" className="gap-2"><CreditCard className="h-4 w-4" /> Manage Billing</Button></Link>
          <Link to="/launchpad"><Button variant="glass" size="sm" className="gap-2"><Calendar className="h-4 w-4" /> Continue Roadmap</Button></Link>
          {!hasProAccess && (
            <Link to="/pricing"><Button variant="hero" size="sm" className="gap-2"><Crown className="h-4 w-4" /> Upgrade</Button></Link>
          )}
        </div>
      </section>
    </div>
  );
};

const SnapshotCard = ({ icon: Icon, label, value, hint, link }: { icon: any; label: string; value: string; hint: string; link: string }) => (
  <Link to={link} className="glass-card rounded-xl p-5 hover:border-primary/40 transition-colors block">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
    <p className="font-semibold text-base text-foreground line-clamp-2 break-words">{value}</p>
    <p className="text-[10px] text-muted-foreground mt-2">{hint}</p>
  </Link>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
    <p className="font-medium truncate">{value}</p>
  </div>
);

export default Profile;
