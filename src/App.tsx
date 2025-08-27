// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from '@/context/AppContext';  // if you need AppProvider globally
import { AuthProvider } from '@/context/AuthContext';
import DashboardRoutes from '@/pages/Dashboard/DashboardRoutes';

import Index from '@/pages/Index';
import FindProjects from '@/pages/FindProjects';
import ProjectDetail from '@/pages/ProjectDetail';
import ContractorDashboard from '@/pages/ContractorDashboard';
import ApplicationManagement from '@/pages/ApplicationManagement';
import Applications from '@/pages/applications';
import TalentDirectory from '@/pages/TalentDirectory';
import ProfileSettings from '@/pages/ProfileSettings';
import ProjectWizard from '@/pages/ProjectWizard';
import Students from '@/pages/Students';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppProvider>
            <Router>
              <Routes>
                {/* Global (non-dashboard) routes */}
                <Route path="/" element={<Index />} />
                <Route path="/students" element={<Students />} />
                <Route path="/find-projects" element={<FindProjects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />

                {/* Dashboard module */}
                <Route path="/dashboard/*" element={<DashboardRoutes />} />

                {/* Other global screens */}
                <Route path="/contractor-dashboard" element={<ContractorDashboard />} />
                <Route path="/applicationmanagement" element={<ApplicationManagement />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/talent" element={<TalentDirectory />} />
                <Route path="/profile" element={<ProfileSettings />} />
                <Route path="/projectwizard" element={<ProjectWizard />} />

                {/* Catch-all 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </AppProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
