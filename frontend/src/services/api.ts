import axios from 'axios';
import { Project, GenerationProgress, GenerationDetail } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Auth Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('creatorops_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Auth
  signup: async (email: string, password: string, fullName?: string) => {
    const res = await apiClient.post('/auth/signup', { email, password, full_name: fullName });
    return res.data;
  },
  login: async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    const res = await apiClient.get('/projects');
    return res.data;
  },
  createProject: async (data: { title: string; platform: string; audience: string; tone: string; visual_style?: string }): Promise<Project> => {
    const res = await apiClient.post('/projects', data);
    return res.data;
  },
  getProject: async (id: string): Promise<Project> => {
    const res = await apiClient.get(`/projects/${id}`);
    return res.data;
  },
  deleteProject: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  // Generation
  startGeneration: async (data: { project_id: string; idea_prompt: string; platform_override?: string; audience_override?: string; tone_override?: string }) => {
    const res = await apiClient.post('/generate', data);
    return res.data; // { generation_id, status }
  },
  getGenerationDetail: async (id: string): Promise<GenerationDetail> => {
    const res = await apiClient.get(`/generation/${id}`);
    return res.data;
  },
  getGenerationProgress: async (id: string): Promise<GenerationProgress> => {
    const res = await apiClient.get(`/generation/${id}/progress`);
    return res.data;
  },

  // Export URLs
  getMarkdownExportUrl: (generationId: string) => `${API_BASE_URL}/api/export/markdown/${generationId}`,
  getPdfExportUrl: (generationId: string) => `${API_BASE_URL}/api/export/pdf/${generationId}`,
};
