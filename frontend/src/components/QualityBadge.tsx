import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

interface QualityBadgeProps {
  score: number;
}

export const QualityBadge: React.FC<QualityBadgeProps> = ({ score }) => {
  const isHighQuality = score >= 90;

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold shadow-lg ${
        isHighQuality
          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/50 green-glow'
          : 'bg-amber-950/40 text-amber-300 border-amber-500/50'
      }`}
    >
      {isHighQuality ? (
        <ShieldCheck className="w-5 h-5 text-emerald-400" />
      ) : (
        <AlertCircle className="w-5 h-5 text-amber-400" />
      )}
      <span>Quality Score: {score}/100</span>
      {isHighQuality ? (
        <span className="text-[10px] uppercase font-mono tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md">
          PASSED GATE
        </span>
      ) : (
        <span className="text-[10px] uppercase font-mono tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md">
          REVISING (&lt;90)
        </span>
      )}
    </div>
  );
};
