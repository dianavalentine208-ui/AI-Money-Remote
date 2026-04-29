import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarClock, Check } from "lucide-react";

interface VideoScheduleSlot {
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  platform: string;
}

interface VideoSchedulerProps {
  fields: Record<string, string>;
  updateField: (key: string, value: string) => void;
}

const PLATFORMS = ["YouTube", "TikTok", "Instagram", "X / Twitter", "LinkedIn"];
const DEFAULT_SLOTS: VideoScheduleSlot[] = Array.from({ length: 5 }, (_, i) => ({
  title: "",
  date: "",
  time: "07:00",
  platform: "YouTube",
}));

export const VideoScheduler = ({ fields, updateField }: VideoSchedulerProps) => {
  const [slots, setSlots] = useState<VideoScheduleSlot[]>(DEFAULT_SLOTS);

  useEffect(() => {
    const raw = fields["video_schedule"];
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === 5) setSlots(parsed);
    } catch {
      /* ignore invalid saved JSON */
    }
  }, [fields]);

  const updateSlot = (idx: number, key: keyof VideoScheduleSlot, value: string) => {
    const next = slots.map((s, i) => (i === idx ? { ...s, [key]: value } : s));
    setSlots(next);
    updateField("video_schedule", JSON.stringify(next));
  };

  const autofillWeekdays = () => {
    const today = new Date();
    // find next Monday
    const day = today.getDay();
    const daysUntilMon = (8 - day) % 7 || 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() + daysUntilMon);
    const next = slots.map((s, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      return { ...s, date: iso, time: s.time || "07:00" };
    });
    setSlots(next);
    updateField("video_schedule", JSON.stringify(next));
  };

  const filledCount = slots.filter((s) => s.date && s.title).length;

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold">📅 Schedule Your First 5 Videos</h4>
        </div>
        <Button size="sm" variant="outline" className="h-7 text-xs border-primary/30 text-primary hover:bg-primary/10" onClick={autofillWeekdays}>
          Auto-fill Mon–Fri
        </Button>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Lock in dates, times, and platforms. Posting at the same time each day trains the algorithm.
      </p>

      <div className="space-y-2">
        {slots.map((slot, idx) => (
          <div key={idx} className="rounded-lg border border-border/40 bg-background/60 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Video {idx + 1}</span>
              {slot.date && slot.title && <Check className="h-3.5 w-3.5 text-primary" />}
            </div>
            <div className="space-y-1">
              <Label htmlFor={`video-sched-${idx}-title`} className="text-[10px] text-muted-foreground">
                Title
              </Label>
              <Input
                id={`video-sched-${idx}-title`}
                name={`video_schedule_${idx}_title`}
                value={slot.title}
                onChange={(e) => updateSlot(idx, "title", e.target.value)}
                placeholder="Video title or hook…"
                className="h-8 text-xs bg-background/50"
                maxLength={120}
                autoComplete="off"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1 min-w-0">
                <Label htmlFor={`video-sched-${idx}-date`} className="text-[10px] text-muted-foreground">
                  Date
                </Label>
                <Input
                  id={`video-sched-${idx}-date`}
                  name={`video_schedule_${idx}_date`}
                  type="date"
                  value={slot.date}
                  onChange={(e) => updateSlot(idx, "date", e.target.value)}
                  className="h-8 text-xs bg-background/50"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-1 min-w-0">
                <Label htmlFor={`video-sched-${idx}-time`} className="text-[10px] text-muted-foreground">
                  Time
                </Label>
                <Input
                  id={`video-sched-${idx}-time`}
                  name={`video_schedule_${idx}_time`}
                  type="time"
                  value={slot.time}
                  onChange={(e) => updateSlot(idx, "time", e.target.value)}
                  className="h-8 text-xs bg-background/50"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-1 min-w-0">
                <Label htmlFor={`video-sched-${idx}-platform`} className="text-[10px] text-muted-foreground">
                  Platform
                </Label>
                <select
                  id={`video-sched-${idx}-platform`}
                  name={`video_schedule_${idx}_platform`}
                  value={slot.platform}
                  onChange={(e) => updateSlot(idx, "platform", e.target.value)}
                  className="h-8 text-xs bg-background/50 border border-input rounded-md px-2 w-full"
                  autoComplete="off"
                >
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground/80 text-center">
        {filledCount} of 5 scheduled
      </p>
    </div>
  );
};
