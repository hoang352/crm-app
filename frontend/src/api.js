// Local: Vite proxies /api → localhost:5000. Production: set VITE_API_URL in Vercel.
const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export const api = {
  registerCustomer: (body) => request('/customers/register', { method: 'POST', body: JSON.stringify(body) }),
  getCustomers: () => request('/customers'),
  getCustomer: (id) => request(`/customers/${id}`),
  createCustomer: (body) => request('/customers', { method: 'POST', body: JSON.stringify(body) }),
  updateCustomer: (id, body) => request(`/customers/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  addCareNote: (id, body) => request(`/customers/${id}/notes`, { method: 'POST', body: JSON.stringify(body) }),
  getInvoices: (customerId) => request(customerId ? `/invoices?customerId=${customerId}` : '/invoices'),
  createInvoice: (body) => request('/invoices', { method: 'POST', body: JSON.stringify(body) }),
  getDashboard: () => request('/dashboard/summary'),
};

export function segmentFromSpending(total) {
  if (total >= 10000) return 'platinum';
  if (total >= 5000) return 'gold';
  if (total >= 1000) return 'silver';
  return 'bronze';
}
