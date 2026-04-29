import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function usePersonaJob() {
  const { user } = useAuth();

  const { data: latestJob, isLoading, refetch } = useQuery({
    queryKey: ["persona_job", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("persona_jobs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
    refetchInterval: (query) => {
      const job = query.state.data;
      // Poll every 2s while uploading or processing
      if (job && (job.status === "uploading" || job.status === "processing")) {
        return 2000;
      }
      return false;
    },
  });

  return { latestJob, isLoading, refetch };
}
