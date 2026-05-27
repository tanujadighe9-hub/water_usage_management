import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      addToast('Passwords do not match', 'error'); return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name, email: form.email, password: form.password,
      });
      login(data.token, data.user);
      addToast('Registration successful! Welcome to AquaTrack 🎉', 'success');
      navigate('/profile/setup');
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in-up">
        <div className="auth-logo">
          <div className="auth-drop-icon"><div className="drop-shape" /></div>
          <div>
            <div className="auth-brand">AquaTrack</div>
            <div className="auth-tagline">WATER AWARENESS</div>
          </div>
        </div>
        <h2 className="auth-title">Create account</h2>
        <p className="auth-sub">Start tracking your water usage today</p>

        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label>Full name</label>
            <input className="auth-input" type="text" name="name"
              placeholder="Your name" value={form.name} onChange={handle} required />
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input className="auth-input" type="email" name="email"
              placeholder="you@example.com" value={form.email} onChange={handle} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="auth-input" type="password" name="password"
              placeholder="At least 6 characters" value={form.password} onChange={handle} required />
          </div>
          <div className="form-group">
            <label>Confirm password</label>
            <input className="auth-input" type="password" name="confirm"
              placeholder="Repeat password" value={form.confirm} onChange={handle} required />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
