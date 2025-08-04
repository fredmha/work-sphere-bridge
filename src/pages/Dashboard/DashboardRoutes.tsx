// src/pages/Dashboard/DashboardRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

import DashboardHome from '@/pages/Dashboard/Index';
import { ProjectsPage } from '@/pages/Dashboard/ProjectsPage';
import { ProjectDetailPage } from '@/pages/Dashboard/ProjectDetailPage';
import { ContractorsPage } from '@/pages/Dashboard/ContractorsPage';
import { CompliancePage } from '@/pages/Dashboard/CompliancePage';
import { PaymentsPage } from '@/pages/Dashboard/PaymentsPage';
import NotFound from '@/pages/NotFound';

// Dashboard layout component that provides the layout wrapper
function DashboardLayout(): JSX.Element {
  return (
    <>
      <MainLayout />
      <Toaster />
      <Sonner />
    </>
  );
}

// Main dashboard routes component - this is what gets mounted at /dashboard/*
export default function DashboardRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="project/:id" element={<ProjectDetailPage />} />
        <Route path="contractors" element={<ContractorsPage />} />
        <Route path="compliance" element={<CompliancePage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
