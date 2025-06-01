import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Plus, Minus, Save, RefreshCw, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import useFinancialStore from '@/store/useFinancialStore';
import { useProductsStore } from '../../store/useProductsStore';
import toast from 'react-hot-toast';

const FinancialLogForm = () => {
  const { createLog, isLoading } = useFinancialStore();
  const { products, getDailyproducts } = useProductsStore();

  const [form, setForm] = useState({
    income: {
      zdollar: '',
      zcash: { raw: '', converted: '' },
      edahabCash: { raw: '', converted: '' },
      Cash: { raw: '', converted: '' },
      dollar: '',
      account: { raw: '', converted: '' },
    },
    accountsAdjustments: [],
    expenses: [],
  });

  const [totals, setTotals] = useState({
    incomeTotal: 0,
    expensesTotal: 0,
    adjustmentsTotal: 0,
    productsTotal: 0,
    combinedTotal: 0,
    balance: 0,
    grandTotal: 0,
  });

  const [activeTab, setActiveTab] = useState('income');

  // Calculate totals whenever form or products change
  useEffect(() => {
    const incomeTotal =
      (Number(form.income.zdollar) || 0) +
      (Number(form.income.dollar) || 0) +
      (Number(form.income.zcash.converted) || 0) +
      (Number(form.income.edahabCash.converted) || 0) +
      (Number(form.income.Cash.converted) || 0) +
      (Number(form.income.account.converted) || 0);

    const expensesTotal = form.expenses.reduce(
      (sum, exp) => sum + (Number(exp.amount) || 0),
      0
    );

    const adjustmentsTotal = form.accountsAdjustments.reduce(
      (sum, adj) => sum + (Number(adj.value) || 0),
      0
    );

    const productsTotal = products.reduce(
      (sum, p) => sum + (Number(p.price) * Number(p.quantity) || 0),
      0
    );

    const combinedTotal = incomeTotal + expensesTotal + adjustmentsTotal ;
    const balance = combinedTotal - productsTotal;

    setTotals({
      incomeTotal,
      expensesTotal,
      adjustmentsTotal,
      productsTotal,
      combinedTotal,
      balance,
    });
  }, [form, products]);

  // Helper to update nested form state by path string, e.g. "income.zcash.raw"
  const handleInputChange = (path, value) => {
    setForm((prev) => {
      const newForm = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newForm;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newForm;
    });
  };

  // Add a blank adjustment or expense item
  const addAdjustment = () => {
    setForm((prev) => ({
      ...prev,
      accountsAdjustments: [...prev.accountsAdjustments, { description: '', value: '' }],
    }));
  };
  const addExpense = () => {
    setForm((prev) => ({
      ...prev,
      expenses: [...prev.expenses, { description: '', amount: '' }],
    }));
  };

  // Handle adjustments or expenses input change
  const handleListChange = (type, index, field, value) => {
    setForm((prev) => {
      const newList = [...prev[type]];
      newList[index][field] = value;
      return { ...prev, [type]: newList };
    });
  };

  // Remove adjustment or expense item
  const removeListItem = (type, index) => {
    setForm((prev) => {
      const newList = [...prev[type]];
      newList.splice(index, 1);
      return { ...prev, [type]: newList };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert raw values that need conversion — 
    // For example, for amounts that have 'raw' and 'converted' fields, you may want to parse & calculate converted value here if needed.

    // You can add validation here if necessary.

    const result = await createLog(form);

    if (result.success) {
      toast.success('Financial log submitted successfully!');
      // Optionally reset form here
      setForm({
        income: {
          zdollar: '',
          zcash: { raw: '', converted: '' },
          edahabCash: { raw: '', converted: '' },
          Cash: { raw: '', converted: '' },
          dollar: '',
          account: { raw: '', converted: '' },
        },
        accountsAdjustments: [],
        expenses: [],
      });
    } else {
      alert('Error submitting financial log: ' + result.error);
    }
  };

  useEffect(() => {
    getDailyproducts()
  } , [getDailyproducts])
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 p-4">
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
            <motion.h2
              className="text-3xl font-bold text-white"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Financial Log Entry
            </motion.h2>
            <p className="mt-2 text-indigo-100">Record your daily financial transactions</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex">
              <button
                type="button"
                onClick={() => setActiveTab('income')}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm border-b-2 ${
                  activeTab === 'income'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <DollarSign className="inline mr-2 h-4 w-4" />
                Income
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('adjustments')}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm border-b-2 ${
                  activeTab === 'adjustments'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <RefreshCw className="inline mr-2 h-4 w-4" />
                Adjustments
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('expenses')}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm border-b-2 ${
                  activeTab === 'expenses'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Minus className="inline mr-2 h-4 w-4" />
                Expenses
              </button>
            </nav>
          </div>

          {/* Totals Summary */}
          <div className="bg-gray-100 p-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Combined Total</h3>
                <p className="text-xl font-bold text-indigo-600">${totals.combinedTotal.toFixed(2)}</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Balance</h3>
                <p className="text-xl font-bold text-green-600">${totals.balance.toFixed(2)}</p>
              </div>
             
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {activeTab === 'income' && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-indigo-700">Income</h3>

                {/* Example Income Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Zdollar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zaad Dollar
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.income.zdollar}
                      onChange={(e) => handleInputChange('income.zdollar', e.target.value)}
                      className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Dollar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dollar
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.income.dollar}
                      onChange={(e) => handleInputChange('income.dollar', e.target.value)}
                      className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* ZCash (raw and converted) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zaad Cash
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.income.zcash.raw}
                      onChange={(e) => handleInputChange('income.zcash.raw', e.target.value)}
                      className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zaad Cash Badal
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.income.zcash.converted}
                      onChange={(e) => handleInputChange('income.zcash.converted', e.target.value)}
                      className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Similarly, add edahabCash, Cash, account fields here */}
                  {/* EdahabCash */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Edahab Cash 
                    </label>
                    <input
                      type="text"
                      step="0.01"
                      value={form.income.edahabCash.raw}
                      onChange={(e) => handleInputChange('income.edahabCash.raw', e.target.value)}
                      className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Edahab Cash Badal
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.income.edahabCash.converted}
                      onChange={(e) => handleInputChange('income.edahabCash.converted', e.target.value)}
                      className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Cash */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cash 
                    </label>
                    <input
                      type="text"
                      step="0.01"
                      value={form.income.Cash.raw}
                      onChange={(e) => handleInputChange('income.Cash.raw', e.target.value)}
                      className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cash Badal
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.income.Cash.converted}
                      onChange={(e) => handleInputChange('income.Cash.converted', e.target.value)}
                      className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Account */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account 
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.income.account.raw}
                      onChange={(e) => handleInputChange('income.account.raw', e.target.value)}
                      className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Badal
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.income.account.converted}
                      onChange={(e) => handleInputChange('income.account.converted', e.target.value)}
                      className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'adjustments' && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-indigo-700">Account Adjustments</h3>

                {form.accountsAdjustments.map((adj, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 mb-3 items-center"
                  >
                    <input
                      type="text"
                      placeholder="Description"
                      value={adj.description}
                      onChange={(e) =>
                        handleListChange('accountsAdjustments', idx, 'description', e.target.value)
                      }
                      className="flex-1 rounded border border-gray-300 p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Value"
                      value={adj.value}
                      onChange={(e) =>
                        handleListChange('accountsAdjustments', idx, 'value', e.target.value)
                      }
                      className="w-32 rounded border border-gray-300 p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem('accountsAdjustments', idx)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove adjustment"
                    >
                      &times;
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addAdjustment}
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  <Plus size={16} /> Add Account
                </button>
              </div>
            )}

            {activeTab === 'expenses' && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-indigo-700">Expenses</h3>

                {form.expenses.map((exp, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 mb-3 items-center"
                  >
                    <input
                      type="text"
                      placeholder="Description"
                      value={exp.description}
                      onChange={(e) =>
                        handleListChange('expenses', idx, 'description', e.target.value)
                      }
                      className="flex-1 rounded border border-gray-300 p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      value={exp.amount}
                      onChange={(e) =>
                        handleListChange('expenses', idx, 'amount', e.target.value)
                      }
                      className="w-32 rounded border border-gray-300 p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem('expenses', idx)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove expense"
                    >
                      &times;
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addExpense}
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  <Plus size={16} /> Add Expenses
                </button>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
              >
                <Save size={20} /> {isLoading ? <Loader/> : 'Save Financial Log'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default FinancialLogForm;
