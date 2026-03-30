import { CONDITIONS, CONCEPTS, type ConditionId, type StartingCondition, type TrajectoryPoint } from '@/data/gameData';
import type { GameStats } from '@/hooks/useGameState';
import WealthTrajectoryChart from './WealthTrajectoryChart';
import FinancialLiteracySection from './FinancialLiteracySection';

interface RevealScreenProps {
  condition: StartingCondition;
  stats: GameStats;
  oppositeCondition: StartingCondition | null;
  oppositeOutcome: GameStats | null;
  yourTrajectory: TrajectoryPoint[];
  oppositeTrajectory: TrajectoryPoint[];
  onReplayAs: (conditionId: ConditionId) => void;
  onRestart: () => void;
}

export default function RevealScreen({
  condition,
  stats,
  oppositeCondition,
  oppositeOutcome,
  yourTrajectory,
  oppositeTrajectory,
  onReplayAs,
  onRestart,
}: RevealScreenProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(0, 0%, 6%)' }}>
      {/* THE REVEAL — Side by side */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 md:px-8 py-16">
        <p className="font-body text-xs uppercase tracking-[0.3em] mb-12"
           style={{ color: 'hsl(0, 0%, 40%)' }}>
          The same choices. Different starting lines.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-4xl w-full">
          {/* Your outcome */}
          <div
            className="p-8 md:p-12 animate-slide-left"
            style={{
              backgroundColor: condition.isPrivileged ? 'hsl(45, 33%, 97%)' : 'hsl(0, 0%, 10%)',
            }}
          >
            <p className="font-body text-[9px] uppercase tracking-[0.3em] mb-2"
               style={{ color: condition.isPrivileged ? 'hsl(43, 56%, 54%)' : 'hsl(35, 20%, 40%)' }}>
              You — {condition.label}
            </p>
            <StatBlock stats={stats} isPrivileged={condition.isPrivileged} />
          </div>

          {/* Opposite outcome */}
          {oppositeCondition && oppositeOutcome && (
            <div
              className="p-8 md:p-12 animate-slide-right"
              style={{
                backgroundColor: oppositeCondition.isPrivileged ? 'hsl(45, 33%, 97%)' : 'hsl(0, 0%, 10%)',
              }}
            >
              <p className="font-body text-[9px] uppercase tracking-[0.3em] mb-2"
                 style={{ color: oppositeCondition.isPrivileged ? 'hsl(43, 56%, 54%)' : 'hsl(35, 20%, 40%)' }}>
                Same choices — {oppositeCondition.label}
              </p>
              <StatBlock stats={oppositeOutcome} isPrivileged={oppositeCondition.isPrivileged} />
            </div>
          )}
        </div>

        {/* Wealth gap callout */}
        {oppositeOutcome && (
          <div className="mt-12 text-center max-w-lg animate-fade-up-delay">
            <p className="font-heading text-xl md:text-2xl italic"
               style={{ color: 'hsl(0, 0%, 60%)' }}>
              {Math.abs(stats.netWorth - oppositeOutcome.netWorth) > 0 && (
                <>
                  Wealth gap: <span style={{ color: 'hsl(43, 56%, 54%)' }}>
                    ${Math.abs(stats.netWorth - oppositeOutcome.netWorth).toLocaleString()}
                  </span>
                </>
              )}
            </p>
            <p className="font-body text-sm mt-2" style={{ color: 'hsl(0, 0%, 40%)' }}>
              Same effort. Same decisions. Different lives.
            </p>
          </div>
        )}

        {/* Wealth Trajectory Chart */}
        {oppositeCondition && oppositeTrajectory.length > 0 && (
          <div className="mt-16 w-full max-w-3xl animate-fade-up-delay-2">
            <WealthTrajectoryChart
              yourTrajectory={yourTrajectory}
              oppositeTrajectory={oppositeTrajectory}
              yourLabel={condition.label}
              oppositeLabel={oppositeCondition.label}
              yourIsPrivileged={condition.isPrivileged}
            />
          </div>
        )}
      </section>

      {/* CONCEPTS */}
      <section className="px-4 md:px-8 py-16 max-w-3xl mx-auto">
        <h2 className="font-heading text-2xl md:text-3xl mb-12 text-center"
            style={{ color: 'hsl(0, 0%, 70%)' }}>
          What just happened?
        </h2>

        <div className="space-y-10">
          {CONCEPTS.map(concept => (
            <div key={concept.title} className="border-l-2 pl-6"
                 style={{ borderColor: 'hsl(43, 56%, 54%, 0.3)' }}>
              <h3 className="font-heading text-lg mb-2" style={{ color: 'hsl(0, 0%, 75%)' }}>
                {concept.title}
              </h3>
              <p className="font-body text-sm leading-relaxed" style={{ color: 'hsl(0, 0%, 50%)' }}>
                {concept.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Financial Literacy Resources */}
      <FinancialLiteracySection />

      {/* REPLAY */}
      <section className="px-4 md:px-8 py-16 max-w-2xl mx-auto text-center">
        <h2 className="font-heading text-xl mb-2" style={{ color: 'hsl(0, 0%, 70%)' }}>
          Replay as someone else
        </h2>
        <p className="font-body text-sm mb-8" style={{ color: 'hsl(0, 0%, 45%)' }}>
          Your decisions stay the same. Only the starting condition changes.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CONDITIONS.filter(c => c.id !== condition.id).map(c => (
            <button
              key={c.id}
              onClick={() => onReplayAs(c.id)}
              className="text-left p-4 border rounded-sm transition-all duration-300 hover:border-opacity-100"
              style={{
                borderColor: 'hsl(0, 0%, 20%)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'hsl(43, 56%, 54%)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'hsl(0, 0%, 20%)';
              }}
            >
              <p className="font-heading text-xs mb-1" style={{ color: 'hsl(0, 0%, 70%)' }}>
                {c.label}
              </p>
              <p className="font-body text-[10px]" style={{ color: 'hsl(0, 0%, 40%)' }}>
                {c.subtitle}
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={onRestart}
          className="mt-12 font-body text-xs uppercase tracking-[0.2em] px-6 py-3 border transition-all duration-300 hover:tracking-[0.3em]"
          style={{
            color: 'hsl(0, 0%, 50%)',
            borderColor: 'hsl(0, 0%, 25%)',
            backgroundColor: 'transparent',
          }}
        >
          Start over
        </button>
      </section>
    </div>
  );
}

function StatBlock({ stats, isPrivileged }: { stats: GameStats; isPrivileged: boolean }) {
  const textColor = isPrivileged ? 'hsl(30, 10%, 20%)' : 'hsl(0, 0%, 70%)';
  const labelColor = isPrivileged ? 'hsl(30, 8%, 55%)' : 'hsl(0, 0%, 40%)';

  const items = [
    { label: 'Net Worth', value: formatMoney(stats.netWorth), highlight: true },
    { label: 'Stress', value: `${stats.stress}/100` },
    { label: 'Social Capital', value: `${stats.socialCapital}/100` },
    { label: 'Security', value: `${stats.security}/100` },
  ];

  return (
    <div className="space-y-4">
      {items.map(item => (
        <div key={item.label}>
          <p className="font-body text-[9px] uppercase tracking-[0.15em]" style={{ color: labelColor }}>
            {item.label}
          </p>
          <p className={`font-heading ${item.highlight ? 'text-2xl' : 'text-lg'}`}
             style={{
               color: item.label === 'Net Worth' && stats.netWorth < 0
                 ? 'hsl(0, 72%, 51%)'
                 : textColor,
             }}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function formatMoney(n: number): string {
  if (n < 0) return `-$${Math.abs(n).toLocaleString()}`;
  return `$${n.toLocaleString()}`;
}
