import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { BsThreeDotsVertical, BsArrowLeft } from "react-icons/bs";
import { useProductsStore } from "@/store/useProductsStore";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md animate-popIn">
        {children}
      </div>
    </div>
  );
};

const DailySalesList = () => {
  const { date, products, isLoading, getMyDailyProducts, updateProduct, deleteProduct } = useProductsStore();
  const [modalProductId, setModalProductId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    price: 0,
  });

  useEffect(() => {
    getMyDailyProducts();
  }, [getMyDailyProducts]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setModalProductId(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormState({
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
    });
    setModalProductId(null);
  };

  const handleUpdateSubmit = async () => {
    if (editingProduct?._id) {
      await updateProduct(editingProduct._id, formState);
      setEditingProduct(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="text-gray-400 hover:text-white p-2">
          <BsArrowLeft size={24} />
        </Link>
        <h2 className="text-xl font-bold text-white text-center">
          Today's Sales <br />
          <span className="text-emerald-400 text-sm">{date}</span>
        </h2>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {products.length > 0 ? (
        <div className="space-y-3">
          {/* Summary Card */}
          <div className="bg-gray-700 rounded-xl p-4 shadow">
            <h3 className="text-white font-semibold mb-2">Sales Summary</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Total Items: {products.length}</span>
              <span className="text-emerald-400">
                Total: {formatCurrency(
                  products.reduce((sum, product) => 
                    sum + (product.price * (product.quantity ?? 1)), 0)
                )}
              </span>
            </div>
          </div>

          {/* Products List */}
          {products.map((product) => (
            <div 
              key={product._id} 
              className="bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-medium">{product.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{product.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded-full text-xs">
                      Qty: {product.quantity}
                    </span>
                    <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded-full text-xs">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setModalProductId(product._id)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <BsThreeDotsVertical size={20} />
                </button>
              </div>

              {/* Product Actions Modal */}
              <Modal
                isOpen={modalProductId === product._id}
                onClose={() => setModalProductId(null)}
              >
                <h3 className="text-white font-bold mb-4">Product Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setModalProductId(null)}
                    className="w-full py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white"
                  >
                    Cancel
                  </button>
                </div>
              </Modal>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl p-6 text-center shadow-lg">
          <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h3 className="text-white font-medium mb-2">No Sales Today</h3>
          <p className="text-gray-400 mb-4">Start adding products to track your sales</p>
          <Link
            to="/iibi"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Add First Sale
          </Link>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <Modal isOpen={true} onClose={() => setEditingProduct(null)}>
          <h3 className="text-white font-bold mb-4">Edit Product</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Name</label>
              <input
                type="text"
                className="w-full p-3 bg-gray-700 rounded-lg text-white"
                value={formState.name}
                onChange={(e) => setFormState({...formState, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Description</label>
              <input
                type="text"
                className="w-full p-3 bg-gray-700 rounded-lg text-white"
                value={formState.description}
                onChange={(e) => setFormState({...formState, description: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Quantity</label>
              <input
                type="number"
                className="w-full p-3 bg-gray-700 rounded-lg text-white"
                value={formState.quantity}
                onChange={(e) => setFormState({...formState, quantity: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Price</label>
              <input
                type="number"
                className="w-full p-3 bg-gray-700 rounded-lg text-white"
                value={formState.price}
                onChange={(e) => setFormState({...formState, price: Number(e.target.value)})}
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setEditingProduct(null)}
                className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white"
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DailySalesList;