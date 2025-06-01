import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Loader2 } from 'lucide-react';
import useFinancialStore from '../../store/useFinancialStore';
import { useProductsStore } from '../../store/useProductsStore';

const FinancialLogDate = () => {
  const { fetchLogsByDate, financialLogs, loading, error } = useFinancialStore();
  const { products, getDailyproducts } = useProductsStore();
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));

   const productsTotal = products.reduce(
      (sum, p) => sum + (Number(p.price) * Number(p.quantity) || 0),
      0
    );

  useEffect(() => {
    fetchLogsByDate(selectedDate);
    getDailyproducts()
  }, [selectedDate, fetchLogsByDate, getDailyproducts]);

  const sumIncome = (income) => {
    let total = 0;
    if (income) {
      for (const key in income) {
        const item = income[key];
        if (item && typeof item === 'object') {
          const converted = item.converted ?? 0;
          total += Number(converted);
        }
      }
    }
    return total;
  };

  const sumExpenses = (expenses) => {
    if (!expenses || expenses.length === 0) return 0;
    return expenses.reduce((acc, exp) => acc + (Number(exp.amount) || 0), 0);
  };

  const sumAdjustments = (adjustments) => {
    if (!adjustments || adjustments.length === 0) return 0;
    return adjustments.reduce((acc, adj) => acc + (Number(adj.value) || 0), 0);
  };

  const sumProductTotal = (totals) => {
    if (!totals || typeof totals !== 'object') return 0;
    return Object.values(totals).reduce((acc, val) => acc + (Number(val) || 0), 0);
  };

  const relevantLogs = Array.isArray(financialLogs)
    ? financialLogs.filter(log => {
        const hasIncome = log.income && Object.values(log.income).some(v => v && v.converted);
        const hasAdjustments = log.accountsAdjustments && log.accountsAdjustments.length > 0;
        const hasExpenses = log.expenses && log.expenses.length > 0;
        const hasTotals = log.totals && Object.values(log.totals).some(v => v !== null && v !== 0);
        return hasIncome || hasAdjustments || hasExpenses || hasTotals;
      })
    : [];

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <Calendar className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl font-semibold text-gray-800">Select Date</h1>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          max={format(new Date(), 'yyyy-MM-dd')}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-3" />
          <span className="text-indigo-600 text-lg font-medium">Loading data...</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-lg mb-8 shadow-md">
          <p className="text-yellow-700 font-medium">{error}</p>
        </div>
      )}

      {/* No Data */}
      {!loading && !error && relevantLogs.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-md mt-8 text-center text-gray-500">
          <p>No data found for {format(new Date(selectedDate), 'MMMM d, yyyy')}</p>
        </div>
      )}

      {/* Logs */}
      {relevantLogs.map((log) => {
        const totalIncome = sumIncome(log.income);
        const totalExpenses = sumExpenses(log.expenses);
        const totalAdjustments = sumAdjustments(log.accountsAdjustments);
        const productTotal = sumProductTotal(log.totals);
        const combinedTotal = totalIncome + totalAdjustments;
        const balance = combinedTotal - productsTotal;


        return (
          <div key={log._id} className="space-y-8 mb-8">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Financial Log for {format(new Date(log.date), 'MMMM d, yyyy')}
              </h2>
              <p className="text-gray-600">Here's an overview of your finances for this date.</p>
            </div>

            {/* Income */}
            {log.income && Object.values(log.income).some(v => v && v.converted) && (
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Income</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(log.income).map(([key, value]) => (
                    <div key={key} className="bg-indigo-50 p-4 rounded-lg shadow-sm border border-indigo-100 hover:shadow-lg hover:bg-indigo-100 transition">
                      <p className="text-sm font-semibold text-indigo-700 mb-2">{key.replace(/([A-Z])/g, ' $1')}</p>
                      {typeof value === 'object' && value !== null ? (
                        Object.entries(value).map(([k, v]) => (
                          <p key={k} className="text-gray-700 text-sm">
                            <span className="capitalize">{k}:</span> <span className="font-semibold">${(v ?? 0).toFixed(2)}</span>
                          </p>
                        ))
                      ) : (
                        <p className="text-xl font-bold text-gray-900">${(value ?? 0).toFixed(2)}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Adjustments */}
            {log.accountsAdjustments && log.accountsAdjustments.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Account Adjustments</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border-collapse border border-gray-200 rounded-lg">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase border-b">Label</th>
                        <th className="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase border-b">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {log.accountsAdjustments.map((adj) => (
                        <tr key={adj._id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border-b border-gray-200">{adj.label}</td>
                          <td className="px-4 py-2 border-b border-gray-200 font-semibold text-indigo-600">${(adj.value ?? 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Expenses */}
            {log.expenses && log.expenses.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Expenses</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border-collapse border border-gray-200 rounded-lg">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase border-b">Description</th>
                        <th className="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase border-b">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {log.expenses.map((exp) => (
                        <tr key={exp._id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border-b border-gray-200">{exp.description || 'Unnamed Expense'}</td>
                          <td className="px-4 py-2 border-b border-gray-200 font-semibold text-indigo-600">${(exp.amount ?? 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Summary</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 transition hover:shadow-lg">
                  <p className="text-sm font-medium text-indigo-700 uppercase mb-2">Combined Total</p>
                  <p className="text-xl font-bold text-gray-900">${combinedTotal.toFixed(2)}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 transition hover:shadow-lg">
                  <p className="text-sm font-medium text-indigo-700 uppercase mb-2">Balance</p>
                  <p className="text-xl font-bold text-gray-900">${balance.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FinancialLogDate;
