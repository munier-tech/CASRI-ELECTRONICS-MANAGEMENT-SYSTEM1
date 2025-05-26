import User from "../models/userModel.js";
import jwt from "jsonwebtoken"

export const protectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    res.status(401).json({ message : "UNAUTHORIZED - no accessToken is provided"})
  }

  try {

    const decoded = jwt.verify(accessToken , process.env.TOKEN_SECRET_KEY)
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      res.status(401).json({ message : "UNAUTHORIZED - no user found"})
    }

    req.user = user;
    next();
  
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message : "UNAUTHORIZED - accessToken is expired"})
    }
  }
    
  } catch (error) {
    console.error(" error in protected route middleware" , error);
    res.status(500).json({ message : error.message })
  }
}



export const adminRoute = async (req, res, next) => {
  try {

    const user = req.user;

    if (user && (user.role === "admin" || user.role === "employee"))  {
      next();
    }
      else {
        return res.status(403).json({ message: "Forbidden - you have no access you aren't an admin or employee" });
      }

    
  } catch (error) {
    console.error(" error in  adminRoute" , error);
    res.status(500).json({ message : error.message })
  }
}


export const EmployeeRoute = async (req, res, next) =>  {
  try {

    if (req.user && req.user.role === "employee" && req.user.role === "admin" ) {
        next();
    }
    else {
      return res.status(401).json({ message : "UNAUTHORIZED - you have no access to sale a product"})
    }
  } catch (error) {
    console.error(" error in  employeeRoute" , error);
    res.status(500).json({ message : error.message })
  }
}