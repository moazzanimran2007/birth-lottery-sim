import { type LifeStage, type Choice, type ConditionId, type GameStats } from '@/data/gameData';

interface LifeStageScreenProps {
  stage: LifeStage;
  choices: Choice[];
  conditionId: ConditionId;
  isPrivileged: boolean;
  stageIndex: number;
  totalStages: number;
  stats: GameStats;
  onChoice: (choiceId: string) => void;
}

const EDUCATION_LABELS = ['None', 'High School', 'Vocational', 'Associate', 'Bachelor\'s', 'Graduate'];
const CAREER_LABELS = ['Unemployed', 'Entry Level', 'Service', 'Skilled', 'Professional', 'Executive'];

export default function LifeStageScreen({ stage, choices, conditionId, isPrivileged, stageIndex, totalStages, stats, onChoice }: LifeStageScreenProps) {
  const scenario = (!isPrivileged && stage.constrainedScenario) ? stage.constrainedScenario : stage.scenario;
  const tightnessScale = isPrivileged ? 1 : Math.max(0.88, 1 - stageIndex * 0.015);
  const spacingClass = isPrivileged ? 'p-6 md:p-8' : 'p-4 md:p-6';
  const totalChoicesInStage = stage.choices.length;
  const unavailableCount = totalChoicesInStage - choices.length;

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-700"
      style={{
        backgroundColor: isPrivileged ? 'hsl(45, 33%, 97%)' : 'hsl(0, 0%, 10%)',
        fontSize: `${tightnessScale}rem`,
      }}
    >
      {/* Progress */}
      <div className="w-full h-1 bg-border">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${((stageIndex + 1) / totalStages) * 100}%`,
            backgroundColor: isPrivileged ? 'hsl(43, 56%, 54%)' : 'hsl(35, 20%, 40%)',
          }}
        />
      </div>

      <div className={`flex-1 flex flex-col items-center justify-center ${spacingClass} max-w-2xl mx-auto w-full`}>
        {/* Stage header */}
        <div className="text-center mb-6 md:mb-10 animate-fade-up">
          <p className="font-body text-[10px] uppercase tracking-[0.3em] mb-2"
             style={{ color: isPrivileged ? 'hsl(43, 56%, 54%)' : 'hsl(35, 20%, 40%)' }}>
            Age {stage.age} · {stage.title} · Stage {stageIndex + 1}/{totalStages}
          </p>
          <p className="font-heading text-xl md:text-2xl leading-relaxed max-w-lg mx-auto"
             style={{ color: isPrivileged ? 'hsl(30, 10%, 20%)' : 'hsl(0, 0%, 70%)' }}>
            {scenario}
          </p>
        </div>

        {/* Quick stats bar */}
        <div className="w-full flex flex-wrap justify-center gap-3 md:gap-5 mb-6 animate-fade-up">
          {[
            { label: 'Worth', value: formatMoney(stats.netWorth), color: stats.netWorth >= 0 ? undefined : 'hsl(0, 72%, 51%)' },
            { label: 'Health', value: `${Math.round(stats.health)}` },
            { label: 'Credit', value: `${Math.round(stats.creditScore)}` },
            { label: 'Career', value: CAREER_LABELS[Math.min(5, Math.max(0, Math.round(stats.careerTier)))] },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="font-body text-[8px] uppercase tracking-[0.15em]"
                 style={{ color: isPrivileged ? 'hsl(30, 8%, 55%)' : 'hsl(0, 0%, 40%)' }}>
                {s.label}
              </p>
              <p className="font-heading text-sm"
                 style={{ color: s.color || (isPrivileged ? 'hsl(30, 10%, 20%)' : 'hsl(0, 0%, 70%)') }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Choices */}
        <div className="w-full space-y-3 animate-fade-up-delay">
          {choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => onChoice(choice.id)}
              className="w-full text-left border rounded-sm transition-all duration-300 group"
              style={{
                padding: isPrivileged ? '1.25rem 1.5rem' : '1rem 1.25rem',
                borderColor: isPrivileged ? 'hsl(43, 30%, 88%)' : 'hsl(0, 0%, 20%)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = isPrivileged
                  ? 'hsl(43, 56%, 54%)'
                  : 'hsl(35, 20%, 50%)';
                (e.currentTarget as HTMLElement).style.backgroundColor = isPrivileged
                  ? 'hsl(43, 30%, 94%)'
                  : 'hsl(0, 0%, 14%)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = isPrivileged
                  ? 'hsl(43, 30%, 88%)'
                  : 'hsl(0, 0%, 20%)';
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              <p className="font-heading text-base mb-1"
                 style={{ color: isPrivileged ? 'hsl(30, 10%, 20%)' : 'hsl(0, 0%, 70%)' }}>
                {choice.label}
              </p>
              <p className="font-body text-sm leading-relaxed"
                 style={{ color: isPrivileged ? 'hsl(30, 8%, 50%)' : 'hsl(0, 0%, 45%)' }}>
                {choice.description}
              </p>
            </button>
          ))}
        </div>

        {/* Unavailable options note */}
        {!isPrivileged && unavailableCount > 0 && (
          <p className="mt-6 font-body text-xs italic text-center animate-fade-up-delay-2"
             style={{ color: 'hsl(0, 0%, 35%)' }}>
            {unavailableCount} option{unavailableCount > 1 ? 's' : ''} unavailable to you.
          </p>
        )}
      </div>
    </div>
  );
}

function formatMoney(n: number): string {
  if (Math.abs(n) >= 1000000) {
    const m = n / 1000000;
    return `${n < 0 ? '-' : ''}$${Math.abs(m).toFixed(1)}M`;
  }
  if (n < 0) return `-$${Math.abs(n).toLocaleString()}`;
  return `$${n.toLocaleString()}`;
}
