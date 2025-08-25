import { Driver } from "../models/driver-register-model.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
   const { token } = req.cookies;
   if(!token)
    return res.status(404).json({
success: false,
 message: "Login First",
});
const decoded = jwt.verify(token, process.env.JWT_SECRET);
 console.log(decoded._id);
  req.user = await Driver.findById(decoded._id);
  
next();
}