import { useRef, useCallback } from 'react';
import type { GameStats } from '@/hooks/useGameState';
import type { StartingCondition } from '@/data/gameData';

interface ShareCardProps {
  condition: StartingCondition;
  stats: GameStats;
  oppositeCondition: StartingCondition | null;
  oppositeOutcome: GameStats | null;
}

export default function ShareCard({ condition, stats, oppositeCondition, oppositeOutcome }: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 1200;
    const h = 630;
    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, w, h);

    // Title
    ctx.fillStyle = '#666';
    ctx.font = '14px "Source Sans 3", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('INHERITANCE — A GENERATIONAL WEALTH SIMULATOR', 60, 60);
    ctx.letterSpacing = '0px';

    // Your side
    const leftBg = condition.isPrivileged ? '#faf8f0' : '#1a1a1a';
    ctx.fillStyle = leftBg;
    ctx.fillRect(40, 90, 545, 440);

    const leftText = condition.isPrivileged ? '#3d3328' : '#b3b3b3';
    const leftLabel = condition.isPrivileged ? '#8a7d6d' : '#666';
    const leftAccent = condition.isPrivileged ? '#c9a84c' : '#8a6d28';

    ctx.fillStyle = leftAccent;
    ctx.font = '11px "Source Sans 3", sans-serif';
    ctx.fillText(`YOU — ${condition.label}`, 80, 140);

    ctx.fillStyle = leftLabel;
    ctx.font = '11px "Source Sans 3", sans-serif';
    const leftStats = [
      { label: 'NET WORTH', value: formatMoney(stats.netWorth) },
      { label: 'STRESS', value: `${stats.stress}/100` },
      { label: 'SOCIAL CAPITAL', value: `${stats.socialCapital}/100` },
      { label: 'SECURITY', value: `${stats.security}/100` },
    ];

    leftStats.forEach((stat, i) => {
      const y = 180 + i * 80;
      ctx.fillStyle = leftLabel;
      ctx.font = '11px "Source Sans 3", sans-serif';
      ctx.fillText(stat.label, 80, y);
      ctx.fillStyle = stat.label === 'NET WORTH' && stats.netWorth < 0 ? '#d32f2f' : leftText;
      ctx.font = stat.label === 'NET WORTH' ? 'bold 36px "Libre Baskerville", serif' : '24px "Libre Baskerville", serif';
      ctx.fillText(stat.value, 80, y + 35);
    });

    // Opposite side
    if (oppositeCondition && oppositeOutcome) {
      const rightBg = oppositeCondition.isPrivileged ? '#faf8f0' : '#1a1a1a';
      ctx.fillStyle = rightBg;
      ctx.fillRect(615, 90, 545, 440);

      const rightText = oppositeCondition.isPrivileged ? '#3d3328' : '#b3b3b3';
      const rightLabel = oppositeCondition.isPrivileged ? '#8a7d6d' : '#666';
      const rightAccent = oppositeCondition.isPrivileged ? '#c9a84c' : '#8a6d28';

      ctx.fillStyle = rightAccent;
      ctx.font = '11px "Source Sans 3", sans-serif';
      ctx.fillText(`SAME CHOICES — ${oppositeCondition.label}`, 655, 140);

      const rightStats = [
        { label: 'NET WORTH', value: formatMoney(oppositeOutcome.netWorth) },
        { label: 'STRESS', value: `${oppositeOutcome.stress}/100` },
        { label: 'SOCIAL CAPITAL', value: `${oppositeOutcome.socialCapital}/100` },
        { label: 'SECURITY', value: `${oppositeOutcome.security}/100` },
      ];

      rightStats.forEach((stat, i) => {
        const y = 180 + i * 80;
        ctx.fillStyle = rightLabel;
        ctx.font = '11px "Source Sans 3", sans-serif';
        ctx.fillText(stat.label, 655, y);
        ctx.fillStyle = stat.label === 'NET WORTH' && oppositeOutcome.netWorth < 0 ? '#d32f2f' : rightText;
        ctx.font = stat.label === 'NET WORTH' ? 'bold 36px "Libre Baskerville", serif' : '24px "Libre Baskerville", serif';
        ctx.fillText(stat.value, 655, y + 35);
      });

      // Wealth gap at bottom
      const gap = Math.abs(stats.netWorth - oppositeOutcome.netWorth);
      ctx.fillStyle = '#555';
      ctx.font = 'italic 18px "Libre Baskerville", serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Wealth gap: $${gap.toLocaleString()}  ·  Same effort. Same decisions. Different lives.`, w / 2, h - 40);
      ctx.textAlign = 'left';
    }

    // Download
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inheritance-results.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  }, [condition, stats, oppositeCondition, oppositeOutcome]);

  const shareNative = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !navigator.share) {
      generateImage();
      return;
    }

    // Generate canvas first
    generateImage();

    // Try native share
    try {
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve));
      if (!blob) return;
      const file = new File([blob], 'inheritance-results.png', { type: 'image/png' });
      await navigator.share({
        title: 'Inheritance — My Results',
        text: `Same decisions, different starting lines. Wealth gap: $${Math.abs(stats.netWorth - (oppositeOutcome?.netWorth ?? 0)).toLocaleString()}`,
        files: [file],
      });
    } catch {
      // User cancelled or share not supported — image already downloaded
    }
  }, [generateImage, stats.netWorth, oppositeOutcome?.netWorth]);

  return (
    <div className="text-center mt-12">
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex gap-3 justify-center">
        <button
          onClick={generateImage}
          className="font-body text-xs uppercase tracking-[0.2em] px-6 py-3 border transition-all duration-300 hover:tracking-[0.3em]"
          style={{
            color: 'hsl(43, 56%, 54%)',
            borderColor: 'hsl(43, 56%, 54%, 0.3)',
            backgroundColor: 'transparent',
          }}
        >
          Download results
        </button>
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={shareNative}
            className="font-body text-xs uppercase tracking-[0.2em] px-6 py-3 border transition-all duration-300 hover:tracking-[0.3em]"
            style={{
              color: 'hsl(0, 0%, 55%)',
              borderColor: 'hsl(0, 0%, 25%)',
              backgroundColor: 'transparent',
            }}
          >
            Share
          </button>
        )}
      </div>
    </div>
  );
}

function formatMoney(n: number): string {
  if (n < 0) return `-$${Math.abs(n).toLocaleString()}`;
  return `$${n.toLocaleString()}`;
}
