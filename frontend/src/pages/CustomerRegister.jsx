import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

const empty = {
  fullName: '',
  phone: '',
  email: '',
  gender: 'prefer_not_to_say',
  dateOfBirth: '',
  address: '',
};

export default function CustomerRegister() {
  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      await api.registerCustomer(form);
      setMessage('Registration successful! Thank you for joining us.');
      setForm(empty);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="main" style={{ maxWidth: 560, margin: '0 auto' }}>
      <p><Link to="/">← Back</Link></p>
      <h1 className="page-title">Customer Registration</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
        Enter your details below. Information is saved to our customer database upon submission.
      </p>
      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}
      <form className="card form-grid" onSubmit={handleSubmit}>
        <label>
          Full name *
          <input name="fullName" value={form.fullName} onChange={update} required />
        </label>
        <label>
          Phone *
          <input name="phone" type="tel" value={form.phone} onChange={update} required />
        </label>
        <label>
          Email *
          <input name="email" type="email" value={form.email} onChange={update} required />
        </label>
        <label>
          Gender
          <select name="gender" value={form.gender} onChange={update}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </label>
        <label>
          Date of birth
          <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={update} />
        </label>
        <label>
          Address
          <textarea name="address" value={form.address} onChange={update} />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Submitting…' : 'Register'}</button>
      </form>
    </div>
  );
}
