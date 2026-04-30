import type { RiskLevel } from '../types';

interface Props {
  type: 'diabetes' | 'hypertension';
  level: RiskLevel;
  score: number;
}

const config = {
  low:      { bg: 'bg-green-50',  border: 'border-green-500', text: 'text-green-700',  icon: '✅' },
  moderate: { bg: 'bg-amber-50',  border: 'border-amber-500', text: 'text-amber-700',  icon: '⚠️' },
  high:     { bg: 'bg-red-50',    border: 'border-red-500',   text: 'text-red-700',    icon: '🔴' },
};

const labels = {
  diabetes: 'Diabetes Risk',
  hypertension: 'Hypertension Risk',
};

export default function RiskBadge({ type, level, score }: Props) {
  const c = config[level];
  return (
    <div className={`flex-1 ${c.bg} border-2 ${c.border} rounded-xl p-5 text-center`}>
      <div className="text-2xl mb-1">{c.icon}</div>
      <p className="text-sm text-gray-500 mb-1">{labels[type]}</p>
      <p className={`text-3xl font-bold ${c.text} capitalize`}>{level}</p>
      <p className="text-xs text-gray-400 mt-1">Score: {score}/14</p>
    </div>
  );
}
