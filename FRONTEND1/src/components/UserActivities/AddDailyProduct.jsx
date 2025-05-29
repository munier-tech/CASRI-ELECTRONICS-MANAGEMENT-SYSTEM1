import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Edit3, FileText, Loader2, Plus, Package, Tag } from 'lucide-react';
import { useProductsStore } from '@/store/useProductsStore';

const AddDailyProduct = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
  });

  const { isLoading, addProduct } = useProductsStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedProduct = {
      ...productData,
      price: Number(productData.price),
    };
    addProduct(formattedProduct);
    setProductData({ name: '', description: '', price: 0, quantity: 0 });
  };

  const inputVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full p-4 md:flex md:items-center md:justify-center md:min-h-screen"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
          className="w-full md:max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Header with gradient */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-center"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  delay: 0.4,
                  duration: 0.6,
                  ease: "easeInOut"
                }}
                className="inline-block mb-3"
              >
                <Package className="text-white" size={36} />
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                ALAABTA MAANTA
              </h2>
              <p className="text-emerald-100 mt-2 text-sm md:text-base">
                Fadlan buuxi bogga alaabaha
              </p>
            </motion.div>

            <div className="p-5 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Product Name */}
                <motion.div
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Tag className="mr-2 text-emerald-500" size={16} />
                    MAGACA ALAABTA
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      onChange={(e) => setProductData(prev => ({ ...prev, name: e.target.value }))}
                      value={productData.name}
                      placeholder="Gali magaca alaabta"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    />
                    <Edit3 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </motion.div>

                {/* Description */}
                <motion.div
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FileText className="mr-2 text-emerald-500" size={16} />
                    FAAHFAAHINTA
                  </label>
                  <div className="relative">
                    <textarea
                      onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
                      value={productData.description}
                      placeholder="Gali faah faahinta alaabta"
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Quantity */}
                  <motion.div
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TIRADA (#)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        onChange={(e) => setProductData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                        value={productData.quantity || ''}
                        placeholder="Tirada"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </motion.div>

                  {/* Price */}
                  <motion.div
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      QIIMAHA ($)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        onChange={(e) => setProductData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        value={productData.price || ''}
                        placeholder="Qiimaha"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                      <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </motion.div>
                </div>

                {/* Submit Button */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="pt-2"
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center items-center py-3 px-6 rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:scale-[1.02] ${
                      isLoading ? 'opacity-80 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        <span className="animate-pulse">Processing...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2" size={18} />
                        <span className="font-semibold">IIBI ALAABTA</span>
                      </>
                    )}
                  </button>
                </motion.div>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddDailyProduct;