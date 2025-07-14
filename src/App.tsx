import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import FindProjects from "./pages/FindProjects";
import ProjectDetail from "./pages/ProjectDetail";
import Dashboard from "./pages/Dashboard";
import ApplicationManagement from "./pages/ApplicationManagement";
import TalentDirectory from "./pages/TalentDirectory";
import ContractorDashboard from "./pages/ContractorDashboard";
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";
import Applications from "./pages/applications";

const queryClient = new QueryClient();

const App = () => (
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;