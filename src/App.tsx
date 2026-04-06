import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import GoogleAnalyticsTracker from '@/components/GoogleAnalyticsTracker';

const MarketingLayout = lazy(() => import('@/components/MarketingLayout'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const BlogCommandPage = lazy(() => import('@/pages/BlogCommandPage'));
const BlogDetailPage = lazy(() => import('@/pages/BlogDetailPage'));
const BlogPreviewPage = lazy(() => import('@/pages/BlogPreviewPage'));
const BlogsPage = lazy(() => import('@/pages/BlogsPage'));
const CaseStudiesPage = lazy(() => import('@/pages/CaseStudiesPage'));
const CaseStudyDetailPage = lazy(() => import('@/pages/CaseStudyDetailPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const IndustriesPage = lazy(() => import('@/pages/IndustriesPage'));
const IndustryDetailPage = lazy(() => import('@/pages/IndustryDetailPage'));
const InsightDetailPage = lazy(() => import('@/pages/InsightDetailPage'));
const InsightsPage = lazy(() => import('@/pages/InsightsPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const ProcessPage = lazy(() => import('@/pages/ProcessPage'));
const RoiPage = lazy(() => import('@/pages/RoiPage'));
const ServiceDetailPage = lazy(() => import('@/pages/ServiceDetailPage'));
const ServicesPage = lazy(() => import('@/pages/ServicesPage'));

function RouteFallback() {
  return (
    <div className="container-shell flex min-h-[40vh] items-center justify-center py-16">
      <div className="rounded-full border border-border/80 bg-white/85 px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
        Loading page...
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <GoogleAnalyticsTracker />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/blogcommand" element={<BlogCommandPage />} />
          <Route path="/bxgse/command" element={<Navigate to="/blogcommand" replace />} />
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/industries/:slug" element={<IndustryDetailPage />} />
            <Route path="/process" element={<ProcessPage />} />
            <Route path="/roi" element={<RoiPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/preview/:draftId" element={<BlogPreviewPage />} />
            <Route path="/blogs/:slug" element={<BlogDetailPage />} />
            <Route path="/case-studies" element={<CaseStudiesPage />} />
            <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/insights/:slug" element={<InsightDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
