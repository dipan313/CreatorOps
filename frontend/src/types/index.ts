export interface User {
  id: string;
  email: string;
  full_name: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  platform: string;
  audience: string;
  tone: string;
  visual_style?: string;
  created_at: string;
  updated_at: string;
}

export interface AgentRun {
  agent_name: string;
  status: string;
  output_json: Record<string, any>;
  execution_time_ms: number;
  created_at: string;
}

export interface GenerationProgress {
  generation_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'needs_revision';
  current_agent: string;
  quality_score: number;
  retry_count: number;
  completed_agents: string[];
  latest_agent_runs: AgentRun[];
  error_message?: string;
}

export interface FinalPackage {
  id: string;
  generation_id: string;
  project_id: string;
  user_id: string;
  creative_direction_json?: any;
  planner_outline_json?: any;
  research_json?: any;
  script_markdown: string;
  seo_metadata_json?: {
    viral_titles?: string[];
    meta_description?: string;
    tags?: string[];
    posting_times?: string;
  };
  thumbnail_prompts_json?: string[];
  post_image_prompt?: string;
  video_storyboard_scenes?: Array<{
    scene_number: string;
    timestamp: string;
    caption: string;
    visual_cue: string;
    audio_script: string;
  }>;
  quality_review_json?: {
    overall_score: number;
    clarity_score?: number;
    engagement_score?: number;
    seo_alignment_score?: number;
    strengths?: string[];
    areas_for_improvement?: string[];
    actionable_feedback?: string;
    passes_quality_gate?: boolean;
  };
  created_at: string;
}

export interface GenerationDetail {
  id: string;
  project_id: string;
  user_id: string;
  idea_prompt: string;
  status: string;
  current_agent: string;
  quality_score: number;
  retry_count: number;
  agent_runs: AgentRun[];
  final_package?: FinalPackage;
  created_at: string;
}
