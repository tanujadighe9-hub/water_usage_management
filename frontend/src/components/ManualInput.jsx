import React, { useState, useEffect } from 'react';
import api from '../api';
import { useToast } from '../context/ToastContext';
import './ManualInput.css';

const CATS = [
  { id: 'shower',   name: 'Shower',   icon: '🚿' },
  { id: 'kitchen',  name: 'Kitchen',  icon: '🍳' },
  { id: 'laundry',  name: 'Laundry',  icon: '👕' },
  { id: 'drinking', name: 'Drinking', icon: '💧' },
  { id: 'toilet',   name: 'Toilet',   icon: '🚽' },
];

export default function ManualInput({ todayUsage, onSaved }) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ shower:0, kitchen:0, laundry:0, drinking:0, toilet:0 });

  useEffect(() => {
    if (todayUsage) {
      setValues({
        shower:   todayUsage.shower   || 0,
        kitchen:  todayUsage.kitchen  || 0,
        laundry:  todayUsage.laundry  || 0,
        drinking: todayUsage.drinking || 0,
        toilet:   todayUsage.toilet   || 0,
      });
    }
  }, [todayUsage]);

  const total = Object.values(values).reduce((a, v) => a + (Number(v) || 0), 0);

  const save = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/usage', values);

      // Goal alert
      if (data.alert?.type === 'over') {
        addToast(`⚠ ${data.alert.message}`, 'error', 6000);
      } else if (data.alert?.type === 'under') {
        addToast(`✓ ${data.alert.message}`, 'success', 5000);
      }

      // Yesterday comparison
      if (data.comparison?.type === 'less') {
        addToast(`🎉 Congratulations! ${data.comparison.message}`, 'success', 6000);
      } else if (data.comparison?.type === 'more') {
        addToast(`📈 ${data.comparison.message}`, 'warning', 5000);
      }

      if (!data.alert && !data.comparison) {
        addToast('Usage logged successfully!', 'success');
      }

      onSaved(data.usage);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save usage', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card fade-in-up manual-card">
      <div className="card-title">Log today's usage</div>

      <div className="input-list">
        {CATS.map(cat => (
          <div className="input-row" key={cat.id}>
            <label className="input-label">
              <span className="cat-icon">{cat.icon}</span>
              {cat.name}
            </label>
            <div className="input-right">
              <input
                type="number" className="input-num"
                value={values[cat.id]} min="0" max="500"
                onChange={e => setValues(p => ({ ...p, [cat.id]: parseInt(e.target.value) || 0 }))}
              />
              <span className="input-unit">L</span>
            </div>
          </div>
        ))}
      </div>

      <div className="input-total">
        Total today: <span>{total} L</span>
      </div>

      <button className="btn-primary" onClick={save} disabled={loading}>
        {loading ? 'Saving…' : 'Save Usage'}
      </button>
    </div>
  );
}
