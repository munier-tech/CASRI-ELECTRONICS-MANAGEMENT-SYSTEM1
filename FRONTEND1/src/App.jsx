import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader } from 'lucide-react';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import { useUserStore } from './store/useUserStore';
import AddDailyProduct from './components/UserActivities/AddDailyProduct';
import Dashboard from './pages/Dashboard';
import DailySales from './components/Admin/DailySales';
import UsersDailyProductsComponent from './components/Admin/UserProducts';
import DailySalesList from './components/UserActivities/ListDailyProducts';
import UserProductHistory from './components/UserActivities/UserProductHistory';
import HistoryLiability from './components/Admin/HistoryLiability';
import DialyLiability from './components/Admin/DailyLiability';
import AddDailyLiability from './components/UserActivities/AddLiability';
import ProductsSoldByDate from './components/Admin/productsByDate';
import Profile from './components/profile';

const App = () => {
  const { checkAuth, user, isLoading, authChecked } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading || !authChecked) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-amber-200 via-violet-600 to-sky-900">
        <Loader className="animate-spin text-white" size={40} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700" />

      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="relative z-10 pt-14 px-4 min-h-screen">
        <Routes>
          <Route path="/" element={user ? <Homepage /> : <Navigate to="/signin" />} />
          <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/" />} />
          <Route path="/iibi" element={user ? <AddDailyProduct /> :  <Navigate to="/signin" /> } />
          <Route path="/daymi" element={user ? <AddDailyLiability /> :  <Navigate to="/signin" /> } />
          <Route path="/daily-sales" element={user ? <DailySalesList /> : <Navigate to="/signin" />} />
          <Route path="HistorySalesDate" element={user ? <ProductsSoldByDate /> : <Navigate to="/signin" />} />
          <Route path="product-history" element={user ? <UserProductHistory /> : <Navigate to="/signin" />} />
          <Route path="/UserProducts" element={user ? <UsersDailyProductsComponent /> : <Navigate to="/signin" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/signin" />} />
          <Route path="/HistoryLiability" element={user?.role === "admin" ? <HistoryLiability /> : <Navigate to="/" />} />
          <Route path="/DialyLiability" element={user?.role === "admin" ? <DialyLiability /> : <Navigate to="/" />} />
          <Route path="/dashboard" element={user?.role === "admin" ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/dailysales" element={user?.role === "admin" ? <DailySales /> : <Navigate to="/" />} />
        </Routes>
      </div>
  
      <Toaster position="top-center" />
    </div>
  );
};

export default App;
