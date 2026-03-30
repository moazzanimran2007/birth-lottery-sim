import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { GameStats } from '@/data/gameData';
import type { HistoryEntry } from '@/hooks/useGameState';

interface LifeLedgerProps {
  stats: GameStats;
  isPrivileged: boolean;
  stageIndex: number;
  totalStages: number;
  history: HistoryEntry[];
}

const EDUCATION_LABELS = ['None', 'HS', 'Voc.', 'Assoc.', 'BA/BS', 'Grad'];
const CAREER_LABELS = ['—', 'Entry', 'Service', 'Skilled', 'Prof.', 'Exec.'];

export default function LifeLedger({ stats, isPrivileged, stageIndex, totalStages, history }: LifeLedgerProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const textColor = isPrivileged ? 'hsl(30, 10%, 20%)' : 'hsl(0, 0%, 70%)';
  const labelColor = isPrivileged ? 'hsl(30, 8%, 55%)' : 'hsl(0, 0%, 40%)';
  const accentColor = isPrivileged ? 'hsl(43, 56%, 54%)' : 'hsl(35, 20%, 40%)';
  const bgColor = isPrivileged ? 'hsl(43, 30%, 94%)' : 'hsl(0, 0%, 14%)';
  const stressColor = stats.stress > 60 ? 'hsl(0, 72%, 51%)' : stats.stress > 35 ? 'hsl(45, 80%, 55%)' : 'hsl(142, 60%, 45%)';
  const healthColor = stats.health > 60 ? 'hsl(142, 60%, 45%)' : stats.health > 35 ? 'hsl(45, 80%, 55%)' : 'hsl(0, 72%, 51%)';
  const creditColor = stats.creditScore > 700 ? 'hsl(142, 60%, 45%)' : stats.creditScore > 580 ? 'hsl(45, 80%, 55%)' : 'hsl(0, 72%, 51%)';

  const statItems = [
    { label: 'Net Worth', value: formatMoney(stats.netWorth), color: stats.netWorth >= 0 ? textColor : 'hsl(0, 72%, 51%)' },
    { label: 'Stress', value: `${Math.round(stats.stress)}`, color: stressColor },
    { label: 'Health', value: `${Math.round(stats.health)}`, color: healthColor },
    { label: 'Credit', value: `${Math.round(stats.creditScore)}`, color: creditColor },
    { label: 'Social', value: `${Math.round(stats.socialCapital)}`, color: textColor },
    { label: 'Security', value: `${Math.round(stats.security)}`, color: textColor },
    { label: 'Education', value: EDUCATION_LABELS[Math.min(5, Math.max(0, Math.round(stats.education)))], color: textColor },
    { label: 'Career', value: CAREER_LABELS[Math.min(5, Math.max(0, Math.round(stats.careerTier)))], color: textColor },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <div
        className="hidden md:flex fixed right-0 top-0 h-full w-60 flex-col px-5 py-6 z-10 transition-all duration-700 overflow-y-auto"
        style={{ backgroundColor: bgColor }}
      >
        <p className="font-body text-[9px] uppercase tracking-[0.3em] mb-5" style={{ color: accentColor }}>
          Life Ledger
        </p>
        <div className="space-y-3">
          {statItems.map(stat => (
            <div key={stat.label}>
              <p className="font-body text-[8px] uppercase tracking-[0.15em] mb-0.5" style={{ color: labelColor }}>
                {stat.label}
              </p>
              <p className="font-heading text-base transition-all duration-500" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-5">
          <p className="font-body text-[8px] uppercase tracking-[0.15em] mb-1.5" style={{ color: labelColor }}>
            Stage {stageIndex + 1} of {totalStages}
          </p>
          <div className="flex gap-0.5">
            {Array.from({ length: totalStages }).map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i <= stageIndex ? accentColor : (isPrivileged ? 'hsl(43, 30%, 88%)' : 'hsl(0, 0%, 20%)'),
                }}
              />
            ))}
          </div>
        </div>

        {/* History toggle */}
        {history.length > 0 && (
          <div className="mt-5">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="font-body text-[8px] uppercase tracking-[0.15em] flex items-center gap-1"
              style={{ color: accentColor }}
            >
              History {showHistory ? '▾' : '▸'}
            </button>
            {showHistory && (
              <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                {history.slice().reverse().map((entry, i) => (
                  <div key={i} className="border-l-2 pl-2" style={{ borderColor: entry.type === 'event' ? 'hsl(0, 60%, 50%)' : accentColor }}>
                    <p className="font-body text-[8px] uppercase tracking-[0.1em]" style={{ color: labelColor }}>
                      Age {entry.age} · {entry.type}
                    </p>
                    <p className="font-body text-[10px] leading-tight" style={{ color: textColor }}>
                      {entry.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile bottom drawer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-20">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between px-4 py-3 transition-all duration-300"
          style={{ backgroundColor: bgColor }}
        >
          <div className="flex items-center gap-3">
            <span className="font-body text-[9px] uppercase tracking-[0.2em]" style={{ color: accentColor }}>
              Ledger
            </span>
            <span className="font-heading text-sm" style={{ color: statItems[0].color }}>
              {statItems[0].value}
            </span>
            <span className="font-heading text-xs" style={{ color: healthColor }}>
              ♥ {Math.round(stats.health)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: totalStages }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: i <= stageIndex ? accentColor : (isPrivileged ? 'hsl(43, 30%, 88%)' : 'hsl(0, 0%, 20%)'),
                  }}
                />
              ))}
            </div>
            {mobileOpen ? (
              <ChevronDown size={14} style={{ color: accentColor }} />
            ) : (
              <ChevronUp size={14} style={{ color: accentColor }} />
            )}
          </div>
        </button>

        <div
          className="overflow-hidden transition-all duration-300 px-4"
          style={{
            backgroundColor: bgColor,
            maxHeight: mobileOpen ? '280px' : '0',
            paddingBottom: mobileOpen ? '16px' : '0',
          }}
        >
          <div className="grid grid-cols-4 gap-2">
            {statItems.map(stat => (
              <div key={stat.label}>
                <p className="font-body text-[7px] uppercase tracking-[0.1em]" style={{ color: labelColor }}>
                  {stat.label}
                </p>
                <p className="font-heading text-sm transition-all duration-500" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function formatMoney(n: number): string {
  if (Math.abs(n) >= 1000000) {
    return `${n < 0 ? '-' : ''}$${(Math.abs(n) / 1000000).toFixed(1)}M`;
  }
  if (n < 0) return `-$${Math.abs(n).toLocaleString()}`;
  return `$${n.toLocaleString()}`;
}
