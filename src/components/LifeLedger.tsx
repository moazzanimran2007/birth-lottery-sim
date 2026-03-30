import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface LifeLedgerProps {
  netWorth: number;
  stress: number;
  socialCapital: number;
  security: number;
  isPrivileged: boolean;
  stageIndex: number;
}

export default function LifeLedger({ netWorth, stress, socialCapital, security, isPrivileged, stageIndex }: LifeLedgerProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const textColor = isPrivileged ? 'hsl(30, 10%, 20%)' : 'hsl(0, 0%, 70%)';
  const labelColor = isPrivileged ? 'hsl(30, 8%, 55%)' : 'hsl(0, 0%, 40%)';
  const accentColor = isPrivileged ? 'hsl(43, 56%, 54%)' : 'hsl(35, 20%, 40%)';
  const bgColor = isPrivileged ? 'hsl(43, 30%, 94%)' : 'hsl(0, 0%, 14%)';
  const stressColor = stress > 60 ? 'hsl(0, 72%, 51%)' : stress > 35 ? 'hsl(45, 80%, 55%)' : 'hsl(142, 60%, 45%)';

  const stats = [
    { label: 'Net Worth', value: formatMoney(netWorth), color: netWorth >= 0 ? textColor : 'hsl(0, 72%, 51%)' },
    { label: 'Stress', value: `${stress}`, color: stressColor },
    { label: 'Social Capital', value: `${socialCapital}`, color: textColor },
    { label: 'Security', value: `${security}`, color: textColor },
  ];

  // Desktop: right sidebar
  // Mobile: bottom drawer
  return (
    <>
      {/* Desktop sidebar */}
      <div
        className="hidden md:flex fixed right-0 top-0 h-full w-56 flex-col justify-center px-6 z-10 transition-all duration-700"
        style={{ backgroundColor: bgColor }}
      >
        <LedgerContent stats={stats} labelColor={labelColor} accentColor={accentColor} stageIndex={stageIndex} isPrivileged={isPrivileged} />
      </div>

      {/* Mobile bottom drawer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-20">
        {/* Toggle button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between px-4 py-3 transition-all duration-300"
          style={{ backgroundColor: bgColor }}
        >
          <div className="flex items-center gap-4">
            <span className="font-body text-[9px] uppercase tracking-[0.2em]" style={{ color: accentColor }}>
              Ledger
            </span>
            <span className="font-heading text-sm" style={{ color: stats[0].color }}>
              {stats[0].value}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Mini progress dots */}
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: i <= stageIndex ? accentColor : (isPrivileged ? 'hsl(43, 30%, 88%)' : 'hsl(0, 0%, 20%)'),
                  }}
                />
              ))}
            </div>
            {mobileOpen ? (
              <ChevronDown size={16} style={{ color: accentColor }} />
            ) : (
              <ChevronUp size={16} style={{ color: accentColor }} />
            )}
          </div>
        </button>

        {/* Expanded content */}
        <div
          className="overflow-hidden transition-all duration-300 px-4"
          style={{
            backgroundColor: bgColor,
            maxHeight: mobileOpen ? '200px' : '0',
            paddingBottom: mobileOpen ? '16px' : '0',
          }}
        >
          <div className="grid grid-cols-4 gap-3">
            {stats.map(stat => (
              <div key={stat.label}>
                <p className="font-body text-[8px] uppercase tracking-[0.1em]" style={{ color: labelColor }}>
                  {stat.label}
                </p>
                <p className="font-heading text-base transition-all duration-500" style={{ color: stat.color }}>
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

function LedgerContent({ stats, labelColor, accentColor, stageIndex, isPrivileged }: {
  stats: { label: string; value: string; color: string }[];
  labelColor: string;
  accentColor: string;
  stageIndex: number;
  isPrivileged: boolean;
}) {
  return (
    <>
      <p className="font-body text-[9px] uppercase tracking-[0.3em] mb-6" style={{ color: accentColor }}>
        Life Ledger
      </p>
      <div className="space-y-5">
        {stats.map(stat => (
          <div key={stat.label}>
            <p className="font-body text-[9px] uppercase tracking-[0.15em] mb-1" style={{ color: labelColor }}>
              {stat.label}
            </p>
            <p className="font-heading text-lg transition-all duration-500" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <p className="font-body text-[9px] uppercase tracking-[0.15em] mb-2" style={{ color: labelColor }}>
          Stage {stageIndex + 1} of 5
        </p>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map(i => (
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
    </>
  );
}

function formatMoney(n: number): string {
  if (n < 0) return `-$${Math.abs(n).toLocaleString()}`;
  return `$${n.toLocaleString()}`;
}
