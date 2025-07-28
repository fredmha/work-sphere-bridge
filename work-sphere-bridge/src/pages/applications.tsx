import React, { useState, useEffect } from 'react';
import Application from '@/entities/Application.json';
import ApplicationTable from '../components/applications/ApplicationTable.tsx';
import ApplicationDetailSidebar from '../components/applications/ApplicationDetailSidebar.tsx';
import ApplicationStats from '../components/applications/ApplicationStats.tsx';
import ApplicationFilters from '../components/applications/ApplicationFilters.tsx';
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";

export default function Applications() {
  const [allApplications, setAllApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ status: null, paymentType: null });

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    let apps = [...allApplications];
    if (filters.status) {
      if (filters.status === 'active') {
        apps = apps.filter(app => app.status === 'active' || app.status === 'completed');
      } else if (filters.status === 'pending') {
        apps = apps.filter(app => app.status === 'pending' || app.status === 'interview');
      } else {
        apps = apps.filter(app => app.status === filters.status);
      }
    }
    if (filters.paymentType) {
      apps = apps.filter(app => app.payment_type === filters.paymentType);
    }
    setFilteredApplications(apps);
  }, [filters, allApplications]);

  const loadApplications = async () => {
    setIsLoading(true);
    // Use dummy data instead of fetching from API
    const dummyApplications = [
      {
        id: 1,
        status: "active",
        project_name: "Cloud Platform Migration",
        description: "Lead the migration of legacy systems to a...",
        role: "DevOps Engineer",
        payment_type: "hourly",
        company: "InfraCloud",
        submitted_date: "2025-07-01",
      },
      // ...add more dummy applications here
    ];
    setAllApplications(dummyApplications);
    setFilteredApplications(dummyApplications);
    setIsLoading(false);
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };
  
  const handleStatClick = (key) => {
    setFilters({ status: key === 'all' ? null : key, paymentType: null });
  };
  
  const handleResetFilters = () => {
      setFilters({ status: null, paymentType: null });
  };

  const handleSelectApplication = (application) => {
    setSelectedApplication(application);
  };

  const handleCloseSidebar = () => {
    setSelectedApplication(null);
  };

  return (
    <><Header /><div className="min-h-screen bg-gray-50/50">
          <main className="container mx-auto px-4 py-8">
              <header className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">Application Management</h1>
                  <p className="text-gray-600 mt-1">
                      Track your hourly and task-based project applications.
                  </p>
              </header>

              <ApplicationStats applications={allApplications} onStatClick={handleStatClick} />

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="mb-4">
                      <ApplicationFilters
                          filters={filters}
                          onFilterChange={handleFilterChange}
                          onResetFilters={handleResetFilters} />
                  </div>
                  <ApplicationTable
                      applications={filteredApplications}
                      onSelectApplication={handleSelectApplication}
                      selectedApplicationId={selectedApplication?.id} />
              </div>
          </main>

          {selectedApplication && (
              <ApplicationDetailSidebar
                  application={selectedApplication}
                  onClose={handleCloseSidebar}
                  isOpen={!!selectedApplication} />
          )}
      </div></>
  );
}