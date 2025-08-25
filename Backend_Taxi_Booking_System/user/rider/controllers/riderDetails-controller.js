import { Rider } from "../../../models/rider-register-model.js";
import { RiderRideHistory } from "../../../models/rider-ride-history-model.js";

export const getAllRiderRideHistory = async(req, res, next) => {
    try {
        console.log("vinita");
        const rideHistory = await RiderRideHistory.find({rider: req.user._id });
        console.log("vinita")
        console.log(rideHistory)
    if(!rideHistory){
        res.status(404).json({
            success: false,
            message : "Ride History not avaible"
        })
    }
    res.status(200).json({
            success: true,
            rideHistory
        })
}catch(error){
    next(error)
}
}

export const getRiderPersonalInformation = async(req, res, next) => {
    try {
       
        const riderPersonalInformation = await Rider.find({_id: req.user._id });
         console.log("vinita")
        console.log(rideHistory)
    if(!riderPersonalInformation){
        res.status(404).json({
            success: false,
            message : "Rider not found"
        })
    }
    res.status(200).json({
            success: true,
            riderPersonalInformation
        })
}catch(error){
    next(error)
}
}