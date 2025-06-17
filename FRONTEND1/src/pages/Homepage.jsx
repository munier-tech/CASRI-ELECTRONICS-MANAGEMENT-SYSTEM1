import AddDailyProduct from "@/components/UserActivities/AddDailyProduct";
import AddDailyLiability from "@/components/UserActivities/AddLiability";
import ListDailyProducts from "@/components/UserActivities/ListDailyProducts";
import { motion } from "framer-motion";
import { useState } from "react";
import AddHistoricalProduct from "@/components/UserActivities/AddProductsByDate";

const Homepage = () => {
  const tabs = [
    { id: "NOOCA ALABTA", name: "GALI ALAABTA MAANTA", icon: "➕" },
    { id: "NOOCA ALABTA 1", name: "GALI ALAABTA TAARIIKH HORE", icon: "🕒" },
    { id: "ALABTA GADAN MANTA", name: "IIBKA MAANTA", icon: "📋" },
    { id: "ALAABTA DAYNTA", name: "GALI DAYNTA", icon: "💳" },
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
          <p className="text-sm opacity-80">BOGGA IIBKA ALAABAHA</p>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="flex overflow-x-auto pb-2 space-x-3 scrollbar-hide snap-x snap-mandatory px-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[120px] snap-center px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <span className="text-2xl mb-1">{tab.icon}</span>
              <span className="text-sm font-semibold text-center leading-tight">
                {tab.name}
              </span>
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

        {activeTab === "NOOCA ALABTA 1" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AddHistoricalProduct />
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
        Labo farood ku duub si aad uga beddesho tabs-ka
      </motion.div>
    </div>
  );
};

export default Homepage;
