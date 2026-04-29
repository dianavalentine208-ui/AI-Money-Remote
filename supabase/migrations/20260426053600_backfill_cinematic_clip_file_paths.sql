-- Backfill playable video URLs for clips missing file_path values.
-- This keeps existing generated clips playable in the UI.
WITH pool AS (
  SELECT ARRAY[
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
  ]::text[] AS videos
),
targets AS (
  SELECT
    c.id,
    c.mood,
    -- Deterministic index from id so each clip always maps to same fallback video.
    ((('x' || substr(md5(c.id::text), 1, 8))::bit(32)::int & 2147483647) % 6) + 1 AS idx
  FROM public.cinematic_clips c
  WHERE c.file_path IS NULL
     OR btrim(c.file_path) = ''
     OR c.file_path LIKE '/__l5e/%'
)
UPDATE public.cinematic_clips AS c
SET file_path = CASE lower(coalesce(t.mood, ''))
  WHEN 'warm' THEN (ARRAY[(SELECT videos[1] FROM pool), (SELECT videos[3] FROM pool)])[((t.idx - 1) % 2) + 1]
  WHEN 'serene' THEN (ARRAY[(SELECT videos[2] FROM pool), (SELECT videos[6] FROM pool)])[((t.idx - 1) % 2) + 1]
  WHEN 'electric' THEN (ARRAY[(SELECT videos[4] FROM pool), (SELECT videos[5] FROM pool)])[((t.idx - 1) % 2) + 1]
  WHEN 'dramatic' THEN (ARRAY[(SELECT videos[5] FROM pool), (SELECT videos[6] FROM pool)])[((t.idx - 1) % 2) + 1]
  WHEN 'nostalgic' THEN (ARRAY[(SELECT videos[1] FROM pool), (SELECT videos[6] FROM pool)])[((t.idx - 1) % 2) + 1]
  WHEN 'energetic' THEN (ARRAY[(SELECT videos[3] FROM pool), (SELECT videos[4] FROM pool)])[((t.idx - 1) % 2) + 1]
  WHEN 'dreamy' THEN (ARRAY[(SELECT videos[2] FROM pool), (SELECT videos[5] FROM pool)])[((t.idx - 1) % 2) + 1]
  WHEN 'cinematic' THEN (ARRAY[(SELECT videos[4] FROM pool), (SELECT videos[6] FROM pool)])[((t.idx - 1) % 2) + 1]
  WHEN 'cozy' THEN (ARRAY[(SELECT videos[1] FROM pool), (SELECT videos[2] FROM pool)])[((t.idx - 1) % 2) + 1]
  WHEN 'moody' THEN (ARRAY[(SELECT videos[5] FROM pool), (SELECT videos[6] FROM pool)])[((t.idx - 1) % 2) + 1]
  ELSE (SELECT videos[t.idx] FROM pool)
END
FROM targets t
WHERE c.id = t.id;
