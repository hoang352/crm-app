import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="landing">
      <h1>CRM System</h1>
      <p>Customer registration, sales operations, and store analytics in one place.</p>
      <div className="roles">
        <Link to="/register">
          <strong>Customer</strong>
          <span>Register your personal information on the website</span>
        </Link>
        <Link to="/sales/customers">
          <strong>Sales Staff</strong>
          <span>Manage customers, create invoices, view interaction history</span>
        </Link>
        <Link to="/manager/dashboard">
          <strong>Store Manager</strong>
          <span>Revenue, invoice counts, customer directory & analytics</span>
        </Link>
      </div>
    </div>
  );
}
