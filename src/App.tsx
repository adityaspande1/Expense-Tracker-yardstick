import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import './App.css';
import TransactionList from './components/TransactionList';
import BudgetManager from './components/BudgetManager';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionList />} />
            <Route path="/budgets" element={<BudgetManager />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;