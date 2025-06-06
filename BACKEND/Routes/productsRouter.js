import express from "express";
import {  addProductToDailySales, deleteProduct, getAllDailyProducts, getMyDailyProducts, getProductsByDate, getUsersDailyProducts, updateProduct } from "../Controllers/productsController.js";
import { adminRoute, protectedRoute } from "../middlewares/authMiddleware.js";
const router = express.Router();



router.post("/addProduct", protectedRoute  , adminRoute , addProductToDailySales)
router.get("/getAlldaily"  , protectedRoute ,  adminRoute ,  getAllDailyProducts)
router.get("/getMydaily"  , protectedRoute  ,  getMyDailyProducts)
router.get("/date/:date"  , protectedRoute  , adminRoute , getProductsByDate)
router.put("/update/:id"  ,  updateProduct)
router.delete("/delete/:id"  ,  deleteProduct)
router.get("/getAllUserProducts" , protectedRoute  , adminRoute ,   getUsersDailyProducts)


export default router;