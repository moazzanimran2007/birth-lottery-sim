import { type RandomEvent, type GameStats, getEventEffects } from '@/data/gameData';

interface RandomEventScreenProps {
  event: RandomEvent;
  isPrivileged: boolean;
  currentStats: GameStats;
  onAcknowledge: () => void;
}

export default function RandomEventScreen({ event, isPrivileged, currentStats, onAcknowledge }: RandomEventScreenProps) {
  const effects = getEventEffects(event, isPrivileged);

  const statChanges = Object.entries(effects)
    .filter(([key, val]) => val !== 0 && val !== undefined && key !== 'incomePerYear' && key !== 'debtRate')
    .map(([key, val]) => ({
      label: formatStatLabel(key),
      value: val as number,
      formatted: formatChange(key, val as number),
    }));

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 transition-colors duration-700"
      style={{
        backgroundColor: isPrivileged ? 'hsl(45, 33%, 97%)' : 'hsl(0, 0%, 10%)',
      }}
    >
      <div className="max-w-lg text-center">
        <p className="font-body text-xs uppercase tracking-[0.3em] mb-6 animate-fade-up"
           style={{ color: 'hsl(0, 60%, 50%)' }}>
          Life happened.
        </p>

        <h2 className="font-heading text-2xl md:text-4xl tracking-tight mb-6 animate-fade-up"
            style={{ color: isPrivileged ? 'hsl(30, 10%, 20%)' : 'hsl(0, 0%, 75%)' }}>
          {event.title}
        </h2>

        <p className="font-body text-base leading-relaxed mb-10 animate-fade-up-delay max-w-md mx-auto"
           style={{ color: isPrivileged ? 'hsl(30, 8%, 40%)' : 'hsl(0, 0%, 55%)' }}>
          {event.description}
        </p>

        {/* Impact display */}
        <div className="grid grid-cols-2 gap-3 mb-10 max-w-xs mx-auto animate-fade-up-delay">
          {statChanges.map(change => (
            <div key={change.label} className="text-left">
              <p className="font-body text-[9px] uppercase tracking-[0.2em]"
                 style={{ color: isPrivileged ? 'hsl(30, 8%, 55%)' : 'hsl(0, 0%, 40%)' }}>
                {change.label}
              </p>
              <p className="font-heading text-base"
                 style={{ color: change.value > 0 && change.label !== 'Stress'
                   ? 'hsl(142, 60%, 45%)'
                   : change.value < 0 && change.label === 'Stress'
                   ? 'hsl(142, 60%, 45%)'
                   : 'hsl(0, 72%, 51%)' }}>
                {change.formatted}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onAcknowledge}
          className="animate-fade-up-delay-2 font-body text-sm uppercase tracking-[0.2em] px-8 py-4 border transition-all duration-300 hover:tracking-[0.3em]"
          style={{
            color: isPrivileged ? 'hsl(30, 10%, 20%)' : 'hsl(0, 0%, 60%)',
            borderColor: isPrivileged ? 'hsl(30, 10%, 80%)' : 'hsl(0, 0%, 25%)',
            backgroundColor: 'transparent',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function formatStatLabel(key: string): string {
  const labels: Record<string, string> = {
    netWorth: 'Net Worth',
    stress: 'Stress',
    socialCapital: 'Social Capital',
    security: 'Security',
    health: 'Health',
    education: 'Education',
    careerTier: 'Career',
    creditScore: 'Credit Score',
  };
  return labels[key] || key;
}

function formatChange(key: string, val: number): string {
  if (key === 'netWorth') {
    const sign = val >= 0 ? '+' : '';
    if (Math.abs(val) >= 1000) return `${sign}$${(val / 1000).toFixed(0)}K`;
    return `${sign}$${val.toLocaleString()}`;
  }
  return `${val > 0 ? '+' : ''}${val}`;
}
