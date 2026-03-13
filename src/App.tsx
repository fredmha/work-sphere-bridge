import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Index />} />
        <Route path="*" element={<Index />} />
      </Routes>
    </Router>
  );
}
