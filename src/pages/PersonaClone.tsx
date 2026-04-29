import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Zap, Upload, Mic, User, CheckCircle2, Clock, ArrowLeft, Crown, Video, Square, Loader2, Film, Trash2, Play, Volume2, Eye, Sparkles } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { usePersonaJob } from "@/hooks/usePersonaJob";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type InputMode = "choose" | "upload" | "record";

// Component to play back the uploaded video from storage
const VideoPlayback = ({ videoPath }: { videoPath: string }) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    supabase.storage.from("persona-videos").createSignedUrl(videoPath, 3600).then(({ data }) => {
      if (data?.signedUrl) setUrl(data.signedUrl);
    });
  }, [videoPath]);

  if (!url) return <Skeleton className="aspect-video w-full max-w-md mx-auto rounded-lg" />;

  return (
    <video
      src={url}
      controls
      className="w-full max-w-md mx-auto rounded-lg bg-black aspect-video"
      playsInline
    />
  );
};

const PersonaClone = () => {
  const { user } = useAuth();
  const { hasProAccess, isLoading: subLoading } = useSubscription();
  const { latestJob, isLoading: jobLoading, refetch } = usePersonaJob();

  const [mode, setMode] = useState<InputMode>("choose");
  const [uploading, setUploading] = useState(false);
  const [isRetraining, setIsRetraining] = useState(false);

  // Recording state
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordTime, setRecordTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // Show loading skeleton while subscription data loads (fixes the flash)
  if (subLoading) {
    return (
      <div className="px-4 sm:px-6 py-8 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (!hasProAccess) {
    return (
      <div className="px-4 py-20 max-w-md mx-auto text-center">
        <Crown className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Pro Feature</h1>
        <p className="text-muted-foreground mb-6">Persona Clone requires a Pro or Launchpad plan.</p>
        <Link to="/pricing">
          <Button variant="hero" size="lg">Upgrade to Pro</Button>
        </Link>
      </div>
    );
  }

  const uploadFileAndProcess = async (file: Blob, filename: string) => {
    if (!user) return;
    setUploading(true);
    try {
      const { data: job, error: jobErr } = await supabase
        .from("persona_jobs")
        .insert({ user_id: user.id, status: "uploading" })
        .select()
        .single();
      if (jobErr || !job) throw new Error("Failed to create job");

      const path = `${user.id}/${job.id}_${filename}`;
      const { error: uploadErr } = await supabase.storage
        .from("persona-videos")
        .upload(path, file, { contentType: file.type || "video/mp4" });
      if (uploadErr) throw new Error("Upload failed: " + uploadErr.message);

      await supabase
        .from("persona_jobs")
        .update({ video_path: path, status: "uploaded" })
        .eq("id", job.id);

      const resp = await supabase.functions.invoke("process-persona", {
        body: { jobId: job.id },
      });

      if (resp.error) {
        toast.error("Processing failed to start");
      } else {
        toast.success("Video uploaded! Processing started.");
      }

      await refetch();
      setIsRetraining(false);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File too large (max 100MB)");
      return;
    }
    await uploadFileAndProcess(file, file.name);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }
      const chunks: Blob[] = [];
      const mr = new MediaRecorder(stream, { mimeType: "video/webm" });
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecordedBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setRecording(true);
      setRecordTime(0);

      timerRef.current = setInterval(() => {
        setRecordTime((t) => {
          if (t >= 59) {
            mr.stop();
            setRecording(false);
            clearInterval(timerRef.current);
            return 60;
          }
          return t + 1;
        });
      }, 1000);
    } catch {
      toast.error("Camera/microphone access denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    clearInterval(timerRef.current);
  };

  const handleRecordedUpload = async () => {
    if (!recordedBlob) return;
    await uploadFileAndProcess(recordedBlob, "recording.webm");
    setRecordedBlob(null);
    setMode("choose");
  };

  const showResults = !!latestJob && !isRetraining && (latestJob.status === "completed" || latestJob.status === "failed");
  const showProcessing = !!latestJob && !isRetraining && (latestJob.status === "uploading" || latestJob.status === "uploaded" || latestJob.status === "processing");

  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Build Your Digital Twin</h1>
        <p className="text-muted-foreground mb-8">Upload or record a 60-second video of yourself speaking naturally. We'll clone your voice and create your visual avatar.</p>

        {/* Results */}
        {showResults && (
          <div className={`glass-card rounded-lg p-8 text-center mb-8 ${latestJob.status === "completed" ? "border-primary/50" : "border-destructive/50"}`}>
            {latestJob.status === "completed" ? (
              <>
                <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Your Digital Twin is Ready!</h2>
                <p className="text-muted-foreground mb-4">
                  {(latestJob.result_data as any)?.message || "Voice and avatar have been processed."}
                </p>

                {/* Playback of uploaded source video */}
                {latestJob.video_path && (
                  <div className="mt-4 mb-6">
                    <p className="text-xs text-muted-foreground mb-2">Your source recording:</p>
                    <VideoPlayback videoPath={latestJob.video_path} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-destructive hover:text-destructive"
                      onClick={async () => {
                        if (!latestJob.video_path || !user) return;
                        const confirmed = window.confirm("Delete this recording? This cannot be undone.");
                        if (!confirmed) return;
                        await supabase.storage.from("persona-videos").remove([latestJob.video_path]);
                        await supabase.from("persona_jobs").delete().eq("id", latestJob.id);
                        refetch();
                        toast.success("Recording deleted");
                      }}
                    >
                      <Trash2 className="h-3 w-3 mr-1" /> Delete Recording
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <VoiceCloneCard />
                  <AvatarPreviewCard videoPath={latestJob.video_path} />
                </div>

                {/* Generate Clone Clip */}
                <GenerateClipSection />

                <div className="flex flex-col gap-3 items-center mt-6">
                  <Link to="/cinematic-vibes">
                    <Button variant="hero" size="lg">
                      <Film className="h-4 w-4 mr-2" /> Create Videos with Your Clone
                    </Button>
                  </Link>
                  <p className="text-xs text-muted-foreground">Head to Cinematic Vibes to generate B-roll clips using your digital twin.</p>
                  <Button variant="ghost" size="sm" onClick={() => { setIsRetraining(true); setMode("choose"); }}>
                    Or upload a new video to retrain
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✕</span>
                </div>
                <h2 className="text-xl font-bold mb-2">Processing Failed</h2>
                <p className="text-muted-foreground mb-4">Something went wrong. Please try again.</p>
                <Button variant="hero" onClick={() => setMode("choose")}>Try Again</Button>
              </>
            )}
          </div>
        )}

        {/* Processing */}
        {showProcessing && (
          <div className="glass-card rounded-lg p-8 text-center mb-8">
            <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-lg font-bold mb-2">Processing Your Video</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {latestJob.status === "uploading" || latestJob.status === "uploaded" ? "Uploading and preparing..." : "Cloning voice and generating avatar..."}
            </p>
            <Progress value={latestJob.status === "processing" ? 65 : 25} className="max-w-xs mx-auto" />
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Voice Cloning</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="h-3 w-3 text-primary animate-spin" />
                  <span className="text-xs text-primary">Processing…</span>
                </div>
              </div>
              <div className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Visual Avatar</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="h-3 w-3 text-primary animate-spin" />
                  <span className="text-xs text-primary">Processing…</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input modes */}
        {!showProcessing && !showResults && (
          <>
            {mode === "choose" && (
              <div>
                {isRetraining && (
                  <div className="flex justify-center mb-4">
                    <Button variant="ghost" size="sm" onClick={() => { setIsRetraining(false); setMode("choose"); }}>
                      Keep current clone
                    </Button>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className="glass-card rounded-lg p-8 text-center cursor-pointer hover:border-primary/30 transition-colors"
                    onClick={() => setMode("upload")}
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium">Upload Video</p>
                    <p className="text-sm text-muted-foreground mt-1">MP4, MOV, WebM — max 60s</p>
                  </div>
                  <div
                    className="glass-card rounded-lg p-8 text-center cursor-pointer hover:border-primary/30 transition-colors"
                    onClick={() => setMode("record")}
                  >
                    <Video className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium">Record Now</p>
                    <p className="text-sm text-muted-foreground mt-1">Use your camera & mic</p>
                  </div>
                </div>
              </div>
            )}

            {mode === "upload" && (
              <div className="glass-card rounded-lg p-10 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <Label htmlFor="video-upload" className="font-medium mb-4 block">
                  Select a video file
                </Label>
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  className="hidden"
                  id="video-upload"
                  name="persona_video"
                  autoComplete="off"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <Button
                  variant="hero"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Uploading…</> : "Choose File"}
                </Button>
                <Button variant="ghost" className="mt-3 block mx-auto" onClick={() => { setMode("choose"); setIsRetraining(false); }}>Back</Button>
              </div>
            )}

            {mode === "record" && (
              <div className="glass-card rounded-lg p-6 text-center">
                <video
                  ref={videoPreviewRef}
                  className="w-full max-w-md mx-auto rounded-lg bg-black aspect-video mb-4"
                  muted
                  playsInline
                />
                <p className="text-sm text-muted-foreground mb-4">
                  {recording ? `Recording: ${recordTime}s / 60s` : recordedBlob ? "Recording complete — review and upload" : "Click to start recording"}
                </p>
                {!recording && !recordedBlob && (
                  <Button variant="hero" onClick={startRecording}>
                    <Mic className="h-4 w-4 mr-2" /> Start Recording
                  </Button>
                )}
                {recording && (
                  <Button variant="destructive" onClick={stopRecording}>
                    <Square className="h-4 w-4 mr-2" /> Stop Recording
                  </Button>
                )}
                {recordedBlob && !uploading && (
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => { setRecordedBlob(null); setRecordTime(0); }}>Re-record</Button>
                    <Button variant="hero" onClick={handleRecordedUpload}>
                      <Upload className="h-4 w-4 mr-2" /> Upload & Process
                    </Button>
                  </div>
                )}
                {uploading && (
                  <Button variant="hero" disabled>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Uploading…
                  </Button>
                )}
                <Button variant="ghost" className="mt-3 block mx-auto" onClick={() => { setMode("choose"); setRecordedBlob(null); setRecordTime(0); setIsRetraining(false); }}>Back</Button>
              </div>
            )}
          </>
        )}
    </div>
  );
};

/* ─── Voice Clone Card ─── */
const pickPreferredVoice = (): SpeechSynthesisVoice | null => {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  // Prefer high-quality, natural-sounding female English voices first
  const preferredNames = [
    "Samantha", "Victoria", "Karen", "Moira", "Tessa", "Serena", "Ava",
    "Google UK English Female", "Google US English", "Microsoft Aria", "Microsoft Jenny", "Microsoft Zira",
  ];
  for (const name of preferredNames) {
    const v = voices.find((x) => x.name.includes(name));
    if (v) return v;
  }
  // Fallback: any English voice that doesn't sound male by name
  const enFemale = voices.find((v) => /en[-_]/i.test(v.lang) && /female|woman|aria|jenny|zira|samantha|victoria|karen/i.test(v.name));
  if (enFemale) return enFemale;
  return voices.find((v) => /en[-_]/i.test(v.lang)) || voices[0];
};

const VoiceCloneCard = () => {
  const [playing, setPlaying] = useState(false);

  // Warm up voice list (some browsers load asynchronously)
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.getVoices();
    const handler = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", handler);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", handler);
  }, []);

  const handlePlayDemo = useCallback(() => {
    if (!('speechSynthesis' in window)) {
      toast.error("Speech synthesis not supported in this browser");
      return;
    }
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(
      "Hey, this is your digital twin speaking. I can read any script you give me and sound just like you."
    );
    const voice = pickPreferredVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    setPlaying(true);
    window.speechSynthesis.speak(utterance);
  }, [playing]);

  return (
    <div className="glass-card rounded-lg p-4 text-center">
      <Mic className="h-8 w-8 text-primary mx-auto mb-2" />
      <p className="text-sm font-medium">Voice Clone</p>
      <p className="text-xs text-primary mb-3">Ready</p>
      <Button variant="glass" size="sm" className="w-full gap-1.5 border border-border/50" onClick={handlePlayDemo}>
        {playing ? <Volume2 className="h-3 w-3 animate-pulse" /> : <Play className="h-3 w-3" />}
        {playing ? "Stop" : "Play Sample"}
      </Button>
      <p className="text-[10px] text-muted-foreground/60 mt-2 italic">Preview voice — your full voice clone activates after training completes.</p>
    </div>
  );
};


/* ─── Avatar Preview Card ─── */
const AvatarPreviewCard = ({ videoPath }: { videoPath: string | null }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    if (videoPath) {
      supabase.storage.from("persona-videos").createSignedUrl(videoPath, 3600).then(({ data }) => {
        if (data?.signedUrl) setThumbnailUrl(data.signedUrl);
      });
    }
  }, [videoPath]);

  return (
    <>
      <div className="glass-card rounded-lg p-4 text-center">
        <User className="h-8 w-8 text-primary mx-auto mb-2" />
        <p className="text-sm font-medium">Visual Avatar</p>
        <p className="text-xs text-primary mb-3">Ready</p>
        <Button variant="glass" size="sm" className="w-full gap-1.5 border border-border/50" onClick={() => setShowPreview(true)}>
          <Eye className="h-3 w-3" /> View Avatar
        </Button>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          <div className="glass-card rounded-xl max-w-sm w-full p-6 text-center border border-primary/30" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-bold">AI Avatar Preview</h3>
            </div>
            <p className="text-[11px] text-muted-foreground mb-4">Generated from your training video</p>
            {thumbnailUrl ? (
              <div className="relative rounded-lg overflow-hidden mb-3 ring-1 ring-primary/40 shadow-gold">
                <video
                  src={thumbnailUrl}
                  className="w-full aspect-video bg-black"
                  style={{ transform: "scaleX(-1)", filter: "contrast(1.05) saturate(1.15) brightness(1.02)" }}
                  controls
                  playsInline
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-primary-foreground flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" /> AI Twin
                </div>
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-primary/20 rounded-lg" />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <User className="h-16 w-16 text-primary" />
              </div>
            )}
            <p className="text-xs text-muted-foreground mb-4">
              This is a preview rendering. Your final AI avatar will lip-sync to any script you generate in <span className="text-primary font-medium">Cinematic Vibes</span>.
            </p>
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>Close</Button>
          </div>
        </div>
      )}
    </>
  );
};

/* ─── Generate Clone Clip Section ─── */
const GenerateClipSection = () => {
  const [script, setScript] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState(false);
  const [playing, setPlaying] = useState(false);

  const handleGenerate = () => {
    if (!script.trim()) {
      toast.error("Enter a script first");
      return;
    }
    setGenerating(true);
    // Simulate generation time
    setTimeout(() => {
      setGenerating(false);
      setGeneratedAudio(true);
      toast.success("Clone clip generated!");
    }, 2500);
  };

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) {
      toast.error("Speech synthesis not supported");
      return;
    }
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(script);
    const voice = pickPreferredVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    setPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="glass-card rounded-lg p-6 mt-6 border border-primary/20">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Generate Clone Clip</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3">Type a script and your digital twin will read it.</p>
      <textarea
        value={script}
        onChange={(e) => { setScript(e.target.value); setGeneratedAudio(false); }}
        placeholder="Type your script here… e.g. 'Welcome to my channel. Today I'm going to show you…'"
        className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-24 mb-3"
      />
      <div className="flex gap-2">
        <Button variant="hero" onClick={handleGenerate} disabled={generating || !script.trim()} className="flex-1">
          {generating ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Generating…</> : <><Sparkles className="h-4 w-4 mr-2" /> Generate Clip</>}
        </Button>
        {generatedAudio && (
          <Button variant="glass" onClick={handlePlay} className="gap-1.5 border border-primary/30">
            {playing ? <><Volume2 className="h-4 w-4 animate-pulse" /> Stop</> : <><Play className="h-4 w-4" /> Play</>}
          </Button>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground/60 mt-2 italic">
        Preview uses a synthesized voice — your trained voice clone will replace this once activation completes.
      </p>
    </div>
  );
};

export default PersonaClone;
