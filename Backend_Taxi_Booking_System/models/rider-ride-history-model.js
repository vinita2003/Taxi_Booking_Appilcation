import mongoose from "mongoose";

const schema = new mongoose.Schema({
    rider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rider",
        required: true
    },
    pickupLongitude : {
        type: Number,
        required: true,
    },

    pickupLatitude: {
        type: Number,
        required: true,
    },
    
    dropLongitude : {
        type: Number,
        required: true,
    },

    dropLatitude: {
        type: Number,
        required: true,
    },

carType: {
         type: String,
        enum: ["Sedan", "UV"],
        
    },
    distance: {
        type: Number
    },
    amount: {
        type: Number
    },
    time: {
        type: String
    },
    driverRating: {
        type: Number
    }

})

export const RiderRideHistory = mongoose.model("RiderRideHistory", schema)