import { useEffect, useState } from 'react';
import { api, segmentFromSpending } from '../api.js';

export default function ManagerCustomers() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getCustomers().then(setCustomers).catch((e) => setError(e.message));
  }, []);

  const totalRevenue = customers.reduce((s, c) => s + (c.totalSpending || 0), 0);

  return (
    <>
      <h1 className="page-title">Customer Directory</h1>
      {error && <div className="alert error">{error}</div>}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="label">Directory size</div>
          <div className="value">{customers.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Combined customer LTV</div>
          <div className="value">${totalRevenue.toLocaleString()}</div>
        </div>
      </div>
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Lead source</th>
              <th>Orders</th>
              <th>Revenue</th>
              <th>Segment</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id}>
                <td>{c.fullName}</td>
                <td>{c.email}<br />{c.phone}</td>
                <td>{c.leadSource}</td>
                <td>{c.orderCount}</td>
                <td>${c.totalSpending?.toLocaleString()}</td>
                <td><span className={`badge ${segmentFromSpending(c.totalSpending)}`}>{segmentFromSpending(c.totalSpending)}</span></td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
