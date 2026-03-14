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
  buyerFit: string;
  systemBuild: string;
  businessEffect: string;
  includes: string[];
  outcomes: string[];
  ctaLabel?: string;
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
  systemBuild: string;
  businessEffect: string;
  whatChanged: string[];
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
  relatedSlugs?: readonly string[];
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
  label: 'Get 5 Researched Prospects Today',
  to: '/contact',
} as const;

export const siteNav = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/process' },
  { label: 'What You Get', href: '/services' },
  { label: 'Who It\'s For', href: '/industries' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const satisfies readonly NavItem[];

export const trustPoints = [
  'Built for recruiters',
  '5 researched firms before the first call',
  'Works with your current stack',
  '200% ROI guarantee by month 3',
] as const;

export const homePillars = [
  {
    title: 'Target-account sourcing and research',
    description:
      'Born finds firms worth selling into, qualifies the signal, and attaches the research your team needs before outreach starts.',
  },
  {
    title: 'Outreach and call workflow',
    description:
      'Sequences, call prep, reply handling, and task queues are shaped around recruiter BD rather than generic SDR templates.',
  },
  {
    title: 'Pipeline and follow-up control',
    description:
      'CRM stages, reminders, automations, and review loops keep firm-side follow-up visible after every reply, intro call, and live opportunity.',
  },
] as const;

export const audienceCards = [
  {
    title: 'Contingent desks',
    description:
      'Fast business-development systems for teams that need more conversations with target firms from active hiring signals and steadier follow-up.',
  },
  {
    title: 'Retained search teams',
    description:
      'Higher-context workflow design for teams selling into fewer firms with tighter research, stronger outreach quality, and cleaner pipeline management.',
  },
  {
    title: 'Executive search firms',
    description:
      'Custom recruiter infrastructure for senior search teams where account selection, briefing context, and relationship follow-up matter more than volume.',
  },
  {
    title: 'Growth-stage agencies',
    description:
      'Recruitment firms that have outgrown spreadsheets and ad hoc tools, and now need a steadier system for sourcing, outreach, calls, and follow-up.',
  },
] as const;

export const services = [
  {
    slug: 'recruiter-system-architecture',
    title: 'Recruiter System Architecture',
    summary:
      'The full outbound system for recruiters selling into firms: sourcing, outreach, CRM structure, call workflow, and follow-up control.',
    problem:
      'Most agencies have fragments of process spread across spreadsheets, inboxes, CRM views, and recruiter habit. Born turns that into one working system.',
    audience: 'Best for recruitment firms that need the full commercial workflow designed properly, not another isolated tool.',
    buyerFit: 'Best when the team can sell, but the path from target firm to booked meeting to follow-up still feels scattered.',
    systemBuild: 'Target-account sourcing, CRM structure, call workflow, task routing, and automation rules across the full motion.',
    businessEffect: 'One outbound system that is easier for recruiters to run and easier for managers to review.',
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
    ctaLabel: 'Scope the full build',
  },
  {
    slug: 'hiring-signal-prospecting-engine',
    title: 'Hiring-Signal Prospecting Engine',
    summary: 'Custom sourcing and research infrastructure that helps recruiters find better-fit firms to sell into faster.',
    problem:
      'Manual list building creates stale data, weak context, and uneven quality. Recruiters need sourcing logic built around live signals and account relevance.',
    audience: 'Best for firms where BD starts with hiring activity, market triggers, and structured research before the call.',
    buyerFit: 'Best when the team knows what kinds of firms they want to win but sourcing is still manual, slow, or inconsistent.',
    systemBuild: 'Signal qualification rules, research enrichment, prioritisation views, and cleaner routing into the live queue.',
    businessEffect: 'More relevant target firms enter the system with enough context for recruiters to act quickly.',
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
    ctaLabel: 'Review sourcing gaps',
  },
  {
    slug: 'recruiter-outreach-and-reply-routing',
    title: 'Recruiter Outreach and Reply Routing',
    summary: 'Bespoke sequence design and response handling for recruiters selling into target firms.',
    problem:
      'Most recruiter outreach breaks after the first touch because reply handling, call creation, and follow-up ownership are left undefined.',
    audience: 'Best for agencies with target firms identified but inconsistent recruiter execution after outreach starts.',
    buyerFit: 'Best when good firms are already being found but replies, call creation, and ownership are still handled ad hoc.',
    systemBuild: 'Message structure, reply triage, call handoff rules, and quality checkpoints for recruiter outreach.',
    businessEffect: 'Replies turn into visible next actions instead of more inbox noise.',
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
    ctaLabel: 'Tighten reply handling',
  },
  {
    slug: 'call-queue-and-follow-up-automation',
    title: 'Call Queue and Follow-Up Automation',
    summary: 'Daily recruiter call workflows, briefing context, and post-call automation built around selling into firms consistently.',
    problem:
      'Recruiters often rely on calls to convert interest into meetings, but the prep, queue design, and follow-up structure are usually weak or missing.',
    audience: 'Best for recruiter teams where calls, voicemail, and rapid follow-up sit at the centre of conversion.',
    buyerFit: 'Best when the team already sells on calls but daily priorities and post-call discipline are inconsistent.',
    systemBuild: 'Priority queues, briefing views, follow-up timing, and SLA-style task logic after each conversation.',
    businessEffect: 'The team spends less time deciding what to chase and misses fewer next steps after live conversations.',
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
    ctaLabel: 'Fix queue discipline',
  },
  {
    slug: 'custom-recruiter-software-advisory',
    title: 'Custom Recruiter Software Advisory',
    summary: 'Senior guidance for firms deciding what part of their outbound system to build, keep, replace, or automate next.',
    problem:
      'Some agencies do not need a full rebuild immediately. They need a sharp view on what their recruiter stack should do and what should change first.',
    audience: 'Best for recruitment firms with partial infrastructure in place but weak alignment between sourcing, outreach, calls, and follow-up.',
    buyerFit: 'Best when the team knows something is wrong but needs a sharper roadmap before committing.',
    systemBuild: 'Stack review, workflow diagnosis, custom-build recommendations, and implementation sequencing.',
    businessEffect: 'Leadership gets a clearer view of what to keep, what to replace, and what to build next.',
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
    ctaLabel: 'Map the roadmap',
  },
] as const satisfies readonly ServiceItem[];

export const industries = [
  {
    slug: 'contingent-recruitment-desks',
    title: 'Contingent Recruitment Desks',
    summary: 'Systems built for speed, hiring-signal responsiveness, and tighter follow-up after first contact with target firms.',
    painPoints: [
      'New target firms enter the pipeline inconsistently because sourcing is manual and unstructured',
      'Recruiters lose momentum between first touch, calls, and next actions',
      'Managers lack visibility into where business-development follow-up is stalling',
    ],
    buildFocus: [
      'Finding target firms and prioritising the right accounts',
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
    summary: 'Higher-context workflow design for teams where precision, research quality, and stakeholder follow-up matter most.',
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
    summary: 'Bespoke outbound workflow design for complex search cycles and senior relationship management.',
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
    summary: 'Custom systems for agencies moving from improvised hustle into repeatable recruiter BD execution.',
    painPoints: [
      'Process quality depends too much on a few strong operators',
      'The agency has tools, but no real system connecting them',
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
    summary: 'Review your recruiter workflow, offer shape, target firms, current tooling, and where follow-up is breaking down.',
    output: 'A concrete view of what the agency should keep, replace, and rebuild.',
  },
  {
    name: 'Plan',
    summary: 'Define how target firms move from hiring signal to outreach, calls, pipeline updates, and next actions.',
    output: 'A clear build plan before implementation starts.',
  },
  {
    name: 'Build',
    summary: 'Implement sourcing logic, recruiter views, automation, sequences, and CRM structure around the agreed operating model.',
    output: 'A custom outbound system configured around how the team actually sells into firms.',
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
    summary: 'Born replaced manual prospecting and patchy follow-up with a signal-led workflow that made selling into target firms clearer day to day.',
    problem:
      'The team could sell once conversations happened, but business-development activity was scattered across inboxes, ad hoc sourcing, and weak post-call follow-up.',
    systemBuild: 'A signal-led sourcing layer, recruiter-ready research packs, reply handling, and a clearer pipeline model.',
    businessEffect: 'Daily business development became easier to run and much harder to lose track of.',
    whatChanged: ['Signal-led account intake', 'Cleaner reply-to-call routing', 'Less leakage after recruiter conversations'],
    build: [
      'Hiring-signal prospecting engine for target accounts',
      'Structured recruiter research pack before first touch',
      'Reply routing into call tasks and next-action views',
      'Pipeline stages for outreach, contact, meetings, and live opportunities',
    ],
    workflow:
      'Hiring-led accounts entered the system automatically, were enriched with recruiter context, and then moved into daily outreach and call queues with clear follow-up ownership.',
    outcome:
      'The team got a more reliable business-development rhythm, faster first-touch execution, and much less lead leakage after conversations.',
    takeaway:
      'Recruiter outbound improves quickly when sourcing, calls, and follow-up are designed as one system.',
  },
  {
    slug: 'search-firm-follow-up-control',
    title: 'Search firm standardises follow-up after intro calls',
    clientType: 'Retained search firm',
    summary: 'Born built a higher-context workflow so strong firm-side conversations no longer disappeared into personal notes and inboxes.',
    problem:
      'The firm had strong commercial conversations, but follow-up discipline and visibility varied by recruiter, which made pipeline control weak.',
    systemBuild: 'A standard post-call workflow with briefing templates, task logic, and manager review views.',
    businessEffect: 'Leadership could see what was progressing, what was late, and where follow-up quality was drifting.',
    whatChanged: ['Shared follow-up structure', 'Clear next-step ownership', 'Better manager visibility'],
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
    summary: 'Born turned a spreadsheet-heavy outreach motion into a custom outbound workflow with clearer daily priorities.',
    problem:
      'The agency relied on recruiter memory and manual trackers to decide who to call, who to chase, and what needed action next.',
    systemBuild: 'A single call queue with account context, next-best actions, and follow-up automation after each interaction.',
    businessEffect: 'The desk spent less time triaging admin and more time working the right conversations.',
    whatChanged: ['One live queue instead of spreadsheet chasing', 'Post-call reminders built in', 'Overdue follow-up became visible'],
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
    slug: 'how-to-build-a-cold-outbound-system-for-your-recruitment-firm',
    title: 'How to build a cold outbound system for your recruitment firm',
    summary:
      'A recruiter outbound system only works when prospecting, warm-up outreach, call prep, and follow-up are designed as one operating loop.',
    topic: 'Outbound systems',
    takeaways: [
      'A list is not a system. The workflow has to decide who enters, why they matter, and what happens next.',
      'Research should happen before the recruiter touches the account, not during the call block.',
      'Warm-up email and SMS should make the call easier, not replace it.',
      'Post-call follow-up needs predefined outcomes, ownership, and timing.',
    ],
    sections: [
      {
        heading: 'Start with the desk you actually run',
        body:
          'Most agencies try to copy an SDR playbook that was built for SaaS rather than recruitment. That usually fails because recruiter BD is more call-heavy, more founder-led, and more sensitive to delivery pressure. The system has to fit the desk as it exists today: who is making calls, what vertical they recruit in, how many accounts they can realistically work each day, and where follow-up is currently getting lost.',
      },
      {
        heading: 'Define the signals that make an account worth working',
        body:
          'A cold outbound system gets easier when the top of funnel is filtered properly. For recruiters, the strongest inputs are usually hiring activity, role volume, headcount movement, geography, niche fit, and whether there is a reachable decision-maker. If those qualification rules are weak, the queue fills with low-conviction accounts and the team stops trusting the system.',
      },
      {
        heading: 'Package context before the first touch',
        body:
          'Recruiters should not burn call time hunting for context in tabs and spreadsheets. A strong queue shows why the company matters, what signal triggered it, who should be contacted, and what angle the recruiter should lead with. That shifts the work from manual prep into system design, which is exactly where it belongs.',
      },
      {
        heading: 'Use outreach to warm the call, not replace it',
        body:
          'For most recruitment firms, the goal of outbound email and SMS is not to run a full no-call motion. It is to create familiarity before the call happens. A short sequence that references the hiring signal, the niche, and the likely commercial problem can make the first conversation less cold without turning the workflow into a bloated nurture machine.',
      },
      {
        heading: 'Build the daily call queue as the operating center',
        body:
          'The queue should answer four questions immediately: who is most relevant, what happened already, what the next action is, and what the recruiter needs to say. When that is visible, the team spends less time triaging and more time executing. When it is missing, business development collapses back into memory, inbox management, and spreadsheet chasing.',
      },
      {
        heading: 'Predefine the follow-up paths after each disposition',
        body:
          'Every live conversation should move the account into a clear next state such as callback, nurture, meeting, not-now, or disqualified. Each state should trigger the right reminder, sequence, owner, and deadline automatically. That is the difference between a real outbound system and a burst of activity that goes stale two days later.',
      },
      {
        heading: 'Review the system against conversations, not opinions',
        body:
          'Once the workflow is live, the useful questions are operational. Which signals are producing better conversations. Which call outcomes lead to placements or meetings. Where are follow-ups slipping. Which message angles are creating warmer first calls. A recruitment outbound system improves when you refine it against real desk behavior instead of generic best-practice lists.',
      },
    ],
    relatedSlugs: [
      'how-to-build-a-daily-call-queue-using-job-posting-signals',
      'gohighlevel-for-recruitment-agencies-what-works-and-what-doesnt',
    ],
  },
  {
    slug: 'gohighlevel-for-recruitment-agencies-what-works-and-what-doesnt',
    title: "GoHighLevel for recruitment agencies: what works and what doesn't",
    summary:
      'GoHighLevel can be a strong recruiter operating layer, but only when it is configured around research, calls, and follow-up rather than generic lead-gen templates.',
    topic: 'GoHighLevel',
    takeaways: [
      'GoHighLevel is useful as workflow infrastructure, not as an out-of-the-box recruiter system.',
      'Pipelines, tasks, and automations need to reflect recruiter dispositions and follow-up timing.',
      'The weak point is usually data quality and queue design, not the software itself.',
      'Agencies should keep what already works in their stack instead of forcing a full migration for its own sake.',
    ],
    sections: [
      {
        heading: 'What GoHighLevel does well for recruiter BD',
        body:
          'GoHighLevel is good at the operational middle of the workflow. It can hold pipeline stages, automate reminders, manage simple outreach sequences, and keep next actions visible. That matters because a lot of recruitment firms do not lose business due to a lack of software. They lose it because the commercial workflow between sourcing, calls, and follow-up is not held together anywhere reliably.',
      },
      {
        heading: 'Where agencies go wrong with it',
        body:
          'The common failure mode is importing a standard agency template and hoping it behaves like a recruiter workflow. That creates the wrong fields, the wrong stages, and the wrong automations. Recruiter BD usually depends on hiring signals, account context, phone-first execution, and nuanced post-call outcomes. If the configuration does not reflect that, the team will ignore the system quickly.',
      },
      {
        heading: 'Use it as the control layer, not the research engine',
        body:
          'GoHighLevel is rarely the best place to discover the accounts in the first place. Research and signal capture often come from other tools or custom sourcing logic. The better model is to let those sources feed a qualified account into GoHighLevel once the account is worth actioning. That keeps the CRM cleaner and makes the queue more believable to the recruiter using it.',
      },
      {
        heading: 'Map pipeline stages to real recruiter outcomes',
        body:
          'A useful recruiter pipeline does not stop at contacted or replied. It needs stages and task logic for warm call pending, callback due, meeting booked, nurture, wrong contact, no fit, and whatever else the desk genuinely uses. The more honestly the pipeline reflects live commercial work, the easier it becomes to review performance and coach follow-up discipline.',
      },
      {
        heading: 'Automate what happens after the call',
        body:
          'The biggest operational gain usually comes after live conversations. Once a recruiter logs a disposition, the platform should create the right follow-up task, move the record, trigger the right email or SMS when appropriate, and keep overdue actions visible. That is where GoHighLevel can remove a large amount of admin without pretending to replace judgment.',
      },
      {
        heading: 'Keep the surrounding stack pragmatic',
        body:
          'A recruitment agency does not need every capability to live inside one platform. If Apollo, Smartlead, or an existing CRM already handles a slice of the process well, it is usually better to design around that instead of forcing a migration just for neatness. The goal is operational control, not tool purity.',
      },
      {
        heading: 'The real question is implementation fit',
        body:
          'For recruitment agencies, the relevant question is not whether GoHighLevel is good or bad in the abstract. It is whether the workflow built on top of it gives the desk a cleaner queue, faster follow-up, clearer visibility, and less admin drag. If it does, the platform is useful. If it becomes another container full of half-used templates, it is just more software noise.',
      },
    ],
    relatedSlugs: [
      'how-to-build-a-cold-outbound-system-for-your-recruitment-firm',
      'why-custom-recruiter-software-beats-another-point-tool',
    ],
  },
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
    relatedSlugs: [
      'how-to-build-a-cold-outbound-system-for-your-recruitment-firm',
      'how-to-structure-recruiter-follow-up-after-calls',
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
    relatedSlugs: [
      'how-to-build-a-daily-call-queue-using-job-posting-signals',
      'how-to-build-a-cold-outbound-system-for-your-recruitment-firm',
    ],
  },
  {
    slug: 'how-to-build-a-daily-call-queue-using-job-posting-signals',
    title: 'How to build a daily call queue using job posting signals',
    summary:
      'Job posting signals are only useful when they are filtered, enriched, and turned into a queue that tells the recruiter exactly who to call next.',
    topic: 'Call queues',
    takeaways: [
      'A signal without qualification logic just creates a noisier list.',
      'The queue needs account context, contact context, and action context.',
      'The system should show why the prospect matters before the recruiter opens another tab.',
      'Post-call outcomes should feed the next day queue automatically.',
    ],
    sections: [
      {
        heading: 'Choose signal sources that match your niche',
        body:
          'The right sources vary by market, but the principle is stable. Use inputs that point to active commercial need in the kinds of firms you actually want to win. That might be live job ads, sudden role volume, multi-role campaigns, location expansion, or repeat hiring in a target function. The source matters less than the discipline of defining what counts as meaningful.',
      },
      {
        heading: 'Filter the queue before the recruiter sees it',
        body:
          'A raw feed is not a queue. Before an account appears for the recruiter, the workflow should check fit, remove duplicates, enrich the record, and assign a practical reason to call. If that filtering step is skipped, the queue becomes another bucket of maybes and adoption drops fast.',
      },
      {
        heading: 'Attach research that shortens call prep',
        body:
          'The best call queues reduce context switching. Each record should show the hiring trigger, relevant role context, the likely contact, and the next action already taken. That makes it easier for a recruiter to move from one call to the next without rebuilding the story from scratch every time.',
      },
      {
        heading: 'Prioritize by timing and relevance',
        body:
          'Not every triggered account deserves same-day attention. A useful queue balances signal freshness with account quality, current outreach state, and whether a callback or follow-up is already due. That ranking logic matters because the daily list is where commercial focus either gets sharpened or diluted.',
      },
      {
        heading: 'Let each disposition shape the next queue',
        body:
          'If somebody says call back next week, the system should return that account to the queue at the right time with context intact. If they ask for information first, the outreach should fire and the next task should be set. A strong queue is not only a top-of-funnel view. It is the working surface for the whole commercial loop.',
      },
      {
        heading: 'Measure queue quality, not just activity volume',
        body:
          'The useful review questions are whether the queue is producing better conversations, whether the signal rules need refinement, and whether recruiters trust the order of priorities. More calls is not the point if the queue is still sending the desk toward weak-fit accounts or making follow-up harder to track.',
      },
    ],
    relatedSlugs: [
      'what-a-hiring-signal-workflow-should-include',
      'how-to-build-a-cold-outbound-system-for-your-recruitment-firm',
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
    relatedSlugs: [
      'gohighlevel-for-recruitment-agencies-what-works-and-what-doesnt',
      'how-to-build-a-cold-outbound-system-for-your-recruitment-firm',
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
    relatedSlugs: [
      'why-recruiter-outbound-breaks-after-the-first-reply',
      'how-to-build-a-cold-outbound-system-for-your-recruitment-firm',
    ],
  },
] as const satisfies readonly InsightItem[];

export const faqItems = [
  {
    question: 'Do you make calls on my behalf?',
    answer:
      'No. Born builds the system. You run the calls. We handle prospecting, research, outreach, follow-up automations, and pipeline management so you can stay focused on conversations.',
  },
  {
    question: 'How long does setup take?',
    answer:
      'Three weeks from kickoff to a live call queue.',
  },
  {
    question: 'What tools do you use?',
    answer:
      'We build on GoHighLevel, Apollo, and Smartlead. If you already use a CRM, we design around your existing stack rather than forcing a migration.',
  },
  {
    question: 'What kind of recruitment firms do you work with?',
    answer:
      'Agencies with 1 to 20 people in tech, accounting, finance, construction, marketing, or temp staffing. The best fit is usually a team still running part of BD in-house.',
  },
  {
    question: 'How many clients do you take on?',
    answer: 'A small number at a time so the build stays focused and practical.',
  },
  {
    question: 'What happens after the 3-month pilot?',
    answer: 'Most clients continue on the monthly subscription. If the numbers have not worked by month 3, we keep working for free until they do.',
  },
] as const satisfies readonly FaqItem[];

export const aboutPrinciples = [
  'Recruiter workflow should feel controlled, not improvised.',
  'Follow-up discipline matters as much as first-touch activity.',
  'Custom systems should remove admin, not add complexity.',
  'The system should fit the desk, not force the desk into a template.',
] as const;

export const contactChecklist = [
  'You run a recruitment firm or recruiter-led commercial team.',
  'You need sourcing, outreach, calls, and follow-up tied together.',
  'You want a practical system, not more disconnected tools.',
  'You care about consistent BD, clearer follow-up, and less admin drag.',
] as const;

export const contactProcess = [
  'Share a short brief about your firm, what you recruit, and where BD is getting stuck.',
  'Born reviews the fit and comes back with a clear next step.',
  'If there is a fit, the next call is built around your workflow and 5 researched firms in your niche.',
] as const;

export const contactExpectations = {
  responseWindow: 'Usually within 1 business day.',
  primaryChannel: 'Replies land by email from fred@born.directory.',
  qualifier: 'Best suited to agencies that want a real outbound system, not outsourced calling.',
} as const;
