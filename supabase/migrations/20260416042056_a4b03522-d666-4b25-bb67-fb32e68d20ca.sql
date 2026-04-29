
CREATE TABLE public.launchpad_journal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  day INTEGER NOT NULL,
  notes TEXT,
  field_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, day)
);

ALTER TABLE public.launchpad_journal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journal" ON public.launchpad_journal FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own journal" ON public.launchpad_journal FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own journal" ON public.launchpad_journal FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own journal" ON public.launchpad_journal FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_launchpad_journal_updated_at
  BEFORE UPDATE ON public.launchpad_journal
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
