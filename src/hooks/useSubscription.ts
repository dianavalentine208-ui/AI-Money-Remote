import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type UserTier = "free" | "pro" | "launchpad";

export function useSubscription() {
  const { user } = useAuth();

  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["active", "trialing", "canceled"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: purchase, isLoading: purchaseLoading } = useQuery({
    queryKey: ["launchpad_purchase", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_id", user.id)
        .eq("price_id", "launchpad_onetime")
        .limit(1)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  // Check if subscription is actually active (including canceled with time remaining)
  const isSubActive = (() => {
    if (!subscription) return false;
    if (subscription.status === "active" || subscription.status === "trialing") return true;
    // Canceled but still within billing period
    if (subscription.status === "canceled" && subscription.current_period_end) {
      return new Date(subscription.current_period_end) > new Date();
    }
    return false;
  })();

  const hasProAccess = isSubActive || !!purchase;
  const hasLaunchpadAccess = !!purchase;

  const tier: UserTier = hasLaunchpadAccess ? "launchpad" : hasProAccess ? "pro" : "free";

  return {
    tier,
    hasProAccess,
    hasLaunchpadAccess,
    subscription,
    purchase,
    isLoading: subLoading || purchaseLoading,
    cancelAtPeriodEnd: subscription?.cancel_at_period_end ?? false,
    periodEnd: subscription?.current_period_end,
  };
}

export function useInvalidateSubscription() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["subscription"] });
    queryClient.invalidateQueries({ queryKey: ["launchpad_purchase"] });
  };
}
