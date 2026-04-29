import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lightbulb, ChevronDown, ExternalLink, Sparkles, BookOpen, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DayTask, getDayFields, fieldLabels, nicheOptions, hookTemplates, contentPillars } from "./taskData";
import { ContentAssemblyLine } from "./ContentAssemblyLine";
import { VideoScheduler } from "./VideoScheduler";

interface DayCardProps {
  task: DayTask;
  done: boolean;
  onToggle: (day: number) => void;
  userId: string | undefined;
  isLocked: boolean;
  journalData: { notes: string; field_data: Record<string, string> } | undefined;
  onJournalSaved: () => void;
}

/* ── Day 3: Niche Selection Grid ── */
const NicheGrid = ({ selected, onSelect }: { selected: string; onSelect: (v: string) => void }) => (
  <div>
    <label className="text-xs font-medium text-muted-foreground mb-2 block">🎯 Pick a High-Profit Niche</label>
    <div className="grid grid-cols-2 gap-2">
      {nicheOptions.map((n) => (
        <button
          key={n.name}
          onClick={() => onSelect(n.name)}
          className={`text-left rounded-lg border p-3 transition-all text-xs ${
            selected === n.name
              ? "border-primary bg-primary/10 ring-1 ring-primary/40"
              : "border-border/40 bg-background/50 hover:border-primary/30"
          }`}
        >
          <span className="text-base">{n.emoji}</span>
          <p className="font-semibold mt-1 text-foreground">{n.name}</p>
          <p className="text-muted-foreground mt-0.5 leading-snug">{n.description}</p>
        </button>
      ))}
    </div>
  </div>
);

/* ── Day 4: Hook Template Generator ── */
const HookGenerator = ({ onInsert }: { onInsert: (text: string) => void }) => {
  const [shown, setShown] = useState(false);
  return (
    <div>
      {!shown ? (
        <Button size="sm" variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/10" onClick={() => setShown(true)}>
          <Sparkles className="h-3.5 w-3.5" />
          Give me 5 Hook Templates
        </Button>
      ) : (
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground block">✍️ Click a template to add it to your notes</label>
          {hookTemplates.map((h, i) => (
            <button
              key={i}
              onClick={() => onInsert(h.template)}
              className="w-full text-left rounded-lg border border-border/40 bg-background/50 hover:border-primary/30 p-3 transition-all"
            >
              <p className="text-sm font-medium text-foreground">{h.template}</p>
              <p className="text-xs text-muted-foreground mt-1 italic">e.g. "{h.example}"</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Day 5/7: Content Pillar Helper ── */
const PillarHelper = ({ onInsert }: { onInsert: (text: string) => void }) => {
  const [shown, setShown] = useState(false);
  return (
    <div>
      {!shown ? (
        <Button size="sm" variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/10" onClick={() => setShown(true)}>
          <BookOpen className="h-3.5 w-3.5" />
          Help me choose content pillars
        </Button>
      ) : (
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground block">📚 What are Content Pillars?</label>
          <p className="text-xs text-foreground/70 leading-relaxed mb-2">
            Content pillars are 3-5 recurring themes you build all your content around. They keep you consistent and prevent creative burnout.
          </p>
          {contentPillars.map((p) => (
            <button
              key={p.name}
              onClick={() => onInsert(p.name)}
              className="w-full text-left rounded-lg border border-border/40 bg-background/50 hover:border-primary/30 p-3 transition-all"
            >
              <p className="text-sm font-semibold text-foreground">{p.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
              <p className="text-xs text-primary/80 mt-1">Examples: {p.examples.join(" · ")}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Sample Answer Box ── */
const SampleAnswer = ({ text }: { text: string }) => (
  <div className="rounded-lg border border-border/20 bg-muted/30 p-3 flex gap-2">
    <CheckCircle2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Sample Answer</p>
      <p className="text-xs text-foreground/60 leading-relaxed italic">{text}</p>
    </div>
  </div>
);

export const DayCard = ({ task, done, onToggle, userId, isLocked, journalData, onJournalSaved }: DayCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (journalData) {
      setNotes(journalData.notes || "");
      setFields(journalData.field_data || {});
    }
  }, [journalData]);

  const save = useCallback((newNotes: string, newFields: Record<string, string>) => {
    if (!userId || isLocked) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await supabase.from("launchpad_journal").upsert(
        { user_id: userId, day: task.day, notes: newNotes, field_data: newFields as any },
        { onConflict: "user_id,day" }
      );
      onJournalSaved();
    }, 1000);
  }, [userId, isLocked, task.day, onJournalSaved]);

  const updateNotes = (v: string) => { setNotes(v); save(v, fields); };
  const updateField = (key: string, v: string) => {
    const next = { ...fields, [key]: v };
    setFields(next);
    save(notes, next);
  };

  const appendToNotes = (text: string) => {
    const sep = notes ? "\n" : "";
    const newNotes = notes + sep + text;
    setNotes(newNotes);
    save(newNotes, fields);
  };

  const selectNiche = (niche: string) => {
    updateField("selected_niche", niche);
    if (!notes.includes(niche)) {
      appendToNotes(`Selected niche: ${niche}`);
    }
  };

  const extraFields = getDayFields(task.day);

  return (
    <div className="relative flex items-start gap-4">
      <div className={`absolute -left-8 top-4 h-[9px] w-[9px] rounded-full border-2 transition-colors ${done ? "border-primary bg-primary" : "border-muted-foreground bg-background"}`} />
      <div className="w-full glass-card rounded-xl overflow-hidden transition-colors hover:border-primary/30">
        {/* Header row */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full p-4 flex items-start gap-3 text-left"
        >
          <Checkbox
            checked={done}
            onCheckedChange={() => onToggle(task.day)}
            className="mt-0.5 shrink-0"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-semibold text-muted-foreground">DAY {task.day}</span>
            </div>
            <p className={`text-sm font-medium leading-snug ${done ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{task.description}</p>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 mt-1 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>

        {/* Expanded content */}
        {expanded && (
          <div className="px-4 pb-4 space-y-4 border-t border-border/30 pt-4">
            {/* Pro Tip */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex gap-2">
              <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/80 leading-relaxed"><span className="font-semibold text-primary">Pro Tip:</span> {task.proTip}</p>
            </div>

            {/* Day 3: Niche Grid */}
            {task.day === 3 && (
              <NicheGrid selected={fields["selected_niche"] || ""} onSelect={selectNiche} />
            )}

            {/* Day 4: Hook Templates */}
            {task.day === 4 && (
              <HookGenerator onInsert={appendToNotes} />
            )}

            {/* Day 5 or 7: Content Pillar Helper */}
            {(task.day === 5 || task.day === 7) && (
              <PillarHelper onInsert={(pillar) => appendToNotes(`Content Pillar: ${pillar}`)} />
            )}

            {/* Days 6-10: Content Assembly Line */}
            {task.day >= 6 && task.day <= 10 && (
              <ContentAssemblyLine
                niche={fields["selected_niche"] || ""}
                fields={fields}
                updateField={updateField}
                appendToNotes={appendToNotes}
                userId={userId}
              />
            )}

            {/* Day 15: Video Scheduler */}
            {task.day === 15 && (
              <VideoScheduler fields={fields} updateField={updateField} />
            )}

            {/* Action button */}
            {task.actionLabel && task.actionRoute && (
              <Link to={task.actionRoute}>
                <Button size="sm" variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/10">
                  <ExternalLink className="h-3.5 w-3.5" />
                  {task.actionLabel}
                </Button>
              </Link>
            )}

            {/* Journal */}
            <div>
              <Label htmlFor={`launchpad-d${task.day}-notes`} className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Notes & Insights
              </Label>
              <Textarea
                id={`launchpad-d${task.day}-notes`}
                name={`launchpad_notes_day_${task.day}`}
                autoComplete="off"
                value={notes}
                onChange={(e) => updateNotes(e.target.value)}
                placeholder="Write your thoughts for today…"
                className="min-h-[80px] bg-background/50 text-sm"
                disabled={isLocked}
                maxLength={2000}
              />
            </div>

            {/* Day-specific fields */}
            {extraFields.map((key) => {
              const fieldId = `launchpad-d${task.day}-field-${key.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
              return (
              <div key={key}>
                <Label htmlFor={fieldId} className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  {fieldLabels[key]}
                </Label>
                {key === "content_pillars" || key === "script_drafts" ? (
                  <Textarea
                    id={fieldId}
                    name={fieldId}
                    autoComplete="off"
                    value={fields[key] || ""}
                    onChange={(e) => updateField(key, e.target.value)}
                    placeholder={`Enter your ${fieldLabels[key].toLowerCase()}…`}
                    className="min-h-[60px] bg-background/50 text-sm"
                    disabled={isLocked}
                    maxLength={2000}
                  />
                ) : (
                  <Input
                    id={fieldId}
                    name={fieldId}
                    autoComplete="off"
                    value={fields[key] || ""}
                    onChange={(e) => updateField(key, e.target.value)}
                    placeholder={`Enter your ${fieldLabels[key].toLowerCase()}…`}
                    className="bg-background/50 text-sm"
                    disabled={isLocked}
                    maxLength={500}
                  />
                )}
              </div>
            );
            })}

            {/* Sample Answer — always visible */}
            {task.sampleAnswer && <SampleAnswer text={task.sampleAnswer} />}
          </div>
        )}
      </div>
    </div>
  );
};
