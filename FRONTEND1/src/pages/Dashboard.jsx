import React from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Users,
  Home,
  FileText,
  TrendingUp,
  DollarSign,
  Package,
  User,
  BarChart2,
  CreditCard,
  Menu,
  ArrowUp,
  ArrowDown,
  ChevronRight
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Link } from "react-router-dom";
import { useProductsStore } from "@/store/useProductsStore";

const lineData = [
  { name: "Jan", sales: 2400, revenue: 2100 },
  { name: "Feb", sales: 2200, revenue: 1800 },
  { name: "Mar", sales: 2800, revenue: 2500 },
  { name: "Apr", sales: 3000, revenue: 2800 },
  { name: "May", sales: 2700, revenue: 2400 },
  { name: "Jun", sales: 3200, revenue: 2900 },
  { name: "Jul", sales: 3500, revenue: 3200 },
];

const barData = [
  { name: "M", value: 20 },
  { name: "T", value: 35 },
  { name: "W", value: 25 },
  { name: "T", value: 40 },
  { name: "F", value: 30 },
  { name: "S", value: 15 },
  { name: "S", value: 10 },
];

const pieData = [
  { name: "Electronics", value: 35 },
  { name: "Clothing", value: 25 },
  { name: "Home Goods", value: 20 },
  { name: "Other", value: 20 },
];

const topProducts = [
  { id: 1, name: "Wireless Headphones", sales: 142, revenue: 5680 },
  { id: 2, name: "Smart Watch", sales: 98, revenue: 7840 },
  { id: 3, name: "Bluetooth Speaker", sales: 76, revenue: 3800 },
  { id: 4, name: "Laptop Backpack", sales: 65, revenue: 1950 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

const Dashboard = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { products } = useProductsStore();

  const totalSales = products.reduce((sum, product) => {
    const quantity = product.quantity ?? 1;
    return sum + product.price * quantity;
  }, 0);

  const stats = [
    { title: "amaahda maanta", value: "$12,345", change: "+12%", icon: <DollarSign size={20} />, path: "/DialyLiability" },
    { title: "iibka maanta", value: "1,234", change: "+7%", icon: <ShoppingCart size={20} />, path: "/DailySales" },
    { title: "staff", value: "3", icon: <Users size={20} />, path: "/UserProducts" },
    { title: "Taariikhda iibka", value: "View", icon: <FileText size={20} />, path: "/HistorySalesDate" },
  ];

  return (
    <motion.div
      className="min-h-screen mt-14 rounded-md bg-gray-50 p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <div className="text-xl font-bold text-gray-900 flex items-center">
            <BarChart2 size={24} className="text-indigo-600 mr-2" />
            Dashboard
          </div>
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-white shadow-sm border border-gray-200"
          >
            <Menu className="text-gray-600" size={20} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          {(isMobileMenuOpen || typeof window !== "undefined" && window.innerWidth >= 768) && (
            <motion.div
              className="w-full md:w-64 bg-white rounded-2xl shadow-lg p-4 border border-gray-100"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="hidden md:block p-4 text-2xl font-bold text-gray-900 items-center gap-2">
                <BarChart2 size={28} className="text-indigo-600" /> Dashboard
              </div>
              <nav className="flex flex-col gap-1 mt-2 md:mt-6">
                {[
                  { icon: Home, label: "Home", path: "/" },
                  { icon: FileText, label: "iibka maanta", path: "/DailySales" },
                  { icon: FileText, label: "taarikhda iibka hore", path: "/HistorySalesDate" },
                  { icon: User, label: "shaqaalaha", path: "/UserProducts" },
                  { icon: CreditCard, label: "amaahda maanta", path: "/DialyLiability" },
                  { icon: CreditCard, label: "taarikhda amaahda", path: "/HistoryLiability" },
                ].map((item, index) => (
                  <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to={item.path}
                      className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon size={20} className="text-gray-600" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <Link to={stat.path} key={index}>
                  <motion.div 
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-2 rounded-lg ${stat.change && stat.change.includes('+') ? "bg-green-100 text-green-600" : "bg-indigo-100 text-indigo-600"}`}>
                        {stat.icon}
                      </div>
                    </div>
                    {stat.change && (
                      <div className="flex items-center mt-4">
                        {stat.change.includes('+') ? (
                          <ArrowUp size={16} className="text-green-500" />
                        ) : (
                          <ArrowDown size={16} className="text-red-500" />
                        )}
                        <span className={`text-sm ml-1 ${stat.change.includes('+') ? "text-green-600" : "text-red-600"}`}>
                          {stat.change}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">{stat.change && "vs last month"}</span>
                      </div>
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Sales Trend Chart */}
              <motion.div 
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">Sales Trend</h3>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">View Report</button>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="sales" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                      <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Weekly Sales Chart */}
              <motion.div 
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">Weekly Sales</h3>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">View Report</button>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Sales by Category */}
              <motion.div 
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">Sales by Category</h3>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Recent Transactions */}
              <motion.div 
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {/* Content remains unchanged */}
              </motion.div>
            </div>

            {/* Top Products */}
            <motion.div 
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {/* Content remains unchanged */}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;