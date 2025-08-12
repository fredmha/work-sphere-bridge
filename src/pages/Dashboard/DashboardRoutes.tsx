// src/pages/Dashboard/DashboardRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

import DashboardHome from '@/pages/Dashboard/Index';
import { ProjectsPage } from '@/pages/Dashboard/ProjectsPage';
import { ProjectDetailPage } from '@/pages/Dashboard/ProjectDetailPage';
import { ContractorsPage } from '@/pages/Dashboard/ContractorsPage';
import { CompliancePage } from '@/pages/Dashboard/CompliancePage';
import { PaymentsPage } from '@/pages/Dashboard/PaymentsPage';
import { ApplicationManagementPage } from '@/pages/Dashboard/ApplicationManagementPage';
import NotFound from '@/pages/NotFound';

// Main dashboard routes component - this is what gets mounted at /dashboard/*
export default function DashboardRoutes(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Header above everything */}
      <Header />
      
      {/* Main content area with sidebar and layout */}
      <SidebarProvider defaultOpen={false}>
      <div className="flex-1 flex w-full bg-gradient-to-br from-background via-background/98 to-primary/3">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-transparent">
            <div className="animate-fade-in">
              <Routes>
                <Route path="/" element={<DashboardHome />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="project/:id" element={<ProjectDetailPage />} />
                <Route path="contractors" element={<ContractorsPage />} />
                <Route path="compliance" element={<CompliancePage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="applicationmanagement" element={<ApplicationManagementPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
      
      <Toaster />
      <Sonner />
    </SidebarProvider>
    </div>
  );
}
