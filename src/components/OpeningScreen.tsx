import { useState, useEffect } from 'react';
import { CONDITIONS, type ConditionId } from '@/data/gameData';

interface OpeningScreenProps {
  phase: 'intro' | 'coin_flip' | 'condition_reveal';
  conditionId: ConditionId | null;
  onStartFlip: () => void;
  onAssignCondition: () => void;
  onStartPlaying: () => void;
}

export default function OpeningScreen({ phase, conditionId, onStartFlip, onAssignCondition, onStartPlaying }: OpeningScreenProps) {
  const [shuffling, setShuffling] = useState(false);
  const [shuffleLabel, setShuffleLabel] = useState('');
  const condition = conditionId ? CONDITIONS.find(c => c.id === conditionId) : null;

  useEffect(() => {
    if (phase === 'coin_flip') {
      setShuffling(true);
      let count = 0;
      const interval = setInterval(() => {
        const randomCond = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
        setShuffleLabel(randomCond.label);
        count++;
        if (count > 20) {
          clearInterval(interval);
          setShuffling(false);
          onAssignCondition();
        }
      }, 120);
      return () => clearInterval(interval);
    }
  }, [phase, onAssignCondition]);

  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-foreground">
        <div className="max-w-lg text-center">
          <h1 className="font-heading text-3xl md:text-5xl tracking-tight mb-8 animate-fade-up"
              style={{ color: 'hsl(40, 20%, 95%)' }}>
            Inheritance
          </h1>
          <p className="font-body text-lg md:text-xl leading-relaxed mb-4 animate-fade-up-delay"
             style={{ color: 'hsl(40, 10%, 65%)' }}>
            You are about to be born.
          </p>
          <p className="font-body text-lg md:text-xl leading-relaxed mb-12 animate-fade-up-delay-2"
             style={{ color: 'hsl(40, 10%, 65%)' }}>
            But first — a coin flip you don't control.
          </p>
          <button
            onClick={onStartFlip}
            className="animate-fade-up-delay-2 font-body text-sm uppercase tracking-[0.2em] px-8 py-4 border transition-all duration-300 hover:tracking-[0.3em]"
            style={{
              color: 'hsl(43, 56%, 54%)',
              borderColor: 'hsl(43, 56%, 54%, 0.3)',
              backgroundColor: 'transparent',
            }}
          >
            Begin
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'coin_flip') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-foreground">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full border-2 flex items-center justify-center animate-coin-spin"
               style={{ borderColor: 'hsl(43, 56%, 54%, 0.5)' }}>
            <span className="font-heading text-2xl" style={{ color: 'hsl(43, 56%, 54%)' }}>?</span>
          </div>
          <p className="font-heading text-xl md:text-2xl tracking-tight animate-pulse-glow"
             style={{ color: 'hsl(40, 20%, 90%)' }}>
            {shuffling ? shuffleLabel : '...'}
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'condition_reveal' && condition) {
    const isPrivileged = condition.isPrivileged;
    const s = condition.startingStats;
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 transition-colors duration-1000"
        style={{
          backgroundColor: isPrivileged ? 'hsl(45, 33%, 97%)' : 'hsl(0, 0%, 10%)',
        }}
      >
        <div className="max-w-lg text-center">
          <p className="font-body text-xs uppercase tracking-[0.3em] mb-6 animate-fade-up"
             style={{ color: isPrivileged ? 'hsl(43, 56%, 54%)' : 'hsl(35, 20%, 40%)' }}>
            You were born into
          </p>
          <h2 className="font-heading text-3xl md:text-5xl tracking-tight mb-3 animate-fade-up"
              style={{ color: isPrivileged ? 'hsl(30, 10%, 20%)' : 'hsl(0, 0%, 70%)' }}>
            {condition.label}
          </h2>
          <p className="font-heading text-lg italic mb-8 animate-fade-up-delay"
             style={{ color: isPrivileged ? 'hsl(30, 8%, 55%)' : 'hsl(0, 0%, 45%)' }}>
            {condition.subtitle}
          </p>
          <p className="font-body text-base leading-relaxed mb-12 animate-fade-up-delay max-w-md mx-auto"
             style={{ color: isPrivileged ? 'hsl(30, 8%, 40%)' : 'hsl(0, 0%, 55%)' }}>
            {condition.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-12 animate-fade-up-delay-2 max-w-sm mx-auto text-left">
            {[
              { label: 'Net Worth', value: formatMoney(s.netWorth) },
              { label: 'Stress', value: `${s.stress}/100` },
              { label: 'Health', value: `${s.health}/100` },
              { label: 'Credit Score', value: `${s.creditScore}` },
              { label: 'Social Capital', value: `${s.socialCapital}/100` },
              { label: 'Security', value: `${s.security}/100` },
            ].map(stat => (
              <div key={stat.label}>
                <p className="font-body text-[10px] uppercase tracking-[0.2em]"
                   style={{ color: isPrivileged ? 'hsl(30, 8%, 55%)' : 'hsl(0, 0%, 40%)' }}>
                  {stat.label}
                </p>
                <p className="font-heading text-lg"
                   style={{ color: isPrivileged ? 'hsl(30, 10%, 20%)' : 'hsl(0, 0%, 70%)' }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={onStartPlaying}
            className="animate-fade-up-delay-2 font-body text-sm uppercase tracking-[0.2em] px-8 py-4 border transition-all duration-300 hover:tracking-[0.3em]"
            style={{
              color: isPrivileged ? 'hsl(43, 56%, 54%)' : 'hsl(35, 20%, 40%)',
              borderColor: isPrivileged ? 'hsl(43, 56%, 54%, 0.3)' : 'hsl(35, 20%, 40%, 0.3)',
              backgroundColor: 'transparent',
            }}
          >
            Live your life
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function formatMoney(n: number): string {
  if (n < 0) return `-$${Math.abs(n).toLocaleString()}`;
  return `$${n.toLocaleString()}`;
}
