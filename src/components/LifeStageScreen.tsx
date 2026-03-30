import { type LifeStage, type Choice, type ConditionId } from '@/data/gameData';

interface LifeStageScreenProps {
  stage: LifeStage;
  choices: Choice[];
  conditionId: ConditionId;
  isPrivileged: boolean;
  stageIndex: number;
  onChoice: (choiceId: string) => void;
}

export default function LifeStageScreen({ stage, choices, conditionId, isPrivileged, stageIndex, onChoice }: LifeStageScreenProps) {
  const scenario = (!isPrivileged && stage.constrainedScenario) ? stage.constrainedScenario : stage.scenario;

  // Constrained design gets progressively tighter
  const tightnessScale = isPrivileged ? 1 : Math.max(0.88, 1 - stageIndex * 0.025);
  const spacingClass = isPrivileged ? 'p-6 md:p-8' : 'p-4 md:p-6';

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
            width: `${((stageIndex + 1) / 5) * 100}%`,
            backgroundColor: isPrivileged ? 'hsl(43, 56%, 54%)' : 'hsl(35, 20%, 40%)',
          }}
        />
      </div>

      <div className={`flex-1 flex flex-col items-center justify-center ${spacingClass} max-w-2xl mx-auto w-full`}>
        {/* Stage header */}
        <div className="text-center mb-8 md:mb-12 animate-fade-up">
          <p className="font-body text-[10px] uppercase tracking-[0.3em] mb-2"
             style={{ color: isPrivileged ? 'hsl(43, 56%, 54%)' : 'hsl(35, 20%, 40%)' }}>
            Age {stage.age} · {stage.title}
          </p>
          <p className="font-heading text-xl md:text-2xl leading-relaxed max-w-lg mx-auto"
             style={{ color: isPrivileged ? 'hsl(30, 10%, 20%)' : 'hsl(0, 0%, 70%)' }}>
            {scenario}
          </p>
        </div>

        {/* Choices */}
        <div className="w-full space-y-3 animate-fade-up-delay">
          {choices.map((choice, i) => (
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

        {/* Subtle note about unavailable options */}
        {!isPrivileged && (
          <p className="mt-6 font-body text-xs italic text-center animate-fade-up-delay-2"
             style={{ color: 'hsl(0, 0%, 35%)' }}>
            {5 - choices.length > 0
              ? `${5 - choices.length} option${5 - choices.length > 1 ? 's' : ''} unavailable to you.`
              : ''}
          </p>
        )}
      </div>
    </div>
  );
}
