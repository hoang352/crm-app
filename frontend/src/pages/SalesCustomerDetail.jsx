import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, segmentFromSpending } from '../api.js';

export default function SalesCustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [note, setNote] = useState('');
  const [error, setError] = useState(null);

  async function load() {
    const [c, inv] = await Promise.all([api.getCustomer(id), api.getInvoices(id)]);
    setCustomer(c);
    setInvoices(inv);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [id]);

  async function addNote(e) {
    e.preventDefault();
    if (!note.trim()) return;
    await api.addCareNote(id, { note });
    setNote('');
    await load();
  }

  if (!customer) return <p>{error || 'Loading…'}</p>;

  const segment = segmentFromSpending(customer.totalSpending);

  return (
    <>
      <p><Link to="/sales/customers">← Customers</Link></p>
      <h1 className="page-title">{customer.fullName}</h1>
      {error && <div className="alert error">{error}</div>}
      <div className="grid-3">
        <div className="stat-card">
          <div className="label">Segment</div>
          <div className="value"><span className={`badge ${segment}`}>{segment}</span></div>
        </div>
        <div className="stat-card">
          <div className="label">Total orders</div>
          <div className="value">{customer.orderCount}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total spending</div>
          <div className="value">${customer.totalSpending?.toLocaleString()}</div>
        </div>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: '0.75rem' }}>Contact details</h3>
        <p>Phone: {customer.phone}</p>
        <p>Email: {customer.email}</p>
        <p>Address: {customer.address || '—'}</p>
        <p>Lead source: {customer.leadSource}</p>
        <p>Gender: {customer.gender}</p>
        {customer.dateOfBirth && <p>DOB: {new Date(customer.dateOfBirth).toLocaleDateString()}</p>}
      </div>
      <div className="card">
        <h3 style={{ marginBottom: '0.75rem' }}>Customer care notes</h3>
        <form onSubmit={addNote} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.5rem' }}
            placeholder="Log a care note…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button type="submit">Add note</button>
        </form>
        {customer.careNotes?.length ? (
          <ul style={{ listStyle: 'none' }}>
            {[...customer.careNotes].reverse().map((n) => (
              <li key={n._id} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <div>{n.note}</div>
                <small style={{ color: 'var(--muted)' }}>
                  {new Date(n.createdAt).toLocaleString()} · {n.createdBy}
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: 'var(--muted)' }}>No notes yet.</p>
        )}
      </div>
      <div className="card">
        <h3 style={{ marginBottom: '0.75rem' }}>Interaction history (invoices)</h3>
        {invoices.length ? (
          <table>
            <thead>
              <tr><th>Date</th><th>Amount</th><th>Payment</th><th>Products</th></tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id}>
                  <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td>${inv.totalAmount?.toLocaleString()}</td>
                  <td>{inv.paymentMethod}</td>
                  <td>{inv.products.map((p) => `${p.name}×${p.quantity}`).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: 'var(--muted)' }}>No invoices yet.</p>
        )}
      </div>
    </>
  );
}
