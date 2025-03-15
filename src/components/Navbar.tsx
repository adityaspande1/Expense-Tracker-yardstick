
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListOrdered, PieChart } from 'lucide-react';

function Navbar() {
  const location = useLocation();

  const isActive = (path:any) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold">Finance Tracker</span>
          </div>
          <div className="ml-10 flex space-x-4">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Dashboard
            </Link>
            <Link
              to="/transactions"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/transactions')}`}
            >
              <ListOrdered className="w-5 h-5 mr-2" />
              Transactions
            </Link>
            <Link
              to="/budgets"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/budgets')}`}
            >
              <PieChart className="w-5 h-5 mr-2" />
              Budgets
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;