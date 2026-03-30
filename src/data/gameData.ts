export type ConditionId = 
  | 'trust_fund' 
  | 'middle_class' 
  | 'working_poor' 
  | 'immigrant' 
  | 'single_parent' 
  | 'inherited_debt';

export interface StartingCondition {
  id: ConditionId;
  label: string;
  subtitle: string;
  description: string;
  startingNetWorth: number;
  startingStress: number;
  startingSocialCapital: number;
  startingSecurity: number;
  isPrivileged: boolean;
}

export interface Choice {
  id: string;
  label: string;
  description: string;
  availableTo: ConditionId[] | 'all';
  effects: {
    netWorth: number;
    stress: number;
    socialCapital: number;
    security: number;
  };
}

export interface LifeStage {
  id: number;
  age: number;
  title: string;
  scenario: string;
  constrainedScenario?: string; // alternative framing for constrained conditions
  choices: Choice[];
}

export const CONDITIONS: StartingCondition[] = [
  {
    id: 'trust_fund',
    label: 'TRUST FUND',
    subtitle: 'Born on third base',
    description: 'Inherited wealth. Private school. Family connections in every industry. A safety net made of silk.',
    startingNetWorth: 500000,
    startingStress: 10,
    startingSocialCapital: 90,
    startingSecurity: 95,
    isPrivileged: true,
  },
  {
    id: 'middle_class',
    label: 'MIDDLE CLASS',
    subtitle: 'The shrinking center',
    description: 'Stable home. State school. Parents who can help — but not too much. One bad year away from trouble.',
    startingNetWorth: 25000,
    startingStress: 30,
    startingSocialCapital: 50,
    startingSecurity: 65,
    isPrivileged: true,
  },
  {
    id: 'working_poor',
    label: 'WORKING POOR',
    subtitle: 'Full-time and falling behind',
    description: 'Unstable housing. Underfunded school. Parents working two jobs each. No safety net. No margin for error.',
    startingNetWorth: 800,
    startingStress: 65,
    startingSocialCapital: 20,
    startingSecurity: 20,
    isPrivileged: false,
  },
  {
    id: 'immigrant',
    label: 'FIRST-GEN IMMIGRANT',
    subtitle: 'Starting over from zero',
    description: 'Foreign credentials unrecognized. Language barrier. Strong family network — but in another country.',
    startingNetWorth: 2000,
    startingStress: 55,
    startingSocialCapital: 15,
    startingSecurity: 25,
    isPrivileged: false,
  },
  {
    id: 'single_parent',
    label: 'SINGLE-PARENT HOME',
    subtitle: 'One income, no backup',
    description: 'One parent doing everything. Childcare costs eating the budget. Schedule dictated by someone else\'s needs.',
    startingNetWorth: 5000,
    startingStress: 60,
    startingSocialCapital: 25,
    startingSecurity: 30,
    isPrivileged: false,
  },
  {
    id: 'inherited_debt',
    label: 'INHERITED DEBT',
    subtitle: 'Born owing',
    description: 'Family medical debt. Predatory loans already in place. You start life in the negative — and the interest is compounding.',
    startingNetWorth: -45000,
    startingStress: 75,
    startingSocialCapital: 15,
    startingSecurity: 15,
    isPrivileged: false,
  },
];

export const LIFE_STAGES: LifeStage[] = [
  {
    id: 1,
    age: 18,
    title: 'Education',
    scenario: 'You\'re 18. The world tells you education is the great equalizer. What do you do?',
    constrainedScenario: 'You\'re 18. Everyone says "just go to college." They don\'t mention the cost.',
    choices: [
      {
        id: '1a',
        label: 'Elite university, no debt',
        description: 'Family covers tuition. Legacy admission. The network alone is worth millions.',
        availableTo: ['trust_fund'],
        effects: { netWorth: -5000, stress: -5, socialCapital: 30, security: 10 },
      },
      {
        id: '1b',
        label: 'Four-year state university',
        description: 'Solid education. Some loans. Part-time job to cover living costs.',
        availableTo: ['trust_fund', 'middle_class'],
        effects: { netWorth: -40000, stress: 15, socialCapital: 15, security: 10 },
      },
      {
        id: '1c',
        label: 'Community college, then transfer',
        description: 'Cheaper path. Takes longer. Fewer connections. Same degree — different doors.',
        availableTo: 'all',
        effects: { netWorth: -12000, stress: 10, socialCapital: 5, security: 5 },
      },
      {
        id: '1d',
        label: 'Skip college, work full-time',
        description: 'Start earning now. No debt. But the ceiling is lower and the floor is harder.',
        availableTo: 'all',
        effects: { netWorth: 15000, stress: 5, socialCapital: -5, security: -5 },
      },
      {
        id: '1e',
        label: 'Vocational training',
        description: 'Learn a trade. Shorter timeline. Immediate employability. Physical toll.',
        availableTo: ['working_poor', 'immigrant', 'single_parent', 'inherited_debt', 'middle_class'],
        effects: { netWorth: -5000, stress: 5, socialCapital: 5, security: 10 },
      },
    ],
  },
  {
    id: 2,
    age: 24,
    title: 'Career',
    scenario: 'You\'re 24. Time to build a life. The job market doesn\'t care about your dreams.',
    constrainedScenario: 'You\'re 24. You need income now. Dreams are a luxury you can\'t afford.',
    choices: [
      {
        id: '2a',
        label: 'Join family business / use connections',
        description: 'Skip the line. Start mid-career. The interview was a formality.',
        availableTo: ['trust_fund'],
        effects: { netWorth: 60000, stress: -10, socialCapital: 20, security: 20 },
      },
      {
        id: '2b',
        label: 'Corporate entry-level position',
        description: 'Structured path. Benefits. Slow climb. Office politics.',
        availableTo: ['trust_fund', 'middle_class', 'immigrant'],
        effects: { netWorth: 35000, stress: 10, socialCapital: 10, security: 15 },
      },
      {
        id: '2c',
        label: 'Gig economy / multiple part-time jobs',
        description: 'Flexible hours. No benefits. No sick days. Every month is a negotiation.',
        availableTo: 'all',
        effects: { netWorth: 18000, stress: 20, socialCapital: -5, security: -10 },
      },
      {
        id: '2d',
        label: 'Start a small business',
        description: 'Risk everything on yourself. It might work. It probably won\'t — statistically.',
        availableTo: ['trust_fund', 'middle_class', 'immigrant'],
        effects: { netWorth: -10000, stress: 25, socialCapital: 15, security: -15 },
      },
      {
        id: '2e',
        label: 'Take whatever\'s available',
        description: 'Minimum wage. No choice, really. The bills don\'t wait.',
        availableTo: ['working_poor', 'single_parent', 'inherited_debt'],
        effects: { netWorth: 12000, stress: 15, socialCapital: -5, security: 0 },
      },
    ],
  },
  {
    id: 3,
    age: 30,
    title: 'Housing',
    scenario: 'You\'re 30. Everyone asks if you own a home yet. As if it were a choice.',
    constrainedScenario: 'You\'re 30. Rent just went up again. Where do you live?',
    choices: [
      {
        id: '3a',
        label: 'Buy a home (family helps with down payment)',
        description: 'The bank of Mom and Dad. Property value climbs 4% a year. Wealth builds while you sleep.',
        availableTo: ['trust_fund', 'middle_class'],
        effects: { netWorth: 50000, stress: -10, socialCapital: 5, security: 25 },
      },
      {
        id: '3b',
        label: 'Buy a home (stretch to afford it)',
        description: '40% of income to mortgage. One missed payment from foreclosure. But it\'s yours.',
        availableTo: ['middle_class', 'immigrant'],
        effects: { netWorth: 20000, stress: 20, socialCapital: 0, security: 10 },
      },
      {
        id: '3c',
        label: 'Rent in a decent neighborhood',
        description: 'No equity building. But stable. Good schools nearby. Safe streets.',
        availableTo: 'all',
        effects: { netWorth: -15000, stress: 5, socialCapital: 5, security: 5 },
      },
      {
        id: '3d',
        label: 'Rent where you can afford',
        description: 'Longer commute. Worse schools. Noise at night. But the rent gets paid.',
        availableTo: ['working_poor', 'single_parent', 'inherited_debt', 'immigrant'],
        effects: { netWorth: -5000, stress: 15, socialCapital: -10, security: -10 },
      },
      {
        id: '3e',
        label: 'Move in with family / roommates',
        description: 'Save money. Lose privacy. No space that\'s truly yours.',
        availableTo: 'all',
        effects: { netWorth: 5000, stress: 10, socialCapital: -5, security: -5 },
      },
    ],
  },
  {
    id: 4,
    age: 38,
    title: 'Crisis',
    scenario: 'You\'re 38. A financial emergency hits. Medical bill. Car breaks down. Job loss. Everyone faces this eventually.',
    constrainedScenario: 'You\'re 38. The emergency you\'ve been dreading finally arrives. There\'s no savings to absorb it.',
    choices: [
      {
        id: '4a',
        label: 'Pay from savings / emergency fund',
        description: 'The money was there. That\'s what it was for. Life continues.',
        availableTo: ['trust_fund', 'middle_class'],
        effects: { netWorth: -15000, stress: 5, socialCapital: 0, security: 0 },
      },
      {
        id: '4b',
        label: 'Family bails you out',
        description: 'One phone call. The check arrives. You feel guilty but grateful.',
        availableTo: ['trust_fund'],
        effects: { netWorth: 0, stress: -5, socialCapital: -5, security: 5 },
      },
      {
        id: '4c',
        label: 'Take on debt (credit cards / personal loan)',
        description: '22% interest. The emergency costs $5,000. You\'ll pay back $12,000.',
        availableTo: 'all',
        effects: { netWorth: -20000, stress: 25, socialCapital: -5, security: -15 },
      },
      {
        id: '4d',
        label: 'Go without / delay treatment',
        description: 'Can\'t afford it. Hope it gets better on its own. It usually doesn\'t.',
        availableTo: ['working_poor', 'single_parent', 'inherited_debt'],
        effects: { netWorth: 0, stress: 30, socialCapital: -10, security: -25 },
      },
      {
        id: '4e',
        label: 'GoFundMe / community support',
        description: 'Ask for help publicly. Some people give. Some people judge. You survive.',
        availableTo: ['working_poor', 'immigrant', 'single_parent', 'inherited_debt'],
        effects: { netWorth: -5000, stress: 15, socialCapital: 5, security: -5 },
      },
    ],
  },
  {
    id: 5,
    age: 45,
    title: 'Opportunity',
    scenario: 'You\'re 45. A wealth-building opportunity appears. But opportunity isn\'t equally distributed.',
    constrainedScenario: 'You\'re 45. They say this is when wealth is built. But you need money to make money.',
    choices: [
      {
        id: '5a',
        label: 'Invest in real estate / stocks',
        description: 'Money makes money. 7% annual returns compound. In 20 years, it doubles twice.',
        availableTo: ['trust_fund', 'middle_class'],
        effects: { netWorth: 120000, stress: -5, socialCapital: 10, security: 20 },
      },
      {
        id: '5b',
        label: 'Max out retirement contributions',
        description: 'Tax-advantaged savings. Employer match. Slow and steady. But you need income to spare.',
        availableTo: ['trust_fund', 'middle_class'],
        effects: { netWorth: 60000, stress: 0, socialCapital: 0, security: 15 },
      },
      {
        id: '5c',
        label: 'Try to start saving — finally',
        description: 'Put $50 a month away. It\'s not nothing. But compound interest needs time — and you\'re starting late.',
        availableTo: 'all',
        effects: { netWorth: 8000, stress: 5, socialCapital: 0, security: 5 },
      },
      {
        id: '5d',
        label: 'No savings possible — surviving, not building',
        description: 'Every dollar is spoken for. Retirement is a word other people use.',
        availableTo: ['working_poor', 'single_parent', 'inherited_debt'],
        effects: { netWorth: -5000, stress: 20, socialCapital: -5, security: -10 },
      },
      {
        id: '5e',
        label: 'Pool resources with community / family',
        description: 'Collective wealth-building. Slower, but nobody falls alone.',
        availableTo: ['immigrant', 'working_poor', 'single_parent'],
        effects: { netWorth: 15000, stress: 0, socialCapital: 15, security: 10 },
      },
    ],
  },
];

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
    body: 'The top 10% of Americans own 70% of all wealth. The bottom 50% own 2.5%. Gender compounds this: women earn 82 cents for every dollar men earn, and the gap is worse for women of color.',
  },
  {
    title: 'Social Mobility',
    body: 'In the US, 50% of a child\'s income is determined by their parents\' income. In Denmark, it\'s 15%. Mobility isn\'t about effort — it\'s about infrastructure: healthcare, education, housing policy.',
  },
];

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

export function getAvailableChoices(stage: LifeStage, conditionId: ConditionId): Choice[] {
  return stage.choices.filter(
    c => c.availableTo === 'all' || c.availableTo.includes(conditionId)
  );
}

export function simulateOutcome(
  conditionId: ConditionId,
  choiceIds: string[]
): { netWorth: number; stress: number; socialCapital: number; security: number } {
  const condition = CONDITIONS.find(c => c.id === conditionId)!;
  let result = {
    netWorth: condition.startingNetWorth,
    stress: condition.startingStress,
    socialCapital: condition.startingSocialCapital,
    security: condition.startingSecurity,
  };

  choiceIds.forEach((choiceId, idx) => {
    const stage = LIFE_STAGES[idx];
    if (!stage) return;
    
    // Find the choice — if the choice isn't available to this condition, pick the closest available one
    let choice = stage.choices.find(c => c.id === choiceId);
    if (!choice || (choice.availableTo !== 'all' && !choice.availableTo.includes(conditionId))) {
      // Pick the last available choice (usually the most constrained option)
      const available = getAvailableChoices(stage, conditionId);
      choice = available[available.length - 1];
    }
    if (!choice) return;

    result.netWorth += choice.effects.netWorth;
    result.stress = Math.max(0, Math.min(100, result.stress + choice.effects.stress));
    result.socialCapital = Math.max(0, Math.min(100, result.socialCapital + choice.effects.socialCapital));
    result.security = Math.max(0, Math.min(100, result.security + choice.effects.security));
  });

  return result;
}
