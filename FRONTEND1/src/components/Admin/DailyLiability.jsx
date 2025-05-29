import  { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useLiabilityStore } from "@/store/useLiabilityStore";
import dayjs from "dayjs";

const DialyLiability = () => {
  const { date, liabilities ,  isLoading, getDialyLiabilities , handleMarkAsPaid } = useLiabilityStore();
  const [openDialogId, setOpenDialogId] = useState(null);

  useEffect(() => {
    getDialyLiabilities();
  }, []);

  useEffect(() => {
    const today = dayjs().format("DD-MM-YYYY");
    if (date !== today) {
      getDialyLiabilities();
    }
  }, [date, getDialyLiabilities]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }


 
  return (
    <div className="md:w-full w-[90%] max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4 md:mb-0">
          Today's Sales <span className="text-emerald-400">{date}</span>
        </h2>
        {liabilities?.length > 0 && (
          <Link
            to="/iibi"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/20"
          >
            Add New Liability
          </Link>
        )}
      </div>

      {liabilities.length > 0 ? (
        <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-emerald-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-emerald-300 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-emerald-300 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-emerald-300 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-emerald-300 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-emerald-300 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {liabilities.map((item) => item._id && (
                  <tr key={item._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-gray-300 truncate max-w-xs">{item.description}</td>
                    <td className="px-6 py-4 text-gray-300 truncate max-w-xs">{item.quantity}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-lg font-semibold rounded-full bg-emerald-900/50 text-emerald-400">
                        ${item.price}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300 truncate max-w-xs">{item.price * item.quantity}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isLoading ? <Toaster size={18}/> : <button
                              onClick={() => handleMarkAsPaid(item._id)}
                              className="bg-green-500 hover:bg-green-700 font-bold transition ease-in-out w-full duration-300 text-white  px-2  py-1 rounded"
                            >
                              Paid
                    </button> }
                      
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl shadow-lg p-8 text-center">
          <div className="max-w-md mx-auto">
            <svg className="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-white">No liabilities Recorded Today</h3>
            <p className="mt-2 text-gray-400">
             no liablity have made  today. Start adding liabilities to track your daily Liability.
            </p>
            <div className="mt-6">
              <Link
                to="/daymi"
                className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/30"
              >
                Add First Liability
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DialyLiability;
