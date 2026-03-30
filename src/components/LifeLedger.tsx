interface LifeLedgerProps {
  netWorth: number;
  stress: number;
  socialCapital: number;
  security: number;
  isPrivileged: boolean;
  stageIndex: number;
}

export default function LifeLedger({ netWorth, stress, socialCapital, security, isPrivileged, stageIndex }: LifeLedgerProps) {
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

  return (
    <div
      className="fixed right-0 top-0 h-full w-48 md:w-56 flex flex-col justify-center px-4 md:px-6 z-10 transition-all duration-700"
      style={{ backgroundColor: bgColor }}
    >
      <p className="font-body text-[9px] uppercase tracking-[0.3em] mb-6"
         style={{ color: accentColor }}>
        Life Ledger
      </p>

      <div className="space-y-5">
        {stats.map(stat => (
          <div key={stat.label}>
            <p className="font-body text-[9px] uppercase tracking-[0.15em] mb-1"
               style={{ color: labelColor }}>
              {stat.label}
            </p>
            <p className="font-heading text-lg transition-all duration-500"
               style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <p className="font-body text-[9px] uppercase tracking-[0.15em] mb-2"
           style={{ color: labelColor }}>
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
    </div>
  );
}

function formatMoney(n: number): string {
  if (n < 0) return `-$${Math.abs(n).toLocaleString()}`;
  return `$${n.toLocaleString()}`;
}
