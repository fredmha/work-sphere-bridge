import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Zap, Menu, X, Phone, BarChart3, Database, Search, Flame, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/lib/supabaseClient';

// Interest Form Component
const InterestForm = () => {
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
          Scope: 'outbound-engine',
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
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-2xl text-center">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Welcome to Born!</h3>
        <p className="text-slate-600 font-medium">
          Your account is being set up. You'll receive login details shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-2xl">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Build Your Recruiting System</h3>
      <p className="text-slate-600 font-medium mb-6">
        A bespoke prospecting and outreach engine so you can focus on conversations.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none font-medium transition-all duration-200"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none font-medium transition-all duration-200"
              placeholder="your@company.com"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              required
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none font-medium transition-all duration-200"
              placeholder="Company name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Your Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              required
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none font-medium transition-all duration-200"
            >
              <option value="">Select your role</option>
              <option value="recruitment-lead">Recruitment Lead</option>
              <option value="recruiter">Recruiter</option>
              <option value="agency-owner">Agency Owner</option>
              <option value="founder">Founder</option>
              <option value="director">Director</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Team Size</label>
          <select
            value={formData.teamSize}
            onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
            required
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none font-medium transition-all duration-200"
          >
            <option value="">Select team size</option>
            <option value="1-5">1-5 recruiters</option>
            <option value="6-20">6-20 recruiters</option>
            <option value="21-50">21-50 recruiters</option>
            <option value="50+">50+ recruiters</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-200 shadow-xl shadow-green-600/25 hover:shadow-green-600/40 hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating Account...
            </>
          ) : (
            <>
              Get Started
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold text-slate-900">Born</div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="#pipeline" className="hover:text-slate-900 transition-colors">System</a>
              <a href="#signup" className="hover:text-slate-900 transition-colors">Get Started</a>
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
              <a 
                href="#signup"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-green-600/20 hover:shadow-green-600/30"
              >
                Get Started
              </a>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
          <div className="mobile-menu fixed top-0 right-0 w-64 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <span className="text-lg font-semibold text-slate-900">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 p-6">
                <nav className="space-y-4">
                  <a
                    href="#pipeline"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                  >
                    System
                  </a>
                  <a
                    href="#signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                  >
                    Get Started
                  </a>
                  
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-24 px-8 pt-32 overflow-hidden">
        {/* Enhanced hero background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-green-50/30 to-blue-50/20"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-green-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-6"
                >
                  🚀 RECRUITING, WITHOUT THE BUSYWORK
                </motion.span>
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-slate-900 block mb-2"
                  >
                    From admin overload to a
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-clip-text text-transparent block"
                  >
                    bespoke recruiting system.
                  </motion.span>
                </h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-xl text-slate-600 leading-relaxed mb-4 font-medium"
                >
                  We build you a system that removes the admin and mental load that stops you from talking to prospects, booking meetings, and winning briefs. We prospect for you, warm the right people with strategic outreach, and research every prospect so your calls are expected and contextual.
                </motion.p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.a
                  href="#signup"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-600 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-2xl shadow-green-600/40 hover:shadow-green-600/60 flex items-center justify-center gap-2"
                >
                  Book a Strategy Call
                  <ArrowRight className="w-5 h-5" />
                </motion.a>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-slate-500 text-sm font-semibold flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-green-600" />
                Built for recruitment teams and agencies who want more briefs.
              </motion.p>
            </motion.div>

            {/* Right: Cool SaaS Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative w-full h-96">
                {/* Enhanced animated background */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"
                ></motion.div>
                
                {/* Main dashboard mockup */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative bg-white/95 backdrop-blur-md border-2 border-slate-200 rounded-3xl p-6 shadow-2xl h-full"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Recruiting OS</div>
                  </div>
                  
                  {/* Dashboard content */}
                  <div className="space-y-4">
                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-green-50 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-green-600">128</div>
                        <div className="text-xs text-green-700">Prospects Enriched</div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-blue-600">18</div>
                        <div className="text-xs text-blue-700">Meetings Booked</div>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-purple-600">32%</div>
                        <div className="text-xs text-purple-700">Warm Reply Rate</div>
                      </div>
                    </div>
                    
                    {/* Activity chart mockup */}
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-semibold text-slate-900">Outreach Activity</div>
                        <div className="text-xs text-slate-500">Last 7 days</div>
                      </div>
                      <div className="flex items-end gap-1 h-16">
                        {[40, 65, 45, 80, 55, 70, 85].map((height, i) => (
                          <div key={i} className="bg-green-500 rounded-sm flex-1" style={{height: `${height}%`}}></div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Queue status */}
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-900">Call Queue</div>
                        <div className="text-xs text-green-600 font-medium">Live</div>
                      </div>
                      <div className="mt-2 text-xs text-slate-600">Next: Head of Talent - Series B SaaS</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pipeline Flow Section */}
      <section id="pipeline" className="relative py-32 px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-white to-blue-50/30"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-6"
              >
                THE FULL SYSTEM
              </motion.span>
              <h2 className="text-6xl lg:text-7xl font-bold text-slate-900 mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                The Bespoke Recruiting Engine
              </h2>
              <p className="text-2xl text-slate-600 font-medium max-w-3xl mx-auto mb-4">
                Prospecting, outreach, research, calls, and follow-ups — orchestrated end-to-end.
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-green-600 font-bold mt-4 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                From Prospects to Briefs — The Full Recruiting System
                <Zap className="w-5 h-5" />
              </motion.p>
            </motion.div>
          </div>

          {/* Pipeline Flow - Desktop: Horizontal, Mobile: Vertical */}
          <div className="relative">
            {/* Desktop Flow (Horizontal with wrapping) */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* First Row - 3 stages */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  {[
                    {
                      icon: Database,
                      title: "Prospect Sourcing",
                      tagline: "Right people, right time.",
                      description: "We identify hiring decision-makers and map target accounts you should be speaking to."
                    },
                    {
                      icon: Search,
                      title: "Recruiting Research",
                      tagline: "Context before contact.",
                      description: "Every prospect is enriched with likely hiring needs, pain points, and why you fit."
                    },
                    {
                      icon: Flame,
                      title: "Strategic Warm Outreach",
                      tagline: "Familiarity before the call.",
                      description: "Multi-touch outreach builds recognition so prospects already expect the conversation."
                    }
                  ].map((stage, index) => (
                    <React.Fragment key={index}>
                      <motion.div
                        initial={{ opacity: 0, x: -50, y: 20 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ scale: 1.08, y: -8, rotate: 1 }}
                        className="flex-1 relative group"
                      >
                        <div className="relative bg-gradient-to-br from-white via-white to-green-50/30 backdrop-blur-sm border-2 border-slate-200 rounded-3xl p-8 shadow-2xl hover:shadow-green-500/30 hover:border-green-400 transition-all duration-500 h-full overflow-hidden">
                          {/* Animated background glow */}
                          <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:to-transparent transition-all duration-500 rounded-3xl"></div>
                          
                          <div className="relative z-10">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all duration-300"
                            >
                              <stage.icon className="w-8 h-8 text-white" />
                            </motion.div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-green-700 transition-colors">{stage.title}</h3>
                            <p className="text-sm text-green-600 font-bold mb-4 uppercase tracking-wide">{stage.tagline}</p>
                            <p className="text-base text-slate-600 font-medium leading-relaxed">{stage.description}</p>
                          </div>
                          
                          {/* Decorative corner accent */}
                          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      </motion.div>
                      
                      {/* Connector Arrow (not after last item in row) */}
                      {index < 2 && (
                        <motion.div
                          initial={{ opacity: 0, scaleX: 0 }}
                          whileInView={{ opacity: 1, scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                          className="flex-shrink-0 flex items-center justify-center"
                          style={{ width: '48px' }}
                        >
                          <div className="relative flex items-center w-full h-2">
                            <div className="flex-1 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                            <ArrowRight className="w-5 h-5 text-green-600 ml-0.5" style={{ marginLeft: '2px' }} />
                          </div>
                        </motion.div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Flow Connector (between rows) - Vertical connector */}
                <div className="flex justify-center mb-6 -mt-2">
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    whileInView={{ opacity: 1, scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="relative flex flex-col items-center"
                    style={{ transformOrigin: 'top' }}
                  >
                    <div className="relative flex flex-col items-center w-2">
                      <div className="flex-1 w-1 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                      <ArrowRight className="w-5 h-5 text-green-600 rotate-90 mt-0.5" style={{ marginTop: '2px' }} />
                    </div>
                  </motion.div>
                </div>

                {/* Second Row - 3 stages */}
                <div className="flex items-center justify-between gap-4">
                  {[
                    {
                      icon: Phone,
                      title: "Recruiter Call Hub",
                      tagline: "Calls with context.",
                      description: "Call from a single platform with notes, intel, and next steps ready."
                    },
                    {
                      icon: Repeat,
                      title: "Post-Call Automations",
                      tagline: "Never miss a follow-up.",
                      description: "Auto-logged outcomes, instant follow-ups, and re-queues so briefs never slip."
                    },
                    {
                      icon: BarChart3,
                      title: "Brief Pipeline Control",
                      tagline: "Everything in one view.",
                      description: "Track warm responses, meetings, and briefs across every prospect."
                    }
                  ].map((stage, index) => (
                    <React.Fragment key={index + 3}>
                      <motion.div
                        initial={{ opacity: 0, x: -50, y: 20 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
                        whileHover={{ scale: 1.08, y: -8, rotate: 1 }}
                        className="flex-1 relative group"
                      >
                        <div className="relative bg-gradient-to-br from-white via-white to-green-50/30 backdrop-blur-sm border-2 border-slate-200 rounded-3xl p-8 shadow-2xl hover:shadow-green-500/30 hover:border-green-400 transition-all duration-500 h-full overflow-hidden">
                          {/* Animated background glow */}
                          <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:to-transparent transition-all duration-500 rounded-3xl"></div>
                          
                          <div className="relative z-10">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all duration-300"
                            >
                              <stage.icon className="w-8 h-8 text-white" />
                            </motion.div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-green-700 transition-colors">{stage.title}</h3>
                            <p className="text-sm text-green-600 font-bold mb-4 uppercase tracking-wide">{stage.tagline}</p>
                            <p className="text-base text-slate-600 font-medium leading-relaxed">{stage.description}</p>
                          </div>
                          
                          {/* Decorative corner accent */}
                          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      </motion.div>
                      
                      {/* Connector Arrow (not after last item in row) */}
                      {index < 2 && (
                        <motion.div
                          initial={{ opacity: 0, scaleX: 0 }}
                          whileInView={{ opacity: 1, scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: (index + 3) * 0.1 + 0.4 }}
                          className="flex-shrink-0 flex items-center justify-center"
                          style={{ width: '48px' }}
                        >
                          <div className="relative flex items-center w-full h-2">
                            <div className="flex-1 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                            <ArrowRight className="w-5 h-5 text-green-600 ml-0.5" style={{ marginLeft: '2px' }} />
                          </div>
                        </motion.div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Flow (Vertical) */}
            <div className="lg:hidden space-y-6">
              {[
                {
                  icon: Database,
                  title: "Prospect Sourcing",
                  tagline: "Right people, right time.",
                  description: "We identify hiring decision-makers and map target accounts you should be speaking to."
                },
                {
                  icon: Search,
                  title: "Recruiting Research",
                  tagline: "Context before contact.",
                  description: "Every prospect is enriched with likely hiring needs, pain points, and why you fit."
                },
                {
                  icon: Flame,
                  title: "Strategic Warm Outreach",
                  tagline: "Familiarity before the call.",
                  description: "Multi-touch outreach builds recognition so prospects already expect the conversation."
                },
                {
                  icon: Phone,
                  title: "Recruiter Call Hub",
                  tagline: "Calls with context.",
                  description: "Call from a single platform with notes, intel, and next steps ready."
                },
                {
                  icon: Repeat,
                  title: "Post-Call Automations",
                  tagline: "Never miss a follow-up.",
                  description: "Auto-logged outcomes, instant follow-ups, and re-queues so briefs never slip."
                },
                {
                  icon: BarChart3,
                  title: "Brief Pipeline Control",
                  tagline: "Everything in one view.",
                  description: "Track warm responses, meetings, and briefs across every prospect."
                }
              ].map((stage, index) => (
                <React.Fragment key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, x: 5 }}
                    className="relative group"
                  >
                    <div className="relative bg-gradient-to-br from-white via-white to-green-50/40 backdrop-blur-sm border-2 border-slate-200 rounded-3xl p-6 shadow-2xl hover:shadow-green-500/30 hover:border-green-400 transition-all duration-500 overflow-hidden">
                      {/* Animated background glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:to-transparent transition-all duration-500 rounded-3xl"></div>
                      
                      <div className="relative z-10 flex items-start gap-4">
                        <motion.div
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all duration-300"
                        >
                          <stage.icon className="w-7 h-7 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-green-700 transition-colors">{stage.title}</h3>
                          <p className="text-sm text-green-600 font-bold mb-3 uppercase tracking-wide">{stage.tagline}</p>
                          <p className="text-sm text-slate-600 font-medium leading-relaxed">{stage.description}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Connector Arrow (not after last item) */}
                  {index < 5 && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0 }}
                      whileInView={{ opacity: 1, scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                      className="flex justify-center py-3"
                    >
                      <div className="relative">
                        <div className="w-1 h-10 bg-gradient-to-b from-green-400 via-green-500 to-green-600 rounded-full shadow-lg shadow-green-500/50"></div>
                        <motion.div
                          animate={{ y: [0, 4, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ArrowRight className="w-5 h-5 text-green-600 absolute -bottom-2 left-1/2 -translate-x-1/2 rotate-90 drop-shadow-lg" />
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-20 text-center"
          >
            <div className="relative bg-gradient-to-r from-green-600 via-green-500 to-green-600 rounded-3xl p-12 shadow-2xl shadow-green-600/40 overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }}></div>
              </div>
              
              <div className="relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block mb-6"
                >
                  <Zap className="w-12 h-12 text-white/90" />
                </motion.div>
                <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                  Ready to win more briefs?
                </h3>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  We build the system that turns prospects into booked meetings.
                </p>
                <motion.a
                  href="#signup"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-10 py-5 bg-white hover:bg-green-50 text-green-600 rounded-xl font-bold text-xl transition-all duration-200 shadow-2xl hover:shadow-white/50"
                >
                  Book a Strategy Call
                  <ArrowRight className="w-6 h-6" />
                </motion.a>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Signup Section */}
      <section id="signup" className="relative py-32 px-8 overflow-hidden">
        {/* Enhanced background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-green-50/30"></div>
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Get Started Today
            </h2>
            <p className="text-2xl text-slate-600 font-medium">
              A bespoke system that frees recruiters to focus on conversations.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <InterestForm />
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-500 to-green-600"></div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        ></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block mb-6"
            >
              <Zap className="w-16 h-16 text-white/90" />
            </motion.div>
            <h2 className="text-5xl lg:text-7xl font-bold text-white mb-8">
              Ready to transform your recruiting?
            </h2>
            <p className="text-2xl text-white/90 mb-12 font-medium max-w-2xl mx-auto">
              Prospecting, outreach, research, and follow-ups — fully handled.
            </p>
            
            <motion.a
              href="#signup"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-12 py-6 bg-white hover:bg-green-50 text-green-600 rounded-xl font-bold text-xl transition-all duration-200 shadow-2xl shadow-white/30"
            >
              Book a Strategy Call
              <ArrowRight className="w-6 h-6" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-bold mb-4">Born</div>
              <p className="text-slate-400 font-medium mb-6 max-w-md">
                A bespoke recruiting system that removes admin and mental load so you can book meetings and win briefs.
              </p>
              <div className="flex gap-4">
                {/* Social icons placeholder */}
                <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                  <span className="text-xs">LI</span>
                </div>
                <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                  <span className="text-xs">TW</span>
                </div>
                <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                  <span className="text-xs">FB</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#pipeline" className="text-slate-400 hover:text-white transition-colors font-medium">System</a></li>
                <li><a href="#signup" className="text-slate-400 hover:text-white transition-colors font-medium">Get Started</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Privacy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8">
            <p className="text-slate-400 text-sm font-medium text-center">
              © 2024 Born. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;