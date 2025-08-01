import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useEffect } from "react";
import Index from "./pages/Index";
import FindProjects from "./pages/FindProjects";
import ProjectDetail from "./pages/ProjectDetail";
import Dashboard from "./pages/Dashboard";
import ContractorDashboard from "./pages/ContractorDashboard";
import ApplicationManagement from "./pages/ApplicationManagement";
import TalentDirectory from "./pages/TalentDirectory";
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";
import Applications from "./pages/applications";
import ProjectWizard from "./pages/ProjectWizard";

const queryClient = new QueryClient();

export default function App() {
  // Clear any cached auth data on app startup
  useEffect(() => {
    const clearCachedAuth = () => {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('supabase') || key.includes('auth') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      const sessionKeys = Object.keys(sessionStorage);
      sessionKeys.forEach(key => {
        if (key.includes('supabase') || key.includes('auth') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
      
      console.log('App startup: Cached auth data cleared');
    };
    
    clearCachedAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/find-projects" element={<FindProjects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/contractor-dashboard" element={<ContractorDashboard />} />
              <Route path="/applicationmanagement" element={<ApplicationManagement />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/talent" element={<TalentDirectory />} />
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="/ProjectWizard" element={<ProjectWizard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}