
DROP POLICY "Users can view cinematic clips" ON storage.objects;
CREATE POLICY "Authenticated users can view cinematic clips" ON storage.objects FOR SELECT USING (bucket_id = 'cinematic-clips' AND auth.role() = 'authenticated');
