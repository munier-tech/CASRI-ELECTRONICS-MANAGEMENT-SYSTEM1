import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Loader2 } from 'lucide-react';
import useFinancialStore from '../../store/useFinancialStore';
import { useProductsStore } from '../../store/useProductsStore';

const FinancialLogDate = () => {
  const { fetchLogsByDate, financialLogs, loading, error } = useFinancialStore();
  const { products, getProductsByDate } = useProductsStore();
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchLogsByDate(selectedDate);
    getProductsByDate(selectedDate);
  }, [selectedDate, fetchLogsByDate, getProductsByDate]);

  const calculateTotals = (log) => {
    const incomeTotal =
      (Number(log.income?.zdollar) || 0) +
      (Number(log.income?.dollar) || 0) +
      (Number(log.income?.zcash?.converted) || 0) +
      (Number(log.income?.edahabCash?.converted) || 0) +
      (Number(log.income?.Cash?.converted) || 0) +
      (Number(log.income?.account?.converted) || 0);

    const expensesTotal = (log.expenses || []).reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
    const adjustmentsTotal = (log.accountsAdjustments || []).reduce((sum, adj) => sum + Number(adj.value || 0), 0);
    const productsTotal = products.reduce((sum, p) => sum + (Number(p.price || 0) * Number(p.quantity || 1)), 0);
    const combinedTotal = incomeTotal + expensesTotal + adjustmentsTotal;
    const balance = combinedTotal - productsTotal;

    return { incomeTotal, expensesTotal, adjustmentsTotal, productsTotal, combinedTotal, balance };
  };

  const hasRelevantData = (log) => {
    return (
      (log.income && Object.values(log.income).some(v => v?.converted || (typeof v === 'number' && v !== 0))) ||
      (log.accountsAdjustments?.length > 0) ||
      (log.expenses?.length > 0) ||
      (log.totals && Object.values(log.totals).some(v => v !== null && v !== 0))
    );
  };

  const relevantLogs = Array.isArray(financialLogs) ? financialLogs.filter(hasRelevantData) : [];

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen font-sans bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <Calendar className="w-6 h-6 text-indigo-500" />
          <h1 className="text-2xl font-bold text-gray-800">Financial Dashboard</h1>
        </div>
        <div className="relative">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 text-gray-700"
            max={format(new Date(), 'yyyy-MM-dd')}
          />
          <div className="absolute right-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
          <p className="text-lg font-medium text-gray-600">Loading financial data...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-400 mb-8">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-red-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-medium text-red-700 mb-1">No records found for {format(new Date(selectedDate), 'MMMM d, yyyy')}. Try selecting a different date.</h3>
              <p className="text-gray-600">No records found for {format(new Date(selectedDate), 'MMMM d, yyyy')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && relevantLogs.length === 0 && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Financial Data</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            No records found for {format(new Date(selectedDate), 'MMMM d, yyyy')}. Try selecting a different date.
          </p>
        </div>
      )}

      {/* Financial Logs */}
      {relevantLogs.map((log) => {
        const totals = calculateTotals(log);
        
        return (
          <div key={log._id} className="space-y-6">
            {/* Date Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {format(new Date(log.date), 'EEEE, MMMM d, yyyy')}
              </h2>
            </div>

            {/* Income Section */}
            {totals.incomeTotal > 0 && (
              <IncomeSection income={log.income} />
            )}

            {/* Adjustments Section */}
            {totals.adjustmentsTotal > 0 && (
              <AdjustmentsSection adjustments={log.accountsAdjustments} />
            )}

            {/* Expenses Section */}
            {totals.expensesTotal > 0 && (
              <ExpensesSection expenses={log.expenses} />
            )}

            {/* Products Section */}
            {products.length > 0 && (
              <ProductsSection products={products} />
            )}

            {/* Summary Section */}
            <SummarySection {...totals} />
          </div>
        );
      })}
    </div>
  );
};

// Subcomponents with enhanced styling
const IncomeSection = ({ income }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-lg font-semibold text-gray-800">Income Breakdown</h3>
      <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
        Income
      </span>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(income).map(([key, value]) => (
        <div key={key} className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-indigo-600 mb-2">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </p>
          {value?.converted !== undefined ? (
            <p className="text-2xl font-bold text-gray-800">${Number(value.converted).toFixed(2)}</p>
          ) : (
            typeof value === 'number' && <p className="text-2xl font-bold text-gray-800">${Number(value).toFixed(2)}</p>
          )}
        </div>
      ))}
    </div>
  </div>
);

const AdjustmentsSection = ({ adjustments }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-lg font-semibold text-gray-800">Account </h3>
      <span className="bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full">
        Account
      </span>
    </div>
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {adjustments.map((adj) => (
            <tr key={adj._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{adj.label}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-amber-600">
                ${Number(adj.value).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ExpensesSection = ({ expenses }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-lg font-semibold text-gray-800">Expense Records</h3>
      <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
        Expenses
      </span>
    </div>
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Magaca</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qiimaha</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {expenses.map((exp) => (
            <tr key={exp._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {exp.name || 'Unnamed Expense'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-red-600">
                ${Number(exp.amount).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ProductsSection = ({ products }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-lg font-semibold text-gray-800">Product Sales</h3>
      <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
        Products
      </span>
    </div>
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                ${Number(product.price).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {product.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-purple-600">
                ${(Number(product.price) * Number(product.quantity)).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SummarySection = ({
  incomeTotal,
  expensesTotal,
  adjustmentsTotal,
  productsTotal,
  combinedTotal,
  balance
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 mb-6">Financial Summary</h3>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      <SummaryCard 
        title="Total Income" 
        value={incomeTotal} 
        icon={
          <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        color="indigo"
      />
      <SummaryCard 
        title="Total Expenses" 
        value={expensesTotal} 
        icon={
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        color="red"
      />
      <SummaryCard 
        title="Total Accounts" 
        value={adjustmentsTotal} 
        icon={
          <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        }
        color="amber"
      />
      <SummaryCard 
        title="Products Total" 
        value={productsTotal} 
        icon={
          <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        }
        color="purple"
      />
      <SummaryCard 
        title="Combined Total" 
        value={combinedTotal} 
        icon={
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
        color="blue"
      />
      <SummaryCard 
        title="Final Balance" 
        value={balance} 
        icon={
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        color={balance >= 0 ? 'green' : 'red'}
      />
    </div>
  </div>
);

const SummaryCard = ({ title, value, icon, color = 'gray' }) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200'
  };

  return (
    <div className={`p-5 rounded-lg border ${colorClasses[color]} hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium uppercase tracking-wider">{title}</h4>
        {icon}
      </div>
      <p className="text-2xl font-bold">${value.toFixed(2)}</p>
    </div>
  );
};

export default FinancialLogDate;