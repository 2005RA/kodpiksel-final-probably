// src/components/TopBar.jsx

import { useRewards } from '../context/RewardContext';
import Logo from './Logo';

export default function TopBar() {
  const { rewards } = useRewards();

  const PILLS = [
    { id: 'pill-key',       emoji: '🗝️',  value: rewards.key,            cls: 'key-pill'  },
    { id: 'pill-chip',      emoji: '🖥️',  value: rewards.chip,           cls: 'chip-pill' },
    { id: 'pill-level',     emoji: '⭐',  value: `Səv ${rewards.level}`, cls: 'lvl-pill'  },
    { id: 'pill-hourglass', emoji: '⏳',  value: rewards.hourglass,      cls: 'time-pill' },
  ];

  return (
    <header className="top-bar">
      <div className="logo logo-row">
        <Logo size={20} />
        <span>Kod<span className="logo-piksel">Piksel</span></span>
      </div>
      <div className="top-right">
        {PILLS.map(p => (
          <div key={p.id} id={p.id} className={`stat-pill ${p.cls}`}>
            <span>{p.emoji}</span>
            <span>{p.value}</span>
          </div>
        ))}
      </div>
    </header>
  );
}