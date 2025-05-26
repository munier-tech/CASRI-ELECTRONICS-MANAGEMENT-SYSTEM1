import AddDailyProduct from "@/components/UserActivities/AddDailyProduct";
import AddDailyLiability from "@/components/UserActivities/AddLiability";
import ListDailyProducts from "@/components/UserActivities/ListDailyProducts";
import { motion } from "framer-motion";
import { useState } from "react";

const Homepage = () => {
  const tabs = [
    { id: "NOOCA ALABTA", name: "NOOCA ALABTA" },
    { id: "ALABTA GADAN MANTA", name: "ALABTA GADAN MANTA" },
    { id: "ALAABTA DAYNTA", name: "ALAABTA DAYNTA" },
  ];

  const [activeTab, setActiveTab] = useState("NOOCA ALABTA");

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-16 bg-transparent">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <button
          className="border border-black font-bold flex justify-center m-auto bg-white text-xl rounded-md text-black px-4 py-1"
          aria-label="Go to Sales"
        >
          SALES
        </button>
      </motion.div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-7xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="w-full max-w-7xl px-6">
          <div className="flex gap-4 justify-center mt-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-1 cursor-pointer lg:px-4 py-2 rounded-md text-white font-semibold transition-all duration-300 ease-in-out ${
                  activeTab === tab.id
                    ? "bg-emerald-500"
                    : "border hover:bg-emerald-400 border-emerald-500 text-emerald-500"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="bg-transparent rounded-lg p-6 min-h-[300px] mt-4">
            {activeTab === "NOOCA ALABTA" && (
              <div className="w-full">
                <AddDailyProduct />
              </div>
            )}

            {activeTab === "ALABTA GADAN MANTA" && (
              <div className="w-full">
                <ListDailyProducts />
              </div>
            )}

            {activeTab === "ALAABTA DAYNTA" && (
              <div className="w-full">
                <AddDailyLiability />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Homepage;
