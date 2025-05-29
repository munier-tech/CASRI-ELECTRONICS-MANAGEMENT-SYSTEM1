import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";
import dayjs from "dayjs";

const noCache = {
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
  params: { ts: Date.now() }, // unique timestamp to bust cache
};

export const useProductsStore = create((set) => ({
  products: [],
  username: null,
  user: null,
  isLoading: false,
  date: null,
  usersWithProducts: [],

  getProducts: async () => {
    try {
      set({ isLoading: true });
      const { data } = await axios.get("/products/getAll", noCache);
      set({ products: data, isLoading: false });
      toast.success("Products fetched successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching products");
      set({ isLoading: false });
    }
  },

  getMyDailyProducts: async () => {
    try {
      set({ isLoading: true });
      const { data } = await axios.get("/products/getMydaily", noCache);
      set({
        products: data.products || [],
        isLoading: false,
        date: dayjs().format("DD-MM-YYYY"),
      });
      toast.success("My Daily Products fetched successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching daily products");
      set({ isLoading: false, products: [] });
    }
  },

  addProduct: async (productData) => {
    try {
      set({ isLoading: true });
      const { data } = await axios.post("/products/addProduct", productData, noCache);
      set((state) => ({
        products: [...state.products, data],
        isLoading: false,
      }));
      toast.success("Product added successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error adding product");
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ isLoading: true });
      await axios.delete(`/products/delete/${id}`, noCache);
      set((state) => ({
        products: state.products.filter((product) => product._id !== id),
        isLoading: false,
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting product");
      set({ isLoading: false });
    }
  },

  updateProduct: async (id, productData) => {
    try {
      set({ isLoading: true });
      const { data } = await axios.put(`/products/update/${id}`, productData, noCache);
      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? data : product
        ),
        isLoading: false,
      }));
      toast.success("Product updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating product");
      set({ isLoading: false });
    }
  },

  getUsersDailyProducts: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get("/products/getAllUserProducts", noCache);
      set({ usersWithProducts: response.data.data, isLoading: false });
      toast.success("Users' daily products fetched successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching users' daily products");
      set({ isLoading: false });
    }
  },

  getDailyproducts: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get("/products/getAlldaily", noCache);
      set({ products: response.data.products || [], isLoading: false });
      toast.success("Daily products fetched successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching daily products");
      set({ isLoading: false, products: [] });
    }
  },
}));
