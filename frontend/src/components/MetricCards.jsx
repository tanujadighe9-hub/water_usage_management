import React from 'react';
import './MetricCards.css';

export default function MetricCards({ todayUsage, weekData, view }) {
  const todayTotal  = todayUsage?.total || 0;
  const weekTotals  = weekData.map(d => d.total || 0);
  const weekSum     = weekTotals.reduce((a, b) => a + b, 0);
  const weekAvg     = weekTotals.length ? Math.round(weekSum / weekTotals.length) : 0;
  const yesterday   = weekTotals.length >= 2 ? weekTotals[weekTotals.length - 2] : 0;
  const diffPct     = yesterday > 0 ? Math.round(((todayTotal - yesterday) / yesterday) * 100) : 0;
  const peakDay     = Math.max(...weekTotals);

  const cards = view === 'daily'
    ? [
        { label: 'Today', val: todayTotal, unit: 'L', change: yesterday > 0 ? `${diffPct > 0 ? '+' : ''}${diffPct}%` : null, up: diffPct > 0 },
        { label: 'Yesterday', val: yesterday, unit: 'L', change: null },
        { label: 'Weekly avg', val: weekAvg, unit: 'L/day', change: null },
        { label: 'Week total', val: weekSum, unit: 'L', change: null },
      ]
    : [
        { label: 'This week', val: weekSum, unit: 'L', change: null },
        { label: 'Daily avg', val: weekAvg, unit: 'L/day', change: null },
        { label: 'Peak day', val: peakDay, unit: 'L', change: null },
        { label: 'Days logged', val: weekTotals.filter(v => v > 0).length, unit: '/7', change: null },
      ];

  return (
    <div className="metrics">
      {cards.map((m, i) => (
        <div className="metric-card fade-in-up" key={m.label}
          style={{ animationDelay: `${i * 0.07}s` }}>
          <div className="m-label">{m.label}</div>
          <div className="m-val">
            {m.val.toLocaleString()}
            <span className="m-unit">{m.unit}</span>
          </div>
          {m.change && (
            <div className={`m-change ${m.up ? 'up' : 'down'}`}>
              {m.up ? '▲' : '▼'} {m.change}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
