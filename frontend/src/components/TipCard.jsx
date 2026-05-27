import React, { useState } from 'react';

const TIPS = [
  { text: "Fix leaking taps — a dripping tap wastes up to 15 litres per day. In Pune's summer heat, every litre counts.", tag: "Maintenance" },
  { text: "Collect and reuse AC condensate water for mopping or watering plants. AC units can generate 5–10 L daily.", tag: "Reuse" },
  { text: "Bucket-bathe instead of showering — saves up to 100 litres per session during peak summer months.", tag: "Shower" },
  { text: "Run washing machines only on full load. A half-load wastes 30–40 litres unnecessarily.", tag: "Laundry" },
  { text: "Water plants in the early morning or evening to reduce evaporation by up to 60%.", tag: "Garden" },
  { text: "Install a low-flow faucet aerator — cuts kitchen water use by 30% with no performance loss.", tag: "Kitchen" },
  { text: "Use a broom instead of a hosepipe to clean driveways. Saves 100+ litres each time.", tag: "Outdoor" },
];

export default function TipCard() {
  const [idx, setIdx] = useState(0);
  const tip = TIPS[idx];

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--b2), var(--b3))',
      border: '1px solid var(--border2)', borderRadius: 'var(--r2)',
      padding: '18px 22px', marginBottom: 20, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ fontSize: 10, color: 'var(--c1)', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
        💡 Daily tip — India / Summer
      </div>
      <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.65, marginBottom: 12, maxWidth: 560 }}>
        {tip.text}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
        <span style={{ background: 'rgba(56,189,248,.15)', color: 'var(--c1)', fontSize: 11, padding: '2px 10px', borderRadius: 20, border: '1px solid var(--border2)', fontFamily: 'var(--font-mono)' }}>{tip.tag}</span>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>📍 Pune, Maharashtra · Summer tips active</span>
      </div>
      <button className="btn-secondary" onClick={() => setIdx(i => (i + 1) % TIPS.length)}>
        Next tip ↻
      </button>
    </div>
  );
}
