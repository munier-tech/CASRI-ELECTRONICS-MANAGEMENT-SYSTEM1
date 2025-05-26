import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Edit3, FileText, Loader2, Plus } from 'lucide-react';
import { useLiabilityStore } from '@/store/useLiabilityStore';

const AddDailyLiability = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
  });

  const { isLoading, addLiablity } = useLiabilityStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedProduct = {
      ...productData,
      price: Number(productData.price),
    };
    addLiablity(formattedProduct);
    setProductData({ name: '', description: '', price: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-transparent p-4"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md"
      >
        <div className="bg-white backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-black border-opacity-20">
          <div className="p-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="mb-8 text-center"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-black">
                DAYNTA MAANTA
              </h2>
              <p className="text-blue-600 mt-2">Fill in the product details below</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-black mb-2">
                  MAGACA SHAKHSIGA
                </label>
                <div className="relative">
                  <input
                    type="text"
                    onChange={(e) => setProductData(prev => ({ ...prev, name: e.target.value }))}
                    value={productData.name}
                    placeholder="Enter product name"
                    className="pl-10 w-full bg-white bg-opacity-10 border border-black border-opacity-20 text-black placeholder:text-black focus:ring-2 focus:ring-emerald-500 focus:border-transparent rounded-md py-2"
                  />
                  <Edit3 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400" size={18} />
                </div>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-black mb-2">
                  MAGACA ALABTA
                </label>
                <div className="relative">
                  <input
                    type="text"
                    onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
                    value={productData.description}
                    placeholder="Enter product description"
                    className="pl-10 w-full bg-white bg-opacity-10 border border-black border-opacity-20 text-black placeholder:text-black focus:ring-2 focus:ring-emerald-500 focus:border-transparent rounded-md py-2"
                  />
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400" size={18} />
                </div>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-black mb-2">
                  Price ($)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    onChange={(e) => setProductData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    value={productData.price || ''}
                    placeholder="Enter price"
                    className="pl-10 w-full bg-white bg-opacity-10 border border-black border-opacity-20 text-black placeholder:text-black focus:ring-2 focus:ring-emerald-500 focus:border-transparent rounded-md py-2"
                  />
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400" size={18} />
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="pt-4"
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 ${
                    isLoading ? 'opacity-80 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2" size={18} />
                      ADD
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddDailyLiability;
