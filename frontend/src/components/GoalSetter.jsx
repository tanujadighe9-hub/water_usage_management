import React, { useState, useEffect } from 'react';
import api from '../api';
import { useToast } from '../context/ToastContext';
import './GoalSetter.css';

export default function GoalSetter({ todayUsage, onGoalUpdated }) {
  const { addToast } = useToast();
  const [dailyGoal, setDailyGoal] = useState(150);
  const [inputVal, setInputVal] = useState(150);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/goal').then(r => {
      setDailyGoal(r.data.goal.dailyGoal);
      setInputVal(r.data.goal.dailyGoal);
    }).catch(() => {});
  }, []);

  const todayTotal = todayUsage?.total || 0;
  const pct = dailyGoal > 0 ? Math.min(Math.round((todayTotal / dailyGoal) * 100), 100) : 0;
  const isOver = todayTotal > dailyGoal;
  const remaining = Math.max(dailyGoal - todayTotal, 0);

  const saveGoal = async () => {
    if (!inputVal || inputVal < 1) { addToast('Enter a valid goal (min 1 L)', 'error'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/goal', { dailyGoal: inputVal });
      setDailyGoal(data.goal.dailyGoal);
      addToast(`Daily goal set to ${data.goal.dailyGoal} L!`, 'success');
      if (onGoalUpdated) onGoalUpdated(data.goal.dailyGoal);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to set goal', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card fade-in-up goal-card">
      <div className="card-title">Daily Goal</div>

      <div className="goal-stats-row">
        <div>
          <div className="goal-used">{todayTotal} <span>L used</span></div>
          <div className="goal-limit">of {dailyGoal} L goal</div>
        </div>
        <div className={`goal-status-badge ${isOver ? 'over' : 'ok'}`}>
          {isOver ? '⚠ Over limit' : '✓ On track'}
        </div>
      </div>

      <div className="goal-bar-wrap">
        <div
          className={`goal-bar ${isOver ? 'goal-bar-over' : 'goal-bar-ok'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="goal-bar-labels">
        <span>{pct}% used</span>
        <span>{isOver ? `${todayTotal - dailyGoal} L over` : `${remaining} L remaining`}</span>
      </div>

      {isOver && (
        <div className="goal-alert-inline">
          🔴 You have exceeded your daily goal of {dailyGoal} L. Try to reduce usage in remaining activities.
        </div>
      )}

      <div className="goal-set-row">
        <label className="goal-set-label">Set new goal (L/day):</label>
        <input
          type="number" className="goal-input" min="1" max="1000"
          value={inputVal}
          onChange={e => setInputVal(parseInt(e.target.value) || '')}
        />
        <button className="btn-secondary" onClick={saveGoal} disabled={loading}>
          {loading ? '…' : 'Set'}
        </button>
      </div>

      <div className="goal-quick-btns">
        {[50, 100, 150, 200].map(v => (
          <button key={v} className={`goal-quick ${inputVal === v ? 'active' : ''}`}
            onClick={() => setInputVal(v)}>{v} L</button>
        ))}
      </div>
    </div>
  );
}
