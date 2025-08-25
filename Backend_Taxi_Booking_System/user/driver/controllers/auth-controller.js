import { Driver } from "../../../models/driver-register-model.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../../../util/features.js";
import ErrorHandler from "../../../middlewares/error.js";
import jwt from "jsonwebtoken";

export const register  = async (req, res, next) => {
    try{
        const { name, password, phone, gender, carType, carNumber, aadharCardNumber, licenseCardNumber} = req.body;
        let driver = await Driver.findOne({phone});
        if(driver) return next(new ErrorHandler("User Already Exist", 400));
        const hashedPassword = await bcrypt.hash(password, 10);
        driver = await Driver.create({ name, password: hashedPassword, phone, gender, carType, carNumber, aadharCardNumber, licenseCardNumber});
        sendCookie(driver, res, "Registered Successfully", 201);
    }catch(error){
        next(error);
    }
};

export const login = async ( req, res, next) => {
    try{
        const {phone, password} = req.body;
        const driver = await Driver.findOne({ phone }).select("+password");
        if(!driver) return next(new ErrorHandler("Invalid Phone or Password", 400));
        const isMatch = await bcrypt.compare(password, driver.password);
        if(!isMatch) return next(new ErrorHandler("Invalid Phone or Password", 400));
        sendCookie(driver, res, `Welcome back, ${driver.name}`, 200);
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
    console.log(" Driver token :", req.cookies.token);
    const { token } = req.cookies;
    if(!token) {
        return res.status(401).json({
            success: false,
            message: "No refresh token provided",
        });
    }
    try {
        console.log("Verifying token with secret:", process.env.JWT_REFRESH_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        console.log("Decoded ID:", decoded);
        const driver = await Driver.findById(decoded._id);
        console.log("Driver found:", driver);
        if (!driver) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const accessToken = jwt.sign({_id: decoded._id}, process.env.JWT_ACCESS_SECRET);
        return res.status(200).json({
            success: true,
            accessToken,
            user: driver
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid Refresh Token",
        });
    }
}

