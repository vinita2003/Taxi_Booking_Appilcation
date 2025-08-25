import { Rider } from "../../../models/rider-register-model.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../../../util/features.js";
import ErrorHandler from "../../../middlewares/error.js";
import jwt from "jsonwebtoken";

export const register  = async (req, res, next) => {
    try{
        const { name, password, phone, gender} = req.body;
        let rider = await Rider.findOne({phone});
        if(rider) return next(new ErrorHandler("User Already Exist", 400));
        const hashedPassword = await bcrypt.hash(password, 10);
        rider = await Rider.create({ name, password: hashedPassword, phone, gender });
        sendCookie(rider, res, "Registered Successfully", 201);
    }catch(error){
        console.log(error);
        next(error);
    }
};

export const login = async ( req, res, next) => {
    try{
        const {phone, password} = req.body;
        const rider = await Rider.findOne({ phone }).select("+password");
        if(!rider) return next(new ErrorHandler("Invalid Phone or Password", 400));
        const isMatch = await bcrypt.compare(password, rider.password);
        if(!isMatch) return next(new ErrorHandler("Invalid Phone or Password", 400));
        sendCookie(rider, res, `Welcome back, ${rider.name}`, 200);
        }catch(error){
          next(error);
        }
    
};

export const logout = (req, res) => {
    res.status(200)
    .cookie("token", "", {
        expires: new Date(Date.now()),
        sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "DEVELOPMENT" ? false : true,
    })
    .json({
        success: true,
        user: req.user,
    });
};

export const refreshToken = async (req, res) => {
    // console.log("token :", req.cookies.token);
    const { token } = req.cookies;
    if(!token) {
        return res.status(401).json({
            success: false,
            message: "No refresh token provided",
        });
    }
    try {
        // console.log("Verifying token with secret:", process.env.JWT_REFRESH_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        // console.log("Decoded ID:", decoded);
        const rider = await Rider.findById(decoded._id);
        console.log("Rider found:", rider);
        if (!rider) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const accessToken = jwt.sign({_id: decoded._id}, process.env.JWT_ACCESS_SECRET);
        return res.status(200).json({
            success: true,
            accessToken,
            user: rider
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid Refresh Token",
        });
    }
}

