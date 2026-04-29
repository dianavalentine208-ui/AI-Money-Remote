import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X, Sparkles, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const CinematicVibes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [selectedClip, setSelectedClip] = useState<any>(null);
  const [promptInput, setPromptInput] = useState("");

  const { data: clips, isLoading } = useQuery({
    queryKey: ["cinematic_clips", user?.id],
    queryFn: async () => {
      const { data: seedClips } = await supabase
        .from("cinematic_clips")
        .select("*")
        .eq("is_seed", true)
        .order("created_at", { ascending: true });

      let userClips: any[] = [];
      if (user) {
        const { data } = await supabase
          .from("cinematic_clips")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_seed", false)
          .order("created_at", { ascending: false });
        userClips = data || [];
      }

      return [...userClips, ...(seedClips || [])];
    },
  });

  const handleGenerate = async () => {
    if (!user) {
      toast.error("Please sign in to generate clips");
      return;
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-clip", {
        body: { prompt: promptInput },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(`"${data.clip.title}" created!`);
      setPromptInput("");
      queryClient.invalidateQueries({ queryKey: ["cinematic_clips"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to generate clip");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 py-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Cinematic Vibe Library</h1>
        <p className="text-muted-foreground mb-8">AI-generated B-roll clips ready for your content. Click any clip to watch.</p>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-video rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {clips?.map((clip) => (
              <ClipCard key={clip.id} clip={clip} onClick={() => setSelectedClip(clip)} />
            ))}
          </div>
        )}

        {/* Generate section */}
        <div className="mt-10 max-w-lg mx-auto space-y-2">
          <Label htmlFor="cinematic-scene-prompt" className="text-sm">
            Scene description
          </Label>
          <div className="flex gap-2">
            <Input
              id="cinematic-scene-prompt"
              name="cinematic_prompt"
              type="text"
              autoComplete="off"
              placeholder="Describe a scene… e.g. 'walking a dog in the park'"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="flex-1 bg-muted/50 border-border text-sm"
              onKeyDown={(e) => e.key === "Enter" && !generating && handleGenerate()}
            />
            <Button variant="hero" onClick={handleGenerate} disabled={generating}>
              {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
              Generate
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Generates a cinematic clip concept with an AI-generated preview image.
          </p>
        </div>

      {selectedClip && (
        <ClipModal clip={selectedClip} onClose={() => setSelectedClip(null)} />
      )}
    </div>
  );
};

// High-quality lifestyle posters AND looping atmospheric videos.
// Same-origin preview files so cards never all collapse onto one remote URL when CDNs block/fail.
type MediaItem = { poster: string; video: string };
type Lifestyle = MediaItem & { match: RegExp };

const publicBase = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

/** Bundled with the app — reliable in incognito / strict networks. Add more files under public/cinematic-previews/ to grow variety. */
const STOCK_VIDEOS = [`${publicBase}cinematic-previews/0.mp4`, `${publicBase}cinematic-previews/2.mp4`];

const stockByIndex = (i: number) => STOCK_VIDEOS[((i % STOCK_VIDEOS.length) + STOCK_VIDEOS.length) % STOCK_VIDEOS.length];

const LIFESTYLE_MEDIA: Lifestyle[] = [
  { match: /coffee|cozy|cafe|latte|espresso|warm drink/i, poster: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=450&fit=crop", video: stockByIndex(0) },
  { match: /forest|woods|tree|hike|trail|nature walk/i, poster: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=450&fit=crop", video: stockByIndex(1) },
  { match: /ocean|wave|sea|beach|shore|tide/i, poster: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=450&fit=crop", video: stockByIndex(2) },
  { match: /city|skyline|urban|downtown|metropolis/i, poster: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=450&fit=crop", video: stockByIndex(3) },
  { match: /sunset|sunrise|dusk|dawn|golden hour|amber|crimson|orange sky/i, poster: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=450&fit=crop", video: stockByIndex(4) },
  { match: /neon|night|nightlife|cyber|glow|vivid lights/i, poster: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=450&fit=crop", video: stockByIndex(5) },
  { match: /rain|storm|drizzle|wet|reflection/i, poster: "https://images.unsplash.com/photo-1438449805896-28a666819a20?w=800&h=450&fit=crop", video: stockByIndex(6) },
  { match: /desk|office|workspace|laptop|focus/i, poster: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=450&fit=crop", video: stockByIndex(7) },
  { match: /vintage|retro|analog|nostalgia|film grain/i, poster: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=450&fit=crop", video: stockByIndex(8) },
  { match: /azure|sip|drink|bar|cocktail/i, poster: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=450&fit=crop", video: stockByIndex(9) },
  { match: /symmetrical|architecture|building|geometric/i, poster: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=450&fit=crop", video: stockByIndex(10) },
  { match: /mountain|peak|alpine|snow|landscape/i, poster: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=450&fit=crop", video: stockByIndex(11) },
  { match: /sky|cloud|aerial|drone|above/i, poster: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=450&fit=crop", video: stockByIndex(12) },
  { match: /people|crowd|street life|portrait|stranger/i, poster: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=450&fit=crop", video: stockByIndex(13) },
  { match: /candle|fire|flame|ember|hearth/i, poster: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=450&fit=crop", video: stockByIndex(14) },
];

// Mood-keyed pools: when keyword search fails, mood narrows the vibe.
const MOOD_MEDIA: Record<string, MediaItem[]> = {
  warm: [LIFESTYLE_MEDIA[0], LIFESTYLE_MEDIA[4], LIFESTYLE_MEDIA[14]],
  serene: [LIFESTYLE_MEDIA[1], LIFESTYLE_MEDIA[2], LIFESTYLE_MEDIA[11]],
  electric: [LIFESTYLE_MEDIA[3], LIFESTYLE_MEDIA[5]],
  dramatic: [LIFESTYLE_MEDIA[6], LIFESTYLE_MEDIA[5], LIFESTYLE_MEDIA[14]],
  nostalgic: [LIFESTYLE_MEDIA[8], LIFESTYLE_MEDIA[0], LIFESTYLE_MEDIA[6]],
  energetic: [LIFESTYLE_MEDIA[3], LIFESTYLE_MEDIA[13]],
  dreamy: [LIFESTYLE_MEDIA[12], LIFESTYLE_MEDIA[4], LIFESTYLE_MEDIA[11]],
  cinematic: [LIFESTYLE_MEDIA[3], LIFESTYLE_MEDIA[10], LIFESTYLE_MEDIA[11]],
  cozy: [LIFESTYLE_MEDIA[0], LIFESTYLE_MEDIA[7], LIFESTYLE_MEDIA[14]],
  moody: [LIFESTYLE_MEDIA[5], LIFESTYLE_MEDIA[6], LIFESTYLE_MEDIA[8]],
};

const FALLBACK_POSTER = "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=450&fit=crop";
const FALLBACK_VIDEO = STOCK_VIDEOS[0] ?? "";

const isSeedClipRow = (clip: any) =>
  clip?.is_seed === true ||
  clip?.is_seed === 1 ||
  String(clip?.is_seed).toLowerCase() === "true";

/** Seed inserts omit user_id (NULL). Use this if `is_seed` is missing from an API client. */
const isCuratedLibraryRow = (clip: any) => isSeedClipRow(clip) || clip?.user_id == null;

// Deterministic hash so a given clip id always maps to the same pool index.
const hashStr = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value);

const resolveStoredVideoUrl = (filePath?: string | null): string | null => {
  if (!filePath) return null;

  const normalized = filePath.trim();
  if (!normalized) return null;
  if (isHttpUrl(normalized)) return normalized;
  if (normalized.startsWith("/__l5e/")) return null;

  const storagePath = normalized.replace(/^\/+/, "").replace(/^cinematic-clips\//, "");
  if (!storagePath) return null;

  const { data } = supabase.storage.from("cinematic-clips").getPublicUrl(storagePath);
  return data.publicUrl || null;
};

/** Shared demo URLs from migrations / backfills — not unique per clip; do not use as sole video source. */
const isSharedDemoLibraryUrl = (url: string) =>
  url.includes("commondatastorage.googleapis.com/gtv-videos-bucket") ||
  url.includes("storage.googleapis.com/gtv-videos-bucket/sample");

const stockVideoForClip = (clip: any): string => {
  const key = String(clip?.id ?? clip?.title ?? clip?.description ?? clip?.created_at ?? "x");
  return STOCK_VIDEOS[hashStr(key) % STOCK_VIDEOS.length] ?? FALLBACK_VIDEO;
};

const getMedia = (clip: any): MediaItem => {
  const storedVideo = resolveStoredVideoUrl(clip.file_path);
  const haystack = `${clip.title || ""} ${clip.description || ""} ${clip.mood || ""}`.toLowerCase();

  // Seed library rows often share the same few backfilled demo URLs + thumbnail:
  // always map each seed to its own stable stock file so previews differ.
  if (isCuratedLibraryRow(clip)) {
    const keywordMatch = LIFESTYLE_MEDIA.find((p) => p.match.test(haystack));
    if (keywordMatch) {
      return {
        poster: clip.thumbnail_url || keywordMatch.poster,
        video: stockVideoForClip(clip),
      };
    }
    const moodKey = (clip.mood || "").toLowerCase().trim();
    const moodPool = MOOD_MEDIA[moodKey];
    if (moodPool?.length) {
      const pick = moodPool[hashStr(clip.id || clip.title || "x") % moodPool.length];
      return {
        poster: clip.thumbnail_url || pick.poster,
        video: stockVideoForClip(clip),
      };
    }
    const pick = LIFESTYLE_MEDIA[hashStr(clip.id || clip.title || "x") % LIFESTYLE_MEDIA.length];
    return {
      poster: clip.thumbnail_url || pick.poster || FALLBACK_POSTER,
      video: stockVideoForClip(clip),
    };
  }

  // User clips: real Supabase storage uploads should play as stored.
  if (storedVideo && clip.thumbnail_url && !isSharedDemoLibraryUrl(storedVideo)) {
    return { poster: clip.thumbnail_url, video: storedVideo };
  }

  // 2. Try keyword match across title + description + mood.
  const keywordMatch = LIFESTYLE_MEDIA.find((p) => p.match.test(haystack));
  if (keywordMatch) {
    return {
      poster: clip.thumbnail_url || keywordMatch.poster,
      video: storedVideo && !isSharedDemoLibraryUrl(storedVideo) ? storedVideo : keywordMatch.video,
    };
  }

  // 3. Try mood pool.
  const moodKey = (clip.mood || "").toLowerCase().trim();
  const moodPool = MOOD_MEDIA[moodKey];
  if (moodPool && moodPool.length) {
    const pick = moodPool[hashStr(clip.id || clip.title || "x") % moodPool.length];
    return {
      poster: clip.thumbnail_url || pick.poster,
      video: storedVideo && !isSharedDemoLibraryUrl(storedVideo) ? storedVideo : pick.video,
    };
  }

  // 4. Deterministic fallback across the entire pool — never the same clip twice for different ids.
  const pick = LIFESTYLE_MEDIA[hashStr(clip.id || clip.title || "x") % LIFESTYLE_MEDIA.length];
  return {
    poster: clip.thumbnail_url || pick.poster || FALLBACK_POSTER,
    video: storedVideo && !isSharedDemoLibraryUrl(storedVideo) ? storedVideo : pick.video || FALLBACK_VIDEO,
  };
};

const rotateBySeed = <T,>(arr: T[], seed: string): T[] => {
  if (!arr.length) return arr;
  const start = hashStr(seed || "x") % arr.length;
  return [...arr.slice(start), ...arr.slice(0, start)];
};

const getStartOffset = (seed: string): number => (hashStr(seed || "x") % 90) / 10;

const buildSourceQueue = (primary: string, seed: string): string[] => {
  const rotatedFallbacks = rotateBySeed(STOCK_VIDEOS, seed);
  const queue = [primary, ...rotatedFallbacks];
  return queue.filter((src, idx) => Boolean(src) && queue.indexOf(src) === idx);
};

const ClipCard = ({ clip, onClick }: { clip: any; onClick: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { poster, video } = getMedia(clip);
  const clipSeed = String(clip?.id || clip?.title || clip?.description || "x");
  const [sourceQueue, setSourceQueue] = useState<string[]>(() => buildSourceQueue(video, clipSeed));
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const videoSrc = sourceQueue[sourceIndex] || FALLBACK_VIDEO;
  const startOffset = getStartOffset(clipSeed);

  useEffect(() => {
    setSourceQueue(buildSourceQueue(video, clipSeed));
    setSourceIndex(0);
    setFailed(false);
  }, [video, clipSeed]);

  return (
    <div
      className="group relative aspect-video rounded-lg overflow-hidden cursor-pointer border border-border/30 hover:border-primary/40 transition-all bg-black"
      onClick={onClick}
      onMouseEnter={() => { videoRef.current?.play().catch(() => {}); }}
      onMouseLeave={() => { if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; } }}
    >
      {/* Poster always renders — never a black screen */}
      <img
        src={poster}
        alt={clip.title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_POSTER; }}
      />

      {/* Atmospheric loop appears on hover */}
      <video
        ref={videoRef}
        src={videoSrc}
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedMetadata={() => {
          const v = videoRef.current;
          if (!v) return;
          const safeOffset = Math.min(startOffset, Math.max(0, (v.duration || 0) - 0.2));
          if (Number.isFinite(safeOffset) && safeOffset > 0) v.currentTime = safeOffset;
        }}
        onError={() => {
          if (sourceIndex < sourceQueue.length - 1) {
            setSourceIndex((prev) => prev + 1);
            return;
          }
          setFailed(true);
        }}
      />
      {failed && (
        <div className="absolute top-2 right-2 text-[10px] bg-black/70 text-white/80 px-1.5 py-0.5 rounded">
          Preview unavailable
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
        <Play className="h-8 w-8 text-white drop-shadow-lg" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
        <p className="font-medium text-sm text-white">{clip.title}</p>
        <div className="flex items-center gap-2">
          <p className="text-xs text-white/70">{clip.duration}</p>
          <span className="text-[10px] bg-primary/30 text-primary px-1.5 py-0.5 rounded-full font-medium">▶ Preview</span>
        </div>
      </div>
    </div>
  );
};

const ClipModal = ({ clip, onClose }: { clip: any; onClose: () => void }) => {
  const { poster, video } = getMedia(clip);
  const clipSeed = String(clip?.id || clip?.title || clip?.description || "x");
  const [sourceQueue, setSourceQueue] = useState<string[]>(() => buildSourceQueue(video, clipSeed));
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const videoSrc = sourceQueue[sourceIndex] || FALLBACK_VIDEO;
  const startOffset = getStartOffset(clipSeed);

  useEffect(() => {
    setSourceQueue(buildSourceQueue(video, clipSeed));
    setSourceIndex(0);
    setFailed(false);
  }, [video, clipSeed]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="glass-card rounded-xl max-w-lg w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-3 right-3 text-muted-foreground hover:text-foreground z-10" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>

        <video
          src={videoSrc}
          poster={poster}
          controls
          autoPlay
          loop
          muted
          className="w-full rounded-lg bg-black aspect-video mb-4"
          playsInline
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            const safeOffset = Math.min(startOffset, Math.max(0, (v.duration || 0) - 0.2));
            if (Number.isFinite(safeOffset) && safeOffset > 0) {
              v.currentTime = safeOffset;
              v.play().catch(() => {});
            }
          }}
          onError={() => {
            if (sourceIndex < sourceQueue.length - 1) {
              setSourceIndex((prev) => prev + 1);
              return;
            }
            setFailed(true);
          }}
        />
        {failed && (
          <p className="text-xs text-amber-300 mb-2">
            Preview unavailable for this clip right now.
          </p>
        )}

        <h2 className="text-xl font-bold mb-1">{clip.title}</h2>
        {clip.mood && (
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">{clip.mood}</span>
        )}
        <p className="text-muted-foreground mt-3 text-sm">{clip.description || "No description available."}</p>
        <p className="text-xs text-muted-foreground mt-2">Duration: {clip.duration}</p>

        <p className="text-xs text-muted-foreground/60 mt-4 italic">
          🔊 Unmute and use the video controls above to enjoy with sound.
        </p>
      </div>
    </div>
  );
};

export default CinematicVibes;
