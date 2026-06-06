import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, segmentFromSpending } from '../api.js';

const empty = {
  fullName: '',
  phone: '',
  email: '',
  gender: 'prefer_not_to_say',
  dateOfBirth: '',
  address: '',
  leadSource: 'walk_in',
};

export default function SalesCustomers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    setCustomers(await api.getCustomers());
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  function update(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await api.createCustomer(form);
      setForm(empty);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Customer Management</h1>
        <button type="button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add customer'}
        </button>
      </div>
      {error && <div className="alert error">{error}</div>}
      {showForm && (
        <form className="card form-grid" onSubmit={handleCreate} style={{ marginBottom: '1.5rem' }}>
          <label>Full name *<input name="fullName" value={form.fullName} onChange={update} required /></label>
          <label>Phone *<input name="phone" value={form.phone} onChange={update} required /></label>
          <label>Email *<input name="email" type="email" value={form.email} onChange={update} required /></label>
          <label>
            Lead source
            <select name="leadSource" value={form.leadSource} onChange={update}>
              <option value="walk_in">Walk-in</option>
              <option value="referral">Referral</option>
              <option value="social">Social media</option>
              <option value="phone">Phone</option>
              <option value="website">Website</option>
            </select>
          </label>
          <label>Gender
            <select name="gender" value={form.gender} onChange={update}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </label>
          <label>Date of birth<input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={update} /></label>
          <label>Address<textarea name="address" value={form.address} onChange={update} /></label>
          <button type="submit">Save profile</button>
        </form>
      )}
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Lead source</th>
              <th>Orders</th>
              <th>Spending</th>
              <th>Segment</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id}>
                <td>{c.fullName}</td>
                <td>{c.phone}<br /><span style={{ color: 'var(--muted)' }}>{c.email}</span></td>
                <td>{c.leadSource}</td>
                <td>{c.orderCount}</td>
                <td>${c.totalSpending?.toLocaleString()}</td>
                <td><span className={`badge ${segmentFromSpending(c.totalSpending)}`}>{segmentFromSpending(c.totalSpending)}</span></td>
                <td><Link to={`/sales/customers/${c._id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
