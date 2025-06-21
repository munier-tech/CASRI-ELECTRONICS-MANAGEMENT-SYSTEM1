import React, { useState } from 'react';
import useFinancialStore from '../../store/useFinancialStore';
import dayjs from 'dayjs';
import { Loader } from 'lucide-react';

const FinancialLogFormDate = () => {
  const { financialLogs, fetchLogsByDate, isLoading, updateLog } = useFinancialStore();
  const [selectedDate, setSelectedDate] = useState('');
  const [editingLog, setEditingLog] = useState(null);
  const [editForm, setEditForm] = useState({ income: {}, accountsAdjustments: [], expenses: [] });

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (date) fetchLogsByDate(date);
  };

  const formatCurrency = (val) => (val ? `$${val.toFixed(2)}` : '$0.00');

  const openEditForm = (log) => {
    setEditingLog(log);
    setEditForm({
      income: { ...log.income },
      accountsAdjustments: [...log.accountsAdjustments],
      expenses: [...log.expenses]
    });
  };

  const handleEditChange = (section, key, value, index = null) => {
    setEditForm((prev) => {
      const updated = { ...prev };
      if (section === 'income') {
        updated.income[key] = value;
      } else if (section === 'accountsAdjustments') {
        updated.accountsAdjustments[index][key] = value;
      } else if (section === 'expenses') {
        updated.expenses[index][key] = value;
      }
      return updated;
    });
  };

  const handleUpdate = async () => {
    if (!editingLog) return;
    await updateLog(editingLog._id, editForm);
    setEditingLog(null);
    fetchLogsByDate(selectedDate);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
            <h2 className="text-2xl font-bold text-white">Baadhaha Diiwaanka Maaliyadeed</h2>
            <p className="text-blue-100">Eeg diiwaannada maaliyadeed ee faahfaahsan taariikh kasta</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <label className="block text-sm font-medium text-gray-700 mb-1">Xulo Taariikhda</label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {financialLogs?.length > 0 ? (
              financialLogs.map((log) => (
                <div key={log._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-gray-50 px-4 py-3 border-b flex justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">{dayjs(log.date).format('MMMM D, YYYY')}</h3>
                    <button
                      onClick={() => openEditForm(log)}
                      className="bg-indigo-600 hover:bg-indigo-700 font-bold text-white text-xs px-3 py-1 rounded"
                    >
                      {isLoading ? <Loader/> + " Soo celi..." : 'Edit garee' }
                    </button>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-green-700 mb-2">Dakhli</h4>
                      <ul className="text-sm space-y-1">
                        {Object.entries(log.income).map(([key, val]) => (
                          <li key={key} className="flex justify-between">
                            <span className="capitalize text-gray-600">{key}:</span>
                            <span className="text-green-800 font-medium">{formatCurrency(val)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {log.accountsAdjustments.length > 0 && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-yellow-700 mb-2">Isbeddellada Akoonka</h4>
                        <ul className="text-sm space-y-1">
                          {log.accountsAdjustments.map((adj, i) => (
                            <li key={i} className="flex justify-between">
                              <span>{adj.label || '—'}:</span>
                              <span className="text-yellow-800 font-medium">{formatCurrency(adj.value)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {log.expenses.length > 0 && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-red-700 mb-2">Kharashyada</h4>
                        <ul className="text-sm space-y-1">
                          {log.expenses.map((exp, i) => (
                            <li key={i} className="flex justify-between">
                              <span>{exp.name || '—'}:</span>
                              <span className="text-red-800 font-medium">{formatCurrency(exp.amount)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="bg-gray-50 p-3 rounded-lg border">
                      <h4 className="font-semibold text-gray-700 mb-2">Wadarro</h4>
                      <ul className="text-sm space-y-1">
                        <li className="flex justify-between">
                          <span>Wadarta Dakhli:</span>
                          <span className="font-semibold">{formatCurrency(log.totals.incomeTotal)}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Wadarta Isbeddel:</span>
                          <span className="font-semibold">{formatCurrency(log.totals.adjustmentsTotal)}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Wadarta Kharash:</span>
                          <span className="font-semibold">{formatCurrency(log.totals.expensesTotal)}</span>
                        </li>
                        <li className="flex justify-between border-t pt-1">
                          <span>Wadar Guud:</span>
                          <span className="font-semibold">{formatCurrency(log.totals.combinedTotal)}</span>
                        </li>
                        <li className="flex justify-between text-lg font-bold">
                          <span>Haraaga:</span>
                          <span className={log.totals.balance >= 0 ? 'text-green-700' : 'text-red-700'}>
                            {formatCurrency(log.totals.balance)}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              selectedDate && !isLoading && (
                <div className="text-center py-8 text-gray-600">Lama helin wax diiwaan maaliyadeed ah.</div>
              )
            )}

            {editingLog && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-full max-w-2xl p-6 space-y-4">
                  <h3 className="text-lg font-bold">Tafatir Diiwaan Maaliyadeed - {dayjs(editingLog.date).format('MMM D, YYYY')}</h3>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Dakhli</h4>
                    {Object.entries(editForm.income).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <label className="w-24 capitalize">{key}:</label>
                        <input
                          type="number"
                          className="border px-2 py-1 w-full"
                          value={value}
                          onChange={(e) => handleEditChange('income', key, parseFloat(e.target.value))}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Isbeddellada Akoonka</h4>
                    {editForm.accountsAdjustments.map((adj, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          className="border px-2 py-1 w-1/2"
                          value={adj.label}
                          onChange={(e) => handleEditChange('accountsAdjustments', 'label', e.target.value, index)}
                        />
                        <input
                          type="number"
                          className="border px-2 py-1 w-1/2"
                          value={adj.value}
                          onChange={(e) => handleEditChange('accountsAdjustments', 'value', parseFloat(e.target.value), index)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Kharashyada</h4>
                    {editForm.expenses.map((exp, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          className="border px-2 py-1 w-1/2"
                          value={exp.name}
                          onChange={(e) => handleEditChange('expenses', 'name', e.target.value, index)}
                        />
                        <input
                          type="number"
                          className="border px-2 py-1 w-1/2"
                          value={exp.amount}
                          onChange={(e) => handleEditChange('expenses', 'amount', parseFloat(e.target.value), index)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      onClick={() => setEditingLog(null)}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >Ka noqoshada</button>
                    <button
                      onClick={handleUpdate}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >{isLoading ? <Loader className='animate-spin' /> : 'Cusbooneysii'}</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialLogFormDate;
