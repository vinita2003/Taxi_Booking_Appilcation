import { Driver } from "../../../models/driver-register-model.js";

export const getAllDriverPersonalInformation = async(req, res, next) => {
    try {
        const driverPersonalInformation = await Driver.find({_id: req.user._id });
    if(!driverPersonalInformation){
        res.status(404).json({
            success: false,
            message : "Rider not found"
        })
    }
    res.status(404).json({
            success: false,
            driverPersonalInformation
        })
}catch(error){
    next(error)
}
}