import { Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import CustomerRegister from './pages/CustomerRegister.jsx';
import SalesCustomers from './pages/SalesCustomers.jsx';
import SalesCustomerDetail from './pages/SalesCustomerDetail.jsx';
import SalesInvoices from './pages/SalesInvoices.jsx';
import ManagerDashboard from './pages/ManagerDashboard.jsx';
import ManagerCustomers from './pages/ManagerCustomers.jsx';

const ROLES = {
  sales: { label: 'Sales Staff', paths: ['/sales/customers', '/sales/invoices'] },
  manager: { label: 'Store Manager', paths: ['/manager/dashboard', '/manager/customers'] },
};

function Shell({ role, children }) {
  const { label, paths } = ROLES[role];
  const titles = {
    '/sales/customers': 'Customers',
    '/sales/invoices': 'Invoices',
    '/manager/dashboard': 'Dashboard',
    '/manager/customers': 'Customer Directory',
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>CRM</h1>
        <p className="role">{label}</p>
        <nav>
          {paths.map((p) => (
            <NavLink key={p} to={p} className={({ isActive }) => (isActive ? 'active' : '')}>
              {titles[p]}
            </NavLink>
          ))}
          <NavLink to="/">← Home</NavLink>
        </nav>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}

function SalesLayout() {
  const loc = useLocation();
  const isDetail = /\/sales\/customers\/.+/.test(loc.pathname);
  return (
    <Shell role="sales">
      <Routes>
        <Route path="customers" element={<SalesCustomers />} />
        <Route path="customers/:id" element={<SalesCustomerDetail />} />
        <Route path="invoices" element={<SalesInvoices />} />
        {!isDetail && <Route path="*" element={<Navigate to="customers" replace />} />}
      </Routes>
    </Shell>
  );
}

function ManagerLayout() {
  return (
    <Shell role="manager">
      <Routes>
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="customers" element={<ManagerCustomers />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Shell>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<CustomerRegister />} />
      <Route path="/sales/*" element={<SalesLayout />} />
      <Route path="/manager/*" element={<ManagerLayout />} />
    </Routes>
  );
}
