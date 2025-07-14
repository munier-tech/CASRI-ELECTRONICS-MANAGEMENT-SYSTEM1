import express from "express";
import dotenv from "dotenv";
import authRouter from "./Routes/authRoute.js";
import userRouter from "./Routes/userRoute.js";
import productRouter from "./Routes/productsRouter.js";
import historyRouter from "./Routes/historyRoute.js";
import liabilityRouter from "./Routes/LiabilityRoute.js";
import financialRouter from "./Routes/financialRoute.js";
import { connectdb } from "./lib/connectDB.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

// ✅ Allowed frontend origins (adjust as needed)
const allowedOrigins = [
  "http://localhost:5173", // Dev
  "https://casri-electronics-management-system-xi.vercel.app", // Vercel frontend
];

// ✅ CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// ✅ API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/history", historyRouter);
app.use("/api/liability", liabilityRouter);
app.use("/api/financial", financialRouter);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "FRONTEND1", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "FRONTEND1", "dist", "index.html"));
  });
}

// ✅ Start server
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
  connectdb();
});
