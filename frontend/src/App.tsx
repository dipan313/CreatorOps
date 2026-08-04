import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreativeDirectionPage } from './pages/CreativeDirectionPage';
import { LiveWorkspacePage } from './pages/LiveWorkspacePage';
import { ResultsPage } from './pages/ResultsPage';
import { LoginPage } from './pages/LoginPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/creative-direction" element={<CreativeDirectionPage />} />
          <Route path="/workspace/:id" element={<LiveWorkspacePage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
