import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statusCode = 200) => {
    const accessToken = jwt.sign({_id: user._id}, process.env.JWT_ACCESS_SECRET, {expiresIn :"1d" }   );
    const refreshToken = jwt.sign({_id: user._id}, process.env.JWT_REFRESH_SECRET,{ expiresIn: "7d"  }  );
    
    res.status(statusCode)
    .cookie("token", refreshToken, {
        httpOnly: true,
        maxAge:  7 * 24 * 15 * 60 * 1000,
        sameSite: process.env.NODE_ENV === 'Development' ? "lax": "none",
        secure: process.env.NODE_ENV === 'Development' ? false : true,
    })
    .json({
        success: true,
        accessToken,
        user: user
    });
};