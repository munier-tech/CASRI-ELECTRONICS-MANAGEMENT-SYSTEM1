import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";
import dayjs from "dayjs";

export const useHistoryStore = create((set) => ({
  date: null,
  products: [],
  history: [],
  isLoading: false,

  getMyDailySales: async () => {
    try {
      set({ isLoading: true });
      const { data } = await axios.get("/history/MyDailySales");

      set({
        date: dayjs(data.date).format("DD-MM-YYYY"),
        products: data.products,
        isLoading: false,
      });
      toast.success("Daily sales fetched successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "No sales found for today");
      set({ isLoading: false, products: [] });
    }
  },

  getAllHistory: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get("/history/myHistory");

      set({
        history: response.data.history,
        isLoading: false,
      });
      toast.success("History fetched successfully");
    } catch (error) {
      toast.error("Error fetching history");
      set({ isLoading: false });
    }
  },

  getProductsSoldByDate: async (date) => {
    try {
      set({ isLoading: true });

      const { data } = await axios.get(`/history/product-date/${date}`);

      set({
        products: data.data,
        date: dayjs(date).format("DD-MM-YYYY"),
        isLoading: false,
      });

      toast.success(`Products sold on ${dayjs(date).format("DD-MM-YYYY")} fetched successfully`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "No products sold on this date");
      set({ isLoading: false, products: [] });
    }
  },
}));
