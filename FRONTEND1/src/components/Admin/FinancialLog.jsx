import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useProductsStore } from '../../store/useProductsStore';
import useFinancialStore from '../../store/useFinancialStore';

const FinancialLogForm = () => {
  const { createLog, loading } = useFinancialStore();
  const { products, getProductsByDate } = useProductsStore();

  const [date, setDate] = useState('');
  const [productsTotal, setProductsTotal] = useState(0);
  const [netTotal, setNetTotal] = useState(0);

  const [income, setIncome] = useState({
    zdollar: '',
    zcash: '',
    edahabCash: '',
    Cash: '',
    dollar: '',
    account: '',
  });

  const [accountsAdjustments, setAccountsAdjustments] = useState([
    { label: '', value: '' }
  ]);

  const [expenses, setExpenses] = useState([
    { name: '', amount: '' }
  ]);

  useEffect(() => {
    if (date) {
      getProductsByDate(date);
    }
  }, [date, getProductsByDate]);

  useEffect(() => {
    const productsSum = products.reduce((sum, product) => {
      return sum + (product.price || 0) * (product.quantity || 1);
    }, 0);
    setProductsTotal(productsSum);

    const incomeSum = Object.values(income).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    const adjustmentsSum = accountsAdjustments.reduce((sum, adj) => sum + (parseFloat(adj.value) || 0), 0);
    const expensesSum = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);

    setNetTotal((incomeSum + adjustmentsSum + expensesSum) - productsSum);
  }, [products, income, accountsAdjustments, expenses]);

  const handleIncomeChange = (e) => {
    const { name, value } = e.target;
    setIncome({ ...income, [name]: value });
  };

  const handleAdjustmentChange = (index, e) => {
    const { name, value } = e.target;
    const updates = [...accountsAdjustments];
    updates[index][name] = value;
    setAccountsAdjustments(updates);
  };

  const handleExpenseChange = (index, e) => {
    const { name, value } = e.target;
    const updates = [...expenses];
    updates[index][name] = value;
    setExpenses(updates);
  };

  const addAdjustment = () => setAccountsAdjustments([...accountsAdjustments, { label: '', value: '' }]);
  const addExpense = () => setExpenses([...expenses, { name: '', amount: '' }] );
  const removeAdjustment = (index) => setAccountsAdjustments(accountsAdjustments.filter((_, i) => i !== index));
  const removeExpense = (index) => setExpenses(expenses.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedIncome = Object.fromEntries(
      Object.entries(income).map(([key, val]) => [key, parseFloat(val) || 0])
    );

    const parsedAdjustments = accountsAdjustments
      .filter(adj => adj.value)
      .map(adj => ({ label: adj.label || 'Acc', value: parseFloat(adj.value) || 0 }));

    const parsedExpenses = expenses
      .filter(exp => exp.amount)
      .map(exp => ({ name: exp.name || 'Expense', amount: parseFloat(exp.amount) || 0 }));

    const payload = {
      date,
      income: parsedIncome,
      accountsAdjustments: parsedAdjustments,
      expenses: parsedExpenses,
    };

    const res = await createLog(payload);

    if (res.success) {
      toast.success("Financial log saved");
      setDate('');
      setIncome({ zdollar: '', zcash: '', edahabCash: '', Cash: '', dollar: '', account: '' });
      setAccountsAdjustments([{ label: '', value: '' }]);
      setExpenses([{ name: '', amount: '' }]);
    } else {
      toast.error("Failed to save financial log");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Create Financial Log</h2>

      {/* Date Field */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Log Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-black rounded-md placeholder:text-black focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Product Costs:</span>
            <span className="font-semibold text-red-600">-${productsTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Income Total:</span>
            <span className="font-semibold text-green-600">
              +${Object.values(income).reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Adjustments Total:</span>
            <span className="font-semibold text-blue-600">
              +${accountsAdjustments.reduce((sum, adj) => sum + (parseFloat(adj.value) || 0), 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Expenses Total:</span>
            <span className="font-semibold text-purple-600">
              +${expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700">Net Total:</span>
            <span className={`font-bold text-lg ${netTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Income Inputs */}
      <div>
        <h3 className="text-lg font-semibold text-indigo-600">Income</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.keys(income).map((key) => (
            <div key={key}>
              <label className="block text-sm text-gray-600 font-bold capitalize">{key}</label>
              <input
                type="number"
                name={key}
                value={income[key]}
                onChange={handleIncomeChange}
                className="w-full mt-1 p-2 border border-black rounded placeholder:text-black"
                placeholder={`Enter ${key}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Adjustments */}
      <div>
        <h3 className="text-lg font-semibold text-amber-600">Account Adjustments</h3>
        {accountsAdjustments.map((adj, index) => (
          <div key={index} className="grid grid-cols-5 gap-2 mb-2">
            <input
              name="label"
              placeholder="Label"
              className="col-span-2 p-2 border border-black rounded placeholder:text-black"
              value={adj.label}
              onChange={(e) => handleAdjustmentChange(index, e)}
            />
            <input
              name="value"
              placeholder="Value"
              type="number"
              className="col-span-2 p-2 border border-black rounded placeholder:text-black"
              value={adj.value}
              onChange={(e) => handleAdjustmentChange(index, e)}
            />
            <button type="button" onClick={() => removeAdjustment(index)} className="text-red-500">✕</button>
          </div>
        ))}
        <button type="button" onClick={addAdjustment} className="text-sm  border rounded-md bg-blue-800 p-2 text-white font-bold mt-1 ">
          + Add Adjustment
        </button>
      </div>

      {/* Expenses */}
      <div>
        <h3 className="text-lg font-semibold text-red-600">Expenses</h3>
        {expenses.map((exp, index) => (
          <div key={index} className="grid grid-cols-5 gap-2 mb-2">
            <input
              name="name"
              placeholder="Name"
              className="col-span-2 p-2 border border-black rounded placeholder:text-black"
              value={exp.name}
              onChange={(e) => handleExpenseChange(index, e)}
            />
            <input
              name="amount"
              placeholder="Amount"
              type="number"
              className="col-span-2 p-2 border border-black rounded placeholder:text-black"
              value={exp.amount}
              onChange={(e) => handleExpenseChange(index, e)}
            />
            <button type="button" onClick={() => removeExpense(index)} className="text-red-500">✕</button>
          </div>
        ))}
        <button type="button" onClick={addExpense} className="text-sm  border rounded-md bg-blue-800 p-2 text-white font-bold mt-1 ">
          + Add Expense
        </button>
      </div>

      <button
        type="submit"
        className={`bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Submit Log'}
      </button>
    </form>
  );
};

export default FinancialLogForm;
