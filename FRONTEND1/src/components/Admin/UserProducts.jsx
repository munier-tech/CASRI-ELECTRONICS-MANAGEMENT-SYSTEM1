import { useEffect } from "react";
import { Loader, ShieldCheck } from "lucide-react";
import { useProductsStore } from "@/store/useProductsStore";

const UsersDailyProductsComponent = () => {
  const { usersWithProducts, isLoading, getUsersDailyProducts } = useProductsStore();

  useEffect(() => {
    getUsersDailyProducts();
  }, [getUsersDailyProducts]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-white mx-auto" size={40} />
      </div>
    );
  }

  if (!usersWithProducts.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
        <svg
          className="w-16 h-16 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        <p className="text-xl">No daily products found</p>
        <p className="text-sm mt-2">Check back later for sales updates</p>
      </div>
    );
  }

  // Calculate totals for each user and find hero user
  const usersWithTotals = usersWithProducts.map(user => {
    const totalSales = user.products.reduce((sum, product) => {
      return sum + (product.price || 0) * (product.quantity || 1);
    }, 0);
    const totalQuantity = user.products.reduce((sum, product) => {
      return sum + (product.quantity || 1);
    }, 0);
    
    return {
      ...user,
      totalSales,
      totalQuantity
    };
  });

  const sortedUsers = [...usersWithTotals].sort(
    (a, b) => b.totalSales - a.totalSales
  );
  const heroUser = sortedUsers[0];


  

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white text-center">Today's Sales Performance</h1>

      {/* Hero Box - now shows total sales amount */}
      <div className="bg-yellow-300 rounded-xl shadow-md p-6 text-center text-black">
        <div className="flex justify-center items-center gap-2 mb-2">
          <ShieldCheck className="w-6 h-6 text-black" />
          <h2 className="text-2xl font-bold">Hero of the Day</h2>
        </div>
        <p className="text-lg font-semibold">
          {heroUser.username} — ${heroUser.totalSales.toFixed(2)} in sales
        </p>
        <p className="text-sm mt-1">
          Sold {heroUser.totalQuantity} {heroUser.totalQuantity === 1 ? 'item' : 'items'} across {heroUser.products.length} {heroUser.products.length === 1 ? 'transaction' : 'transactions'}
        </p>
      </div>

      {/* User Cards with enhanced sales information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usersWithTotals.map(({ username, role, products, totalSales, totalQuantity }) => (
          <div
            key={username}
            className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center space-x-4 p-4 border-b border-gray-700">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-white drop-shadow-md mb-1 flex items-center justify-center text-black font-bold text-lg">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-gray-300 border border-gray-500 rounded-md bg-transparent">
                  {role}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{username}</h2>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span>{products.length} {products.length === 1 ? "sale" : "sales"}</span>
                  <span>{totalQuantity} {totalQuantity === 1 ? "item" : "items"}</span>
                  <span className="font-semibold text-green-400">${totalSales.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4 rounded-b-md">
              {products.length > 0 ? (
                <>
                  {products.map((product) => {
                    const productTotal = (product.price || 0) * (product.quantity || 1);
                    return (
                      <div
                        key={product._id}
                        className="flex items-start justify-between p-4 bg-white rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold truncate">{product.name.toUpperCase()}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                        <div className="ml-4 flex flex-col items-end">
                          <div className="text-right">
                            <span className="font-bold text-green-600 text-lg">${product.price.toFixed(2)}</span>
                            <span className="block text-sm text-gray-600">x {product.quantity || 1}</span>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="px-2 py-0.5 text-xs font-semibold text-white bg-red-600 rounded">
                              Sold
                            </span>
                            <span className="font-bold text-black">${productTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <span className="font-semibold text-white">Total:</span>
                    <div className="text-right">
                      <span className="block font-bold text-yellow-400">${totalSales.toFixed(2)}</span>
                      <span className="text-xs text-gray-300">{totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}</span>
                    </div>
                  </div>
                  
                </>
              ) : (
                <div className="text-center py-6 text-gray-400">No products sold today</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersDailyProductsComponent;