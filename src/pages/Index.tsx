import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle, Menu, X, Phone, MessageSquare, Calendar, BarChart3, Sparkles, TrendingUp, Target, Clock, Mail, User, Building2, Search, Zap, BrainCircuit, Users, ChevronDown, Play, Shield, Globe, Rocket } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/lib/supabaseClient';

// Demo Request Form Component
const DemoRequestForm = ({ variant = 'default' }: { variant?: 'default' | 'compact' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    teamSize: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('formsubmit-signup')
        .insert({
          Email: formData.email,
          RoleReq: formData.role,
          Scope: 'recruiter-outreach-platform',
          'Start date': 'immediate',
          'Budget Range': formData.teamSize
        });

      if (error) {
        console.error('Error storing interest:', error);
        alert('Failed to submit. Please try again.');
        return;
      }

      setIsSubmitted(true);
      setFormData({ name: '', email: '', company: '', role: '', teamSize: '' });
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-8 text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3 font-display">We'll be in touch shortly</h3>
        <p className="text-slate-600">
          Our team will reach out within 24 hours to schedule your personalized demo.
        </p>
      </motion.div>
    );
  }

  return (
    <div className={`bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl shadow-slate-900/5 ${variant === 'compact' ? 'p-6' : 'p-8'}`}>
      {variant === 'default' && (
        <>
          <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">Request a Demo</h3>
          <p className="text-slate-600 mb-6">
            See how we can transform your recruitment outreach
          </p>
        </>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:outline-none transition-all duration-200"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Work Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:outline-none transition-all duration-200"
              placeholder="you@company.com"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              required
              className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:outline-none transition-all duration-200"
              placeholder="Company name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Your Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              required
              className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:outline-none transition-all duration-200"
            >
              <option value="">Select your role</option>
              <option value="recruiter">Recruiter</option>
              <option value="senior-recruiter">Senior Recruiter</option>
              <option value="recruitment-lead">Recruitment Lead</option>
              <option value="recruitment-manager">Recruitment Manager</option>
              <option value="talent-acquisition">Talent Acquisition</option>
              <option value="agency-owner">Agency Owner</option>
              <option value="director">Director</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Team Size</label>
          <select
            value={formData.teamSize}
            onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
            required
            className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:outline-none transition-all duration-200"
          >
            <option value="">Select team size</option>
            <option value="solo">Solo recruiter</option>
            <option value="2-5">2-5 recruiters</option>
            <option value="6-15">6-15 recruiters</option>
            <option value="16-50">16-50 recruiters</option>
            <option value="50+">50+ recruiters</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-emerald-400 disabled:to-teal-400 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:translate-y-[-2px] flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Requesting...
            </>
          ) : (
            <>
              Request Demo
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// Animated counter component
const AnimatedCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Navigation Item with dropdown
const NavItem = ({ label, items }: { label: string; items?: { label: string; href: string }[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!items) {
    return (
      <a href={`#${label.toLowerCase()}`} className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
        {label}
      </a>
    );
  }

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium transition-colors">
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50"
          >
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block px-4 py-2.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  const platformFeatures = [
    {
      icon: Search,
      title: "Intelligent Prospecting",
      description: "We find the right decision-makers at the right companies, precisely when they're most likely to need recruitment support.",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      icon: Mail,
      title: "Strategic Warm-Up Sequences",
      description: "Multi-touch outreach campaigns that build recognition. By the time you call, they already know who you are.",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: BrainCircuit,
      title: "Deep Prospect Research",
      description: "AI-powered insights into who they're hiring for, their likely pain points, and exactly why your solution fits their needs.",
      gradient: "from-amber-500 to-orange-600"
    },
    {
      icon: Phone,
      title: "Integrated Calling Platform",
      description: "Call directly through our platform with full context at your fingertips. Every interaction logged, every detail captured.",
      gradient: "from-sky-500 to-blue-600"
    },
    {
      icon: Zap,
      title: "Post-Call Automations",
      description: "Automatic follow-ups triggered by call outcomes. Prospects never slip through the cracks again.",
      gradient: "from-rose-500 to-pink-600"
    },
    {
      icon: BarChart3,
      title: "Pipeline Intelligence",
      description: "Real-time visibility into your entire pipeline. Track conversion, optimize timing, and scale what works.",
      gradient: "from-indigo-500 to-violet-600"
    }
  ];

  const workflowSteps = [
    {
      number: "01",
      title: "We Find Your Prospects",
      description: "Our system continuously identifies companies that match your ideal client profile — tracking hiring signals, funding rounds, and growth indicators.",
      icon: Target
    },
    {
      number: "02", 
      title: "We Warm Them Up",
      description: "Strategic multi-channel sequences establish familiarity before you ever pick up the phone. LinkedIn, email, and touchpoints that build recognition.",
      icon: Mail
    },
    {
      number: "03",
      title: "We Research Every One",
      description: "Before each call, you receive actionable intel: who they're hiring, what challenges they face, and the perfect opening for your conversation.",
      icon: BrainCircuit
    },
    {
      number: "04",
      title: "You Have Conversations That Convert",
      description: "Call through our platform with full context. Every prospect is pre-warmed, pre-researched, and expecting to hear from you.",
      icon: Phone
    },
    {
      number: "05",
      title: "We Handle The Follow-Up",
      description: "Post-call automations ensure nothing falls through. Whether it's a callback, proposal, or nurture sequence — it happens automatically.",
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-white antialiased">
      {/* Custom font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cal+Sans&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Cal Sans', 'Plus Jakarta Sans', sans-serif; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-lg border-b border-slate-100 shadow-sm' : 'bg-transparent'}`}>
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <a href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 font-display">Born</span>
            </a>
            
            <div className="hidden lg:flex items-center gap-8">
              <NavItem label="Platform" items={[
                { label: "Prospecting", href: "#platform" },
                { label: "Warm-Up Sequences", href: "#platform" },
                { label: "Research Engine", href: "#platform" },
                { label: "Call Integration", href: "#platform" },
                { label: "Automations", href: "#platform" }
              ]} />
              <NavItem label="Solutions" items={[
                { label: "For Agencies", href: "#demo" },
                { label: "For In-House Teams", href: "#demo" },
                { label: "For Solo Recruiters", href: "#demo" }
              ]} />
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                How It Works
              </a>
              <a href="#demo" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                Pricing
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isMobile ? (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            ) : (
              <>
                <a href="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                  Sign In
                </a>
                <a 
                  href="#demo"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:translate-y-[-1px]"
                >
                  Get Demo
                </a>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="mobile-menu fixed top-0 right-0 w-80 h-full bg-white shadow-2xl"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                  <span className="text-lg font-bold text-slate-900 font-display">Menu</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                  <nav className="space-y-1">
                    {[
                      { label: 'Platform', href: '#platform' },
                      { label: 'How It Works', href: '#how-it-works' },
                      { label: 'Pricing', href: '#demo' },
                      { label: 'Sign In', href: '/dashboard' }
                    ].map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-3 px-4 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors font-medium"
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </div>
                <div className="p-6 border-t border-slate-100">
                  <a
                    href="#demo"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-center transition-all duration-300"
                  >
                    Request Demo
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        {/* Sophisticated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30"></div>
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-emerald-100/40 via-teal-100/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-violet-100/30 via-purple-100/20 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23000' stroke-width='1'%3E%3Cpath d='M0 0h60v60H0z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-8"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">Built for Elite Recruiters</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6 font-display"
              >
                <span className="text-slate-900">Stop chasing. </span>
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">Start closing.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl text-slate-600 leading-relaxed mb-8"
              >
                We handle the prospecting, warm-up, and research — so every call you make is with someone who knows your name and is ready to talk.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 mb-10"
              >
                <a
                  href="#demo"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:translate-y-[-2px]"
                >
                  Request Demo
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold text-lg transition-all duration-300 hover:border-slate-300"
                >
                  <Play className="w-5 h-5" />
                  See How It Works
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center gap-6 text-sm text-slate-500"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>No cold calling</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Pre-warmed prospects</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Full automation</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Platform Preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-violet-500/20 rounded-3xl blur-2xl"></div>
                
                {/* Main dashboard card */}
                <div className="relative bg-white border border-slate-200/80 rounded-2xl shadow-2xl overflow-hidden">
                  {/* Window chrome */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="w-48 h-5 bg-slate-100 rounded-md"></div>
                    </div>
                  </div>

                  {/* Dashboard content */}
                  <div className="p-6 space-y-4">
                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                        <div className="text-2xl font-bold text-emerald-700">24</div>
                        <div className="text-xs font-medium text-emerald-600">Hot Prospects</div>
                      </div>
                      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
                        <div className="text-2xl font-bold text-violet-700">8</div>
                        <div className="text-xs font-medium text-violet-600">Meetings Today</div>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                        <div className="text-2xl font-bold text-amber-700">94%</div>
                        <div className="text-xs font-medium text-amber-600">Response Rate</div>
                      </div>
                    </div>

                    {/* Prospect card preview */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-slate-900">Next Prospect</span>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Ready to call</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300"></div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-900">Sarah Mitchell</div>
                          <div className="text-xs text-slate-500">VP of Engineering at TechCorp • Hiring 3 roles</div>
                        </div>
                        <button className="p-2 bg-emerald-500 rounded-lg text-white hover:bg-emerald-600 transition-colors">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Research insights preview */}
                    <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-xl p-4 border border-amber-100/50">
                      <div className="flex items-center gap-2 mb-2">
                        <BrainCircuit className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-semibold text-amber-700">AI Research Insights</span>
                      </div>
                      <div className="text-xs text-slate-600 space-y-1">
                        <p>• Recently raised Series B, expanding engineering team</p>
                        <p>• 3 open roles: 2 Backend, 1 DevOps</p>
                        <p>• Previous recruiter relationship ended Q3</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg border border-slate-100 p-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Meeting Booked</div>
                      <div className="text-[10px] text-slate-500">2 mins ago</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-slate-100 p-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Email Opened</div>
                      <div className="text-[10px] text-slate-500">John at Acme Inc</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="relative py-10 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Trusted by top recruiters across Australia</p>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 font-display"
            >
              The admin is killing your desk
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-600 leading-relaxed"
            >
              You didn't become a recruiter to spend your days on spreadsheets, research, and chasing follow-ups. You became a recruiter to build relationships and close deals.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                stat: "68%",
                label: "of recruiter time",
                description: "spent on admin tasks instead of talking to prospects and clients"
              },
              {
                stat: "5hrs",
                label: "per week on average",
                description: "wasted manually researching prospects before calls"
              },
              {
                stat: "40%",
                label: "of opportunities",
                description: "lost due to inconsistent or forgotten follow-ups"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-900/5"
              >
                <div className="text-5xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent mb-2 font-display">
                  {item.stat}
                </div>
                <div className="text-sm font-semibold text-slate-900 mb-3">{item.label}</div>
                <p className="text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-400">The Solution</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl font-bold text-white mb-6 font-display"
            >
              We remove everything that stops you from winning
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 leading-relaxed"
            >
              A bespoke system built around your desk that handles prospecting, warm-up, research, and follow-ups — so you can focus on what actually generates revenue.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "We Prospect For You",
                description: "Finding the right people at the right time. Companies that are hiring, decision-makers who need your help, signals that indicate urgency.",
                color: "emerald"
              },
              {
                icon: Mail,
                title: "We Warm Them Up",
                description: "Strategic multi-touch outreach so by the time you call, they already know who you are and they're expecting the conversation.",
                color: "violet"
              },
              {
                icon: BrainCircuit,
                title: "We Research Every Prospect",
                description: "Insights into who they're hiring for, what their pain points are, and exactly why your solution fits — delivered before every call.",
                color: "amber"
              },
              {
                icon: Phone,
                title: "You Call Through Our Platform",
                description: "Full context at your fingertips. Every interaction logged. Every detail captured. One-click calling with complete prospect intelligence.",
                color: "sky"
              },
              {
                icon: Zap,
                title: "We Handle Follow-Ups",
                description: "Automatic post-call sequences triggered by outcomes. Proposals sent, callbacks scheduled, nurture campaigns activated — nothing slips through.",
                color: "rose"
              },
              {
                icon: TrendingUp,
                title: "Your Pipeline Grows",
                description: "More conversations. More meetings. More briefs. Less admin. A predictable system that compounds your success.",
                color: "indigo"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 flex items-center justify-center mb-6 shadow-lg shadow-${item.color}-500/25`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section id="platform" className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-6"
            >
              <Globe className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-semibold text-slate-600">Platform Capabilities</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 font-display"
            >
              Everything you need to dominate your market
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600"
            >
              A complete recruitment outreach platform built for modern recruiters who want to spend less time on admin and more time closing deals.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative p-8 bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-900/5 hover:shadow-xl hover:border-slate-300 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-6"
            >
              <Zap className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">How It Works</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 font-display"
            >
              From cold market to warm conversations
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600"
            >
              A systematic approach that transforms how you approach business development
            </motion.p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-200 via-emerald-300 to-emerald-200"></div>

            <div className="space-y-12 lg:space-y-0">
              {workflowSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right lg:pr-16' : 'lg:text-left lg:pl-16'}`}>
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg shadow-slate-900/5">
                      <div className={`inline-flex items-center gap-3 mb-4 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                        <span className="text-4xl font-bold text-emerald-200 font-display">{step.number}</span>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25`}>
                          <step.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white shadow-lg z-10"></div>

                  <div className="flex-1 hidden lg:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results / Stats Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 relative overflow-hidden">
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-white mb-6 font-display"
            >
              Results that speak for themselves
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-emerald-100"
            >
              Average improvements across our client base
            </motion.p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: 3, suffix: "x", label: "More client conversations" },
              { value: 47, suffix: "%", label: "Increase in meetings booked" },
              { value: 12, suffix: "hrs", label: "Saved per week on admin" },
              { value: 89, suffix: "%", label: "Follow-up completion rate" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl lg:text-6xl font-bold text-white mb-2 font-display">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-emerald-100 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Request Section */}
      <section id="demo" className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 font-display">
                Ready to transform your recruitment outreach?
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Book a personalized demo and see how we can build a system tailored to your desk, your market, and your goals.
              </p>
              
              <div className="space-y-4">
                {[
                  "See the platform in action with your ICP",
                  "Get a custom automation blueprint",
                  "Understand the ROI for your desk",
                  "No commitment, no pressure"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <DemoRequestForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 lg:py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 font-display">
              Stop chasing. Start closing.
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Join the recruiters who've eliminated the admin and built predictable pipelines that deliver results.
            </p>
            <a
              href="#demo"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:translate-y-[-2px]"
            >
              Request Your Demo
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white font-display">Born</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                The recruitment outreach platform that handles prospecting, warm-up, and research — so you can focus on conversations that close deals.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <span className="text-sm font-medium">Li</span>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <span className="text-sm font-medium">X</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-3">
                {['Prospecting', 'Warm-Up Sequences', 'Research Engine', 'Call Integration', 'Automations'].map((item) => (
                  <li key={item}>
                    <a href="#platform" className="text-slate-400 hover:text-emerald-400 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                {['About', 'Careers', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Born. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Shield className="w-4 h-4" />
              <span>SOC 2 Type II Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
