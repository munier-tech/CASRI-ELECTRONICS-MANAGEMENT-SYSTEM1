import React, { useEffect, useState } from "react";
import { Loader, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useHistoryStore } from "@/store/useHistoryStore";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full p-6"
      >
        {children}
      </div>
    </div>
  );
};

const UserProductHistory = () => {
  const { history, isLoading, getAllHistory } = useHistoryStore();
  const [openProductId, setOpenProductId] = useState(null);

  useEffect(() => {
    getAllHistory();
  }, [getAllHistory]);

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
          Purchase History <span className="text-emerald-400"></span>
        </h2>
      </div>

      {history && history.length > 0 ? (
        <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-emerald-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-emerald-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-emerald-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-emerald-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-emerald-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {history.flatMap((transaction) =>
                  transaction.products.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-300">
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-medium text-white">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300 max-w-xs truncate">
                          {product.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-lg leading-5 font-semibold rounded-full bg-emerald-900/50 text-emerald-400">
                          ${product.price}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          aria-label="Open product actions"
                          className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
                          onClick={() =>
                            setOpenProductId(
                              openProductId === product._id ? null : product._id
                            )
                          }
                        >
                          <BsThreeDotsVertical size={20} />
                        </button>

                        <Modal
                          isOpen={openProductId === product._id}
                          onClose={() => setOpenProductId(null)}
                        >
                          <h2 className="text-white text-xl mb-2">
                            Product Actions
                          </h2>
                          <p className="text-gray-400 mb-4">
                            Choose an action for this product
                          </p>
                          <div className="flex flex-col space-y-3">
                            <button
                              className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                              onClick={() => {
                                alert(`Viewing details for ${product.name}`);
                                setOpenProductId(null);
                              }}
                            >
                              View Details
                            </button>
                            <button
                              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                              onClick={() => {
                                alert(`Returning product ${product.name}`);
                                setOpenProductId(null);
                              }}
                            >
                              Return Product
                            </button>
                            <button
                              className="w-full px-4 py-2 bg-emerald-600 rounded text-white hover:bg-emerald-700"
                              onClick={() => setOpenProductId(null)}
                            >
                              Close
                            </button>
                          </div>
                        </Modal>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl shadow-lg p-8 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-600" />
            <h3 className="mt-4 text-xl font-medium text-white">
              No Purchase History Found
            </h3>
            <p className="mt-2 text-gray-400">
              You haven't made any purchases yet. Start shopping to see your
              history here.
            </p>
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/30"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProductHistory;
