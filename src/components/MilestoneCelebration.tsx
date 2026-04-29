import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles } from "lucide-react";

interface MilestoneCelebrationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  daysCompleted: number;
}

export function MilestoneCelebration({ open, onOpenChange, daysCompleted }: MilestoneCelebrationProps) {
  const pct = Math.round((daysCompleted / 30) * 100);

  useEffect(() => {
    if (!open) return;
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ["#fbbf24", "#f59e0b", "#fde68a", "#fef3c7"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 75,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 75,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors,
    });
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center border-primary/40 bg-gradient-to-br from-card to-primary/5">
        <div className="flex flex-col items-center pt-4">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full" />
            <div className="relative h-20 w-20 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
              <Trophy className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-2">
            <Sparkles className="h-3 w-3" /> Milestone Reached <Sparkles className="h-3 w-3" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Day {daysCompleted} Complete!</h2>
          <p className="text-sm text-muted-foreground mb-1">
            You're <span className="text-primary font-semibold">{pct}% closer</span> to your passive income goal.
          </p>
          <p className="text-xs text-muted-foreground/80 mb-6">Keep the momentum — every day compounds.</p>
          <Button variant="hero" onClick={() => onOpenChange(false)} className="w-full">
            Keep Going
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
