import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const MarketingLayout = lazy(() => import('@/components/MarketingLayout'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
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
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/industries/:slug" element={<IndustryDetailPage />} />
            <Route path="/process" element={<ProcessPage />} />
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
