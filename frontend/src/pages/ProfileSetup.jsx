import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api';
import './ProfileSetup.css';

export default function ProfileSetup({ isEdit = false }) {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '', age: '', city: '', householdSize: 1, phone: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        age: user.profile?.age || '',
        city: user.profile?.city || '',
        householdSize: user.profile?.householdSize || 1,
        phone: user.profile?.phone || '',
      });
    }
  }, [user]);

  const handle = e => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm(p => ({ ...p, [e.target.name]: val }));
  };

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/user/profile', {
        name: form.name,
        profile: { age: form.age, city: form.city, householdSize: form.householdSize, phone: form.phone },
      });
      await refreshUser();
      addToast(isEdit ? 'Profile updated successfully!' : 'Profile set up! Welcome aboard 🌊', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-page">
      <div className="setup-card fade-in-up">
        <div className="setup-header">
          <div className="setup-icon">👤</div>
          <div>
            <h2 className="setup-title">{isEdit ? 'Edit Profile' : 'Set Up Your Profile'}</h2>
            <p className="setup-sub">{isEdit ? 'Update your details below' : 'Tell us a bit about yourself to personalise your experience'}</p>
          </div>
        </div>

        <form onSubmit={submit} className="setup-form">
          <div className="setup-grid">
            <div className="form-group">
              <label>Full name *</label>
              <input className="auth-input" type="text" name="name"
                value={form.name} onChange={handle} required placeholder="Your full name" />
            </div>
            <div className="form-group">
              <label>Phone number</label>
              <input className="auth-input" type="tel" name="phone"
                value={form.phone} onChange={handle} placeholder="+91 9876543210" />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input className="auth-input" type="number" name="age"
                value={form.age} onChange={handle} placeholder="e.g. 28" min="1" max="120" />
            </div>
            <div className="form-group">
              <label>City</label>
              <input className="auth-input" type="text" name="city"
                value={form.city} onChange={handle} placeholder="e.g. Pune" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Household size (number of people)</label>
              <input className="auth-input" type="number" name="householdSize"
                value={form.householdSize} onChange={handle} min="1" max="20" />
              <span className="field-hint">Helps us calculate per-person water usage</span>
            </div>
          </div>

          <div className="setup-actions">
            {isEdit && (
              <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
            )}
            <button className="btn-primary" type="submit" disabled={loading}
              style={{ flex: 1 }}>
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Save & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
