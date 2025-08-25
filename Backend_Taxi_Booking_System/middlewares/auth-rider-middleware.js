import { Rider } from "../models/rider-register-model.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  const auth = req.headers.authorization || "";
  console.log("Authorization Header:", auth);
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  console.log("Token:", token);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token"
  })}
  try{
    console.log(`Verifying token with secret: ${process.env.JWT_ACCESS_SECRET}`);
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = await Rider.findById(decoded._id);
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } 
    console.log("Authenticated User: vinita", req.user);
    next();
  }catch(error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

//   const { token } = req.cookies;
//    if(!token)
//     return res.status(404).json({
// success: false,
//  message: "Login First",
// });
// const decoded = jwt.verify(token, process.env.JWT_SECRET);

//   req.user = await Rider.findById(decoded._id);




}