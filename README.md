# Inheritance: a generational wealth simulator

An interactive life simulator that shows how much the circumstances you're born into shape your financial life, by letting you live one life and then comparing it with the opposite one.

## What it does

- **Assigns you a starting life at random.** One of six: trust fund, middle class, working poor, recent immigrant, single-parent household, or born into inherited debt. Each starts with different net worth, stress, social capital, security, health, education, career level and credit score.
- **Walks you through ten life stages, from age 14 to 60.** Childhood, education, first job, relationships, housing, a career pivot, a crisis, your children's future, wealth building and retirement. Some choices are only open to certain backgrounds or need a minimum education or career level.
- **Throws random events at you.** Twelve possible events, such as a recession, a medical emergency, an inheritance or a rent hike, some of which hit privileged and less privileged lives differently.
- **Compounds between stages.** Interest, debt and income keep working on your position in the years between choices.
- **Reveals the other life.** At the end it replays your exact choices from the opposite starting point and shows both outcomes side by side, with a net worth chart over time.
- **Teaches the ideas behind it.** A short section explains compound advantage, intergenerational wealth transfer, opportunity cost, the wealth gap, social mobility, credit scores and the link between health and wealth.
- **Lets you share the result** as a card, or replay as someone else.

All numbers come from the game's own built-in rules and starting values in `src/data/gameData.ts`. They are illustrative, not drawn from a dataset.

## Run it

You need Node.js 18 or newer.

```bash
git clone https://github.com/moazzanimran2007/birth-lottery-sim.git
cd birth-lottery-sim
npm install
npm run dev
```

Then open the local address Vite prints. `npm run build` makes a production build.

## Tech stack

React and TypeScript on Vite, Tailwind CSS with shadcn/ui components, and Recharts for the wealth chart. Built with Lovable. The whole game runs in the browser with no backend.

## Where things live

| Path | What it holds |
| :--- | :--- |
| `src/data/gameData.ts` | Starting conditions, life stages, choices, random events, the compounding rules and the simulation |
| `src/hooks/useGameState.ts` | Game state: current stage, choices made, history and the opposite-life comparison |
| `src/components/` | Each screen: opening, life stage, random event, transition, reveal, chart and share card |
