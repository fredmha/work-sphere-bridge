import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Clock, FileCheck, Users, Menu, X } from 'lucide-react';
import { track } from '@/lib/analytics';
import { AuthModal } from '@/components/auth/AuthModal';
import { useIsMobile } from '@/hooks/use-mobile';

const Students = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSignUpClick = () => {
    track('students_sign_up_click');
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <nav className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="text-2xl font-bold text-slate-900 hover:text-green-600 transition-colors"> Born</a>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="/students" className="hover:text-slate-900 transition-colors">Talent Placement</a>
              <a href="/" className="hover:text-slate-900 transition-colors">Outbound Engine</a>
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
              <button 
                onClick={handleSignUpClick}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-green-600/20 hover:shadow-green-600/30"
              >
                Sign Up
              </button>
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
                    href="/students"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                  >
                    Talent Placement
                  </a>
                  <a
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                  >
                    Outbound Engine
                  </a>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignUpClick();
                    }}
                    className="block w-full text-left py-3 px-4 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                  >
                    Sign Up
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="pt-24">
        {/* Hero Section */}
        <section className="py-24 px-8 bg-gradient-to-br from-slate-50 via-white to-slate-100">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-green-600 text-sm font-bold mb-4 uppercase tracking-wide">
              Born Talent Placement
            </div>
            <h1 className="text-6xl font-bold text-slate-900 mb-8">
              The talent you need, on demand.
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
              Hire vetted student contractors and early-career talent on flexible terms. Pay-for-performance model ensures quality delivery. Get matched with pre-screened talent ready to execute your projects.
            </p>
            <button 
              onClick={handleSignUpClick}
              className="px-12 py-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xl transition-all duration-200 shadow-2xl shadow-green-600/30 hover:shadow-green-600/50 hover:scale-105 inline-flex items-center gap-3"
            >
              Sign up
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </section>

        {/* Notice Section */}
        <section className="py-16 px-8 bg-white/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-amber-800 mb-4">Why this page?</h2>
              <p className="text-amber-700 font-medium leading-relaxed">
                Our previous student platform was on Bubble. We're moving the product to a new stack to support better matching, payments, and compliance. While the full app is in flight, this page lets you sign up so you can keep getting paid work.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 px-8 bg-gradient-to-b from-slate-50/80 to-white/60">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-slate-900 mb-4">How it works</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-xl">
                <div className="text-green-600 text-sm font-bold mb-2 uppercase tracking-wide">Step 1</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Tell us about you</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Add your skills, tools, uni, and availability. Takes 2 minutes.
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-xl">
                <div className="text-green-600 text-sm font-bold mb-2 uppercase tracking-wide">Step 2</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">We shortlist and match</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  We line you up with projects that fit your skills and timing.
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-xl">
                <div className="text-green-600 text-sm font-bold mb-2 uppercase tracking-wide">Step 3</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Start and get paid</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  You'll work directly with the business. We sort compliance and payments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Models Section */}
        <section className="py-24 px-8 bg-white/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-slate-900 mb-4">Payment models</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/60 backdrop-blur border border-slate-200 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-8 h-8 text-green-600" />
                  <h3 className="text-2xl font-bold text-slate-900">Timesheet</h3>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Hourly work with weekly timesheets. Good for ongoing tasks or flexible scopes.
                </p>
              </div>
              
              <div className="bg-white/60 backdrop-blur border border-slate-200 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <h3 className="text-2xl font-bold text-slate-900">Milestone</h3>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Fixed price per milestone. You get paid as each milestone is approved.
                </p>
              </div>
              
              <div className="bg-white/60 backdrop-blur border border-slate-200 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <FileCheck className="w-8 h-8 text-green-600" />
                  <h3 className="text-2xl font-bold text-slate-900">Task based</h3>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Clear deliverables at a set price. Great for UGC, research, and quick design tweaks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Match On Section */}
        <section className="py-24 px-8 bg-gradient-to-b from-slate-50/80 to-white/60">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-slate-900 mb-4">What we match on</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700 font-semibold text-lg">Your skills and tools</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700 font-semibold text-lg">Availability and timezone</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700 font-semibold text-lg">Interests and preferred work types</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700 font-semibold text-lg">Portfolio or examples if you have them</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 px-8 bg-white/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-6xl font-bold text-slate-900 mb-12">
              Ready to be matched?
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <button 
                onClick={handleSignUpClick}
                className="px-12 py-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xl transition-all duration-200 shadow-2xl shadow-green-600/30 hover:shadow-green-600/50 hover:scale-105 flex items-center justify-center gap-3"
              >
                Sign up
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
            
            <p className="text-slate-600 font-medium">
              Questions? <a href="mailto:hello@born.directory" className="text-green-600 hover:text-green-700 underline">Email us</a>
            </p>
          </div>
        </section>

        {/* Footer Spacer */}
        <div className="h-16"></div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false);
          // Show thanks message
          alert('Thanks for signing up! We\'ll be in touch soon.');
        }} 
        defaultTab={authMode}
      />
    </div>
  );
};

export default Students;
