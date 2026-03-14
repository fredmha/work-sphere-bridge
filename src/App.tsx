import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import MarketingLayout from '@/components/MarketingLayout';
import { caseStudies, industries, insights, services } from '@/content/bornSiteContent';
import AboutPage from '@/pages/AboutPage';
import CaseStudiesPage from '@/pages/CaseStudiesPage';
import ContactPage from '@/pages/ContactPage';
import HomePage from '@/pages/HomePage';
import IndustriesPage from '@/pages/IndustriesPage';
import IndustryDetailPage from '@/pages/IndustryDetailPage';
import InsightDetailPage from '@/pages/InsightDetailPage';
import InsightsPage from '@/pages/InsightsPage';
import NotFound from '@/pages/NotFound';
import ProcessPage from '@/pages/ProcessPage';
import ServiceDetailPage from '@/pages/ServiceDetailPage';
import ServicesPage from '@/pages/ServicesPage';
import CaseStudyDetailPage from '@/pages/CaseStudyDetailPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage items={services} />} />
          <Route path="/industries" element={<IndustriesPage />} />
          <Route path="/industries/:slug" element={<IndustryDetailPage items={industries} />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetailPage items={caseStudies} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/insights/:slug" element={<InsightDetailPage items={insights} />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
