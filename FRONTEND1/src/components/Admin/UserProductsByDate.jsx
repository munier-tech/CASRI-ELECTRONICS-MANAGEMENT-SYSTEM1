import { useEffect, useState } from "react";
import { useProductsStore } from "@/store/useProductsStore";
import { Loader } from "lucide-react";
import dayjs from "dayjs";

const UserProductsByDate = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));

  const {
    getUsersProductsByDate,
    usersWithProducts,
    isLoading,
  } = useProductsStore();

  useEffect(() => {
    if (selectedDate) {
      getUsersProductsByDate(selectedDate);
    }
  }, [selectedDate]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Products Sold on Selected Date</h1>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 p-2 rounded"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader className="animate-spin text-white" size={40} />
        </div>
      ) : usersWithProducts.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          <p className="text-xl">No products sold on this date.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usersWithProducts.map((user) => {
            const totalSales = user.products.reduce(
              (sum, p) => sum + (p.price || 0) * (p.quantity || 1),
              0
            );
            const totalItems = user.products.reduce(
              (sum, p) => sum + (p.quantity || 1),
              0
            );

            return (
              <div
                key={user.username}
                className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-4"
              >
                <div>
                  <h2 className="text-xl font-semibold text-white">{user.username}</h2>
                  <p className="text-sm text-gray-400">{user.role}</p>
                  <p className="text-sm text-green-400 mt-1">
                    {totalItems} items — ${totalSales.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-3">
                  {user.products.map((product) => {
                    const total = (product.price || 0) * (product.quantity || 1);
                    return (
                      <div
                        key={product._id}
                        className="p-3 bg-gray-800 rounded-lg flex justify-between items-start"
                      >
                        <div>
                          <p className="text-white font-bold">{product.name}</p>
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {product.description}
                          </p>
                          <p className="text-sm text-gray-300 mt-1">
                            ${product.price.toFixed(2)} x {product.quantity}
                          </p>
                        </div>
                        <p className="text-yellow-400 font-bold">${total.toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserProductsByDate;
