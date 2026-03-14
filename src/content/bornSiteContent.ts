export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  audience: string;
  includes: string[];
  outcomes: string[];
}

export interface IndustryItem {
  slug: string;
  title: string;
  summary: string;
  painPoints: string[];
  buildFocus: string[];
  outcomes: string[];
}

export interface CaseStudyItem {
  slug: string;
  title: string;
  clientType: string;
  summary: string;
  problem: string;
  build: string[];
  workflow: string;
  outcome: string;
  takeaway: string;
}

export interface InsightSection {
  heading: string;
  body: string;
}

export interface InsightItem {
  slug: string;
  title: string;
  summary: string;
  topic: string;
  takeaways: string[];
  sections: InsightSection[];
}

export interface ProcessStage {
  name: string;
  summary: string;
  output: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const primaryCta = {
  label: 'Book a Recruiter Systems Audit',
  to: '/contact',
} as const;

export const siteNav = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Use Cases', href: '/industries' },
  { label: 'Process', href: '/process' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'About', href: '/about' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
] as const satisfies readonly NavItem[];

export const trustPoints = [
  'Recruiter-only',
  'Custom workflow builds',
  'Founder-led delivery',
  'CRM and automation implementation',
] as const;

export const homePillars = [
  {
    title: 'Hiring-signal sourcing',
    description:
      'Born designs recruiter prospecting engines around hiring signals, account qualification, and the exact research your team needs before outreach starts.',
  },
  {
    title: 'Outreach and call orchestration',
    description:
      'Sequences, reply routing, call prep, and task queues are built to match recruiter business-development workflows rather than generic SDR templates.',
  },
  {
    title: 'Pipeline and follow-up control',
    description:
      'CRM stages, reminders, automations, and review loops keep recruiter follow-up visible after every reply, intro call, and live opportunity.',
  },
] as const;

export const audienceCards = [
  {
    title: 'Contingent desks',
    description:
      'Fast client-side business development systems for teams that need more recruiter conversations from active hiring signals and disciplined follow-up.',
  },
  {
    title: 'Retained search teams',
    description:
      'Higher-context workflow design for firms that need tighter research, stronger outreach quality, and cleaner pipeline management across longer cycles.',
  },
  {
    title: 'Executive search firms',
    description:
      'Custom recruiter infrastructure for senior search teams where account selection, briefing context, and relationship follow-up matter more than pure volume.',
  },
  {
    title: 'Growth-stage agencies',
    description:
      'Recruitment firms that have outgrown spreadsheets and ad hoc tools, and now need bespoke software, automation, and operating discipline.',
  },
] as const;

export const services = [
  {
    slug: 'recruiter-system-architecture',
    title: 'Recruiter System Architecture',
    summary:
      'A custom recruiter operating system spanning sourcing, outreach, CRM structure, recruiter tasks, and follow-up control.',
    problem:
      'Most agencies have fragments of process spread across spreadsheets, inboxes, CRM views, and recruiter habit. Born turns that into one working system.',
    audience: 'Best for recruitment firms that need the full commercial workflow designed properly, not another isolated tool.',
    includes: [
      'Current-state workflow audit',
      'Recruiter process mapping from signal to booked conversation',
      'CRM structure, task routing, and automation logic',
      'Implementation plan for recruiters, managers, and follow-up owners',
      'Launch support and operating guidance',
    ],
    outcomes: [
      'One coherent recruiter workflow instead of tool sprawl',
      'Stronger control over outreach, calls, and next actions',
      'A system the team can keep running after implementation',
    ],
  },
  {
    slug: 'hiring-signal-prospecting-engine',
    title: 'Hiring-Signal Prospecting Engine',
    summary: 'Custom sourcing and research infrastructure that helps recruiters find better-fit agency opportunities faster.',
    problem:
      'Manual list building creates stale data, weak context, and uneven quality. Recruiters need sourcing logic built around live signals and account relevance.',
    audience: 'Best for firms where business development starts with hiring activity, market triggers, and structured recruiter research.',
    includes: [
      'Signal source selection and qualification rules',
      'Research enrichment for company, role, and hiring context',
      'Prioritisation views for recruiter review',
      'Data hygiene and routing into the working pipeline',
    ],
    outcomes: [
      'Better-fit accounts entering the recruiter workflow',
      'Less time lost to manual sourcing loops',
      'More context available before first-touch outreach',
    ],
  },
  {
    slug: 'recruiter-outreach-and-reply-routing',
    title: 'Recruiter Outreach and Reply Routing',
    summary: 'Bespoke sequence design and response handling for recruiter-led business development.',
    problem:
      'Most recruiter outreach breaks after the first touch because reply handling, call creation, and follow-up ownership are left undefined.',
    audience: 'Best for agencies with lead sources in place but inconsistent recruiter execution after outreach starts.',
    includes: [
      'Multi-step outreach structure matched to recruiter offers',
      'Segment-specific message architecture',
      'Reply triage, handoff, and task creation rules',
      'Review checkpoints for message and workflow quality',
    ],
    outcomes: [
      'Cleaner movement from reply to recruiter action',
      'More consistent business-development follow-up',
      'Less dependence on memory and inbox management',
    ],
  },
  {
    slug: 'call-queue-and-follow-up-automation',
    title: 'Call Queue and Follow-Up Automation',
    summary: 'Daily recruiter call workflows, briefing context, and post-call automation built around commercial discipline.',
    problem:
      'Recruiters often rely on calls to convert interest into meetings, but the prep, queue design, and follow-up structure are usually weak or missing.',
    audience: 'Best for recruiter teams where calls, voicemail, and rapid follow-up sit at the centre of conversion.',
    includes: [
      'Daily call queue and prioritisation design',
      'Call brief structure and account context views',
      'Post-call task creation and reminder logic',
      'Pipeline stages and SLA-style follow-up rules',
    ],
    outcomes: [
      'Faster movement from signal to recruiter conversation',
      'Less lead leakage after calls and meetings',
      'Better visibility into what needs action each day',
    ],
  },
  {
    slug: 'custom-recruiter-software-advisory',
    title: 'Custom Recruiter Software Advisory',
    summary: 'Senior guidance for firms deciding what recruiter workflow software to build, keep, replace, or automate next.',
    problem:
      'Some agencies do not need a full rebuild immediately. They need a sharp view on what their recruiter stack should do and what should change first.',
    audience: 'Best for recruitment firms with partial infrastructure in place but weak alignment between sourcing, outreach, and follow-up.',
    includes: [
      'Tooling and workflow audit',
      'Priority roadmap for recruiter systems changes',
      'Custom automation and operating-model recommendations',
      'Implementation sequencing for the next build phase',
    ],
    outcomes: [
      'Clear decisions instead of more software drift',
      'A sharper roadmap for custom recruiter systems work',
      'Higher confidence before committing to the next build',
    ],
  },
] as const satisfies readonly ServiceItem[];

export const industries = [
  {
    slug: 'contingent-recruitment-desks',
    title: 'Contingent Recruitment Desks',
    summary: 'Systems built for speed, hiring-signal responsiveness, and tighter recruiter follow-up after first contact.',
    painPoints: [
      'New opportunities arrive inconsistently because sourcing is manual and unstructured',
      'Recruiters lose momentum between first touch, calls, and next actions',
      'Managers lack visibility into where business-development follow-up is stalling',
    ],
    buildFocus: [
      'Hiring-signal intake and account prioritisation',
      'Recruiter outreach sequencing and rapid task creation',
      'Call queues and pipeline views for same-day follow-up',
    ],
    outcomes: [
      'More recruiter conversations from live-market signals',
      'Faster response speed across the desk',
      'Cleaner commercial visibility for team leads',
    ],
  },
  {
    slug: 'retained-search-teams',
    title: 'Retained Search Teams',
    summary: 'Higher-context workflow design for firms where precision, research quality, and stakeholder follow-up matter most.',
    painPoints: [
      'Senior accounts need richer research than the current workflow can support',
      'Outreach quality drops when account context is scattered across tools',
      'Follow-up after strong conversations is inconsistent and difficult to track',
    ],
    buildFocus: [
      'Account research structure and context packaging',
      'Low-volume, high-quality outreach design',
      'Pipeline stages for relationship-led recruiter development',
    ],
    outcomes: [
      'Better-quality first touches to target accounts',
      'Stronger continuity after calls and introductions',
      'A more deliberate commercial process without extra admin',
    ],
  },
  {
    slug: 'executive-search-firms',
    title: 'Executive Search Firms',
    summary: 'Bespoke recruiter software and workflow architecture for complex search cycles and senior relationship management.',
    painPoints: [
      'Commercial workflows are too bespoke for generic CRM defaults',
      'Senior recruiter context is trapped in notes and individual habit',
      'Leadership has limited visibility into follow-up discipline across the team',
    ],
    buildFocus: [
      'Custom pipeline structure for longer search-led cycles',
      'Briefing, outreach, and relationship context capture',
      'Automation that supports precision rather than volume',
    ],
    outcomes: [
      'A more premium operating system for senior search work',
      'Less workflow dependence on individual memory',
      'Stronger control across long-cycle recruiter relationships',
    ],
  },
  {
    slug: 'growth-stage-recruitment-agencies',
    title: 'Growth-Stage Recruitment Agencies',
    summary: 'Custom systems for agencies moving from improvised hustle into repeatable recruiter execution.',
    painPoints: [
      'Process quality depends too much on a few strong operators',
      'The agency has tools, but no real operating layer connecting them',
      'Recruiters spend too much time managing admin instead of conversations',
    ],
    buildFocus: [
      'Workflow simplification across sourcing, outreach, and follow-up',
      'Automation and task routing that reduce recruiter admin',
      'A recruiter system foundation that can scale with new hires',
    ],
    outcomes: [
      'More consistent business-development execution across the team',
      'Lower admin load for recruiters and leaders',
      'A cleaner base for future agency growth',
    ],
  },
] as const satisfies readonly IndustryItem[];

export const processStages = [
  {
    name: 'Audit',
    summary: 'Review recruiter workflow, offer shape, data quality, current tooling, and where follow-up is breaking down.',
    output: 'A concrete view of what the agency should keep, replace, and rebuild.',
  },
  {
    name: 'Workflow Design',
    summary: 'Define the recruiter path from live market signal through outreach, calls, pipeline updates, and next actions.',
    output: 'A recruiter systems blueprint before implementation starts.',
  },
  {
    name: 'Build',
    summary: 'Implement sourcing logic, recruiter views, automation, sequences, and CRM structure around the agreed operating model.',
    output: 'A custom recruiter system configured around how the desk actually works.',
  },
  {
    name: 'Launch',
    summary: 'Move the workflow into live use with call queues, handoff rules, and clear day-to-day operating guidance.',
    output: 'A practical starting point for daily recruiter execution.',
  },
  {
    name: 'Refine',
    summary: 'Review reply quality, call outcomes, task flow, and conversion patterns to improve the system without guesswork.',
    output: 'A sharper recruiter workflow based on real usage signals.',
  },
] as const satisfies readonly ProcessStage[];

export const caseStudies = [
  {
    slug: 'contingent-desk-hiring-signal-rebuild',
    title: 'Contingent desk rebuilds client BD around live hiring signals',
    clientType: 'Contingent recruitment agency',
    summary: 'Born replaced manual prospecting and patchy follow-up with a signal-led recruiter workflow that made daily business development clearer.',
    problem:
      'The desk had good recruiters, but business-development activity was scattered across inboxes, ad hoc sourcing, and weak post-call follow-up.',
    build: [
      'Hiring-signal prospecting engine for target accounts',
      'Structured recruiter research pack before first touch',
      'Reply routing into call tasks and next-action views',
      'Pipeline stages for outreach, contact, meetings, and live opportunities',
    ],
    workflow:
      'Hiring-led accounts entered the system automatically, were enriched with recruiter context, and then moved into daily outreach and call queues with clear follow-up ownership.',
    outcome:
      'The desk got a more reliable business-development rhythm, faster first-touch execution, and much less lead leakage after conversations.',
    takeaway:
      'Recruiter outbound improves quickly when sourcing, calls, and follow-up are designed as one system.',
  },
  {
    slug: 'search-firm-follow-up-control',
    title: 'Search firm standardises follow-up after intro calls',
    clientType: 'Retained search firm',
    summary: 'Born built a higher-context workflow so strong recruiter conversations no longer disappeared into personal notes and inboxes.',
    problem:
      'The firm had strong commercial conversations, but follow-up discipline and visibility varied by recruiter, which made pipeline control weak.',
    build: [
      'Account briefing structure for senior-context outreach',
      'Custom call-prep and next-step templates',
      'Follow-up task logic tied to recruiter pipeline stages',
      'Review views for manager oversight and coaching',
    ],
    workflow:
      'Each intro call fed into a standard post-call workflow with next-step ownership, timing, and visibility baked into the recruiter system.',
    outcome:
      'The firm created more consistency after live conversations and gave leadership a cleaner view of which accounts were moving and which were drifting.',
    takeaway:
      'For senior recruitment work, follow-up structure is often a bigger lever than more top-of-funnel activity.',
  },
  {
    slug: 'agency-call-queue-automation',
    title: 'Recruitment agency replaces spreadsheet chasing with call queue automation',
    clientType: 'Growth-stage recruitment agency',
    summary: 'Born turned a spreadsheet-heavy outreach motion into a custom recruiter workflow with clearer daily priorities.',
    problem:
      'The agency relied on recruiter memory and manual trackers to decide who to call, who to chase, and what needed action next.',
    build: [
      'Call queue logic based on account priority and timing',
      'Recruiter dashboard views for next-best actions',
      'Post-call reminders and nurture automation',
      'Management visibility into overdue commercial follow-up',
    ],
    workflow:
      'Recruiters worked from a single queue that showed account context, call priority, and the exact follow-up required after each interaction.',
    outcome:
      'The team reduced admin drag, created more consistent call activity, and kept more opportunities visible after first contact.',
    takeaway:
      'Custom recruiter software is often most valuable when it removes uncertainty from the daily workflow.',
  },
] as const satisfies readonly CaseStudyItem[];

export const insights = [
  {
    slug: 'why-recruiter-outbound-breaks-after-the-first-reply',
    title: 'Why recruiter outbound breaks after the first reply',
    summary: 'The sourcing layer matters, but most recruiter systems fail because reply handling and follow-up ownership are weak.',
    topic: 'Recruiter outbound',
    takeaways: [
      'A reply without routing is just more inbox noise.',
      'Recruiter business development needs a defined handoff into calls and next actions.',
      'Follow-up visibility is a systems problem, not a motivation problem.',
    ],
    sections: [
      {
        heading: 'Replies create work, not just opportunity',
        body:
          'Once a prospect replies, the workflow needs to decide who responds, what context they see, when the call happens, and how the next action gets tracked. Without that structure, even good outbound starts leaking value.',
      },
      {
        heading: 'Inbox-led execution does not scale',
        body:
          'When recruiters manage follow-up from personal inbox habit, quality becomes impossible to standardise and leadership loses visibility into what is actually moving.',
      },
      {
        heading: 'The fix is operational, not motivational',
        body:
          'Most firms do not need more pressure on recruiters. They need better routing, clearer tasks, and a system that makes next actions visible immediately.',
      },
    ],
  },
  {
    slug: 'what-a-hiring-signal-workflow-should-include',
    title: 'What a hiring-signal workflow should include for recruitment firms',
    summary: 'Hiring signals only create pipeline when they are paired with research, prioritisation, and recruiter-ready actions.',
    topic: 'Hiring signals',
    takeaways: [
      'Signal quality is only useful if the agency can act on it quickly.',
      'Recruiters need context packaging, not just more leads.',
      'The workflow should decide what enters the queue and what gets ignored.',
    ],
    sections: [
      {
        heading: 'Signal intake needs qualification rules',
        body:
          'Not every hiring event deserves recruiter attention. A strong workflow filters by firm relevance, role type, timing, and the likelihood that the account fits the desk.',
      },
      {
        heading: 'Research should be built into the system',
        body:
          'The recruiter should not start from a blank screen. Key account context should already be attached before the prospect enters the outreach queue.',
      },
      {
        heading: 'Speed matters after context is ready',
        body:
          'Once the right context exists, the workflow needs to move fast into first-touch outreach, calls, and follow-up. Delay is where a lot of signal value gets lost.',
      },
    ],
  },
  {
    slug: 'why-custom-recruiter-software-beats-another-point-tool',
    title: 'Why custom recruiter software beats another point tool',
    summary: 'Recruitment firms usually do not suffer from too little software. They suffer from disconnected workflow and weak operating logic.',
    topic: 'Custom software',
    takeaways: [
      'More tools rarely solve recruiter execution on their own.',
      'The real advantage comes from workflow design around the desk.',
      'Custom software is valuable when it removes admin and clarifies action.',
    ],
    sections: [
      {
        heading: 'Point tools solve slices, not the full motion',
        body:
          'Most tools handle one step well, but recruiter business development depends on how sourcing, outreach, calls, and follow-up fit together. That is where bespoke design matters.',
      },
      {
        heading: 'Workflow fit matters more than feature count',
        body:
          'A lighter custom layer that matches the agency can outperform a larger off-the-shelf setup that the team never truly adopts.',
      },
      {
        heading: 'The bar is practical leverage',
        body:
          'Custom recruiter software should make the team faster, clearer, and less dependent on individual memory. If it does not, it is the wrong build.',
      },
    ],
  },
  {
    slug: 'how-to-structure-recruiter-follow-up-after-calls',
    title: 'How to structure recruiter follow-up after calls and meetings',
    summary: 'Recruiter follow-up needs predefined paths, not improvisation after every conversation.',
    topic: 'Follow-up design',
    takeaways: [
      'Each call should end with a defined next-state in the pipeline.',
      'Timing and ownership should be encoded into the system.',
      'Managers need visibility into overdue recruiter actions.',
    ],
    sections: [
      {
        heading: 'One conversation should create one clear next action',
        body:
          'Whether the next move is a meeting, nurture, disqualification, or another call, the system should make that choice explicit so it does not depend on memory later.',
      },
      {
        heading: 'Timing should be built into the workflow',
        body:
          'Good recruiter follow-up usually depends on speed. The task logic should know when a follow-up is due and surface it before it slips.',
      },
      {
        heading: 'Review loops keep standards from drifting',
        body:
          'A strong system lets leaders review what follow-up is late, what stage movement is stuck, and where recruiters are losing momentum between conversations.',
      },
    ],
  },
] as const satisfies readonly InsightItem[];

export const faqItems = [
  {
    question: 'Is Born a recruiter lead generation agency?',
    answer:
      'No. Born designs and implements the recruiter system behind business development: sourcing logic, research, outreach workflow, call queues, CRM stages, and follow-up automation.',
  },
  {
    question: 'Do you build custom recruiter software or just advise?',
    answer:
      'Both. Born can scope the operating model, implement the workflow, and advise on what should be custom-built, automated, or simplified inside your current stack.',
  },
  {
    question: 'Can Born work with our current CRM or ATS?',
    answer:
      'Yes. The goal is not to replace software for the sake of it. The goal is to make the recruiter workflow coherent, with only the custom layer your team actually needs.',
  },
  {
    question: 'Who is the best fit for Born?',
    answer:
      'Recruitment firms that want recruiter-only workflow design, tighter follow-up control, and a more bespoke commercial system than generic agency retainers usually provide.',
  },
] as const satisfies readonly FaqItem[];

export const aboutPrinciples = [
  'Recruiter workflow should feel controlled, not improvised.',
  'Follow-up discipline matters as much as first-touch activity.',
  'Custom systems should remove admin, not add complexity.',
  'Bespoke recruiter builds outperform generic templates when pipeline matters.',
] as const;

export const contactChecklist = [
  'You run a recruitment firm or recruiter-led commercial team.',
  'You need sourcing, outreach, calls, and follow-up tied together.',
  'You want a bespoke workflow or custom software layer, not a cookie-cutter retainer.',
  'You care about commercial control, recruiter adoption, and less admin.',
] as const;
