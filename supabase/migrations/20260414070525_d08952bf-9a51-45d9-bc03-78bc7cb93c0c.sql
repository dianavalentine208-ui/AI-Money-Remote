
-- persona_jobs table
CREATE TABLE public.persona_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'uploading',
  video_path text,
  result_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.persona_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own persona jobs" ON public.persona_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own persona jobs" ON public.persona_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own persona jobs" ON public.persona_jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage persona jobs" ON public.persona_jobs FOR ALL USING (auth.role() = 'service_role');

CREATE TRIGGER update_persona_jobs_updated_at BEFORE UPDATE ON public.persona_jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- cinematic_clips table
CREATE TABLE public.cinematic_clips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  title text NOT NULL,
  description text,
  mood text,
  gradient text NOT NULL DEFAULT 'from-slate-800/60 to-slate-700/20',
  duration text NOT NULL DEFAULT '0:10',
  file_path text,
  is_seed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cinematic_clips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view seed clips" ON public.cinematic_clips FOR SELECT USING (is_seed = true);
CREATE POLICY "Users can view own clips" ON public.cinematic_clips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own clips" ON public.cinematic_clips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own clips" ON public.cinematic_clips FOR DELETE USING (auth.uid() = user_id);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('persona-videos', 'persona-videos', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('cinematic-clips', 'cinematic-clips', true);

-- persona-videos storage policies
CREATE POLICY "Users can upload own persona videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'persona-videos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own persona videos" ON storage.objects FOR SELECT USING (bucket_id = 'persona-videos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own persona videos" ON storage.objects FOR UPDATE USING (bucket_id = 'persona-videos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own persona videos" ON storage.objects FOR DELETE USING (bucket_id = 'persona-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- cinematic-clips storage policies
CREATE POLICY "Users can upload own cinematic clips" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cinematic-clips' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view cinematic clips" ON storage.objects FOR SELECT USING (bucket_id = 'cinematic-clips');
CREATE POLICY "Users can delete own cinematic clips" ON storage.objects FOR DELETE USING (bucket_id = 'cinematic-clips' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Seed clips
INSERT INTO public.cinematic_clips (title, description, mood, gradient, duration, is_seed) VALUES
  ('Cozy Coffee', 'Steam rising from a ceramic mug in warm morning light', 'warm', 'from-amber-900/60 to-amber-800/20', '0:08', true),
  ('Morning Rain', 'Raindrops on a window with blurred city lights behind', 'calm', 'from-blue-900/60 to-blue-800/20', '0:12', true),
  ('Vintage Office', 'A retro typewriter on a wooden desk with soft shadows', 'nostalgic', 'from-stone-800/60 to-stone-700/20', '0:10', true),
  ('City Sunset', 'Golden hour skyline with silhouetted buildings', 'dramatic', 'from-orange-900/60 to-orange-800/20', '0:15', true),
  ('Forest Walk', 'Sunlight filtering through dense green canopy', 'peaceful', 'from-green-900/60 to-green-800/20', '0:11', true),
  ('Neon Streets', 'Rain-slicked urban road reflecting neon signs', 'electric', 'from-pink-900/60 to-purple-900/20', '0:09', true),
  ('Ocean Waves', 'Turquoise waves crashing on a sandy shore', 'serene', 'from-cyan-900/60 to-blue-900/20', '0:14', true),
  ('Desk Setup', 'Minimalist workspace with ambient LED lighting', 'focused', 'from-slate-800/60 to-slate-700/20', '0:07', true);
