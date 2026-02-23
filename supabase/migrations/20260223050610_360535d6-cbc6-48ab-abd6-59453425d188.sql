
-- Create insights table for dashboard data
CREATE TABLE public.insights (
  id SERIAL PRIMARY KEY,
  end_year TEXT DEFAULT '',
  intensity INTEGER DEFAULT 0,
  sector TEXT DEFAULT '',
  topic TEXT DEFAULT '',
  insight TEXT DEFAULT '',
  url TEXT DEFAULT '',
  region TEXT DEFAULT '',
  start_year TEXT DEFAULT '',
  impact TEXT DEFAULT '',
  added TEXT DEFAULT '',
  published TEXT DEFAULT '',
  country TEXT DEFAULT '',
  relevance INTEGER DEFAULT 0,
  pestle TEXT DEFAULT '',
  source TEXT DEFAULT '',
  title TEXT DEFAULT '',
  likelihood INTEGER DEFAULT 0
);

-- Enable RLS but allow public read access (this is public dashboard data)
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on insights"
  ON public.insights
  FOR SELECT
  USING (true);
