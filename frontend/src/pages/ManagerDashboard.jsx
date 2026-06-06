import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function ManagerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getDashboard().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="alert error">{error}</div>;
  if (!data) return <p>Loading dashboard…</p>;

  return (
    <>
      <h1 className="page-title">Store Dashboard</h1>
      <div className="grid-3">
        <div className="stat-card">
          <div className="label">Total customers</div>
          <div className="value">{data.totalCustomers}</div>
        </div>
        <div className="stat-card">
          <div className="label">Invoices processed</div>
          <div className="value">{data.totalInvoices}</div>
        </div>
        <div className="stat-card">
          <div className="label">Overall revenue</div>
          <div className="value">${data.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '0.75rem' }}>Spending segments</h3>
          <table>
            <thead><tr><th>Segment</th><th>Customers</th></tr></thead>
            <tbody>
              {data.segments.map((s) => (
                <tr key={s.label}><td>{s.label}</td><td>{s.count}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '0.75rem' }}>Lead sources</h3>
          <table>
            <thead><tr><th>Source</th><th>Count</th></tr></thead>
            <tbody>
              {data.leadSources.map((l) => (
                <tr key={l.source}><td>{l.source}</td><td>{l.count}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
