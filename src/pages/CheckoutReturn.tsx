import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap } from "lucide-react";
import { useInvalidateSubscription } from "@/hooks/useSubscription";

export default function CheckoutReturn() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const invalidate = useInvalidateSubscription();

  useEffect(() => {
    if (sessionId) {
      // Give webhook a moment to process, then invalidate cache
      const timer = setTimeout(() => invalidate(), 2000);
      return () => clearTimeout(timer);
    }
  }, [sessionId, invalidate]);

  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        {sessionId ? (
          <>
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground mb-8">
              Your plan is now active. Welcome to the creator elite.
            </p>
          </>
        ) : (
          <>
            <Zap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">No session found</h1>
            <p className="text-muted-foreground mb-8">
              It looks like you arrived here without completing checkout.
            </p>
          </>
        )}
        <Link to="/dashboard">
          <Button variant="hero" size="lg">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
