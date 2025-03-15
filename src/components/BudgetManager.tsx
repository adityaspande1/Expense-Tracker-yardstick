import  { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export interface Transaction {
    date: string;
    type: string;
    category: string;
    amount: number;
  }

  export interface Budget {
    category: string;
    amount: number;
    month: string;
  }

const categories = [
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Other'
];

function BudgetManager() {


  const [budgets, setBudgets] = useState<Budget[]>([]);

  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [newBudget, setNewBudget] = useState({
    category: 'Food',
    amount: '',
    month: selectedMonth
  });

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const fetchData = async () => {
    const [budgetsRes, transactionsRes] = await Promise.all([
      axios.get('https://backend-yardstick.onrender.com/api/budgets'),
      axios.get('https://backend-yardstick.onrender.com/api/transactions')
    ]);

    setBudgets(budgetsRes.data);
    setTransactions(transactionsRes.data);
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    try {
      await axios.post('https://backend-yardstick.onrender.com/api/budgets', {
        ...newBudget,
        amount: parseFloat(newBudget.amount),
        month: new Date(newBudget.month)
      });
      
      setNewBudget({
        category: 'Food',
        amount: '',
        month: selectedMonth
      });
      
      fetchData();
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const getBudgetVsActual = () => {
    const monthStart = new Date(selectedMonth);
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);

    const monthlyTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= monthStart && date <= monthEnd && t.type === 'expense';
    });

    return categories.map(category => {
      const budget = budgets.find(b => 
        b.category === category && 
        format(new Date(b.month), 'yyyy-MM') === selectedMonth
      )?.amount || 0;

      const actual = monthlyTransactions
        .filter(t => t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        category,
        budget,
        actual,
        remaining: budget - actual
      };
    });
  };

  const budgetData = getBudgetVsActual();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Budget Manager</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Set Budget</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={newBudget.category}
                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                step="0.01"
                value={newBudget.amount}
                onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Month</label>
              <input
                type="month"
                value={newBudget.month}
                onChange={(e) => setNewBudget({ ...newBudget, month: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Set Budget
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Budget vs Actual</h2>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          
          />
        </div>

        <div className="overflow-x-auto">
          <BarChart width={800} height={400} data={budgetData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="budget" fill="#8884d8" name="Budget" />
            <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
          </BarChart>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Budget Summary</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {budgetData.map((item) => (
                  <tr key={item.category}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${item.budget.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${item.actual.toFixed(2)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap ${
                      item.remaining >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      ${item.remaining.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetManager;