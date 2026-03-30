export type ConditionId =
  | 'trust_fund'
  | 'middle_class'
  | 'working_poor'
  | 'immigrant'
  | 'single_parent'
  | 'inherited_debt';

export interface GameStats {
  netWorth: number;
  stress: number;
  socialCapital: number;
  security: number;
  health: number;
  education: number; // 0=none, 1=HS, 2=vocational, 3=associate, 4=bachelor, 5=graduate
  careerTier: number; // 0=unemployed, 1=minimum, 2=service, 3=skilled, 4=professional, 5=executive
  creditScore: number; // 300-850
}

export interface StartingCondition {
  id: ConditionId;
  label: string;
  subtitle: string;
  description: string;
  startingStats: GameStats;
  isPrivileged: boolean;
}

export interface ChoiceEffect {
  netWorth?: number;
  stress?: number;
  socialCapital?: number;
  security?: number;
  health?: number;
  education?: number;
  careerTier?: number;
  creditScore?: number;
  // Multipliers for compound engine
  incomePerYear?: number; // annual income added between stages
  debtRate?: number; // if positive, compounds negatively
}

export interface Choice {
  id: string;
  label: string;
  description: string;
  availableTo: ConditionId[] | 'all';
  requiresMinEducation?: number;
  requiresMinCareerTier?: number;
  effects: ChoiceEffect;
}

export interface LifeStage {
  id: number;
  age: number;
  title: string;
  scenario: string;
  constrainedScenario?: string;
  choices: Choice[];
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  affectsConditions: ConditionId[] | 'all';
  probability: number; // 0-1
  effects: ChoiceEffect;
  privilegedEffects?: ChoiceEffect; // different impact if privileged
}

export const CONDITIONS: StartingCondition[] = [
  {
    id: 'trust_fund',
    label: 'TRUST FUND',
    subtitle: 'Born on third base',
    description: 'Inherited wealth. Private school. Family connections in every industry. A safety net made of silk.',
    isPrivileged: true,
    startingStats: {
      netWorth: 500000, stress: 10, socialCapital: 90, security: 95,
      health: 90, education: 1, careerTier: 0, creditScore: 750,
    },
  },
  {
    id: 'middle_class',
    label: 'MIDDLE CLASS',
    subtitle: 'The shrinking center',
    description: 'Stable home. State school. Parents who can help — but not too much. One bad year away from trouble.',
    isPrivileged: true,
    startingStats: {
      netWorth: 25000, stress: 30, socialCapital: 50, security: 65,
      health: 75, education: 1, careerTier: 0, creditScore: 680,
    },
  },
  {
    id: 'working_poor',
    label: 'WORKING POOR',
    subtitle: 'Full-time and falling behind',
    description: 'Unstable housing. Underfunded school. Parents working two jobs each. No safety net. No margin for error.',
    isPrivileged: false,
    startingStats: {
      netWorth: 800, stress: 65, socialCapital: 20, security: 20,
      health: 60, education: 1, careerTier: 0, creditScore: 520,
    },
  },
  {
    id: 'immigrant',
    label: 'FIRST-GEN IMMIGRANT',
    subtitle: 'Starting over from zero',
    description: 'Foreign credentials unrecognized. Language barrier. Strong family network — but in another country.',
    isPrivileged: false,
    startingStats: {
      netWorth: 2000, stress: 55, socialCapital: 15, security: 25,
      health: 70, education: 1, careerTier: 0, creditScore: 500,
    },
  },
  {
    id: 'single_parent',
    label: 'SINGLE-PARENT HOME',
    subtitle: 'One income, no backup',
    description: 'One parent doing everything. Childcare costs eating the budget. Schedule dictated by someone else\'s needs.',
    isPrivileged: false,
    startingStats: {
      netWorth: 5000, stress: 60, socialCapital: 25, security: 30,
      health: 65, education: 1, careerTier: 0, creditScore: 560,
    },
  },
  {
    id: 'inherited_debt',
    label: 'INHERITED DEBT',
    subtitle: 'Born owing',
    description: 'Family medical debt. Predatory loans already in place. You start life in the negative — and the interest is compounding.',
    isPrivileged: false,
    startingStats: {
      netWorth: -45000, stress: 75, socialCapital: 15, security: 15,
      health: 55, education: 1, careerTier: 0, creditScore: 420,
    },
  },
];

// ============================================================
// 10 LIFE STAGES
// ============================================================

export const LIFE_STAGES: LifeStage[] = [
  // STAGE 1: Age 14 — Childhood
  {
    id: 1, age: 14, title: 'Childhood',
    scenario: 'You\'re 14. School\'s out — how do you spend your time?',
    constrainedScenario: 'You\'re 14. After school, you don\'t have the luxury of choosing. What can you do?',
    choices: [
      {
        id: 's1_enrichment', label: 'Extracurriculars & tutoring',
        description: 'SAT prep, lacrosse, debate club. Building a résumé before you know what one is.',
        availableTo: ['trust_fund', 'middle_class'],
        effects: { stress: -5, socialCapital: 10, education: 0.5, health: 5 },
      },
      {
        id: 's1_sports', label: 'Play sports at school',
        description: 'Join whatever team will have you. It\'s free and it keeps you off the streets.',
        availableTo: 'all',
        effects: { stress: -5, socialCapital: 5, health: 10 },
      },
      {
        id: 's1_parttime', label: 'Get an after-school job',
        description: 'Bag groceries, bus tables. Your paycheck helps keep the lights on at home.',
        availableTo: 'all',
        effects: { netWorth: 3000, stress: 10, socialCapital: -5, health: -5, careerTier: 0.5 },
      },
      {
        id: 's1_caretaker', label: 'Take care of siblings',
        description: 'No daycare money. You\'re the oldest. You cook, clean, help with homework.',
        availableTo: ['working_poor', 'single_parent', 'immigrant', 'inherited_debt'],
        effects: { stress: 15, socialCapital: 5, security: -5, health: -5 },
      },
      {
        id: 's1_hustle', label: 'Informal work — cash only',
        description: 'Mow lawns, sell snacks, fix phones. No taxes, no protections, no résumé line.',
        availableTo: ['working_poor', 'immigrant', 'inherited_debt'],
        effects: { netWorth: 2000, stress: 10, socialCapital: -5, creditScore: -10 },
      },
    ],
  },

  // STAGE 2: Age 18 — Education
  {
    id: 2, age: 18, title: 'Education',
    scenario: 'You\'re 18. The world tells you education is the great equalizer. What do you do?',
    constrainedScenario: 'You\'re 18. Everyone says "just go to college." They don\'t mention the cost.',
    choices: [
      {
        id: 's2_elite', label: 'Elite university, no debt',
        description: 'Family covers tuition. Legacy admission. The network alone is worth millions.',
        availableTo: ['trust_fund'],
        effects: { netWorth: -5000, stress: -5, socialCapital: 30, security: 10, education: 4, creditScore: 20 },
      },
      {
        id: 's2_state', label: 'Four-year state university',
        description: 'Solid education. Some loans. Part-time job to cover living costs.',
        availableTo: ['trust_fund', 'middle_class'],
        effects: { netWorth: -45000, stress: 15, socialCapital: 15, security: 10, education: 4, debtRate: 0.05, creditScore: 10 },
      },
      {
        id: 's2_community', label: 'Community college, then transfer',
        description: 'Cheaper path. Takes longer. Fewer connections. Same degree — different doors.',
        availableTo: 'all',
        effects: { netWorth: -15000, stress: 10, socialCapital: 5, security: 5, education: 3, debtRate: 0.04 },
      },
      {
        id: 's2_work', label: 'Skip college, work full-time',
        description: 'Start earning now. No debt. But the ceiling is lower and the floor is harder.',
        availableTo: 'all',
        effects: { netWorth: 18000, stress: 5, socialCapital: -5, security: -5, careerTier: 1, incomePerYear: 22000 },
      },
      {
        id: 's2_vocational', label: 'Vocational training',
        description: 'Learn a trade. Shorter timeline. Immediate employability. Physical toll.',
        availableTo: 'all',
        effects: { netWorth: -8000, stress: 5, socialCapital: 5, security: 10, education: 2, careerTier: 2, health: -5 },
      },
      {
        id: 's2_military', label: 'Enlist in the military',
        description: 'Steady pay, GI Bill, discipline. But you don\'t choose where you go or what you see.',
        availableTo: 'all',
        effects: { netWorth: 10000, stress: 20, socialCapital: 5, security: 15, health: -10, education: 1, careerTier: 2 },
      },
    ],
  },

  // STAGE 3: Age 22 — First Job
  {
    id: 3, age: 22, title: 'First Job',
    scenario: 'You\'re 22. Time to enter the workforce. Your résumé tells a story — but who\'s reading it?',
    constrainedScenario: 'You\'re 22. You need income. Yesterday.',
    choices: [
      {
        id: 's3_family_biz', label: 'Join family business / use connections',
        description: 'Skip the line. Start mid-career. The interview was a formality.',
        availableTo: ['trust_fund'],
        effects: { netWorth: 40000, stress: -10, socialCapital: 20, security: 20, careerTier: 4, incomePerYear: 85000 },
      },
      {
        id: 's3_corporate', label: 'Corporate entry-level',
        description: 'Structured path. Benefits. Slow climb. Office politics.',
        availableTo: ['trust_fund', 'middle_class'],
        requiresMinEducation: 3,
        effects: { netWorth: 20000, stress: 10, socialCapital: 10, security: 15, careerTier: 3, incomePerYear: 55000, creditScore: 15 },
      },
      {
        id: 's3_service', label: 'Service industry job',
        description: 'Restaurant, retail, call center. Tips help. Benefits don\'t exist.',
        availableTo: 'all',
        effects: { netWorth: 12000, stress: 15, socialCapital: -5, security: -5, careerTier: 2, incomePerYear: 28000 },
      },
      {
        id: 's3_gig', label: 'Gig economy — drive, deliver, freelance',
        description: 'Flexible hours. No benefits. No sick days. Your car is your office.',
        availableTo: 'all',
        effects: { netWorth: 14000, stress: 20, socialCapital: -5, security: -10, careerTier: 1, incomePerYear: 25000 },
      },
      {
        id: 's3_skilled', label: 'Skilled trade position',
        description: 'Electrician, plumber, mechanic. Union card if you\'re lucky. Good pay, hard work.',
        availableTo: 'all',
        requiresMinEducation: 2,
        effects: { netWorth: 18000, stress: 10, socialCapital: 5, security: 10, careerTier: 3, incomePerYear: 50000, health: -5, creditScore: 10 },
      },
      {
        id: 's3_startup', label: 'Start something of your own',
        description: 'Risk everything. Most fail. But if you have a safety net, failing is just a learning experience.',
        availableTo: ['trust_fund', 'middle_class'],
        effects: { netWorth: -20000, stress: 25, socialCapital: 15, security: -15, careerTier: 3, incomePerYear: 10000 },
      },
    ],
  },

  // STAGE 4: Age 26 — Relationships
  {
    id: 4, age: 26, title: 'Relationships',
    scenario: 'You\'re 26. Love and partnership are personal — but their financial weight is structural.',
    constrainedScenario: 'You\'re 26. Relationships cost money. Being alone costs differently.',
    choices: [
      {
        id: 's4_marry_up', label: 'Marry someone with family wealth',
        description: 'Love and money aren\'t separate. Combined household income doubles. Dual safety net.',
        availableTo: ['trust_fund', 'middle_class'],
        effects: { netWorth: 60000, stress: -15, socialCapital: 15, security: 25, health: 5, creditScore: 30 },
      },
      {
        id: 's4_partner', label: 'Committed partnership, dual income',
        description: 'Two incomes, shared rent. Stability through togetherness. But now your risks are shared too.',
        availableTo: 'all',
        effects: { netWorth: 20000, stress: -10, socialCapital: 10, security: 15, incomePerYear: 15000 },
      },
      {
        id: 's4_solo', label: 'Stay single, focus on career',
        description: 'No one else\'s debt. No one else\'s dreams. Freedom or loneliness — depends on the day.',
        availableTo: 'all',
        effects: { stress: 5, socialCapital: -10, security: -5, careerTier: 0.5 },
      },
      {
        id: 's4_child_early', label: 'Have a child — ready or not',
        description: 'Childcare: $15K/year. Lost income. Lost sleep. Infinite love. Finite dollars.',
        availableTo: 'all',
        effects: { netWorth: -25000, stress: 20, socialCapital: 10, security: -10, health: -5, incomePerYear: -10000 },
      },
      {
        id: 's4_caretaker_parent', label: 'Become a caretaker for aging parents',
        description: 'They took care of you. Now it\'s your turn. It costs time, money, and career momentum.',
        availableTo: ['immigrant', 'working_poor', 'single_parent'],
        effects: { netWorth: -15000, stress: 20, socialCapital: 5, security: -10, careerTier: -0.5, health: -10 },
      },
    ],
  },

  // STAGE 5: Age 30 — Housing
  {
    id: 5, age: 30, title: 'Housing',
    scenario: 'You\'re 30. Everyone asks if you own a home yet. As if it were a choice.',
    constrainedScenario: 'You\'re 30. Rent just went up again. Where do you live?',
    choices: [
      {
        id: 's5_buy_help', label: 'Buy a home (family helps with down payment)',
        description: 'The bank of Mom and Dad. Property value climbs 4% a year. Wealth builds while you sleep.',
        availableTo: ['trust_fund', 'middle_class'],
        effects: { netWorth: 50000, stress: -10, socialCapital: 5, security: 25, creditScore: 40 },
      },
      {
        id: 's5_buy_stretch', label: 'Buy a home (stretch to afford it)',
        description: '40% of income to mortgage. One missed payment from foreclosure. But it\'s yours.',
        availableTo: ['middle_class', 'immigrant'],
        effects: { netWorth: 15000, stress: 20, socialCapital: 0, security: 10, debtRate: 0.04, creditScore: 20 },
      },
      {
        id: 's5_rent_nice', label: 'Rent in a decent neighborhood',
        description: 'No equity building. But stable. Good schools nearby. Safe streets.',
        availableTo: 'all',
        effects: { netWorth: -18000, stress: 5, socialCapital: 5, security: 5, incomePerYear: -18000 },
      },
      {
        id: 's5_rent_cheap', label: 'Rent where you can afford',
        description: 'Longer commute. Worse schools. Noise at night. But the rent gets paid.',
        availableTo: 'all',
        effects: { netWorth: -8000, stress: 15, socialCapital: -10, security: -10, health: -5, incomePerYear: -10000 },
      },
      {
        id: 's5_family', label: 'Move in with family / roommates',
        description: 'Save money. Lose privacy. No space that\'s truly yours.',
        availableTo: 'all',
        effects: { netWorth: 5000, stress: 10, socialCapital: -5, security: -5 },
      },
    ],
  },

  // STAGE 6: Age 34 — Career Pivot
  {
    id: 6, age: 34, title: 'Career Pivot',
    scenario: 'You\'re 34. The career you planned isn\'t the career you have. What now?',
    constrainedScenario: 'You\'re 34. Burnout is real. But quitting is a privilege.',
    choices: [
      {
        id: 's6_promote', label: 'Push for promotion',
        description: 'More hours, more politics, more money. The ladder exists — if you can see it.',
        availableTo: 'all',
        requiresMinCareerTier: 3,
        effects: { netWorth: 30000, stress: 15, socialCapital: 5, security: 10, careerTier: 1, incomePerYear: 20000, health: -5 },
      },
      {
        id: 's6_pivot', label: 'Career change — start over',
        description: 'Follow your passion. Take a pay cut. Hope it works out.',
        availableTo: ['trust_fund', 'middle_class'],
        effects: { netWorth: -20000, stress: 10, socialCapital: 5, security: -10, careerTier: -1 },
      },
      {
        id: 's6_sidehustle', label: 'Start a side hustle',
        description: 'Evenings and weekends belong to the grind. Two jobs, one body.',
        availableTo: 'all',
        effects: { netWorth: 15000, stress: 20, socialCapital: -5, health: -10, incomePerYear: 12000 },
      },
      {
        id: 's6_layoff', label: 'Get laid off — no choice',
        description: 'Restructuring. Your position has been eliminated. Severance: 2 weeks.',
        availableTo: ['working_poor', 'immigrant', 'single_parent', 'inherited_debt'],
        effects: { netWorth: -10000, stress: 30, socialCapital: -10, security: -20, careerTier: -1, creditScore: -30 },
      },
      {
        id: 's6_education', label: 'Go back to school',
        description: 'Invest in yourself. More debt, but new doors might open.',
        availableTo: 'all',
        effects: { netWorth: -35000, stress: 15, education: 1, debtRate: 0.06, socialCapital: 10 },
      },
    ],
  },

  // STAGE 7: Age 38 — Crisis
  {
    id: 7, age: 38, title: 'Crisis',
    scenario: 'You\'re 38. A financial emergency hits. Everyone faces this eventually.',
    constrainedScenario: 'You\'re 38. The emergency you\'ve been dreading finally arrives. There\'s no savings to absorb it.',
    choices: [
      {
        id: 's7_savings', label: 'Pay from savings / emergency fund',
        description: 'The money was there. That\'s what it was for. Life continues.',
        availableTo: ['trust_fund', 'middle_class'],
        effects: { netWorth: -15000, stress: 5, health: 5 },
      },
      {
        id: 's7_family', label: 'Family bails you out',
        description: 'One phone call. The check arrives. You feel guilty but grateful.',
        availableTo: ['trust_fund'],
        effects: { stress: -5, socialCapital: -5, security: 5 },
      },
      {
        id: 's7_debt', label: 'Take on high-interest debt',
        description: '22% interest. The emergency costs $5,000. You\'ll pay back $12,000.',
        availableTo: 'all',
        effects: { netWorth: -8000, stress: 25, security: -15, debtRate: 0.22, creditScore: -20 },
      },
      {
        id: 's7_gowithout', label: 'Go without / delay treatment',
        description: 'Can\'t afford it. Hope it gets better on its own. It usually doesn\'t.',
        availableTo: ['working_poor', 'single_parent', 'inherited_debt'],
        effects: { stress: 30, socialCapital: -10, security: -25, health: -20 },
      },
      {
        id: 's7_community', label: 'GoFundMe / community support',
        description: 'Ask for help publicly. Some people give. Some people judge. You survive.',
        availableTo: 'all',
        effects: { netWorth: -3000, stress: 15, socialCapital: 5, security: -5 },
      },
    ],
  },

  // STAGE 8: Age 42 — Children's Future
  {
    id: 8, age: 42, title: 'Children\'s Future',
    scenario: 'You\'re 42. Your children are asking about college. The cycle continues — or breaks.',
    constrainedScenario: 'You\'re 42. Your kids see what other kids have. You can\'t explain why the world is unfair.',
    choices: [
      {
        id: 's8_529plan', label: 'Fund a 529 college savings plan',
        description: 'You saved since they were born. $80K ready. They\'ll start debt-free.',
        availableTo: ['trust_fund', 'middle_class'],
        effects: { netWorth: -80000, stress: -10, socialCapital: 10, security: 10 },
      },
      {
        id: 's8_partial', label: 'Help as much as you can',
        description: 'Cover some costs. They\'ll need loans for the rest. Better than nothing.',
        availableTo: 'all',
        effects: { netWorth: -25000, stress: 10, socialCapital: 5, security: -5 },
      },
      {
        id: 's8_nothing', label: 'Can\'t contribute — they\'re on their own',
        description: 'The guilt is heavier than any debt. But you literally don\'t have it.',
        availableTo: ['working_poor', 'single_parent', 'inherited_debt'],
        effects: { stress: 25, socialCapital: -15, security: -10 },
      },
      {
        id: 's8_passdown', label: 'Pass down financial knowledge instead',
        description: 'You can\'t give money, but you can teach what you learned the hard way.',
        availableTo: 'all',
        effects: { stress: 5, socialCapital: 15, security: 5 },
      },
      {
        id: 's8_sacrifice', label: 'Sacrifice retirement savings for their education',
        description: 'Raid your 401K. Pay the penalty. Their future matters more than yours.',
        availableTo: 'all',
        effects: { netWorth: -50000, stress: 20, socialCapital: 5, security: -20 },
      },
    ],
  },

  // STAGE 9: Age 50 — Wealth Building
  {
    id: 9, age: 50, title: 'Wealth Building',
    scenario: 'You\'re 50. Peak earning years — if you have earnings to peak.',
    constrainedScenario: 'You\'re 50. They say this is when wealth is built. But you need money to make money.',
    choices: [
      {
        id: 's9_invest', label: 'Invest aggressively — stocks, real estate',
        description: 'Money makes money. 7% annual returns compound. In 15 years, it nearly doubles.',
        availableTo: ['trust_fund', 'middle_class'],
        effects: { netWorth: 150000, stress: -5, socialCapital: 10, security: 20, creditScore: 20 },
      },
      {
        id: 's9_retire_max', label: 'Max out retirement contributions',
        description: 'Tax-advantaged savings. Employer match. Slow and steady.',
        availableTo: ['trust_fund', 'middle_class'],
        requiresMinCareerTier: 3,
        effects: { netWorth: 80000, stress: 0, security: 15 },
      },
      {
        id: 's9_save_small', label: 'Try to start saving — finally',
        description: 'Put $200 a month away. It\'s not nothing. But compound interest needs time.',
        availableTo: 'all',
        effects: { netWorth: 12000, stress: 5, security: 5 },
      },
      {
        id: 's9_survive', label: 'No savings possible — just surviving',
        description: 'Every dollar is spoken for. Retirement is a word other people use.',
        availableTo: ['working_poor', 'single_parent', 'inherited_debt'],
        effects: { netWorth: -8000, stress: 20, socialCapital: -5, security: -10, health: -10 },
      },
      {
        id: 's9_community', label: 'Pool resources with community',
        description: 'Collective wealth-building. Lending circles. Nobody gets rich, but nobody falls alone.',
        availableTo: ['immigrant', 'working_poor', 'single_parent'],
        effects: { netWorth: 20000, stress: 0, socialCapital: 15, security: 10 },
      },
    ],
  },

  // STAGE 10: Age 60 — Retirement
  {
    id: 10, age: 60, title: 'Retirement',
    scenario: 'You\'re 60. Can you stop working? The answer was decided decades ago.',
    constrainedScenario: 'You\'re 60. Your body says stop. Your bank account says keep going.',
    choices: [
      {
        id: 's10_retire_early', label: 'Retire comfortably at 60',
        description: 'Travel. Grandchildren. Golf. The life they promised if you worked hard enough.',
        availableTo: ['trust_fund'],
        effects: { netWorth: -20000, stress: -30, socialCapital: 10, security: 10, health: 15 },
      },
      {
        id: 's10_retire_65', label: 'Plan to retire at 65',
        description: 'Five more years. Social Security kicks in. It\'ll be tight, but possible.',
        availableTo: ['trust_fund', 'middle_class'],
        effects: { netWorth: 40000, stress: -10, security: 10, health: 5 },
      },
      {
        id: 's10_work_forever', label: 'Work until you can\'t',
        description: 'Retirement isn\'t a date — it\'s when your body gives out.',
        availableTo: 'all',
        effects: { netWorth: 25000, stress: 15, security: -10, health: -15, incomePerYear: 20000 },
      },
      {
        id: 's10_depend', label: 'Depend on family / social programs',
        description: 'Move in with your children. Apply for benefits. Swallow your pride daily.',
        availableTo: 'all',
        effects: { netWorth: -5000, stress: 20, socialCapital: -15, security: -15 },
      },
      {
        id: 's10_downsize', label: 'Sell everything, downsize radically',
        description: 'Cash out the house (if you own one). Move somewhere cheap. Make it stretch.',
        availableTo: ['middle_class', 'trust_fund'],
        effects: { netWorth: 80000, stress: 5, socialCapital: -10, security: 5 },
      },
    ],
  },
];

// ============================================================
// RANDOM LIFE EVENTS
// ============================================================

export const RANDOM_EVENTS: RandomEvent[] = [
  {
    id: 'recession',
    title: 'The economy crashes.',
    description: 'A recession hits. Markets drop 30%. Layoffs everywhere. Those with assets lose value. Those without lose jobs.',
    affectsConditions: 'all',
    probability: 0.4,
    effects: { netWorth: -15000, stress: 20, security: -15 },
    privilegedEffects: { netWorth: -50000, stress: 10, security: -5 },
  },
  {
    id: 'medical_emergency',
    title: 'Medical emergency.',
    description: 'An unexpected surgery. With insurance: $3,000 copay. Without: $45,000 bill.',
    affectsConditions: 'all',
    probability: 0.35,
    effects: { netWorth: -45000, stress: 25, health: -15, security: -10 },
    privilegedEffects: { netWorth: -3000, stress: 5, health: -5 },
  },
  {
    id: 'inheritance_windfall',
    title: 'An inheritance arrives.',
    description: 'A relative passes away and leaves you money. Wealth transfers between generations — if there\'s wealth to transfer.',
    affectsConditions: ['trust_fund', 'middle_class'],
    probability: 0.3,
    effects: { netWorth: 50000, stress: -5, security: 10 },
  },
  {
    id: 'rent_hike',
    title: 'Rent increases 25%.',
    description: 'Your landlord raises rent. No rent control. Move or pay. Both cost money you don\'t have.',
    affectsConditions: ['working_poor', 'immigrant', 'single_parent', 'inherited_debt'],
    probability: 0.5,
    effects: { netWorth: -6000, stress: 15, security: -10 },
  },
  {
    id: 'job_automation',
    title: 'Your job is automated.',
    description: 'Technology replaces your role. Retraining takes time and money. The economy moved on without you.',
    affectsConditions: 'all',
    probability: 0.25,
    effects: { netWorth: -12000, stress: 25, security: -15, careerTier: -1 },
    privilegedEffects: { netWorth: -5000, stress: 10, security: -5 },
  },
  {
    id: 'car_breakdown',
    title: 'Your car breaks down.',
    description: 'Transmission gone. $4,000 repair. Without a car, you can\'t get to work. Without work, you can\'t fix the car.',
    affectsConditions: ['working_poor', 'single_parent', 'inherited_debt', 'middle_class'],
    probability: 0.4,
    effects: { netWorth: -4000, stress: 15, security: -5 },
    privilegedEffects: { netWorth: -4000, stress: 5 },
  },
  {
    id: 'promotion_surprise',
    title: 'An unexpected promotion.',
    description: 'Your work is noticed. A raise and a new title. But did connections or competence open the door?',
    affectsConditions: 'all',
    probability: 0.2,
    effects: { netWorth: 10000, stress: -5, socialCapital: 10, careerTier: 0.5, incomePerYear: 10000 },
    privilegedEffects: { netWorth: 20000, stress: -10, socialCapital: 15, careerTier: 1, incomePerYear: 25000 },
  },
  {
    id: 'identity_theft',
    title: 'Identity stolen.',
    description: 'Someone opens credit cards in your name. Fixing it takes months and lawyers you can\'t afford.',
    affectsConditions: 'all',
    probability: 0.15,
    effects: { netWorth: -8000, stress: 20, creditScore: -80 },
    privilegedEffects: { netWorth: -2000, stress: 10, creditScore: -30 },
  },
  {
    id: 'community_support',
    title: 'Community rallies around you.',
    description: 'Neighbors, church, mutual aid. When institutions fail, people show up.',
    affectsConditions: ['working_poor', 'immigrant', 'single_parent'],
    probability: 0.3,
    effects: { netWorth: 3000, stress: -10, socialCapital: 15, security: 5 },
  },
  {
    id: 'housing_boom',
    title: 'Housing prices surge.',
    description: 'If you own, your net worth jumps. If you rent, you\'re priced out of your neighborhood.',
    affectsConditions: 'all',
    probability: 0.35,
    effects: { netWorth: -5000, stress: 10, security: -10 }, // renters
    privilegedEffects: { netWorth: 80000, stress: -5, security: 10 }, // owners
  },
  {
    id: 'unexpected_pregnancy',
    title: 'Unexpected pregnancy.',
    description: 'Ready or not. Childcare costs $15K/year. Career takes a detour. Love doesn\'t pay bills.',
    affectsConditions: 'all',
    probability: 0.2,
    effects: { netWorth: -15000, stress: 20, socialCapital: 5, health: -5, incomePerYear: -8000 },
    privilegedEffects: { netWorth: -5000, stress: 10, socialCapital: 10, health: -5 },
  },
  {
    id: 'natural_disaster',
    title: 'Natural disaster hits your area.',
    description: 'Flood, fire, or storm. Insurance covers most — if you have insurance.',
    affectsConditions: 'all',
    probability: 0.15,
    effects: { netWorth: -20000, stress: 25, security: -20, health: -10 },
    privilegedEffects: { netWorth: -5000, stress: 10, security: -5 },
  },
];

// ============================================================
// CONCEPTS (for reveal screen)
// ============================================================

export const CONCEPTS = [
  {
    title: 'Compound Advantage',
    body: 'Small advantages early in life compound over decades. A $10,000 head start at age 20 becomes $76,000 by age 60 at 7% returns — without adding a single dollar. Disadvantages compound too.',
  },
  {
    title: 'Intergenerational Wealth Transfer',
    body: 'In the US, the average white family has 8x the wealth of the average Black family. This isn\'t about individual choices — it\'s about who got to accumulate wealth for generations and who was systematically excluded.',
  },
  {
    title: 'Opportunity Cost',
    body: 'When you can\'t invest because you\'re paying off debt, the cost isn\'t just the debt — it\'s the returns you didn\'t earn. The poor pay more for being poor.',
  },
  {
    title: 'The Wealth Gap',
    body: 'The top 10% of Americans own 70% of all wealth. The bottom 50% own 2.5%. Gender compounds this: women earn 82 cents for every dollar men earn.',
  },
  {
    title: 'Social Mobility',
    body: 'In the US, 50% of a child\'s income is determined by their parents\' income. In Denmark, it\'s 15%. Mobility isn\'t about effort — it\'s about infrastructure.',
  },
  {
    title: 'The Credit Score Trap',
    body: 'Poor credit means higher interest rates on everything — car loans, mortgages, insurance. Being poor is expensive. The system charges more to those who have less.',
  },
  {
    title: 'Healthcare & Wealth',
    body: 'Medical debt is the #1 cause of bankruptcy in America. 66% of bankruptcies are tied to medical issues. Health isn\'t just physical — it\'s financial.',
  },
];

// ============================================================
// HELPERS
// ============================================================

export function getOppositeCondition(conditionId: ConditionId): ConditionId {
  const opposites: Record<ConditionId, ConditionId> = {
    trust_fund: 'inherited_debt',
    middle_class: 'working_poor',
    working_poor: 'middle_class',
    immigrant: 'trust_fund',
    single_parent: 'trust_fund',
    inherited_debt: 'trust_fund',
  };
  return opposites[conditionId];
}

export function getAvailableChoices(stage: LifeStage, conditionId: ConditionId, stats?: GameStats): Choice[] {
  return stage.choices.filter(c => {
    if (c.availableTo !== 'all' && !c.availableTo.includes(conditionId)) return false;
    if (stats) {
      if (c.requiresMinEducation && stats.education < c.requiresMinEducation) return false;
      if (c.requiresMinCareerTier && stats.careerTier < c.requiresMinCareerTier) return false;
    }
    return true;
  });
}

const DEFAULT_STATS: GameStats = {
  netWorth: 0, stress: 50, socialCapital: 50, security: 50,
  health: 70, education: 1, careerTier: 0, creditScore: 600,
};

function applyEffects(stats: GameStats, effects: ChoiceEffect): GameStats {
  return {
    netWorth: stats.netWorth + (effects.netWorth || 0),
    stress: Math.max(0, Math.min(100, stats.stress + (effects.stress || 0))),
    socialCapital: Math.max(0, Math.min(100, stats.socialCapital + (effects.socialCapital || 0))),
    security: Math.max(0, Math.min(100, stats.security + (effects.security || 0))),
    health: Math.max(0, Math.min(100, stats.health + (effects.health || 0))),
    education: Math.max(0, Math.min(5, stats.education + (effects.education || 0))),
    careerTier: Math.max(0, Math.min(5, stats.careerTier + (effects.careerTier || 0))),
    creditScore: Math.max(300, Math.min(850, stats.creditScore + (effects.creditScore || 0))),
  };
}

/**
 * Compound engine: apply economic forces between stages
 */
export function compoundBetweenStages(stats: GameStats, yearsBetween: number, isPrivileged: boolean): GameStats {
  let { netWorth, creditScore } = stats;

  if (netWorth > 0) {
    // Positive net worth earns compound returns (7% if privileged/invested, 2% savings)
    const rate = isPrivileged ? 0.07 : 0.02;
    netWorth = netWorth * Math.pow(1 + rate, yearsBetween);
  } else if (netWorth < 0) {
    // Negative net worth compounds as debt
    const debtRate = creditScore < 500 ? 0.22 : creditScore < 650 ? 0.15 : 0.08;
    netWorth = netWorth * Math.pow(1 + debtRate, yearsBetween);
  }

  // Inflation erosion on purchasing power (3% per year)
  const inflationFactor = Math.pow(1.03, yearsBetween);

  // Credit score drifts toward 600 slowly
  creditScore = creditScore + (600 - creditScore) * 0.05 * yearsBetween;

  // Health degrades slightly with age and stress
  const healthDelta = -(yearsBetween * 0.5) - (stats.stress > 60 ? yearsBetween * 1 : 0);

  return {
    ...stats,
    netWorth: Math.round(netWorth),
    creditScore: Math.max(300, Math.min(850, Math.round(creditScore))),
    health: Math.max(0, Math.min(100, stats.health + healthDelta)),
  };
}

/**
 * Roll random events for a given stage transition
 */
export function rollRandomEvents(
  conditionId: ConditionId,
  stageIndex: number,
  isPrivileged: boolean
): RandomEvent[] {
  // Max 1 event per transition, weighted by stage (more events later in life)
  const stageProbabilityBonus = stageIndex * 0.03;
  const eligible = RANDOM_EVENTS.filter(e =>
    e.affectsConditions === 'all' || e.affectsConditions.includes(conditionId)
  );

  const triggered: RandomEvent[] = [];
  for (const event of eligible) {
    if (Math.random() < (event.probability + stageProbabilityBonus) * 0.5) {
      triggered.push(event);
      break; // max 1 event
    }
  }
  return triggered;
}

export function getEventEffects(event: RandomEvent, isPrivileged: boolean): ChoiceEffect {
  return (isPrivileged && event.privilegedEffects) ? event.privilegedEffects : event.effects;
}

export interface TrajectoryPoint {
  age: number;
  label: string;
  netWorth: number;
  stress: number;
  socialCapital: number;
  security: number;
  health: number;
  education: number;
  careerTier: number;
  creditScore: number;
}

export function simulateOutcome(
  conditionId: ConditionId,
  choiceIds: string[]
): GameStats {
  const trajectory = simulateTrajectory(conditionId, choiceIds);
  const last = trajectory[trajectory.length - 1];
  return {
    netWorth: last.netWorth,
    stress: last.stress,
    socialCapital: last.socialCapital,
    security: last.security,
    health: last.health,
    education: last.education,
    careerTier: last.careerTier,
    creditScore: last.creditScore,
  };
}

export function simulateTrajectory(
  conditionId: ConditionId,
  choiceIds: string[]
): TrajectoryPoint[] {
  const condition = CONDITIONS.find(c => c.id === conditionId)!;
  let current: GameStats = { ...condition.startingStats };

  const points: TrajectoryPoint[] = [
    { age: 0, label: 'Birth', ...current },
  ];

  choiceIds.forEach((choiceId, idx) => {
    const stage = LIFE_STAGES[idx];
    if (!stage) return;

    // Compound between stages
    const prevAge = idx === 0 ? 0 : LIFE_STAGES[idx - 1].age;
    const yearsBetween = stage.age - prevAge;
    if (yearsBetween > 0) {
      current = compoundBetweenStages(current, yearsBetween, condition.isPrivileged);
    }

    let choice = stage.choices.find(c => c.id === choiceId);
    if (!choice || (choice.availableTo !== 'all' && !choice.availableTo.includes(conditionId))) {
      const available = getAvailableChoices(stage, conditionId, current);
      choice = available[available.length - 1];
    }
    if (!choice) return;

    current = applyEffects(current, choice.effects);
    points.push({ age: stage.age, label: stage.title, ...current });
  });

  return points;
}
