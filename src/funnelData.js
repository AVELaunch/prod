// =============================================================================
// AVELaunch Books — Sales Funnel Data
// Complete node & edge definitions with HubSpot tagging and Emailer sequences
// =============================================================================

// --- Node type color mapping ---
export const NODE_COLORS = {
  entry: { bg: '#dbeafe', border: '#3b82f6', label: 'Lead Source / Entry' },       // Blue
  positive: { bg: '#dcfce7', border: '#22c55e', label: 'Positive Outcome' },       // Green
  lost: { bg: '#fee2e2', border: '#ef4444', label: 'Lost / No-Show / Ghost' },     // Red
  decision: { bg: '#fef9c3', border: '#eab308', label: 'Decision (Yes/No)' },      // Yellow
  sequence: { bg: '#f3e8ff', border: '#a855f7', label: 'Email Sequence Trigger' }, // Purple
  system: { bg: '#f3f4f6', border: '#6b7280', label: 'HubSpot System Action' },    // Grey
  meeting: { bg: '#ffedd5', border: '#f97316', label: 'Call / Meeting Event' },     // Orange
};

// --- Edge style presets ---
export const EDGE_STYLES = {
  yes: { stroke: '#22c55e', label: 'YES' },
  no: { stroke: '#ef4444', label: 'NO' },
  loop: { stroke: '#94a3b8', strokeDasharray: '6 3', label: '' },
  default: { stroke: '#64748b', label: '' },
};

// =============================================================================
// NODES
// =============================================================================
export const nodes = [
  // ─── LAYER 0: ENTRY (P1) ─────────────────────────────────────────────
  {
    id: 'lead_source',
    type: 'entry',
    priority: 'P1',
    label: 'Lead Sees Google Ad / Finds Us Organically',
    hubspot: { note: 'Contact not yet created' },
    detail: {
      description: 'The lead first encounters AVELaunch via a Google Ad or organic search.',
      updatedBy: 'N/A — pre-contact',
      trigger: 'External (Google Ads / organic traffic)',
    },
  },
  {
    id: 'visits_website',
    type: 'entry',
    priority: 'P1',
    label: 'Visits Website',
    hubspot: { note: 'Browsing, no contact record yet' },
    detail: {
      description: 'Lead lands on website. From here they can take one of 5 entry paths.',
      updatedBy: 'N/A',
      trigger: 'Website visit',
    },
  },
  {
    id: 'entry_form_strategy',
    type: 'entry',
    priority: 'P1',
    label: 'Books Strategy Session via Form',
    hubspot: {
      note: 'Form submission. Lead Source = Google Ads or Organic. Ad Campaign = UTM value (or empty → defaults to BIZ)',
    },
    detail: {
      description: 'Lead fills out strategy session booking form on the website.',
      updatedBy: 'Automatic (form embed)',
      trigger: 'HubSpot form submission',
    },
  },
  {
    id: 'entry_lead_magnet',
    type: 'entry',
    priority: 'P1',
    label: 'Downloads Lead Magnet',
    hubspot: {
      note: 'Form submission. Lead Source = source. Ad Campaign = UTM or empty → BIZ',
    },
    detail: {
      description: 'Lead downloads a lead magnet resource.',
      updatedBy: 'Automatic (form embed)',
      trigger: 'HubSpot form submission',
    },
  },
  {
    id: 'entry_whatsapp',
    type: 'entry',
    priority: 'P1',
    label: 'Starts Chat via WhatsApp',
    hubspot: {
      note: 'Contact created manually by salesperson after WhatsApp contact. Lead Source = WhatsApp',
    },
    detail: {
      description: 'Lead initiates a WhatsApp conversation. No automated form — salesperson creates contact manually and sets deal stage.',
      updatedBy: 'Salesperson (manual)',
      trigger: 'Manual contact creation',
    },
  },
  {
    id: 'entry_email',
    type: 'entry',
    priority: 'P1',
    label: 'Sends Email Inquiry',
    hubspot: {
      note: 'Contact created manually. Lead Source = Email Inquiry',
    },
    detail: {
      description: 'Lead sends an email inquiry.',
      updatedBy: 'Salesperson (manual)',
      trigger: 'Manual contact creation',
    },
  },
  {
    id: 'entry_calendar',
    type: 'entry',
    priority: 'P1',
    label: 'Books via Calendar Link Directly',
    hubspot: {
      note: 'Google Calendar → HubSpot auto-sync creates contact. Lead Source = Calendar Direct',
    },
    detail: {
      description: 'Lead books directly via a shared calendar link.',
      updatedBy: 'Automatic (Google Calendar → HubSpot sync)',
      trigger: 'Calendar auto-sync',
    },
  },

  // ─── LAYER 1: CONTACT CREATED (P1) ───────────────────────────────────
  {
    id: 'contact_created',
    type: 'system',
    priority: 'P1',
    label: 'Contact Created in HubSpot',
    hubspot: {
      dealStage: 'New Lead',
      leadStatus: 'New',
      lifecycleStage: 'Lead',
      note: 'Deal created at stage New Lead',
    },
    detail: {
      description: 'Contact record created in HubSpot. A new deal is opened at the "New Lead" stage.',
      updatedBy: 'Automatic (form embed, calendar sync) or Salesperson (manual) depending on entry path',
      trigger: 'Automatic or manual depending on entry path',
    },
  },
  {
    id: 'seq_warmup',
    type: 'sequence',
    priority: 'P1',
    label: 'Emailer: Warm-Up Sequence',
    hubspot: {
      dealStage: 'New Lead',
      trigger: 'Emailer pulls Deal Stage = New Lead',
    },
    emailer: {
      sequence: 'WARMUP_[SEG]',
      variants: ['WARMUP_WB', 'WARMUP_BIZ'],
      emailCount: 5,
      timing: '4–5 emails over 7–10 days',
      goal: 'Get lead to book a Strategy Session',
      contentAngle: {
        WB: 'Authority beyond sessions, conference invitations, podcast visibility',
        BIZ: 'Documented expertise, shortened trust cycle, enterprise credibility',
      },
      cta: 'Book Strategy Session (Google Calendar link)',
      subjects: [],
    },
    detail: {
      description: 'Automated warm-up email sequence introducing AVELaunch and building trust.',
      updatedBy: 'Tetiana writes content; salesperson monitors',
      trigger: 'Emailer pulls Deal Stage = New Lead from HubSpot automatically',
      owner: 'Tetiana',
    },
  },

  // ─── LAYER 2: STRATEGY SESSION BOOKING (P1) ──────────────────────────
  {
    id: 'decision_session_booked',
    type: 'decision',
    priority: 'P1',
    label: 'Did lead book Strategy Session?',
    detail: {
      description: 'Decision point: has the lead booked a strategy session after the warm-up sequence?',
    },
  },
  {
    id: 'session_scheduled',
    type: 'meeting',
    priority: 'P1',
    label: 'Strategy Session Scheduled',
    hubspot: {
      dealStage: 'Strategy Session Scheduled',
      leadStatus: 'In Progress',
      lifecycleStage: 'Lead',
    },
    emailer: {
      sequence: 'REMINDER_SESSION_[SEG]',
      variants: ['REMINDER_SESSION_WB', 'REMINDER_SESSION_BIZ'],
      emailCount: 2,
      timing: 'Booking confirmation + 24h reminder',
      goal: 'Ensure lead shows up',
      subjects: [],
    },
    detail: {
      description: 'Strategy session has been booked. Reminder sequence fires.',
      updatedBy: 'Salesperson manually after seeing calendar booking',
      trigger: 'Emailer pulls Deal Stage',
      owner: 'Tetiana',
    },
  },
  {
    id: 'ghost_warmup',
    type: 'lost',
    priority: 'P1',
    label: 'No Booking After Warmup',
    hubspot: {
      dealStage: 'Warmup Ghost',
      leadStatus: 'Open',
      lifecycleStage: 'Lead',
    },
    emailer: {
      sequence: 'GHOST_WARMUP_[SEG]',
      variants: ['GHOST_WARMUP_WB', 'GHOST_WARMUP_BIZ'],
      emailCount: 2,
      timing: '2 emails, 5 days apart',
      goal: 'Re-engage ghost lead',
      subjects: [
        'Email 1: "We started strong. Why did you stop?"',
        'Email 2: Deadline / slot closing',
      ],
    },
    detail: {
      description: 'Lead did not book a strategy session after the full warm-up sequence.',
      updatedBy: 'Salesperson after warmup sequence ends with no response',
      trigger: 'Emailer pulls Deal Stage',
      owner: 'Tetiana',
    },
  },
  {
    id: 'decision_ghost_warmup_response',
    type: 'decision',
    priority: 'P1',
    label: 'Response to warmup re-engagement?',
    detail: {
      description: 'Did the ghost lead respond to re-engagement emails?',
    },
  },
  {
    id: 'lead_lost_cold',
    type: 'lost',
    priority: 'P1',
    label: 'Lead Cold — Archived',
    hubspot: {
      dealStage: 'Lost - No Response',
      leadStatus: 'Unqualified',
      lifecycleStage: 'Lead',
    },
    emailer: {
      sequence: 'None',
      note: 'No active sequence. Added to quarterly reactivation segment.',
      emailCount: 0,
    },
    detail: {
      description: 'Lead is cold and archived. Will be included in quarterly reactivation batch.',
      updatedBy: 'Salesperson',
      trigger: 'Manual quarterly',
    },
  },

  // ─── LAYER 3: STRATEGY SESSION OUTCOME (P1) ──────────────────────────
  {
    id: 'decision_session_showed',
    type: 'decision',
    priority: 'P1',
    label: 'Did lead show up to Strategy Session?',
    detail: {
      description: 'Decision point: did the lead attend the scheduled strategy session?',
    },
  },
  {
    id: 'session_noshow',
    type: 'lost',
    priority: 'P1',
    label: 'Strategy Session No-Show',
    hubspot: {
      dealStage: 'Strategy Session No-Show',
      leadStatus: 'Attempted to Contact',
      lifecycleStage: 'Lead',
    },
    emailer: {
      sequence: 'NOSHOW_SESSION_[SEG]',
      variants: ['NOSHOW_SESSION_WB', 'NOSHOW_SESSION_BIZ'],
      emailCount: 3,
      timing: '3 emails over 6 days',
      goal: 'Get lead to reschedule',
      subjects: [
        'Email 1 (day 1): "We missed you — want to reschedule?"',
        'Email 2 (day 3): Value reminder + reschedule CTA',
        'Email 3 (day 6): Final slot — closing loop',
      ],
    },
    warnings: ['Reschedule limit: max 2 attempts. After 2nd no-show → automatically → lead_lost_cold'],
    detail: {
      description: 'Lead did not show up to the strategy session.',
      updatedBy: 'Salesperson after missed call',
      trigger: 'Emailer pulls Deal Stage',
      owner: 'Tetiana',
    },
  },
  {
    id: 'decision_noshow_session_response',
    type: 'decision',
    priority: 'P1',
    label: 'Did they reschedule? (max 2 attempts)',
    warnings: ['Max 2 reschedule attempts'],
    detail: {
      description: 'Did the no-show lead agree to reschedule? Maximum 2 attempts allowed.',
    },
  },
  {
    id: 'session_held',
    type: 'positive',
    priority: 'P1',
    label: 'Strategy Session Held',
    hubspot: {
      dealStage: 'Strategy Session Held',
      leadStatus: 'Connected',
      lifecycleStage: 'Lead',
    },
    detail: {
      description: 'Strategy session was held successfully. Salesperson logs call result.',
      updatedBy: 'Salesperson after call, logs call result',
      trigger: 'N/A',
    },
  },

  // ─── LAYER 4: PATHFINDER CONSULTATION (P1) ────────────────────────────
  {
    id: 'pathfinder_scheduled',
    type: 'meeting',
    priority: 'P1',
    label: 'Pathfinder Consultation Scheduled (Session pt.2)',
    hubspot: {
      dealStage: 'Pathfinder Scheduled',
      leadStatus: 'In Progress',
      lifecycleStage: 'Lead',
    },
    emailer: {
      sequence: 'REMINDER_PATHFINDER_[SEG]',
      variants: ['REMINDER_PATHFINDER_WB', 'REMINDER_PATHFINDER_BIZ'],
      emailCount: 2,
      timing: 'Confirmation + 24h reminder',
      goal: 'Ensure lead shows up for Pathfinder consultation',
      subjects: [],
    },
    detail: {
      description: 'Second call scheduled to explore options, pros/cons, and map the path forward.',
      updatedBy: 'Salesperson books second call during or after Strategy Session',
      trigger: 'Emailer pulls Deal Stage',
      owner: 'Tetiana',
    },
  },
  {
    id: 'decision_pathfinder_showed',
    type: 'decision',
    priority: 'P1',
    label: 'Did lead show up to Pathfinder Consultation?',
    detail: {
      description: 'Decision point: did the lead attend the pathfinder consultation?',
    },
  },
  {
    id: 'pathfinder_noshow',
    type: 'lost',
    priority: 'P1',
    label: 'Pathfinder No-Show',
    hubspot: {
      dealStage: 'Pathfinder No-Show',
      lifecycleStage: 'Lead',
    },
    emailer: {
      sequence: 'NOSHOW_PATHFINDER_[SEG]',
      variants: ['NOSHOW_PATHFINDER_WB', 'NOSHOW_PATHFINDER_BIZ'],
      emailCount: 2,
      timing: '2 emails',
      goal: 'Get lead to reschedule pathfinder',
      subjects: [],
    },
    warnings: ['Max 2 reschedule attempts → then → lead_lost_reactivation'],
    detail: {
      description: 'Lead did not show up to the pathfinder consultation.',
      updatedBy: 'Salesperson',
      trigger: 'Emailer pulls Deal Stage',
      owner: 'Tetiana',
    },
  },
  {
    id: 'decision_pathfinder_noshow_response',
    type: 'decision',
    priority: 'P1',
    label: 'Did they reschedule? (max 2 attempts)',
    warnings: ['Max 2 reschedule attempts'],
    detail: {
      description: 'Did the pathfinder no-show lead agree to reschedule? Maximum 2 attempts.',
    },
  },
  {
    id: 'pathfinder_held',
    type: 'positive',
    priority: 'P1',
    label: 'Pathfinder Consultation Held',
    hubspot: {
      dealStage: 'Pathfinder Held',
      leadStatus: 'Connected',
      lifecycleStage: 'Lead',
    },
    detail: {
      description: 'Pathfinder consultation held successfully.',
      updatedBy: 'Salesperson logs call result',
      trigger: 'N/A',
    },
  },
  {
    id: 'decision_qualified',
    type: 'decision',
    priority: 'P1',
    label: 'Is lead qualified after Pathfinder?',
    detail: {
      description: 'Salesperson evaluates whether the lead is qualified based on the pathfinder consultation.',
    },
  },
  {
    id: 'unqualified',
    type: 'lost',
    priority: 'P1',
    label: 'Unqualified Lead',
    hubspot: {
      dealStage: 'Unqualified',
      leadStatus: 'Unqualified',
      lifecycleStage: 'Lead',
    },
    emailer: {
      sequence: 'UNQUALIFIED_NURTURE_[SEG]',
      variants: ['UNQUALIFIED_NURTURE_WB', 'UNQUALIFIED_NURTURE_BIZ'],
      emailCount: 2,
      timing: '2 soft emails, no hard sell',
      goal: 'Maintain relationship without pressure',
      subjects: [],
    },
    detail: {
      description: 'Lead is not qualified. Soft nurture sequence, then moved to reactivation.',
      updatedBy: 'Salesperson',
      trigger: 'Emailer pulls Deal Stage',
      owner: 'Tetiana',
    },
  },

  // ─── LAYER 4→5 BRIDGE: SPRINT PRESENTATION (P2) ──────────────────────
  {
    id: 'sprint_presentation_sent',
    type: 'positive',
    priority: 'P2',
    label: 'Discovery Sprint Presentation Sent',
    hubspot: {
      dealStage: 'Sprint Presentation Sent',
      leadStatus: 'In Progress',
      lifecycleStage: 'Lead',
    },
    emailer: {
      sequence: 'SPRINT_FOLLOWUP_[SEG]',
      variants: ['SPRINT_FOLLOWUP_WB', 'SPRINT_FOLLOWUP_BIZ'],
      emailCount: 3,
      timing: '3 emails over 5 days',
      goal: 'Get lead to book objections call',
      subjects: [
        'Email 1: "Here\'s what we\'ll build together"',
        'Email 2: "What do you think?" + book objections call CTA',
        'Email 3: "Last nudge before I close this slot"',
      ],
    },
    detail: {
      description: 'Salesperson sends the Discovery Sprint presentation materials to the qualified lead.',
      updatedBy: 'Salesperson after sending materials',
      trigger: 'Emailer pulls Deal Stage',
      owner: 'Tetiana',
    },
  },

  // ─── LAYER 5: OBJECTIONS CALL (P2) ───────────────────────────────────
  {
    id: 'decision_objections_booked',
    type: 'decision',
    priority: 'P2',
    label: 'Did lead book Objections Call?',
    detail: {
      description: 'Has the lead booked an objections call after reviewing the sprint presentation?',
    },
  },
  {
    id: 'sprint_ghost',
    type: 'lost',
    priority: 'P2',
    label: 'Ghost after Presentation',
    hubspot: {
      dealStage: 'Sprint Ghost',
      lifecycleStage: 'Lead',
    },
    emailer: {
      sequence: 'GHOST_SPRINT_[SEG]',
      variants: ['GHOST_SPRINT_WB', 'GHOST_SPRINT_BIZ'],
      emailCount: 2,
      timing: '2 emails (reuse re-engagement templates)',
      goal: 'Re-engage ghost lead',
      subjects: [],
    },
    detail: {
      description: 'Lead went silent after receiving the sprint presentation.',
      updatedBy: 'Salesperson',
      trigger: 'Emailer pulls Deal Stage',
      owner: 'Tetiana',
    },
  },
  {
    id: 'decision_ghost_sprint_response',
    type: 'decision',
    priority: 'P2',
    label: 'Response?',
    detail: {
      description: 'Did the ghost lead respond to the sprint re-engagement emails?',
    },
  },
  {
    id: 'lead_lost_reactivation',
    type: 'lost',
    priority: 'P1',
    label: 'Deal Lost → Reactivation Cohort',
    hubspot: {
      dealStage: 'Lost - Reactivation',
      leadStatus: 'Unqualified',
      lifecycleStage: 'Lead',
    },
    emailer: {
      sequence: 'None',
      note: 'No active sequence. Quarterly batch reactivation campaign.',
      emailCount: 0,
    },
    detail: {
      description: 'Deal is lost. Lead enters quarterly reactivation cohort for future outreach.',
      updatedBy: 'Salesperson',
      trigger: 'Manual quarterly',
    },
  },
  {
    id: 'objections_scheduled',
    type: 'meeting',
    priority: 'P2',
    label: 'Objections Call Scheduled',
    hubspot: {
      dealStage: 'Objections Call Scheduled',
      lifecycleStage: 'Lead',
    },
    emailer: {
      sequence: 'REMINDER_OBJECTIONS_[SEG]',
      variants: ['REMINDER_OBJECTIONS_WB', 'REMINDER_OBJECTIONS_BIZ'],
      emailCount: 2,
      timing: 'Confirmation + 24h reminder',
      goal: 'Ensure lead shows up',
      subjects: [],
    },
    detail: {
      description: 'Objections call has been scheduled.',
      updatedBy: 'Salesperson',
      trigger: 'Emailer pulls Deal Stage',
      owner: 'Tetiana',
    },
  },
  {
    id: 'decision_objections_showed',
    type: 'decision',
    priority: 'P2',
    label: 'Did lead show up to Objections Call?',
    detail: {
      description: 'Did the lead attend the objections call?',
    },
  },
  {
    id: 'objections_noshow',
    type: 'lost',
    priority: 'P2',
    label: 'Objections Call No-Show',
    hubspot: {
      dealStage: 'Objections Call No-Show',
      lifecycleStage: 'Lead',
    },
    emailer: {
      sequence: 'NOSHOW_OBJECTIONS_[SEG]',
      variants: ['NOSHOW_OBJECTIONS_WB', 'NOSHOW_OBJECTIONS_BIZ'],
      emailCount: 2,
      timing: '2 emails',
      goal: 'Get lead to reschedule objections call',
      subjects: [],
    },
    warnings: ['Max 2 reschedule attempts → then → lead_lost_reactivation'],
    detail: {
      description: 'Lead did not show up to the objections call.',
      updatedBy: 'Salesperson',
      trigger: 'Emailer pulls Deal Stage',
      owner: 'Tetiana',
    },
  },
  {
    id: 'objections_held',
    type: 'meeting',
    priority: 'P2',
    label: 'Objections Call Held',
    hubspot: {
      dealStage: 'Objections Call Held',
      lifecycleStage: 'Lead',
    },
    detail: {
      description: 'Objections call was held. Salesperson logs the outcome.',
      updatedBy: 'Salesperson logs outcome',
      trigger: 'N/A',
    },
  },

  // ─── LAYER 6: OBJECTIONS OUTCOME (P2) ────────────────────────────────
  {
    id: 'decision_objections_resolved',
    type: 'decision',
    priority: 'P2',
    label: 'Were objections resolved?',
    detail: {
      description: 'Were the lead\'s objections resolved during the call?',
    },
  },
  {
    id: 'thinking_period',
    type: 'positive',
    priority: 'P2',
    label: 'Thinking Period (7 days)',
    hubspot: {
      dealStage: 'Thinking Period',
      lifecycleStage: 'Lead',
    },
    emailer: {
      sequence: 'THINKING_PERIOD_[SEG]',
      variants: ['THINKING_PERIOD_WB', 'THINKING_PERIOD_BIZ'],
      emailCount: 3,
      timing: '3 emails over 7 days',
      goal: 'Nudge lead toward conversion',
      subjects: [
        'Email 1 (day 1): "Great conversation — here\'s a summary"',
        'Email 2 (day 4): Social proof / author result case study',
        'Email 3 (day 7): "Time to decide — your slot closes tomorrow"',
      ],
    },
    warnings: ['Timeout rule: If Deal Stage = Thinking Period for >8 days with no update → salesperson must manually move to Lost - Reactivation. Salesperson reviews on day 8.'],
    detail: {
      description: 'Lead is in a 7-day thinking period after the objections call.',
      updatedBy: 'Salesperson sets stage immediately after objections call',
      trigger: 'Emailer pulls Deal Stage',
      owner: 'Tetiana',
    },
  },
  {
    id: 'decision_converted',
    type: 'decision',
    priority: 'P2',
    label: 'Did lead convert? (reviewed by salesperson on day 8)',
    detail: {
      description: 'Salesperson reviews on day 8 — did the lead decide to proceed?',
      updatedBy: 'Salesperson manually after thinking period',
    },
  },
  {
    id: 'first_payment',
    type: 'positive',
    priority: 'P2',
    label: 'First Payment — Discovery Sprint',
    hubspot: {
      dealStage: 'Discovery Sprint Active',
      leadStatus: 'Won',
      lifecycleStage: 'Customer',
    },
    emailer: {
      sequence: 'ONBOARDING_SPRINT_[SEG]',
      variants: ['ONBOARDING_SPRINT_WB', 'ONBOARDING_SPRINT_BIZ'],
      emailCount: 3,
      timing: '3 emails',
      goal: 'Onboard new customer for Discovery Sprint',
      subjects: [
        'Email 1: Welcome + what happens next',
        'Email 2: Preparation checklist',
        'Email 3: Day-before reminder for kickoff',
      ],
    },
    detail: {
      description: 'Lead has made first payment for the Discovery Sprint.',
      updatedBy: 'Salesperson after payment confirmation',
      trigger: 'Emailer pulls Deal Stage',
      owner: 'Tetiana',
    },
  },

  // ─── LAYER 7: DELIVERY & UPSELL (P3) ─────────────────────────────────
  {
    id: 'sprint_delivery',
    type: 'positive',
    priority: 'P3',
    label: 'Discovery Sprint Delivery',
    hubspot: {
      dealStage: 'Sprint In Delivery',
      lifecycleStage: 'Customer',
    },
    emailer: {
      sequence: 'None',
      note: 'No sequence — delivery phase',
      emailCount: 0,
    },
    detail: {
      description: 'Discovery Sprint is being delivered.',
      updatedBy: 'Salesperson',
      trigger: 'N/A',
    },
  },
  {
    id: 'materials_call',
    type: 'meeting',
    priority: 'P3',
    label: 'Materials Presentation Call',
    hubspot: {
      dealStage: 'Materials Presentation Scheduled',
      lifecycleStage: 'Customer',
    },
    emailer: {
      sequence: 'REMINDER_MATERIALS_[SEG]',
      variants: ['REMINDER_MATERIALS_WB', 'REMINDER_MATERIALS_BIZ'],
      emailCount: 2,
      timing: '1 confirmation + 1 reminder',
      goal: 'Ensure client shows up',
      subjects: [],
    },
    detail: {
      description: 'Materials presentation call scheduled to review sprint deliverables.',
      updatedBy: 'Salesperson',
      trigger: 'Emailer pulls Deal Stage',
      owner: 'Tetiana',
    },
  },
  {
    id: 'full_contract_discussion',
    type: 'positive',
    priority: 'P3',
    label: 'Full Contract Discussion',
    hubspot: {
      dealStage: 'Full Contract Discussion',
      lifecycleStage: 'Customer',
    },
    emailer: {
      sequence: 'FULLCONTRACT_FOLLOWUP_[SEG]',
      variants: ['FULLCONTRACT_FOLLOWUP_WB', 'FULLCONTRACT_FOLLOWUP_BIZ'],
      emailCount: 2,
      timing: '2 emails',
      goal: 'Move client toward full contract',
      subjects: [
        'Email 1: Summary of full engagement',
        'Email 2: "Ready to proceed?" + CTA',
      ],
    },
    detail: {
      description: 'Discussion about a full contract engagement beyond the Discovery Sprint.',
      updatedBy: 'Salesperson',
      trigger: 'Emailer pulls Deal Stage',
      owner: 'Tetiana',
    },
  },
  {
    id: 'full_objections_call',
    type: 'meeting',
    priority: 'P3',
    label: 'Full Contract Objections Call',
    hubspot: {
      dealStage: 'Full Contract Objections Scheduled',
      lifecycleStage: 'Customer',
    },
    emailer: {
      sequence: 'REMINDER_FULL_OBJECTIONS_[SEG]',
      variants: ['REMINDER_FULL_OBJECTIONS_WB', 'REMINDER_FULL_OBJECTIONS_BIZ'],
      emailCount: 2,
      timing: 'Confirmation + reminder',
      goal: 'Ensure client shows up',
      subjects: [],
    },
    detail: {
      description: 'Objections call for the full contract.',
      updatedBy: 'Salesperson',
      trigger: 'Emailer pulls Deal Stage',
      owner: 'Tetiana',
    },
  },
  {
    id: 'decision_full_objections_resolved',
    type: 'decision',
    priority: 'P3',
    label: 'Full contract objections resolved?',
    detail: {
      description: 'Were the client\'s full contract objections resolved?',
    },
  },
  {
    id: 'client_lost',
    type: 'lost',
    priority: 'P3',
    label: 'Client Lost → Reactivation Cohort',
    hubspot: {
      dealStage: 'Client Lost',
      leadStatus: 'Unqualified',
      lifecycleStage: 'Other',
    },
    emailer: {
      sequence: 'None',
      note: 'Quarterly batch reactivation campaign',
      emailCount: 0,
    },
    detail: {
      description: 'Client is lost. Enters quarterly reactivation cohort.',
      updatedBy: 'Salesperson',
      trigger: 'Manual quarterly',
    },
  },
  {
    id: 'contract_signed',
    type: 'positive',
    priority: 'P3',
    label: 'Contract Signed',
    hubspot: {
      dealStage: 'Contract Signed',
      lifecycleStage: 'Customer',
    },
    detail: {
      description: 'Full contract has been signed by the client.',
      updatedBy: 'Salesperson',
      trigger: 'N/A',
    },
  },
  {
    id: 'full_payment',
    type: 'positive',
    priority: 'P3',
    label: 'Full Contract Payment Received',
    hubspot: {
      dealStage: 'Full Contract Active',
      lifecycleStage: 'Customer',
    },
    emailer: {
      sequence: 'ONBOARDING_FULL_[SEG]',
      variants: ['ONBOARDING_FULL_WB', 'ONBOARDING_FULL_BIZ'],
      emailCount: 3,
      timing: '3-email onboarding',
      goal: 'Onboard client for full contract',
      subjects: [],
    },
    detail: {
      description: 'Full contract payment received. Onboarding sequence begins.',
      updatedBy: 'Salesperson',
      trigger: 'Emailer pulls Deal Stage',
      owner: 'Tetiana',
    },
  },
  {
    id: 'client_onboarded',
    type: 'positive',
    priority: 'P3',
    label: 'Client Onboarded',
    hubspot: {
      dealStage: 'Active Client',
      lifecycleStage: 'Customer',
    },
    detail: {
      description: 'Client is fully onboarded and active.',
      updatedBy: 'Salesperson',
      trigger: 'N/A',
    },
  },
];

// =============================================================================
// EDGES
// =============================================================================
export const edges = [
  // Layer 0 — Entry flow
  { id: 'e-lead-website', source: 'lead_source', target: 'visits_website', priority: 'P1' },
  { id: 'e-web-form', source: 'visits_website', target: 'entry_form_strategy', priority: 'P1' },
  { id: 'e-web-magnet', source: 'visits_website', target: 'entry_lead_magnet', priority: 'P1' },
  { id: 'e-web-whatsapp', source: 'visits_website', target: 'entry_whatsapp', priority: 'P1' },
  { id: 'e-web-email', source: 'visits_website', target: 'entry_email', priority: 'P1' },
  { id: 'e-web-calendar', source: 'visits_website', target: 'entry_calendar', priority: 'P1' },

  // Entry paths → contact_created
  { id: 'e-form-contact', source: 'entry_form_strategy', target: 'contact_created', priority: 'P1' },
  { id: 'e-magnet-contact', source: 'entry_lead_magnet', target: 'contact_created', priority: 'P1' },
  { id: 'e-whatsapp-contact', source: 'entry_whatsapp', target: 'contact_created', priority: 'P1' },
  { id: 'e-email-contact', source: 'entry_email', target: 'contact_created', priority: 'P1' },
  { id: 'e-calendar-contact', source: 'entry_calendar', target: 'contact_created', priority: 'P1' },

  // Layer 1 — Contact → Warmup
  { id: 'e-contact-warmup', source: 'contact_created', target: 'seq_warmup', priority: 'P1' },
  { id: 'e-warmup-decision', source: 'seq_warmup', target: 'decision_session_booked', priority: 'P1' },

  // Layer 2 — Strategy Session Booking
  { id: 'e-booked-yes', source: 'decision_session_booked', target: 'session_scheduled', priority: 'P1', edgeType: 'yes' },
  { id: 'e-booked-no', source: 'decision_session_booked', target: 'ghost_warmup', priority: 'P1', edgeType: 'no' },
  { id: 'e-ghost-decision', source: 'ghost_warmup', target: 'decision_ghost_warmup_response', priority: 'P1' },
  { id: 'e-ghost-yes', source: 'decision_ghost_warmup_response', target: 'session_scheduled', priority: 'P1', edgeType: 'yes', isLoop: true },
  { id: 'e-ghost-no', source: 'decision_ghost_warmup_response', target: 'lead_lost_cold', priority: 'P1', edgeType: 'no' },

  // Layer 3 — Strategy Session Outcome
  { id: 'e-session-decision', source: 'session_scheduled', target: 'decision_session_showed', priority: 'P1' },
  { id: 'e-showed-no', source: 'decision_session_showed', target: 'session_noshow', priority: 'P1', edgeType: 'no' },
  { id: 'e-showed-yes', source: 'decision_session_showed', target: 'session_held', priority: 'P1', edgeType: 'yes' },
  { id: 'e-noshow-decision', source: 'session_noshow', target: 'decision_noshow_session_response', priority: 'P1' },
  { id: 'e-noshow-yes', source: 'decision_noshow_session_response', target: 'session_scheduled', priority: 'P1', edgeType: 'yes', isLoop: true, loopLabel: 'Attempt 1 or 2' },
  { id: 'e-noshow-no', source: 'decision_noshow_session_response', target: 'lead_lost_cold', priority: 'P1', edgeType: 'no', loopLabel: 'After 2nd attempt' },

  // Layer 4 — Pathfinder
  { id: 'e-held-pathfinder', source: 'session_held', target: 'pathfinder_scheduled', priority: 'P1' },
  { id: 'e-pathfinder-decision', source: 'pathfinder_scheduled', target: 'decision_pathfinder_showed', priority: 'P1' },
  { id: 'e-pathfinder-no', source: 'decision_pathfinder_showed', target: 'pathfinder_noshow', priority: 'P1', edgeType: 'no' },
  { id: 'e-pathfinder-yes', source: 'decision_pathfinder_showed', target: 'pathfinder_held', priority: 'P1', edgeType: 'yes' },
  { id: 'e-pf-noshow-decision', source: 'pathfinder_noshow', target: 'decision_pathfinder_noshow_response', priority: 'P1' },
  { id: 'e-pf-noshow-yes', source: 'decision_pathfinder_noshow_response', target: 'pathfinder_scheduled', priority: 'P1', edgeType: 'yes', isLoop: true, loopLabel: 'Attempt 1 or 2' },
  { id: 'e-pf-noshow-no', source: 'decision_pathfinder_noshow_response', target: 'lead_lost_reactivation', priority: 'P1', edgeType: 'no' },
  { id: 'e-pathfinder-qualified', source: 'pathfinder_held', target: 'decision_qualified', priority: 'P1' },
  { id: 'e-qualified-no', source: 'decision_qualified', target: 'unqualified', priority: 'P1', edgeType: 'no' },
  { id: 'e-unqualified-lost', source: 'unqualified', target: 'lead_lost_reactivation', priority: 'P1' },
  { id: 'e-qualified-yes', source: 'decision_qualified', target: 'sprint_presentation_sent', priority: 'P1', edgeType: 'yes' },

  // Layer 5 — Objections Call
  { id: 'e-sprint-decision', source: 'sprint_presentation_sent', target: 'decision_objections_booked', priority: 'P2' },
  { id: 'e-obj-booked-no', source: 'decision_objections_booked', target: 'sprint_ghost', priority: 'P2', edgeType: 'no' },
  { id: 'e-sprint-ghost-decision', source: 'sprint_ghost', target: 'decision_ghost_sprint_response', priority: 'P2' },
  { id: 'e-sprint-ghost-yes', source: 'decision_ghost_sprint_response', target: 'objections_scheduled', priority: 'P2', edgeType: 'yes', isLoop: true },
  { id: 'e-sprint-ghost-no', source: 'decision_ghost_sprint_response', target: 'lead_lost_reactivation', priority: 'P2', edgeType: 'no' },
  { id: 'e-obj-booked-yes', source: 'decision_objections_booked', target: 'objections_scheduled', priority: 'P2', edgeType: 'yes' },
  { id: 'e-obj-sched-decision', source: 'objections_scheduled', target: 'decision_objections_showed', priority: 'P2' },
  { id: 'e-obj-showed-no', source: 'decision_objections_showed', target: 'objections_noshow', priority: 'P2', edgeType: 'no' },
  { id: 'e-obj-noshow-loop', source: 'objections_noshow', target: 'objections_scheduled', priority: 'P2', edgeType: 'yes', isLoop: true, loopLabel: 'Attempt 1 or 2' },
  { id: 'e-obj-noshow-lost', source: 'objections_noshow', target: 'lead_lost_reactivation', priority: 'P2', edgeType: 'no', loopLabel: 'After 2nd attempt' },
  { id: 'e-obj-showed-yes', source: 'decision_objections_showed', target: 'objections_held', priority: 'P2', edgeType: 'yes' },

  // Layer 6 — Objections Outcome
  { id: 'e-obj-held-decision', source: 'objections_held', target: 'decision_objections_resolved', priority: 'P2' },
  { id: 'e-obj-resolved-no', source: 'decision_objections_resolved', target: 'lead_lost_reactivation', priority: 'P2', edgeType: 'no' },
  { id: 'e-obj-resolved-yes', source: 'decision_objections_resolved', target: 'thinking_period', priority: 'P2', edgeType: 'yes' },
  { id: 'e-thinking-decision', source: 'thinking_period', target: 'decision_converted', priority: 'P2' },
  { id: 'e-converted-no', source: 'decision_converted', target: 'lead_lost_reactivation', priority: 'P2', edgeType: 'no' },
  { id: 'e-converted-yes', source: 'decision_converted', target: 'first_payment', priority: 'P2', edgeType: 'yes' },

  // Layer 7 — Delivery & Upsell
  { id: 'e-payment-delivery', source: 'first_payment', target: 'sprint_delivery', priority: 'P3' },
  { id: 'e-delivery-materials', source: 'sprint_delivery', target: 'materials_call', priority: 'P3' },
  { id: 'e-materials-contract', source: 'materials_call', target: 'full_contract_discussion', priority: 'P3' },
  { id: 'e-contract-objections', source: 'full_contract_discussion', target: 'full_objections_call', priority: 'P3' },
  { id: 'e-full-obj-decision', source: 'full_objections_call', target: 'decision_full_objections_resolved', priority: 'P3' },
  { id: 'e-full-obj-no', source: 'decision_full_objections_resolved', target: 'client_lost', priority: 'P3', edgeType: 'no' },
  { id: 'e-full-obj-yes', source: 'decision_full_objections_resolved', target: 'contract_signed', priority: 'P3', edgeType: 'yes' },
  { id: 'e-signed-payment', source: 'contract_signed', target: 'full_payment', priority: 'P3' },
  { id: 'e-full-payment-onboard', source: 'full_payment', target: 'client_onboarded', priority: 'P3' },
];

// =============================================================================
// HUBSPOT TAGGING SUMMARY TABLE
// =============================================================================
export const hubspotTable = [
  { num: 1, dealStage: 'New Lead', leadStatus: 'New', lifecycle: 'Lead', emailerSequence: 'WARMUP_[SEG]', updatedBy: 'Auto / Manual', trigger: 'Emailer pulls Deal Stage', priority: 'P1' },
  { num: 2, dealStage: 'Strategy Session Scheduled', leadStatus: 'In Progress', lifecycle: 'Lead', emailerSequence: 'REMINDER_SESSION_[SEG]', updatedBy: 'Salesperson', trigger: 'Emailer pulls Deal Stage', priority: 'P1' },
  { num: 3, dealStage: 'Strategy Session No-Show', leadStatus: 'Attempted', lifecycle: 'Lead', emailerSequence: 'NOSHOW_SESSION_[SEG]', updatedBy: 'Salesperson', trigger: 'Emailer pulls Deal Stage', priority: 'P1' },
  { num: 4, dealStage: 'Warmup Ghost', leadStatus: 'Open', lifecycle: 'Lead', emailerSequence: 'GHOST_WARMUP_[SEG]', updatedBy: 'Salesperson', trigger: 'Emailer pulls Deal Stage', priority: 'P1' },
  { num: 5, dealStage: 'Strategy Session Held', leadStatus: 'Connected', lifecycle: 'Lead', emailerSequence: '—', updatedBy: 'Salesperson', trigger: '—', priority: 'P1' },
  { num: 6, dealStage: 'Pathfinder Scheduled', leadStatus: 'In Progress', lifecycle: 'Lead', emailerSequence: 'REMINDER_PATHFINDER_[SEG]', updatedBy: 'Salesperson', trigger: 'Emailer pulls Deal Stage', priority: 'P1' },
  { num: 7, dealStage: 'Pathfinder No-Show', leadStatus: 'Attempted', lifecycle: 'Lead', emailerSequence: 'NOSHOW_PATHFINDER_[SEG]', updatedBy: 'Salesperson', trigger: 'Emailer pulls Deal Stage', priority: 'P1' },
  { num: 8, dealStage: 'Pathfinder Held', leadStatus: 'Connected', lifecycle: 'Lead', emailerSequence: '—', updatedBy: 'Salesperson', trigger: '—', priority: 'P1' },
  { num: 9, dealStage: 'Unqualified', leadStatus: 'Unqualified', lifecycle: 'Lead', emailerSequence: 'UNQUALIFIED_NURTURE_[SEG]', updatedBy: 'Salesperson', trigger: 'Emailer pulls Deal Stage', priority: 'P1' },
  { num: 10, dealStage: 'Lost - No Response', leadStatus: 'Unqualified', lifecycle: 'Lead', emailerSequence: '— (quarterly batch)', updatedBy: 'Salesperson', trigger: 'Manual quarterly', priority: 'P1' },
  { num: 11, dealStage: 'Sprint Presentation Sent', leadStatus: 'In Progress', lifecycle: 'Lead', emailerSequence: 'SPRINT_FOLLOWUP_[SEG]', updatedBy: 'Salesperson', trigger: 'Emailer pulls Deal Stage', priority: 'P2' },
  { num: 12, dealStage: 'Sprint Ghost', leadStatus: 'Open', lifecycle: 'Lead', emailerSequence: 'GHOST_SPRINT_[SEG]', updatedBy: 'Salesperson', trigger: 'Emailer pulls Deal Stage', priority: 'P2' },
  { num: 13, dealStage: 'Objections Call Scheduled', leadStatus: 'In Progress', lifecycle: 'Lead', emailerSequence: 'REMINDER_OBJECTIONS_[SEG]', updatedBy: 'Salesperson', trigger: 'Emailer pulls Deal Stage', priority: 'P2' },
  { num: 14, dealStage: 'Objections Call No-Show', leadStatus: 'Attempted', lifecycle: 'Lead', emailerSequence: 'NOSHOW_OBJECTIONS_[SEG]', updatedBy: 'Salesperson', trigger: 'Emailer pulls Deal Stage', priority: 'P2' },
  { num: 15, dealStage: 'Objections Call Held', leadStatus: 'Connected', lifecycle: 'Lead', emailerSequence: '—', updatedBy: 'Salesperson', trigger: '—', priority: 'P2' },
  { num: 16, dealStage: 'Thinking Period', leadStatus: 'In Progress', lifecycle: 'Lead', emailerSequence: 'THINKING_PERIOD_[SEG]', updatedBy: 'Salesperson', trigger: 'Emailer pulls Deal Stage', priority: 'P2' },
  { num: 17, dealStage: 'Lost - Reactivation', leadStatus: 'Unqualified', lifecycle: 'Lead', emailerSequence: '— (quarterly batch)', updatedBy: 'Salesperson', trigger: 'Manual quarterly', priority: 'P1' },
  { num: 18, dealStage: 'Discovery Sprint Active', leadStatus: 'Won', lifecycle: 'Customer', emailerSequence: 'ONBOARDING_SPRINT_[SEG]', updatedBy: 'Salesperson', trigger: 'Emailer pulls Deal Stage', priority: 'P2' },
  { num: 19, dealStage: 'Sprint In Delivery', leadStatus: 'Won', lifecycle: 'Customer', emailerSequence: '—', updatedBy: 'Salesperson', trigger: '—', priority: 'P3' },
  { num: 20, dealStage: 'Materials Presentation Scheduled', leadStatus: 'Won', lifecycle: 'Customer', emailerSequence: 'REMINDER_MATERIALS_[SEG]', updatedBy: 'Salesperson', trigger: 'Emailer pulls Deal Stage', priority: 'P3' },
  { num: 21, dealStage: 'Full Contract Discussion', leadStatus: 'Won', lifecycle: 'Customer', emailerSequence: 'FULLCONTRACT_FOLLOWUP_[SEG]', updatedBy: 'Salesperson', trigger: 'Emailer pulls Deal Stage', priority: 'P3' },
  { num: 22, dealStage: 'Full Contract Objections Scheduled', leadStatus: 'Won', lifecycle: 'Customer', emailerSequence: 'REMINDER_FULL_OBJECTIONS_[SEG]', updatedBy: 'Salesperson', trigger: 'Emailer pulls Deal Stage', priority: 'P3' },
  { num: 23, dealStage: 'Contract Signed', leadStatus: 'Won', lifecycle: 'Customer', emailerSequence: '—', updatedBy: 'Salesperson', trigger: '—', priority: 'P3' },
  { num: 24, dealStage: 'Full Contract Active', leadStatus: 'Won', lifecycle: 'Customer', emailerSequence: 'ONBOARDING_FULL_[SEG]', updatedBy: 'Salesperson', trigger: 'Emailer pulls Deal Stage', priority: 'P3' },
  { num: 25, dealStage: 'Active Client', leadStatus: 'Won', lifecycle: 'Customer', emailerSequence: '—', updatedBy: 'Salesperson', trigger: '—', priority: 'P3' },
  { num: 26, dealStage: 'Client Lost', leadStatus: 'Unqualified', lifecycle: 'Other', emailerSequence: '— (quarterly batch)', updatedBy: 'Salesperson', trigger: 'Manual quarterly', priority: 'P3' },
];
