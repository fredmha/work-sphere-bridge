import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Users, Zap, Menu, X, Phone, MessageSquare, Calendar, BarChart3, Bot, Workflow, Play, TrendingUp, Target, Clock, Mail, User, Building2 } from 'lucide-react';
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
          'Budget Range': formData.teamSize,
          Company: formData.company,
          Name: formData.name
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
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Get Started Today</h3>
      <p className="text-slate-600 font-medium mb-6">
        Experience the future of outbound sales automation. Start today.
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
              <option value="sales-director">Sales Director</option>
              <option value="sales-manager">Sales Manager</option>
              <option value="sales-rep">Sales Rep</option>
              <option value="founder">Founder</option>
              <option value="agency-owner">Agency Owner</option>
              <option value="broker">Broker</option>
              <option value="consultant">Consultant</option>
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
            <option value="1-5">1-5 reps</option>
            <option value="6-20">6-20 reps</option>
            <option value="21-50">21-50 reps</option>
            <option value="50+">50+ reps</option>
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <nav className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold text-slate-900">Born</div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
              <a href="#signup" className="hover:text-slate-900 transition-colors">Get Started</a>
              <a href="/students" className="hover:text-slate-900 transition-colors">Talent Placement</a>
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
                    href="#features"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                  >
                    Features
                  </a>
                  <a
                    href="#signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                  >
                    Get Started
                  </a>
                  <a
                    href="/students"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                  >
                    Talent Placement
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-24 px-8 bg-white/60 backdrop-blur-sm pt-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6">
                  <span className="text-slate-900">From manual dials to a</span><br />
                  <span className="text-green-600">predictable conversion engine.</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed mb-4 font-medium">
                  Turn your sales team into a systematic revenue machine. More calls, more touches, more conversations, less admin. Built for agencies, brokers, consultants, and sales teams who are tired of manual dialing chaos.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#signup"
                  className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-xl shadow-green-600/25 hover:shadow-green-600/40 hover:scale-105 flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a 
                  href="/students"
                  className="px-8 py-4 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  Talent Placement
                </a>
              </div>
              
              <p className="text-slate-400 text-sm font-medium">
                Built for agencies, brokers, consultants, and sales teams.
              </p>
            </div>

            {/* Right: Cool SaaS Dashboard */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full h-96">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl"></div>
                
                {/* Main dashboard mockup */}
                <div className="relative bg-white/90 backdrop-blur-sm border border-slate-200 rounded-3xl p-6 shadow-2xl h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Outbound Engine</div>
                  </div>
                  
                  {/* Dashboard content */}
                  <div className="space-y-4">
                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-green-50 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-green-600">847</div>
                        <div className="text-xs text-green-700">Calls Today</div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-blue-600">23</div>
                        <div className="text-xs text-blue-700">Meetings Set</div>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-purple-600">12%</div>
                        <div className="text-xs text-purple-700">Connect Rate</div>
                      </div>
                    </div>
                    
                    {/* Activity chart mockup */}
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-semibold text-slate-900">Activity</div>
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
                        <div className="text-xs text-green-600 font-medium">Active</div>
                      </div>
                      <div className="mt-2 text-xs text-slate-600">Next: Sarah Johnson - Real Estate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-24 px-8 bg-gradient-to-b from-white/60 to-slate-50/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">The Engine That Powers Your Pipeline</h2>
            <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto">
              From manual dials to a predictable conversion engine. More calls, more touches, more conversations, less admin.
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-xl">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Power Dialler</h3>
              <p className="text-slate-600 font-medium">Queue calls automatically → 3–4x more activity per rep.</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-xl">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Multi-channel Automation</h3>
              <p className="text-slate-600 font-medium">SMS, voicemail drops, email follow-ups after no answer.</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-xl">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">AI Assistants</h3>
              <p className="text-slate-600 font-medium">Instantly respond to basic texts ("Who's this?" / "Send info").</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-xl">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Calendar Sync</h3>
              <p className="text-slate-600 font-medium">One-click appointment booking.</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-xl">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Central Dashboard</h3>
              <p className="text-slate-600 font-medium">Track calls, outcomes, ROI in real time.</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-xl">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <Workflow className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Custom Workflows</h3>
              <p className="text-slate-600 font-medium">Every touchpoint adapted to the client's sales style.</p>
            </div>
          </div>
          
          {/* Benefits */}
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-xl mb-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Outcomes You'll See</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">More Conversations</h4>
                  <p className="text-slate-600 text-sm font-medium">Predictable pipeline from systematic outreach</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">No More Manual Chasing</h4>
                  <p className="text-slate-600 text-sm font-medium">System handles follow-ups automatically</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Seamless Booking</h4>
                  <p className="text-slate-600 text-sm font-medium">Booked appointments flow directly into calendars</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Block */}
          <div className="text-center">
            <a 
              href="#signup"
              className="px-12 py-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xl transition-all duration-200 shadow-2xl shadow-green-600/30 hover:shadow-green-600/50 hover:scale-105 inline-flex items-center gap-3"
            >
              Get Started
              <ArrowRight className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>

      {/* Signup Section */}
      <section id="signup" className="py-24 px-8 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">Get Started Today</h2>
            <p className="text-xl text-slate-600 font-medium">
              Experience the future of outbound sales automation
            </p>
          </div>
          
          <InterestForm />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-8 bg-gradient-to-b from-slate-50/80 to-white/60">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-bold text-slate-900 mb-8">
            Ready to transform your outbound?
          </h2>
          <p className="text-xl text-slate-600 mb-12 font-medium max-w-2xl mx-auto">
            Experience the future of sales automation.
          </p>
          
          <a 
            href="#signup"
            className="px-12 py-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xl transition-all duration-200 shadow-2xl shadow-green-600/30 hover:shadow-green-600/50 hover:scale-105 inline-flex items-center gap-3"
          >
            Get Started
            <ArrowRight className="w-6 h-6" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-bold mb-4">Born</div>
              <p className="text-slate-400 font-medium mb-6 max-w-md">
                From manual dials to predictable conversion engines. We power agencies, brokers, consultants, and sales teams with systematic outbound automation.
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
                <li><a href="#features" className="text-slate-400 hover:text-white transition-colors font-medium">Features</a></li>
                <li><a href="#signup" className="text-slate-400 hover:text-white transition-colors font-medium">Get Started</a></li>
                <li><a href="/students" className="text-slate-400 hover:text-white transition-colors font-medium">Talent Placement</a></li>
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