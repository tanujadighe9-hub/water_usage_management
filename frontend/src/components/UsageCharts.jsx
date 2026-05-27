import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import './UsageCharts.css';

const CATS    = ['shower','kitchen','laundry','drinking','toilet'];
const COLORS  = ['#38bdf8','#22d3ee','#818cf8','#4ade80','#fbbf24'];
const LABELS  = ['Shower','Kitchen','Laundry','Drinking','Toilet'];

const TooltipBox = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="tt-box">
      <div className="tt-label">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="tt-row" style={{ color: p.color || '#38bdf8' }}>
          {p.name}: <strong>{p.value} L</strong>
        </div>
      ))}
    </div>
  );
};

function DonutChart({ todayUsage }) {
  const cats = CATS.map((c, i) => ({ id: c, name: LABELS[i], color: COLORS[i], val: todayUsage?.[c] || 0 }));
  const total = cats.reduce((a, c) => a + c.val, 0);
  const size = 130; const cx = 65; const cy = 65; const r = 50; const ir = 34;
  let angle = -Math.PI / 2;

  const slices = cats.map(c => {
    const frac = total > 0 ? c.val / total : 0;
    const sweep = frac * 2 * Math.PI;
    const ea = angle + sweep;
    const large = sweep > Math.PI ? 1 : 0;
    const path = sweep > 0.01
      ? `M ${cx + r*Math.cos(angle)} ${cy + r*Math.sin(angle)} A ${r} ${r} 0 ${large} 1 ${cx + r*Math.cos(ea)} ${cy + r*Math.sin(ea)} L ${cx + ir*Math.cos(ea)} ${cy + ir*Math.sin(ea)} A ${ir} ${ir} 0 ${large} 0 ${cx + ir*Math.cos(angle)} ${cy + ir*Math.sin(angle)} Z`
      : '';
    angle = ea;
    return { ...c, path };
  });

  return (
    <div className="donut-wrap">
      <div className="donut-svg-wrap" style={{ position:'relative', width: size, height: size, flexShrink:0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Category donut chart">
          {slices.map(s => s.path && <path key={s.id} d={s.path} fill={s.color} opacity={0.9}><title>{s.name}: {s.val} L</title></path>)}
        </svg>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center' }}>
          <div style={{ fontSize:18, fontWeight:700, fontFamily:'var(--font-mono)', color:'var(--text)', lineHeight:1 }}>{total}</div>
          <div style={{ fontSize:9, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.5px', marginTop:2 }}>litres</div>
        </div>
      </div>
      <div className="donut-legend">
        {cats.map(c => {
          const pct = total > 0 ? Math.round(c.val / total * 100) : 0;
          return (
            <div className="leg-row" key={c.id}>
              <div className="leg-dot" style={{ background: c.color }} />
              <span className="leg-name">{c.name}</span>
              <div className="leg-bar"><div className="leg-fill" style={{ width:`${pct}%`, background:c.color }} /></div>
              <span className="leg-val">{c.val}L</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function UsageCharts({ weekData, todayUsage, view }) {
  const lineData = weekData.map(d => ({
    day: d.date ? d.date.slice(5) : '',
    usage: d.total || 0,
  }));

  const avgTotal = weekData.length
    ? Math.round(weekData.reduce((a, d) => a + (d.total || 0), 0) / weekData.length)
    : 0;

  return (
    <>
      <div className="charts-row">
        {/* Line chart */}
        <div className="card fade-in-up">
          <div className="card-title">
            {view === 'daily' ? 'This week — daily usage' : 'Weekly overview'}
            <span className="card-subtitle">avg {avgTotal} L/day</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={lineData} margin={{ top:5, right:10, left:-10, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="day" tick={{ fill:'#7ab8d4', fontSize:11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill:'#7ab8d4', fontSize:11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}L`} />
              <Tooltip content={<TooltipBox />} />
              <Line type="monotone" dataKey="usage" name="Usage" stroke="#38bdf8"
                strokeWidth={2.5} dot={{ r:3, fill:'#38bdf8' }} activeDot={{ r:5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart */}
        <div className="card fade-in-up" style={{ animationDelay:'.1s' }}>
          <div className="card-title">Today's categories</div>
          <DonutChart todayUsage={todayUsage} />
        </div>
      </div>

      {/* Bar chart */}
      <div className="card fade-in-up" style={{ marginBottom:20, animationDelay:'.15s' }}>
        <div className="card-title">Weekly bar chart</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={lineData} margin={{ top:5, right:10, left:-10, bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill:'#7ab8d4', fontSize:11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill:'#7ab8d4', fontSize:11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}L`} />
            <Tooltip content={<TooltipBox />} />
            <Bar dataKey="usage" name="Usage" radius={[6,6,0,0]}>
              {lineData.map((d, i) => (
                <Cell key={i} fill={d.usage > avgTotal * 1.2 ? 'rgba(248,113,114,0.75)' : 'rgba(14,165,233,0.8)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
