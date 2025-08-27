import React from 'react';
import { ArrowRight, CheckCircle, Clock, FileCheck, Users } from 'lucide-react';
import { track } from '@/lib/analytics';

// Placeholder URL - replace with actual form URL
const SIGNUP_FORM_URL = "https://forms.example.com/students-signup";

const Students = () => {
  const handleSignUpClick = () => {
    track('students_sign_up_click');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <nav className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold text-slate-900"> Born</div>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0l5hcAP0GJsTrC3xx9WsSC2STrNJ55QtkMaYPgwLyGuD7tyiIv1mCLDk1TRWYSkQIcb-qEgVPM?gv=true"
              target="_blank"
              rel="noopener noreferrer"
              data-cta="demo"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-green-600/20 hover:shadow-green-600/30"
            >
              Book demo
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="pt-24">
        {/* Hero Section */}
        <section className="py-24 px-8 bg-gradient-to-br from-slate-50 via-white to-slate-100">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-green-600 text-sm font-bold mb-4 uppercase tracking-wide">
              Born for Students
            </div>
            <h1 className="text-6xl font-bold text-slate-900 mb-8">
              Simple projects. Real experience. Get paid.
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
              We match Australian uni students and recent grads to short, practical projects with startups and SMEs. Sign up once. We'll match you based on skills, availability, and interests.
            </p>
            <a 
              href={SIGNUP_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleSignUpClick}
              className="px-12 py-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xl transition-all duration-200 shadow-2xl shadow-green-600/30 hover:shadow-green-600/50 hover:scale-105 inline-flex items-center gap-3"
            >
              Sign up
              <ArrowRight className="w-6 h-6" />
            </a>
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
              <a 
                href={SIGNUP_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSignUpClick}
                className="px-12 py-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xl transition-all duration-200 shadow-2xl shadow-green-600/30 hover:shadow-green-600/50 hover:scale-105 flex items-center justify-center gap-3"
              >
                Sign up
                <ArrowRight className="w-6 h-6" />
              </a>
            </div>
            
            <p className="text-slate-600 font-medium">
              Questions? <a href="mailto:hello@born.directory" className="text-green-600 hover:text-green-700 underline">Email us</a>
            </p>
          </div>
        </section>

        {/* Footer Spacer */}
        <div className="h-16"></div>
      </div>
    </div>
  );
};

export default Students;
