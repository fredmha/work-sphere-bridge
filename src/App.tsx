import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import Help from '@/pages/Help';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Startups from '@/pages/Startups';
import Categories from '@/pages/Categories';
import Builders from '@/pages/Builders';
import Recent from '@/pages/Recent';
import Submit from '@/pages/Submit';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/startups" element={<Startups />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/builders" element={<Builders />} />
        <Route path="/recent" element={<Recent />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/help" element={<Help />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
