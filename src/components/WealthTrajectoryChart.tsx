import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { type TrajectoryPoint } from '@/data/gameData';

interface WealthTrajectoryChartProps {
  yourTrajectory: TrajectoryPoint[];
  oppositeTrajectory: TrajectoryPoint[];
  yourLabel: string;
  oppositeLabel: string;
  yourIsPrivileged: boolean;
}

export default function WealthTrajectoryChart({
  yourTrajectory,
  oppositeTrajectory,
  yourLabel,
  oppositeLabel,
  yourIsPrivileged,
}: WealthTrajectoryChartProps) {
  // Merge trajectories into chart data
  const data = yourTrajectory.map((point, i) => ({
    age: point.age === 0 ? 'Birth' : `Age ${point.age}`,
    label: point.label,
    you: point.netWorth,
    opposite: oppositeTrajectory[i]?.netWorth ?? 0,
  }));

  const yourColor = yourIsPrivileged ? 'hsl(43, 56%, 54%)' : 'hsl(0, 0%, 55%)';
  const oppositeColor = yourIsPrivileged ? 'hsl(0, 0%, 55%)' : 'hsl(43, 56%, 54%)';

  const formatDollar = (value: number) => {
    if (value < 0) return `-$${Math.abs(value / 1000).toFixed(0)}k`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
  };

  return (
    <div className="w-full">
      <p className="font-body text-[9px] uppercase tracking-[0.3em] mb-4 text-center"
         style={{ color: 'hsl(0, 0%, 40%)' }}>
        Wealth trajectory — same decisions, different lives
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 18%)" />
          <XAxis
            dataKey="age"
            tick={{ fill: 'hsl(0, 0%, 45%)', fontSize: 11, fontFamily: 'Source Sans 3' }}
            axisLine={{ stroke: 'hsl(0, 0%, 25%)' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatDollar}
            tick={{ fill: 'hsl(0, 0%, 45%)', fontSize: 11, fontFamily: 'Source Sans 3' }}
            axisLine={{ stroke: 'hsl(0, 0%, 25%)' }}
            tickLine={false}
            width={55}
          />
          <ReferenceLine y={0} stroke="hsl(0, 0%, 30%)" strokeDasharray="4 4" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(0, 0%, 12%)',
              border: '1px solid hsl(0, 0%, 22%)',
              borderRadius: '2px',
              fontFamily: 'Source Sans 3',
              fontSize: 13,
            }}
            labelStyle={{ color: 'hsl(0, 0%, 65%)', fontFamily: 'Libre Baskerville', fontSize: 12 }}
            itemStyle={{ fontFamily: 'Source Sans 3' }}
            formatter={(value: number, name: string) => [
              formatDollar(value),
              name === 'you' ? yourLabel : oppositeLabel,
            ]}
          />
          <Line
            type="monotone"
            dataKey="you"
            stroke={yourColor}
            strokeWidth={2.5}
            dot={{ r: 4, fill: yourColor, stroke: 'hsl(0,0%,6%)', strokeWidth: 2 }}
            name="you"
          />
          <Line
            type="monotone"
            dataKey="opposite"
            stroke={oppositeColor}
            strokeWidth={2.5}
            strokeDasharray="6 3"
            dot={{ r: 4, fill: oppositeColor, stroke: 'hsl(0,0%,6%)', strokeWidth: 2 }}
            name="opposite"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5" style={{ backgroundColor: yourColor }} />
          <span className="font-body text-xs" style={{ color: 'hsl(0, 0%, 50%)' }}>{yourLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 border-t border-dashed" style={{ borderColor: oppositeColor }} />
          <span className="font-body text-xs" style={{ color: 'hsl(0, 0%, 50%)' }}>{oppositeLabel}</span>
        </div>
      </div>
    </div>
  );
}
