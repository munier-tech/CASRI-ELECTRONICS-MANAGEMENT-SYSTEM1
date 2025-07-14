import express from "express" 
import dotenv from "dotenv"
import authRouter from "./Routes/authRoute.js"
import userRouter from "./Routes/userRoute.js"
import productRouter from "./Routes/productsRouter.js"
import historyRouter from "./Routes/historyRoute.js"
import liabilityRouter from "./Routes/LiabilityRoute.js"
import financialRouter from "./Routes/financialRoute.js"
import { connectdb } from "./lib/connectDB.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"
dotenv.config()
const app = express()
const PORT = process.env.PORT


const __dirname = path.resolve()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173", // Or your frontend domain
  credentials: true // 🔥 Must be true to allow sending cookies
}));




app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/products", productRouter)
app.use("/api/history", historyRouter)
app.use("/api/liability", liabilityRouter)
app.use("/api/financial", financialRouter)


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "FRONTEND1", "dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "FRONTEND1", "dist", "index.html"));
  });
}



app.listen(PORT, () => {

  console.log("server is running on port", PORT)
  connectdb()
})