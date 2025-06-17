import express from "express";
import {  addProductsToDailySalesByDate, addProductToDailySales, deleteProduct, getAllDailyProducts, getAllUserByDate, getMyDailyProducts, getProductsByDate, getUsersDailyProducts, updateProduct } from "../Controllers/productsController.js";
import { adminRoute, protectedRoute } from "../middlewares/authMiddleware.js";
const router = express.Router();



router.post("/addProduct", protectedRoute  , adminRoute , addProductToDailySales)
router.post("/addProductByDate/:date", protectedRoute  , adminRoute , addProductsToDailySalesByDate)
router.get("/getAlldaily"  , protectedRoute ,  adminRoute ,  getAllDailyProducts)
router.get("/getMydaily"  , protectedRoute  ,  getMyDailyProducts)
router.get("/date/:date"  , protectedRoute  , adminRoute , getProductsByDate)
router.put("/update/:id"  ,  updateProduct)
router.delete("/delete/:id"  ,  deleteProduct)
router.get("/getAllUserProducts" , protectedRoute  , adminRoute ,   getUsersDailyProducts)
router.get("/getAllUsersByDate/:date", protectedRoute, adminRoute, getAllUserByDate);


export default router;