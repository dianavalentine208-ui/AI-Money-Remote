CREATE POLICY "Users can delete own persona jobs"
ON public.persona_jobs
FOR DELETE
USING (auth.uid() = user_id);