import { useState, useEffect } from 'react';
import type { GameStats } from '@/data/gameData';

interface TransitionScreenProps {
  fromAge: number;
  toAge: number;
  isPrivileged: boolean;
  stats: GameStats;
  onContinue: () => void;
}

export default function TransitionScreen({ fromAge, toAge, isPrivileged, stats, onContinue }: TransitionScreenProps) {
  const [displayAge, setDisplayAge] = useState(fromAge);
  const [ready, setReady] = useState(false);
  const yearsBetween = toAge - fromAge;

  useEffect(() => {
    let current = fromAge;
    const step = Math.max(1, Math.floor(yearsBetween / 15));
    const interval = setInterval(() => {
      current += step;
      if (current >= toAge) {
        current = toAge;
        clearInterval(interval);
        setTimeout(() => setReady(true), 400);
      }
      setDisplayAge(current);
    }, 80);
    return () => clearInterval(interval);
  }, [fromAge, toAge, yearsBetween]);

  // Auto-continue after brief pause
  useEffect(() => {
    if (ready) {
      const timeout = setTimeout(onContinue, 1200);
      return () => clearTimeout(timeout);
    }
  }, [ready, onContinue]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{
        backgroundColor: isPrivileged ? 'hsl(45, 33%, 97%)' : 'hsl(0, 0%, 10%)',
      }}
    >
      <div className="text-center">
        <p className="font-body text-xs uppercase tracking-[0.3em] mb-4"
           style={{ color: isPrivileged ? 'hsl(43, 56%, 54%)' : 'hsl(35, 20%, 40%)' }}>
          {yearsBetween} years pass
        </p>

        <p className="font-heading text-6xl md:text-8xl tracking-tight mb-8 transition-all duration-150"
           style={{ color: isPrivileged ? 'hsl(30, 10%, 20%)' : 'hsl(0, 0%, 70%)' }}>
          {displayAge}
        </p>

        {ready && (
          <div className="animate-fade-up">
            <p className="font-body text-sm"
               style={{ color: isPrivileged ? 'hsl(30, 8%, 50%)' : 'hsl(0, 0%, 45%)' }}>
              Net worth: {formatMoney(stats.netWorth)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function formatMoney(n: number): string {
  if (Math.abs(n) >= 1000000) {
    return `${n < 0 ? '-' : ''}$${(Math.abs(n) / 1000000).toFixed(1)}M`;
  }
  if (n < 0) return `-$${Math.abs(n).toLocaleString()}`;
  return `$${n.toLocaleString()}`;
}
