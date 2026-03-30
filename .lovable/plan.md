

# Making "Inheritance" a Full Simulator

## What's Limited Now
- Only 5 life stages with 3-5 static choices each — feels like a quiz, not a simulation
- No dynamic events, no compounding mechanics, no branching
- Stats are simple additive numbers with no real economic modeling
- Game takes ~2 minutes to complete

## Plan: Expand Into a Real Life Simulator

### 1. Expand to 10 Life Stages (Ages 14–65)
Add 5 new stages between and beyond the existing ones, covering the full arc of economic life:

| # | Age | Title | Theme |
|---|-----|-------|-------|
| 1 | 14 | Childhood | After-school job vs. extracurriculars vs. nothing available |
| 2 | 18 | Education | (existing, expanded) |
| 3 | 22 | First Job | Entry into workforce |
| 4 | 26 | Relationships | Marriage/partner, children, solo — each has financial weight |
| 5 | 30 | Housing | (existing, expanded) |
| 6 | 34 | Career Pivot | Promotion, burnout, layoff, entrepreneurship |
| 7 | 38 | Crisis | (existing, expanded) |
| 8 | 42 | Children's Future | Pay for their education? Pass down debt? |
| 9 | 50 | Wealth Building | (existing, expanded) |
| 10 | 60 | Retirement | Can you retire? Work until you drop? |

Each stage gets 5-6 choices with condition-gating.

### 2. Random Life Events System
Between stages, inject **random events** that vary by condition — things you don't choose:
- Recession hits (net worth drops %, privileged lose less)
- Medical emergency (uninsured pay 10x more)
- Inheritance windfall (only for privileged conditions)
- Rent hike / eviction notice
- Job automation / layoff
- Unexpected pregnancy
- Car breakdown

These appear as interstitial screens: "Life happened." — with a stat impact you can't avoid. Adds unpredictability and realism.

### 3. Economic Engine — Compound Math
Replace simple additive stats with actual financial modeling:
- **Compound interest** on savings (7% annual between stages)
- **Compound debt** on loans (18-22% APR)
- **Inflation** erodes purchasing power each stage
- **Credit score** mechanic — affects loan rates and housing options
- **Tax bracket** effects on income choices
- Net worth compounds or decays between stages, not just at choice time

### 4. New Stats: Health + Education + Career Level
Expand from 4 stats to 7:
- **Net Worth** (existing)
- **Stress** (existing)
- **Social Capital** (existing)
- **Security** (existing)
- **Health** — degrades with stress, affects future options and costs
- **Education Level** — unlocks career tiers
- **Career Tier** — determines income multipliers

### 5. Condition-Specific Narrative Events
Each condition gets unique flavor text and micro-events:
- Trust Fund: "Your family's accountant suggests a tax shelter"
- Immigrant: "Your degree isn't recognized here. Start over?"
- Inherited Debt: "A collector calls about your parents' medical bills"

### 6. Enhanced Life Ledger
- Show a running historical log of every choice and event
- Mini sparkline chart of net worth trend
- Visual indicators for stat changes (arrows, color flashes)
- Show compound interest/debt accumulating in real-time between stages

### 7. Transition Screens Between Stages
Instead of jumping from age 18 to 30, show a brief "time passing" interstitial:
- "6 years pass..." with a counter animation
- Show compound effects accruing
- Show any random event that occurs

### 8. Richer Reveal Screen
- Compare across ALL 6 conditions, not just one opposite
- Show a full timeline with events marked
- "What if" sliders — adjust starting net worth and see outcomes change
- National statistics overlaid on your trajectory

## Technical Approach

### Files Modified
- **`gameData.ts`** — Major expansion: 10 stages, random events system, compound math engine, new stat types
- **`useGameState.ts`** — Add random event phase, compound calculations between stages, expanded stats, history log
- **`LifeStageScreen.tsx`** — Support new stats, richer choice cards showing projected impact
- **`LifeLedger.tsx`** — Historical log, sparklines, 7 stats
- **`Index.tsx`** — New phases: random event interstitials, transition screens
- **New: `RandomEventScreen.tsx`** — Interstitial for life events
- **New: `TransitionScreen.tsx`** — "Time passes" animation between stages
- **`RevealScreen.tsx`** — Multi-condition comparison, enhanced charts

### Data Size
Game data will grow significantly (~800 lines for 10 stages + events). Each stage has 5-6 gated choices. ~15 random events with condition-specific variants.

