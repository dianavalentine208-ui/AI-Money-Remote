CREATE POLICY "Service role can manage clips"
ON public.cinematic_clips
FOR ALL
USING (auth.role() = 'service_role');