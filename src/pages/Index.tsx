import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Menu, ShieldCheck, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

type DemoFormData = {
  fullName: string;
  workEmail: string;
  company: string;
  role: string;
  teamSize: string;
  goals: string;
};

type DemoFormErrors = Partial<Record<keyof DemoFormData, string>>;

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#results', label: 'Results' },
  { href: '#testimonials', label: 'Customer stories' },
  { href: '#faq', label: 'FAQ' },
] as const;

const INITIAL_FORM: DemoFormData = {
  fullName: '',
  workEmail: '',
  company: '',
  role: '',
  teamSize: '',
  goals: '',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(data: DemoFormData): DemoFormErrors {
  const errors: DemoFormErrors = {};
  if (!data.fullName.trim()) errors.fullName = 'Enter your full name.';
  if (!data.workEmail.trim()) {
    errors.workEmail = 'Enter your work email address.';
  } else if (!EMAIL_PATTERN.test(data.workEmail.trim())) {
    errors.workEmail = 'Use a valid email format like name@company.com.';
  }
  if (!data.company.trim()) errors.company = 'Enter your company name.';
  if (!data.role.trim()) errors.role = 'Choose the role that best describes you.';
  if (!data.teamSize.trim()) errors.teamSize = 'Select your current team size.';
  return errors;
}

export default function Index() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('how-it-works');
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [touched, setTouched] = useState<Partial<Record<keyof DemoFormData, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success'>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const errors = useMemo(() => validateForm(formData), [formData]);
  const hasErrors = Object.keys(errors).length > 0;

  useEffect(() => {
    const sections = ['how-it-works', 'results', 'testimonials', 'faq'];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      { threshold: 0.45 }
    );

    sections.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched({
      fullName: true,
      workEmail: true,
      company: true,
      role: true,
      teamSize: true,
    });

    if (hasErrors) {
      setSubmitError('Review the highlighted fields and correct them before submitting.');
      setSubmitStatus('idle');
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      setSubmitStatus('success');
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  }

  function markTouched(field: keyof DemoFormData) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[999] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900 focus:shadow-md"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8" aria-label="Primary">
          <Link to="/" className="flex items-center gap-2 text-slate-900" aria-label="Born home page">
            <span className="rounded-lg bg-emerald-600 px-2 py-1 text-sm font-bold text-white">B</span>
            <span className="text-lg font-bold tracking-tight">Born</span>
          </Link>

          <ul className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`text-sm font-medium ${
                    activeSection === link.href.slice(1) ? 'text-emerald-700' : 'text-slate-700 hover:text-slate-900'
                  }`}
                  aria-current={activeSection === link.href.slice(1) ? 'location' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#book-demo"
              className="hidden rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 md:inline-flex"
            >
              Book a demo
            </a>
            <button
              type="button"
              className="inline-flex rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div id="mobile-nav" className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
            <ul className="space-y-3" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#book-demo"
                  className="block rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Book a demo
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      <main id="main-content">
        <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-14 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
              Built for recruitment teams
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Book more qualified client conversations without adding admin work.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-700">
              Born is a recruitment outreach platform for agency recruiters and talent leaders who need a predictable pipeline.
              We handle prospecting, warm-up outreach, and follow-up automation so your team can focus on live calls and placements.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#book-demo" className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
                Request your tailored walkthrough
              </a>
              <a href="#how-it-works" className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-white">
                See how the system works
              </a>
            </div>
            <p className="mt-4 text-sm text-slate-600">No credit card required. Live onboarding support included.</p>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm" aria-label="Outcome summary">
            <h2 className="text-2xl font-bold text-slate-900">What teams improve in the first 60 days</h2>
            <ul className="mt-6 space-y-4">
              {[
                'More qualified conversations with hiring decision-makers',
                'Faster follow-up completion after every call',
                'Clear weekly visibility into pipeline performance',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section id="how-it-works" className="border-y border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">How it works</h2>
            <p className="mt-3 max-w-3xl text-slate-700">
              A five-step workflow that removes guesswork, keeps your team aligned, and prevents prospects from going cold.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {[
                ['1', 'Find target accounts', 'Continuous sourcing based on growth, hiring, and intent signals.'],
                ['2', 'Warm up prospects', 'Multi-touch sequences build familiarity before your call.'],
                ['3', 'Call with context', 'Reps get role, pain-point, and hiring insight before dialing.'],
                ['4', 'Automate follow-up', 'Call outcomes trigger next best actions automatically.'],
                ['5', 'Review weekly performance', 'Leaders track conversion and adjust strategy quickly.'],
              ].map(([step, title, body]) => (
                <article key={step} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-emerald-700">Step {step}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="results" className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Performance outcomes</h2>
            <p className="mt-3 max-w-3xl text-slate-700">
              Teams use Born to create a repeatable outbound process that is easier to manage and easier to scale.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ['47%', 'Increase in meetings booked', 'Measured across active customers over the last quarter.'],
                ['12 hrs', 'Weekly admin time saved', 'Automated follow-up and research preparation remove manual work.'],
                ['89%', 'Follow-up completion rate', 'Structured workflows reduce dropped opportunities.'],
              ].map(([value, title, body]) => (
                <article key={title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-3xl font-bold text-emerald-700">{value}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm text-slate-700">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Customer stories and trust signals</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-slate-900">Northbridge Talent</h3>
                <p className="mt-2 text-slate-700">
                  "Our team stopped juggling spreadsheets. Every call now has context, and our conversion rate improved in six weeks."
                </p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-slate-900">Stone & Field Search</h3>
                <p className="mt-2 text-slate-700">
                  "The biggest win is consistency. New recruiters follow a proven process from day one."
                </p>
              </article>
            </div>
            <p className="mt-6 inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
              <ShieldCheck className="h-4 w-4" />
              SOC 2 Type II controls and role-based access support your data governance requirements.
            </p>
          </div>
        </section>

        <section id="book-demo" className="border-y border-slate-200 bg-slate-100 py-16">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Request a tailored demo</h2>
            <p className="mt-3 text-slate-700">
              Tell us about your team so we can show workflows relevant to your market and hiring volume.
            </p>

            <form className="mt-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm" noValidate onSubmit={handleSubmit}>
              {submitError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
                  {submitError}
                </div>
              )}
              {submitStatus === 'success' && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
                  Demo request received. Redirecting you to next steps.
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-slate-800">
                    Full name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    value={formData.fullName}
                    onBlur={() => markTouched('fullName')}
                    onChange={(event) => setFormData((prev) => ({ ...prev, fullName: event.target.value }))}
                    placeholder="Alex Morgan"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
                    aria-invalid={touched.fullName && Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    required
                  />
                  <p className="mt-1 text-xs text-slate-600">Use your legal name so we can personalize your session.</p>
                  {touched.fullName && errors.fullName && (
                    <p id="fullName-error" className="mt-1 text-sm text-rose-700">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="workEmail" className="block text-sm font-medium text-slate-800">
                    Work email <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="workEmail"
                    name="workEmail"
                    type="email"
                    autoComplete="email"
                    value={formData.workEmail}
                    onBlur={() => markTouched('workEmail')}
                    onChange={(event) => setFormData((prev) => ({ ...prev, workEmail: event.target.value }))}
                    placeholder="alex@company.com"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
                    aria-invalid={touched.workEmail && Boolean(errors.workEmail)}
                    aria-describedby={errors.workEmail ? 'workEmail-error' : undefined}
                    required
                  />
                  <p className="mt-1 text-xs text-slate-600">We use this for confirmation and scheduling only.</p>
                  {touched.workEmail && errors.workEmail && (
                    <p id="workEmail-error" className="mt-1 text-sm text-rose-700">
                      {errors.workEmail}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-slate-800">
                    Company <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    value={formData.company}
                    onBlur={() => markTouched('company')}
                    onChange={(event) => setFormData((prev) => ({ ...prev, company: event.target.value }))}
                    placeholder="Northbridge Talent"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
                    aria-invalid={touched.company && Boolean(errors.company)}
                    aria-describedby={errors.company ? 'company-error' : undefined}
                    required
                  />
                  {touched.company && errors.company && (
                    <p id="company-error" className="mt-1 text-sm text-rose-700">
                      {errors.company}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-slate-800">
                    Role <span className="text-rose-600">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onBlur={() => markTouched('role')}
                    onChange={(event) => setFormData((prev) => ({ ...prev, role: event.target.value }))}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
                    aria-invalid={touched.role && Boolean(errors.role)}
                    aria-describedby={errors.role ? 'role-error' : undefined}
                    required
                  >
                    <option value="">Select your role</option>
                    <option value="agency-owner">Agency owner</option>
                    <option value="recruitment-lead">Recruitment lead</option>
                    <option value="recruiter">Recruiter</option>
                    <option value="talent-director">Talent director</option>
                  </select>
                  {touched.role && errors.role && (
                    <p id="role-error" className="mt-1 text-sm text-rose-700">
                      {errors.role}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="teamSize" className="block text-sm font-medium text-slate-800">
                    Team size <span className="text-rose-600">*</span>
                  </label>
                  <select
                    id="teamSize"
                    name="teamSize"
                    value={formData.teamSize}
                    onBlur={() => markTouched('teamSize')}
                    onChange={(event) => setFormData((prev) => ({ ...prev, teamSize: event.target.value }))}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
                    aria-invalid={touched.teamSize && Boolean(errors.teamSize)}
                    aria-describedby={errors.teamSize ? 'teamSize-error' : undefined}
                    required
                  >
                    <option value="">Select team size</option>
                    <option value="1">Solo recruiter</option>
                    <option value="2-5">2 to 5 recruiters</option>
                    <option value="6-15">6 to 15 recruiters</option>
                    <option value="16+">16+ recruiters</option>
                  </select>
                  {touched.teamSize && errors.teamSize && (
                    <p id="teamSize-error" className="mt-1 text-sm text-rose-700">
                      {errors.teamSize}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="goals" className="block text-sm font-medium text-slate-800">
                    Primary goal <span className="text-slate-500">(optional)</span>
                  </label>
                  <input
                    id="goals"
                    name="goals"
                    type="text"
                    value={formData.goals}
                    onChange={(event) => setFormData((prev) => ({ ...prev, goals: event.target.value }))}
                    placeholder="Improve meeting conversion by 20%"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting request...' : 'Schedule my walkthrough'}
              </button>
            </form>
          </div>
        </section>

        <section id="faq" className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">FAQ and support</h2>
            <div className="mt-8 space-y-4">
              <article className="rounded-xl border border-slate-200 p-5">
                <h3 className="text-lg font-semibold text-slate-900">How long does onboarding take?</h3>
                <p className="mt-2 text-slate-700">Most teams complete setup in under seven business days with live support.</p>
              </article>
              <article className="rounded-xl border border-slate-200 p-5">
                <h3 className="text-lg font-semibold text-slate-900">Do you integrate with ATS and CRM tools?</h3>
                <p className="mt-2 text-slate-700">Yes. We map data fields and automate sync during onboarding so reps avoid duplicate entry.</p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-950 py-12 text-slate-200">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-4 lg:px-8">
          <div className="lg:col-span-2">
            <p className="text-lg font-semibold text-white">Born</p>
            <p className="mt-3 max-w-md text-sm text-slate-400">
              Recruitment outreach for high-performing teams that need consistent pipeline growth and predictable follow-up execution.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Help</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/help" className="text-slate-300 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="mailto:support@born.example" className="text-slate-300 hover:text-white">
                  Contact support
                </a>
              </li>
              <li>
                <a href="#book-demo" className="text-slate-300 hover:text-white">
                  Book a walkthrough
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Legal</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-slate-300 hover:text-white">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-300 hover:text-white">
                  Terms of service
                </Link>
              </li>
              <li>
                <a href="#testimonials" className="text-slate-300 hover:text-white">
                  Customer stories
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-7xl px-6 text-xs text-slate-500 lg:px-8">
          © {new Date().getFullYear()} Born. Response SLA: under 24 hours on business days.
        </p>
      </footer>
    </div>
  );
}
