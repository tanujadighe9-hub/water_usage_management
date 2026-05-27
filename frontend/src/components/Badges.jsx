import React from 'react';
import './Badges.css';

const BADGE_RULES = [
  { icon:'💧', name:'First Log',    desc:'Log your first day',     check: (w) => w.some(d => d.total > 0) },
  { icon:'🌿', name:'Eco Hero',     desc:'Stay under goal 3 days', check: (w) => w.filter(d => d.underGoal).length >= 3 },
  { icon:'📉', name:'Downward',     desc:'3 days decreasing',      check: (w) => {
    let c = 0;
    for (let i = 1; i < w.length; i++) { if (w[i].total < w[i-1].total && w[i].total > 0) c++; else c = 0; if (c >= 2) return true; }
    return false;
  }},
  { icon:'🏆', name:'Week Champ',   desc:'Log all 7 days',         check: (w) => w.filter(d => d.total > 0).length === 7 },
  { icon:'⚡', name:'Low Flow',     desc:'Under 100 L in a day',   check: (w) => w.some(d => d.total > 0 && d.total < 100) },
  { icon:'🌍', name:'Earth First',  desc:'Under 80 L in a day',    check: (w) => w.some(d => d.total > 0 && d.total < 80) },
];

export default function Badges({ weekData, goal }) {
  const enriched = weekData.map(d => ({ ...d, underGoal: goal > 0 && d.total > 0 && d.total <= goal }));

  return (
    <div className="card fade-in-up">
      <div className="card-title">Achievements</div>
      <div className="badges-grid">
        {BADGE_RULES.map(b => {
          const earned = b.check(enriched);
          return (
            <div key={b.name} className={`badge-item ${earned ? 'earned' : 'locked'}`}>
              {earned && <div className="badge-dot" />}
              <div className="badge-icon">{b.icon}</div>
              <div className="badge-name">{b.name}</div>
              <div className="badge-desc">{b.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
