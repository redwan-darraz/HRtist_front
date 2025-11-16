-- Create candidates table
CREATE TABLE IF NOT EXISTS public.candidates (
  id BIGSERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  prenom TEXT,
  email TEXT NOT NULL,
  telephone TEXT,
  numero TEXT,
  poste TEXT,
  statut TEXT,
  competences TEXT[],
  skills TEXT[],
  formations TEXT[],
  experiences TEXT[],
  business_strengths TEXT,
  business_attention_point TEXT,
  technical_strengths TEXT,
  technical_attention_point TEXT,
  fit_attention_point TEXT,
  fit_strengths TEXT,
  description TEXT,
  date_candidature TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create processes table
CREATE TABLE IF NOT EXISTS public.processes (
  id BIGSERIAL PRIMARY KEY,
  name_process TEXT NOT NULL,
  job_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create interviews table
CREATE TABLE IF NOT EXISTS public.interviews (
  id BIGSERIAL PRIMARY KEY,
  candidate_id BIGINT NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  type TEXT,
  commentaires TEXT,
  recruiter_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create many-to-many relationship table between candidates and processes
CREATE TABLE IF NOT EXISTS public.candidate_processes (
  candidate_id BIGINT NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  process_id BIGINT NOT NULL REFERENCES public.processes(id) ON DELETE CASCADE,
  PRIMARY KEY (candidate_id, process_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_processes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your security requirements)
-- Candidates policies
CREATE POLICY "Allow public read access to candidates"
  ON public.candidates FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to candidates"
  ON public.candidates FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to candidates"
  ON public.candidates FOR UPDATE
  USING (true);

-- Processes policies
CREATE POLICY "Allow public read access to processes"
  ON public.processes FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to processes"
  ON public.processes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to processes"
  ON public.processes FOR UPDATE
  USING (true);

-- Interviews policies
CREATE POLICY "Allow public read access to interviews"
  ON public.interviews FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to interviews"
  ON public.interviews FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to interviews"
  ON public.interviews FOR UPDATE
  USING (true);

-- Candidate_processes policies
CREATE POLICY "Allow public read access to candidate_processes"
  ON public.candidate_processes FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to candidate_processes"
  ON public.candidate_processes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to candidate_processes"
  ON public.candidate_processes FOR DELETE
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_candidates_nom ON public.candidates(nom);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON public.candidates(email);
CREATE INDEX IF NOT EXISTS idx_interviews_candidate_id ON public.interviews(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_processes_candidate_id ON public.candidate_processes(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_processes_process_id ON public.candidate_processes(process_id);