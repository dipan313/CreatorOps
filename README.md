# CreatorOps AI – Agentic Production Studio

From a single idea to a complete publish-ready content package using a team of multi-agent AI specialists.

## Overview
CreatorOps AI automates the content creation lifecycle using an orchestrated multi-agent AI pipeline built with FastAPI, LangGraph/LangChain, Google Gemini free-tier models, Supabase PostgreSQL, and a modern React + TypeScript + Tailwind CSS UI.

### Multi-Agent Pipeline
1. 🎨 **Creative Director**: Analyzes core concept, target platform, tone, and campaign strategy.
2. 📋 **Planner**: Builds structured content execution outline and production milestones.
3. 🔬 **Research Analyst**: Performs real-time web research & trend analysis via Tavily API.
4. 📝 **Content Creator**: Generates publication-ready scripts, posts, and long-form copy.
5. 🎯 **Quality Director**: Scores output against quality metrics (0-100 threshold: 90). Triggers revision loops if needed.
6. 🚀 **Growth Strategist**: Optimizes titles, SEO metadata, tags, posting schedule, and AI thumbnail visual prompts.

---

## Workspace Structure
```
/
├── backend/            # FastAPI Python backend + LangGraph Multi-Agent Engine
│   ├── app/
│   │   ├── agents/     # Agent definitions (Creative Director, Planner, etc.)
│   │   ├── api/        # REST API endpoints & Auth routes
│   │   ├── core/       # Configurations, DB connectors, security
│   │   ├── graph/      # LangGraph workflow orchestration & quality loop
│   │   ├── schemas/    # Pydantic structured I/O models
│   │   └── services/   # Export generators (PDF, Markdown)
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/           # React + Vite + TypeScript + Tailwind CSS + Framer Motion UI
│   ├── src/
│   │   ├── components/ # Custom components & UI primitives
│   │   ├── context/    # Auth state management
│   │   ├── pages/      # Landing, Dashboard, Workspace, Results pages
│   │   ├── services/   # Axios API client
│   │   └── types/      # TypeScript interfaces
│   └── package.json
└── supabase/           # Database schema & RLS policies
    └── schema.sql
```

---

## Quick Start (Local Setup)

### Prerequisites
- Node.js >= 18
- Python >= 3.10
- Supabase account (or local Postgres)
- Free Google Gemini API Key (`GEMINI_API_KEY`)

### 1. Database Setup
Execute `supabase/schema.sql` in your Supabase SQL Editor.

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## License
MIT License
