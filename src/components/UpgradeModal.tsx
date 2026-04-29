import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: string;
  requiredTier?: "pro" | "launchpad";
}

export function UpgradeModal({ open, onOpenChange, feature, requiredTier = "pro" }: UpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark bg-card border-border text-foreground sm:max-w-md">
        <DialogHeader className="text-center items-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">Unlock {feature}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {requiredTier === "launchpad"
              ? "This feature is included in the 30-Day Launchpad plan."
              : "Upgrade to Pro to access this premium feature."}
          </DialogDescription>
        </DialogHeader>
        <div className="glass-card rounded-lg p-4 my-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">
              {requiredTier === "launchpad" ? "30-Day Launchpad — $97" : "Pro Plan — $29/mo"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {requiredTier === "launchpad"
              ? "Full roadmap, done-for-you setup, strategy call, and lifetime Pro access."
              : "Unlimited hooks, Persona Clone, Cinematic Library, Affiliate Matchmaker, and priority support."}
          </p>
        </div>
        <Link to="/pricing" onClick={() => onOpenChange(false)}>
          <Button variant="hero" className="w-full" size="lg">
            View Pricing
          </Button>
        </Link>
      </DialogContent>
    </Dialog>
  );
}
