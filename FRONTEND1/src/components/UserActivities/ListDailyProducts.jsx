import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useProductsStore } from "@/store/useProductsStore";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-800 rounded-lg p-6 max-w-md w-full"
      >
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

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-emerald-500" size={48} />
      </div>
    );

  return (
    <div className="w-[30rem] m-auto px-2 sm:px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Today's Sales <span className="text-emerald-400">{date}</span>
        </h2>
        {products?.length > 0 && (
          <Link
            to="/iibi"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-semibold transition-all duration-300 shadow hover:shadow-emerald-500/20 whitespace-nowrap"
          >
            Add New Sale
          </Link>
        )}
      </div>

      {products.length > 0 ? (
        <div className="space-y-4">
          {products.map((product) =>
            product._id ? (
              <div
                key={product._id}
                className="bg-gray-900 p-4 rounded-xl shadow-md space-y-2 sm:space-y-0 sm:flex sm:justify-between sm:items-center"
              >
                <div className="text-white space-y-1">
                  <div className="flex items-center gap-1 border border-blue-400 rounded-2xl p-3">
                    <p className="text-emerald-300 text-lg font-bold">NAME:</p>
                    <p className="text-lg font-semibold">
                      {product.name.toLocaleUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 border border-emerald-400 rounded-2xl p-3">
                    <p className="text-emerald-300 text-lg font-bold">
                      DESCRIPTION:
                    </p>
                    <p className="text-lg font-semibold">
                      {product.description.toLocaleUpperCase()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm mt-2">
                    <span className="bg-emerald-900/40 text-emerald-400 px-2 py-1 rounded-full">
                      <h1> Quantity: {product.quantity}</h1>
                    </span>
                    <span className="bg-emerald-900/40 text-emerald-400 px-2 py-1 rounded-full">
                      Price: {formatCurrency(product.price)}
                    </span>
                    <span className="bg-emerald-900/40 text-emerald-400 px-2 py-1 rounded-full">
                      Total:{" "}
                      {formatCurrency(product.price * (product.quantity ?? 1))}
                    </span>
                  </div>
                </div>

                <div className="mt-4 sm:mt-0 flex justify-end sm:justify-start">
                  <button
                    aria-label="Open product actions"
                    className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
                    onClick={() => setModalProductId(product._id ?? null)}
                  >
                    <BsThreeDotsVertical size={20} />
                  </button>
                </div>

                <Modal
                  isOpen={modalProductId === product._id}
                  onClose={() => setModalProductId(null)}
                >
                  <h2 className="text-white text-xl mb-2">Product Actions</h2>
                  <p className="text-gray-400 mb-4">Edit or Delete this product</p>
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() =>
                        handleEdit({
                          _id: product._id,
                          name: product.name,
                          description: product.description,
                          price: product.price,
                        })
                      }
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => setModalProductId(null)}
                      className="mt-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </Modal>
              </div>
            ) : null
          )}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 md:p-8 text-center">
          <div className="max-w-md mx-auto">
            <svg
              className="w-16 h-16 mx-auto text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-white">
              No Sales Recorded Today
            </h3>
            <p className="mt-2 text-gray-400">
              You haven't made any sales today. Start adding products to track
              your daily sales.
            </p>
            <div className="mt-6">
              <Link
                to="/iibi"
                className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/30"
              >
                Add First Sale
              </Link>
            </div>
          </div>
        </div>
      )}

      {editingProduct && (
        <Modal isOpen={true} onClose={() => setEditingProduct(null)}>
          <h2 className="text-white text-xl mb-4">Edit Product</h2>
          <div className="space-y-3">
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Name"
              value={formState.name}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Description"
              value={formState.description}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, description: e.target.value }))
              }
            />
            <input
              type="number"
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Price"
              value={formState.price}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
              }
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
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
