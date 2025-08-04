import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from '@/contexts/AppContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import Index from '@/pages/Index';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { ContractorsPage } from '@/pages/ContractorsPage';
import { CompliancePage } from '@/pages/CompliancePage';
import { PaymentsPage } from '@/pages/PaymentsPage';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-background via-background/98 to-primary/5">
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Index />} />
                  <Route path="project/:id" element={<ProjectDetailPage />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route path="contractors" element={<ContractorsPage />} />
                  <Route path="compliance" element={<CompliancePage />} />
                  <Route path="payments" element={<PaymentsPage />} />
                  <Route path="applications" element={<div className="p-6">Applications Page Coming Soon</div>} />
                  <Route path="calendar" element={<div className="p-6">Calendar Page Coming Soon</div>} />
                  <Route path="reports" element={<div className="p-6">Reports Page Coming Soon</div>} />
                  <Route path="notifications" element={<div className="p-6">Notifications Page Coming Soon</div>} />
                  <Route path="settings" element={<div className="p-6">Settings Page Coming Soon</div>} />
                  <Route path="audit" element={<div className="p-6">Audit Logs Page Coming Soon</div>} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
              <Toaster />
              <Sonner />
            </div>
          </Router>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;