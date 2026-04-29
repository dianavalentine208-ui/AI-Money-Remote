
CREATE TABLE public.launchpad_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 30),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, day)
);

CREATE INDEX idx_launchpad_progress_user ON public.launchpad_progress(user_id);

ALTER TABLE public.launchpad_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON public.launchpad_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.launchpad_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own progress" ON public.launchpad_progress FOR DELETE USING (auth.uid() = user_id);
