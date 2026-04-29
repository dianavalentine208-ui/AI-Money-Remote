import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Settings as SettingsIcon, CreditCard, Crown, AlertTriangle, LifeBuoy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { getStripeEnvironment } from "@/lib/stripe";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { tier, hasProAccess, subscription, cancelAtPeriodEnd, periodEnd } = useSubscription();
  const [portalLoading, setPortalLoading] = useState(false);
  const [showCancelWarning, setShowCancelWarning] = useState(false);

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-portal-session", {
        body: {
          returnUrl: window.location.href,
          environment: getStripeEnvironment(),
        },
      });
      if (error || !data?.url) throw new Error("Could not open billing portal");
      window.open(data.url, "_blank");
    } catch (err: any) {
      toast.error(err.message || "Failed to open billing portal");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleCancelClick = () => {
    setShowCancelWarning(true);
  };

  const proceedToCancel = () => {
    setShowCancelWarning(false);
    openPortal();
  };

  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <SettingsIcon className="h-7 w-7 text-primary" /> Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage your account and subscription.</p>
        </div>

        {/* Account Info */}
        <section className="glass-card rounded-lg p-6 space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Account</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Signed in via email</p>
            </div>
            {tier !== "free" && (
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary uppercase flex items-center gap-1">
                <Crown className="h-3 w-3" /> {tier}
              </span>
            )}
          </div>
        </section>

        {/* Manage Subscription */}
        <section className="glass-card rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Manage Subscription
          </h2>

          {subscription ? (
            <div className="space-y-4">
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <span className="font-medium capitalize">{subscription.status}</span>
                </p>
                {periodEnd && (
                  <p>
                    <span className="text-muted-foreground">Current period ends:</span>{" "}
                    <span className="font-medium">{new Date(periodEnd).toLocaleDateString()}</span>
                  </p>
                )}
                {cancelAtPeriodEnd && (
                  <p className="text-destructive text-sm font-medium">
                    Your subscription is set to cancel at the end of this billing period.
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={openPortal} disabled={portalLoading} className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  {portalLoading ? "Opening…" : "Manage Subscription"}
                </Button>

                {!cancelAtPeriodEnd && (
                  <Button variant="outline" onClick={handleCancelClick} className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10">
                    Cancel Plan
                  </Button>
                )}
              </div>
            </div>
          ) : hasProAccess ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                You have lifetime access via the 30-Day Launchpad purchase. No recurring subscription to manage.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                You're currently on the free plan. Upgrade to unlock all tools.
              </p>
              <Link to="/pricing">
                <Button variant="hero" className="gap-2">
                  <Crown className="h-4 w-4" /> Upgrade to Pro
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Quick Links */}
        <section className="glass-card rounded-lg p-6 space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Quick Links</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/support">
              <Button variant="glass" size="sm" className="gap-1">
                <LifeBuoy className="h-4 w-4" /> Help & Support
              </Button>
            </Link>
            <Link to="/terms">
              <Button variant="ghost" size="sm">Terms of Service</Button>
            </Link>
            <Link to="/privacy">
              <Button variant="ghost" size="sm">Privacy Policy</Button>
            </Link>
          </div>
        </section>

      {/* Cancel Warning Dialog */}
      <AlertDialog open={showCancelWarning} onOpenChange={setShowCancelWarning}>
        <AlertDialogContent className="dark bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-amber-400" /> Wait! Before you go…
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground space-y-3">
              <p>
                If you cancel your subscription, you'll lose access to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Persona Clone</strong> — your Digital Twin</li>
                <li><strong>Affiliate Matchmaker</strong> — niche product finder</li>
                <li><strong>30-Day Launchpad</strong> — all your saved progress</li>
              </ul>
              <p className="text-sm">
                Your access will continue until the end of your current billing period. You can resubscribe anytime.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-primary text-primary-foreground hover:bg-primary/90">
              Keep My Plan
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={proceedToCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Continue to Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
