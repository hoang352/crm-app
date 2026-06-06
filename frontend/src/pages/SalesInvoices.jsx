import { useEffect, useState } from 'react';
import { api } from '../api.js';

const emptyProduct = { name: '', quantity: 1, unitPrice: 0 };

export default function SalesInvoices() {
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [products, setProducts] = useState([{ ...emptyProduct }]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function load() {
    const [c, inv] = await Promise.all([api.getCustomers(), api.getInvoices()]);
    setCustomers(c);
    setInvoices(inv);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  const computedTotal = products.reduce((s, p) => s + Number(p.quantity) * Number(p.unitPrice), 0);

  function updateProduct(i, field, value) {
    setProducts((rows) => rows.map((r, j) => (j === i ? { ...r, [field]: value } : r)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await api.createInvoice({
        customerId,
        products: products.map((p) => ({
          name: p.name,
          quantity: Number(p.quantity),
          unitPrice: Number(p.unitPrice),
        })),
        totalAmount: computedTotal,
        paymentMethod,
        notes,
      });
      setMessage('Invoice created. Customer order count and spending were updated automatically.');
      setProducts([{ ...emptyProduct }]);
      setNotes('');
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h1 className="page-title">Invoice Management</h1>
      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}
      <form className="card" onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <div className="form-grid">
          <label>
            Customer *
            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
              <option value="">Select customer…</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>{c.fullName} — {c.phone}</option>
              ))}
            </select>
          </label>
        </div>
        <h3 style={{ margin: '1rem 0 0.5rem' }}>Products</h3>
        {products.map((p, i) => (
          <div key={i} className="product-row">
            <input placeholder="Product name" value={p.name} onChange={(e) => updateProduct(i, 'name', e.target.value)} required />
            <input type="number" min="1" placeholder="Qty" value={p.quantity} onChange={(e) => updateProduct(i, 'quantity', e.target.value)} />
            <input type="number" min="0" step="0.01" placeholder="Unit price" value={p.unitPrice} onChange={(e) => updateProduct(i, 'unitPrice', e.target.value)} />
            {products.length > 1 && (
              <button type="button" className="secondary" onClick={() => setProducts(products.filter((_, j) => j !== i))}>×</button>
            )}
          </div>
        ))}
        <button type="button" className="secondary" style={{ marginBottom: '1rem' }} onClick={() => setProducts([...products, { ...emptyProduct }])}>
          + Add line
        </button>
        <div className="form-grid">
          <label>
            Payment method
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank transfer</option>
              <option value="e_wallet">E-wallet</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Notes
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
        </div>
        <p style={{ margin: '1rem 0', fontWeight: 600 }}>Total: ${computedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        <button type="submit">Generate invoice</button>
      </form>
      <div className="card table-wrap">
        <h3 style={{ marginBottom: '0.75rem' }}>Recent invoices</h3>
        <table>
          <thead>
            <tr><th>Date</th><th>Customer</th><th>Amount</th><th>Payment</th></tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id}>
                <td>{new Date(inv.createdAt).toLocaleString()}</td>
                <td>{inv.customer?.fullName}</td>
                <td>${inv.totalAmount?.toLocaleString()}</td>
                <td>{inv.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
