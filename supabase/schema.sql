-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (Syncs with Supabase Auth or local auth)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    platform TEXT NOT NULL, -- YouTube, Instagram, LinkedIn, Podcast, Blog, TikTok
    audience TEXT NOT NULL,
    tone TEXT NOT NULL,
    visual_style TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. GENERATIONS TABLE
CREATE TABLE IF NOT EXISTS public.generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    idea_prompt TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, running, completed, failed, needs_revision
    current_agent TEXT,
    quality_score INT DEFAULT 0,
    retry_count INT DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AGENT RUNS TABLE (Stores structured JSON output per agent execution)
CREATE TABLE IF NOT EXISTS public.agent_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    generation_id UUID NOT NULL REFERENCES public.generations(id) ON DELETE CASCADE,
    agent_name TEXT NOT NULL, -- creative_director, planner, research_analyst, content_creator, growth_strategist, quality_director
    status TEXT NOT NULL DEFAULT 'completed', -- running, completed, failed
    input_json JSONB,
    output_json JSONB,
    execution_time_ms INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FINAL PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.final_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    generation_id UUID UNIQUE NOT NULL REFERENCES public.generations(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    creative_direction_json JSONB,
    planner_outline_json JSONB,
    research_json JSONB,
    script_markdown TEXT NOT NULL,
    seo_metadata_json JSONB,
    thumbnail_prompts_json JSONB,
    quality_review_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EXPORTS TABLE
CREATE TABLE IF NOT EXISTS public.exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    generation_id UUID NOT NULL REFERENCES public.generations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    export_format TEXT NOT NULL, -- pdf, markdown
    file_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST LOOKUPS
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_project_id ON public.generations(project_id);
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON public.generations(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_generation_id ON public.agent_runs(generation_id);
CREATE INDEX IF NOT EXISTS idx_final_packages_generation_id ON public.final_packages(generation_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.final_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;

-- Users Policy
CREATE POLICY "Users can access own user profile"
    ON public.users FOR ALL
    USING (auth.uid() = id);

-- Projects Policy
CREATE POLICY "Users can manage own projects"
    ON public.projects FOR ALL
    USING (auth.uid() = user_id);

-- Generations Policy
CREATE POLICY "Users can manage own generations"
    ON public.generations FOR ALL
    USING (auth.uid() = user_id);

-- Agent Runs Policy
CREATE POLICY "Users can view agent runs for their generations"
    ON public.agent_runs FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.generations g
            WHERE g.id = agent_runs.generation_id AND g.user_id = auth.uid()
        )
    );

-- Final Packages Policy
CREATE POLICY "Users can access own final packages"
    ON public.final_packages FOR ALL
    USING (auth.uid() = user_id);

-- Exports Policy
CREATE POLICY "Users can access own exports"
    ON public.exports FOR ALL
    USING (auth.uid() = user_id);

-- SUPABASE AUTH USER TRIGGER TO AUTOMATICALLY SYNC WITH PUBLIC.USERS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name')
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
