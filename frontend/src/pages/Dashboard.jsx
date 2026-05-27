import React, { useState, useEffect, useCallback } from 'react';
import Navbar      from '../components/Navbar';
import MetricCards from '../components/MetricCards';
import TipCard     from '../components/TipCard';
import UsageCharts from '../components/UsageCharts';
import ManualInput from '../components/ManualInput';
import GoalSetter  from '../components/GoalSetter';
import Badges      from '../components/Badges';
import api         from '../api';
import { useToast } from '../context/ToastContext';
import './Dashboard.css';

export default function Dashboard() {
  const { addToast } = useToast();
  const [view, setView]           = useState('daily');
  const [todayUsage, setTodayUsage] = useState(null);
  const [weekData, setWeekData]   = useState([]);
  const [goal, setGoal]           = useState(150);
  const [loading, setLoading]     = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [todayRes, weekRes, goalRes] = await Promise.all([
        api.get('/usage/today'),
        api.get('/usage/week'),
        api.get('/goal'),
      ]);
      setTodayUsage(todayRes.data.usage);
      setWeekData(weekRes.data.week);
      setGoal(goalRes.data.goal.dailyGoal);
    } catch {
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSaved = (usage) => {
    setTodayUsage(usage);
    fetchData();
  };

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="loading-drop">💧</div>
        <div className="loading-text">Loading your dashboard…</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard">
        <Navbar view={view} setView={setView} />

        <MetricCards todayUsage={todayUsage} weekData={weekData} view={view} />

        <TipCard />

        <UsageCharts weekData={weekData} todayUsage={todayUsage} view={view} />

        <div className="bottom-grid">
          <ManualInput todayUsage={todayUsage} onSaved={handleSaved} />
          <GoalSetter todayUsage={todayUsage} onGoalUpdated={g => setGoal(g)} />
        </div>

        <Badges weekData={weekData} goal={goal} />

        <footer className="dash-footer">
          AquaTrack · Water Usage Awareness · Pune, Maharashtra, India
        </footer>
      </div>
    </div>
  );
}
