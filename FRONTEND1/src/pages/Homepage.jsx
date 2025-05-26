import AddDailyProduct from "@/components/UserActivities/AddDailyProduct";
import AddDailyLiability from "@/components/UserActivities/AddLiability";
import ListDailyProducts from "@/components/UserActivities/ListDailyProducts";
import { motion } from "framer-motion";
import { useState } from "react";

const Homepage = () => {
  const tabs = [
    { id: "NOOCA ALABTA", name: "Add Product", icon: "➕" },
    { id: "ALABTA GADAN MANTA", name: "Today's Sales", icon: "📋" },
    { id: "ALAABTA DAYNTA", name: "Add Liability", icon: "💳" },
  ];

  const [activeTab, setActiveTab] = useState("NOOCA ALABTA");

  return (
    <div className="min-h-screen bg-transparent p-4 backdrop-blur-sm">
      {/* Header */}
      <motion.div
        className="w-full max-w-md mx-auto mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-white/10 border border-white/20 text-white text-center py-3 rounded-xl shadow-lg backdrop-blur-md">
          <h1 className="text-xl font-bold">SALES DASHBOARD</h1>
          <p className="text-sm opacity-80">Manage your daily operations</p>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center px-4 py-3 rounded-xl whitespace-nowrap transition-all duration-300 min-w-[100px] ${
                activeTab === tab.id
                  ? "bg-emerald-500/90 text-white shadow-lg"
                  : "bg-white/10 text-gray-200 hover:bg-white/20"
              }`}
            >
              <span className="text-lg mb-1">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.name}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content Area */}
      <motion.div
        className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl p-4 min-h-[50vh] border border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {activeTab === "NOOCA ALABTA" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AddDailyProduct />
          </motion.div>
        )}

        {activeTab === "ALABTA GADAN MANTA" && (
          <motion.div
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-full flex flex-col">
              <ListDailyProducts />
            </div>
          </motion.div>
        )}

        {activeTab === "ALAABTA DAYNTA" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AddDailyLiability />
          </motion.div>
        )}
      </motion.div>

      {/* Footer */}
      <motion.div 
        className="mt-6 text-center text-white/50 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Swipe to see more options
      </motion.div>
    </div>
  );
};

export default Homepage;